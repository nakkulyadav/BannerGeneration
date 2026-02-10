/**
 * Widget Text Section Component
 *
 * Reusable text field section for the widget preset editor.
 * Supports both "small" (24px box) and "large" (44px box) text variants.
 * Includes font/weight selectors, color picker, and spell-check/translate tools.
 *
 * @module components/editor/widget/WidgetTextSection
 */

import { useCallback, useState } from 'react';
import { ColorPicker, TextToolsButtons } from '../../shared';
import FontSelector from '../../shared/FontSelector';
import WeightSelector from '../../shared/WeightSelector';
import { getClosestWeight } from '../../../constants/fontConfig';

// =============================================================================
// WIDGET TEXT SECTION COMPONENT
// =============================================================================

/**
 * @param {Object} props
 * @param {string} props.label - Section label (e.g., "Small Text", "Large Text")
 * @param {Object} props.textState - Text state { text, color, fontFamily, fontWeight }
 * @param {function} props.onUpdate - Callback to update text state
 * @param {number} props.maxChars - Maximum character limit
 * @param {number} props.maxBoxHeight - Max rendered box height in px (for info display)
 * @param {'top'|'bottom'} props.position - Current vertical position
 * @param {boolean} props.canMoveUp - Whether the up arrow should be enabled
 * @param {boolean} props.canMoveDown - Whether the down arrow should be enabled
 * @param {function} props.onMoveUp - Callback to move this text field up
 * @param {function} props.onMoveDown - Callback to move this text field down
 */
function WidgetTextSection({
  label,
  textState,
  onUpdate,
  maxChars,
  maxBoxHeight,
  position,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
}) {
  // Track auto-open for weight selector after font change
  const [autoOpenWeight, setAutoOpenWeight] = useState(false);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  /** Handle text input (enforce character limit) */
  const handleTextChange = useCallback(
    (e) => {
      const text = e.target.value;
      if (text.length <= maxChars) {
        onUpdate({ text });
      }
    },
    [onUpdate, maxChars]
  );

  /** Handle color change */
  const handleColorChange = useCallback(
    (color) => onUpdate({ color }),
    [onUpdate]
  );

  /** Handle font family change — auto-adjust weight to closest available */
  const handleFontChange = useCallback(
    (fontFamily) => {
      const closestWeight = getClosestWeight(fontFamily, textState.fontWeight);
      onUpdate({ fontFamily, fontWeight: closestWeight });
      setAutoOpenWeight(true);
      setTimeout(() => setAutoOpenWeight(false), 200);
    },
    [textState.fontWeight, onUpdate]
  );

  /** Handle font weight change */
  const handleWeightChange = useCallback(
    (fontWeight) => onUpdate({ fontWeight }),
    [onUpdate]
  );

  const charCount = textState.text.length;
  const isNearLimit = charCount >= maxChars - 5;

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="space-y-3">
      {/* Section header with position controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-xs text-gray-500">({maxBoxHeight}px)</span>
        </div>

        {/* Up/Down arrow buttons for position swapping */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-1 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-1 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Font and Weight selectors */}
      <div className="grid grid-cols-2 gap-2">
        <FontSelector
          value={textState.fontFamily}
          onChange={handleFontChange}
          label="Font:"
        />
        <WeightSelector
          fontFamily={textState.fontFamily}
          value={textState.fontWeight}
          onChange={handleWeightChange}
          label="Weight:"
          autoOpen={autoOpenWeight}
        />
      </div>

      {/* Text input with character counter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-400">Text</label>
            <TextToolsButtons
              text={textState.text}
              onApply={(t) => onUpdate({ text: t })}
              maxLength={maxChars}
            />
          </div>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              isNearLimit
                ? 'text-amber-400 bg-amber-900/30 font-medium'
                : 'text-gray-400 bg-[#2a2a2a]'
            }`}
          >
            {charCount}/{maxChars}
          </span>
        </div>

        <input
          type="text"
          value={textState.text}
          onChange={handleTextChange}
          placeholder={`Enter ${label.toLowerCase()}...`}
          className="w-full px-3 py-2 text-sm bg-[#151515] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-shadow placeholder-gray-500"
        />
      </div>

      {/* Color picker */}
      <ColorPicker
        color={textState.color}
        onChange={handleColorChange}
        label="Text Color"
      />
    </div>
  );
}

export default WidgetTextSection;
