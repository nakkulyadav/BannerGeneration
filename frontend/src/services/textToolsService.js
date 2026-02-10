/**
 * Text Tools Service
 *
 * Provides translation and spell-checking functionality via backend API endpoints.
 * Follows the same pattern as imageSearchService.js (fetch + structured error handling).
 *
 * @module services/textToolsService
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ---------------------------------------------------------------------------
// Translation
// ---------------------------------------------------------------------------

/**
 * Translate text from one language to another (through backend proxy)
 *
 * @param {string} text - Text to translate (max 500 chars)
 * @param {string} targetLang - Target language code (e.g. 'hi', 'bn')
 * @param {string} [sourceLang='en'] - Source language code
 * @returns {Promise<string>} Translated text
 *
 * @throws {Error} With .code and .status properties on failure
 *
 * @example
 * const translated = await translateText('Premium Earbuds', 'hi');
 * // => "प्रीमियम ईयरबड्स"
 */
export async function translateText(text, targetLang, sourceLang = 'en') {
  const response = await fetch(`${API_URL}/api/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang, sourceLang }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.error || 'Translation failed');
    error.code = data.code;
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.translatedText;
}

// ---------------------------------------------------------------------------
// Spell Check
// ---------------------------------------------------------------------------

/**
 * Check text for spelling, grammar, and style issues (through backend proxy)
 *
 * @param {string} text - Text to check (max 500 chars)
 * @param {string} [language='auto'] - Language code for checking (e.g. 'en-US', 'auto')
 * @returns {Promise<Array<{message: string, offset: number, length: number, replacements: string[], rule: {id: string, description: string}}>>}
 *
 * @throws {Error} With .code and .status properties on failure
 *
 * @example
 * const matches = await checkSpelling('Premimum wirless earbuds');
 * // => [{ message: "Possible spelling mistake", offset: 0, length: 8, replacements: ["Premium"], ... }]
 */
export async function checkSpelling(text, language = 'auto') {
  const response = await fetch(`${API_URL}/api/spell-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.error || 'Spell check failed');
    error.code = data.code;
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.matches;
}
