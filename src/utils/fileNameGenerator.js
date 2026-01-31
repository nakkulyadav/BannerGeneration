/**
 * File Name Generator
 *
 * Generates clean file names for banner downloads.
 */

/**
 * Generate a clean filename from heading text
 * @param {string} heading - Heading text
 * @returns {string} Clean filename with .webp extension
 */
export function generateFileName(heading) {
  if (!heading || heading.trim() === '') {
    return 'banner.webp';
  }

  // Remove special characters (keep only alphanumeric and spaces)
  let clean = heading.replace(/[^a-zA-Z0-9\s]/g, '');

  // Replace multiple spaces with single space
  clean = clean.replace(/\s+/g, ' ').trim();

  // Replace spaces with underscores
  clean = clean.replace(/\s/g, '_');

  // Truncate to 40 characters
  if (clean.length > 40) {
    clean = clean.substring(0, 40);
    // Remove trailing underscore if present
    clean = clean.replace(/_$/, '');
  }

  // Handle edge case of empty string after cleaning
  if (clean === '') {
    return 'banner.webp';
  }

  return `${clean}.webp`;
}

export default generateFileName;
