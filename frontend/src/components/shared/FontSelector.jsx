/**
 * Font Selector Component
 *
 * A dropdown for selecting font families from available options.
 * The dropdown shows each font in its own typeface for preview.
 */

import { AVAILABLE_FONTS } from '../../constants/fontConfig';

/**
 * @param {Object} props
 * @param {string} props.value - Current font family value (e.g., 'Inter', 'Roboto')
 * @param {function} props.onChange - Callback when font changes
 * @param {string} props.label - Label for the font selector (optional)
 * @param {string} props.className - Additional CSS classes (optional)
 */
function FontSelector({ value, onChange, label, className = '' }) {
  /**
   * Handle font selection change
   */
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-xs sm:text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Font Dropdown */}
      <select
        value={value}
        onChange={handleChange}
        style={{ fontFamily: value }} // Preview selected font
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
        {AVAILABLE_FONTS.map((font) => (
          <option
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.value }} // Preview each font in dropdown
          >
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FontSelector;
