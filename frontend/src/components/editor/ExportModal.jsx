/**
 * Export Modal Component
 *
 * Modal dialog for exporting canvas to various image formats.
 * Supports WEBP, PNG, and JPEG with quality settings for lossy formats.
 *
 * @module components/editor/ExportModal
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  EXPORT_FORMATS,
  DEFAULT_QUALITY,
  downloadCanvas,
  exportToDataURL,
  estimateFileSize,
  formatFileSize,
  generateFilename,
  sanitizeFilename,
} from '../../utils/exportCanvas';

// =============================================================================
// FORMAT OPTIONS
// =============================================================================

const FORMAT_OPTIONS = [
  {
    id: EXPORT_FORMATS.WEBP,
    name: 'WEBP',
    description: 'Best quality/size ratio, modern format',
    supportsQuality: true,
    recommended: true,
  },
  {
    id: EXPORT_FORMATS.PNG,
    name: 'PNG',
    description: 'Lossless, supports transparency',
    supportsQuality: false,
  },
  {
    id: EXPORT_FORMATS.JPEG,
    name: 'JPEG',
    description: 'Small file size, no transparency',
    supportsQuality: true,
  },
];

// =============================================================================
// EXPORT MODAL COMPONENT
// =============================================================================

/**
 * ExportModal Component
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.getCanvas - Function that returns the Fabric.js canvas instance
 * @param {Object} props.project - Project metadata
 * @param {string} props.project.name - Project name
 * @param {number} props.project.width - Canvas width
 * @param {number} props.project.height - Canvas height
 */
const ExportModal = ({
  isOpen,
  onClose,
  getCanvas,
  project,
}) => {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const [format, setFormat] = useState(EXPORT_FORMATS.WEBP);
  const [quality, setQuality] = useState(DEFAULT_QUALITY[EXPORT_FORMATS.WEBP]);
  const [filename, setFilename] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [estimatedSize, setEstimatedSize] = useState(0);

  // ===========================================================================
  // INITIALIZE FILENAME
  // ===========================================================================

  useEffect(() => {
    if (isOpen && project) {
      const defaultName = generateFilename({
        projectName: project.name,
        width: project.width,
        height: project.height,
        format,
      });
      setFilename(defaultName);
    }
  }, [isOpen, project, format]);

  // ===========================================================================
  // UPDATE PREVIEW
  // ===========================================================================

  useEffect(() => {
    if (!isOpen) return;

    // Get canvas when modal opens
    const canvas = getCanvas ? getCanvas() : null;
    if (!canvas) {
      setPreviewUrl(null);
      return;
    }

    // Generate preview with current settings
    const generatePreview = () => {
      try {
        const selectedFormat = FORMAT_OPTIONS.find(f => f.id === format);
        const dataURL = exportToDataURL(canvas, {
          format,
          quality: selectedFormat?.supportsQuality ? quality : undefined,
          multiplier: 0.5, // Lower resolution for preview
        });
        setPreviewUrl(dataURL);

        // Estimate full-size file
        const fullDataURL = exportToDataURL(canvas, {
          format,
          quality: selectedFormat?.supportsQuality ? quality : undefined,
          multiplier: 1,
        });
        setEstimatedSize(estimateFileSize(fullDataURL));
      } catch (error) {
        console.error('Failed to generate preview:', error);
        setPreviewUrl(null);
      }
    };

    // Debounce preview generation
    const timeoutId = setTimeout(generatePreview, 200);
    return () => clearTimeout(timeoutId);
  }, [isOpen, getCanvas, format, quality]);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  /**
   * Handle format change
   */
  const handleFormatChange = useCallback((newFormat) => {
    setFormat(newFormat);
    setQuality(DEFAULT_QUALITY[newFormat] || 0.92);
  }, []);

  /**
   * Handle quality change
   */
  const handleQualityChange = useCallback((e) => {
    setQuality(parseFloat(e.target.value));
  }, []);

  /**
   * Handle filename change
   */
  const handleFilenameChange = useCallback((e) => {
    setFilename(e.target.value);
  }, []);

  /**
   * Handle export
   */
  const handleExport = useCallback(async () => {
    const canvas = getCanvas ? getCanvas() : null;
    if (!canvas) {
      console.error('Export failed: Canvas not available');
      return;
    }

    setIsExporting(true);
    try {
      const selectedFormat = FORMAT_OPTIONS.find(f => f.id === format);
      downloadCanvas(canvas, {
        filename: sanitizeFilename(filename),
        format,
        quality: selectedFormat?.supportsQuality ? quality : undefined,
        multiplier: 1,
      });

      // Small delay before closing to show completion
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [getCanvas, filename, format, quality, onClose]);

  /**
   * Handle click outside modal
   */
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  /**
   * Handle escape key
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ===========================================================================
  // DERIVED VALUES
  // ===========================================================================

  const selectedFormat = useMemo(() => {
    return FORMAT_OPTIONS.find(f => f.id === format);
  }, [format]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white">Export Image</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Preview */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center border border-gray-800">
            {/* Checkerboard Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #333 25%, transparent 25%),
                  linear-gradient(-45deg, #333 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #333 75%),
                  linear-gradient(-45deg, transparent 75%, #333 75%)
                `,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              }}
            />
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Export preview"
                className="relative max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-gray-500">
                <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFormatChange(option.id)}
                  className={`relative px-4 py-3 rounded-lg border transition-all text-left ${
                    format === option.id
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {option.recommended && (
                    <span className="absolute top-1 right-1 text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded">
                      Best
                    </span>
                  )}
                  <span className="block font-medium">{option.name}</span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for WEBP and JPEG) */}
          {selectedFormat?.supportsQuality && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Quality
                </label>
                <span className="text-sm text-gray-400">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={quality}
                onChange={handleQualityChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>
          )}

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filename
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={handleFilenameChange}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-purple-500 focus:outline-none"
                placeholder="Enter filename"
              />
              <span className="text-gray-500 text-sm">
                {selectedFormat?.id === EXPORT_FORMATS.JPEG ? '.jpg' : `.${selectedFormat?.id}`}
              </span>
            </div>
          </div>

          {/* File Info */}
          <div className="flex items-center justify-between text-sm text-gray-400 bg-gray-800/50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-4">
              <span>
                <span className="text-gray-500">Size:</span>{' '}
                {project?.width} × {project?.height} px
              </span>
              <span>
                <span className="text-gray-500">~</span>{' '}
                {formatFileSize(estimatedSize)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-gray-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !filename.trim() || !previewUrl}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
