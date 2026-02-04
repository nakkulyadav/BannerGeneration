/**
 * Brand Logo Section Component
 *
 * Optional brand logo upload with auto-scaling to max 50x120px.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ImageUpload } from '../shared';
import { useImageValidation } from '../../hooks/useImageValidation';
import { removeBackground, enhanceImage } from '../../services/imageSearchService';
import { saveEnhancedImage, isImageEnhanced } from '../../utils/enhancementCache';
import { LOGO } from '../../constants/bannerConfig';

/**
 * @param {Object} props
 * @param {Object} props.brandLogo - Brand logo state
 * @param {function} props.onUpdate - Update handler
 * @param {function} props.onAiSearch - Callback to open AI search panel for logo
 */
function BrandLogoSection({ brandLogo, onUpdate, onAiSearch }) {
  const [error, setError] = useState('');
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const { validateLogoImage } = useImageValidation();
  const progressIntervalRef = useRef(null);

  /**
   * Handle logo upload
   */
  const handleUpload = useCallback(
    async (file) => {
      setError('');
      const result = await validateLogoImage(file);

      if (result.valid) {
        onUpdate({
          image: file,
          imageUrl: result.imageUrl,
        });
      } else {
        setError(result.error);
      }
    },
    [validateLogoImage, onUpdate]
  );

  /**
   * Handle logo clear
   */
  const handleClear = useCallback(() => {
    if (brandLogo.imageUrl) {
      URL.revokeObjectURL(brandLogo.imageUrl);
    }
    onUpdate({
      image: null,
      imageUrl: '',
    });
    setError('');
  }, [brandLogo.imageUrl, onUpdate]);

  /**
   * Handle image enhancement
   * Enhances image quality using Cloudinary AI transformations
   */
  const handleEnhanceImage = useCallback(async () => {
    // Check if image exists
    if (!brandLogo.imageUrl) {
      toast.error('No image to enhance');
      return;
    }

    // Check if already enhanced
    if (isImageEnhanced(brandLogo.imageUrl, 'logo')) {
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
      console.log('[BrandLogoSection] Enhancing image:', brandLogo.imageUrl);

      // Call enhancement API
      const result = await enhanceImage(brandLogo.imageUrl, 'logo');

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Set progress to 100%
      setEnhancementProgress(100);

      // Save to cache
      saveEnhancedImage(brandLogo.imageUrl, result.enhancedImageUrl, 'logo');

      // Update state with enhanced image
      onUpdate({
        image: null, // Clear file reference (now using URL)
        imageUrl: result.enhancedImageUrl,
      });

      toast.success('Image enhanced successfully!', { duration: 3000 });

    } catch (error) {
      console.error('[BrandLogoSection] Enhancement failed:', error);

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
  }, [brandLogo.imageUrl, onUpdate]);

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
    if (!brandLogo.imageUrl) {
      toast.error('No image to process');
      return;
    }

    setIsRemovingBg(true);

    try {
      console.log('[BrandLogoSection] Removing background from:', brandLogo.imageUrl);

      // Call background removal API
      const result = await removeBackground(brandLogo.imageUrl);

      // Update state with processed image
      onUpdate({
        image: null, // Clear file reference (now using URL)
        imageUrl: result.processedImageUrl,
      });

      toast.success('Background removed successfully!');

    } catch (error) {
      console.error('[BrandLogoSection] Background removal failed:', error);

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
  }, [brandLogo.imageUrl, onUpdate]);

  return (
    <div className="space-y-3">
      {/* Optional indicator - dark mode */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Optional</span>
        <span className="flex-1 h-px bg-[#2a2a2a]"></span>
      </div>

      <ImageUpload
        imageUrl={brandLogo.imageUrl}
        onUpload={handleUpload}
        onClear={handleClear}
        label="Brand Logo"
        required={false}
        hint={`Will be auto-scaled to fit max ${LOGO.MAX_HEIGHT}×${LOGO.MAX_WIDTH}px. Use transparent PNG for best results.`}
        error={error}
      />

      {/* AI Search button — opens the search panel for logo images */}
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
      {brandLogo.imageUrl && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleEnhanceImage}
            disabled={isEnhancing || isImageEnhanced(brandLogo.imageUrl, 'logo')}
            title={isImageEnhanced(brandLogo.imageUrl, 'logo') ? 'Image already enhanced' : 'Enhance image quality'}
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
      {brandLogo.imageUrl && (
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
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 transition-colors hover:bg-blue-900/30 hover:border-blue-700/40">
        <p className="text-xs text-blue-400">
          <span className="font-semibold">Tip:</span> Logos with transparent backgrounds work best.
          The logo will appear at the top-left of the banner.
        </p>
      </div>
    </div>
  );
}

export default BrandLogoSection;
