/**
 * Background Panel Component
 *
 * Panel for managing the canvas background in the custom editor.
 * Supports background image upload, AI search, and color picker.
 *
 * @module components/editor/custom/BackgroundPanel
 */

import { useState, useCallback } from 'react';
import { ImageUpload, ColorPicker } from '../../shared';
import ImageCropModal from './ImageCropModal';

// =============================================================================
// BACKGROUND PANEL COMPONENT
// =============================================================================

/**
 * BackgroundPanel Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.background - Current background state
 * @param {Function} props.onSetImage - Callback to set background image
 * @param {Function} props.onSetColor - Callback to set background color
 * @param {Function} props.onOpenSearch - Callback to open AI search panel
 * @param {number} props.width - Canvas width (for dimension hint)
 * @param {number} props.height - Canvas height (for dimension hint)
 */
const BackgroundPanel = ({
  background,
  onSetImage,
  onSetColor,
  onOpenSearch,
  width,
  height,
}) => {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('image'); // 'image' | 'color'
  const [cropImage, setCropImage] = useState(null); // image URL pending crop

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  /**
   * Check if an image needs cropping (exceeds canvas dimensions).
   * If oversized, opens the crop modal; otherwise applies directly.
   * @param {string} imageUrl - The image data URL or remote URL to check
   */
  const checkAndApplyImage = useCallback((imageUrl) => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > width || img.naturalHeight > height) {
        // Oversized — open crop modal
        setCropImage(imageUrl);
      } else {
        // Fits canvas — apply directly
        onSetImage(imageUrl);
      }
    };
    img.onerror = () => {
      // If we can't load to check, apply directly and let canvas handle it
      onSetImage(imageUrl);
    };
    img.src = imageUrl;
  }, [width, height, onSetImage]);

  /**
   * Handle image upload — checks for oversized images
   */
  const handleImageUpload = useCallback((file, imageUrl) => {
    if (imageUrl) {
      checkAndApplyImage(imageUrl);
    }
  }, [checkAndApplyImage]);

  /**
   * Handle image clear
   */
  const handleClearImage = useCallback(() => {
    onSetImage('');
  }, [onSetImage]);

  /**
   * Handle color change
   */
  const handleColorChange = useCallback((color) => {
    onSetColor(color);
  }, [onSetColor]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium text-sm">Background</h3>
            <p className="text-gray-500 text-xs">
              {background.imageUrl ? 'Image set' : background.color !== '#ffffff' ? 'Color set' : 'White (default)'}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-800 p-1">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'image'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Image
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'color'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Solid Color
            </button>
          </div>

          {/* Image Tab Content */}
          {activeTab === 'image' && (
            <div className="space-y-3">
              {/* Dimension Hint */}
              <p className="text-xs text-gray-500">
                Recommended size: {width} × {height}px
              </p>

              {/* Image Upload */}
              <ImageUpload
                value={background.imageUrl ? { imageUrl: background.imageUrl } : null}
                onChange={handleImageUpload}
                onClear={handleClearImage}
                label=""
                compact
              />

              {/* AI Search Button */}
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                AI SEARCH
              </button>
            </div>
          )}

          {/* Color Tab Content */}
          {activeTab === 'color' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">
                Choose a solid background color
              </p>

              <ColorPicker
                label=""
                color={background.color || '#ffffff'}
                onChange={handleColorChange}
              />

              {/* Quick Colors */}
              <div className="flex gap-2">
                {['#ffffff', '#000000', '#f3f4f6', '#1f2937', '#3b82f6', '#ef4444'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      background.color === color
                        ? 'border-purple-500 scale-110'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Crop Modal — shown when uploaded image exceeds canvas dimensions */}
      <ImageCropModal
        isOpen={!!cropImage}
        imageUrl={cropImage || ''}
        canvasWidth={width}
        canvasHeight={height}
        onApply={(croppedUrl) => {
          setCropImage(null);
          onSetImage(croppedUrl);
        }}
        onCancel={() => setCropImage(null)}
      />
    </div>
  );
};

export default BackgroundPanel;
