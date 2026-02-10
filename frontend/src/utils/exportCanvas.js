/**
 * Export Canvas Utilities
 *
 * Functions for exporting Fabric.js canvas to various image formats.
 * Supports WEBP, PNG, and JPEG with configurable quality settings.
 *
 * @module utils/exportCanvas
 */

// =============================================================================
// EXPORT FORMATS
// =============================================================================

/**
 * Supported export formats
 */
export const EXPORT_FORMATS = {
  WEBP: 'webp',
  PNG: 'png',
  JPEG: 'jpeg',
};

/**
 * Default quality settings per format
 */
export const DEFAULT_QUALITY = {
  [EXPORT_FORMATS.WEBP]: 0.92,
  [EXPORT_FORMATS.PNG]: 1.0,
  [EXPORT_FORMATS.JPEG]: 0.92,
};

/**
 * MIME types for each format
 */
const MIME_TYPES = {
  [EXPORT_FORMATS.WEBP]: 'image/webp',
  [EXPORT_FORMATS.PNG]: 'image/png',
  [EXPORT_FORMATS.JPEG]: 'image/jpeg',
};

/**
 * File extensions for each format
 */
const FILE_EXTENSIONS = {
  [EXPORT_FORMATS.WEBP]: '.webp',
  [EXPORT_FORMATS.PNG]: '.png',
  [EXPORT_FORMATS.JPEG]: '.jpg',
};

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

/**
 * Export canvas to specified format
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {Object} options - Export options
 * @param {string} options.format - Export format ('webp' | 'png' | 'jpeg')
 * @param {number} options.quality - Quality (0-1), only applies to WEBP and JPEG
 * @param {number} options.multiplier - Scale multiplier for higher resolution
 * @returns {string} Data URL of the exported image
 */
export const exportToDataURL = (canvas, options = {}) => {
  if (!canvas) {
    throw new Error('Canvas is required for export');
  }

  const {
    format = EXPORT_FORMATS.WEBP,
    quality = DEFAULT_QUALITY[format] || 0.92,
    multiplier = 1,
  } = options;

  const mimeType = MIME_TYPES[format];
  if (!mimeType) {
    throw new Error(`Unsupported format: ${format}`);
  }

  // Export canvas to data URL
  const dataURL = canvas.toDataURL({
    format: format === EXPORT_FORMATS.JPEG ? 'jpeg' : format,
    quality: format === EXPORT_FORMATS.PNG ? undefined : quality,
    multiplier,
  });

  return dataURL;
};

/**
 * Export canvas to Blob
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {Object} options - Export options
 * @returns {Promise<Blob>} Blob of the exported image
 */
export const exportToBlob = async (canvas, options = {}) => {
  const dataURL = exportToDataURL(canvas, options);
  const response = await fetch(dataURL);
  return response.blob();
};

/**
 * Download canvas as image file
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {Object} options - Export options
 * @param {string} options.filename - Base filename (without extension)
 * @param {string} options.format - Export format ('webp' | 'png' | 'jpeg')
 * @param {number} options.quality - Quality (0-1)
 * @param {number} options.multiplier - Scale multiplier
 */
export const downloadCanvas = (canvas, options = {}) => {
  const {
    filename = 'export',
    format = EXPORT_FORMATS.WEBP,
    quality = DEFAULT_QUALITY[format],
    multiplier = 1,
  } = options;

  // Generate data URL
  const dataURL = exportToDataURL(canvas, { format, quality, multiplier });

  // Create download link
  const link = document.createElement('a');
  link.download = sanitizeFilename(filename) + FILE_EXTENSIONS[format];
  link.href = dataURL;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export canvas as WEBP
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {string} filename - Base filename
 * @param {number} quality - Quality (0-1)
 */
export const exportAsWebp = (canvas, filename, quality = 0.92) => {
  downloadCanvas(canvas, {
    filename,
    format: EXPORT_FORMATS.WEBP,
    quality,
  });
};

/**
 * Export canvas as PNG
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {string} filename - Base filename
 * @param {number} multiplier - Scale multiplier for higher resolution
 */
export const exportAsPng = (canvas, filename, multiplier = 1) => {
  downloadCanvas(canvas, {
    filename,
    format: EXPORT_FORMATS.PNG,
    multiplier,
  });
};

/**
 * Export canvas as JPEG
 *
 * @param {fabric.Canvas} canvas - Fabric.js canvas instance
 * @param {string} filename - Base filename
 * @param {number} quality - Quality (0-1)
 */
export const exportAsJpeg = (canvas, filename, quality = 0.92) => {
  downloadCanvas(canvas, {
    filename,
    format: EXPORT_FORMATS.JPEG,
    quality,
  });
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Sanitize filename by removing special characters
 *
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename) return 'export';

  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .substring(0, 100) // Limit length
    || 'export';
};

/**
 * Generate filename from project data
 *
 * @param {Object} options - Options for filename generation
 * @param {string} options.projectName - Project name
 * @param {number} options.width - Canvas width
 * @param {number} options.height - Canvas height
 * @param {string} options.format - Export format
 * @returns {string} Generated filename (without extension)
 */
export const generateFilename = ({ projectName, width, height, format }) => {
  const name = projectName || 'project';
  const dimensions = `${width}x${height}`;
  const timestamp = new Date().toISOString().slice(0, 10);

  return sanitizeFilename(`${name}_${dimensions}_${timestamp}`);
};

/**
 * Estimate file size from data URL
 *
 * @param {string} dataURL - Data URL of the image
 * @returns {number} Estimated file size in bytes
 */
export const estimateFileSize = (dataURL) => {
  // Base64 encoding increases size by ~33%
  // Data URL format: "data:image/format;base64,DATA"
  const base64Data = dataURL.split(',')[1] || '';
  return Math.round(base64Data.length * 0.75);
};

/**
 * Format file size for display
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

export default {
  EXPORT_FORMATS,
  DEFAULT_QUALITY,
  exportToDataURL,
  exportToBlob,
  downloadCanvas,
  exportAsWebp,
  exportAsPng,
  exportAsJpeg,
  sanitizeFilename,
  generateFilename,
  estimateFileSize,
  formatFileSize,
};
