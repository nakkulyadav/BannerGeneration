/**
 * Banner Generator Hook
 *
 * Manages banner generation with debouncing for performance.
 * Handles canvas lifecycle, loading states, and error handling.
 *
 * Supports multiple preset types:
 * - promotional_banner: Uses generateBanner (creates its own Fabric.Canvas)
 * - widget / others: Uses generatePresetCanvas (operates on existing Fabric.Canvas)
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { generateBanner } from '../utils/bannerGenerator';
import { generatePresetCanvas } from '../utils/presetGenerator';
import { getPresetConfig } from '../constants/presetConfigs';

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 300;

/**
 * Custom hook for debounced banner generation
 *
 * @param {Object} bannerState - Current banner state from App
 * @param {string} dimensionType - Preset type ('promotional_banner', 'widget', etc.)
 * @returns {Object} Hook state and functions
 */
export function useBannerGenerator(bannerState, dimensionType = 'promotional_banner') {
  // ==========================================================================
  // STATE
  // ==========================================================================

  // Loading state during banner generation
  const [isGenerating, setIsGenerating] = useState(false);

  // Error state for generation failures
  const [error, setError] = useState(null);

  // ==========================================================================
  // REFS
  // ==========================================================================

  // Canvas DOM element reference (set by component)
  const canvasRef = useRef(null);

  // Fabric.js canvas instance
  const fabricCanvasRef = useRef(null);

  // Debounce timer reference
  const debounceTimerRef = useRef(null);

  // Track if component is mounted (prevent state updates after unmount)
  const isMountedRef = useRef(true);

  // ==========================================================================
  // CANVAS GENERATION
  // ==========================================================================

  /**
   * Core generation function - generates banner on canvas.
   * For promotional_banner: delegates to generateBanner (creates its own Fabric.Canvas).
   * For other presets (widget, etc.): creates Fabric.Canvas and calls generatePresetCanvas.
   */
  const executeGeneration = useCallback(async () => {
    // Guard: ensure canvas element exists
    if (!canvasRef.current) {
      return;
    }

    // Guard: ensure component is still mounted
    if (!isMountedRef.current) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Dispose existing Fabric canvas if any
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }

      let canvas;

      if (dimensionType === 'promotional_banner') {
        // Promotional banner uses its own full-featured generator
        canvas = await generateBanner(canvasRef.current, bannerState);
      } else {
        // Other presets: create Fabric.Canvas then call generatePresetCanvas
        const config = getPresetConfig(dimensionType);
        const { width, height } = config?.dimensions || { width: 164, height: 164 };

        canvas = new fabric.Canvas(canvasRef.current, {
          width,
          height,
          backgroundColor: '#ffffff',
          selection: false,
        });

        await generatePresetCanvas(canvas, bannerState, dimensionType);
      }

      // Store reference for cleanup and export
      if (isMountedRef.current) {
        fabricCanvasRef.current = canvas;
      } else {
        // Component unmounted during generation - dispose immediately
        canvas.dispose();
      }
    } catch (err) {
      console.error('Banner generation failed:', err);
      if (isMountedRef.current) {
        setError('Failed to generate preview');
      }
    } finally {
      if (isMountedRef.current) {
        setIsGenerating(false);
      }
    }
  }, [bannerState, dimensionType]);

  /**
   * Debounced generation trigger
   * Cancels any pending generation and schedules new one
   */
  const triggerGeneration = useCallback(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Schedule new generation after delay
    debounceTimerRef.current = setTimeout(() => {
      executeGeneration();
    }, DEBOUNCE_DELAY);
  }, [executeGeneration]);

  // ==========================================================================
  // CANVAS REF SETTER
  // ==========================================================================

  /**
   * Set canvas DOM element reference
   * Called by component to provide canvas element
   */
  const setCanvasElement = useCallback((element) => {
    canvasRef.current = element;

    // Trigger initial generation when canvas is set
    if (element) {
      triggerGeneration();
    }
  }, [triggerGeneration]);

  // ==========================================================================
  // LIFECYCLE EFFECTS
  // ==========================================================================

  /**
   * Trigger regeneration when banner state changes
   */
  useEffect(() => {
    // Only trigger if canvas element exists
    if (canvasRef.current) {
      triggerGeneration();
    }
  }, [bannerState, triggerGeneration]);

  /**
   * Cleanup on unmount
   * - Clear debounce timer
   * - Dispose Fabric canvas
   */
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      // Clear pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Dispose Fabric canvas
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // ==========================================================================
  // CANVAS ACCESS
  // ==========================================================================

  /**
   * Get the current Fabric canvas instance
   * Used for export functionality
   */
  const getFabricCanvas = useCallback(() => {
    return fabricCanvasRef.current;
  }, []);

  // ==========================================================================
  // RETURN HOOK API
  // ==========================================================================

  return {
    // State
    isGenerating,
    error,

    // Refs
    setCanvasElement,
    getFabricCanvas,

    // Actions
    regenerate: triggerGeneration,
  };
}

export default useBannerGenerator;
