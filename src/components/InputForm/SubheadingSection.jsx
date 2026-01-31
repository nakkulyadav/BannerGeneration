/**
 * Subheading Section Component
 *
 * Optional subheading with split mode, rupee toggles, and strikethrough.
 * When split: left part (with strikethrough option) + right part
 * Rupee toggle adds "Starting at ₹" prefix
 */

import { useCallback } from 'react';
import { ColorPicker, ToggleSwitch } from '../shared';

/**
 * @param {Object} props
 * @param {Object} props.subheading - Subheading state
 * @param {function} props.onUpdate - Update handler for main subheading state
 * @param {function} props.onUpdateLeft - Update handler for left part
 * @param {function} props.onUpdateRight - Update handler for right part
 */
function SubheadingSection({ subheading, onUpdate, onUpdateLeft, onUpdateRight }) {
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

      {/* Split toggle - dark mode */}
      <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a] transition-colors hover:border-[#4a4a4a]">
        <ToggleSwitch
          checked={subheading.isSplit}
          onChange={handleSplitToggle}
          label="Split into two parts"
          description="Show price comparison (e.g., ₹518 → ₹74)"
        />
      </div>

      {/* Non-split mode: single input - dark mode */}
      {!subheading.isSplit ? (
        <div className="space-y-3 animate-fade-in">
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
        /* Split mode: left and right inputs - dark mode */
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          {/* Left part */}
          <div className="space-y-3 p-3 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a] transition-colors hover:border-[#4a4a4a]">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Left (Original Price)
            </span>

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
