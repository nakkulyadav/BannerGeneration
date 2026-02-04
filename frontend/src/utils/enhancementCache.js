/**
 * Enhancement Cache Utility
 *
 * Manages localStorage caching for enhanced images to prevent re-processing
 * the same images multiple times.
 */

const CACHE_KEY = 'banner_enhanced_images';
const MAX_CACHE_SIZE = 50; // Maximum number of cached enhanced images

/**
 * Generate cache key for an image
 * Combines original URL and field to create a unique identifier
 *
 * @param {string} originalUrl - Original image URL
 * @param {string} field - Field type ('logo' or 'product')
 * @returns {string} - Cache key
 * @private
 */
function getCacheKey(originalUrl, field) {
  return `${originalUrl}|${field}`;
}

/**
 * Get the enhancement cache from localStorage
 * Returns an empty object if cache doesn't exist or is corrupted
 *
 * @returns {Object} - Cache object with format { [cacheKey]: enhancedUrl }
 * @private
 */
function getCache() {
  try {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    if (!cacheStr) return {};

    const cache = JSON.parse(cacheStr);
    return typeof cache === 'object' && cache !== null ? cache : {};
  } catch (error) {
    console.warn('[Enhancement Cache] Failed to read cache:', error);
    return {};
  }
}

/**
 * Save the enhancement cache to localStorage
 * Handles quota exceeded errors gracefully
 *
 * @param {Object} cache - Cache object to save
 * @private
 */
function setCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    // Handle localStorage quota exceeded or disabled
    if (error.name === 'QuotaExceededError') {
      console.warn('[Enhancement Cache] localStorage quota exceeded, clearing cache');
      // Clear cache and try again
      localStorage.removeItem(CACHE_KEY);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch (retryError) {
        console.error('[Enhancement Cache] Failed to save cache even after clearing');
      }
    } else {
      console.warn('[Enhancement Cache] Failed to save cache:', error);
    }
  }
}

/**
 * Save an enhanced image to the cache
 * If cache exceeds MAX_CACHE_SIZE, removes the oldest entry
 *
 * @param {string} originalUrl - Original image URL
 * @param {string} enhancedUrl - Enhanced image URL (from Cloudinary)
 * @param {string} field - Field type ('logo' or 'product')
 *
 * @example
 * saveEnhancedImage('https://example.com/logo.png', 'https://cloudinary.com/enhanced.png', 'logo');
 */
export function saveEnhancedImage(originalUrl, enhancedUrl, field) {
  const cache = getCache();
  const key = getCacheKey(originalUrl, field);

  // Add timestamp for potential future cleanup based on age
  cache[key] = {
    enhancedUrl,
    timestamp: Date.now(),
  };

  // Enforce max cache size (FIFO - remove oldest entries)
  const entries = Object.entries(cache);
  if (entries.length > MAX_CACHE_SIZE) {
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest entries until we're under the limit
    const entriesToRemove = entries.length - MAX_CACHE_SIZE;
    for (let i = 0; i < entriesToRemove; i++) {
      delete cache[entries[i][0]];
    }

    console.log(`[Enhancement Cache] Removed ${entriesToRemove} old entries to stay under ${MAX_CACHE_SIZE} limit`);
  }

  setCache(cache);
  console.log('[Enhancement Cache] Saved enhanced image:', key);
}

/**
 * Get an enhanced image URL from the cache
 * Returns null if not found
 *
 * @param {string} originalUrl - Original image URL
 * @param {string} field - Field type ('logo' or 'product')
 * @returns {string|null} - Enhanced image URL or null if not cached
 *
 * @example
 * const enhancedUrl = getEnhancedImage('https://example.com/logo.png', 'logo');
 * if (enhancedUrl) {
 *   console.log('Found cached enhanced image:', enhancedUrl);
 * }
 */
export function getEnhancedImage(originalUrl, field) {
  const cache = getCache();
  const key = getCacheKey(originalUrl, field);
  const entry = cache[key];

  if (entry && entry.enhancedUrl) {
    console.log('[Enhancement Cache] Found cached enhanced image:', key);
    return entry.enhancedUrl;
  }

  return null;
}

/**
 * Check if an image URL is already enhanced (exists in cache)
 * Useful for disabling the enhance button if image is already enhanced
 *
 * @param {string} imageUrl - Image URL to check (could be original or enhanced)
 * @param {string} field - Field type ('logo' or 'product')
 * @returns {boolean} - True if image is already enhanced
 *
 * @example
 * if (isImageEnhanced(brandLogo.imageUrl, 'logo')) {
 *   // Disable enhance button
 * }
 */
export function isImageEnhanced(imageUrl, field) {
  const cache = getCache();

  // Check if this URL is a cached enhanced URL
  const entries = Object.values(cache);
  for (const entry of entries) {
    if (entry.enhancedUrl === imageUrl) {
      return true;
    }
  }

  // Check if this URL has a cached enhanced version
  const key = getCacheKey(imageUrl, field);
  return !!cache[key];
}

/**
 * Clear the entire enhancement cache
 * Useful for debugging or manual cache reset
 *
 * @example
 * clearCache(); // Clear all cached enhanced images
 */
export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('[Enhancement Cache] Cache cleared');
  } catch (error) {
    console.warn('[Enhancement Cache] Failed to clear cache:', error);
  }
}

export default {
  saveEnhancedImage,
  getEnhancedImage,
  isImageEnhanced,
  clearCache,
};
