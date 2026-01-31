/**
 * Image Processing Utilities
 *
 * Functions for loading and scaling images.
 */

/**
 * Load an image from URL
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));

    img.src = url;
  });
}

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original image width
 * @param {number} originalHeight - Original image height
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @returns {{width: number, height: number}} Scaled dimensions
 */
export function scaleImage(originalWidth, originalHeight, maxWidth, maxHeight) {
  // If image fits within bounds, return original dimensions
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  // Calculate scale factors
  const widthRatio = maxWidth / originalWidth;
  const heightRatio = maxHeight / originalHeight;

  // Use the smaller ratio to ensure image fits within both constraints
  const scale = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  };
}

/**
 * Get image dimensions from URL
 * @param {string} url - Image URL
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(url) {
  const img = await loadImage(url);
  return {
    width: img.width,
    height: img.height,
  };
}

export default {
  loadImage,
  scaleImage,
  getImageDimensions,
};
