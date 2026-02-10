/**
 * Text Tools Route
 *
 * API endpoints for text translation and spell checking:
 *   POST /api/translate    — Translate text between languages (MyMemory API)
 *   POST /api/spell-check  — Check spelling/grammar (LanguageTool API)
 *
 * Follows the same error-handling pattern as imageSearch.js — structured JSON
 * errors with appropriate HTTP status codes.
 *
 * @module routes/textTools
 */

import { Router } from 'express';
import { translateText } from '../services/translationService.js';
import { checkSpelling } from '../services/spellCheckService.js';

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/translate
// ---------------------------------------------------------------------------

/**
 * Translate text from one language to another
 *
 * Body:
 *   text       — Text to translate (required, max 500 chars)
 *   targetLang — Target language code, e.g. 'hi' (required)
 *   sourceLang — Source language code, e.g. 'en' (optional, defaults to 'en')
 *
 * Returns:
 *   { translatedText: string }
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required field: text',
        code: 'INVALID_INPUT',
      });
    }

    if (!targetLang || typeof targetLang !== 'string') {
      return res.status(400).json({
        error: 'Missing required field: targetLang',
        code: 'INVALID_INPUT',
      });
    }

    // -----------------------------------------------------------------------
    // Translate
    // -----------------------------------------------------------------------

    const translatedText = await translateText(text, sourceLang || 'en', targetLang);

    return res.json({ translatedText });

  } catch (error) {
    console.error('[translate route] Error:', error.message);

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || 'Translation failed. Please try again later.',
      code: statusCode === 429 ? 'RATE_LIMIT' : 'TRANSLATION_ERROR',
    });
  }
});

// ---------------------------------------------------------------------------
// POST /api/spell-check
// ---------------------------------------------------------------------------

/**
 * Check text for spelling, grammar, and style issues
 *
 * Body:
 *   text     — Text to check (required, max 500 chars)
 *   language — Language code, e.g. 'en-US' or 'auto' (optional, defaults to 'auto')
 *
 * Returns:
 *   { matches: Array<{ message, offset, length, replacements, rule }> }
 */
router.post('/spell-check', async (req, res) => {
  try {
    const { text, language } = req.body;

    // -----------------------------------------------------------------------
    // Validation
    // -----------------------------------------------------------------------

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Missing required field: text',
        code: 'INVALID_INPUT',
      });
    }

    // -----------------------------------------------------------------------
    // Spell check
    // -----------------------------------------------------------------------

    const matches = await checkSpelling(text, language || 'auto');

    return res.json({ matches });

  } catch (error) {
    console.error('[spell-check route] Error:', error.message);

    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      error: error.message || 'Spell check failed. Please try again later.',
      code: statusCode === 429 ? 'RATE_LIMIT' : 'SPELL_CHECK_ERROR',
    });
  }
});

export default router;
