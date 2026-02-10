/**
 * Text Element Panel Component
 *
 * Collapsible panel for managing individual text elements on the canvas.
 * Supports text editing, font family/size/weight selection, color picker,
 * and basic element controls (rename, lock, delete).
 *
 * @module components/editor/custom/TextElementPanel
 */

import { useState, useCallback, useEffect } from 'react';
import { ColorPicker, FontSelector, WeightSelector, TextToolsButtons } from '../../shared';
import { AVAILABLE_FONTS, getAvailableWeights, getClosestWeight } from '../../../constants/fontConfig';

// =============================================================================
// TEXT ELEMENT PANEL COMPONENT
// =============================================================================

/**
 * TextElementPanel Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.element - Element state object
 * @param {boolean} props.isSelected - Whether element is currently selected
 * @param {Function} props.onSelect - Callback to select element
 * @param {Function} props.onUpdate - Callback to update element metadata
 * @param {Function} props.onUpdateProperties - Callback to update element properties
 * @param {Function} props.onUpdateText - Callback to update text content
 * @param {Function} props.onUpdateStyle - Callback to update text styles
 * @param {Function} props.onDelete - Callback to delete element
 * @param {Function} props.onRename - Callback to rename element
 * @param {Function} props.onToggleLock - Callback to toggle lock state
 */
const TextElementPanel = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onUpdateProperties,
  onUpdateText,
  onUpdateStyle,
  onDelete,
  onRename,
  onToggleLock,
}) => {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const [isExpanded, setIsExpanded] = useState(isSelected);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(element.name);
  const [autoOpenWeight, setAutoOpenWeight] = useState(false);

  // Local state for debounced text input
  const [localText, setLocalText] = useState(element.properties?.text || '');

  // Update local text when element changes
  useEffect(() => {
    setLocalText(element.properties?.text || '');
  }, [element.properties?.text]);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  /**
   * Handle text content change (debounced)
   */
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    setLocalText(newText);

    // Debounce the actual update
    const timeoutId = setTimeout(() => {
      onUpdateText(newText);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [onUpdateText]);

  /**
   * Handle text blur (immediate update)
   */
  const handleTextBlur = useCallback(() => {
    onUpdateText(localText);
  }, [localText, onUpdateText]);

  /**
   * Handle font family change
   */
  const handleFontChange = useCallback((fontFamily) => {
    // Get closest available weight for new font
    const currentWeight = element.properties?.fontWeight || 400;
    const closestWeight = getClosestWeight(fontFamily, currentWeight);

    onUpdateStyle({
      fontFamily,
      fontWeight: closestWeight,
    });

    // Auto-open weight selector if weight changed
    if (closestWeight !== currentWeight) {
      setAutoOpenWeight(true);
    }
  }, [element.properties?.fontWeight, onUpdateStyle]);

  /**
   * Handle font weight change
   */
  const handleWeightChange = useCallback((fontWeight) => {
    onUpdateStyle({ fontWeight: parseInt(fontWeight, 10) });
    setAutoOpenWeight(false);
  }, [onUpdateStyle]);

  /**
   * Handle font size change
   */
  const handleFontSizeChange = useCallback((e) => {
    const fontSize = parseInt(e.target.value, 10);
    if (fontSize > 0 && fontSize <= 200) {
      onUpdateStyle({ fontSize });
    }
  }, [onUpdateStyle]);

  /**
   * Handle color change
   */
  const handleColorChange = useCallback((color) => {
    onUpdateStyle({ color });
  }, [onUpdateStyle]);

  /**
   * Handle rename submit
   */
  const handleRenameSubmit = useCallback(() => {
    if (newName.trim() && newName !== element.name) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
  }, [newName, element.name, onRename]);

  /**
   * Handle panel click (select element)
   */
  const handlePanelClick = useCallback(() => {
    onSelect();
    setIsExpanded(true);
  }, [onSelect]);

  /**
   * Handle save — flush pending text update and collapse panel
   */
  const handleSave = useCallback((e) => {
    e.stopPropagation();
    onUpdateText(localText);
    setIsExpanded(false);
  }, [localText, onUpdateText]);

  /**
   * Handle header click (toggle expand)
   */
  const handleHeaderClick = useCallback((e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      onSelect();
    }
  }, [isExpanded, onSelect]);

  // ===========================================================================
  // PROPERTIES
  // ===========================================================================

  const {
    text = '',
    fontFamily = 'Inter',
    fontSize = 24,
    fontWeight = 400,
    color = '#000000',
  } = element.properties || {};

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div
      onClick={handlePanelClick}
      className={`bg-[#1e1e1e] rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500/20'
          : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Header */}
      <div
        onClick={handleHeaderClick}
        className="flex items-center justify-between px-3 py-2.5"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Text Icon */}
          <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>

          {/* Name */}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit();
                if (e.key === 'Escape') {
                  setNewName(element.name);
                  setIsRenaming(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 bg-gray-800 text-white text-sm px-2 py-0.5 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <span
              className="text-white text-sm truncate cursor-text"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              title="Double-click to rename"
            >
              {element.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {/* Lock Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className={`p-1 rounded transition-colors ${
              element.locked
                ? 'text-yellow-400 hover:bg-yellow-400/10'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
            }`}
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${element.name}"?`)) {
                onDelete();
              }
            }}
            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Expand/Collapse */}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-gray-800">
          {/* Text Content */}
          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <label className="block text-xs text-gray-400">Text Content</label>
              {/* Translate & Spell-check */}
              <TextToolsButtons
                text={localText}
                onApply={(t) => { setLocalText(t); onUpdateText(t); }}
              />
            </div>
            <textarea
              value={localText}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onClick={(e) => e.stopPropagation()}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-blue-500 focus:outline-none"
              placeholder="Enter text..."
            />
          </div>

          {/* Font Family & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Font</label>
              <FontSelector
                value={fontFamily}
                onChange={handleFontChange}
                compact
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Weight</label>
              <WeightSelector
                fontFamily={fontFamily}
                value={fontWeight}
                onChange={handleWeightChange}
                autoOpen={autoOpenWeight}
                compact
              />
            </div>
          </div>

          {/* Font Size & Color */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Size (px)</label>
              <input
                type="number"
                value={fontSize}
                onChange={handleFontSizeChange}
                onClick={(e) => e.stopPropagation()}
                min="8"
                max="200"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Color</label>
              <div onClick={(e) => e.stopPropagation()}>
                <ColorPicker
                  color={color}
                  onChange={handleColorChange}
                  compact
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <label className="block text-xs text-gray-500 mb-2">Preview</label>
            <p
              className="truncate"
              style={{
                fontFamily,
                fontSize: Math.min(fontSize, 24),
                fontWeight,
                color,
              }}
            >
              {localText || 'Enter text...'}
            </p>
          </div>

          {/* Save — flush text update and collapse panel */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default TextElementPanel;
