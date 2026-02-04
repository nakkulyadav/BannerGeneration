/**
 * SerpAPI Image Search Service
 *
 * Uses SerpAPI Google Images engine to search for images.
 * Returns high-quality results with better reliability than Google Custom Search API.
 *
 * Free tier: 100 searches per month
 * Get your API key at: https://serpapi.com
 */

import axios from 'axios';

/**
 * Search for images using SerpAPI Google Images engine
 *
 * @param {string} query - Search term (e.g., "burger king logo", "red shoes")
 * @param {string} field - Target field: 'logo' or 'product'
 * @returns {Promise<Array>} Array of image results with normalized format
 *
 * @example
 * const results = await searchImages('nike logo', 'logo');
 * // Returns: [{ id, previewURL, fullURL, title, width, height }, ...]
 */
async function searchImages(query, field) {
  const apiKey = process.env.SERPAPI_KEY;

  // Validate environment variables
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    throw new Error(
      'Missing SerpAPI credentials. Please set SERPAPI_KEY in .env. Get your free key at https://serpapi.com'
    );
  }

  try {
    console.log(`[SerpAPI] Searching for: "${query}" (field: ${field})`);

    // Make API request to SerpAPI
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_images',
        q: query,
        api_key: apiKey,
        num: 100, // Request 100 results (SerpAPI default max per page)
      },
      timeout: 15000, // 15 second timeout
    });

    // Extract and normalize results
    const imagesResults = response.data.images_results || [];

    if (imagesResults.length === 0) {
      console.log('[SerpAPI] No results found');
      return [];
    }

    console.log(`[SerpAPI] Found ${imagesResults.length} results`);

    // Normalize results to match frontend expectations
    const normalizedResults = imagesResults.map((item, index) => ({
      id: `serpapi_${index}_${Date.now()}`,
      previewURL: item.thumbnail, // Thumbnail for grid display
      fullURL: item.original, // Full-size image URL
      title: item.title || 'Untitled',
      width: item.original_width || 0,
      height: item.original_height || 0,
    }));

    // Return first 50 results for consistency with UI grid (10×5)
    return normalizedResults.slice(0, 50);

  } catch (error) {
    // Handle specific SerpAPI errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || 'Unknown error';

      if (status === 401 || status === 403) {
        throw new Error('SerpAPI access denied. Please check your API key is valid and active.');
      } else if (status === 429) {
        throw new Error('SerpAPI rate limit exceeded. Please try again later. (100 searches/month on free tier)');
      } else if (status === 400) {
        throw new Error(`Invalid search query: ${message}`);
      } else {
        throw new Error(`SerpAPI error (${status}): ${message}`);
      }
    }

    // Network or timeout errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Search timed out after 15 seconds. Please try again.');
    }

    // Generic error
    throw new Error(`Failed to search images: ${error.message}`);
  }
}

/**
 * Get recommended image size for a specific field
 *
 * @param {string} field - 'logo' or 'product'
 * @returns {object} Recommended minimum dimensions
 */
function getRecommendedSize(field) {
  const sizes = {
    logo: {
      minWidth: 200,
      minHeight: 60,
      description: 'Logo images should be at least 200×60px for quality',
    },
    product: {
      minWidth: 361,
      minHeight: 312,
      description: 'Product images should be at least 361×312px for quality',
    },
  };

  return sizes[field] || sizes.product;
}

export {
  searchImages,
  getRecommendedSize,
};
