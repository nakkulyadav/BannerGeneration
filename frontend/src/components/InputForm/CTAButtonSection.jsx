/**
 * CTA Button Section Component
 *
 * Call-to-action button text and color configuration.
 * Features:
 * - Default text "SHOP NOW" that users can customize
 * - Both text and background color are required
 * - No toggle option (CTA button always appears on banner)
 */

import { useCallback } from 'react';
import { ColorPicker } from '../shared';

/**
 * @param {Object} props
 * @param {Object} props.ctaButton - CTA button state
 * @param {function} props.onUpdate - Update handler
 */
function CTAButtonSection({ ctaButton, onUpdate }) {
  /**
   * Handle text input
   */
  const handleTextChange = useCallback(
    (e) => {
      onUpdate({ text: e.target.value });
    },
    [onUpdate]
  );

  /**
   * Handle text color change
   */
  const handleTextColorChange = useCallback(
    (textColor) => {
      onUpdate({ textColor });
    },
    [onUpdate]
  );

  /**
   * Handle background color change
   */
  const handleBgColorChange = useCallback(
    (bgColor) => {
      onUpdate({ bgColor });
    },
    [onUpdate]
  );

  const showBgColorError = ctaButton.text.trim() !== '' && ctaButton.bgColor === '';

  return (
    <div className="space-y-5">
      {/* Required indicator - dark mode */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Required</span>
        <span className="flex-1 h-px bg-[#2a2a2a]"></span>
      </div>

      {/* CTA text input - dark mode */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Button Text
          <span className="text-red-400 ml-1">*</span>
        </label>
        <input
          type="text"
          value={ctaButton.text}
          onChange={handleTextChange}
          placeholder="e.g., ORDER NOW, BUY NOW"
          className="w-full px-3 py-2.5 text-sm bg-[#151515] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-shadow placeholder-gray-500"
        />
        <p className="text-xs text-gray-500">
          Default: "SHOP NOW". Renders at 20px Bold with 12px/8px padding.
        </p>
      </div>

      {/* Colors row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Text color */}
        <ColorPicker
          color={ctaButton.textColor}
          onChange={handleTextColorChange}
          label="Text Color"
        />

        {/* Background color */}
        <div>
          <ColorPicker
            color={ctaButton.bgColor}
            onChange={handleBgColorChange}
            label="Background Color"
            required
          />
          {showBgColorError && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1 animate-fade-in">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Required field
            </p>
          )}
        </div>
      </div>

      {/* Preview - dark mode styling */}
      {ctaButton.text && ctaButton.bgColor && (
        <div className="pt-3 border-t border-[#2a2a2a] animate-fade-in">
          <span className="text-xs font-medium text-gray-500 block mb-3">Live Preview</span>
          <div className="bg-[#0f0f0f] rounded-lg p-4 flex items-center justify-center">
            <span
              className="inline-block px-3 py-1.5 text-xs font-bold rounded shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: ctaButton.bgColor,
                color: ctaButton.textColor,
              }}
            >
              {ctaButton.text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CTAButtonSection;
