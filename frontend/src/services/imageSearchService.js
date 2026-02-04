/**
 * Image Search Service
 *
 * Provides image search, background removal, and image enhancement functionality
 * via backend API endpoints.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Search for images via Google Custom Search (through backend proxy)
 *
 * @param {string} query - Search term
 * @param {'logo'|'product'} field - Which field the search is for
 * @returns {Promise<{images: Array, total: number}>}
 *
 * @throws {Error} If search fails or API returns an error
 */
export async function searchImages(query, field) {
  const params = new URLSearchParams({ q: query, field });
  const response = await fetch(`${API_URL}/api/search-images?${params}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to search images');
  }

  return response.json();
}

/**
 * Remove background from an image using remove.bg API (through backend proxy)
 *
 * @param {string} imageUrl - URL of the image to process
 * @returns {Promise<{processedImageUrl: string, message: string}>}
 *
 * @throws {Error} If background removal fails, rate limit exceeded, or free tier exhausted
 *
 * @example
 * try {
 *   const result = await removeBackground('https://example.com/image.jpg');
 *   console.log('Processed image:', result.processedImageUrl);
 * } catch (error) {
 *   console.error('Failed to remove background:', error.message);
 * }
 */
export async function removeBackground(imageUrl) {
  const response = await fetch(`${API_URL}/api/remove-background`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    // Extract error message and code
    const errorMessage = data.error || 'Failed to remove background';
    const errorCode = data.code;

    // Create enhanced error with code for better handling
    const error = new Error(errorMessage);
    error.code = errorCode;
    error.status = response.status;

    throw error;
  }

  return response.json();
}

/**
 * Enhance image quality using Cloudinary AI transformations (through backend proxy)
 *
 * @param {string} imageUrl - URL of the image to enhance
 * @param {'logo'|'product'} field - Which field the image is for (determines enhancement parameters)
 * @returns {Promise<{enhancedImageUrl: string, message: string}>}
 *
 * @throws {Error} If enhancement fails, rate limit exceeded, or free tier exhausted
 *
 * @example
 * try {
 *   const result = await enhanceImage('https://example.com/image.jpg', 'logo');
 *   console.log('Enhanced image:', result.enhancedImageUrl);
 * } catch (error) {
 *   if (error.code === 'FREE_TIER_EXHAUSTED') {
 *     console.error('Cloudinary free tier limit reached');
 *   } else {
 *     console.error('Failed to enhance image:', error.message);
 *   }
 * }
 */
export async function enhanceImage(imageUrl, field) {
  const response = await fetch(`${API_URL}/api/enhance-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl, field }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    // Extract error message and code
    const errorMessage = data.error || 'Failed to enhance image';
    const errorCode = data.code;

    // Create enhanced error with code for better handling
    const error = new Error(errorMessage);
    error.code = errorCode;
    error.status = response.status;

    throw error;
  }

  return response.json();
}
