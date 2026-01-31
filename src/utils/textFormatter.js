/**
 * Text Formatting Utilities
 *
 * Functions for formatting text elements in the banner.
 */

import { TEXT } from '../constants/bannerConfig';

/**
 * Format subheading text with optional rupee prefix
 * @param {string} text - Raw text input
 * @param {boolean} hasRupee - Whether to add rupee prefix
 * @returns {string} Formatted text
 */
export function formatSubheadingText(text, hasRupee) {
  if (!text || text.trim() === '') {
    return '';
  }

  if (hasRupee) {
    return `${TEXT.SUBHEADING.RUPEE_PREFIX}${text.trim()}`;
  }

  return text.trim();
}

/**
 * Wrap text to fit within max width (rough estimation)
 * @param {string} text - Text to wrap
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} fontSize - Font size in pixels
 * @param {number} maxLines - Maximum number of lines
 * @returns {string} Text with line breaks
 */
export function wrapText(text, maxWidth, fontSize, maxLines = 2) {
  // Rough estimate: average character width is ~0.5 * fontSize for most fonts
  const avgCharWidth = fontSize * 0.5;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= charsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;

      // Stop if we've reached max lines
      if (lines.length >= maxLines) {
        break;
      }
    }
  }

  // Add the last line
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}

/**
 * Calculate estimated text height
 * @param {string} text - Text content
 * @param {number} fontSize - Font size in pixels
 * @param {number} lineHeight - Line height multiplier
 * @param {number} maxWidth - Maximum width for wrapping
 * @returns {number} Estimated height in pixels
 */
export function calculateTextHeight(text, fontSize, lineHeight, maxWidth) {
  // Count actual lines in wrapped text
  const wrapped = wrapText(text, maxWidth, fontSize);
  const lines = wrapped.split('\n').length;

  return fontSize * lineHeight * lines;
}

export default {
  formatSubheadingText,
  wrapText,
  calculateTextHeight,
};
