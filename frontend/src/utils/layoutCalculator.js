/**
 * Layout Calculator
 *
 * Calculates positions and dimensions for all banner elements.
 * Implements vertical centering with flexible spacing.
 */

import { BANNER, LAYOUT, LOGO, TEXT, PRODUCT_IMAGE } from '../constants/bannerConfig';

/**
 * Calculate layout positions for all banner elements
 * @param {Object} bannerState - Current banner state
 * @returns {Object} Position data for each element
 */
export function calculateLayout(bannerState) {
  // Collect present elements in left section
  const leftElements = [];

  if (bannerState.brandLogo.imageUrl) {
    leftElements.push({ type: 'logo', height: estimateLogoHeight() });
  }

  if (bannerState.heading.text) {
    leftElements.push({ type: 'heading', height: estimateHeadingHeight(bannerState.heading.text) });
  }

  if (hasSubheadingContent(bannerState.subheading)) {
    // Use the larger font size (right subheading) for height estimation in split mode
    const subheadingFontSize = bannerState.subheading.isSplit
      ? TEXT.SUBHEADING_RIGHT.FONT_SIZE
      : TEXT.SUBHEADING_SINGLE.FONT_SIZE;
    leftElements.push({ type: 'subheading', height: subheadingFontSize * 1.2 });
  }

  if (bannerState.ctaButton.text && bannerState.ctaButton.bgColor) {
    leftElements.push({ type: 'cta', height: estimateCTAHeight() });
  }

  // Only include T&C if enabled AND has text
  if (bannerState.tcText.enabled && bannerState.tcText.text) {
    leftElements.push({ type: 'tcText', height: TEXT.TC.FONT_SIZE * 1.2 });
  }

  // Calculate total height and spacing
  const totalElementHeight = leftElements.reduce((sum, el) => sum + el.height, 0);
  const spacings = calculateSpacings(leftElements);
  const totalSpacing = spacings.reduce((sum, s) => sum + s, 0);
  const contentHeight = totalElementHeight + totalSpacing;

  // Calculate vertical centering offset
  const topOffset = Math.max(LAYOUT.TOP_MARGIN, (BANNER.HEIGHT - contentHeight) / 2);

  // Generate positions for each element
  const positions = {};
  let currentY = topOffset;

  leftElements.forEach((element, index) => {
    positions[element.type] = {
      x: LAYOUT.LEFT_MARGIN,
      y: currentY,
      height: element.height,
    };
    currentY += element.height;
    if (index < leftElements.length - 1) {
      currentY += spacings[index];
    }
  });

  // Calculate product image position
  // Only account for badge height if enabled AND has text AND bgColor
  const offerBadgeHeight = bannerState.offerBadge.enabled && bannerState.offerBadge.text && bannerState.offerBadge.bgColor
    ? estimateOfferBadgeHeight(bannerState.offerBadge.text)
    : 0;

  positions.productImage = calculateProductImagePosition(offerBadgeHeight);

  return positions;
}

/**
 * Check if subheading has content
 */
function hasSubheadingContent(subheading) {
  if (subheading.isSplit) {
    return subheading.left.text.trim() !== '' || subheading.right.text.trim() !== '';
  }
  return subheading.left.text.trim() !== '';
}

/**
 * Estimate logo height (using max height as estimate)
 */
function estimateLogoHeight() {
  return LOGO.MAX_HEIGHT;
}

/**
 * Estimate heading height based on text length
 * Accounts for potential text wrapping
 */
function estimateHeadingHeight(text) {
  // Rough estimate: if text is long, assume 2 lines
  const charsPerLine = 20; // Approximate characters per line at 156px width
  const lines = Math.min(Math.ceil(text.length / charsPerLine), TEXT.HEADING.MAX_LINES);
  return TEXT.HEADING.FONT_SIZE * TEXT.HEADING.LINE_HEIGHT * lines;
}

/**
 * Estimate CTA button height
 */
function estimateCTAHeight() {
  return TEXT.CTA.FONT_SIZE + (TEXT.CTA.PADDING.VERTICAL * 2);
}

/**
 * Estimate offer badge height
 */
function estimateOfferBadgeHeight(text) {
  return TEXT.OFFER_BADGE.FONT_SIZE + (TEXT.OFFER_BADGE.PADDING.VERTICAL * 2);
}

/**
 * Calculate spacing between elements
 * @param {Array} elements - Array of present elements
 * @returns {Array} Array of spacing values
 */
function calculateSpacings(elements) {
  const spacings = [];

  for (let i = 0; i < elements.length - 1; i++) {
    const current = elements[i].type;
    const next = elements[i + 1].type;

    // Determine spacing based on element pair
    let spacing = 10; // Default spacing

    if (current === 'logo' && next === 'heading') {
      spacing = LAYOUT.SPACING.LOGO_TO_HEADING;
    } else if (current === 'heading' && next === 'subheading') {
      spacing = LAYOUT.SPACING.HEADING_TO_SUBHEADING;
    } else if (current === 'heading' && next === 'cta') {
      // No subheading - use combined spacing
      spacing = LAYOUT.SPACING.SUBHEADING_TO_CTA;
    } else if (current === 'subheading' && next === 'cta') {
      spacing = LAYOUT.SPACING.SUBHEADING_TO_CTA;
    } else if (current === 'cta' && next === 'tcText') {
      spacing = LAYOUT.SPACING.CTA_TO_TC;
    }

    spacings.push(spacing);
  }

  return spacings;
}

/**
 * Calculate product image position in right section
 * Image is bottom-aligned with no side margins
 * @param {number} offerBadgeHeight - Height of offer badge (0 if not present)
 * @returns {Object} Position data for product image
 */
function calculateProductImagePosition(offerBadgeHeight) {
  // Right section starts at 50% of banner width
  const rightSectionStart = LAYOUT.SECTION_DIVIDE;
  const rightSectionWidth = BANNER.WIDTH - rightSectionStart;

  // Calculate available height (minus badge and gap)
  const topOffset = offerBadgeHeight > 0 ? offerBadgeHeight + PRODUCT_IMAGE.GAP_FROM_BADGE : 0;
  const availableHeight = BANNER.HEIGHT - topOffset;

  // Center X horizontally (no side margins)
  const centerX = rightSectionStart + (rightSectionWidth / 2);

  return {
    maxWidth: rightSectionWidth, // Full width - no side margins
    maxHeight: availableHeight,  // Full height available
    centerX,
    bottomY: BANNER.HEIGHT,      // Bottom edge of banner for bottom alignment
    topOffset,
    alignment: 'bottom',         // Flag for bottom alignment
  };
}

export default calculateLayout;
