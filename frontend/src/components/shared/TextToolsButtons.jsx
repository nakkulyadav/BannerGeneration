/**
 * Text Tools Buttons Component
 *
 * Reusable pair of icon buttons (translate + spell-check) that manage
 * their own popover state, API calls, and result handling.
 * Drop this next to any text input label to add translation/spell-check.
 *
 * Only one popover is open at a time. Popovers dismiss on Cancel, Apply,
 * click-outside, or Escape key.
 *
 * @module components/shared/TextToolsButtons
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { translateText, checkSpelling } from '../../services/textToolsService';
import TranslatePopover from './TranslatePopover';
import SpellCheckPopover from './SpellCheckPopover';

/**
 * @param {Object} props
 * @param {string} props.text - Current text value to translate/check
 * @param {Function} props.onApply - Callback to apply new text: (newText) => void
 * @param {boolean} [props.showTranslate=true] - Show translate button
 * @param {boolean} [props.showSpellCheck=true] - Show spell-check button
 * @param {boolean} [props.disabled=false] - Disable both buttons
 * @param {number} [props.maxLength] - Optional max char limit (shows warning on translate)
 */
function TextToolsButtons({
  text,
  onApply,
  showTranslate = true,
  showSpellCheck = true,
  disabled = false,
  maxLength,
}) {
  const { targetLanguage } = useEditor();
  const containerRef = useRef(null);

  // ---------------------------------------------------------------------------
  // Internal state
  // ---------------------------------------------------------------------------

  const [activePopover, setActivePopover] = useState(null); // 'translate' | 'spell' | null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Translation result
  const [translatedText, setTranslatedText] = useState('');

  // Spell-check results
  const [spellMatches, setSpellMatches] = useState([]);

  // Both buttons disabled when text is empty/whitespace
  const isTextEmpty = !text || text.trim().length === 0;

  // ---------------------------------------------------------------------------
  // Click-outside & Escape dismissal
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!activePopover) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActivePopover(null);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setActivePopover(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activePopover]);

  // ---------------------------------------------------------------------------
  // Translate handler
  // ---------------------------------------------------------------------------

  const handleTranslate = useCallback(async () => {
    setActivePopover('translate');
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText(text, targetLanguage);
      setTranslatedText(result);
    } catch (err) {
      setError(err.message || 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  }, [text, targetLanguage]);

  // ---------------------------------------------------------------------------
  // Spell-check handler
  // ---------------------------------------------------------------------------

  const handleSpellCheck = useCallback(async () => {
    setActivePopover('spell');
    setIsLoading(true);
    setError(null);
    setSpellMatches([]);

    try {
      const matches = await checkSpelling(text, 'en-US');
      setSpellMatches(matches);
    } catch (err) {
      setError(err.message || 'Spell check failed');
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  // ---------------------------------------------------------------------------
  // Apply handlers
  // ---------------------------------------------------------------------------

  /** Apply translated text and close popover */
  const handleApplyTranslation = useCallback(() => {
    onApply(translatedText);
    setActivePopover(null);
  }, [translatedText, onApply]);

  /**
   * Apply a single spell-check fix — replace one word and close popover.
   * Computes new text by splicing at the match offset.
   */
  const handleApplySpellFix = useCallback((offset, length, replacement) => {
    const newText = text.slice(0, offset) + replacement + text.slice(offset + length);
    onApply(newText);
    setActivePopover(null);
  }, [text, onApply]);

  /**
   * Apply all fixes — process from highest offset to lowest so earlier
   * offsets remain valid as we splice.
   */
  const handleApplyAllFixes = useCallback(() => {
    // Sort matches by offset descending
    const sorted = [...spellMatches]
      .filter((m) => m.replacements?.length > 0)
      .sort((a, b) => b.offset - a.offset);

    let newText = text;
    for (const match of sorted) {
      newText = newText.slice(0, match.offset) + match.replacements[0] + newText.slice(match.offset + match.length);
    }

    onApply(newText);
    setActivePopover(null);
  }, [text, spellMatches, onApply]);

  // ---------------------------------------------------------------------------
  // Target language display name
  // ---------------------------------------------------------------------------

  const targetLangName = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)?.nativeName
    || targetLanguage;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="relative inline-flex items-center gap-0.5" ref={containerRef}>
      {/* Translate button */}
      {showTranslate && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleTranslate(); }}
          disabled={disabled || isTextEmpty}
          className="p-1 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title={`Translate to ${targetLangName}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

      {/* Spell-check button */}
      {showSpellCheck && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleSpellCheck(); }}
          disabled={disabled || isTextEmpty}
          className="p-1 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Check spelling"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}

      {/* Popover — positioned below buttons */}
      {activePopover && (
        <div className="absolute left-0 top-full mt-2 z-50">
          {activePopover === 'translate' && (
            <TranslatePopover
              text={text}
              translatedText={translatedText}
              targetLangName={targetLangName}
              isLoading={isLoading}
              error={error}
              onApply={handleApplyTranslation}
              onCancel={() => setActivePopover(null)}
              onRetry={handleTranslate}
              maxLength={maxLength}
            />
          )}

          {activePopover === 'spell' && (
            <SpellCheckPopover
              matches={spellMatches}
              isLoading={isLoading}
              error={error}
              onApplyFix={handleApplySpellFix}
              onApplyAll={handleApplyAllFixes}
              onClose={() => setActivePopover(null)}
              onRetry={handleSpellCheck}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default TextToolsButtons;
