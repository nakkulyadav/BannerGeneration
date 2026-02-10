/**
 * Language Selector Component
 *
 * Compact dropdown for choosing the target translation language.
 * Reads/writes `targetLanguage` via EditorContext.
 * Styled to match EditorHeader button aesthetic (dark bg, gray text, hover states).
 *
 * @module components/shared/LanguageSelector
 */

import { useState, useRef, useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

/**
 * LanguageSelector Component
 *
 * Shows a compact button with globe icon + native language name.
 * Dropdown lists all 10 supported languages.
 */
function LanguageSelector() {
  const { targetLanguage, setTargetLanguage } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Find current language object
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)
    || SUPPORTED_LANGUAGES[0];

  // ---------------------------------------------------------------------------
  // Click-outside dismissal
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        title="Translation language"
      >
        {/* Globe icon */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline text-xs">{currentLang.nativeName}</span>
        {/* Chevron */}
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg shadow-xl py-1 z-50 min-w-[200px]">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setTargetLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors ${
                lang.code === targetLanguage
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-gray-300 hover:bg-[#2a2a2a]'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-xs text-gray-500">{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
