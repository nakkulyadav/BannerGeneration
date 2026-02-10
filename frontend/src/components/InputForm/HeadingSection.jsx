/**
 * Heading Section Component
 *
 * Product heading input with 40 character limit, font/weight selectors, and color picker.
 */

import { useCallback, useState } from 'react';
import { ColorPicker, TextToolsButtons } from '../shared';
import FontSelector from '../shared/FontSelector';
import WeightSelector from '../shared/WeightSelector';
import { TEXT } from '../../constants/bannerConfig';
import { getClosestWeight } from '../../constants/fontConfig';

/**
 * @param {Object} props
 * @param {Object} props.heading - Heading state (text, color, fontFamily, fontWeight)
 * @param {function} props.onUpdate - Update handler
 */
function HeadingSection({ heading, onUpdate }) {
  // Track if weight selector should auto-open (after font change)
  const [autoOpenWeight, setAutoOpenWeight] = useState(false);

  /**
   * Handle text input (enforce 40 char limit)
   */
  const handleTextChange = useCallback(
    (e) => {
      const text = e.target.value;
      // Block input beyond max chars
      if (text.length <= TEXT.HEADING.MAX_CHARS) {
        onUpdate({ text });
      }
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

  /**
   * Handle font family change
   * Automatically adjusts weight to closest available if current weight is unavailable
   */
  const handleFontChange = useCallback(
    (fontFamily) => {
      const currentWeight = heading.fontWeight;
      const closestWeight = getClosestWeight(fontFamily, currentWeight);

      onUpdate({
        fontFamily,
        fontWeight: closestWeight,
      });

      // Auto-open weight selector to draw user attention
      setAutoOpenWeight(true);
      setTimeout(() => setAutoOpenWeight(false), 200);
    },
    [heading.fontWeight, onUpdate]
  );

  /**
   * Handle font weight change
   */
  const handleWeightChange = useCallback(
    (fontWeight) => {
      onUpdate({ fontWeight });
    },
    [onUpdate]
  );

  const charCount = heading.text.length;
  const isNearLimit = charCount >= TEXT.HEADING.MAX_CHARS - 5;

  return (
    <div className="space-y-4">
      {/* Required indicator - dark mode */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Required</span>
        <span className="flex-1 h-px bg-[#2a2a2a]"></span>
      </div>

      {/* Font and Weight Selectors - Row layout (Option C) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FontSelector
          value={heading.fontFamily}
          onChange={handleFontChange}
          label="Font:"
        />
        <WeightSelector
          fontFamily={heading.fontFamily}
          value={heading.fontWeight}
          onChange={handleWeightChange}
          label="Weight:"
          autoOpen={autoOpenWeight}
        />
      </div>

      {/* Heading text input - dark mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label className="block text-sm font-medium text-gray-300">
              Product Heading
              <span className="text-red-400 ml-1">*</span>
            </label>
            {/* Translate & Spell-check */}
            <TextToolsButtons
              text={heading.text}
              onApply={(t) => onUpdate({ text: t })}
              maxLength={40}
            />
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isNearLimit
                ? 'text-amber-400 bg-amber-900/30 font-medium'
                : 'text-gray-400 bg-[#2a2a2a]'
            }`}
          >
            {charCount}/{TEXT.HEADING.MAX_CHARS}
          </span>
        </div>

        <textarea
          value={heading.text}
          onChange={handleTextChange}
          placeholder="Enter product heading (e.g., 'Premium Wireless Earbuds')"
          rows={2}
          className="w-full px-3 py-2.5 text-sm bg-[#151515] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-none transition-shadow placeholder-gray-500"
        />

        <p className="text-xs text-gray-500">
          Renders at 28px with selected font and weight. Max 2 lines, wraps at 320px width.
        </p>
      </div>

      {/* Color picker */}
      <ColorPicker
        color={heading.color}
        onChange={handleColorChange}
        label="Text Color"
      />
    </div>
  );
}

export default HeadingSection;
