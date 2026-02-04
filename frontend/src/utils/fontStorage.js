/**
 * Font Storage Utility
 *
 * Manages persistence of font/weight preferences to localStorage.
 * Settings are saved per field and persist across browser sessions.
 */

// LocalStorage key for font settings
const STORAGE_KEY = 'bannerFontSettings';

/**
 * Font settings structure (flat format for simplicity)
 * @typedef {Object} FontSettings
 * @property {string} headingFont - Font family for heading
 * @property {number} headingWeight - Font weight for heading
 * @property {string} subheadingFont - Font family for subheading (shared across modes)
 * @property {number} subheadingWeightLeft - Font weight for split left subheading
 * @property {number} subheadingWeightRight - Font weight for split right subheading
 * @property {number} subheadingWeightSingle - Font weight for non-split subheading
 * @property {string} ctaButtonFont - Font family for CTA button
 * @property {number} ctaButtonWeight - Font weight for CTA button
 * @property {string} tcTextFont - Font family for T&C text
 * @property {number} tcTextWeight - Font weight for T&C text
 * @property {string} offerBadgeFont - Font family for offer badge
 * @property {number} offerBadgeWeight - Font weight for offer badge
 */

/**
 * Save font settings to localStorage
 * Debouncing should be handled by the caller (App.jsx)
 *
 * @param {FontSettings} settings - Font settings object
 * @returns {boolean} Success status
 *
 * @example
 * saveFontSettings({
 *   headingFont: 'Inter',
 *   headingWeight: 900,
 *   subheadingFont: 'Roboto',
 *   ...
 * })
 */
export function saveFontSettings(settings) {
  try {
    const jsonString = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    // Handle localStorage errors (quota exceeded, disabled, etc.)
    console.error('Failed to save font settings to localStorage:', error);
    return false;
  }
}

/**
 * Load font settings from localStorage
 * Returns null if no settings found or if data is corrupted
 *
 * @returns {FontSettings | null} Font settings object or null
 *
 * @example
 * const settings = loadFontSettings();
 * if (settings) {
 *   // Use loaded settings
 * } else {
 *   // Use defaults
 * }
 */
export function loadFontSettings() {
  try {
    const jsonString = localStorage.getItem(STORAGE_KEY);

    // Return null if no settings stored yet
    if (!jsonString) {
      return null;
    }

    const settings = JSON.parse(jsonString);

    // Basic validation - ensure it's an object
    if (!settings || typeof settings !== 'object') {
      console.warn('Invalid font settings format in localStorage');
      return null;
    }

    return settings;
  } catch (error) {
    // Handle JSON parse errors or localStorage errors
    console.error('Failed to load font settings from localStorage:', error);
    return null;
  }
}

/**
 * Clear font settings from localStorage
 * Useful for reset functionality
 *
 * @returns {boolean} Success status
 *
 * @example
 * clearFontSettings();
 */
export function clearFontSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear font settings from localStorage:', error);
    return false;
  }
}

/**
 * Extract font settings from banner state
 * Converts state structure to flat storage format
 *
 * @param {Object} bannerState - Current banner state object
 * @returns {FontSettings} Flat font settings object
 *
 * @example
 * const settings = extractFontSettings(bannerState);
 * saveFontSettings(settings);
 */
export function extractFontSettings(bannerState) {
  return {
    // Heading
    headingFont: bannerState.heading?.fontFamily,
    headingWeight: bannerState.heading?.fontWeight,

    // Subheading (shared font, separate weights for modes)
    subheadingFont: bannerState.subheading?.fontFamily,
    subheadingWeightLeft: bannerState.subheading?.weightLeft,
    subheadingWeightRight: bannerState.subheading?.weightRight,
    subheadingWeightSingle: bannerState.subheading?.weightSingle,

    // CTA Button
    ctaButtonFont: bannerState.ctaButton?.fontFamily,
    ctaButtonWeight: bannerState.ctaButton?.fontWeight,

    // T&C Text
    tcTextFont: bannerState.tcText?.fontFamily,
    tcTextWeight: bannerState.tcText?.fontWeight,

    // Offer Badge
    offerBadgeFont: bannerState.offerBadge?.fontFamily,
    offerBadgeWeight: bannerState.offerBadge?.fontWeight,
  };
}

/**
 * Merge loaded settings back into initial state structure
 * Validates that fonts/weights are still available
 *
 * @param {Object} initialState - Initial banner state
 * @param {FontSettings} loadedSettings - Loaded font settings from storage
 * @param {Object} validators - Validation functions
 * @param {Function} validators.isValidFont - Function to check if font exists
 * @param {Function} validators.isValidWeight - Function to check if weight is valid for font
 * @returns {Object} Updated state with merged font settings
 *
 * @example
 * const updatedState = mergeFontSettings(
 *   INITIAL_BANNER_STATE,
 *   loadedSettings,
 *   { isValidFont, isValidWeight }
 * );
 */
export function mergeFontSettings(initialState, loadedSettings, validators = {}) {
  const { isValidFont = () => true, isValidWeight = () => true } = validators;

  return {
    ...initialState,

    // Heading
    heading: {
      ...initialState.heading,
      ...(loadedSettings.headingFont &&
        isValidFont(loadedSettings.headingFont) && {
          fontFamily: loadedSettings.headingFont,
        }),
      ...(loadedSettings.headingWeight &&
        isValidWeight(loadedSettings.headingFont, loadedSettings.headingWeight) && {
          fontWeight: loadedSettings.headingWeight,
        }),
    },

    // Subheading
    subheading: {
      ...initialState.subheading,
      ...(loadedSettings.subheadingFont &&
        isValidFont(loadedSettings.subheadingFont) && {
          fontFamily: loadedSettings.subheadingFont,
        }),
      ...(loadedSettings.subheadingWeightLeft &&
        isValidWeight(loadedSettings.subheadingFont, loadedSettings.subheadingWeightLeft) && {
          weightLeft: loadedSettings.subheadingWeightLeft,
        }),
      ...(loadedSettings.subheadingWeightRight &&
        isValidWeight(loadedSettings.subheadingFont, loadedSettings.subheadingWeightRight) && {
          weightRight: loadedSettings.subheadingWeightRight,
        }),
      ...(loadedSettings.subheadingWeightSingle &&
        isValidWeight(loadedSettings.subheadingFont, loadedSettings.subheadingWeightSingle) && {
          weightSingle: loadedSettings.subheadingWeightSingle,
        }),
    },

    // CTA Button
    ctaButton: {
      ...initialState.ctaButton,
      ...(loadedSettings.ctaButtonFont &&
        isValidFont(loadedSettings.ctaButtonFont) && {
          fontFamily: loadedSettings.ctaButtonFont,
        }),
      ...(loadedSettings.ctaButtonWeight &&
        isValidWeight(loadedSettings.ctaButtonFont, loadedSettings.ctaButtonWeight) && {
          fontWeight: loadedSettings.ctaButtonWeight,
        }),
    },

    // T&C Text
    tcText: {
      ...initialState.tcText,
      ...(loadedSettings.tcTextFont &&
        isValidFont(loadedSettings.tcTextFont) && {
          fontFamily: loadedSettings.tcTextFont,
        }),
      ...(loadedSettings.tcTextWeight &&
        isValidWeight(loadedSettings.tcTextFont, loadedSettings.tcTextWeight) && {
          fontWeight: loadedSettings.tcTextWeight,
        }),
    },

    // Offer Badge
    offerBadge: {
      ...initialState.offerBadge,
      ...(loadedSettings.offerBadgeFont &&
        isValidFont(loadedSettings.offerBadgeFont) && {
          fontFamily: loadedSettings.offerBadgeFont,
        }),
      ...(loadedSettings.offerBadgeWeight &&
        isValidWeight(loadedSettings.offerBadgeFont, loadedSettings.offerBadgeWeight) && {
          fontWeight: loadedSettings.offerBadgeWeight,
        }),
    },
  };
}
