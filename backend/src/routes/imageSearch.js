/**
 * Image Search Route
 *
 * Smart image search pipeline:
 *   1. Gemini rewrites the user query into optimized Pixabay search terms
 *   2. Pixabay returns up to 50 transparent-background images
 *   3. Gemini re-ranks results by relevance to the original query
 *
 * Falls back to raw Pixabay results if Gemini is unavailable.
 *
 * GET /api/search-images?q=<term>&field=<logo|product>
 */

import { Router } from 'express';
import axios from 'axios';
import { enhanceQuery, rankResults } from '../services/geminiService.js';

const router = Router();

const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

/**
 * GET /api/search-images
 *
 * Query params:
 *   q     — search term (required)
 *   field — "logo" | "product" (required, determines image size returned)
 */
router.get('/search-images', async (req, res) => {
  try {
    const { q, field } = req.query;

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Missing required query parameter: q' });
    }

    if (!field || !['logo', 'product'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field parameter. Must be "logo" or "product".' });
    }

    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey || apiKey === 'your_pixabay_api_key_here') {
      return res.status(500).json({ error: 'Pixabay API key is not configured.' });
    }

    // -----------------------------------------------------------------------
    // Step 1: Enhance query via Gemini (falls back to raw query on failure)
    // -----------------------------------------------------------------------

    const rawQuery = q.trim();
    const optimizedQuery = await enhanceQuery(rawQuery, field);

    console.log(`[search] raw: "${rawQuery}" → enhanced: "${optimizedQuery}"`);

    // -----------------------------------------------------------------------
    // Step 2: Pixabay API request — fetch up to 50 results
    // -----------------------------------------------------------------------

    const response = await axios.get(PIXABAY_BASE_URL, {
      params: {
        key: apiKey,
        q: optimizedQuery,
        image_type: 'photo',
        colors: 'transparent',
        per_page: 50,
        safesearch: true,
      },
    });

    // -----------------------------------------------------------------------
    // Normalize response — return only the data the frontend needs
    // -----------------------------------------------------------------------

    const images = (response.data.hits || []).map((hit) => ({
      id: hit.id,
      previewURL: hit.previewURL,
      // Logo: webformat (640px), Product: largeImageURL (1280px)
      downloadURL: field === 'logo' ? hit.webformatURL : hit.largeImageURL,
      tags: hit.tags,
      imageWidth: hit.imageWidth,
      imageHeight: hit.imageHeight,
    }));

    // -----------------------------------------------------------------------
    // Step 3: Re-rank results via Gemini (falls back to original order)
    // -----------------------------------------------------------------------

    const rankedImages = await rankResults(rawQuery, images);

    return res.json({ images: rankedImages, total: response.data.totalHits });
  } catch (error) {
    console.error('Image search error:', error.message);

    // Forward Pixabay rate-limit errors
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
    }

    return res.status(500).json({ error: 'Failed to fetch images. Please try again.' });
  }
});

export default router;
