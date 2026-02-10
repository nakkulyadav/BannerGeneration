/**
 * Translation Service
 *
 * Wraps the free MyMemory Translation API to translate text between languages.
 * Used primarily for translating banner text into Indian regional languages.
 *
 * API docs: https://mymemory.translated.net/doc/spec.php
 * Free tier: 5K chars/day (50K with email via MYMEMORY_EMAIL env var)
 *
 * @module services/translationService
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

/** Maximum input text length (chars) */
const MAX_TEXT_LENGTH = 500;

/** Valid ISO language codes supported by the app */
const VALID_LANGUAGE_CODES = [
  'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'en',
];

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Validate translation request parameters
 *
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @param {string} [sourceLang] - Source language code (optional, auto-detected)
 * @throws {Error} If validation fails
 */
function validateInput(text, targetLang, sourceLang) {
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

  if (!targetLang || !VALID_LANGUAGE_CODES.includes(targetLang)) {
    const err = new Error(
      `Invalid target language "${targetLang}". Supported: ${VALID_LANGUAGE_CODES.join(', ')}`
    );
    err.statusCode = 400;
    throw err;
  }

  if (sourceLang && !VALID_LANGUAGE_CODES.includes(sourceLang)) {
    const err = new Error(
      `Invalid source language "${sourceLang}". Supported: ${VALID_LANGUAGE_CODES.join(', ')}`
    );
    err.statusCode = 400;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Translate text from one language to another using MyMemory API
 *
 * @param {string} text - Text to translate (max 500 chars)
 * @param {string} sourceLang - Source language code (e.g. 'en')
 * @param {string} targetLang - Target language code (e.g. 'hi')
 * @returns {Promise<string>} Translated text
 *
 * @throws {Error} 400 — Invalid input
 * @throws {Error} 429 — Rate limit exceeded
 * @throws {Error} 500 — API failure / unexpected response
 *
 * @example
 * const translated = await translateText('Premium Earbuds', 'en', 'hi');
 * // => "प्रीमियम ईयरबड्स"
 */
export async function translateText(text, sourceLang = 'en', targetLang) {
  validateInput(text, targetLang, sourceLang);

  // Build query parameters
  const params = {
    q: text.trim(),
    langpair: `${sourceLang}|${targetLang}`,
  };

  // Optionally attach email for higher quota (5K → 50K chars/day)
  if (process.env.MYMEMORY_EMAIL) {
    params.de = process.env.MYMEMORY_EMAIL;
  }

  try {
    console.log(`[translate] "${text}" (${sourceLang} → ${targetLang})`);

    const response = await axios.get(MYMEMORY_API_URL, { params, timeout: 10000 });

    // Validate response shape
    if (!response.data?.responseData?.translatedText) {
      throw new Error('Unexpected API response shape — missing translatedText field.');
    }

    const translatedText = response.data.responseData.translatedText;

    console.log(`[translate] Result: "${translatedText}"`);
    return translatedText;

  } catch (error) {
    // Re-throw validation errors as-is
    if (error.statusCode) throw error;

    // Handle rate limiting
    if (error.response?.status === 429) {
      const err = new Error('MyMemory rate limit exceeded. Please try again later.');
      err.statusCode = 429;
      throw err;
    }

    // Handle network / timeout errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      const err = new Error('Translation request timed out. Please try again.');
      err.statusCode = 504;
      throw err;
    }

    // Generic failure
    console.error('[translate] Error:', error.message);
    const err = new Error('Translation failed. Please try again later.');
    err.statusCode = 500;
    throw err;
  }
}
