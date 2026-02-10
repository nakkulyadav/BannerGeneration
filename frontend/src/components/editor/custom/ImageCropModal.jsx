/**
 * Image Crop Modal Component
 *
 * Displays when an uploaded image exceeds the canvas dimensions.
 * Lets the user drag a selection rectangle (matching the canvas aspect ratio)
 * over the full image, then crops and returns the selected region as a data URL.
 *
 * Visual treatment:
 * - Inside the selection: original colors at full brightness
 * - Outside the selection: subtly dimmed (keeps colors, reduced brightness)
 *
 * @module components/editor/custom/ImageCropModal
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum display width for the image inside the modal */
const MAX_DISPLAY_WIDTH = 600;

/** Maximum display height for the image inside the modal */
const MAX_DISPLAY_HEIGHT = 400;

// =============================================================================
// IMAGE CROP MODAL COMPONENT
// =============================================================================

/**
 * ImageCropModal Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {string} props.imageUrl - Full image URL (data URL or remote)
 * @param {number} props.canvasWidth - Target canvas width (aspect ratio source)
 * @param {number} props.canvasHeight - Target canvas height (aspect ratio source)
 * @param {Function} props.onApply - Callback with cropped data URL
 * @param {Function} props.onCancel - Callback to close without changes
 */
const ImageCropModal = ({
  isOpen,
  imageUrl,
  canvasWidth,
  canvasHeight,
  onApply,
  onCancel,
}) => {
  // ===========================================================================
  // REFS
  // ===========================================================================

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // ===========================================================================
  // STATE
  // ===========================================================================

  /** Natural dimensions of the loaded image */
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });

  /** Display dimensions (scaled to fit the modal) */
  const [display, setDisplay] = useState({ w: 0, h: 0 });

  /** Selection rectangle position (in display coordinates) */
  const [selection, setSelection] = useState({ x: 0, y: 0 });

  /** Selection rectangle size (in display coordinates) */
  const [selectionSize, setSelectionSize] = useState({ w: 0, h: 0 });

  /** Whether the user is currently dragging the selection */
  const [isDragging, setIsDragging] = useState(false);

  /** Offset from the mouse to the selection's top-left corner during drag */
  const dragOffset = useRef({ x: 0, y: 0 });

  // ===========================================================================
  // IMAGE LOAD — compute display size and initial selection
  // ===========================================================================

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    const natW = img.naturalWidth;
    const natH = img.naturalHeight;
    setImgNatural({ w: natW, h: natH });

    // Scale image to fit the modal display area
    const scaleX = MAX_DISPLAY_WIDTH / natW;
    const scaleY = MAX_DISPLAY_HEIGHT / natH;
    const scale = Math.min(scaleX, scaleY, 1);

    const dispW = Math.round(natW * scale);
    const dispH = Math.round(natH * scale);
    setDisplay({ w: dispW, h: dispH });

    // Compute selection rectangle that matches the canvas aspect ratio
    const aspect = canvasWidth / canvasHeight;
    let selW, selH;

    if (dispW / dispH > aspect) {
      // Image is wider — fit by height
      selH = dispH;
      selW = Math.round(dispH * aspect);
    } else {
      // Image is taller — fit by width
      selW = dispW;
      selH = Math.round(dispW / aspect);
    }

    setSelectionSize({ w: selW, h: selH });

    // Center the selection
    setSelection({
      x: Math.round((dispW - selW) / 2),
      y: Math.round((dispH - selH) / 2),
    });
  }, [canvasWidth, canvasHeight]);

  // ===========================================================================
  // DRAG HANDLERS
  // ===========================================================================

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if click is inside the selection rectangle
    if (
      mouseX >= selection.x &&
      mouseX <= selection.x + selectionSize.w &&
      mouseY >= selection.y &&
      mouseY <= selection.y + selectionSize.h
    ) {
      setIsDragging(true);
      dragOffset.current = {
        x: mouseX - selection.x,
        y: mouseY - selection.y,
      };
    }
  }, [selection, selectionSize]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Clamp so the selection stays within the image bounds
    const newX = Math.max(0, Math.min(mouseX - dragOffset.current.x, display.w - selectionSize.w));
    const newY = Math.max(0, Math.min(mouseY - dragOffset.current.y, display.h - selectionSize.h));

    setSelection({ x: newX, y: newY });
  }, [isDragging, display, selectionSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach window-level listeners for drag (so dragging outside the modal still works)
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // ===========================================================================
  // APPLY — crop the selected region to a data URL
  // ===========================================================================

  const handleApply = useCallback(() => {
    const img = imageRef.current;
    if (!img || !imgNatural.w) return;

    // Convert display coordinates → natural image coordinates
    const scale = imgNatural.w / display.w;
    const sx = Math.round(selection.x * scale);
    const sy = Math.round(selection.y * scale);
    const sw = Math.round(selectionSize.w * scale);
    const sh = Math.round(selectionSize.h * scale);

    // Draw the cropped region onto an offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const croppedUrl = canvas.toDataURL('image/png');
    onApply(croppedUrl);
  }, [imgNatural, display, selection, selectionSize, onApply]);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-[700px]">
        <h2 className="text-xl font-semibold text-white mb-2">Crop Image</h2>
        <p className="text-gray-400 text-sm mb-4">
          Drag the selection to choose the area that fits your canvas ({canvasWidth} x {canvasHeight}px)
        </p>

        {/* Image + Overlay Container */}
        <div
          ref={containerRef}
          className="relative mx-auto select-none"
          style={{ width: display.w || 'auto', height: display.h || 'auto' }}
          onMouseDown={handleMouseDown}
        >
          {/* Base image — subtly dimmed outside the selection (keeps colors visible) */}
          <img
            ref={imageRef}
            src={imageUrl}
            onLoad={handleImageLoad}
            alt="Crop source"
            className="block"
            style={{
              width: display.w || 'auto',
              height: display.h || 'auto',
              filter: 'brightness(0.5)',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />

          {/* Selection — clip the original-color image to this rect */}
          {display.w > 0 && (
            <div
              className="absolute top-0 left-0 overflow-hidden border-2 border-white/80"
              style={{
                transform: `translate(${selection.x}px, ${selection.y}px)`,
                width: selectionSize.w,
                height: selectionSize.h,
                cursor: isDragging ? 'grabbing' : 'grab',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0)',
              }}
            >
              {/* Original image positioned so the visible portion aligns */}
              <img
                src={imageUrl}
                alt=""
                style={{
                  position: 'absolute',
                  left: -selection.x,
                  top: -selection.y,
                  width: display.w,
                  height: display.h,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-lg transition-all"
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
