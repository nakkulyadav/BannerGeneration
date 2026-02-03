/**
 * Form Validation Hook
 * Validates required fields and character limits
 */

import { useCallback, useMemo } from 'react';
import { TEXT } from '../constants/bannerConfig';

/**
 * Custom hook for form validation
 * @param {Object} bannerState - Current banner state
 * @returns {Object} Validation state and functions
 */
export function useFormValidation(bannerState) {
  /**
   * Validate heading text (max 40 characters)
   */
  const validateHeading = useCallback((text) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return { valid: false, error: 'Product heading is required' };
    }
    if (trimmed.length > TEXT.HEADING.MAX_CHARS) {
      return { valid: false, error: `Maximum ${TEXT.HEADING.MAX_CHARS} characters allowed` };
    }
    return { valid: true };
  }, []);

  /**
   * Check if a required field is filled
   */
  const isFieldFilled = useCallback((fieldPath) => {
    const keys = fieldPath.split('.');
    let value = bannerState;

    for (const key of keys) {
      value = value?.[key];
    }

    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return value != null && value !== '';
  }, [bannerState]);

  /**
   * Get validation status for all required fields
   */
  const validationStatus = useMemo(() => ({
    background: bannerState.background.imageUrl !== '',
    heading: bannerState.heading.text.trim() !== '',
    ctaText: bannerState.ctaButton.text.trim() !== '',
    ctaColor: bannerState.ctaButton.bgColor !== '',
    productImage: bannerState.productImage.imageUrl !== '',
  }), [bannerState]);

  /**
   * Check if all required fields are valid
   */
  const isFormComplete = useMemo(() => {
    return Object.values(validationStatus).every(Boolean);
  }, [validationStatus]);

  /**
   * Get list of missing required fields
   */
  const missingFields = useMemo(() => {
    const missing = [];
    if (!validationStatus.background) missing.push('Background Image');
    if (!validationStatus.heading) missing.push('Product Heading');
    if (!validationStatus.ctaText) missing.push('CTA Button Text');
    if (!validationStatus.ctaColor) missing.push('CTA Button Color');
    if (!validationStatus.productImage) missing.push('Product Image');
    return missing;
  }, [validationStatus]);

  /**
   * Validate offer badge (if text is provided, color is required)
   */
  const isOfferBadgeValid = useMemo(() => {
    const { text, bgColor } = bannerState.offerBadge;
    // If no text, it's valid (optional field)
    if (!text.trim()) return true;
    // If text is provided, color must also be provided
    return bgColor !== '';
  }, [bannerState.offerBadge]);

  return {
    validateHeading,
    isFieldFilled,
    validationStatus,
    isFormComplete,
    missingFields,
    isOfferBadgeValid,
  };
}

export default useFormValidation;
