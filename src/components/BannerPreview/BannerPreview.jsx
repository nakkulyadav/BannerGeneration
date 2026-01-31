/**
 * Banner Preview Container Component
 *
 * Contains the canvas preview and download button.
 * Shows real-time preview of the banner as user                                                                                                                                                                                                                                                         s data.
 * Handles download functionality via BannerCanvas ref.
 */

import { useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import BannerCanvas from './BannerCanvas';
import DownloadButton from './DownloadButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { downloadBanner } from '../../utils/bannerGenerator';
import { generateFileName } from '../../utils/fileNameGenerator';

/**
 * @param {Object} props
 * @param {Object} props.bannerState - Current banner state
 * @param {boolean} props.isValid - Whether form is valid for download
 */
function BannerPreview({ bannerState, isValid }) {
  // ==========================================================================
  // REFS
  // ==========================================================================

  // Reference to BannerCanvas for accessing Fabric canvas
  const canvasRef = useRef(null);

  // ==========================================================================
  // HOOKS
  // ==========================================================================

  const { missingFields, isOfferBadgeValid } = useFormValidation(bannerState);

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

      // Generate filename from heading
      const filename = generateFileName(bannerState.heading.text);

      // Trigger download
      downloadBanner(canvas, filename);

      // Show success notification
      toast.success(`Downloaded: ${filename}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download banner. Please try again.');
    }
  }, [bannerState.heading.text]);

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
          {/* Aspect ratio container ensures proper scaling on all screens */}
          <div className="aspect-[722/312] w-full rounded-lg shadow-lg bg-white flex items-center justify-center">
            <BannerCanvas ref={canvasRef} bannerState={bannerState} />
          </div>
        </div>

        {/* Banner dimensions info - hidden on very small screens */}
        <p className="text-xs text-gray-500 text-center mb-3 hidden sm:block">
          Output: 722 × 312 pixels (WEBP)
        </p>

        {/* Validation status - dark mode warning styling */}
        {!isValid && (
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

        {/* Offer badge warning - dark mode styling */}
        {!isOfferBadgeValid && (
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
          disabled={!isValid || !isOfferBadgeValid}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}

export default BannerPreview;
