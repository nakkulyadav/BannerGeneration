/**
 * Subheading Section Component
 *
 * Optional subheading with split mode, rupee toggles, strikethrough, and font/weight selectors.
 * When split: left part (with strikethrough option) + right part
 * Font is shared between split/non-split, but weights are separate.
 */

import { useCallback, useState } from 'react';
import { ColorPicker, ToggleSwitch } from '../shared';
import FontSelector from '../shared/FontSelector';
import WeightSelector from '../shared/WeightSelector';
import { getClosestWeight } from '../../constants/fontConfig';

/**
 * @param {Object} props
 * @param {Object} props.subheading - Subheading state (includes fontFamily, weightLeft, weightRight, weightSingle)
 * @param {function} props.onUpdate - Update handler for main subheading state
 * @param {function} props.onUpdateLeft - Update handler for left part
 * @param {function} props.onUpdateRight - Update handler for right part
 */
function SubheadingSection({ subheading, onUpdate, onUpdateLeft, onUpdateRight }) {
  // Track if weight selectors should auto-open (after font change)
  const [autoOpenWeights, setAutoOpenWeights] = useState(false);

  /**
   * Handle split toggle
   */
  const handleSplitToggle = useCallback(
    (isSplit) => {
      onUpdate({ isSplit });
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
   * Handle font family change (shared by all modes)
   * Automatically adjusts all weights to closest available
   */
  const handleFontChange = useCallback(
    (fontFamily) => {
      const closestWeightLeft = getClosestWeight(fontFamily, subheading.weightLeft);
      const closestWeightRight = getClosestWeight(fontFamily, subheading.weightRight);
      const closestWeightSingle = getClosestWeight(fontFamily, subheading.weightSingle);

      onUpdate({
        fontFamily,
        weightLeft: closestWeightLeft,
        weightRight: closestWeightRight,
        weightSingle: closestWeightSingle,
      });

      // Auto-open weight selectors to draw user attention
      setAutoOpenWeights(true);
      setTimeout(() => setAutoOpenWeights(false), 200);
    },
    [subheading.weightLeft, subheading.weightRight, subheading.weightSingle, onUpdate]
  );

  /**
   * Handle font weight changes
   */
  const handleWeightSingleChange = useCallback(
    (weightSingle) => {
      onUpdate({ weightSingle });
    },
    [onUpdate]
  );

  const handleWeightLeftChange = useCallback(
    (weightLeft) => {
      onUpdate({ weightLeft });
    },
    [onUpdate]
  );

  const handleWeightRightChange = useCallback(
    (weightRight) => {
      onUpdate({ weightRight });
    },
    [onUpdate]
  );

  return (
    <div className="space-y-4 p-4 bg-[#151515] rounded-xl border border-[#2a2a2a]">
      {/* Section header - dark mode */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-300">
            Product Subheading
          </span>
          <span className="ml-2 text-xs font-medium text-gray-500 bg-[#2a2a2a] px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>
      </div>

      {/* Font Selector - Shared across all modes (Option A: above split toggle) */}
      <div className="space-y-3">
        <FontSelector
          value={subheading.fontFamily}
          onChange={handleFontChange}
          label="Font:"
        />
      </div>

      {/* Split toggle - dark mode */}
      <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a] transition-colors hover:border-[#4a4a4a]">
        <ToggleSwitch
          checked={subheading.isSplit}
          onChange={handleSplitToggle}
          label="Split into two parts"
          description="Show price comparison (e.g., ₹518 → ₹74)"
        />
      </div>

      {/* Non-split mode: single input with weight selector - dark mode */}
      {!subheading.isSplit ? (
        <div className="space-y-3 animate-fade-in">
          {/* Weight Selector for Single Mode */}
          <WeightSelector
            fontFamily={subheading.fontFamily}
            value={subheading.weightSingle}
            onChange={handleWeightSingleChange}
            label="Weight:"
            autoOpen={autoOpenWeights}
          />

          {/* Text input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-400">
              Subheading Text
            </label>
            <input
              type="text"
              value={subheading.left.text}
              onChange={(e) => onUpdateLeft({ text: e.target.value })}
              placeholder="e.g., 59"
              className="w-full px-3 py-2 text-sm bg-[#1a1a1a] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder-gray-500"
            />
          </div>

          {/* Rupee toggle */}
          <ToggleSwitch
            checked={subheading.left.hasRupee}
            onChange={(hasRupee) => onUpdateLeft({ hasRupee })}
            label="Add rupee prefix"
            description='Shows "₹" before the text'
          />
        </div>
      ) : (
        /* Split mode: left and right inputs with separate weight selectors - dark mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {/* Left part */}
          <div className="space-y-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a] transition-colors hover:border-[#4a4a4a]">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Left (Original Price)
            </span>

            {/* Weight Selector for Left */}
            <WeightSelector
              fontFamily={subheading.fontFamily}
              value={subheading.weightLeft}
              onChange={handleWeightLeftChange}
              label="Weight:"
              autoOpen={autoOpenWeights}
            />

            <input
              type="text"
              value={subheading.left.text}
              onChange={(e) => onUpdateLeft({ text: e.target.value })}
              placeholder="e.g., 518"
              className="w-full px-3 py-2 text-sm bg-[#151515] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder-gray-500"
            />

            <ToggleSwitch
              checked={subheading.left.hasRupee}
              onChange={(hasRupee) => onUpdateLeft({ hasRupee })}
              label="₹ prefix"
            />

            <ToggleSwitch
              checked={subheading.left.hasStrikethrough}
              onChange={(hasStrikethrough) => onUpdateLeft({ hasStrikethrough })}
              label="Strikethrough"
              description="Show as crossed-out price"
            />
          </div>

          {/* Right part */}
          <div className="space-y-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a] transition-colors hover:border-[#4a4a4a]">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Right (Current Price)
            </span>

            {/* Weight Selector for Right */}
            <WeightSelector
              fontFamily={subheading.fontFamily}
              value={subheading.weightRight}
              onChange={handleWeightRightChange}
              label="Weight:"
              autoOpen={autoOpenWeights}
            />

            <input
              type="text"
              value={subheading.right.text}
              onChange={(e) => onUpdateRight({ text: e.target.value })}
              placeholder="e.g., 74"
              className="w-full px-3 py-2 text-sm bg-[#151515] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder-gray-500"
            />

            <ToggleSwitch
              checked={subheading.right.hasRupee}
              onChange={(hasRupee) => onUpdateRight({ hasRupee })}
              label="₹ prefix"
            />
          </div>
        </div>
      )}

      {/* Color picker */}
      <ColorPicker
        color={subheading.color}
        onChange={handleColorChange}
        label="Subheading Color"
      />
    </div>
  );
}

export default SubheadingSection;
