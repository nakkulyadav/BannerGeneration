/**
 * Image Upload Component
 *
 * Drag-and-drop file upload with preview thumbnail.
 * Uses react-dropzone for file handling.
 * Includes loading state during image processing.
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * @param {Object} props
 * @param {string} props.imageUrl - Current image URL for preview
 * @param {function} props.onUpload - Callback when file is uploaded (receives File)
 * @param {function} props.onClear - Callback to clear the image
 * @param {string} props.label - Label for the upload area
 * @param {boolean} props.required - Whether this field is required
 * @param {string} props.hint - Help text shown below label
 * @param {string} props.error - Error message to display
 * @param {string} props.accept - Accepted file types
 * @param {boolean} props.isLoading - External loading state (optional)
 */
function ImageUpload({
  imageUrl,
  onUpload,
  onClear,
  label,
  required = false,
  hint,
  error,
  accept = 'image/jpeg,image/png,image/webp',
  isLoading: externalLoading = false,
}) {
  // ==========================================================================
  // STATE
  // ==========================================================================

  // Internal loading state for image processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Combined loading state
  const isLoading = externalLoading || isProcessing;

  /**
   * Handle file drop with loading state
   */
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setIsProcessing(true);
        try {
          // Small delay to show loading state (min 200ms for UX)
          await Promise.all([
            onUpload(acceptedFiles[0]),
            new Promise(resolve => setTimeout(resolve, 200))
          ]);
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: false,
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      {/* Label - dark mode */}
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Hint text - dark mode */}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {/* Upload area or preview */}
      {imageUrl ? (
        // Preview with clear button - dark mode styling
        <div className="relative inline-block animate-fade-in">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-32 rounded-lg border border-[#3a3a3a] object-contain transition-opacity duration-200"
          />
          <button
            type="button"
            onClick={onClear}
            disabled={isLoading}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-400 transition-all duration-150 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      ) : (
        // Dropzone area - dark mode styling
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            isLoading
              ? 'border-blue-500/50 bg-blue-900/20 cursor-wait'
              : isDragActive
              ? 'border-blue-400 bg-blue-900/30 scale-[1.02]'
              : error
              ? 'border-red-700/50 bg-red-900/20'
              : 'border-[#3a3a3a] hover:border-[#4a4a4a] bg-[#151515] hover:bg-[#1a1a1a]'
          }`}
        >
          <input {...getInputProps()} disabled={isLoading} />

          {/* Loading spinner or upload icon */}
          {isLoading ? (
            <svg
              className="w-10 h-10 mx-auto mb-2 text-blue-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className={`w-10 h-10 mx-auto mb-2 transition-colors duration-150 ${
                isDragActive ? 'text-blue-400' : 'text-gray-500'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          )}

          {/* Upload text - dark mode */}
          {isLoading ? (
            <p className="text-sm text-blue-400">Processing image...</p>
          ) : isDragActive ? (
            <p className="text-sm text-blue-400">Drop the image here...</p>
          ) : (
            <>
              <p className="text-sm text-gray-400">
                Drag & drop an image, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, or WebP
              </p>
            </>
          )}
        </div>
      )}

      {/* Error message - dark mode styling */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1.5 animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;
