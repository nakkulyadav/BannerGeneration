/**
 * T&C Text Section Component
 *
 * Optional terms and conditions text with toggle and color picker.
 * Features:
 * - Toggle switch to enable/disable T&C display on banner
 * - Default text "*T&C Apply" that users can customize
 * - Color picker for text color
 */

import { useCallback } from 'react';
import { ColorPicker, ToggleSwitch } from '../shared';

/**
 * @param {Object} props
 * @param {Object} props.tcText - T&C text state (enabled, text, color)
 * @param {function} props.onUpdate - Update handler
 */
function TCTextSection({ tcText, onUpdate }) {
  /**
   * Handle toggle switch for enabling/disabling T&C display
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
   * Handle color change
   */
  const handleColorChange = useCallback(
    (color) => {
      onUpdate({ color });
    },
    [onUpdate]
  );

  return (
    <div className="space-y-4 p-4 bg-[#151515] rounded-xl border border-[#2a2a2a]">
      {/* Section header with toggle - dark mode */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-300">
            T&C Text
          </span>
          <span className="ml-2 text-xs font-medium text-gray-500 bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>
        {/* Toggle switch to show/hide T&C on banner */}
        <ToggleSwitch
          checked={tcText.enabled}
          onChange={handleToggle}
          label=""
        />
      </div>

      {/* Content only shown when enabled */}
      {tcText.enabled && (
        <div className="space-y-4 animate-fade-in">
          {/* Text input - dark mode */}
          <div className="space-y-2">
            <input
              type="text"
              value={tcText.text}
              onChange={handleTextChange}
              placeholder="e.g., *T&C apply"
              className="w-full px-3 py-2.5 text-sm bg-[#1a1a1a] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-shadow placeholder-gray-500"
            />
            <p className="text-xs text-gray-500">
              Renders at 12px below the CTA button. Keep it brief.
            </p>
          </div>

          {/* Color picker */}
          <ColorPicker
            color={tcText.color}
            onChange={handleColorChange}
            label="Text Color"
          />
        </div>
      )}

      {/* Disabled state message */}
      {!tcText.enabled && (
        <p className="text-xs text-gray-500 italic">
          T&C text will not appear on the banner.
        </p>
      )}
    </div>
  );
}

export default TCTextSection;
