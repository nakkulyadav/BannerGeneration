/**
 * Preset Editor Component
 *
 * Renders input controls for preset dimension types (promotional_banner, widget, etc.).
 * Dynamically loads preset configuration and renders appropriate input sections.
 * Wraps existing InputForm components for the promotional banner preset,
 * with extensibility for other presets.
 *
 * @module components/editor/PresetEditor
 */

import { useMemo } from 'react';
import { getPresetConfig, PRESET_TYPES } from '../../constants/presetConfigs';
import InputForm from '../InputForm/InputForm';
import WidgetInputForm from './widget/WidgetInputForm';

// =============================================================================
// PRESET EDITOR COMPONENT
// =============================================================================

/**
 * Preset Editor Component
 *
 * Renders the appropriate input form based on preset type.
 * Currently supports:
 * - promotional_banner: Full InputForm with all sections
 * - widget: WidgetInputForm with background, text fields, product image
 * - Other presets: Placeholder with basic info (to be implemented)
 *
 * @param {Object} props - Component props
 * @param {string} props.dimensionType - Preset type identifier
 * @param {Object} props.bannerState - Current banner/canvas state
 * @param {Object} props.handlers - State update handler functions
 */
const PresetEditor = ({ dimensionType, bannerState, handlers }) => {
  // Load preset configuration
  const presetConfig = useMemo(() => {
    return getPresetConfig(dimensionType);
  }, [dimensionType]);

  // ===========================================================================
  // RENDER PROMOTIONAL BANNER
  // ===========================================================================

  if (dimensionType === PRESET_TYPES.PROMOTIONAL_BANNER) {
    return (
      <InputForm
        bannerState={bannerState}
        handlers={handlers}
      />
    );
  }

  // ===========================================================================
  // RENDER WIDGET
  // ===========================================================================

  if (dimensionType === PRESET_TYPES.WIDGET) {
    return (
      <WidgetInputForm
        bannerState={bannerState}
        handlers={handlers}
      />
    );
  }

  // ===========================================================================
  // RENDER OTHER PRESETS (PLACEHOLDER)
  // ===========================================================================

  // For other presets, show a placeholder until their specific editors are built
  if (presetConfig) {
    return (
      <PresetPlaceholder
        config={presetConfig}
        bannerState={bannerState}
        handlers={handlers}
      />
    );
  }

  // ===========================================================================
  // FALLBACK FOR UNKNOWN PRESETS
  // ===========================================================================

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-white font-medium mb-2">Unknown Preset</h3>
      <p className="text-gray-400 text-sm">
        Preset type "{dimensionType}" is not configured.
      </p>
    </div>
  );
};

// =============================================================================
// PRESET PLACEHOLDER COMPONENT
// =============================================================================

/**
 * Placeholder component for presets that don't have full editor support yet.
 * Shows preset info and basic element inputs.
 *
 * @param {Object} props - Component props
 * @param {Object} props.config - Preset configuration
 * @param {Object} props.bannerState - Current state
 * @param {Object} props.handlers - State handlers
 */
const PresetPlaceholder = ({ config, bannerState, handlers }) => {
  return (
    <div className="space-y-5">
      {/* Preset Info Card */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4">
        <div className="flex items-start gap-4">
          {/* Preset Icon */}
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>

          {/* Preset Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium mb-1">{config.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{config.description}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{config.dimensions.width} × {config.dimensions.height} px</span>
              <span>•</span>
              <span>Radius: {config.dimensions.borderRadius}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elements List */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="px-4 py-3 bg-[#151515] border-b border-[#2a2a2a]">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
            Available Elements
          </h4>
        </div>
        <div className="p-4 space-y-3">
          {config.elements.map((element, index) => (
            <div
              key={element.type + index}
              className="flex items-center gap-3 p-3 bg-[#0f0f0f] rounded-lg border border-[#2a2a2a]"
            >
              {/* Element Icon */}
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                element.required ? 'bg-red-500/20' : 'bg-gray-500/20'
              }`}>
                <ElementIcon type={element.type} required={element.required} />
              </div>

              {/* Element Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-200 text-sm font-medium">
                    {element.label}
                  </span>
                  {element.required && (
                    <span className="text-red-400 text-xs">*Required</span>
                  )}
                </div>
                {element.description && (
                  <p className="text-gray-500 text-xs truncate">
                    {element.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-yellow-400 text-sm font-medium mb-1">
              Editor Coming Soon
            </h4>
            <p className="text-yellow-400/70 text-xs">
              Full editing support for {config.name} will be available in a future update.
              Currently, only Promotional Banner has complete editor support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ELEMENT ICON COMPONENT
// =============================================================================

/**
 * Returns appropriate icon for element type
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Element type
 * @param {boolean} props.required - Whether element is required
 */
const ElementIcon = ({ type, required }) => {
  const iconClass = required ? 'text-red-400' : 'text-gray-400';

  const icons = {
    background: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    brandLogo: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    heading: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    subheading: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
    ctaButton: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    tcText: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    offerBadge: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    productImage: (
      <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  };

  return icons[type] || (
    <svg className={`w-4 h-4 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
};

export default PresetEditor;
