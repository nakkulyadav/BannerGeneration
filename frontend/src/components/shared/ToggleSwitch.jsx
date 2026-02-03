/**
 * Toggle Switch Component
 *
 * A clean, modern toggle switch for boolean options.
 * Includes smooth transitions and focus states for accessibility.
 */

/**
 * @param {Object} props
 * @param {boolean} props.checked - Current toggle state
 * @param {function} props.onChange - Callback when toggle changes
 * @param {string} props.label - Label for the toggle
 * @param {string} props.description - Optional description text
 * @param {boolean} props.disabled - Whether the toggle is disabled
 */
function ToggleSwitch({ checked, onChange, label, description, disabled = false }) {
  return (
    <label
      className={`flex items-start gap-3 cursor-pointer group select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* Toggle switch track - dark mode styling */}
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        {/* Track background - dark mode colors */}
        <div
          className={`
            w-9 h-5 rounded-full transition-all duration-200
            ${checked
              ? 'bg-blue-500 group-hover:bg-blue-400'
              : 'bg-[#3a3a3a] group-hover:bg-[#4a4a4a]'
            }
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#1a1a1a]
          `}
        />
        {/* Toggle knob */}
        <div
          className={`
            absolute top-0.5 left-0.5 w-4 h-4 bg-gray-100 rounded-full shadow-sm
            transition-all duration-200 ease-out
            ${checked ? 'translate-x-4' : 'translate-x-0'}
            group-hover:shadow-md group-active:scale-95
          `}
        />
      </div>

      {/* Label and description - dark mode */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-300 group-hover:text-gray-200 transition-colors">
          {label}
        </span>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

export default ToggleSwitch;
