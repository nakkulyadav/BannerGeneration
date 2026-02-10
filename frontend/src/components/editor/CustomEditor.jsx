/**
 * Custom Editor Component
 *
 * Free-form editor for custom dimension projects.
 * Allows users to add images and text elements, position them freely,
 * and manage layers. Uses Fabric.js for canvas manipulation.
 *
 * Features:
 * - Background image/color management
 * - Add unlimited images (up to 50)
 * - Add unlimited text elements (up to 50)
 * - Drag, resize, rotate elements
 * - Layer management (reorder, lock, delete)
 * - AI image search integration
 * - Background removal support
 * - Image enhancement support
 *
 * @module components/editor/CustomEditor
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import useCustomCanvas from '../../hooks/useCustomCanvas';
import BackgroundPanel from './custom/BackgroundPanel';
import ImageElementPanel from './custom/ImageElementPanel';
import TextElementPanel from './custom/TextElementPanel';
import LayersPanel from './custom/LayersPanel';

// =============================================================================
// CANVAS SETTINGS PANEL (Corner Radius)
// =============================================================================

/**
 * CanvasSettingsPanel Component
 *
 * Collapsible panel for adjusting canvas-level properties like corner radius.
 * Placed above the BackgroundPanel in the editor sidebar.
 *
 * @param {Object} props
 * @param {number} props.cornerRadius - Current corner radius value
 * @param {number} props.maxRadius - Maximum allowed radius (half of shorter side)
 * @param {Function} props.onChange - Callback when radius changes
 */
const CanvasSettingsPanel = ({ cornerRadius, maxRadius, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium text-sm">Canvas Settings</h3>
            <p className="text-gray-500 text-xs">
              {cornerRadius > 0 ? `${cornerRadius}px radius` : 'Sharp corners'}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Corner Radius Label + Value */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400">Corner Radius</label>
            <span className="text-xs text-gray-300 font-mono bg-gray-800 px-2 py-0.5 rounded">
              {cornerRadius}px
            </span>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min={0}
            max={maxRadius}
            value={cornerRadius}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
          />

          {/* Min/Max Labels */}
          <div className="flex justify-between text-xs text-gray-600">
            <span>0</span>
            <span>{maxRadius}px</span>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// CUSTOM EDITOR COMPONENT
// =============================================================================

/**
 * CustomEditor Component
 *
 * Main component for the free-form custom editor.
 * Manages the canvas and element panels.
 * Exposes canvas functionality via onCanvasReady callback for the preview.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onCanvasReady - Callback when canvas is initialized, receives { getCanvas, initializeCanvas, ... }
 */
const CustomEditor = ({ onCanvasReady }) => {
  const {
    project,
    updateProject,
    bannerState,
    setBannerState,
    openSearchPanel,
    markSaving,
    setCustomImageSelectHandler,
  } = useEditor();

  // ===========================================================================
  // CUSTOM CANVAS HOOK
  // ===========================================================================

  const customCanvas = useCustomCanvas({
    width: project.width,
    height: project.height,
    borderRadius: project.borderRadius,
    initialState: bannerState?.customCanvasState || null,
    onStateChange: () => {
      // Trigger auto-save when canvas state changes
      if (markSaving) markSaving();
    },
  });

  // Destructure for easier access
  const {
    getCanvas,
    initializeCanvas,
    isInitialized,
    elements,
    selectedElementId,
    addImage,
    addText,
    updateElement,
    updateElementProperties,
    deleteElement,
    renameElement,
    toggleElementLock,
    selectElement,
    updateTextContent,
    updateTextStyle,
    getSortedElements,
    reorderElements,
    background,
    setBackgroundImage,
    setBackgroundColor,
    updateBorderRadius,
    serializeState,
    getElementCount,
    isLimitReached,
    MAX_ELEMENTS,
  } = customCanvas;

  // ===========================================================================
  // EXPOSE CANVAS TO PARENT (for CustomCanvasPreview)
  // ===========================================================================

  useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady({
        getCanvas,
        initializeCanvas,
        isInitialized,
        width: project.width,
        height: project.height,
        borderRadius: project.borderRadius,
      });
    }
  }, [onCanvasReady, getCanvas, initializeCanvas, isInitialized, project.width, project.height, project.borderRadius]);

  // ===========================================================================
  // SYNC STATE FOR AUTO-SAVE
  // ===========================================================================

  useEffect(() => {
    // When canvas state changes, sync it to the editor context for auto-save
    if (isInitialized) {
      const canvasState = serializeState();
      setBannerState({
        ...bannerState,
        customCanvasState: canvasState,
      });
    }
  }, [elements, background, isInitialized]);

  // ===========================================================================
  // ACTIVE FIELD FOR AI SEARCH
  // ===========================================================================

  const [activeSearchTarget, setActiveSearchTarget] = useState(null);

  /**
   * Handle opening AI search for a specific target
   * @param {string} target - 'background' | element ID
   */
  const handleOpenSearch = useCallback((target) => {
    setActiveSearchTarget(target);
    // Pass the actual target (element ID or 'background') to the search panel
    openSearchPanel(target);
  }, [openSearchPanel]);

  /**
   * Handle image selection from AI search
   * Called by the context when an image is selected from the search panel
   * @param {string} imageUrl - Selected image URL
   * @param {string} activeField - The active field/target from search panel
   */
  const handleImageSelect = useCallback(async (imageUrl, activeField) => {
    // Use activeField from context if activeSearchTarget is not set
    const target = activeSearchTarget || activeField;

    if (target === 'background') {
      await setBackgroundImage(imageUrl);
    } else if (target) {
      // Update existing element with new image
      await updateElementProperties(target, { imageUrl });
    }
    setActiveSearchTarget(null);
  }, [activeSearchTarget, setBackgroundImage, updateElementProperties]);

  /**
   * Register custom image select handler with context
   * This allows the CustomEditor to handle AI search selections
   */
  useEffect(() => {
    setCustomImageSelectHandler(() => handleImageSelect);

    // Cleanup: unregister handler when component unmounts
    return () => {
      setCustomImageSelectHandler(null);
    };
  }, [handleImageSelect, setCustomImageSelectHandler]);

  // ===========================================================================
  // ELEMENT COUNT
  // ===========================================================================

  const elementCount = getElementCount();
  const sortedElements = getSortedElements();

  // Corner radius — max is half of the shorter side
  const maxRadius = Math.floor(Math.min(project.width, project.height) / 2);
  const [cornerRadius, setCornerRadius] = useState(project.borderRadius || 0);

  /**
   * Handle corner radius change
   * Updates the canvas clip path and project metadata simultaneously
   */
  const handleCornerRadiusChange = useCallback((value) => {
    const clamped = Math.max(0, Math.min(value, maxRadius));
    setCornerRadius(clamped);
    updateBorderRadius(clamped);
    updateProject({ borderRadius: clamped });
  }, [maxRadius, updateBorderRadius, updateProject]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="flex flex-col space-y-4">
      {/* Element Count Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-medium">Custom Editor</h2>
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {elementCount}/{MAX_ELEMENTS} elements
        </span>
      </div>

      {/* Canvas Settings — corner radius control */}
      <CanvasSettingsPanel
        cornerRadius={cornerRadius}
        maxRadius={maxRadius}
        onChange={handleCornerRadiusChange}
      />

      {/* Background Panel */}
      <BackgroundPanel
        background={background}
        onSetImage={setBackgroundImage}
        onSetColor={setBackgroundColor}
        onOpenSearch={() => handleOpenSearch('background')}
        width={project.width}
        height={project.height}
      />

      {/* Add Element Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => addImage({ imageUrl: '' })}
          disabled={isLimitReached()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add Image
        </button>
        <button
          onClick={() => addText()}
          disabled={isLimitReached()}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Add Text
        </button>
      </div>

      {/* Element Limit Warning */}
      {isLimitReached() && (
        <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-800 rounded-lg px-3 py-2">
          Maximum element limit ({MAX_ELEMENTS}) reached. Delete elements to add more.
        </div>
      )}

      {/* Elements List */}
      <div className="space-y-2">
        {sortedElements.map((element) => (
          <div key={element.id}>
            {element.type === 'image' ? (
              <ImageElementPanel
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => selectElement(element.id)}
                onUpdate={(updates) => updateElement(element.id, updates)}
                onUpdateProperties={(updates) => updateElementProperties(element.id, updates)}
                onDelete={() => deleteElement(element.id)}
                onRename={(name) => renameElement(element.id, name)}
                onToggleLock={() => toggleElementLock(element.id)}
                onOpenSearch={() => handleOpenSearch(element.id)}
                canvasWidth={project.width}
                canvasHeight={project.height}
              />
            ) : (
              <TextElementPanel
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => selectElement(element.id)}
                onUpdate={(updates) => updateElement(element.id, updates)}
                onUpdateProperties={(updates) => updateElementProperties(element.id, updates)}
                onUpdateText={(text) => updateTextContent(element.id, text)}
                onUpdateStyle={(styles) => updateTextStyle(element.id, styles)}
                onDelete={() => deleteElement(element.id)}
                onRename={(name) => renameElement(element.id, name)}
                onToggleLock={() => toggleElementLock(element.id)}
              />
            )}
          </div>
        ))}

        {/* Empty State */}
        {sortedElements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No elements yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Add images or text to start designing
            </p>
          </div>
        )}
      </div>

      {/* Layers Panel */}
      <LayersPanel
        elements={sortedElements}
        selectedElementId={selectedElementId}
        onSelectElement={selectElement}
        onDeleteElement={deleteElement}
        onToggleLock={toggleElementLock}
        onReorder={reorderElements}
        background={background}
      />
    </div>
  );
};

// =============================================================================
// CUSTOM CANVAS PREVIEW
// =============================================================================

/**
 * CustomCanvasPreview Component
 *
 * Renders the canvas preview in the right panel.
 * This component creates the canvas DOM element and initializes Fabric.js.
 *
 * @param {Object} props - Component props
 * @param {Function} props.initializeCanvas - Function to initialize Fabric.js on canvas element
 * @param {Function} props.getCanvas - Function to get the Fabric.js canvas instance
 * @param {boolean} props.isInitialized - Whether canvas is initialized
 * @param {number} props.width - Canvas width in pixels
 * @param {number} props.height - Canvas height in pixels
 * @param {number} props.borderRadius - Canvas corner radius in pixels
 */
export const CustomCanvasPreview = ({
  initializeCanvas,
  getCanvas,
  isInitialized,
  width = 722,
  height = 312,
  borderRadius = 0,
}) => {
  const containerRef = useRef(null);
  const canvasElementRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Initialize Fabric.js canvas when element is mounted
  useEffect(() => {
    if (canvasElementRef.current && initializeCanvas && !isInitialized) {
      initializeCanvas(canvasElementRef.current);
      setIsCanvasReady(true);
    }
  }, [initializeCanvas, isInitialized]);

  // Update canvas ready state
  useEffect(() => {
    setIsCanvasReady(isInitialized);
  }, [isInitialized]);

  // Calculate scale to fit container
  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 32; // padding
      const containerHeight = container.clientHeight - 32;

      const scaleX = containerWidth / width;
      const scaleY = containerHeight / height;
      const newScale = Math.min(scaleX, scaleY, 1);

      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden"
    >
      <div
        className="relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Checkerboard Background (for transparency) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #333 25%, transparent 25%),
              linear-gradient(-45deg, #333 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #333 75%),
              linear-gradient(-45deg, transparent 75%, #333 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            borderRadius: borderRadius,
          }}
        />

        {/* Canvas Container */}
        <div
          className="relative canvas-wrapper"
          style={{
            width,
            height,
            borderRadius,
            overflow: 'hidden',
          }}
        >
          {/* Fabric.js Canvas Element */}
          <canvas
            ref={canvasElementRef}
            style={{
              display: 'block',
            }}
          />
        </div>

        {/* Loading Indicator */}
        {!isCanvasReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-gray-400 text-xs">Loading canvas...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomEditor;
