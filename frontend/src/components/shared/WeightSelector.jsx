/**
 * Weight Selector Component
 *
 * A dropdown for selecting font weight from available options for the current font.
 * Dynamically filters weights based on font family and supports auto-open.
 */

import { useRef, useEffect } from 'react';
import { getAvailableWeights, getWeightLabel } from '../../constants/fontConfig';

/**
 * @param {Object} props
 * @param {string} props.fontFamily - Current font family (to determine available weights)
 * @param {number} props.value - Current weight value (e.g., 400, 700)
 * @param {function} props.onChange - Callback when weight changes
 * @param {string} props.label - Label for the weight selector (optional)
 * @param {boolean} props.autoOpen - Whether to auto-open the dropdown (optional)
 * @param {string} props.className - Additional CSS classes (optional)
 */
function WeightSelector({ fontFamily, value, onChange, label, autoOpen = false, className = '' }) {
  const selectRef = useRef(null);

  // Get available weights for the current font
  const availableWeights = getAvailableWeights(fontFamily);

  /**
   * Auto-open dropdown when autoOpen prop is true
   * Used when font changes to draw user attention to weight selector
   */
  useEffect(() => {
    if (autoOpen && selectRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        selectRef.current?.focus();
        // Programmatically open the select (works in most browsers)
        selectRef.current?.showPicker?.();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [autoOpen]);

  /**
   * Handle weight selection change
   */
  const handleChange = (e) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-xs sm:text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Weight Dropdown */}
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        className="
          w-full px-3 py-2.5
          bg-[#2a2a2a] text-white
          border border-gray-600 rounded-lg
          text-sm sm:text-base
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          hover:border-gray-500
          transition-all duration-200
          cursor-pointer
        "
      >
        {availableWeights.map((weight) => (
          <option key={weight} value={weight}>
            {getWeightLabel(weight)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default WeightSelector;
