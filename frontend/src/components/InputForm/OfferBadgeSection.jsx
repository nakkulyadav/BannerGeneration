/**
 * Offer Badge Section Component
 *
 * Optional offer badge (e.g., "Free Delivery") positioned at top-right.
 * Features:
 * - Toggle switch to enable/disable badge display on banner
 * - Default text "Free Delivery" that users can customize
 * - If enabled and text provided, background color becomes required.
 */

import { useCallback, useState } from 'react';
import { ColorPicker, ToggleSwitch } from '../shared';
import FontSelector from '../shared/FontSelector';
import WeightSelector from '../shared/WeightSelector';
import { getClosestWeight } from '../../constants/fontConfig';

/**
 * @param {Object} props
 * @param {Object} props.offerBadge - Offer badge state (enabled, text, textColor, bgColor)
 * @param {function} props.onUpdate - Update handler
 */
function OfferBadgeSection({ offerBadge, onUpdate }) {
  const [autoOpenWeight, setAutoOpenWeight] = useState(false);

  /**
   * Handle font change with closest weight fallback
   */
  const handleFontChange = useCallback(
    (fontFamily) => {
      const closestWeight = getClosestWeight(fontFamily, offerBadge.fontWeight);
      onUpdate({ fontFamily, fontWeight: closestWeight });
      setAutoOpenWeight(true);
      setTimeout(() => setAutoOpenWeight(false), 200);
    },
    [offerBadge.fontWeight, onUpdate]
  );

  /**
   * Handle weight change
   */
  const handleWeightChange = useCallback(
    (fontWeight) => {
      onUpdate({ fontWeight });
    },
    [onUpdate]
  );

  /**
   * Handle toggle switch for enabling/disabling badge display
   */
  const handleToggle = useCallback(
    (enabled) => {
      onUpdate({ enabled });
    },
    [onUpdate]
  );

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

  const hasText = offerBadge.text.trim() !== '';
  const showBgColorError = offerBadge.enabled && hasText && offerBadge.bgColor === '';

  return (
    <div className="space-y-4 p-4 bg-[#151515] rounded-xl border border-[#2a2a2a]">
      {/* Section header with toggle - dark mode */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-300">
            Offer Badge
          </span>
          <span className="ml-2 text-xs font-medium text-gray-500 bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>
        {/* Toggle switch to show/hide badge on banner */}
        <ToggleSwitch
          checked={offerBadge.enabled}
          onChange={handleToggle}
          label=""
        />
      </div>

      {/* Content only shown when enabled */}
      {offerBadge.enabled && (
        <div className="space-y-4 animate-fade-in">
          {/* Font and Weight selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FontSelector
              value={offerBadge.fontFamily}
              onChange={handleFontChange}
              label="Font:"
            />
            <WeightSelector
              fontFamily={offerBadge.fontFamily}
              value={offerBadge.fontWeight}
              onChange={handleWeightChange}
              label="Weight:"
              autoOpen={autoOpenWeight}
            />
          </div>

          {/* Badge text input - dark mode */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400">
              Badge Text
            </label>
            <input
              type="text"
              value={offerBadge.text}
              onChange={handleTextChange}
              placeholder="e.g., Free Delivery, 50% OFF"
              className="w-full px-3 py-2.5 text-sm bg-[#1a1a1a] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-shadow placeholder-gray-500"
            />
            <p className="text-xs text-gray-500">
              Appears at top-right corner. Renders at 20px Medium weight.
            </p>
          </div>

          {/* Only show color pickers if text is entered - dark mode */}
          {hasText && (
            <div className="space-y-4 pt-3 border-t border-[#2a2a2a] animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                {/* Text color */}
                <ColorPicker
                  color={offerBadge.textColor}
                  onChange={handleTextColorChange}
                  label="Text Color"
                />

                {/* Background color */}
                <div>
                  <ColorPicker
                    color={offerBadge.bgColor}
                    onChange={handleBgColorChange}
                    label="Background Color"
                    required
                  />
                  {showBgColorError && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1 animate-fade-in">
                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Required when badge is enabled
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Preview - dark mode styling */}
          {hasText && offerBadge.bgColor && (
            <div className="pt-3 border-t border-[#2a2a2a] animate-fade-in">
              <span className="text-xs font-medium text-gray-500 block mb-3">Live Preview</span>
              <div className="bg-[#0f0f0f] rounded-lg p-4 flex justify-end">
                <span
                  className="inline-block px-3 py-1.5 text-xs font-medium rounded-bl-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                  style={{
                    backgroundColor: offerBadge.bgColor,
                    color: offerBadge.textColor,
                  }}
                >
                  {offerBadge.text}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disabled state message */}
      {!offerBadge.enabled && (
        <p className="text-xs text-gray-500 italic">
          Offer badge will not appear on the banner.
        </p>
      )}
    </div>
  );
}

export default OfferBadgeSection;
