/**
 * Language Constants
 *
 * Supported Indian regional languages for the translation feature.
 * Each entry includes ISO code, English name, and native script name.
 *
 * @module constants/languages
 */

/**
 * Supported languages for text translation
 * Ordered: Hindi first (most common), then alphabetical by English name
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

/**
 * Default target language for translation (Hindi)
 */
export const DEFAULT_TARGET_LANGUAGE = 'hi';
