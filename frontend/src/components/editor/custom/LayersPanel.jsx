/**
 * Layers Panel Component
 *
 * Panel displaying all canvas elements as layers with drag-to-reorder,
 * lock, visibility, and delete functionality. Background is always
 * at the bottom and cannot be reordered.
 *
 * @module components/editor/custom/LayersPanel
 */

import { useState, useCallback, useRef } from 'react';

// =============================================================================
// LAYERS PANEL COMPONENT
// =============================================================================

/**
 * LayersPanel Component
 *
 * @param {Object} props - Component props
 * @param {Array} props.elements - Sorted array of elements (highest z-index first)
 * @param {string} props.selectedElementId - Currently selected element ID
 * @param {Function} props.onSelectElement - Callback to select element
 * @param {Function} props.onDeleteElement - Callback to delete element
 * @param {Function} props.onToggleLock - Callback to toggle element lock
 * @param {Function} props.onReorder - Callback with reordered ID array (front-to-back)
 * @param {Object} props.background - Background state object
 */
const LayersPanel = ({
  elements = [],
  selectedElementId,
  onSelectElement,
  onDeleteElement,
  onToggleLock,
  onReorder,
  background,
}) => {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOverElement, setDragOverElement] = useState(null);
  const dragCounterRef = useRef(0);

  // ===========================================================================
  // DRAG HANDLERS
  // ===========================================================================

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback((e, element) => {
    setDraggedElement(element);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', element.id);

    // Add dragging class for visual feedback
    setTimeout(() => {
      e.target.classList.add('opacity-50');
    }, 0);
  }, []);

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback((e) => {
    setDraggedElement(null);
    setDragOverElement(null);
    dragCounterRef.current = 0;
    e.target.classList.remove('opacity-50');
  }, []);

  /**
   * Handle drag enter
   */
  const handleDragEnter = useCallback((e, element) => {
    e.preventDefault();
    dragCounterRef.current++;

    if (draggedElement && element.id !== draggedElement.id) {
      setDragOverElement(element);
    }
  }, [draggedElement]);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e) => {
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDragOverElement(null);
    }
  }, []);

  /**
   * Handle drag over
   */
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handle drop
   * Computes the new element order by splicing the dragged element
   * into the target position, then passes the full ordered ID array
   * to the parent via onReorder.
   */
  const handleDrop = useCallback((e, targetElement) => {
    e.preventDefault();

    if (!draggedElement || targetElement.id === draggedElement.id) {
      setDragOverElement(null);
      return;
    }

    const draggedIndex = elements.findIndex((el) => el.id === draggedElement.id);
    const targetIndex = elements.findIndex((el) => el.id === targetElement.id);

    if (draggedIndex !== -1 && targetIndex !== -1 && onReorder) {
      // Build new order: remove dragged, insert at target position
      const reordered = elements.filter((el) => el.id !== draggedElement.id);
      reordered.splice(targetIndex > draggedIndex ? targetIndex - 1 : targetIndex, 0, draggedElement);

      // Pass ordered IDs (front-to-back, matching the layers panel display)
      onReorder(reordered.map((el) => el.id));
    }

    setDraggedElement(null);
    setDragOverElement(null);
  }, [draggedElement, elements, onReorder]);

  // ===========================================================================
  // RENDER LAYER ITEM
  // ===========================================================================

  /**
   * Render a single layer item
   */
  const renderLayerItem = (element, index) => {
    const isSelected = selectedElementId === element.id;
    const isDragging = draggedElement?.id === element.id;
    const isDragOver = dragOverElement?.id === element.id;

    return (
      <div
        key={element.id}
        draggable={!element.locked}
        onDragStart={(e) => handleDragStart(e, element)}
        onDragEnd={handleDragEnd}
        onDragEnter={(e) => handleDragEnter(e, element)}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, element)}
        onClick={() => onSelectElement(element.id)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all
          ${isSelected ? 'bg-purple-600/20 border border-purple-500/50' : 'hover:bg-gray-800 border border-transparent'}
          ${isDragOver ? 'border-t-2 border-t-purple-500' : ''}
          ${isDragging ? 'opacity-50' : ''}
          ${element.locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
        `}
      >
        {/* Drag Handle */}
        {!element.locked && (
          <div className="text-gray-500 cursor-grab">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}

        {/* Type Icon */}
        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
          element.type === 'image' ? 'bg-purple-500/20' : 'bg-blue-500/20'
        }`}>
          {element.type === 'image' ? (
            <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
        </div>

        {/* Name */}
        <span className="text-sm text-white flex-1 truncate">
          {element.name}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Lock Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(element.id);
            }}
            className={`p-1 rounded transition-colors ${
              element.locked
                ? 'text-yellow-400 hover:bg-yellow-400/10'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
            }`}
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${element.name}"?`)) {
                onDeleteElement(element.id);
              }
            }}
            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-white font-medium text-sm">Layers</h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Drag to reorder • Top = Front
        </p>
      </div>

      {/* Layers List */}
      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
        {elements.length === 0 && !background.imageUrl && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No layers yet
          </div>
        )}

        {/* Element Layers (sorted by z-index, highest first) */}
        {elements.map((element, index) => renderLayerItem(element, index))}

        {/* Background Layer (always at bottom, not draggable) */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
          {/* Placeholder for drag handle alignment */}
          <div className="w-4" />

          {/* Background Icon */}
          <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Name */}
          <span className="text-sm text-gray-400 flex-1 truncate">
            Background
          </span>

          {/* Lock Icon (always locked) */}
          <div className="p-1 text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersPanel;
