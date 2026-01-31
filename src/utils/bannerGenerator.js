/**
 * Banner Generator
 *
 * Core banner generation logic using Fabric.js.
 * Composes all banner elements onto a canvas.
 */

import * as fabric from 'fabric';
import { BANNER, LAYOUT, LOGO, TEXT, PRODUCT_IMAGE } from '../constants/bannerConfig';
import { calculateLayout } from './layoutCalculator';
import { scaleImage, loadImage } from './imageProcessor';
import { formatSubheadingText } from './textFormatter';

/**
 * Generate the complete banner on a Fabric canvas
 * @param {HTMLCanvasElement} canvasElement - The canvas DOM element
 * @param {Object} bannerState - Current banner state
 * @returns {Promise<fabric.Canvas>} The Fabric canvas instance
 */
export async function generateBanner(canvasElement, bannerState) {
  // Initialize canvas
  const canvas = new fabric.Canvas(canvasElement, {
    width: BANNER.WIDTH,
    height: BANNER.HEIGHT,
    backgroundColor: '#ffffff',
    selection: false,
  });

  // Clear any existing objects
  canvas.clear();

  try {
    // 1. Add background
    if (bannerState.background.imageUrl) {
      await addBackground(canvas, bannerState.background);
    }

    // Calculate layout positions
    const layout = calculateLayout(bannerState);

    // 2. Add left section elements
    if (bannerState.brandLogo.imageUrl) {
      await addLogo(canvas, bannerState.brandLogo, layout.logo);
    }

    if (bannerState.heading.text) {
      addHeading(canvas, bannerState.heading, layout.heading);
    }

    if (hasSubheadingContent(bannerState.subheading)) {
      addSubheading(canvas, bannerState.subheading, layout.subheading);
    }

    if (bannerState.ctaButton.text && bannerState.ctaButton.bgColor) {
      addCTAButton(canvas, bannerState.ctaButton, layout.cta);
    }

    if (bannerState.tcText.text) {
      addTCText(canvas, bannerState.tcText, layout.tcText);
    }

    // 3. Add right section elements
    if (bannerState.offerBadge.text && bannerState.offerBadge.bgColor) {
      addOfferBadge(canvas, bannerState.offerBadge, bannerState.background.edgeType);
    }

    if (bannerState.productImage.imageUrl) {
      await addProductImage(canvas, bannerState.productImage, bannerState.offerBadge, layout.productImage);
    }

    canvas.renderAll();
  } catch (error) {
    console.error('Error generating banner:', error);
  }

  return canvas;
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
 * Add background image with optional rounded corners
 */
async function addBackground(canvas, background) {
  const img = await loadImage(background.imageUrl);

  const fabricImg = new fabric.FabricImage(img, {
    left: 0,
    top: 0,
    selectable: false,
    evented: false,
  });

  // Scale to fit canvas
  fabricImg.scaleToWidth(BANNER.WIDTH);
  fabricImg.scaleToHeight(BANNER.HEIGHT);

  // Apply rounded corners if selected
  if (background.edgeType === 'rounded') {
    const clipPath = new fabric.Rect({
      width: BANNER.WIDTH,
      height: BANNER.HEIGHT,
      rx: BANNER.EDGE_RADIUS,
      ry: BANNER.EDGE_RADIUS,
      left: 0,
      top: 0,
      absolutePositioned: true,
    });
    fabricImg.clipPath = clipPath;
  }

  canvas.add(fabricImg);
  canvas.sendObjectToBack(fabricImg);
}

/**
 * Add brand logo with scaling
 */
async function addLogo(canvas, brandLogo, position) {
  const img = await loadImage(brandLogo.imageUrl);
  const scaled = scaleImage(img.width, img.height, LOGO.MAX_WIDTH, LOGO.MAX_HEIGHT);

  const fabricImg = new fabric.FabricImage(img, {
    left: position.x,
    top: position.y,
    scaleX: scaled.width / img.width,
    scaleY: scaled.height / img.height,
    selectable: false,
    evented: false,
  });

  canvas.add(fabricImg);
}

/**
 * Add product heading text
 */
function addHeading(canvas, heading, position) {
  const text = new fabric.Textbox(heading.text, {
    left: position.x,
    top: position.y,
    width: TEXT.HEADING.MAX_WIDTH,
    fontSize: TEXT.HEADING.FONT_SIZE,
    fontFamily: TEXT.HEADING.FONT_FAMILY,
    fontWeight: TEXT.HEADING.FONT_WEIGHT,
    fill: heading.color,
    textAlign: 'left',
    lineHeight: TEXT.HEADING.LINE_HEIGHT,
    selectable: false,
    evented: false,
    splitByGrapheme: false,
  });

  canvas.add(text);
}

/**
 * Add subheading (single or split mode)
 * Uses separate font configs for left/right/single modes
 */
function addSubheading(canvas, subheading, position) {
  if (!subheading.isSplit) {
    // Single mode - uses SUBHEADING_SINGLE config
    const displayText = formatSubheadingText(
      subheading.left.text,
      subheading.left.hasRupee
    );

    if (displayText) {
      const text = new fabric.Text(displayText, {
        left: position.x,
        top: position.y,
        fontSize: TEXT.SUBHEADING_SINGLE.FONT_SIZE,
        fontFamily: TEXT.SUBHEADING_SINGLE.FONT_FAMILY,
        fontWeight: TEXT.SUBHEADING_SINGLE.FONT_WEIGHT,
        fill: subheading.color,
        selectable: false,
        evented: false,
      });

      canvas.add(text);
    }
  } else {
    // Split mode - left and right parts with different configs
    let currentX = position.x;

    // Left part - uses SUBHEADING_LEFT config (Medium, 28px)
    if (subheading.left.text.trim()) {
      const leftText = formatSubheadingText(
        subheading.left.text,
        subheading.left.hasRupee
      );

      const leftTextObj = new fabric.Text(leftText, {
        left: currentX,
        top: position.y,
        fontSize: TEXT.SUBHEADING_LEFT.FONT_SIZE,
        fontFamily: TEXT.SUBHEADING_LEFT.FONT_FAMILY,
        fontWeight: TEXT.SUBHEADING_LEFT.FONT_WEIGHT,
        fill: subheading.color,
        linethrough: subheading.left.hasStrikethrough,
        selectable: false,
        evented: false,
      });

      canvas.add(leftTextObj);
      currentX += leftTextObj.width + LAYOUT.SUBHEADING_SPLIT_GAP;
    }

    // Right part - uses SUBHEADING_RIGHT config (Bold, 36px)
    if (subheading.right.text.trim()) {
      const rightText = formatSubheadingText(
        subheading.right.text,
        subheading.right.hasRupee
      );

      // Align right text baseline with left text (since right is larger)
      const baselineOffset = TEXT.SUBHEADING_RIGHT.FONT_SIZE - TEXT.SUBHEADING_LEFT.FONT_SIZE;

      const rightTextObj = new fabric.Text(rightText, {
        left: currentX,
        top: position.y - (baselineOffset * 0.2), // Slight adjustment for visual alignment
        fontSize: TEXT.SUBHEADING_RIGHT.FONT_SIZE,
        fontFamily: TEXT.SUBHEADING_RIGHT.FONT_FAMILY,
        fontWeight: TEXT.SUBHEADING_RIGHT.FONT_WEIGHT,
        fill: subheading.color,
        selectable: false,
        evented: false,
      });

      canvas.add(rightTextObj);
    }
  }
}

/**
 * Add CTA button with text
 */
function addCTAButton(canvas, ctaButton, position) {
  // Create text first to measure dimensions
  const text = new fabric.Text(ctaButton.text, {
    fontSize: TEXT.CTA.FONT_SIZE,
    fontFamily: TEXT.CTA.FONT_FAMILY,
    fontWeight: TEXT.CTA.FONT_WEIGHT,
    fill: ctaButton.textColor,
    selectable: false,
    evented: false,
  });

  // Calculate button dimensions
  const buttonWidth = text.width + (TEXT.CTA.PADDING.HORIZONTAL * 2);
  const buttonHeight = text.height + (TEXT.CTA.PADDING.VERTICAL * 2);

  // Create button background
  const button = new fabric.Rect({
    left: position.x,
    top: position.y,
    width: buttonWidth,
    height: buttonHeight,
    fill: ctaButton.bgColor,
    rx: TEXT.CTA.BORDER_RADIUS,
    ry: TEXT.CTA.BORDER_RADIUS,
    selectable: false,
    evented: false,
  });

  // Position text centered in button
  text.set({
    left: position.x + TEXT.CTA.PADDING.HORIZONTAL,
    top: position.y + TEXT.CTA.PADDING.VERTICAL,
  });

  canvas.add(button);
  canvas.add(text);
}

/**
 * Add T&C text
 */
function addTCText(canvas, tcText, position) {
  const text = new fabric.Text(tcText.text, {
    left: position.x,
    top: position.y,
    fontSize: TEXT.TC.FONT_SIZE,
    fontFamily: TEXT.TC.FONT_FAMILY,
    fontWeight: TEXT.TC.FONT_WEIGHT,
    fill: tcText.color,
    selectable: false,
    evented: false,
  });

  canvas.add(text);
}

/**
 * Add offer badge at top-right corner
 * @param {fabric.Canvas} canvas
 * @param {Object} offerBadge
 * @param {string} edgeType - 'sharp' or 'rounded'
 */
function addOfferBadge(canvas, offerBadge, edgeType) {
  // Create text first to measure dimensions
  const text = new fabric.Text(offerBadge.text, {
    fontSize: TEXT.OFFER_BADGE.FONT_SIZE,
    fontFamily: TEXT.OFFER_BADGE.FONT_FAMILY,
    fontWeight: TEXT.OFFER_BADGE.FONT_WEIGHT,
    fill: offerBadge.textColor,
    selectable: false,
    evented: false,
  });

  // Calculate badge dimensions
  const badgeWidth = text.width + (TEXT.OFFER_BADGE.PADDING.HORIZONTAL * 2);
  const badgeHeight = text.height + (TEXT.OFFER_BADGE.PADDING.VERTICAL * 2);

  // Position at top-right
  const badgeX = BANNER.WIDTH - badgeWidth;
  const badgeY = 0;

  // Corner radii
  const rBottomLeft = TEXT.OFFER_BADGE.BORDER_RADIUS.BOTTOM_LEFT;
  // Round top-right corner if banner has rounded edges
  const rTopRight = edgeType === 'rounded' ? BANNER.EDGE_RADIUS : 0;

  // Create badge background with custom corner radius
  // Using a path for precise corner control
  let path;
  if (rTopRight > 0) {
    // Rounded top-right and bottom-left
    path = `M 0 0 L ${badgeWidth - rTopRight} 0 Q ${badgeWidth} 0 ${badgeWidth} ${rTopRight} L ${badgeWidth} ${badgeHeight} L ${rBottomLeft} ${badgeHeight} Q 0 ${badgeHeight} 0 ${badgeHeight - rBottomLeft} Z`;
  } else {
    // Only bottom-left rounded
    path = `M 0 0 L ${badgeWidth} 0 L ${badgeWidth} ${badgeHeight} L ${rBottomLeft} ${badgeHeight} Q 0 ${badgeHeight} 0 ${badgeHeight - rBottomLeft} Z`;
  }

  const badge = new fabric.Path(path, {
    left: badgeX,
    top: badgeY,
    fill: offerBadge.bgColor,
    selectable: false,
    evented: false,
  });

  // Position text centered in badge
  text.set({
    left: badgeX + TEXT.OFFER_BADGE.PADDING.HORIZONTAL,
    top: badgeY + TEXT.OFFER_BADGE.PADDING.VERTICAL,
  });

  canvas.add(badge);
  canvas.add(text);
}

/**
 * Add product image in right section
 * Horizontally centered, bottom-aligned
 */
async function addProductImage(canvas, productImage, offerBadge, position) {
  const img = await loadImage(productImage.imageUrl);

  // Calculate max dimensions (no side margins)
  const maxWidth = position.maxWidth;
  const maxHeight = position.maxHeight;

  // Scale image to fit while maintaining aspect ratio
  const scaled = scaleImage(img.width, img.height, maxWidth, maxHeight);

  const fabricImg = new fabric.FabricImage(img, {
    scaleX: scaled.width / img.width,
    scaleY: scaled.height / img.height,
    selectable: false,
    evented: false,
  });

  // Horizontally center, bottom align
  const centerX = position.centerX - (scaled.width / 2);
  const bottomY = position.bottomY - scaled.height; // Bottom aligned

  fabricImg.set({
    left: centerX,
    top: bottomY,
  });

  canvas.add(fabricImg);
}

/**
 * Export canvas as WEBP data URL
 * Canvas is at 1x size (722x312), export directly
 * @param {fabric.Canvas} canvas
 * @returns {string} Data URL
 */
export function exportAsWEBP(canvas) {
  return canvas.toDataURL({
    format: 'webp',
    quality: 1.0,
    multiplier: 1, // Canvas is at actual output size
  });
}

/**
 * Download banner as WEBP file
 * Triggers browser download with specified filename
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {string} filename - Filename for the download (with .webp extension)
 */
export function downloadBanner(canvas, filename) {
  if (!canvas) {
    throw new Error('Canvas is required for download');
  }

  // Export canvas as high-quality WEBP
  const dataURL = exportAsWEBP(canvas);

  // Create temporary link element for download
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default generateBanner;
