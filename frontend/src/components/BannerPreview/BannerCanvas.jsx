/**
 * Banner Canvas Component
 *
 * Renders the banner preview using Fabric.js canvas.
 * Uses useBannerGenerator hook for debounced generation.
 * Exposes getCanvas() method via ref for download functionality.
 *
 * Supports dynamic dimensions for different preset types (banner, widget, etc.).
 */

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useBannerGenerator } from '../../hooks/useBannerGenerator';
import { BANNER } from '../../constants/bannerConfig';

/**
 * @param {Object} props
 * @param {Object} props.bannerState - Current banner state from App
 * @param {number} [props.width] - Canvas width (defaults to BANNER.WIDTH)
 * @param {number} [props.height] - Canvas height (defaults to BANNER.HEIGHT)
 * @param {string} [props.dimensionType] - Preset type for generator routing
 * @param {React.Ref} ref - Forwarded ref for imperative handle
 */
const BannerCanvas = forwardRef(function BannerCanvas({
  bannerState,
  width = BANNER.WIDTH,
  height = BANNER.HEIGHT,
  dimensionType = 'promotional_banner',
}, ref) {
  // ==========================================================================
  // REFS
  // ==========================================================================

  // Canvas DOM element reference
  const canvasElementRef = useRef(null);

  // ==========================================================================
  // HOOK
  // ==========================================================================

  // Use banner generator hook for debounced generation
  const {
    isGenerating,
    error,
    setCanvasElement,
    getFabricCanvas,
  } = useBannerGenerator(bannerState, dimensionType);

  // ==========================================================================
  // IMPERATIVE HANDLE
  // ==========================================================================

  /**
   * Expose getCanvas method to parent via ref
   * Used for download functionality
   */
  useImperativeHandle(ref, () => ({
    /**
     * Get the Fabric.js canvas instance
     * @returns {fabric.Canvas|null} Canvas instance or null if not ready
     */
    getCanvas: () => getFabricCanvas(),
  }), [getFabricCanvas]);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  /**
   * Connect canvas element to hook on mount
   */
  useEffect(() => {
    if (canvasElementRef.current) {
      setCanvasElement(canvasElementRef.current);
    }
  }, [setCanvasElement]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Canvas wrapper - scales Fabric.js canvas to fit container */}
      <div
        className="w-full h-full"
        style={{
          // Scale canvas to fit container while maintaining aspect ratio
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Canvas element - Fabric.js will attach to this */}
        <canvas
          ref={canvasElementRef}
          width={width}
          height={height}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Loading overlay - dark mode styling */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-[1px] animate-fade-in">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg
              className="animate-spin h-6 w-6 text-blue-400"
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
            <span className="text-xs font-medium text-gray-400">Generating preview...</span>
          </div>
        </div>
      )}

      {/* Error message - dark mode styling */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-950/90 animate-fade-in">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-lg shadow-lg border border-red-800/50">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default BannerCanvas;
