/**
 * AI Image Search Panel
 *
 * Shared search panel rendered below the banner preview.
 * Allows users to search Google Images for transparent-background images
 * and select one to apply to the active field (logo or product image).
 *
 * Features:
 * - Search input with Enter key / button trigger
 * - 10×5 scrollable grid of results (50 images)
 * - Visual indicator on selected image
 * - Two action buttons after selection:
 *   1. "Apply to Banner" - apply image directly
 *   2. "Remove Background" - process via remove.bg API, then apply
 * - Loading spinner during search and background removal
 * - Toast notifications for success/error states
 * - Close button to dismiss
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { searchImages, removeBackground } from '../../services/imageSearchService';

/**
 * Field label map for display
 */
const FIELD_LABELS = {
  logo: 'Brand Logo',
  product: 'Product Image',
};

/**
 * @param {Object} props
 * @param {'logo'|'product'} props.activeField - Which field the search is for
 * @param {function} props.onSelect - Callback when an image is selected (receives imageUrl)
 * @param {function} props.onClose - Callback to close the panel
 */
function ImageSearchPanel({ activeField, onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Store the full image object
  const [hasSearched, setHasSearched] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false); // Track background removal loading state

  const inputRef = useRef(null);

  // Focus the search input when the panel opens or field switches
  useEffect(() => {
    inputRef.current?.focus();
    // Reset state when the active field changes
    setQuery('');
    setResults([]);
    setError('');
    setSelectedImage(null);
    setHasSearched(false);
    setIsRemovingBg(false);
  }, [activeField]);

  /**
   * Execute search against backend
   */
  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError('');
    setSelectedImage(null);
    setHasSearched(true);

    try {
      const data = await searchImages(trimmed, activeField);
      setResults(data.images || []);
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, activeField]);

  /**
   * Handle Enter key in search input
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  /**
   * Handle image selection — store selected image (don't apply yet)
   */
  const handleImageClick = useCallback(
    (image) => {
      setSelectedImage(image);
    },
    []
  );

  /**
   * Apply the selected image directly to the banner
   */
  const handleApplyImage = useCallback(() => {
    if (!selectedImage) return;
    onSelect(selectedImage.downloadURL);
    toast.success('Image applied to banner!');
  }, [selectedImage, onSelect]);

  /**
   * Remove background from selected image, then apply to banner
   */
  const handleRemoveBackground = useCallback(async () => {
    if (!selectedImage) return;

    setIsRemovingBg(true);
    try {
      const result = await removeBackground(selectedImage.downloadURL);
      onSelect(result.processedImageUrl);
      toast.success('Background removed and applied!');
    } catch (err) {
      // Handle specific error codes
      if (err.code === 'FREE_TIER_EXHAUSTED' || err.status === 402) {
        toast.error('Background removal limit reached. Please try again later or upload images with transparent backgrounds.');
      } else if (err.code === 'RATE_LIMIT_EXCEEDED' || err.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error(err.message || 'Failed to remove background. Please try again.');
      }
    } finally {
      setIsRemovingBg(false);
    }
  }, [selectedImage, onSelect]);

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden animate-fade-in">
      {/* ----------------------------------------------------------------
          Header — shows active field label and close button
          ---------------------------------------------------------------- */}
      <div className="px-3 sm:px-4 py-3 bg-[#151515] border-b border-[#2a2a2a] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            AI Search
            <span className="text-purple-400">—</span>
            <span className="text-purple-400 normal-case">{FIELD_LABELS[activeField]}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
            Search for transparent-background images
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#2a2a2a] transition-colors"
          aria-label="Close search panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ----------------------------------------------------------------
          Body — search input + results grid
          ---------------------------------------------------------------- */}
      <div className="p-3 sm:p-4 space-y-4">
        {/* Search input row */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for images..."
            className="flex-1 px-3 py-2.5 bg-[#0f0f0f] border border-[#3a3a3a] rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-10 h-10 text-purple-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-gray-400 mt-3">Searching images...</p>
          </div>
        )}

        {/* Results grid — 10 rows × 5 columns (scrollable) */}
        {!isLoading && results.length > 0 && (
          <div className="max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {results.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => handleImageClick(image)}
                className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-[1.03] ${
                  selectedImage?.id === image.id
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : 'border-[#2a2a2a] hover:border-[#4a4a4a]'
                }`}
              >
                {/* Checkerboard pattern for transparency */}
                <div className="absolute inset-0 bg-[#0f0f0f]" style={{
                  backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }} />

                {/* Image thumbnail */}
                <img
                  src={image.previewURL}
                  alt={image.tags}
                  className="relative w-full h-full object-contain p-1"
                  loading="lazy"
                />

                {/* Selected checkmark overlay */}
                {selectedImage?.id === image.id && (
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors" />
              </button>
            ))}
          </div>
          </div>
        )}

        {/* Empty state — after search with no results */}
        {!isLoading && hasSearched && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-400">No images found</p>
            <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
          </div>
        )}

        {/* Initial state — before any search */}
        {!isLoading && !hasSearched && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-400">Search for {FIELD_LABELS[activeField].toLowerCase()} images</p>
            <p className="text-xs text-gray-500 mt-1">Results will appear here</p>
          </div>
        )}

        {/* Action buttons — shown when an image is selected */}
        {selectedImage && !isLoading && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#2a2a2a]">
            {/* Apply directly */}
            <button
              type="button"
              onClick={handleApplyImage}
              disabled={isRemovingBg}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply to Banner
            </button>

            {/* Remove background first */}
            <button
              type="button"
              onClick={handleRemoveBackground}
              disabled={isRemovingBg}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isRemovingBg ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Removing Background...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Remove Background
                </>
              )}
            </button>
          </div>
        )}

        {/* Pixabay attribution (required by their API terms) */}
        {results.length > 0 && (
          <p className="text-xs text-gray-600 text-center">
            Images provided by{' '}
            <a
              href="https://pixabay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 underline"
            >
              Pixabay
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

export default ImageSearchPanel;
