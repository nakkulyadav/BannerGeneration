/**
 * Product Image Section Component
 *
 * Required product image upload. Will be auto-scaled to fit
 * the right section of the banner.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ImageUpload } from '../shared';
import { useImageValidation } from '../../hooks/useImageValidation';
import { removeBackground, enhanceImage } from '../../services/imageSearchService';
import { saveEnhancedImage, isImageEnhanced } from '../../utils/enhancementCache';

/**
 * @param {Object} props
 * @param {Object} props.productImage - Product image state
 * @param {function} props.onUpdate - Update handler
 * @param {function} props.onAiSearch - Callback to open AI search panel for product images
 */
function ProductImageSection({ productImage, onUpdate, onAiSearch }) {
  const [error, setError] = useState('');
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const { validateProductImage } = useImageValidation();
  const progressIntervalRef = useRef(null);

  /**
   * Handle image upload
   */
  const handleUpload = useCallback(
    async (file) => {
      setError('');
      const result = await validateProductImage(file);

      if (result.valid) {
        onUpdate({
          image: file,
          imageUrl: result.imageUrl,
        });
      } else {
        setError(result.error);
      }
    },
    [validateProductImage, onUpdate]
  );

  /**
   * Handle image clear
   */
  const handleClear = useCallback(() => {
    if (productImage.imageUrl) {
      URL.revokeObjectURL(productImage.imageUrl);
    }
    onUpdate({
      image: null,
      imageUrl: '',
    });
    setError('');
  }, [productImage.imageUrl, onUpdate]);

  /**
   * Handle image enhancement
   * Enhances image quality using Cloudinary AI transformations
   */
  const handleEnhanceImage = useCallback(async () => {
    // Check if image exists
    if (!productImage.imageUrl) {
      toast.error('No image to enhance');
      return;
    }

    // Check if already enhanced
    if (isImageEnhanced(productImage.imageUrl, 'product')) {
      toast('Image already enhanced!', { icon: '✨' });
      return;
    }

    setIsEnhancing(true);
    setEnhancementProgress(0);

    // Start progress simulation (0% → 90% over 15 seconds)
    progressIntervalRef.current = setInterval(() => {
      setEnhancementProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressIntervalRef.current);
          return 90;
        }
        // Increment by ~6% every second
        return prev + 6;
      });
    }, 1000);

    try {
      console.log('[ProductImageSection] Enhancing image:', productImage.imageUrl);

      // Call enhancement API
      const result = await enhanceImage(productImage.imageUrl, 'product');

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Set progress to 100%
      setEnhancementProgress(100);

      // Save to cache
      saveEnhancedImage(productImage.imageUrl, result.enhancedImageUrl, 'product');

      // Update state with enhanced image
      onUpdate({
        image: null, // Clear file reference (now using URL)
        imageUrl: result.enhancedImageUrl,
      });

      toast.success('Image enhanced successfully!', { duration: 3000 });

    } catch (error) {
      console.error('[ProductImageSection] Enhancement failed:', error);

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Handle specific error codes
      if (error.code === 'FREE_TIER_EXHAUSTED' || error.message.includes('free tier')) {
        toast.error('Cloudinary free tier limit reached (25/month). Please upgrade or try next month.', {
          duration: 5000,
        });
      } else if (error.code === 'RATE_LIMIT' || error.message.includes('rate limit')) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.', {
          duration: 4000,
        });
      } else if (error.code === 'TIMEOUT' || error.message.includes('timed out')) {
        toast.error('Enhancement timed out. The image may be too large or complex.', {
          duration: 4000,
        });
      } else if (error.code === 'INVALID_IMAGE' || error.message.includes('Invalid image')) {
        toast.error('Invalid image. The image may be corrupted or in an unsupported format.');
      } else {
        toast.error('Failed to enhance image. Please try again later.');
      }
    } finally {
      setIsEnhancing(false);
      setEnhancementProgress(0);
    }
  }, [productImage.imageUrl, onUpdate]);

  // Cleanup progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  /**
   * Handle background removal
   * Works for both uploaded images and web-searched images
   */
  const handleRemoveBackground = useCallback(async () => {
    // Check if image exists
    if (!productImage.imageUrl) {
      toast.error('No image to process');
      return;
    }

    setIsRemovingBg(true);

    try {
      console.log('[ProductImageSection] Removing background from:', productImage.imageUrl);

      // Call background removal API
      const result = await removeBackground(productImage.imageUrl);

      // Update state with processed image
      onUpdate({
        image: null, // Clear file reference (now using URL)
        imageUrl: result.processedImageUrl,
      });

      toast.success('Background removed successfully!');

    } catch (error) {
      console.error('[ProductImageSection] Background removal failed:', error);

      // Handle specific error codes
      if (error.message.includes('402') || error.message.includes('free tier exhausted')) {
        toast.error('Remove.bg free tier limit reached (50/month). Please upgrade or try next month.', {
          duration: 5000,
        });
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        toast.error('Rate limit exceeded. Please wait a moment and try again.', {
          duration: 4000,
        });
      } else if (error.message.includes('Invalid image') || error.message.includes('400')) {
        toast.error('Invalid image. The image may be too large or in an unsupported format.');
      } else if (error.message.includes('timed out') || error.message.includes('504')) {
        toast.error('Background removal timed out. The image may be too large.');
      } else {
        toast.error('Failed to remove background. Please try again later.');
      }
    } finally {
      setIsRemovingBg(false);
    }
  }, [productImage.imageUrl, onUpdate]);

  return (
    <div className="space-y-3">
      {/* Required indicator - dark mode */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Required</span>
        <span className="flex-1 h-px bg-[#2a2a2a]"></span>
      </div>

      <ImageUpload
        imageUrl={productImage.imageUrl}
        onUpload={handleUpload}
        onClear={handleClear}
        label="Product Image"
        required
        hint="Use transparent PNG for best results. Will be centered in the right section of the banner."
        error={error}
      />

      {/* AI Search button — opens the search panel for product images */}
      <button
        type="button"
        onClick={onAiSearch}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        AI SEARCH
      </button>

      {/* Enhance Image button — only shown when image is uploaded or selected */}
      {productImage.imageUrl && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleEnhanceImage}
            disabled={isEnhancing || isImageEnhanced(productImage.imageUrl, 'product')}
            title={isImageEnhanced(productImage.imageUrl, 'product') ? 'Image already enhanced' : 'Enhance image quality'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] disabled:active:scale-100"
          >
            {isEnhancing ? (
              <>
                {/* Loading spinner */}
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enhancing Image...
              </>
            ) : (
              <>
                {/* Magic wand icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                ENHANCE IMAGE
              </>
            )}
          </button>

          {/* Progress bar */}
          {isEnhancing && (
            <div className="space-y-1">
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
                  style={{ width: `${enhancementProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-cyan-400 text-center">
                Enhancing: {enhancementProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Remove Background button — only shown when image is uploaded or selected */}
      {productImage.imageUrl && (
        <button
          type="button"
          onClick={handleRemoveBackground}
          disabled={isRemovingBg}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] disabled:active:scale-100"
        >
          {isRemovingBg ? (
            <>
              {/* Loading spinner */}
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Removing Background...
            </>
          ) : (
            <>
              {/* Scissors icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
              </svg>
              Remove Background
            </>
          )}
        </button>
      )}

      {/* Tips - dark mode styling */}
      <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3 transition-colors hover:bg-amber-900/30 hover:border-amber-700/40">
        <p className="text-xs text-amber-400">
          <span className="font-semibold">Tip:</span> Product images with transparent backgrounds work best.
          The image will be auto-scaled to fit the available space.
        </p>
      </div>
    </div>
  );
}

export default ProductImageSection;
