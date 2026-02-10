/**
 * Spell Check Popover Component
 *
 * Displays spelling/grammar issues with clickable suggestion chips.
 * Handles loading, success (0 or N matches), and error states.
 * "Apply All Fixes" processes from highest offset to lowest to avoid offset invalidation.
 *
 * @module components/shared/SpellCheckPopover
 */

/**
 * @param {Object} props
 * @param {Array} props.matches - Array of spell check match objects
 * @param {boolean} props.isLoading - Whether spell check is in progress
 * @param {string|null} props.error - Error message (null if no error)
 * @param {Function} props.onApplyFix - Callback: (offset, length, replacement) => void
 * @param {Function} props.onApplyAll - Callback to apply first suggestion for every match
 * @param {Function} props.onClose - Callback to dismiss popover
 * @param {Function} props.onRetry - Callback to retry failed check
 */
function SpellCheckPopover({
  matches,
  isLoading,
  error,
  onApplyFix,
  onApplyAll,
  onClose,
  onRetry,
}) {
  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl p-4 w-72">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-gray-300">Checking spelling...</span>
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
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
          >
            Retry
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Success — no issues found
  // ---------------------------------------------------------------------------

  if (!matches || matches.length === 0) {
    return (
      <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl p-4 w-72">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-green-400 font-medium">No issues found!</span>
        </div>
        <button
          onClick={onClose}
          className="w-full px-3 py-1.5 text-xs font-medium bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-md transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Success — issues found
  // ---------------------------------------------------------------------------

  // Check if at least one match has a suggestion (needed for "Apply All" button)
  const hasAnySuggestion = matches.some((m) => m.replacements?.length > 0);

  return (
    <div className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl p-4 w-80 max-h-64 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400">
          {matches.length} issue{matches.length !== 1 ? 's' : ''} found
        </span>
        {hasAnySuggestion && (
          <button
            onClick={onApplyAll}
            className="text-[10px] font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Apply All Fixes
          </button>
        )}
      </div>

      {/* Match list */}
      <div className="space-y-3">
        {matches.map((match, index) => (
          <div key={index} className="border-b border-[#2a2a2a] pb-2 last:border-b-0 last:pb-0">
            {/* Error message */}
            <p className="text-xs text-gray-300 mb-1.5">{match.message}</p>

            {/* Suggestion chips */}
            {match.replacements?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {match.replacements.map((replacement, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => onApplyFix(match.offset, match.length, replacement)}
                    className="px-2 py-0.5 text-[11px] font-medium bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 rounded transition-colors"
                  >
                    {replacement}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="w-full mt-3 px-3 py-1.5 text-xs font-medium bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-md transition-colors"
      >
        Close
      </button>
    </div>
  );
}

export default SpellCheckPopover;
