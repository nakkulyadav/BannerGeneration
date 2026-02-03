/**
 * Default Values for Banner Inputs
 * Initial state and color presets
 */

// =============================================================================
// DEFAULT COLORS
// =============================================================================

export const DEFAULT_COLORS = {
  // Text colors
  TEXT_BLACK: '#000000',
  TEXT_WHITE: '#FFFFFF',

  // Preset color palette for quick selection
  PRESETS: [
    '#000000', // Black
    '#FFFFFF', // White
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FF8C42', // Orange
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85929E', // Gray
  ],
};

// =============================================================================
// INITIAL BANNER STATE
// =============================================================================

export const INITIAL_BANNER_STATE = {
  // Background image and edge style
  background: {
    image: null,
    imageUrl: '',
    edgeType: 'rounded', // 'sharp' | 'rounded' - default to rounded for modern look
  },

  // Brand logo (optional)
  brandLogo: {
    image: null,
    imageUrl: '',
  },

  // Product heading (required)
  heading: {
    text: '',
    color: DEFAULT_COLORS.TEXT_BLACK,
  },

  // Product subheading (optional, can be split)
  subheading: {
    isSplit: false,
    left: {
      text: '',
      hasRupee: false,
      hasStrikethrough: false,
    },
    right: {
      text: '',
      hasRupee: false,
    },
    color: DEFAULT_COLORS.TEXT_BLACK,
  },

  // CTA button (required)
  ctaButton: {
    text: 'SHOP NOW', // Default CTA text
    textColor: DEFAULT_COLORS.TEXT_WHITE,
    bgColor: '', // No default - user must select
  },

  // T&C text (optional, toggleable)
  tcText: {
    enabled: true, // Toggle to show/hide T&C on banner
    text: '*T&C Apply', // Default T&C text
    color: DEFAULT_COLORS.TEXT_BLACK,
  },

  // Offer badge (optional, toggleable)
  offerBadge: {
    enabled: true, // Toggle to show/hide badge on banner
    text: 'Free Delivery', // Default badge text
    textColor: DEFAULT_COLORS.TEXT_WHITE,
    bgColor: '', // Required if enabled
  },

  // Product image (required)
  productImage: {
    image: null,
    imageUrl: '',
  },
};

// =============================================================================
// REQUIRED FIELDS LIST
// =============================================================================

export const REQUIRED_FIELDS = [
  'background.imageUrl',
  'heading.text',
  'ctaButton.text',
  'ctaButton.bgColor',
  'productImage.imageUrl',
];
