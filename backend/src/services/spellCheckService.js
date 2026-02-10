/**
 * Spell Check Service
 *
 * Wraps the free LanguageTool public API for spelling, grammar, and style checking.
 * Returns normalized match objects with error details and replacement suggestions.
 *
 * API docs: https://languagetool.org/http-api/
 * Free tier: ~20 requests/min (public endpoint, no API key required)
 *
 * @module services/spellCheckService
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LANGUAGETOOL_API_URL = 'https://api.languagetool.org/v2/check';

/** Maximum input text length (chars) */
const MAX_TEXT_LENGTH = 500;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Validate spell check request parameters
 *
 * @param {string} text - Text to check
 * @param {string} language - Language code (e.g. 'en-US', 'auto')
 * @throws {Error} If validation fails
 */
function validateInput(text, language) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    const err = new Error('Text is required and must be a non-empty string.');
    err.statusCode = 400;
    throw err;
  }

  if (text.length > MAX_TEXT_LENGTH) {
    const err = new Error(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters.`);
    err.statusCode = 400;
    throw err;
  }

  if (language && typeof language !== 'string') {
    const err = new Error('Language must be a string (e.g. "en-US", "auto").');
    err.statusCode = 400;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Check text for spelling, grammar, and style issues using LanguageTool API
 *
 * @param {string} text - Text to check (max 500 chars)
 * @param {string} [language='auto'] - Language code ('en-US', 'auto', etc.)
 * @returns {Promise<Array<{message: string, offset: number, length: number, replacements: string[], rule: {id: string, description: string}}>>}
 *   Array of normalized match objects
 *
 * @throws {Error} 400 — Invalid input
 * @throws {Error} 429 — Rate limit exceeded
 * @throws {Error} 500 — API failure
 *
 * @example
 * const matches = await checkSpelling('Premimum wirless earbuds');
 * // => [{ message: "Possible spelling mistake", offset: 0, length: 8, replacements: ["Premium"], ... }]
 */
export async function checkSpelling(text, language = 'auto') {
  validateInput(text, language);

  // LanguageTool expects application/x-www-form-urlencoded body
  const formData = new URLSearchParams();
  formData.append('text', text.trim());
  formData.append('language', language);

  try {
    console.log(`[spell-check] Checking: "${text}" (lang: ${language})`);

    const response = await axios.post(LANGUAGETOOL_API_URL, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10000,
    });

    // Normalize matches to a clean, consistent shape
    const matches = (response.data?.matches || []).map((match) => ({
      message: match.message,
      offset: match.offset,
      length: match.length,
      replacements: (match.replacements || []).slice(0, 5).map((r) => r.value),
      rule: {
        id: match.rule?.id || 'UNKNOWN',
        description: match.rule?.description || '',
      },
    }));

    console.log(`[spell-check] Found ${matches.length} issue(s)`);
    return matches;

  } catch (error) {
    // Re-throw validation errors as-is
    if (error.statusCode) throw error;

    // Handle rate limiting (LanguageTool returns 429 at ~20 req/min)
    if (error.response?.status === 429) {
      const err = new Error('LanguageTool rate limit exceeded (20 req/min). Please wait and try again.');
      err.statusCode = 429;
      throw err;
    }

    // Handle network / timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      const err = new Error('Spell check request timed out. Please try again.');
      err.statusCode = 504;
      throw err;
    }

    // Generic failure
    console.error('[spell-check] Error:', error.message);
    const err = new Error('Spell check failed. Please try again later.');
    err.statusCode = 500;
    throw err;
  }
}
