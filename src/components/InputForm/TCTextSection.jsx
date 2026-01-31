/**
 * T&C Text Section Component
 *
 * Optional terms and conditions text with color picker.
 */

import { useCallback } from 'react';
import { ColorPicker } from '../shared';

/**
 * @param {Object} props
 * @param {Object} props.tcText - T&C text state
 * @param {function} props.onUpdate - Update handler
 */
function TCTextSection({ tcText, onUpdate }) {
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
      {/* Section header - dark mode */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-300">
            T&C Text
          </span>
          <span className="ml-2 text-xs font-medium text-gray-500 bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>
      </div>

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
          Renders at 8px below the CTA button. Keep it brief.
        </p>
      </div>

      {/* Color picker */}
      <ColorPicker
        color={tcText.color}
        onChange={handleColorChange}
        label="Text Color"
      />
    </div>
  );
}

export default TCTextSection;
