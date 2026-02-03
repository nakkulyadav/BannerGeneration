/**
 * Download Button Component
 *
 * Triggers download of the generated banner (WEBP format).
 * Shows different states: disabled, ready, downloading.
 */

import { useState, useCallback } from 'react';

/**
 * @param {Object} props
 * @param {Object} props.bannerState - Current banner state (for filename)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Function} props.onDownload - Download handler (optional, for 12.2)
 */
function DownloadButton({ bannerState, disabled, onDownload }) {
  // ==========================================================================
  // STATE
  // ==========================================================================

  // Loading state during download
  const [isDownloading, setIsDownloading] = useState(false);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  /**
   * Handle download button click
   * Calls onDownload callback if provided
   */
  const handleClick = useCallback(async () => {
    if (disabled || isDownloading || !onDownload) return;

    setIsDownloading(true);

    try {
      await onDownload();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [disabled, isDownloading, onDownload]);

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Get button text based on current state
   * Returns object with full and short text for responsive display
   */
  const getButtonText = () => {
    if (isDownloading) return { full: 'Downloading...', short: 'Downloading...' };
    if (disabled) return { full: 'Complete all required fields', short: 'Fill required fields' };
    return { full: 'Download Banner', short: 'Download Banner' };
  };

  const buttonText = getButtonText();

  /**
   * Check if button should be disabled
   */
  const isButtonDisabled = disabled || isDownloading;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`
        w-full py-3 px-4 rounded-lg font-medium text-sm
        transition-all duration-200 flex items-center justify-center gap-2
        ${isButtonDisabled
          ? 'bg-[#2a2a2a] text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]'
        }
      `}
    >
      {/* Download icon or spinner */}
      {isDownloading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : !disabled && (
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      )}

      {/* Button text - responsive: short on mobile, full on desktop */}
      <span className="sm:hidden">{buttonText.short}</span>
      <span className="hidden sm:inline">{buttonText.full}</span>
    </button>
  );
}

export default DownloadButton;
