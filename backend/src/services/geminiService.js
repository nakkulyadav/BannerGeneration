/**
 * Gemini AI Service
 *
 * Provides two capabilities for the image search pipeline:
 *   1. enhanceQuery  — rewrites a raw user query into optimized Pixabay search terms
 *   2. rankResults   — re-ranks Pixabay results by relevance to the original query
 *
 * Both functions fail gracefully — if Gemini is unavailable the caller
 * can fall back to the raw query / unranked results.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;

/**
 * Lazily-initialized Gemini model instance.
 * Returns null when the API key is missing or is the placeholder value.
 */
function getModel() {
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

// ---------------------------------------------------------------------------
// Query Enhancement
// ---------------------------------------------------------------------------

/**
 * Rewrite a raw user query into an optimized Pixabay search string.
 *
 * @param {string} rawQuery  — the user's original search input
 * @param {'logo'|'product'} field — context: searching for a logo or product image
 * @returns {Promise<string>} optimized query string (or the raw query on failure)
 */
export async function enhanceQuery(rawQuery, field) {
  const model = getModel();
  if (!model) return rawQuery;

  const fieldContext =
    field === 'logo'
      ? 'a brand logo (clean, iconic, transparent background)'
      : 'a product image (clear product photo, transparent/white background)';

  const prompt = `You are a search-query optimizer for a stock image API (Pixabay).

The user is looking for ${fieldContext}.
Their raw search query is: "${rawQuery}"

Rewrite this into a single, concise search string that will return the most relevant results on Pixabay.
Rules:
- Return ONLY the optimized search string, nothing else.
- Keep it under 100 characters.
- Focus on the core subject — remove filler words.
- If the query mentions a specific brand, keep the brand name.
- Do NOT add quotes around the result.

Optimized query:`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Sanity check — if Gemini returns something unusable, fall back
    if (!text || text.length > 120) return rawQuery;

    return text;
  } catch (err) {
    console.error('Gemini enhanceQuery error:', err.message);
    return rawQuery;
  }
}

// ---------------------------------------------------------------------------
// Result Re-Ranking
// ---------------------------------------------------------------------------

/**
 * Re-rank an array of Pixabay image results by relevance to the original query.
 *
 * Sends image metadata (id + tags) to Gemini and asks it to return the IDs
 * ordered by relevance. Images not mentioned in Gemini's response are
 * appended at the end in their original order.
 *
 * @param {string} originalQuery — the user's original search input
 * @param {Array<{id: number, tags: string}>} images — Pixabay results
 * @returns {Promise<Array>} the same images array, re-ordered by relevance
 */
export async function rankResults(originalQuery, images) {
  const model = getModel();
  if (!model || images.length === 0) return images;

  // Build a compact representation for the prompt (id + tags only)
  const imageList = images
    .map((img) => `${img.id}: ${img.tags}`)
    .join('\n');

  const prompt = `You are an image relevance ranker.

The user searched for: "${originalQuery}"

Below are image search results. Each line is "id: tags".

${imageList}

Rank these images by how relevant they are to the user's search query.
Return ONLY a JSON array of the image IDs in order from most relevant to least relevant.
Example format: [123, 456, 789]

Ranked IDs:`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract the JSON array from the response
    const match = text.match(/\[[\s\S]*?\]/);
    if (!match) return images;

    const rankedIds = JSON.parse(match[0]);

    // Build a lookup map: id → image object
    const imageMap = new Map(images.map((img) => [img.id, img]));

    // Assemble re-ranked array; append any images Gemini missed at the end
    const ranked = [];
    const seen = new Set();

    for (const id of rankedIds) {
      const numId = Number(id);
      if (imageMap.has(numId) && !seen.has(numId)) {
        ranked.push(imageMap.get(numId));
        seen.add(numId);
      }
    }

    // Append any images not covered by Gemini (preserves original order)
    for (const img of images) {
      if (!seen.has(img.id)) {
        ranked.push(img);
      }
    }

    return ranked;
  } catch (err) {
    console.error('Gemini rankResults error:', err.message);
    return images;
  }
}
