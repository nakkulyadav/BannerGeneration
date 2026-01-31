/**
 * Color Picker Component
 *
 * A color picker with preset colors and hex input.
 * Uses react-color library for the picker interface.
 */

import { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { DEFAULT_COLORS } from '../../constants/defaultValues';

/**
 * @param {Object} props
 * @param {string} props.color - Current color value (hex)
 * @param {function} props.onChange - Callback when color changes
 * @param {string} props.label - Label for the color picker
 * @param {boolean} props.required - Whether this field is required
 */
function ColorPicker({ color, onChange, label, required = false }) {
  const [showPicker, setShowPicker] = useState(false);
  const [hexInput, setHexInput] = useState(color || '');
  const pickerRef = useRef(null);

  // Sync hex input with color prop
  useEffect(() => {
    setHexInput(color || '');
  }, [color]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle color change from picker
   */
  const handlePickerChange = (colorResult) => {
    onChange(colorResult.hex);
  };

  /**
   * Handle hex input change
   */
  const handleHexInput = (e) => {
    let value = e.target.value;

    // Add # prefix if missing
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }

    setHexInput(value);

    // Validate and apply if valid hex
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  /**
   * Handle preset color click
   */
  const handlePresetClick = (presetColor) => {
    onChange(presetColor);
    setShowPicker(false);
  };

  return (
    <div className="space-y-2">
      {/* Label - dark mode */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="flex items-center gap-3">
        {/* Color preview button with inline picker - positioned relative */}
        <div className="relative" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="w-10 h-10 rounded-lg border-2 border-[#3a3a3a] shadow-lg cursor-pointer hover:border-[#4a4a4a] hover:scale-105 active:scale-95 transition-all duration-150"
            style={{ backgroundColor: color || '#1a1a1a' }}
            aria-label="Open color picker"
          />

          {/* Color picker popup - positioned inline next to the button */}
          {showPicker && (
            <div className="absolute left-12 top-0 z-50 animate-slide-in-top shadow-2xl rounded-lg overflow-hidden">
              <ChromePicker
                color={color || '#000000'}
                onChange={handlePickerChange}
                disableAlpha
              />
            </div>
          )}
        </div>

        {/* Hex input - dark mode styling */}
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInput}
          placeholder="#000000"
          className="flex-1 px-3 py-2 text-sm bg-[#151515] border border-[#3a3a3a] text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none placeholder-gray-500"
          maxLength={7}
        />
      </div>

      {/* Preset colors - dark mode */}
      <div className="flex flex-wrap gap-2">
        {DEFAULT_COLORS.PRESETS.map((presetColor) => (
          <button
            key={presetColor}
            type="button"
            onClick={() => handlePresetClick(presetColor)}
            className={`w-6 h-6 rounded border-2 cursor-pointer transition-transform hover:scale-110 ${
              color === presetColor ? 'border-blue-400 ring-2 ring-blue-500/30' : 'border-[#3a3a3a]'
            }`}
            style={{ backgroundColor: presetColor }}
            aria-label={`Select color ${presetColor}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;
