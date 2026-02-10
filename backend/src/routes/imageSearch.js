/**
 * Image Search Route
 *
 * Image search pipeline:
 *   1. SerpAPI returns up to 50 image results (100 requested, 50 returned)
 *   2. Results are returned in relevance order from Google Images search
 *
 * GET /api/search-images?q=<term>&field=<logo|product>
 */

import { Router } from 'express';
import { searchImages } from '../services/serpApiService.js';
import { removeBackground as removeBgService } from '../services/backgroundRemovalService.js';
import { enhanceImage } from '../services/imageEnhancementService.js';

const router = Router();

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

    // -----------------------------------------------------------------------
    // Step 1: Google Image Search — fetch up to 50 PNG results
    // -----------------------------------------------------------------------

    const query = q.trim();
    console.log(`[search] query: "${query}"`);

    const images = await searchImages(query, field);

    if (images.length === 0) {
      return res.json({ images: [], total: 0, message: 'No images found for your query.' });
    }

    // -----------------------------------------------------------------------
    // Step 2: Normalize response — convert Google format to expected frontend format
    // -----------------------------------------------------------------------

    const normalizedImages = images.map((img) => ({
      id: img.id,
      previewURL: img.previewURL, // Thumbnail for grid
      downloadURL: img.fullURL,    // Full-size image URL
      tags: img.title,             // Use title as tags
      imageWidth: img.width,
      imageHeight: img.height,
    }));

    return res.json({ images: normalizedImages, total: normalizedImages.length });

  } catch (error) {
    console.error('Image search error:', error.message);

    // Forward SerpAPI errors with helpful messages
    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'SerpAPI rate limit exceeded (100 searches/month). Please try again later.'
      });
    }

    if (error.message.includes('API key') || error.message.includes('credentials')) {
      return res.status(500).json({
        error: 'SerpAPI configuration error. Please check server logs.'
      });
    }

    if (error.message.includes('denied') || error.message.includes('403') || error.message.includes('401')) {
      return res.status(403).json({
        error: 'SerpAPI access denied. Please verify API key is valid.'
      });
    }

    return res.status(500).json({
      error: 'Failed to fetch images. Please try again later.'
    });
  }
});

/**
 * POST /api/remove-background
 *
 * Remove background from an image using remove.bg API
 *
 * Body (one of):
 *   imageUrl    — Public URL of the image to process
 *   imageBase64 — Base64 data URL from device uploads (data:image/...;base64,...)
 *
 * Returns:
 *   { processedImageUrl: string } — Base64 data URL of processed image
 */
router.post('/remove-background', async (req, res) => {
  try {
    const { imageUrl, imageBase64 } = req.body;

    // -----------------------------------------------------------------------
    // Validation — accept either a URL or a base64 data URL
    // -----------------------------------------------------------------------

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({
        error: 'Missing required parameter: imageUrl or imageBase64.'
      });
    }

    if (imageUrl) {
      if (typeof imageUrl !== 'string' || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
        return res.status(400).json({
          error: 'Invalid imageUrl. Must be a valid HTTP/HTTPS URL.'
        });
      }
    }

    if (imageBase64) {
      if (typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:')) {
        return res.status(400).json({
          error: 'Invalid imageBase64. Must be a valid data URL (data:image/...;base64,...).'
        });
      }
    }

    // -----------------------------------------------------------------------
    // Process image with remove.bg (URL or base64)
    // -----------------------------------------------------------------------

    const source = imageBase64 || imageUrl;
    console.log('[remove-background] Processing:', imageBase64 ? 'base64 data URL' : imageUrl);

    const processedImageUrl = await removeBgService(source);

    console.log('[remove-background] Success');

    return res.json({
      processedImageUrl,
      message: 'Background removed successfully'
    });

  } catch (error) {
    console.error('[remove-background] Error:', error.message);

    // Handle specific remove.bg errors with helpful messages
    if (error.message.includes('free tier exhausted') || error.message.includes('402')) {
      return res.status(402).json({
        error: 'Remove.bg free tier limit reached (50/month). Please upgrade your account or try again next month.',
        code: 'FREE_TIER_EXHAUSTED'
      });
    }

    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment and try again.',
        code: 'RATE_LIMIT'
      });
    }

    if (error.message.includes('API key') || error.message.includes('not configured')) {
      return res.status(500).json({
        error: 'Background removal service is not configured. Please contact support.',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    if (error.message.includes('access denied') || error.message.includes('403')) {
      return res.status(403).json({
        error: 'Background removal service access denied. Please contact support.',
        code: 'ACCESS_DENIED'
      });
    }

    if (error.message.includes('Invalid image') || error.message.includes('400')) {
      return res.status(400).json({
        error: 'Invalid image. The image may be corrupted, too large, or in an unsupported format.',
        code: 'INVALID_IMAGE'
      });
    }

    if (error.message.includes('timed out')) {
      return res.status(504).json({
        error: 'Background removal timed out. The image may be too large.',
        code: 'TIMEOUT'
      });
    }

    // Generic error
    return res.status(500).json({
      error: 'Failed to remove background. Please try again later.',
      code: 'UNKNOWN_ERROR'
    });
  }
});

/**
 * POST /api/enhance-image
 *
 * Enhance image quality using Cloudinary AI transformations
 *
 * Body (one of):
 *   imageUrl    — Public URL of the image to enhance
 *   imageBase64 — Base64 data URL from device uploads (data:image/...;base64,...)
 *   field       — "logo" | "product" (required, determines enhancement parameters)
 *
 * Returns:
 *   { enhancedImageUrl: string, message: string } — Enhanced image URL from Cloudinary CDN
 */
router.post('/enhance-image', async (req, res) => {
  try {
    const { imageUrl, imageBase64, field } = req.body;

    // -----------------------------------------------------------------------
    // Validation — accept either a URL or a base64 data URL
    // -----------------------------------------------------------------------

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({
        error: 'Missing required parameter: imageUrl or imageBase64.',
        code: 'INVALID_IMAGE'
      });
    }

    if (imageUrl) {
      if (typeof imageUrl !== 'string' || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
        return res.status(400).json({
          error: 'Invalid imageUrl. Must be a valid HTTP/HTTPS URL.',
          code: 'INVALID_IMAGE'
        });
      }
    }

    if (imageBase64) {
      if (typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:')) {
        return res.status(400).json({
          error: 'Invalid imageBase64. Must be a valid data URL (data:image/...;base64,...).',
          code: 'INVALID_IMAGE'
        });
      }
    }

    if (!field || !['logo', 'product'].includes(field)) {
      return res.status(400).json({
        error: 'Invalid field parameter. Must be "logo" or "product".',
        code: 'INVALID_FIELD'
      });
    }

    // -----------------------------------------------------------------------
    // Enhance image using Cloudinary (URL or base64)
    // -----------------------------------------------------------------------

    const source = imageBase64 || imageUrl;
    console.log('[enhance-image] Processing:', imageBase64 ? 'base64 data URL' : imageUrl, 'Field:', field);

    const result = await enhanceImage(source, field);

    console.log('[enhance-image] Success:', result.enhancedImageUrl);

    return res.json({
      enhancedImageUrl: result.enhancedImageUrl,
      message: result.message
    });

  } catch (error) {
    console.error('[enhance-image] Error:', error.message);

    // Handle specific enhancement errors with helpful messages
    if (error.code === 'FREE_TIER_EXHAUSTED' || error.statusCode === 402) {
      return res.status(402).json({
        error: error.message || 'Cloudinary free tier limit reached (25/month). Please upgrade or try next month.',
        code: 'FREE_TIER_EXHAUSTED'
      });
    }

    if (error.code === 'RATE_LIMIT' || error.statusCode === 429) {
      return res.status(429).json({
        error: error.message || 'Rate limit exceeded. Please wait a moment and try again.',
        code: 'RATE_LIMIT'
      });
    }

    if (error.code === 'TIMEOUT' || error.statusCode === 504) {
      return res.status(504).json({
        error: error.message || 'Enhancement timed out. The image may be too large or complex.',
        code: 'TIMEOUT'
      });
    }

    if (error.code === 'AUTH_FAILED' || error.statusCode === 403) {
      return res.status(403).json({
        error: 'Image enhancement service credentials are invalid. Please contact support.',
        code: 'AUTH_FAILED'
      });
    }

    if (error.code === 'INVALID_IMAGE' || error.statusCode === 400) {
      return res.status(400).json({
        error: error.message || 'Invalid image. The image may be corrupted or in an unsupported format.',
        code: 'INVALID_IMAGE'
      });
    }

    if (error.code === 'MISSING_CREDENTIALS') {
      return res.status(500).json({
        error: 'Image enhancement service is not configured. Please contact support.',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    // Generic error
    return res.status(500).json({
      error: 'Failed to enhance image. Please try again later.',
      code: 'UNKNOWN_ERROR',
      details: error.originalError || error.message
    });
  }
});

export default router;
