/**
 * useCustomCanvas Hook
 *
 * Custom hook for managing Fabric.js canvas state in the custom editor.
 * Handles element tracking, serialization/deserialization, selection,
 * and synchronization between canvas objects and React state.
 *
 * Features:
 * - Element tracking with unique IDs
 * - Canvas serialization to JSON for persistence
 * - Element selection synchronization
 * - Z-index (layer order) management
 * - Element CRUD operations
 *
 * @module hooks/useCustomCanvas
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import * as fabric from 'fabric';

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Maximum number of elements allowed on canvas
 */
const MAX_ELEMENTS = 50;

/**
 * Default element names by type
 */
const DEFAULT_NAMES = {
  image: 'Image',
  text: 'Text',
  background: 'Background',
};

// =============================================================================
// ELEMENT STATE TYPE
// =============================================================================

/**
 * @typedef {Object} CanvasElement
 * @property {string} id - Unique element identifier
 * @property {string} type - 'image' | 'text' | 'background'
 * @property {string} name - Display name for element
 * @property {boolean} locked - Whether element is locked
 * @property {boolean} visible - Whether element is visible
 * @property {number} zIndex - Layer order (higher = front)
 * @property {Object} properties - Type-specific properties
 */

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Custom hook for managing Fabric.js canvas state
 *
 * @param {Object} options - Hook options
 * @param {number} options.width - Canvas width in pixels
 * @param {number} options.height - Canvas height in pixels
 * @param {number} options.borderRadius - Canvas corner radius
 * @param {Object} options.initialState - Initial canvas state (for loading projects)
 * @param {Function} options.onStateChange - Callback when state changes (for auto-save)
 * @returns {Object} Canvas state and methods
 */
const useCustomCanvas = ({
  width = 722,
  height = 312,
  borderRadius = 0,
  initialState = null,
  onStateChange = null,
} = {}) => {
  // ===========================================================================
  // REFS
  // ===========================================================================

  /**
   * Reference to the Fabric.js canvas instance
   */
  const canvasRef = useRef(null);

  /**
   * Counter for generating unique element IDs
   */
  const idCounterRef = useRef(1);

  /**
   * Ref to store the latest updateElementProperties function
   * This avoids stale closure issues in event handlers
   */
  const updateElementPropertiesRef = useRef(null);

  // ===========================================================================
  // STATE
  // ===========================================================================

  /**
   * Map of all elements on canvas (keyed by ID)
   */
  const [elements, setElements] = useState({});

  /**
   * Currently selected element ID
   */
  const [selectedElementId, setSelectedElementId] = useState(null);

  /**
   * Background element (separate from regular elements)
   */
  const [background, setBackground] = useState({
    id: 'background',
    type: 'background',
    name: 'Background',
    imageUrl: '',
    color: '#ffffff',
    locked: true,
    visible: true,
  });

  /**
   * Whether canvas is initialized
   */
  const [isInitialized, setIsInitialized] = useState(false);

  // ===========================================================================
  // CANVAS INITIALIZATION
  // ===========================================================================

  /**
   * Initialize the Fabric.js canvas
   * @param {HTMLCanvasElement} canvasElement - Canvas DOM element
   */
  const initializeCanvas = useCallback((canvasElement) => {
    if (!canvasElement || canvasRef.current) return;

    // Create Fabric canvas with selection enabled
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
    });

    // Apply border radius clipping if specified
    if (borderRadius > 0) {
      const clipPath = new fabric.Rect({
        width,
        height,
        rx: borderRadius,
        ry: borderRadius,
        absolutePositioned: true,
      });
      fabricCanvas.clipPath = clipPath;
    }

    // Set up selection event listeners
    fabricCanvas.on('selection:created', handleSelectionCreated);
    fabricCanvas.on('selection:updated', handleSelectionUpdated);
    fabricCanvas.on('selection:cleared', handleSelectionCleared);

    // Set up object modification listeners
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:moving', handleObjectMoving);
    fabricCanvas.on('object:scaling', handleObjectScaling);
    fabricCanvas.on('object:rotating', handleObjectRotating);

    canvasRef.current = fabricCanvas;
    setIsInitialized(true);

    // Load initial state if provided
    if (initialState) {
      loadState(initialState);
    }

    return () => {
      fabricCanvas.dispose();
      canvasRef.current = null;
    };
  }, [width, height, borderRadius, initialState]);

  // ===========================================================================
  // SELECTION EVENT HANDLERS
  // ===========================================================================

  /**
   * Handle selection created event
   */
  const handleSelectionCreated = useCallback((e) => {
    const selectedObject = e.selected?.[0];
    if (selectedObject && selectedObject.elementId) {
      setSelectedElementId(selectedObject.elementId);
    }
  }, []);

  /**
   * Handle selection updated event
   */
  const handleSelectionUpdated = useCallback((e) => {
    const selectedObject = e.selected?.[0];
    if (selectedObject && selectedObject.elementId) {
      setSelectedElementId(selectedObject.elementId);
    }
  }, []);

  /**
   * Handle selection cleared event
   */
  const handleSelectionCleared = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  // ===========================================================================
  // OBJECT MODIFICATION HANDLERS
  // ===========================================================================

  /**
   * Handle object modification (move, scale, rotate complete)
   * Uses ref to avoid stale closure issues
   */
  const handleObjectModified = useCallback((e) => {
    const obj = e.target;
    if (!obj || !obj.elementId) return;

    // Use ref to get the latest updateElementProperties function
    if (updateElementPropertiesRef.current) {
      updateElementPropertiesRef.current(obj.elementId, {
        left: obj.left,
        top: obj.top,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        angle: obj.angle,
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
      });
    }
  }, []);

  /**
   * Handle object moving
   */
  const handleObjectMoving = useCallback((e) => {
    // Optional: Add constraints or snap-to-grid here
  }, []);

  /**
   * Handle object scaling
   */
  const handleObjectScaling = useCallback((e) => {
    // Optional: Add minimum/maximum size constraints here
  }, []);

  /**
   * Handle object rotating
   */
  const handleObjectRotating = useCallback((e) => {
    // Optional: Add angle snap here
  }, []);

  // ===========================================================================
  // ELEMENT ID GENERATION
  // ===========================================================================

  /**
   * Generate a unique element ID
   * @param {string} type - Element type
   * @returns {string} Unique ID
   */
  const generateElementId = useCallback((type) => {
    const id = `${type}_${idCounterRef.current++}`;
    return id;
  }, []);

  // ===========================================================================
  // ELEMENT CRUD OPERATIONS
  // ===========================================================================

  /**
   * Add a new image element to the canvas
   * @param {Object} options - Image options
   * @param {string} options.imageUrl - URL of the image (optional - creates placeholder if empty)
   * @param {string} options.name - Display name (optional)
   * @returns {Promise<string|null>} Element ID or null if failed
   */
  const addImage = useCallback(async (options = {}) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Check element limit
    if (Object.keys(elements).length >= MAX_ELEMENTS) {
      console.warn(`Maximum element limit (${MAX_ELEMENTS}) reached`);
      return null;
    }

    const { imageUrl, name } = options;

    // Generate unique ID
    const elementId = generateElementId('image');

    // Calculate default position (center of canvas)
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate element count for naming
    const imageCount = Object.values(elements).filter(el => el.type === 'image').length + 1;

    // If no imageUrl provided, create a placeholder element (no canvas object yet)
    if (!imageUrl) {
      const element = {
        id: elementId,
        type: 'image',
        name: name || `${DEFAULT_NAMES.image} ${imageCount}`,
        locked: false,
        visible: true,
        zIndex: Object.keys(elements).length,
        properties: {
          imageUrl: '',
          left: centerX,
          top: centerY,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          width: 100,
          height: 100,
        },
      };

      // Update state (no canvas object for placeholder)
      setElements(prev => ({ ...prev, [elementId]: element }));
      setSelectedElementId(elementId);

      // Notify state change
      if (onStateChange) {
        onStateChange();
      }

      return elementId;
    }

    try {
      // Load image from URL (Fabric.js 6.x uses Promise-based API)
      const img = await fabric.Image.fromURL(imageUrl, {
        crossOrigin: 'anonymous',
      });

      // Scale image to fit within canvas bounds
      const maxWidth = width * 0.6;
      const maxHeight = height * 0.6;
      let scale = 1;

      if (img.width > maxWidth || img.height > maxHeight) {
        scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      }

      // Configure image object
      img.set({
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        elementId,
        elementType: 'image',
      });

      // Configure selection controls
      img.setControlsVisibility({
        mt: false, // middle top
        mb: false, // middle bottom
        ml: false, // middle left
        mr: false, // middle right
        bl: true,  // bottom left
        br: true,  // bottom right
        tl: true,  // top left
        tr: true,  // top right
        mtr: true, // rotation
      });

      // Add to canvas
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      // Create element state
      const element = {
        id: elementId,
        type: 'image',
        name: name || `${DEFAULT_NAMES.image} ${imageCount}`,
        locked: false,
        visible: true,
        zIndex: canvas.getObjects().length,
        properties: {
          imageUrl,
          left: centerX,
          top: centerY,
          scaleX: scale,
          scaleY: scale,
          angle: 0,
          width: img.width * scale,
          height: img.height * scale,
        },
      };

      // Update state
      setElements(prev => ({ ...prev, [elementId]: element }));
      setSelectedElementId(elementId);

      // Notify state change
      if (onStateChange) {
        onStateChange();
      }

      return elementId;
    } catch (error) {
      console.error('Failed to add image:', error);
      return null;
    }
  }, [elements, width, height, generateElementId, onStateChange]);

  /**
   * Add a new text element to the canvas
   * @param {Object} options - Text options
   * @param {string} options.text - Initial text content
   * @param {string} options.name - Display name (optional)
   * @param {string} options.fontFamily - Font family
   * @param {number} options.fontSize - Font size
   * @param {number} options.fontWeight - Font weight
   * @param {string} options.color - Text color
   * @returns {string|null} Element ID or null if failed
   */
  const addText = useCallback((options = {}) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Check element limit
    if (Object.keys(elements).length >= MAX_ELEMENTS) {
      console.warn(`Maximum element limit (${MAX_ELEMENTS}) reached`);
      return null;
    }

    const {
      text = 'Enter text',
      name,
      fontFamily = 'Inter',
      fontSize = 24,
      fontWeight = 400,
      color = '#000000',
    } = options;

    // Generate unique ID
    const elementId = generateElementId('text');

    // Calculate default position (center of canvas)
    const centerX = width / 2;
    const centerY = height / 2;

    // Create text object
    const textObj = new fabric.Textbox(text, {
      left: centerX,
      top: centerY,
      originX: 'center',
      originY: 'center',
      fontFamily,
      fontSize,
      fontWeight,
      fill: color,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      editable: true,
      width: Math.min(width * 0.8, 300),
      elementId,
      elementType: 'text',
    });

    // Configure selection controls
    textObj.setControlsVisibility({
      mt: false,
      mb: false,
      ml: true,  // Allow width adjustment
      mr: true,
      bl: true,
      br: true,
      tl: true,
      tr: true,
      mtr: true,
    });

    // Add to canvas
    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();

    // Calculate element count for naming
    const textCount = Object.values(elements).filter(el => el.type === 'text').length + 1;

    // Create element state
    const element = {
      id: elementId,
      type: 'text',
      name: name || `${DEFAULT_NAMES.text} ${textCount}`,
      locked: false,
      visible: true,
      zIndex: canvas.getObjects().length,
      properties: {
        text,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        left: centerX,
        top: centerY,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        width: textObj.width,
        height: textObj.height,
      },
    };

    // Update state
    setElements(prev => ({ ...prev, [elementId]: element }));
    setSelectedElementId(elementId);

    // Notify state change
    if (onStateChange) {
      onStateChange();
    }

    return elementId;
  }, [elements, width, height, generateElementId, onStateChange]);

  /**
   * Update element properties
   * @param {string} elementId - Element ID to update
   * @param {Object} updates - Properties to update
   */
  const updateElementProperties = useCallback(async (elementId, updates) => {
    const canvas = canvasRef.current;

    // Get current element
    const currentElement = elements[elementId];
    if (!currentElement) return;

    // Check if we're setting an imageUrl on an image element that doesn't have a canvas object
    if (
      currentElement.type === 'image' &&
      updates.imageUrl &&
      canvas
    ) {
      const existingObj = canvas.getObjects().find(o => o.elementId === elementId);

      if (!existingObj) {
        // No canvas object exists - create one from the new imageUrl
        try {
          // Fabric.js 6.x uses Promise-based API
          const img = await fabric.Image.fromURL(updates.imageUrl, {
            crossOrigin: 'anonymous',
          });

          // Scale image to fit within canvas bounds
          const maxWidth = width * 0.6;
          const maxHeight = height * 0.6;
          let scale = 1;

          if (img.width > maxWidth || img.height > maxHeight) {
            scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          }

          // Use existing position or center
          const props = currentElement.properties || {};
          const centerX = props.left || width / 2;
          const centerY = props.top || height / 2;

          // Configure image object
          img.set({
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            scaleX: scale,
            scaleY: scale,
            selectable: !currentElement.locked,
            evented: !currentElement.locked,
            hasControls: true,
            hasBorders: true,
            elementId,
            elementType: 'image',
          });

          // Configure selection controls
          img.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            bl: true,
            br: true,
            tl: true,
            tr: true,
            mtr: true,
          });

          // Add to canvas
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();

          // Update state with new properties including dimensions
          setElements(prev => ({
            ...prev,
            [elementId]: {
              ...prev[elementId],
              zIndex: canvas.getObjects().length,
              properties: {
                ...prev[elementId].properties,
                ...updates,
                left: centerX,
                top: centerY,
                scaleX: scale,
                scaleY: scale,
                width: img.width * scale,
                height: img.height * scale,
              },
            },
          }));

          if (onStateChange) {
            onStateChange();
          }
          return;
        } catch (error) {
          console.error('Failed to create image from URL:', error);
        }
      } else {
        // Canvas object exists - update its image source
        try {
          // Fabric.js 6.x uses Promise-based API
          const newImg = await fabric.Image.fromURL(updates.imageUrl, {
            crossOrigin: 'anonymous',
          });

          // Update the existing object's image
          existingObj.setElement(newImg.getElement());
          canvas.renderAll();
        } catch (error) {
          console.error('Failed to update image:', error);
        }
      }
    }

    // Default: just update the state
    setElements(prev => {
      if (!prev[elementId]) return prev;

      const updated = {
        ...prev,
        [elementId]: {
          ...prev[elementId],
          properties: {
            ...prev[elementId].properties,
            ...updates,
          },
        },
      };

      // Notify state change
      if (onStateChange) {
        onStateChange();
      }

      return updated;
    });
  }, [elements, width, height, onStateChange]);

  // Keep the ref updated with the latest function
  useEffect(() => {
    updateElementPropertiesRef.current = updateElementProperties;
  }, [updateElementProperties]);

  /**
   * Update element metadata (name, locked, visible)
   * @param {string} elementId - Element ID to update
   * @param {Object} updates - Metadata to update
   */
  const updateElement = useCallback((elementId, updates) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setElements(prev => {
      if (!prev[elementId]) return prev;

      const element = prev[elementId];
      const updated = { ...element, ...updates };

      // Update canvas object properties
      const obj = canvas.getObjects().find(o => o.elementId === elementId);
      if (obj) {
        if ('locked' in updates) {
          obj.set({
            selectable: !updates.locked,
            evented: !updates.locked,
          });
        }
        if ('visible' in updates) {
          obj.set({ visible: updates.visible });
        }
        canvas.renderAll();
      }

      // Notify state change
      if (onStateChange) {
        onStateChange();
      }

      return { ...prev, [elementId]: updated };
    });
  }, [onStateChange]);

  /**
   * Delete an element from the canvas
   * @param {string} elementId - Element ID to delete
   */
  const deleteElement = useCallback((elementId) => {
    const canvas = canvasRef.current;
    if (!canvas || !elementId) return;

    // Find and remove the object from canvas
    const obj = canvas.getObjects().find(o => o.elementId === elementId);
    if (obj) {
      canvas.remove(obj);
      canvas.renderAll();
    }

    // Remove from state
    setElements(prev => {
      const { [elementId]: removed, ...rest } = prev;
      return rest;
    });

    // Clear selection if deleted element was selected
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }

    // Notify state change
    if (onStateChange) {
      onStateChange();
    }
  }, [selectedElementId, onStateChange]);

  /**
   * Rename an element
   * @param {string} elementId - Element ID
   * @param {string} newName - New name
   */
  const renameElement = useCallback((elementId, newName) => {
    updateElement(elementId, { name: newName });
  }, [updateElement]);

  /**
   * Toggle element lock state
   * @param {string} elementId - Element ID
   */
  const toggleElementLock = useCallback((elementId) => {
    setElements(prev => {
      if (!prev[elementId]) return prev;
      return {
        ...prev,
        [elementId]: {
          ...prev[elementId],
          locked: !prev[elementId].locked,
        },
      };
    });
  }, []);

  // ===========================================================================
  // ELEMENT SELECTION
  // ===========================================================================

  /**
   * Select an element on canvas
   * @param {string} elementId - Element ID to select
   */
  const selectElement = useCallback((elementId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!elementId) {
      canvas.discardActiveObject();
      setSelectedElementId(null);
    } else {
      const obj = canvas.getObjects().find(o => o.elementId === elementId);
      if (obj) {
        canvas.setActiveObject(obj);
        setSelectedElementId(elementId);
      }
    }
    canvas.renderAll();
  }, []);

  /**
   * Deselect all elements
   */
  const deselectAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();
    setSelectedElementId(null);
  }, []);

  // ===========================================================================
  // LAYER MANAGEMENT
  // ===========================================================================

  /**
   * Get elements sorted by z-index (for layers panel)
   * @returns {Array} Elements sorted by z-index (highest first)
   */
  const getSortedElements = useCallback(() => {
    return Object.values(elements).sort((a, b) => b.zIndex - a.zIndex);
  }, [elements]);

  /**
   * Move element to a different layer position
   * @param {string} elementId - Element ID
   * @param {number} newIndex - New z-index
   */
  const moveElementToIndex = useCallback((elementId, newIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.elementId === elementId);
    if (!obj) return;

    // Move object on canvas
    canvas.moveTo(obj, newIndex);
    canvas.renderAll();

    // Update z-index in state
    setElements(prev => {
      const updatedElements = { ...prev };
      const objects = canvas.getObjects();

      objects.forEach((o, index) => {
        if (o.elementId && updatedElements[o.elementId]) {
          updatedElements[o.elementId] = {
            ...updatedElements[o.elementId],
            zIndex: index,
          };
        }
      });

      return updatedElements;
    });

    // Notify state change
    if (onStateChange) {
      onStateChange();
    }
  }, [onStateChange]);

  /**
   * Reorder all elements by an ordered array of IDs
   * Used by LayersPanel after drag-and-drop to apply new order
   * @param {string[]} orderedIds - Element IDs ordered from front (index 0) to back
   */
  const reorderElements = useCallback((orderedIds) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Apply order to canvas: iterate in reverse so index 0 = front
    // Fabric.js moveTo(obj, index) where higher index = front
    const reversedIds = [...orderedIds].reverse();
    reversedIds.forEach((id, canvasIndex) => {
      const obj = canvas.getObjects().find(o => o.elementId === id);
      if (obj) {
        canvas.moveTo(obj, canvasIndex);
      }
    });
    canvas.renderAll();

    // Sync zIndex in state to match canvas object order
    setElements(prev => {
      const updated = { ...prev };
      const objects = canvas.getObjects();

      objects.forEach((o, index) => {
        if (o.elementId && updated[o.elementId]) {
          updated[o.elementId] = {
            ...updated[o.elementId],
            zIndex: index,
          };
        }
      });

      return updated;
    });

    // Notify state change
    if (onStateChange) {
      onStateChange();
    }
  }, [onStateChange]);

  /**
   * Bring element to front
   * @param {string} elementId - Element ID
   */
  const bringToFront = useCallback((elementId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.elementId === elementId);
    if (obj) {
      canvas.bringToFront(obj);
      canvas.renderAll();

      // Update z-indices
      moveElementToIndex(elementId, canvas.getObjects().length - 1);
    }
  }, [moveElementToIndex]);

  /**
   * Send element to back
   * @param {string} elementId - Element ID
   */
  const sendToBack = useCallback((elementId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.elementId === elementId);
    if (obj) {
      canvas.sendToBack(obj);
      canvas.renderAll();

      // Update z-indices
      moveElementToIndex(elementId, 0);
    }
  }, [moveElementToIndex]);

  // ===========================================================================
  // BORDER RADIUS MANAGEMENT
  // ===========================================================================

  /**
   * Update the canvas border radius dynamically
   * Creates or removes the clip path on the Fabric.js canvas
   * @param {number} newRadius - New corner radius value
   */
  const updateBorderRadius = useCallback((newRadius) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (newRadius > 0) {
      // Apply rounded clip path
      const clipPath = new fabric.Rect({
        width,
        height,
        rx: newRadius,
        ry: newRadius,
        absolutePositioned: true,
      });
      canvas.clipPath = clipPath;
    } else {
      // Remove clip path for sharp corners
      canvas.clipPath = null;
    }

    canvas.renderAll();

    // Notify state change for auto-save
    if (onStateChange) {
      onStateChange();
    }
  }, [width, height, onStateChange]);

  // ===========================================================================
  // BACKGROUND MANAGEMENT
  // ===========================================================================

  /**
   * Set background image
   * @param {string} imageUrl - URL of background image
   */
  const setBackgroundImage = useCallback(async (imageUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!imageUrl) {
      // Remove background image, set to white (Fabric.js 6.x API)
      canvas.backgroundImage = null;
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      setBackground(prev => ({ ...prev, imageUrl: '', color: '#ffffff' }));

      // Notify state change
      if (onStateChange) {
        onStateChange();
      }
      return;
    }

    try {
      // Fabric.js 6.x uses Promise-based API
      const img = await fabric.Image.fromURL(imageUrl, {
        crossOrigin: 'anonymous',
      });

      // Scale to fit canvas
      const scaleX = width / img.width;
      const scaleY = height / img.height;

      img.set({
        scaleX,
        scaleY,
        originX: 'left',
        originY: 'top',
      });

      // Set as background image
      canvas.backgroundImage = img;
      canvas.renderAll();

      setBackground(prev => ({ ...prev, imageUrl }));

      // Notify state change
      if (onStateChange) {
        onStateChange();
      }
    } catch (error) {
      console.error('Failed to set background image:', error);
    }
  }, [width, height, onStateChange]);

  /**
   * Set background color
   * @param {string} color - Background color
   */
  const setBackgroundColor = useCallback((color) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fabric.js 6.x API - directly set properties
    canvas.backgroundImage = null;
    canvas.backgroundColor = color;
    canvas.renderAll();

    setBackground(prev => ({ ...prev, imageUrl: '', color }));

    // Notify state change
    if (onStateChange) {
      onStateChange();
    }
  }, [onStateChange]);

  // ===========================================================================
  // SERIALIZATION
  // ===========================================================================

  /**
   * Serialize canvas state to JSON
   * @returns {Object} Serialized canvas state
   */
  const serializeState = useCallback(() => {
    return {
      elements: elements,
      background: background,
      idCounter: idCounterRef.current,
    };
  }, [elements, background]);

  /**
   * Load canvas state from JSON
   * @param {Object} state - Serialized canvas state
   */
  const loadState = useCallback(async (state) => {
    const canvas = canvasRef.current;
    if (!canvas || !state) return;

    // Clear existing elements
    canvas.clear();
    canvas.backgroundColor = '#ffffff';

    // Restore ID counter
    if (state.idCounter) {
      idCounterRef.current = state.idCounter;
    }

    // Restore background
    if (state.background) {
      setBackground(state.background);
      if (state.background.imageUrl) {
        await setBackgroundImage(state.background.imageUrl);
      } else if (state.background.color) {
        canvas.backgroundColor = state.background.color;
      }
    }

    // Restore elements
    if (state.elements) {
      setElements(state.elements);

      // Recreate fabric objects for each element
      for (const element of Object.values(state.elements)) {
        if (element.type === 'image' && element.properties?.imageUrl) {
          await addImageFromState(element);
        } else if (element.type === 'text') {
          addTextFromState(element);
        }
      }
    }

    canvas.renderAll();
  }, [setBackgroundImage]);

  /**
   * Add image element from saved state
   * @param {Object} element - Element state
   */
  const addImageFromState = useCallback(async (element) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { properties } = element;

    try {
      // Fabric.js 6.x uses Promise-based API
      const img = await fabric.Image.fromURL(properties.imageUrl, {
        crossOrigin: 'anonymous',
      });

      img.set({
        left: properties.left,
        top: properties.top,
        originX: 'center',
        originY: 'center',
        scaleX: properties.scaleX,
        scaleY: properties.scaleY,
        angle: properties.angle || 0,
        selectable: !element.locked,
        evented: !element.locked,
        visible: element.visible,
        elementId: element.id,
        elementType: 'image',
      });

      img.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mtr: true,
      });

      canvas.add(img);
    } catch (error) {
      console.error('Failed to restore image element:', error);
    }
  }, []);

  /**
   * Add text element from saved state
   * @param {Object} element - Element state
   */
  const addTextFromState = useCallback((element) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { properties } = element;

    const textObj = new fabric.Textbox(properties.text || 'Text', {
      left: properties.left,
      top: properties.top,
      originX: 'center',
      originY: 'center',
      fontFamily: properties.fontFamily || 'Inter',
      fontSize: properties.fontSize || 24,
      fontWeight: properties.fontWeight || 400,
      fill: properties.color || '#000000',
      scaleX: properties.scaleX || 1,
      scaleY: properties.scaleY || 1,
      angle: properties.angle || 0,
      width: properties.width,
      selectable: !element.locked,
      evented: !element.locked,
      visible: element.visible,
      editable: true,
      elementId: element.id,
      elementType: 'text',
    });

    textObj.setControlsVisibility({
      mt: false,
      mb: false,
      ml: true,
      mr: true,
      bl: true,
      br: true,
      tl: true,
      tr: true,
      mtr: true,
    });

    canvas.add(textObj);
  }, []);

  // ===========================================================================
  // CANVAS UTILITIES
  // ===========================================================================

  /**
   * Get the Fabric.js canvas instance
   * @returns {fabric.Canvas|null} Canvas instance
   */
  const getCanvas = useCallback(() => canvasRef.current, []);

  /**
   * Clear all elements from canvas
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Remove all objects except background
    canvas.getObjects().forEach(obj => {
      canvas.remove(obj);
    });

    setElements({});
    setSelectedElementId(null);

    canvas.renderAll();

    // Notify state change
    if (onStateChange) {
      onStateChange();
    }
  }, [onStateChange]);

  /**
   * Get element count
   * @returns {number} Number of elements
   */
  const getElementCount = useCallback(() => {
    return Object.keys(elements).length;
  }, [elements]);

  /**
   * Check if element limit is reached
   * @returns {boolean} True if limit reached
   */
  const isLimitReached = useCallback(() => {
    return Object.keys(elements).length >= MAX_ELEMENTS;
  }, [elements]);

  // ===========================================================================
  // UPDATE TEXT CONTENT (for real-time updates)
  // ===========================================================================

  /**
   * Update text content on canvas
   * @param {string} elementId - Element ID
   * @param {string} newText - New text content
   */
  const updateTextContent = useCallback((elementId, newText) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.elementId === elementId);
    if (obj && obj.elementType === 'text') {
      obj.set('text', newText);
      canvas.renderAll();
    }

    updateElementProperties(elementId, { text: newText });
  }, [updateElementProperties]);

  /**
   * Update text style on canvas
   * @param {string} elementId - Element ID
   * @param {Object} styles - Style updates (fontFamily, fontSize, fontWeight, color)
   */
  const updateTextStyle = useCallback((elementId, styles) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.elementId === elementId);
    if (obj && obj.elementType === 'text') {
      if (styles.fontFamily) obj.set('fontFamily', styles.fontFamily);
      if (styles.fontSize) obj.set('fontSize', styles.fontSize);
      if (styles.fontWeight) obj.set('fontWeight', styles.fontWeight);
      if (styles.color) obj.set('fill', styles.color);
      canvas.renderAll();
    }

    updateElementProperties(elementId, styles);
  }, [updateElementProperties]);

  // ===========================================================================
  // RETURN VALUE
  // ===========================================================================

  return {
    // Canvas
    canvasRef,
    getCanvas,
    initializeCanvas,
    isInitialized,

    // Elements
    elements,
    selectedElementId,
    setSelectedElementId,

    // Element operations
    addImage,
    addText,
    updateElement,
    updateElementProperties,
    deleteElement,
    renameElement,
    toggleElementLock,
    selectElement,
    deselectAll,

    // Text operations
    updateTextContent,
    updateTextStyle,

    // Layer management
    getSortedElements,
    moveElementToIndex,
    reorderElements,
    bringToFront,
    sendToBack,

    // Border radius
    updateBorderRadius,

    // Background
    background,
    setBackgroundImage,
    setBackgroundColor,

    // Serialization
    serializeState,
    loadState,

    // Utilities
    clearCanvas,
    getElementCount,
    isLimitReached,
    MAX_ELEMENTS,
  };
};

export default useCustomCanvas;
