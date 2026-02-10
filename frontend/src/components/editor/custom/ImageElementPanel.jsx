/**
 * Image Element Panel Component
 *
 * Collapsible panel for managing individual image elements on the canvas.
 * Supports image upload, AI search, enhancement, background removal,
 * and basic element controls (rename, lock, delete).
 *
 * @module components/editor/custom/ImageElementPanel
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ImageUpload } from '../../shared';
import { removeBackground, enhanceImage } from '../../../services/imageSearchService';
import { isImageEnhanced, saveEnhancedImage } from '../../../utils/enhancementCache';

// =============================================================================
// IMAGE ELEMENT PANEL COMPONENT
// =============================================================================

/**
 * ImageElementPanel Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.element - Element state object
 * @param {boolean} props.isSelected - Whether element is currently selected
 * @param {Function} props.onSelect - Callback to select element
 * @param {Function} props.onUpdate - Callback to update element metadata
 * @param {Function} props.onUpdateProperties - Callback to update element properties
 * @param {Function} props.onDelete - Callback to delete element
 * @param {Function} props.onRename - Callback to rename element
 * @param {Function} props.onToggleLock - Callback to toggle lock state
 * @param {Function} props.onOpenSearch - Callback to open AI search
 */
const ImageElementPanel = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onUpdateProperties,
  onDelete,
  onRename,
  onToggleLock,
  onOpenSearch,
}) => {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const [isExpanded, setIsExpanded] = useState(isSelected);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(element.name);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  /**
   * Handle image upload — applies directly (crop is only for background images)
   */
  const handleImageUpload = useCallback((_file, imageUrl) => {
    if (imageUrl) {
      onUpdateProperties({ imageUrl });
    }
  }, [onUpdateProperties]);

  /**
   * Handle image clear
   */
  const handleClearImage = useCallback(() => {
    onUpdateProperties({ imageUrl: '' });
  }, [onUpdateProperties]);

  /**
   * Handle rename submit
   */
  const handleRenameSubmit = useCallback(() => {
    if (newName.trim() && newName !== element.name) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
  }, [newName, element.name, onRename]);

  /**
   * Handle background removal
   */
  const handleRemoveBackground = useCallback(async () => {
    if (!element.properties?.imageUrl) return;

    setIsRemovingBg(true);
    try {
      const result = await removeBackground(element.properties.imageUrl);
      if (result.processedImageUrl) {
        onUpdateProperties({ imageUrl: result.processedImageUrl });
        toast.success('Background removed!');
      }
    } catch (error) {
      console.error('Background removal failed:', error);
      if (error.message?.includes('402')) {
        toast.error('Background removal quota exhausted.');
      } else if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please wait a moment.');
      } else {
        toast.error('Failed to remove background.');
      }
    } finally {
      setIsRemovingBg(false);
    }
  }, [element.properties?.imageUrl, onUpdateProperties]);

  /**
   * Handle image enhancement
   */
  const handleEnhanceImage = useCallback(async () => {
    const imageUrl = element.properties?.imageUrl;
    if (!imageUrl) return;

    // Check if already enhanced
    if (isImageEnhanced(imageUrl, 'image')) {
      toast('Image already enhanced', { icon: 'ℹ️' });
      return;
    }

    setIsEnhancing(true);
    setEnhancementProgress(0);

    // Simulate progress (0 -> 90% over ~15 seconds)
    const progressInterval = setInterval(() => {
      setEnhancementProgress(prev => Math.min(prev + 6, 90));
    }, 1000);

    try {
      const result = await enhanceImage(imageUrl, 'product');
      if (result.enhancedImageUrl) {
        // Save to cache
        saveEnhancedImage(imageUrl, result.enhancedImageUrl, 'image');
        onUpdateProperties({ imageUrl: result.enhancedImageUrl });
        setEnhancementProgress(100);
        toast.success('Image enhanced!');
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
      if (error.message?.includes('402')) {
        toast.error('Enhancement quota exhausted.', { duration: 5000 });
      } else if (error.message?.includes('504')) {
        toast.error('Enhancement timed out. Image may be too large.');
      } else {
        toast.error('Failed to enhance image.');
      }
    } finally {
      clearInterval(progressInterval);
      setIsEnhancing(false);
      setEnhancementProgress(0);
    }
  }, [element.properties?.imageUrl, onUpdateProperties]);

  /**
   * Handle panel click (select element)
   */
  const handlePanelClick = useCallback(() => {
    onSelect();
    setIsExpanded(true);
  }, [onSelect]);

  /**
   * Handle header click (toggle expand)
   */
  const handleHeaderClick = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onSelect();
    }
  }, [isExpanded, onSelect]);

  // ===========================================================================
  // CHECK IF IMAGE IS ENHANCED
  // ===========================================================================

  const imageUrl = element.properties?.imageUrl;
  const alreadyEnhanced = imageUrl ? isImageEnhanced(imageUrl, 'image') : false;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div
      onClick={handlePanelClick}
      className={`bg-[#1e1e1e] rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-purple-500 ring-1 ring-purple-500/20'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Header */}
      <div
        onClick={handleHeaderClick}
        className="flex items-center justify-between px-3 py-2.5"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Image Icon */}
          <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Name */}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setNewName(element.name);
                  setIsRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 bg-gray-800 text-white text-sm px-2 py-0.5 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <span
              className="text-white text-sm truncate cursor-text"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              title="Double-click to rename"
            >
              {element.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {/* Lock Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className={`p-1 rounded transition-colors ${
              element.locked
                ? 'text-yellow-400 hover:bg-yellow-400/10'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
            }`}
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${element.name}"?`)) {
                onDelete();
              }
            }}
            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Expand/Collapse */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-gray-800">
          {/* Image Upload */}
          <ImageUpload
            value={imageUrl ? { imageUrl } : null}
            onChange={handleImageUpload}
            onClear={handleClearImage}
            label=""
            compact
          />

          {/* AI Search Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenSearch();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            AI SEARCH
          </button>

          {/* Enhancement & Remove BG Buttons (only if image is set) */}
          {imageUrl && (
            <div className="flex gap-2">
              {/* Enhance Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnhanceImage();
                }}
                disabled={isEnhancing || alreadyEnhanced}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-xs font-medium rounded-lg transition-all disabled:cursor-not-allowed"
                title={alreadyEnhanced ? 'Image already enhanced' : 'Enhance image quality'}
              >
                {isEnhancing ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {enhancementProgress}%
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    ENHANCE
                  </>
                )}
              </button>

              {/* Remove BG Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBackground();
                }}
                disabled={isRemovingBg}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-xs font-medium rounded-lg transition-all disabled:cursor-not-allowed"
              >
                {isRemovingBg ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Removing...
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    REMOVE BG
                  </>
                )}
              </button>
            </div>
          )}

          {/* Enhancement Progress Bar */}
          {isEnhancing && (
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${enhancementProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">Enhancing image quality...</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ImageElementPanel;
