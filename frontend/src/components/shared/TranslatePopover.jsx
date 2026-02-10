/**
 * Translate Popover Component
 *
 * Shows translation preview with original → translated comparison.
 * Handles loading, success, and error states.
 * Warns if translated text exceeds an optional maxLength.
 *
 * @module components/shared/TranslatePopover
 */

/**
 * @param {Object} props
 * @param {string} props.text - Original text
 * @param {string} props.translatedText - Translated result
 * @param {string} props.targetLangName - Display name of target language
 * @param {boolean} props.isLoading - Whether translation is in progress
 * @param {string|null} props.error - Error message (null if no error)
 * @param {Function} props.onApply - Callback to apply translation
 * @param {Function} props.onCancel - Callback to dismiss popover
 * @param {Function} props.onRetry - Callback to retry failed translation
 * @param {number} [props.maxLength] - Optional max char limit for warning
 */
function TranslatePopover({
  text,
  translatedText,
  targetLangName,
  isLoading,
  error,
  onApply,
  onCancel,
  onRetry,
  maxLength,
}) {
  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl p-4 w-72">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-purple-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-300">Translating to {targetLangName}...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error state
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl p-4 w-72">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-400">{error}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRetry}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------------

  const exceedsMax = maxLength && translatedText && translatedText.length > maxLength;

  return (
    <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl p-4 w-80">
      {/* Original text */}
      <div className="mb-3">
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Original</span>
        <p className="text-sm text-gray-400 mt-1 break-words">{text}</p>
      </div>

      {/* Translated text */}
      <div className="mb-3">
        <span className="text-[10px] font-medium text-purple-400 uppercase tracking-wider">
          {targetLangName}
        </span>
        <p className="text-sm text-white mt-1 break-words font-medium">{translatedText}</p>
      </div>

      {/* Max length warning */}
      {exceedsMax && (
        <p className="text-xs text-amber-400 bg-amber-900/20 rounded px-2 py-1 mb-3">
          Translated text is {translatedText.length} characters (limit: {maxLength})
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
        >
          Apply
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 text-xs font-medium bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default TranslatePopover;
