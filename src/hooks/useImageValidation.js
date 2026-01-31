/**
 * Image Validation Hook
 * Validates image dimensions and formats
 */

import { useCallback } from 'react';
import { VALIDATION, BANNER } from '../constants/bannerConfig';

/**
 * Custom hook for validating uploaded images
 * @returns {Object} Validation functions
 */
export function useImageValidation() {
  /**
   * Validate background image dimensions (must be exactly 722x312)
   * @param {File} file - The uploaded file
   * @returns {Promise<{valid: boolean, error?: string, imageUrl?: string}>}
   */
  const validateBackgroundImage = useCallback((file) => {
    return new Promise((resolve) => {
      // Check file type
      if (!VALIDATION.ACCEPTED_IMAGE_FORMATS.includes(file.type)) {
        resolve({
          valid: false,
          error: 'Invalid file format. Please upload JPG, PNG, or WebP.',
        });
        return;
      }

      const img = new Image();
      const imageUrl = URL.createObjectURL(file);

      img.onload = () => {
        if (
          img.width === VALIDATION.BACKGROUND.REQUIRED_WIDTH &&
          img.height === VALIDATION.BACKGROUND.REQUIRED_HEIGHT
        ) {
          resolve({
            valid: true,
            imageUrl,
            width: img.width,
            height: img.height,
          });
        } else {
          URL.revokeObjectURL(imageUrl);
          resolve({
            valid: false,
            error: VALIDATION.BACKGROUND.ERROR_MESSAGE,
          });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        resolve({
          valid: false,
          error: 'Failed to load image. Please try another file.',
        });
      };

      img.src = imageUrl;
    });
  }, []);

  /**
   * Validate logo image (any dimensions, will be scaled)
   * @param {File} file - The uploaded file
   * @returns {Promise<{valid: boolean, error?: string, imageUrl?: string}>}
   */
  const validateLogoImage = useCallback((file) => {
    return new Promise((resolve) => {
      // Check file type
      if (!VALIDATION.ACCEPTED_IMAGE_FORMATS.includes(file.type)) {
        resolve({
          valid: false,
          error: 'Invalid file format. Please upload JPG, PNG, or WebP.',
        });
        return;
      }

      const img = new Image();
      const imageUrl = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          valid: true,
          imageUrl,
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        resolve({
          valid: false,
          error: 'Failed to load image. Please try another file.',
        });
      };

      img.src = imageUrl;
    });
  }, []);

  /**
   * Validate product image (any dimensions, will be scaled)
   * @param {File} file - The uploaded file
   * @returns {Promise<{valid: boolean, error?: string, imageUrl?: string}>}
   */
  const validateProductImage = useCallback((file) => {
    return new Promise((resolve) => {
      // Check file type
      if (!VALIDATION.ACCEPTED_IMAGE_FORMATS.includes(file.type)) {
        resolve({
          valid: false,
          error: 'Invalid file format. Please upload JPG, PNG, or WebP.',
        });
        return;
      }

      const img = new Image();
      const imageUrl = URL.createObjectURL(file);

      img.onload = () => {
        resolve({
          valid: true,
          imageUrl,
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        resolve({
          valid: false,
          error: 'Failed to load image. Please try another file.',
        });
      };

      img.src = imageUrl;
    });
  }, []);

  return {
    validateBackgroundImage,
    validateLogoImage,
    validateProductImage,
  };
}

export default useImageValidation;
