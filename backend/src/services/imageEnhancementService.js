/**
 * Image Enhancement Service
 *
 * Enhances images using Cloudinary's AI-powered transformation API.
 * Supports upscaling, sharpening, and noise reduction.
 *
 * @module imageEnhancementService
 */

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Enhances an image using Cloudinary's AI-powered transformations
 *
 * Supports two input modes:
 * - HTTP/HTTPS URL: Cloudinary fetches the image from the URL
 * - Base64 data URL: Cloudinary accepts data URLs natively for upload
 *
 * @param {string} imageSource - URL or base64 data URL (data:image/...;base64,...)
 * @param {string} field - The field type ('logo' | 'product') for field-specific enhancement
 * @returns {Promise<{enhancedImageUrl: string, message: string}>} - Enhanced image URL and success message
 * @throws {Error} - Throws error with specific code for different failure scenarios
 */
export async function enhanceImage(imageSource, field) {
  // Validate inputs — accept both HTTP URLs and base64 data URLs
  if (!imageSource || typeof imageSource !== 'string') {
    const error = new Error('Invalid image source provided');
    error.code = 'INVALID_IMAGE';
    error.statusCode = 400;
    throw error;
  }

  if (!field || !['logo', 'product'].includes(field)) {
    const error = new Error('Invalid field. Must be "logo" or "product"');
    error.code = 'INVALID_FIELD';
    error.statusCode = 400;
    throw error;
  }

  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    const error = new Error('Cloudinary credentials not configured');
    error.code = 'MISSING_CREDENTIALS';
    error.statusCode = 500;
    throw error;
  }

  try {
    const isBase64 = imageSource.startsWith('data:');
    console.log(`[Image Enhancement] Starting enhancement for ${field} image: ${isBase64 ? 'base64 data URL' : imageSource}`);

    // Field-specific enhancement parameters
    const transformations = getEnhancementTransformations(field);

    // Upload image to Cloudinary with transformations
    // Cloudinary accepts both HTTP URLs and base64 data URLs natively
    const uploadResult = await cloudinary.uploader.upload(imageSource, {
      folder: `banner-generator/${field}`,
      transformation: transformations,
      resource_type: 'image',
      timeout: 30000, // 30 second timeout
    });

    console.log(`[Image Enhancement] Successfully enhanced ${field} image`);

    return {
      enhancedImageUrl: uploadResult.secure_url,
      message: 'Image enhanced successfully',
    };
  } catch (error) {
    console.error('[Image Enhancement] Error:', error);

    // Handle specific Cloudinary errors
    if (error.http_code === 401 || error.http_code === 403) {
      const authError = new Error('Invalid Cloudinary credentials');
      authError.code = 'AUTH_FAILED';
      authError.statusCode = 403;
      throw authError;
    }

    if (error.http_code === 402) {
      const quotaError = new Error('Cloudinary free tier limit reached (25/month). Please upgrade or try next month.');
      quotaError.code = 'FREE_TIER_EXHAUSTED';
      quotaError.statusCode = 402;
      throw quotaError;
    }

    if (error.http_code === 429) {
      const rateLimitError = new Error('Rate limit exceeded. Please wait a moment and try again.');
      rateLimitError.code = 'RATE_LIMIT';
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }

    if (error.message && error.message.includes('timeout')) {
      const timeoutError = new Error('Enhancement timed out. The image may be too large or complex.');
      timeoutError.code = 'TIMEOUT';
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    if (error.message && (error.message.includes('Invalid image') || error.message.includes('unsupported'))) {
      const invalidError = new Error('Invalid image. The image may be corrupted or in an unsupported format.');
      invalidError.code = 'INVALID_IMAGE';
      invalidError.statusCode = 400;
      throw invalidError;
    }

    // Generic error fallback
    const genericError = new Error('Failed to enhance image. Please try again later.');
    genericError.code = 'ENHANCEMENT_FAILED';
    genericError.statusCode = 500;
    genericError.originalError = error.message;
    throw genericError;
  }
}

/**
 * Get field-specific enhancement transformations
 *
 * @param {string} field - The field type ('logo' | 'product')
 * @returns {Array} - Array of Cloudinary transformation objects
 *
 * @private
 */
function getEnhancementTransformations(field) {
  const baseTransformations = [
    // AI-powered auto enhancement (improve colors, contrast, lighting)
    { effect: 'improve' },

    // Auto-optimize quality
    { quality: 'auto:best' },

    // Sharpen image for better clarity
    { effect: 'sharpen' },
  ];

  if (field === 'logo') {
    // For logos: moderate enhancement to preserve brand colors
    // Maintain aspect ratio and transparency
    return [
      ...baseTransformations,
      { effect: 'improve:outdoor' }, // Better color preservation
      { flags: 'preserve_transparency' }, // Keep transparent backgrounds
    ];
  } else if (field === 'product') {
    // For products: aggressive enhancement for maximum clarity
    // Emphasize product details
    return [
      ...baseTransformations,
      { effect: 'improve:50' }, // Better for product photography
      { effect: 'sharpen:30' }, // Strong sharpening for product details
      { flags: 'preserve_transparency' }, // Keep transparent backgrounds if present
    ];
  }

  return baseTransformations;
}

export default { enhanceImage };
