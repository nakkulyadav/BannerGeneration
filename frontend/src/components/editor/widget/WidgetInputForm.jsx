/**
 * Widget Input Form Component
 *
 * Main editor form for the Widget preset (164×164).
 * Renders three sections:
 * 1. Background — image upload (164×164, auto-resize) + edge type toggle
 * 2. Text Fields — two swappable text fields (small 24px, large 44px)
 * 3. Product Image — optional image with AI search, enhance, remove-bg
 *
 * @module components/editor/widget/WidgetInputForm
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ImageUpload, ColorPicker } from '../../shared';
import WidgetTextSection from './WidgetTextSection';
import { WIDGET_CONFIG } from '../../../constants/presetConfigs';
import { removeBackground, enhanceImage } from '../../../services/imageSearchService';
import { saveEnhancedImage, isImageEnhanced } from '../../../utils/enhancementCache';

// =============================================================================
// CONSTANTS
// =============================================================================

const WIDGET_WIDTH = WIDGET_CONFIG.dimensions.width;   // 164
const WIDGET_HEIGHT = WIDGET_CONFIG.dimensions.height;  // 164
const TEXT_CONFIG = WIDGET_CONFIG.textConfig;

// =============================================================================
// SECTION CARD (reusable wrapper)
// =============================================================================

/**
 * Consistent card wrapper matching InputForm's SectionCard pattern.
 */
function SectionCard({ title, description, hasRequired = false, children }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-[#3a3a3a] focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50">
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#151515] border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
            {title}
          </h2>
          {hasRequired && (
            <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
              <span className="text-red-400">*</span>
              <span className="hidden sm:inline">Required</span>
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1 hidden sm:block">{description}</p>
        )}
      </div>
      <div className="p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// WIDGET INPUT FORM
// =============================================================================

/**
 * @param {Object} props
 * @param {Object} props.bannerState - Current banner/canvas state
 * @param {Object} props.handlers - State update handler functions
 */
function WidgetInputForm({ bannerState, handlers }) {
  const { updateSection, updateBackground, updateProductImage, openSearchPanel } = handlers;

  // ===========================================================================
  // BACKGROUND HANDLERS
  // ===========================================================================

  /**
   * Handle background image upload.
   * Auto-resizes non-164×164 images silently via an offscreen canvas.
   */
  const handleBackgroundUpload = useCallback(
    async (file, dataUrl) => {
      const imageUrl = dataUrl || URL.createObjectURL(file);

      // Load the image to check dimensions
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // If already the correct size, use directly
        if (img.width === WIDGET_WIDTH && img.height === WIDGET_HEIGHT) {
          updateBackground({ image: file, imageUrl });
          return;
        }

        // Auto-resize via offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = WIDGET_WIDTH;
        canvas.height = WIDGET_HEIGHT;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, WIDGET_WIDTH, WIDGET_HEIGHT);

        canvas.toBlob((blob) => {
          const resizedUrl = URL.createObjectURL(blob);
          updateBackground({ image: null, imageUrl: resizedUrl });
        }, 'image/png');
      };

      img.onerror = () => {
        toast.error('Failed to load image. Please try another file.');
      };

      img.src = imageUrl;
    },
    [updateBackground]
  );

  /** Clear background image */
  const handleBackgroundClear = useCallback(() => {
    if (bannerState.background?.imageUrl) {
      URL.revokeObjectURL(bannerState.background.imageUrl);
    }
    updateBackground({ image: null, imageUrl: '' });
  }, [bannerState.background?.imageUrl, updateBackground]);

  /** Handle edge type change */
  const handleEdgeChange = useCallback(
    (edgeType) => updateBackground({ edgeType }),
    [updateBackground]
  );

  // ===========================================================================
  // TEXT HANDLERS
  // ===========================================================================

  /** Update small text field */
  const handleUpdateSmallText = useCallback(
    (updates) => updateSection('widgetTextSmall', updates),
    [updateSection]
  );

  /** Update large text field */
  const handleUpdateLargeText = useCallback(
    (updates) => updateSection('widgetTextLarge', updates),
    [updateSection]
  );

  /** Swap text field positions */
  const handleSwapTextOrder = useCallback(() => {
    const current = bannerState.widgetLayout?.textOrder || 'small-top';
    const newOrder = current === 'small-top' ? 'large-top' : 'small-top';
    updateSection('widgetLayout', { textOrder: newOrder });
  }, [bannerState.widgetLayout?.textOrder, updateSection]);

  // Determine current text order
  const textOrder = bannerState.widgetLayout?.textOrder || 'small-top';
  const isSmallOnTop = textOrder === 'small-top';

  // ===========================================================================
  // PRODUCT IMAGE HANDLERS
  // ===========================================================================

  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  /** Handle product image upload */
  const handleProductUpload = useCallback(
    (file, dataUrl) => {
      const imageUrl = dataUrl || URL.createObjectURL(file);
      updateProductImage({ image: file, imageUrl });
    },
    [updateProductImage]
  );

  /** Clear product image */
  const handleProductClear = useCallback(() => {
    if (bannerState.productImage?.imageUrl) {
      URL.revokeObjectURL(bannerState.productImage.imageUrl);
    }
    updateProductImage({ image: null, imageUrl: '' });
  }, [bannerState.productImage?.imageUrl, updateProductImage]);

  /** Enhance product image */
  const handleEnhanceImage = useCallback(async () => {
    if (!bannerState.productImage?.imageUrl) {
      toast.error('No image to enhance');
      return;
    }
    if (isImageEnhanced(bannerState.productImage.imageUrl, 'product')) {
      toast('Image already enhanced!', { icon: '✨' });
      return;
    }

    setIsEnhancing(true);
    setEnhancementProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setEnhancementProgress((prev) => {
        if (prev >= 90) { clearInterval(progressIntervalRef.current); return 90; }
        return prev + 6;
      });
    }, 1000);

    try {
      const result = await enhanceImage(bannerState.productImage.imageUrl, 'product');
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setEnhancementProgress(100);
      saveEnhancedImage(bannerState.productImage.imageUrl, result.enhancedImageUrl, 'product');
      updateProductImage({ image: null, imageUrl: result.enhancedImageUrl });
      toast.success('Image enhanced successfully!');
    } catch (error) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      toast.error(error.message?.includes('free tier')
        ? 'Cloudinary free tier limit reached.'
        : 'Failed to enhance image.');
    } finally {
      setIsEnhancing(false);
      setEnhancementProgress(0);
    }
  }, [bannerState.productImage?.imageUrl, updateProductImage]);

  /** Remove product image background */
  const handleRemoveBackground = useCallback(async () => {
    if (!bannerState.productImage?.imageUrl) {
      toast.error('No image to process');
      return;
    }

    setIsRemovingBg(true);
    try {
      const result = await removeBackground(bannerState.productImage.imageUrl);
      updateProductImage({ image: null, imageUrl: result.processedImageUrl });
      toast.success('Background removed successfully!');
    } catch (error) {
      toast.error(error.message?.includes('free tier')
        ? 'Remove.bg free tier limit reached.'
        : 'Failed to remove background.');
    } finally {
      setIsRemovingBg(false);
    }
  }, [bannerState.productImage?.imageUrl, updateProductImage]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="space-y-5">
      {/* ================================================================
          Section: Background
          ================================================================ */}
      <SectionCard
        title="Background"
        description="Upload a 164×164px background image"
        hasRequired
      >
        <div className="space-y-4">
          <ImageUpload
            imageUrl={bannerState.background?.imageUrl}
            onUpload={handleBackgroundUpload}
            onClear={handleBackgroundClear}
            label="Background Image"
            required
            hint="164×164px recommended. Other sizes will be auto-resized."
            compact
          />

          {/* Edge type toggle — only shown after image upload */}
          {bannerState.background?.imageUrl && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-400">Edge Style</label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm ${
                    bannerState.background?.edgeType === 'sharp'
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#151515]'
                  }`}
                >
                  <input
                    type="radio"
                    name="widgetEdgeType"
                    value="sharp"
                    checked={bannerState.background?.edgeType === 'sharp'}
                    onChange={() => handleEdgeChange('sharp')}
                    className="w-3.5 h-3.5 text-blue-500 border-[#3a3a3a] bg-[#1a1a1a]"
                  />
                  <div>
                    <span className="text-gray-300 font-medium block">Sharp</span>
                    <span className="text-xs text-gray-500">0px radius</span>
                  </div>
                </label>
                <label
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all duration-200 text-sm ${
                    bannerState.background?.edgeType === 'rounded'
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#151515]'
                  }`}
                >
                  <input
                    type="radio"
                    name="widgetEdgeType"
                    value="rounded"
                    checked={bannerState.background?.edgeType === 'rounded'}
                    onChange={() => handleEdgeChange('rounded')}
                    className="w-3.5 h-3.5 text-blue-500 border-[#3a3a3a] bg-[#1a1a1a]"
                  />
                  <div>
                    <span className="text-gray-300 font-medium block">Rounded</span>
                    <span className="text-xs text-gray-500">40px radius</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ================================================================
          Section: Text Fields
          ================================================================ */}
      <SectionCard
        title="Text Fields"
        description="Two text fields — use arrows to swap positions"
      >
        <div className="space-y-4">
          {/* Render text fields in current order */}
          {isSmallOnTop ? (
            <>
              <WidgetTextSection
                label="Small Text"
                textState={bannerState.widgetTextSmall || { text: '', color: '#000000', fontFamily: 'Inter', fontWeight: 600 }}
                onUpdate={handleUpdateSmallText}
                maxChars={TEXT_CONFIG.small.maxChars}
                maxBoxHeight={TEXT_CONFIG.small.maxBoxHeight}
                position="top"
                canMoveUp={false}
                canMoveDown={true}
                onMoveDown={handleSwapTextOrder}
                onMoveUp={() => {}}
              />
              <hr className="border-[#2a2a2a]" />
              <WidgetTextSection
                label="Large Text"
                textState={bannerState.widgetTextLarge || { text: '', color: '#000000', fontFamily: 'Inter', fontWeight: 800 }}
                onUpdate={handleUpdateLargeText}
                maxChars={TEXT_CONFIG.large.maxChars}
                maxBoxHeight={TEXT_CONFIG.large.maxBoxHeight}
                position="bottom"
                canMoveUp={true}
                canMoveDown={false}
                onMoveUp={handleSwapTextOrder}
                onMoveDown={() => {}}
              />
            </>
          ) : (
            <>
              <WidgetTextSection
                label="Large Text"
                textState={bannerState.widgetTextLarge || { text: '', color: '#000000', fontFamily: 'Inter', fontWeight: 800 }}
                onUpdate={handleUpdateLargeText}
                maxChars={TEXT_CONFIG.large.maxChars}
                maxBoxHeight={TEXT_CONFIG.large.maxBoxHeight}
                position="top"
                canMoveUp={false}
                canMoveDown={true}
                onMoveDown={handleSwapTextOrder}
                onMoveUp={() => {}}
              />
              <hr className="border-[#2a2a2a]" />
              <WidgetTextSection
                label="Small Text"
                textState={bannerState.widgetTextSmall || { text: '', color: '#000000', fontFamily: 'Inter', fontWeight: 600 }}
                onUpdate={handleUpdateSmallText}
                maxChars={TEXT_CONFIG.small.maxChars}
                maxBoxHeight={TEXT_CONFIG.small.maxBoxHeight}
                position="bottom"
                canMoveUp={true}
                canMoveDown={false}
                onMoveUp={handleSwapTextOrder}
                onMoveDown={() => {}}
              />
            </>
          )}
        </div>
      </SectionCard>

      {/* ================================================================
          Section: Product Image
          ================================================================ */}
      <SectionCard
        title="Product Image"
        description="Optional product image (max 120×120px)"
      >
        <div className="space-y-3">
          <ImageUpload
            imageUrl={bannerState.productImage?.imageUrl}
            onUpload={handleProductUpload}
            onClear={handleProductClear}
            label="Product Image"
            hint="Max 120×120px. Positioned at bottom, may clip at canvas edge."
            compact
          />

          {/* AI Search button */}
          <button
            type="button"
            onClick={() => openSearchPanel('product')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            AI SEARCH
          </button>

          {/* Enhance & Remove BG — only when image exists */}
          {bannerState.productImage?.imageUrl && (
            <>
              {/* Enhance button */}
              <button
                type="button"
                onClick={handleEnhanceImage}
                disabled={isEnhancing || isImageEnhanced(bannerState.productImage.imageUrl, 'product')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] disabled:active:scale-100"
              >
                {isEnhancing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    ENHANCE IMAGE
                  </>
                )}
              </button>

              {/* Enhancement progress bar */}
              {isEnhancing && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${enhancementProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-cyan-400 text-center">Enhancing: {enhancementProgress}%</p>
                </div>
              )}

              {/* Remove Background button */}
              <button
                type="button"
                onClick={handleRemoveBackground}
                disabled={isRemovingBg}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] disabled:active:scale-100"
              >
                {isRemovingBg ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Removing Background...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                    </svg>
                    Remove Background
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export default WidgetInputForm;
