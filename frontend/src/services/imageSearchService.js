/**
 * Image Search Service
 *
 * Calls the backend /api/search-images endpoint
 * to search Pixabay for transparent-background images.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Search for images via the backend proxy
 * @param {string} query - Search term
 * @param {'logo'|'product'} field - Which field the search is for
 * @returns {Promise<{images: Array, total: number}>}
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
