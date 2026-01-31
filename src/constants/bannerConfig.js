/**
 * Banner Configuration Constants
 * All specifications for the 722x312px banner generation
 */

// =============================================================================
// BANNER DIMENSIONS
// =============================================================================

export const BANNER = {
  // Canvas dimensions (1x - actual output size)
  WIDTH: 722,
  HEIGHT: 312,
  // Original dimensions (for background validation - same as canvas)
  ORIGINAL_WIDTH: 722,
  ORIGINAL_HEIGHT: 312,
  EDGE_RADIUS: 12, // Border radius when rounded edges selected (1x)
};

// =============================================================================
// LAYOUT SECTIONS
// =============================================================================

export const LAYOUT = {
  // Left section (text elements) - doubled margins
  LEFT_MARGIN: 40,
  TOP_MARGIN: 22,

  // Section split (50/50)
  SECTION_DIVIDE: 361, // 722 / 2

  // Vertical spacing between elements (1x values)
  SPACING: {
    LOGO_TO_HEADING: 15,
    HEADING_TO_SUBHEADING: 15,
    SUBHEADING_TO_CTA: 10,
    CTA_TO_TC: 8,
  },

  // Subheading split gap (1x)
  SUBHEADING_SPLIT_GAP: 8,
};

// =============================================================================
// LOGO CONSTRAINTS
// =============================================================================

export const LOGO = {
  // Reduced logo size for better proportion
  MAX_WIDTH: 200,
  MAX_HEIGHT: 60,
  POSITION: {
    TOP: 22,  // Doubled margin
    LEFT: 40, // Doubled margin
  },
};

// =============================================================================
// TEXT SPECIFICATIONS
// =============================================================================

export const TEXT = {
  HEADING: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 1000, 
    FONT_SIZE: 28,
    MAX_CHARS: 40,
    MAX_WIDTH: 320, // Fills left section (361 - 40 margin ≈ 320)
    MAX_LINES: 2,
    LETTER_SPACING: 0,
    LINE_HEIGHT: 1.16, // Default/auto line height
  },

  // Subheading configs for different modes
  SUBHEADING_LEFT: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 500, // Medium
    FONT_SIZE: 28,
  },
  SUBHEADING_RIGHT: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 700, // Bold
    FONT_SIZE: 36,
  },
  SUBHEADING_SINGLE: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 800, 
    FONT_SIZE: 28,
  },
  // Common subheading settings
  SUBHEADING: {
    RUPEE_PREFIX: '₹',
  },

  CTA: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 700, // Bold
    FONT_SIZE: 20,
    PADDING: {
      HORIZONTAL: 12,
      VERTICAL: 8,
    },
    BORDER_RADIUS: 8,
  },

  TC: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 400, // Regular
    FONT_SIZE: 12, // Increased for better visibility
    LETTER_SPACING: 0,
  },

  OFFER_BADGE: {
    FONT_FAMILY: 'Inter',
    FONT_WEIGHT: 500, // Medium
    FONT_SIZE: 20,
    PADDING: {
      HORIZONTAL: 12,
      VERTICAL: 8,
    },
    // Border radius: only bottom-left is 8px
    BORDER_RADIUS: {
      TOP_LEFT: 0,
      TOP_RIGHT: 0,
      BOTTOM_RIGHT: 0,
      BOTTOM_LEFT: 8,
    },
  },
};

// =============================================================================
// PRODUCT IMAGE
// =============================================================================

export const PRODUCT_IMAGE = {
  // Gap between offer badge and product image (2x)
  GAP_FROM_BADGE: 5,
};

// =============================================================================
// VALIDATION
// =============================================================================

export const VALIDATION = {
  BACKGROUND: {
    REQUIRED_WIDTH: 722,
    REQUIRED_HEIGHT: 312,
    ERROR_MESSAGE: 'Background image must be 722×312 format',
  },
  ACCEPTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
};
