/**
 * Background Section Component
 *
 * Handles background image upload (722x312 validation) and edge type selection.
 */

import { useState, useCallback } from 'react';
import { ImageUpload } from '../shared';
import { useImageValidation } from '../../hooks/useImageValidation';

/**
 * @param {Object} props
 * @param {Object} props.background - Background state
 * @param {function} props.onUpdate - Update handler
 */
function BackgroundSection({ background, onUpdate }) {
  const [error, setError] = useState('');
  const { validateBackgroundImage } = useImageValidation();

  /**
   * Handle image upload with validation
   */
  const handleUpload = useCallback(
    async (file) => {
      setError('');
      const result = await validateBackgroundImage(file);

      if (result.valid) {
        onUpdate({
          image: file,
          imageUrl: result.imageUrl,
        });
      } else {
        setError(result.error);
      }
    },
    [validateBackgroundImage, onUpdate]
  );

  /**
   * Handle image clear
   */
  const handleClear = useCallback(() => {
    if (background.imageUrl) {
      URL.revokeObjectURL(background.imageUrl);
    }
    onUpdate({
      image: null,
      imageUrl: '',
    });
    setError('');
  }, [background.imageUrl, onUpdate]);

  /**
   * Handle edge type change
   */
  const handleEdgeChange = useCallback(
    (edgeType) => {
      onUpdate({ edgeType });
    },
    [onUpdate]
  );

  return (
    <div className="space-y-5">
      {/* Background image upload */}
      <ImageUpload
        imageUrl={background.imageUrl}
        onUpload={handleUpload}
        onClear={handleClear}
        label="Background Image"
        required
        hint="Must be exactly 722×312 pixels (standard banner size)"
        error={error}
      />

      {/* Edge type selector - dark mode */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Edge Style
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Sharp edges option */}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
              background.edgeType === 'sharp'
                ? 'border-blue-500 bg-blue-900/20 shadow-lg'
                : 'border-[#3a3a3a] hover:border-[#4a4a4a] hover:bg-[#1a1a1a] bg-[#151515]'
            }`}
          >
            <input
              type="radio"
              name="edgeType"
              value="sharp"
              checked={background.edgeType === 'sharp'}
              onChange={() => handleEdgeChange('sharp')}
              className="w-4 h-4 text-blue-500 border-[#3a3a3a] bg-[#1a1a1a] focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <span className="text-sm font-medium text-gray-300 block">Sharp Corners</span>
              <span className="text-xs text-gray-500">No border radius</span>
            </div>
          </label>

          {/* Rounded edges option */}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98] ${
              background.edgeType === 'rounded'
                ? 'border-blue-500 bg-blue-900/20 shadow-lg'
                : 'border-[#3a3a3a] hover:border-[#4a4a4a] hover:bg-[#1a1a1a] bg-[#151515]'
            }`}
          >
            <input
              type="radio"
              name="edgeType"
              value="rounded"
              checked={background.edgeType === 'rounded'}
              onChange={() => handleEdgeChange('rounded')}
              className="w-4 h-4 text-blue-500 border-[#3a3a3a] bg-[#1a1a1a] focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <span className="text-sm font-medium text-gray-300 block">Rounded</span>
              <span className="text-xs text-gray-500">24px border radius</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default BackgroundSection;
