/**
 * Editor Context Provider
 *
 * Centralizes all editor state management for the banner/graphics editor.
 * Manages canvas state, selected elements, undo/redo stack, project metadata,
 * and all state update handlers.
 *
 * Usage:
 * 1. Wrap EditorPage with <EditorProvider>
 * 2. Use useEditor() hook to access editor state and methods
 *
 * @module contexts/EditorContext
 */

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { INITIAL_BANNER_STATE } from '../constants/defaultValues';
import { getPresetInitialState } from '../constants/presetConfigs';
import { validatePresetState } from '../utils/presetGenerator';
import { loadFontSettings, saveFontSettings, mergeFontSettings, extractFontSettings } from '../utils/fontStorage';
import { AVAILABLE_FONTS, getAvailableWeights } from '../constants/fontConfig';

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const EditorContext = createContext(null);

/**
 * Custom hook to access editor context
 * @returns {Object} Editor context value with state and methods
 * @throws {Error} If used outside of EditorProvider
 */
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Maximum number of undo/redo states to keep in history
 */
const MAX_HISTORY_LENGTH = 50;

/**
 * Debounce delay for font settings persistence (ms)
 */
const FONT_SAVE_DEBOUNCE = 300;

// =============================================================================
// EDITOR PROVIDER
// =============================================================================

/**
 * Editor Provider Component
 *
 * Provides centralized state management for the editor, including:
 * - Banner/canvas state (all elements and their properties)
 * - Project metadata (dimensions, type, etc.)
 * - UI state (search panel, selected element)
 * - History management (undo/redo)
 * - Save status tracking
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @param {Object} props.projectConfig - Initial project configuration
 * @param {string} props.projectConfig.projectId - Project ID
 * @param {string} props.projectConfig.dimensionType - 'promotional_banner' | 'widget' | 'custom' | etc.
 * @param {number} props.projectConfig.width - Canvas width in pixels
 * @param {number} props.projectConfig.height - Canvas height in pixels
 * @param {number} props.projectConfig.borderRadius - Corner radius in pixels
 * @param {boolean} props.projectConfig.isNew - Whether this is a new project
 * @param {Object} props.projectConfig.initialState - Initial canvas state (for existing projects)
 */
export const EditorProvider = ({ children, projectConfig = {} }) => {
  const {
    projectId = null,
    dimensionType = 'promotional_banner',
    width = 722,
    height = 312,
    borderRadius = 12,
    isNew = true,
    initialState = null,
    projectName = 'Untitled Project',
  } = projectConfig;

  // ===========================================================================
  // PROJECT METADATA STATE
  // ===========================================================================

  const [project, setProject] = useState({
    id: projectId,
    name: projectName,
    dimensionType,
    width,
    height,
    borderRadius,
    isNew,
  });

  // ===========================================================================
  // BANNER/CANVAS STATE
  // ===========================================================================

  /**
   * Initialize banner state with localStorage-persisted font settings.
   * Uses dimension-specific initial state for non-promotional presets.
   */
  const [bannerState, setBannerState] = useState(() => {
    // If we have initial state from a loaded project, use it
    if (initialState) {
      return initialState;
    }

    // Get dimension-specific initial state (widget, circular_badge, etc.)
    // Falls back to INITIAL_BANNER_STATE for promotional_banner or unknown types
    const baseState = getPresetInitialState(dimensionType) || INITIAL_BANNER_STATE;

    // Font settings persistence only applies to the promotional banner preset
    if (dimensionType !== 'promotional_banner') {
      return baseState;
    }

    // Load saved font settings from localStorage
    const loadedSettings = loadFontSettings();

    // If no saved settings, use initial state as-is
    if (!loadedSettings) {
      return baseState;
    }

    // Validation functions for font/weight
    const isValidFont = (fontFamily) => {
      return AVAILABLE_FONTS.some((font) => font.value === fontFamily);
    };

    const isValidWeight = (fontFamily, weight) => {
      const availableWeights = getAvailableWeights(fontFamily);
      return availableWeights.includes(weight);
    };

    // Merge loaded settings with initial state (with validation)
    return mergeFontSettings(baseState, loadedSettings, {
      isValidFont,
      isValidWeight,
    });
  });

  // ===========================================================================
  // UI STATE
  // ===========================================================================

  /**
   * Search panel state - controls the AI image search panel
   */
  const [searchPanel, setSearchPanel] = useState({
    isOpen: false,
    activeField: null, // 'logo' | 'product' | 'background' | custom element ID
  });

  /**
   * Custom image select handler - allows custom editor to override default behavior
   */
  const [customImageSelectHandler, setCustomImageSelectHandler] = useState(null);

  /**
   * Selected element state - for custom editor element selection
   */
  const [selectedElement, setSelectedElement] = useState(null);

  /**
   * Save status tracking
   */
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved' | 'error'

  /**
   * Loading state
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Target language for text translation (UI-only, not persisted/undo-tracked)
   */
  const [targetLanguage, setTargetLanguage] = useState('hi');

  // ===========================================================================
  // HISTORY MANAGEMENT (UNDO/REDO)
  // ===========================================================================

  const [history, setHistory] = useState({
    past: [],      // Array of past states
    future: [],    // Array of future states (for redo)
  });

  /**
   * Push current state to history before making changes
   * @param {Object} currentState - Current banner state to save
   */
  const pushToHistory = useCallback((currentState) => {
    setHistory(prev => ({
      past: [...prev.past.slice(-MAX_HISTORY_LENGTH + 1), currentState],
      future: [], // Clear future when new change is made
    }));
  }, []);

  /**
   * Undo the last change
   */
  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previousState = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      // Save current state to future for redo
      setBannerState(currentState => {
        setHistory(h => ({
          past: newPast,
          future: [currentState, ...h.future],
        }));
        return previousState;
      });

      return prev; // Return unchanged, actual update happens in setBannerState callback
    });
  }, []);

  /**
   * Redo the last undone change
   */
  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const nextState = prev.future[0];
      const newFuture = prev.future.slice(1);

      // Save current state to past for undo
      setBannerState(currentState => {
        setHistory(h => ({
          past: [...h.past, currentState],
          future: newFuture,
        }));
        return nextState;
      });

      return prev;
    });
  }, []);

  /**
   * Check if undo is available
   */
  const canUndo = history.past.length > 0;

  /**
   * Check if redo is available
   */
  const canRedo = history.future.length > 0;

  // ===========================================================================
  // FONT SETTINGS PERSISTENCE
  // ===========================================================================

  const saveTimerRef = useRef(null);

  /**
   * Save font settings to localStorage with debouncing
   */
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const fontSettings = extractFontSettings(bannerState);
      saveFontSettings(fontSettings);
    }, FONT_SAVE_DEBOUNCE);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [
    bannerState.heading?.fontFamily,
    bannerState.heading?.fontWeight,
    bannerState.subheading?.fontFamily,
    bannerState.subheading?.weightLeft,
    bannerState.subheading?.weightRight,
    bannerState.subheading?.weightSingle,
    bannerState.ctaButton?.fontFamily,
    bannerState.ctaButton?.fontWeight,
    bannerState.tcText?.fontFamily,
    bannerState.tcText?.fontWeight,
    bannerState.offerBadge?.fontFamily,
    bannerState.offerBadge?.fontWeight,
  ]);

  // ===========================================================================
  // STATE UPDATE HANDLERS
  // ===========================================================================

  /**
   * Generic state update helper that tracks history and save status
   * @param {string} section - Section of banner state to update
   * @param {Object} updates - Updates to apply
   * @param {boolean} trackHistory - Whether to track this change in history
   */
  const updateSection = useCallback((section, updates, trackHistory = true) => {
    setBannerState(prev => {
      if (trackHistory) {
        pushToHistory(prev);
      }

      const newState = {
        ...prev,
        [section]: { ...prev[section], ...updates },
      };

      return newState;
    });
    setSaveStatus('unsaved');
  }, [pushToHistory]);

  /**
   * Update background image and edge type
   */
  const updateBackground = useCallback((updates) => {
    updateSection('background', updates);
  }, [updateSection]);

  /**
   * Update brand logo
   */
  const updateBrandLogo = useCallback((updates) => {
    updateSection('brandLogo', updates);
  }, [updateSection]);

  /**
   * Update product heading
   */
  const updateHeading = useCallback((updates) => {
    updateSection('heading', updates);
  }, [updateSection]);

  /**
   * Update product subheading (handles split mode)
   */
  const updateSubheading = useCallback((updates) => {
    updateSection('subheading', updates);
  }, [updateSection]);

  /**
   * Update subheading left part
   */
  const updateSubheadingLeft = useCallback((updates) => {
    setBannerState(prev => {
      pushToHistory(prev);
      return {
        ...prev,
        subheading: {
          ...prev.subheading,
          left: { ...prev.subheading.left, ...updates },
        },
      };
    });
    setSaveStatus('unsaved');
  }, [pushToHistory]);

  /**
   * Update subheading right part
   */
  const updateSubheadingRight = useCallback((updates) => {
    setBannerState(prev => {
      pushToHistory(prev);
      return {
        ...prev,
        subheading: {
          ...prev.subheading,
          right: { ...prev.subheading.right, ...updates },
        },
      };
    });
    setSaveStatus('unsaved');
  }, [pushToHistory]);

  /**
   * Update CTA button
   */
  const updateCtaButton = useCallback((updates) => {
    updateSection('ctaButton', updates);
  }, [updateSection]);

  /**
   * Update T&C text
   */
  const updateTcText = useCallback((updates) => {
    updateSection('tcText', updates);
  }, [updateSection]);

  /**
   * Update offer badge
   */
  const updateOfferBadge = useCallback((updates) => {
    updateSection('offerBadge', updates);
  }, [updateSection]);

  /**
   * Update product image
   */
  const updateProductImage = useCallback((updates) => {
    updateSection('productImage', updates);
  }, [updateSection]);

  /**
   * Reset banner state to initial values
   */
  const resetBannerState = useCallback(() => {
    pushToHistory(bannerState);
    setBannerState(INITIAL_BANNER_STATE);
    setSaveStatus('unsaved');
  }, [bannerState, pushToHistory]);

  /**
   * Set entire banner state (for loading projects)
   */
  const setFullBannerState = useCallback((newState) => {
    setBannerState(newState);
    setHistory({ past: [], future: [] }); // Clear history when loading new state
    setSaveStatus('saved');
  }, []);

  // ===========================================================================
  // SEARCH PANEL HANDLERS
  // ===========================================================================

  /**
   * Open the AI search panel for a specific field
   * @param {string} field - 'logo' | 'product' | 'background'
   */
  const openSearchPanel = useCallback((field) => {
    setSearchPanel({ isOpen: true, activeField: field });
  }, []);

  /**
   * Close the AI search panel
   */
  const closeSearchPanel = useCallback(() => {
    setSearchPanel({ isOpen: false, activeField: null });
  }, []);

  /**
   * Handle image selection from the search panel
   * @param {string} imageUrl - URL of the selected image
   */
  const handleSearchSelect = useCallback((imageUrl) => {
    // If a custom handler is set (e.g., by CustomEditor), use it
    if (customImageSelectHandler) {
      customImageSelectHandler(imageUrl, searchPanel.activeField);
      return;
    }

    // Default handling for preset editor fields
    setSearchPanel((prev) => {
      if (prev.activeField === 'logo') {
        updateBrandLogo({ image: null, imageUrl });
      } else if (prev.activeField === 'product') {
        updateProductImage({ image: null, imageUrl });
      } else if (prev.activeField === 'background') {
        updateBackground({ image: null, imageUrl });
      }
      return prev;
    });
  }, [updateBrandLogo, updateProductImage, updateBackground, customImageSelectHandler, searchPanel.activeField]);

  // ===========================================================================
  // PROJECT HANDLERS
  // ===========================================================================

  /**
   * Update project metadata
   * @param {Object} updates - Updates to apply to project metadata
   */
  const updateProject = useCallback((updates) => {
    setProject(prev => ({ ...prev, ...updates }));
    setSaveStatus('unsaved');
  }, []);

  /**
   * Rename the project
   * @param {string} newName - New project name
   */
  const renameProject = useCallback((newName) => {
    updateProject({ name: newName });
  }, [updateProject]);

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  /**
   * Check if all required fields for the current preset are filled.
   * Uses validatePresetState for non-promotional presets (widget, etc.).
   * @returns {boolean} Whether the form is valid
   */
  const isFormValid = useCallback(() => {
    // Promotional banner uses the original hardcoded validation
    if (dimensionType === 'promotional_banner') {
      const { background, heading, ctaButton, productImage } = bannerState;
      return (
        background.imageUrl !== '' &&
        heading.text.trim() !== '' &&
        ctaButton.text.trim() !== '' &&
        ctaButton.bgColor !== '' &&
        productImage.imageUrl !== ''
      );
    }

    // All other presets use config-driven validation
    const { isValid } = validatePresetState(bannerState, dimensionType);
    return isValid;
  }, [bannerState, dimensionType]);

  /**
   * Get list of missing required fields.
   * Uses validatePresetState for non-promotional presets (widget, etc.).
   * @returns {string[]} Array of missing field names
   */
  const getMissingFields = useCallback(() => {
    // Promotional banner uses the original hardcoded checks
    if (dimensionType === 'promotional_banner') {
      const missing = [];
      const { background, heading, ctaButton, productImage } = bannerState;

      if (!background.imageUrl) missing.push('Background Image');
      if (!heading.text.trim()) missing.push('Heading');
      if (!ctaButton.text.trim()) missing.push('CTA Button Text');
      if (!ctaButton.bgColor) missing.push('CTA Button Color');
      if (!productImage.imageUrl) missing.push('Product Image');

      return missing;
    }

    // All other presets use config-driven validation
    const { errors } = validatePresetState(bannerState, dimensionType);
    return errors;
  }, [bannerState, dimensionType]);

  // ===========================================================================
  // SAVE STATUS HELPERS
  // ===========================================================================

  /**
   * Mark content as saving
   */
  const markSaving = useCallback(() => {
    setSaveStatus('saving');
  }, []);

  /**
   * Mark content as saved
   */
  const markSaved = useCallback(() => {
    setSaveStatus('saved');
  }, []);

  /**
   * Mark save as failed
   */
  const markSaveError = useCallback(() => {
    setSaveStatus('error');
  }, []);

  // ===========================================================================
  // DERIVED STATE
  // ===========================================================================

  /**
   * Check if current project is a preset type
   */
  const isPreset = project.dimensionType !== 'custom';

  /**
   * Check if current project is custom
   */
  const isCustom = project.dimensionType === 'custom';

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================

  const value = {
    // Project metadata
    project,
    updateProject,
    renameProject,
    isPreset,
    isCustom,

    // Banner/canvas state
    bannerState,
    setBannerState: setFullBannerState,

    // State update handlers
    updateSection, // Generic handler for any state section
    updateBackground,
    updateBrandLogo,
    updateHeading,
    updateSubheading,
    updateSubheadingLeft,
    updateSubheadingRight,
    updateCtaButton,
    updateTcText,
    updateOfferBadge,
    updateProductImage,
    resetBannerState,

    // Search panel
    searchPanel,
    openSearchPanel,
    closeSearchPanel,
    handleSearchSelect,
    setCustomImageSelectHandler,

    // Element selection (for custom editor)
    selectedElement,
    setSelectedElement,

    // History management
    undo,
    redo,
    canUndo,
    canRedo,

    // Save status
    saveStatus,
    setSaveStatus,
    markSaving,
    markSaved,
    markSaveError,
    isUnsaved: saveStatus === 'unsaved',
    isSaving: saveStatus === 'saving',

    // Loading state
    isLoading,
    setIsLoading,

    // Text tools — target language for translation
    targetLanguage,
    setTargetLanguage,

    // Validation
    isFormValid,
    getMissingFields,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
