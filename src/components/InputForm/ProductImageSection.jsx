/**
 * Product Image Section Component
 *
 * Required product image upload. Will be auto-scaled to fit
 * the right section of the banner.
 */

import { useState, useCallback } from 'react';
import { ImageUpload } from '../shared';
import { useImageValidation } from '../../hooks/useImageValidation';

/**
 * @param {Object} props
 * @param {Object} props.productImage - Product image state
 * @param {function} props.onUpdate - Update handler
 */
function ProductImageSection({ productImage, onUpdate }) {
  const [error, setError] = useState('');
  const { validateProductImage } = useImageValidation();

  /**
   * Handle image upload
   */
  const handleUpload = useCallback(
    async (file) => {
      setError('');
      const result = await validateProductImage(file);

      if (result.valid) {
        onUpdate({
          image: file,
          imageUrl: result.imageUrl,
        });
      } else {
        setError(result.error);
      }
    },
    [validateProductImage, onUpdate]
  );

  /**
   * Handle image clear
   */
  const handleClear = useCallback(() => {
    if (productImage.imageUrl) {
      URL.revokeObjectURL(productImage.imageUrl);
    }
    onUpdate({
      image: null,
      imageUrl: '',
    });
    setError('');
  }, [productImage.imageUrl, onUpdate]);

  return (
    <div className="space-y-3">
      {/* Required indicator - dark mode */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Required</span>
        <span className="flex-1 h-px bg-[#2a2a2a]"></span>
      </div>

      <ImageUpload
        imageUrl={productImage.imageUrl}
        onUpload={handleUpload}
        onClear={handleClear}
        label="Product Image"
        required
        hint="Use transparent PNG for best results. Will be centered in the right section of the banner."
        error={error}
      />

      {/* Tips - dark mode styling */}
      <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-3 transition-colors hover:bg-amber-900/30 hover:border-amber-700/40">
        <p className="text-xs text-amber-400">
          <span className="font-semibold">Tip:</span> Product images with transparent backgrounds work best.
          The image will be auto-scaled to fit the available space.
        </p>
      </div>
    </div>
  );
}

export default ProductImageSection;
