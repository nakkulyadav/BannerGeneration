/**
 * Preset Configuration Registry
 *
 * Defines the structure and default values for each preset dimension type.
 * Each preset contains:
 * - Dimension specifications (width, height, borderRadius)
 * - Element definitions (what elements are available)
 * - Default layout positions and styles
 * - Validation rules
 *
 * This allows the editor to dynamically render input controls
 * and generate canvas output based on the selected preset.
 *
 * @module constants/presetConfigs
 */

import { BANNER, LAYOUT, LOGO, TEXT, PRODUCT_IMAGE, VALIDATION } from './bannerConfig';
import { DEFAULT_COLORS, INITIAL_BANNER_STATE } from './defaultValues';

// =============================================================================
// PRESET DIMENSION TYPES
// =============================================================================

/**
 * All available preset dimension type identifiers
 */
export const PRESET_TYPES = {
  PROMOTIONAL_BANNER: 'promotional_banner',
  WIDGET: 'widget',
  CIRCULAR_BADGE: 'circular_badge',
  ROUNDED_SQUARE: 'rounded_square',
  BANNER2: 'banner2',
};

// =============================================================================
// ELEMENT TYPES
// =============================================================================

/**
 * Available element types for preset configurations
 */
export const ELEMENT_TYPES = {
  BACKGROUND: 'background',
  BRAND_LOGO: 'brandLogo',
  HEADING: 'heading',
  SUBHEADING: 'subheading',
  CTA_BUTTON: 'ctaButton',
  TC_TEXT: 'tcText',
  OFFER_BADGE: 'offerBadge',
  PRODUCT_IMAGE: 'productImage',
  // For future presets
  ICON: 'icon',
  SHAPE: 'shape',
  CUSTOM_TEXT: 'customText',
};

// =============================================================================
// PROMOTIONAL BANNER PRESET (722×312)
// =============================================================================

/**
 * Promotional Banner Preset Configuration
 *
 * This is the main banner format used for DigiHaat promotional materials.
 * Features a two-column layout with text elements on the left and
 * product image on the right.
 */
export const PROMOTIONAL_BANNER_CONFIG = {
  // Preset identifier
  id: PRESET_TYPES.PROMOTIONAL_BANNER,
  name: 'Promotional Banner',
  description: 'Standard promotional banner for DigiHaat campaigns',

  // ==========================================================================
  // DIMENSIONS
  // ==========================================================================
  dimensions: {
    width: BANNER.WIDTH, // 722px
    height: BANNER.HEIGHT, // 312px
    borderRadius: BANNER.EDGE_RADIUS, // 12px (when rounded)
  },

  // ==========================================================================
  // LAYOUT CONFIGURATION
  // ==========================================================================
  layout: {
    // Two-column layout: left for text, right for product image
    type: 'two-column',
    leftMargin: LAYOUT.LEFT_MARGIN, // 40px
    topMargin: LAYOUT.TOP_MARGIN, // 22px
    sectionDivide: LAYOUT.SECTION_DIVIDE, // 361px (50% width)

    // Vertical spacing between elements
    spacing: {
      logoToHeading: LAYOUT.SPACING.LOGO_TO_HEADING,
      headingToSubheading: LAYOUT.SPACING.HEADING_TO_SUBHEADING,
      subheadingToCta: LAYOUT.SPACING.SUBHEADING_TO_CTA,
      ctaToTc: LAYOUT.SPACING.CTA_TO_TC,
    },

    // Split subheading gap
    subheadingSplitGap: LAYOUT.SUBHEADING_SPLIT_GAP,
  },

  // ==========================================================================
  // ELEMENT DEFINITIONS
  // ==========================================================================
  elements: [
    // -------------------------------------------------------------------------
    // BACKGROUND
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.BACKGROUND,
      required: true,
      label: 'Background Image',
      description: 'Upload a 722×312px background image',
      section: 'left', // Input appears on left panel
      order: 1,
      validation: {
        requiredWidth: VALIDATION.BACKGROUND.REQUIRED_WIDTH,
        requiredHeight: VALIDATION.BACKGROUND.REQUIRED_HEIGHT,
        acceptedFormats: VALIDATION.ACCEPTED_IMAGE_FORMATS,
      },
      options: {
        hasEdgeType: true, // Allows sharp/rounded toggle
        edgeTypes: ['sharp', 'rounded'],
        defaultEdgeType: 'rounded',
      },
    },

    // -------------------------------------------------------------------------
    // BRAND LOGO
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.BRAND_LOGO,
      required: false,
      label: 'Brand Logo',
      description: 'Optional brand logo (max 200×60px)',
      section: 'left',
      order: 2,
      position: {
        top: LOGO.POSITION.TOP,
        left: LOGO.POSITION.LEFT,
      },
      constraints: {
        maxWidth: LOGO.MAX_WIDTH,
        maxHeight: LOGO.MAX_HEIGHT,
      },
      options: {
        hasAiSearch: true,
        hasEnhance: true,
        hasRemoveBg: true,
      },
    },

    // -------------------------------------------------------------------------
    // HEADING
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.HEADING,
      required: true,
      label: 'Heading',
      description: 'Main promotional text (max 40 characters)',
      section: 'left',
      order: 3,
      text: {
        maxChars: TEXT.HEADING.MAX_CHARS,
        maxWidth: TEXT.HEADING.MAX_WIDTH,
        maxLines: TEXT.HEADING.MAX_LINES,
        defaultFontFamily: TEXT.HEADING.FONT_FAMILY,
        defaultFontWeight: TEXT.HEADING.FONT_WEIGHT,
        defaultFontSize: TEXT.HEADING.FONT_SIZE,
        letterSpacing: TEXT.HEADING.LETTER_SPACING,
        lineHeight: TEXT.HEADING.LINE_HEIGHT,
      },
      options: {
        hasColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        defaultColor: DEFAULT_COLORS.TEXT_BLACK,
      },
    },

    // -------------------------------------------------------------------------
    // SUBHEADING
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.SUBHEADING,
      required: false,
      label: 'Subheading',
      description: 'Secondary text with split option',
      section: 'left',
      order: 4,
      text: {
        // Multiple configs for different modes
        single: {
          fontFamily: TEXT.SUBHEADING_SINGLE.FONT_FAMILY,
          fontWeight: TEXT.SUBHEADING_SINGLE.FONT_WEIGHT,
          fontSize: TEXT.SUBHEADING_SINGLE.FONT_SIZE,
        },
        left: {
          fontFamily: TEXT.SUBHEADING_LEFT.FONT_FAMILY,
          fontWeight: TEXT.SUBHEADING_LEFT.FONT_WEIGHT,
          fontSize: TEXT.SUBHEADING_LEFT.FONT_SIZE,
        },
        right: {
          fontFamily: TEXT.SUBHEADING_RIGHT.FONT_FAMILY,
          fontWeight: TEXT.SUBHEADING_RIGHT.FONT_WEIGHT,
          fontSize: TEXT.SUBHEADING_RIGHT.FONT_SIZE,
        },
        rupeePrefix: TEXT.SUBHEADING.RUPEE_PREFIX,
      },
      options: {
        hasSplitMode: true,
        hasRupeeToggle: true,
        hasStrikethroughToggle: true, // Only for left part
        hasColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        defaultColor: DEFAULT_COLORS.TEXT_BLACK,
      },
    },

    // -------------------------------------------------------------------------
    // CTA BUTTON
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.CTA_BUTTON,
      required: true,
      label: 'CTA Button',
      description: 'Call-to-action button',
      section: 'left',
      order: 5,
      text: {
        defaultText: 'SHOP NOW',
        fontFamily: TEXT.CTA.FONT_FAMILY,
        fontWeight: TEXT.CTA.FONT_WEIGHT,
        fontSize: TEXT.CTA.FONT_SIZE,
      },
      style: {
        paddingHorizontal: TEXT.CTA.PADDING.HORIZONTAL,
        paddingVertical: TEXT.CTA.PADDING.VERTICAL,
        borderRadius: TEXT.CTA.BORDER_RADIUS,
      },
      options: {
        hasTextColorPicker: true,
        hasBgColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        defaultTextColor: DEFAULT_COLORS.TEXT_WHITE,
        requireBgColor: true, // Must select a background color
      },
    },

    // -------------------------------------------------------------------------
    // T&C TEXT
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.TC_TEXT,
      required: false,
      label: 'T&C Text',
      description: 'Terms and conditions text',
      section: 'left',
      order: 6,
      text: {
        defaultText: '*T&C Apply',
        fontFamily: TEXT.TC.FONT_FAMILY,
        fontWeight: TEXT.TC.FONT_WEIGHT,
        fontSize: TEXT.TC.FONT_SIZE,
        letterSpacing: TEXT.TC.LETTER_SPACING,
      },
      options: {
        hasToggle: true,
        hasColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        defaultColor: DEFAULT_COLORS.TEXT_BLACK,
        defaultEnabled: true,
      },
    },

    // -------------------------------------------------------------------------
    // OFFER BADGE
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.OFFER_BADGE,
      required: false,
      label: 'Offer Badge',
      description: 'Badge displayed at top-right corner',
      section: 'right',
      order: 7,
      position: {
        top: 0,
        right: 0,
      },
      text: {
        defaultText: 'Free Delivery',
        fontFamily: TEXT.OFFER_BADGE.FONT_FAMILY,
        fontWeight: TEXT.OFFER_BADGE.FONT_WEIGHT,
        fontSize: TEXT.OFFER_BADGE.FONT_SIZE,
      },
      style: {
        paddingHorizontal: TEXT.OFFER_BADGE.PADDING.HORIZONTAL,
        paddingVertical: TEXT.OFFER_BADGE.PADDING.VERTICAL,
        borderRadius: TEXT.OFFER_BADGE.BORDER_RADIUS,
      },
      options: {
        hasToggle: true,
        hasTextColorPicker: true,
        hasBgColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        defaultTextColor: DEFAULT_COLORS.TEXT_WHITE,
        defaultEnabled: true,
      },
    },

    // -------------------------------------------------------------------------
    // PRODUCT IMAGE
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.PRODUCT_IMAGE,
      required: true,
      label: 'Product Image',
      description: 'Main product image (right side)',
      section: 'right',
      order: 8,
      position: {
        // Calculated dynamically based on badge height
        gapFromBadge: PRODUCT_IMAGE.GAP_FROM_BADGE,
      },
      options: {
        hasAiSearch: true,
        hasEnhance: true,
        hasRemoveBg: true,
        verticalAlign: 'bottom', // Align to bottom of canvas
      },
    },
  ],

  // ==========================================================================
  // INITIAL STATE TEMPLATE
  // ==========================================================================
  initialState: INITIAL_BANNER_STATE,
};

// =============================================================================
// WIDGET PRESET (164×164)
// =============================================================================

/**
 * Widget Preset Configuration
 *
 * Small 164×164px square format for app widgets and thumbnails.
 *
 * Layout (top to bottom):
 * - Text area (0–80px): Two text fields (small 24px + large 44px), swappable
 * - Image area (80px+): Product image (max 120×120), clips at bottom edge
 *
 * Text auto-shrink: Font shrinks when text exceeds 2 lines.
 * All elements are horizontally center-aligned with variable width.
 */
export const WIDGET_CONFIG = {
  id: PRESET_TYPES.WIDGET,
  name: 'Widget',
  description: 'Small square format for widgets (164×164)',

  // ==========================================================================
  // DIMENSIONS
  // ==========================================================================
  dimensions: {
    width: 164,
    height: 164,
    borderRadius: 40, // When edge type is 'rounded'
  },

  // ==========================================================================
  // LAYOUT CONFIGURATION
  // ==========================================================================
  layout: {
    type: 'centered',
    // Top zone reserved for text fields (0–80px)
    textAreaHeight: 80,
    // Product image starts at this Y offset
    imageTop: 80,
    // Vertical spacing within text area
    topMargin: 4,
    textGap: 4,
  },

  // ==========================================================================
  // TEXT FIELD SPECIFICATIONS
  // ==========================================================================
  textConfig: {
    small: {
      maxBoxHeight: 24,
      maxChars: 25,
      startFontSize: 20,
      minFontSize: 10,
      defaultFontFamily: 'Inter',
      defaultFontWeight: 600,
      shrinkThreshold: 2, // Shrink when lines exceed this
    },
    large: {
      maxBoxHeight: 44,
      maxChars: 20,
      startFontSize: 36,
      minFontSize: 12,
      defaultFontFamily: 'Inter',
      defaultFontWeight: 800,
      shrinkThreshold: 2,
    },
  },

  // ==========================================================================
  // ELEMENT DEFINITIONS
  // ==========================================================================
  elements: [
    // -------------------------------------------------------------------------
    // BACKGROUND
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.BACKGROUND,
      required: true,
      label: 'Background Image',
      description: 'Upload a 164×164px background image',
      section: 'left',
      order: 1,
      validation: {
        requiredWidth: 164,
        requiredHeight: 164,
        acceptedFormats: VALIDATION.ACCEPTED_IMAGE_FORMATS,
        autoResize: true, // Silently resize non-matching dimensions
      },
      options: {
        hasEdgeType: true,
        edgeTypes: ['sharp', 'rounded'],
        defaultEdgeType: 'rounded',
      },
    },

    // -------------------------------------------------------------------------
    // SMALL TEXT (default: top position)
    // -------------------------------------------------------------------------
    {
      type: 'widgetTextSmall',
      required: false,
      label: 'Small Text',
      description: 'Smaller text field (max 24px height)',
      section: 'left',
      order: 2,
      text: {
        maxChars: 25,
        maxBoxHeight: 24,
        startFontSize: 20,
        minFontSize: 10,
        defaultFontFamily: 'Inter',
        defaultFontWeight: 600,
      },
      options: {
        hasColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        hasSpellCheck: true,
        hasTranslate: true,
        defaultColor: DEFAULT_COLORS.TEXT_BLACK,
      },
    },

    // -------------------------------------------------------------------------
    // LARGE TEXT (default: bottom position within text area)
    // -------------------------------------------------------------------------
    {
      type: 'widgetTextLarge',
      required: false,
      label: 'Large Text',
      description: 'Larger text field (max 44px height)',
      section: 'left',
      order: 3,
      text: {
        maxChars: 20,
        maxBoxHeight: 44,
        startFontSize: 36,
        minFontSize: 12,
        defaultFontFamily: 'Inter',
        defaultFontWeight: 800,
      },
      options: {
        hasColorPicker: true,
        hasFontSelector: true,
        hasWeightSelector: true,
        hasSpellCheck: true,
        hasTranslate: true,
        defaultColor: DEFAULT_COLORS.TEXT_BLACK,
      },
    },

    // -------------------------------------------------------------------------
    // PRODUCT IMAGE
    // -------------------------------------------------------------------------
    {
      type: ELEMENT_TYPES.PRODUCT_IMAGE,
      required: false,
      label: 'Product Image',
      description: 'Product image (max 120×120px, positioned at bottom)',
      section: 'left',
      order: 4,
      position: {
        top: 80, // Starts at 80px from top
      },
      constraints: {
        maxWidth: 120,
        maxHeight: 120,
      },
      options: {
        hasAiSearch: true,
        hasEnhance: true,
        hasRemoveBg: true,
      },
    },
  ],

  // ==========================================================================
  // INITIAL STATE TEMPLATE
  // ==========================================================================
  initialState: {
    background: {
      image: null,
      imageUrl: '',
      edgeType: 'rounded',
    },
    widgetTextSmall: {
      text: '',
      color: DEFAULT_COLORS.TEXT_BLACK,
      fontFamily: 'Inter',
      fontWeight: 600,
    },
    widgetTextLarge: {
      text: '',
      color: DEFAULT_COLORS.TEXT_BLACK,
      fontFamily: 'Inter',
      fontWeight: 800,
    },
    productImage: {
      image: null,
      imageUrl: '',
    },
    // Text field ordering: 'small-top' (default) or 'large-top'
    widgetLayout: {
      textOrder: 'small-top',
    },
  },
};

// =============================================================================
// CIRCULAR BADGE PRESET (226×226, 188px radius)
// =============================================================================

/**
 * Circular Badge Preset Configuration (Placeholder)
 *
 * Circular format for badges and icons.
 * High border radius creates near-circular shape.
 */
export const CIRCULAR_BADGE_CONFIG = {
  id: PRESET_TYPES.CIRCULAR_BADGE,
  name: 'Circular Badge',
  description: 'Circular badge format',

  dimensions: {
    width: 226,
    height: 226,
    borderRadius: 188, // Nearly circular
  },

  layout: {
    type: 'centered',
    padding: 20,
  },

  // Elements TBD
  elements: [
    {
      type: ELEMENT_TYPES.BACKGROUND,
      required: true,
      label: 'Background Image',
      section: 'left',
      order: 1,
      validation: {
        requiredWidth: 226,
        requiredHeight: 226,
      },
    },
    {
      type: ELEMENT_TYPES.CUSTOM_TEXT,
      required: false,
      label: 'Badge Text',
      section: 'left',
      order: 2,
      text: {
        defaultFontSize: 24,
        maxChars: 20,
      },
    },
  ],

  initialState: {
    background: { image: null, imageUrl: '', edgeType: 'rounded' },
    customText: { text: '', color: DEFAULT_COLORS.TEXT_WHITE },
  },
};

// =============================================================================
// ROUNDED SQUARE PRESET (226×226, 48px radius)
// =============================================================================

/**
 * Rounded Square Preset Configuration (Placeholder)
 *
 * Square format with moderate rounding.
 * Good for app icons and social media avatars.
 */
export const ROUNDED_SQUARE_CONFIG = {
  id: PRESET_TYPES.ROUNDED_SQUARE,
  name: 'Rounded Square',
  description: 'Square format with rounded corners',

  dimensions: {
    width: 226,
    height: 226,
    borderRadius: 48,
  },

  layout: {
    type: 'centered',
    padding: 16,
  },

  elements: [
    {
      type: ELEMENT_TYPES.BACKGROUND,
      required: true,
      label: 'Background Image',
      section: 'left',
      order: 1,
      validation: {
        requiredWidth: 226,
        requiredHeight: 226,
      },
    },
    {
      type: ELEMENT_TYPES.BRAND_LOGO,
      required: false,
      label: 'Logo/Icon',
      section: 'left',
      order: 2,
      options: {
        hasAiSearch: true,
        hasEnhance: true,
        hasRemoveBg: true,
      },
    },
  ],

  initialState: {
    background: { image: null, imageUrl: '', edgeType: 'rounded' },
    brandLogo: { image: null, imageUrl: '' },
  },
};

// =============================================================================
// BANNER2 PRESET (722×134)
// =============================================================================

/**
 * Banner2 Preset Configuration (Placeholder)
 *
 * Horizontal banner format, narrower than promotional banner.
 * Good for header banners and wide promotional strips.
 */
export const BANNER2_CONFIG = {
  id: PRESET_TYPES.BANNER2,
  name: 'Banner 2',
  description: 'Wide horizontal banner format',

  dimensions: {
    width: 722,
    height: 134,
    borderRadius: 24,
  },

  layout: {
    type: 'horizontal',
    leftMargin: 20,
    topMargin: 12,
    sectionDivide: 480, // 2/3 for text, 1/3 for image
  },

  elements: [
    {
      type: ELEMENT_TYPES.BACKGROUND,
      required: true,
      label: 'Background Image',
      section: 'left',
      order: 1,
      validation: {
        requiredWidth: 722,
        requiredHeight: 134,
      },
    },
    {
      type: ELEMENT_TYPES.HEADING,
      required: true,
      label: 'Heading',
      section: 'left',
      order: 2,
      text: {
        maxChars: 30,
        defaultFontSize: 20,
      },
    },
    {
      type: ELEMENT_TYPES.CTA_BUTTON,
      required: false,
      label: 'CTA Button',
      section: 'left',
      order: 3,
      text: {
        defaultText: 'SHOP NOW',
        fontSize: 14,
      },
    },
    {
      type: ELEMENT_TYPES.PRODUCT_IMAGE,
      required: true,
      label: 'Product Image',
      section: 'right',
      order: 4,
      options: {
        hasAiSearch: true,
        hasEnhance: true,
        hasRemoveBg: true,
      },
    },
  ],

  initialState: {
    background: { image: null, imageUrl: '', edgeType: 'rounded' },
    heading: { text: '', color: DEFAULT_COLORS.TEXT_BLACK },
    ctaButton: { text: 'SHOP NOW', textColor: DEFAULT_COLORS.TEXT_WHITE, bgColor: '' },
    productImage: { image: null, imageUrl: '' },
  },
};

// =============================================================================
// PRESET CONFIG REGISTRY
// =============================================================================

/**
 * Registry of all preset configurations
 * Maps preset type ID to its full configuration
 */
export const PRESET_CONFIGS = {
  [PRESET_TYPES.PROMOTIONAL_BANNER]: PROMOTIONAL_BANNER_CONFIG,
  [PRESET_TYPES.WIDGET]: WIDGET_CONFIG,
  [PRESET_TYPES.CIRCULAR_BADGE]: CIRCULAR_BADGE_CONFIG,
  [PRESET_TYPES.ROUNDED_SQUARE]: ROUNDED_SQUARE_CONFIG,
  [PRESET_TYPES.BANNER2]: BANNER2_CONFIG,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get preset configuration by dimension type
 * @param {string} dimensionType - Preset type identifier
 * @returns {Object|null} Preset configuration or null if not found
 */
export const getPresetConfig = (dimensionType) => {
  return PRESET_CONFIGS[dimensionType] || null;
};

/**
 * Check if a dimension type is a valid preset
 * @param {string} dimensionType - Dimension type to check
 * @returns {boolean} True if valid preset, false otherwise
 */
export const isValidPreset = (dimensionType) => {
  return Object.values(PRESET_TYPES).includes(dimensionType);
};

/**
 * Get all available preset types with metadata
 * @returns {Array<Object>} Array of preset metadata objects
 */
export const getAvailablePresets = () => {
  return Object.values(PRESET_CONFIGS).map(config => ({
    id: config.id,
    name: config.name,
    description: config.description,
    width: config.dimensions.width,
    height: config.dimensions.height,
    borderRadius: config.dimensions.borderRadius,
  }));
};

/**
 * Get initial state for a preset type
 * @param {string} dimensionType - Preset type identifier
 * @returns {Object} Initial state object for the preset
 */
export const getPresetInitialState = (dimensionType) => {
  const config = getPresetConfig(dimensionType);
  return config ? config.initialState : null;
};

/**
 * Get elements for a preset type
 * @param {string} dimensionType - Preset type identifier
 * @returns {Array<Object>} Array of element configurations
 */
export const getPresetElements = (dimensionType) => {
  const config = getPresetConfig(dimensionType);
  return config ? config.elements : [];
};

/**
 * Get required elements for a preset type
 * @param {string} dimensionType - Preset type identifier
 * @returns {Array<Object>} Array of required element configurations
 */
export const getRequiredElements = (dimensionType) => {
  return getPresetElements(dimensionType).filter(el => el.required);
};

export default PRESET_CONFIGS;
