/**
 * Font Configuration
 *
 * Defines available fonts and their supported weights for the banner generator.
 * All fonts are loaded from Google Fonts with display=swap for optimal loading.
 *
 * Weight mapping researched from Google Fonts documentation (2026).
 */

/**
 * Available fonts for banner text fields
 * @type {Array<{name: string, value: string}>}
 */
export const AVAILABLE_FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Raleway', value: 'Raleway' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Oswald', value: 'Oswald' },
];

/**
 * Font-to-weight mapping
 * Maps each font family to its available weights (as numbers)
 *
 * Source: Google Fonts API (January 2026)
 * @type {Object<string, number[]>}
 */
export const FONT_WEIGHTS = {
  'Inter': [100, 200, 300, 400, 500, 600, 700, 800, 900],           // Variable font, all weights
  'Roboto': [100, 300, 400, 500, 700, 900],                          // 6 weights
  'Poppins': [100, 200, 300, 400, 500, 600, 700, 800, 900],         // All 9 weights
  'Montserrat': [100, 200, 300, 400, 500, 600, 700, 800, 900],      // All 9 weights
  'Open Sans': [300, 400, 500, 600, 700, 800],                       // 6 weights
  'Lato': [100, 300, 400, 700, 900],                                 // 5 weights
  'Raleway': [100, 200, 300, 400, 500, 600, 700, 800, 900],         // All 9 weights
  'Nunito': [200, 300, 400, 500, 600, 700, 800, 900],               // 8 weights (no 100)
  'Playfair Display': [400, 500, 600, 700, 800, 900],               // 6 weights (no thin/light)
  'Oswald': [200, 300, 400, 500, 600, 700],                          // 6 weights
};

/**
 * Weight display labels
 * Maps numeric weights to human-readable labels
 * @type {Object<number, string>}
 */
export const WEIGHT_LABELS = {
  100: 'Thin',
  200: 'Extra Light',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'Semi Bold',
  700: 'Bold',
  800: 'Extra Bold',
  900: 'Black',
};

/**
 * Get available weights for a specific font family
 *
 * @param {string} fontFamily - The font family name (e.g., 'Inter', 'Roboto')
 * @returns {number[]} Array of available weights for the font
 *
 * @example
 * getAvailableWeights('Roboto')
 * // Returns: [100, 300, 400, 500, 700, 900]
 */
export function getAvailableWeights(fontFamily) {
  return FONT_WEIGHTS[fontFamily] || [400]; // Fallback to Regular if font not found
}

/**
 * Get the closest available weight for a font family
 * Used when switching fonts and the current weight is not available
 *
 * @param {string} fontFamily - The font family name
 * @param {number} targetWeight - The desired weight
 * @returns {number} The closest available weight
 *
 * @example
 * getClosestWeight('Roboto', 600)
 * // Returns: 700 (Roboto doesn't have 600, so returns closest available)
 */
export function getClosestWeight(fontFamily, targetWeight) {
  const availableWeights = getAvailableWeights(fontFamily);

  // If target weight is available, return it
  if (availableWeights.includes(targetWeight)) {
    return targetWeight;
  }

  // Find the closest weight by minimum absolute difference
  let closest = availableWeights[0];
  let minDiff = Math.abs(targetWeight - closest);

  for (const weight of availableWeights) {
    const diff = Math.abs(targetWeight - weight);
    if (diff < minDiff) {
      minDiff = diff;
      closest = weight;
    }
  }

  return closest;
}

/**
 * Get formatted weight label for display in dropdowns
 *
 * @param {number} weight - The numeric weight (e.g., 400, 700)
 * @returns {string} Formatted label (e.g., "400 - Regular", "700 - Bold")
 *
 * @example
 * getWeightLabel(400)
 * // Returns: "400 - Regular"
 */
export function getWeightLabel(weight) {
  const label = WEIGHT_LABELS[weight] || 'Regular';
  return `${weight} - ${label}`;
}
