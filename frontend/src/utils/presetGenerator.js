/**
 * Preset Canvas Generator
 *
 * Generates canvas output based on preset configuration and user inputs.
 * This module extends the existing bannerGenerator.js to support multiple
 * preset dimension types while maintaining backward compatibility.
 *
 * For the promotional_banner preset, it delegates to the existing
 * bannerGenerator functions. For other presets, it provides simplified
 * generation logic based on their configurations.
 *
 * @module utils/presetGenerator
 */

import * as fabric from 'fabric';
import { getPresetConfig, PRESET_TYPES } from '../constants/presetConfigs';
import { generateBanner, exportAsWEBP } from './bannerGenerator';

// =============================================================================
// MAIN GENERATOR FUNCTION
// =============================================================================

/**
 * Generate canvas output for a preset dimension type
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {Object} bannerState - Current banner state with all element values
 * @param {string} dimensionType - Preset type identifier
 * @param {Object} options - Additional generation options
 * @returns {Promise<void>}
 */
export const generatePresetCanvas = async (canvas, bannerState, dimensionType, options = {}) => {
  const config = getPresetConfig(dimensionType);

  if (!config) {
    console.error(`Unknown preset type: ${dimensionType}`);
    return;
  }

  // Promotional banner uses the existing full-featured generator
  if (dimensionType === PRESET_TYPES.PROMOTIONAL_BANNER) {
    return generateBanner(canvas, bannerState);
  }

  // Widget uses its own dedicated generator
  if (dimensionType === PRESET_TYPES.WIDGET) {
    return generateWidgetCanvas(canvas, bannerState, config);
  }

  // For other presets, use the simplified generator
  return generateSimplifiedCanvas(canvas, bannerState, config, options);
};

// =============================================================================
// SIMPLIFIED CANVAS GENERATOR
// =============================================================================

/**
 * Simplified canvas generation for basic presets
 *
 * This function handles presets that don't require the full complexity
 * of the promotional banner generator. It provides basic support for:
 * - Background images
 * - Single product/logo images
 * - Simple text elements
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {Object} state - Current state
 * @param {Object} config - Preset configuration
 * @param {Object} options - Additional options
 */
const generateSimplifiedCanvas = async (canvas, state, config, options = {}) => {
  const { dimensions } = config;

  // Clear canvas
  canvas.clear();

  // Set canvas dimensions
  canvas.setWidth(dimensions.width);
  canvas.setHeight(dimensions.height);

  // Create background clipping (for rounded corners)
  if (dimensions.borderRadius > 0 && state.background?.edgeType === 'rounded') {
    const clipPath = new fabric.Rect({
      width: dimensions.width,
      height: dimensions.height,
      rx: dimensions.borderRadius,
      ry: dimensions.borderRadius,
      absolutePositioned: true,
    });
    canvas.clipPath = clipPath;
  } else {
    canvas.clipPath = null;
  }

  // Add background
  if (state.background?.imageUrl) {
    await addBackgroundImage(canvas, state.background.imageUrl, dimensions);
  } else {
    // Default white background
    canvas.backgroundColor = '#ffffff';
  }

  // Add product/logo image if present
  if (state.productImage?.imageUrl) {
    await addCenteredImage(canvas, state.productImage.imageUrl, dimensions, config);
  } else if (state.brandLogo?.imageUrl) {
    await addCenteredImage(canvas, state.brandLogo.imageUrl, dimensions, config);
  }

  // Add heading text if present
  if (state.heading?.text) {
    addSimpleText(canvas, state.heading, dimensions, 'heading');
  }

  // Add custom text if present
  if (state.customText?.text) {
    addSimpleText(canvas, state.customText, dimensions, 'center');
  }

  // Render canvas
  canvas.renderAll();
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Add background image to canvas
 *
 * @param {fabric.Canvas} canvas - Canvas instance
 * @param {string} imageUrl - Image URL
 * @param {Object} dimensions - Canvas dimensions
 */
const addBackgroundImage = (canvas, imageUrl, dimensions) => {
  return new Promise((resolve, reject) => {
    fabric.FabricImage.fromURL(
      imageUrl,
      { crossOrigin: 'anonymous' }
    ).then((img) => {
      // Scale to cover canvas
      const scaleX = dimensions.width / img.width;
      const scaleY = dimensions.height / img.height;
      const scale = Math.max(scaleX, scaleY);

      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        left: dimensions.width / 2,
        top: dimensions.height / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      canvas.sendObjectToBack(img);
      resolve();
    }).catch((err) => {
      console.error('Failed to load background image:', err);
      reject(err);
    });
  });
};

/**
 * Add centered image to canvas
 *
 * @param {fabric.Canvas} canvas - Canvas instance
 * @param {string} imageUrl - Image URL
 * @param {Object} dimensions - Canvas dimensions
 * @param {Object} config - Preset configuration
 */
const addCenteredImage = (canvas, imageUrl, dimensions, config) => {
  return new Promise((resolve, reject) => {
    fabric.FabricImage.fromURL(
      imageUrl,
      { crossOrigin: 'anonymous' }
    ).then((img) => {
      // Calculate maximum size based on layout
      const padding = config.layout?.padding || 20;
      const maxWidth = dimensions.width - (padding * 2);
      const maxHeight = dimensions.height - (padding * 2);

      // Scale to fit within bounds
      const scaleX = maxWidth / img.width;
      const scaleY = maxHeight / img.height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale

      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        left: dimensions.width / 2,
        top: dimensions.height / 2,
        selectable: false,
        evented: false,
      });

      canvas.add(img);
      resolve();
    }).catch((err) => {
      console.error('Failed to load image:', err);
      reject(err);
    });
  });
};

/**
 * Add simple text to canvas
 *
 * @param {fabric.Canvas} canvas - Canvas instance
 * @param {Object} textState - Text state object
 * @param {Object} dimensions - Canvas dimensions
 * @param {string} position - Text position ('heading', 'center', 'bottom')
 */
const addSimpleText = (canvas, textState, dimensions, position) => {
  const {
    text,
    color = '#000000',
    fontFamily = 'Inter',
    fontWeight = 600,
    fontSize = 24,
  } = textState;

  if (!text) return;

  // Calculate position
  let top, textAlign;
  switch (position) {
    case 'heading':
      top = dimensions.height * 0.2;
      textAlign = 'center';
      break;
    case 'bottom':
      top = dimensions.height * 0.8;
      textAlign = 'center';
      break;
    case 'center':
    default:
      top = dimensions.height / 2;
      textAlign = 'center';
  }

  const textObject = new fabric.Textbox(text, {
    left: dimensions.width / 2,
    top: top,
    width: dimensions.width - 40,
    originX: 'center',
    originY: 'center',
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    fontSize: fontSize,
    fill: color,
    textAlign: textAlign,
    selectable: false,
    evented: false,
  });

  canvas.add(textObject);
};

// =============================================================================
// WIDGET CANVAS GENERATOR
// =============================================================================

/**
 * Generate canvas output for the Widget preset (164×164).
 *
 * Render order (back to front):
 * 1. Background image (scaled to cover 164×164)
 * 2. Product image (at top=80px, centered, clips at bottom)
 * 3. Text fields (in the top 80px zone, auto-shrink font)
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {Object} state - Current widget state
 * @param {Object} config - Widget preset configuration
 */
const generateWidgetCanvas = async (canvas, state, config) => {
  const { dimensions, textConfig, layout } = config;

  // Clear canvas and set dimensions
  canvas.clear();
  canvas.setWidth(dimensions.width);
  canvas.setHeight(dimensions.height);

  // Apply corner clipping based on edge type
  if (dimensions.borderRadius > 0 && state.background?.edgeType === 'rounded') {
    canvas.clipPath = new fabric.Rect({
      width: dimensions.width,
      height: dimensions.height,
      rx: dimensions.borderRadius,
      ry: dimensions.borderRadius,
      absolutePositioned: true,
    });
  } else {
    canvas.clipPath = null;
  }

  // --- 1. Background ---
  if (state.background?.imageUrl) {
    await addBackgroundImage(canvas, state.background.imageUrl, dimensions);
  } else {
    canvas.backgroundColor = '#ffffff';
  }

  // --- 2. Product image (at top=80px, centered, may overflow bottom) ---
  if (state.productImage?.imageUrl) {
    await addWidgetProductImage(canvas, state.productImage.imageUrl, dimensions, layout);
  }

  // --- 3. Text fields (top 80px zone) ---
  const textOrder = state.widgetLayout?.textOrder || 'small-top';
  addWidgetTexts(canvas, state, textConfig, layout, dimensions, textOrder);

  canvas.renderAll();
};

// =============================================================================
// WIDGET HELPER FUNCTIONS
// =============================================================================

/**
 * Add product image to the widget canvas.
 * Positioned at top=80px, horizontally centered, max 120×120.
 * Allowed to extend beyond canvas bottom (clipped by canvas clipPath).
 *
 * @param {fabric.Canvas} canvas
 * @param {string} imageUrl
 * @param {Object} dimensions - { width, height }
 * @param {Object} layout - Widget layout config
 */
const addWidgetProductImage = (canvas, imageUrl, dimensions, layout) => {
  return new Promise((resolve, reject) => {
    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        const maxW = 120;
        const maxH = 120;
        const scaleX = maxW / img.width;
        const scaleY = maxH / img.height;
        const scale = Math.min(scaleX, scaleY, 1); // Don't upscale

        img.set({
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'top',
          left: dimensions.width / 2,
          top: layout.imageTop, // 80px
          selectable: false,
          evented: false,
        });

        canvas.add(img);
        resolve();
      })
      .catch((err) => {
        console.error('[Widget] Failed to load product image:', err);
        reject(err);
      });
  });
};

/**
 * Calculate the auto-shrink font size for a widget text field.
 *
 * Strategy: start at startFontSize, create a temporary Textbox to measure.
 * If the text wraps beyond `shrinkThreshold` lines, reduce font by 1px.
 * Repeat until lines ≤ threshold or font reaches minFontSize.
 *
 * @param {string} text - Text content
 * @param {string} fontFamily
 * @param {number} fontWeight
 * @param {number} maxWidth - Available text width
 * @param {number} startFontSize - Maximum font size
 * @param {number} minFontSize - Minimum font size
 * @param {number} shrinkThreshold - Max lines before shrinking (default 2)
 * @returns {number} Computed font size
 */
const calculateAutoShrinkFontSize = (
  text, fontFamily, fontWeight, maxWidth,
  startFontSize, minFontSize, shrinkThreshold = 2
) => {
  if (!text) return startFontSize;

  let fontSize = startFontSize;

  while (fontSize > minFontSize) {
    // Create a temporary text object to measure line count
    const temp = new fabric.Textbox(text, {
      width: maxWidth,
      fontFamily,
      fontWeight,
      fontSize,
      left: 0,
      top: 0,
    });

    const lineCount = temp.textLines?.length || 1;

    if (lineCount <= shrinkThreshold) {
      break;
    }

    fontSize -= 1;
  }

  return Math.max(fontSize, minFontSize);
};

/**
 * Add both widget text fields to the canvas in the top 80px zone.
 *
 * Layout within the 80px zone:
 *   topMargin (4px) → first text → gap (4px) → second text → remaining
 *
 * @param {fabric.Canvas} canvas
 * @param {Object} state - Full widget state
 * @param {Object} textConfig - { small: {...}, large: {...} }
 * @param {Object} layout - Widget layout config
 * @param {Object} dimensions - Canvas dimensions
 * @param {string} textOrder - 'small-top' or 'large-top'
 */
const addWidgetTexts = (canvas, state, textConfig, layout, dimensions, textOrder) => {
  // Determine rendering order based on textOrder
  const fields = textOrder === 'small-top'
    ? [
        { key: 'widgetTextSmall', config: textConfig.small },
        { key: 'widgetTextLarge', config: textConfig.large },
      ]
    : [
        { key: 'widgetTextLarge', config: textConfig.large },
        { key: 'widgetTextSmall', config: textConfig.small },
      ];

  const topMargin = layout.topMargin || 4;
  const textGap = layout.textGap || 4;
  const maxWidth = dimensions.width - 16; // 8px padding each side

  let currentY = topMargin;

  for (const field of fields) {
    const textState = state[field.key];
    if (!textState?.text) {
      // Skip empty fields but still advance Y for consistent layout
      currentY += field.config.maxBoxHeight + textGap;
      continue;
    }

    const {
      text,
      color = '#000000',
      fontFamily = field.config.defaultFontFamily,
      fontWeight = field.config.defaultFontWeight,
    } = textState;

    // Compute auto-shrink font size
    const fontSize = calculateAutoShrinkFontSize(
      text, fontFamily, fontWeight, maxWidth,
      field.config.startFontSize,
      field.config.minFontSize,
      field.config.shrinkThreshold
    );

    const textObj = new fabric.Textbox(text, {
      left: dimensions.width / 2,
      top: currentY,
      width: maxWidth,
      originX: 'center',
      originY: 'top',
      fontFamily,
      fontWeight,
      fontSize,
      fill: color,
      textAlign: 'center',
      selectable: false,
      evented: false,
    });

    canvas.add(textObj);

    // Advance Y by box height (not actual rendered height, to keep layout consistent)
    currentY += field.config.maxBoxHeight + textGap;
  }
};

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

/**
 * Export canvas as WEBP
 * Delegates to the existing bannerGenerator export function
 *
 * @param {fabric.Canvas} canvas - Canvas instance
 * @param {string} fileName - Output filename
 */
export const exportPresetAsWEBP = (canvas, fileName) => {
  return exportAsWEBP(canvas, fileName);
};

/**
 * Export canvas as PNG
 *
 * @param {fabric.Canvas} canvas - Canvas instance
 * @param {string} fileName - Output filename
 * @param {number} multiplier - Resolution multiplier (default 1)
 */
export const exportPresetAsPNG = (canvas, fileName, multiplier = 1) => {
  const dataURL = canvas.toDataURL({
    format: 'png',
    multiplier: multiplier,
  });

  // Trigger download
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export canvas as JPEG
 *
 * @param {fabric.Canvas} canvas - Canvas instance
 * @param {string} fileName - Output filename
 * @param {number} quality - JPEG quality (0-1, default 0.9)
 */
export const exportPresetAsJPEG = (canvas, fileName, quality = 0.9) => {
  const dataURL = canvas.toDataURL({
    format: 'jpeg',
    quality: quality,
  });

  // Trigger download
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')
    ? fileName
    : `${fileName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Validate banner state against preset requirements
 *
 * @param {Object} state - Banner state to validate
 * @param {string} dimensionType - Preset type
 * @returns {Object} Validation result { isValid, errors }
 */
export const validatePresetState = (state, dimensionType) => {
  const config = getPresetConfig(dimensionType);

  if (!config) {
    return { isValid: false, errors: ['Unknown preset type'] };
  }

  const errors = [];
  const requiredElements = config.elements.filter(el => el.required);

  for (const element of requiredElements) {
    const stateKey = element.type;
    const elementState = state[stateKey];

    if (!elementState) {
      errors.push(`${element.label} is required`);
      continue;
    }

    // Check for image elements
    if (['background', 'brandLogo', 'productImage'].includes(stateKey)) {
      if (!elementState.imageUrl && !elementState.image) {
        errors.push(`${element.label} is required`);
      }
    }

    // Check for text elements
    if (['heading', 'ctaButton'].includes(stateKey)) {
      if (!elementState.text?.trim()) {
        errors.push(`${element.label} text is required`);
      }
    }

    // Check for CTA button background color
    if (stateKey === 'ctaButton' && !elementState.bgColor) {
      errors.push('CTA button background color is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  generatePresetCanvas,
  exportPresetAsWEBP,
  exportPresetAsPNG,
  exportPresetAsJPEG,
  validatePresetState,
};
