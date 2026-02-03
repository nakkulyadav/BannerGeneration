/**
 * Brand Logo Section Component
 *
 * Optional brand logo upload with auto-scaling to max 50x120px.
 */

import { useState, useCallback } from 'react';
import { ImageUpload } from '../shared';
import { useImageValidation } from '../../hooks/useImageValidation';
import { LOGO } from '../../constants/bannerConfig';

/**
 * @param {Object} props
 * @param {Object} props.brandLogo - Brand logo state
 * @param {function} props.onUpdate - Update handler
 * @param {function} props.onAiSearch - Callback to open AI search panel for logo
 */
function BrandLogoSection({ brandLogo, onUpdate, onAiSearch }) {
  const [error, setError] = useState('');
  const { validateLogoImage } = useImageValidation();

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
