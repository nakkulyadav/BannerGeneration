/**
 * Auto-Save Hook
 *
 * Provides automatic saving of canvas state with debouncing.
 * Tracks dirty state and displays save status indicator.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { updateProject } from '../services/projectService';
import { generateThumbnail, uploadThumbnail } from '../services/thumbnailService';

// Auto-save configuration
const AUTOSAVE_CONFIG = {
  debounceMs: 2000, // Wait 2 seconds after last change before saving
  thumbnailDebounceMs: 5000, // Wait 5 seconds before updating thumbnail
};

/**
 * Save status enum
 */
export const SaveStatus = {
  SAVED: 'saved',
  SAVING: 'saving',
  UNSAVED: 'unsaved',
  ERROR: 'error',
};

/**
 * Auto-save hook
 *
 * @param {Object} options - Hook options
 * @param {string} options.projectId - Project ID to save to
 * @param {Object} options.canvasState - Current canvas state
 * @param {Object} options.canvas - Fabric.js canvas instance (for thumbnail)
 * @param {boolean} options.enabled - Whether auto-save is enabled
 * @returns {Object} Save status and manual save function
 */
export const useAutoSave = ({
  projectId,
  canvasState,
  canvas,
  enabled = true,
}) => {
  // Save status state
  const [saveStatus, setSaveStatus] = useState(SaveStatus.SAVED);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  // Refs for debouncing
  const saveTimerRef = useRef(null);
  const thumbnailTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);

  /**
   * Save canvas state to database
   */
  const saveCanvasState = useCallback(async () => {
    if (!projectId || !enabled) return;

    // Skip if state hasn't changed
    const currentStateString = JSON.stringify(canvasState);
    if (currentStateString === lastSavedStateRef.current) {
      return;
    }

    setSaveStatus(SaveStatus.SAVING);
    setError(null);

    try {
      const { error: saveError } = await updateProject(projectId, {
        canvasState,
      });

      if (saveError) {
        throw saveError;
      }

      // Update refs
      lastSavedStateRef.current = currentStateString;
      setLastSaved(new Date());
      setSaveStatus(SaveStatus.SAVED);
    } catch (err) {
      console.error('Auto-save failed:', err);
      setError(err.message || 'Failed to save');
      setSaveStatus(SaveStatus.ERROR);
    }
  }, [projectId, canvasState, enabled]);

  /**
   * Update project thumbnail
   */
  const updateThumbnail = useCallback(async () => {
    if (!projectId || !canvas || !enabled) return;

    try {
      const thumbnailBlob = await generateThumbnail(canvas);
      if (!thumbnailBlob) return;

      const { url, error: uploadError } = await uploadThumbnail(projectId, thumbnailBlob);
      if (uploadError) {
        console.error('Thumbnail upload failed:', uploadError);
        return;
      }

      // Update project with new thumbnail URL
      await updateProject(projectId, { thumbnailUrl: url });
    } catch (err) {
      console.error('Thumbnail update failed:', err);
    }
  }, [projectId, canvas, enabled]);

  /**
   * Manual save function (can be called by user)
   */
  const save = useCallback(async () => {
    // Clear any pending auto-save
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    await saveCanvasState();
  }, [saveCanvasState]);

  /**
   * Set up auto-save effect
   */
  useEffect(() => {
    if (!enabled || !projectId) return;

    // Mark as unsaved when state changes
    const currentStateString = JSON.stringify(canvasState);
    if (currentStateString !== lastSavedStateRef.current) {
      setSaveStatus(SaveStatus.UNSAVED);
    }

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set up debounced save
    saveTimerRef.current = setTimeout(() => {
      saveCanvasState();
    }, AUTOSAVE_CONFIG.debounceMs);

    // Cleanup
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [canvasState, enabled, projectId, saveCanvasState]);

  /**
   * Set up thumbnail update effect (less frequent than state save)
   */
  useEffect(() => {
    if (!enabled || !projectId || !canvas) return;

    // Clear existing timer
    if (thumbnailTimerRef.current) {
      clearTimeout(thumbnailTimerRef.current);
    }

    // Set up debounced thumbnail update
    thumbnailTimerRef.current = setTimeout(() => {
      updateThumbnail();
    }, AUTOSAVE_CONFIG.thumbnailDebounceMs);

    // Cleanup
    return () => {
      if (thumbnailTimerRef.current) {
        clearTimeout(thumbnailTimerRef.current);
      }
    };
  }, [canvasState, enabled, projectId, canvas, updateThumbnail]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      if (thumbnailTimerRef.current) {
        clearTimeout(thumbnailTimerRef.current);
      }
    };
  }, []);

  return {
    saveStatus,
    lastSaved,
    error,
    save,
    isSaving: saveStatus === SaveStatus.SAVING,
    isUnsaved: saveStatus === SaveStatus.UNSAVED,
    hasError: saveStatus === SaveStatus.ERROR,
  };
};

export default useAutoSave;
