/**
 * Banner Preview Container Component
 *
 * Contains the canvas preview and download button.
 * Shows real-time preview of the banner as user inputs data.
 * Handles download functionality via BannerCanvas ref.
 *
 * Supports dynamic dimensions for different preset types (banner 722×312, widget 164×164, etc.).
 */

import { useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import BannerCanvas from './BannerCanvas';
import DownloadButton from './DownloadButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { downloadBanner } from '../../utils/bannerGenerator';
import { generateFileName } from '../../utils/fileNameGenerator';
import { BANNER } from '../../constants/bannerConfig';

/**
 * @param {Object} props
 * @param {Object} props.bannerState - Current banner state
 * @param {boolean} props.isValid - Whether form is valid for download
 * @param {string} [props.dimensionType] - Preset type ('promotional_banner', 'widget', etc.)
 * @param {number} [props.width] - Canvas width (defaults to BANNER.WIDTH)
 * @param {number} [props.height] - Canvas height (defaults to BANNER.HEIGHT)
 */
function BannerPreview({
  bannerState,
  isValid,
  dimensionType = 'promotional_banner',
  width = BANNER.WIDTH,
  height = BANNER.HEIGHT,
}) {
  // ==========================================================================
  // REFS
  // ==========================================================================

  // Reference to BannerCanvas for accessing Fabric canvas
  const canvasRef = useRef(null);

  // ==========================================================================
  // HOOKS
  // ==========================================================================

  // Form validation is promotional_banner-specific; pass safe defaults for other presets
  const isPromoBanner = dimensionType === 'promotional_banner';
  const { missingFields, isOfferBadgeValid } = useFormValidation(
    isPromoBanner
      ? bannerState
      : {
          background: { imageUrl: '' },
          heading: { text: '' },
          ctaButton: { text: '', bgColor: '' },
          productImage: { imageUrl: '' },
          offerBadge: { text: '', bgColor: '' },
        }
  );

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  /**
   * Handle download button click
   * Gets canvas from BannerCanvas and triggers PNG download
   */
  const handleDownload = useCallback(() => {
    try {
      // Get Fabric canvas from BannerCanvas ref
      const canvas = canvasRef.current?.getCanvas();

      if (!canvas) {
        toast.error('Canvas not ready. Please wait and try again.');
        return;
      }

      // Generate filename — use heading for promo banner, fallback for others
      const nameSource = bannerState.heading?.text || bannerState.widgetTextLarge?.text || 'banner';
      const filename = generateFileName(nameSource);

      // Trigger download
      downloadBanner(canvas, filename);

      // Show success notification
      toast.success(`Downloaded: ${filename}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download. Please try again.');
    }
  }, [bannerState]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden">
      {/* Header - dark mode styling */}
      <div className="px-3 sm:px-4 py-3 bg-[#151515] border-b border-[#2a2a2a]">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Live Preview
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
          Your banner updates in real-time as you make changes
        </p>
      </div>

      {/* Card body with responsive padding */}
      <div className="p-3 sm:p-4">
        {/* Canvas preview area - dark mode container */}
        <div className="bg-[#0f0f0f] rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
          {/* Aspect ratio container — dynamic based on preset dimensions */}
          <div
            className="w-full rounded-lg shadow-lg bg-white flex items-center justify-center"
            style={{ aspectRatio: `${width}/${height}` }}
          >
            <BannerCanvas
              ref={canvasRef}
              bannerState={bannerState}
              width={width}
              height={height}
              dimensionType={dimensionType}
            />
          </div>
        </div>

        {/* Canvas dimensions info - hidden on very small screens */}
        <p className="text-xs text-gray-500 text-center mb-3 hidden sm:block">
          Output: {width} × {height} pixels
        </p>

        {/* Validation status — only shown for promotional banner */}
        {isPromoBanner && !isValid && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg animate-fade-in">
            <p className="text-xs sm:text-sm text-amber-400 font-medium mb-1 flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Missing required fields:
            </p>
            <ul className="text-xs sm:text-sm text-amber-300/80 list-disc list-inside space-y-0.5 ml-5">
              {missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Non-promo preset validation — generic check for missing background */}
        {!isPromoBanner && !isValid && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg animate-fade-in">
            <p className="text-xs sm:text-sm text-amber-400 font-medium flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Background image is required to export.
            </p>
          </div>
        )}

        {/* Offer badge warning — promotional banner only */}
        {isPromoBanner && !isOfferBadgeValid && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg animate-fade-in">
            <p className="text-xs sm:text-sm text-amber-400 flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Offer badge text provided but no background color selected.
            </p>
          </div>
        )}

        {/* Download button */}
        <DownloadButton
          bannerState={bannerState}
          disabled={!isValid || (isPromoBanner && !isOfferBadgeValid)}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}

export default BannerPreview;
