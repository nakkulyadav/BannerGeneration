/**
 * Editor Page Component
 *
 * Main editor page that loads a project and renders the appropriate editor:
 * - Preset Editor: For predefined dimension types (promotional_banner, widget, etc.)
 * - Custom Editor: For custom dimensions with free-form element placement
 *
 * This component handles project loading and editor selection.
 * State management is centralized in EditorContext.
 *
 * @module pages/EditorPage
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { EditorProvider, useEditor } from '../contexts/EditorContext';
import { PresetEditor, CustomEditor, ExportModal, CustomCanvasPreview } from '../components/editor';
import BannerPreview from '../components/BannerPreview/BannerPreview';
import ImageSearchPanel from '../components/ImageSearch/ImageSearchPanel';
import { getProject } from '../services/projectService';
import { useBannerGenerator } from '../hooks';
import { LanguageSelector } from '../components/shared';

// =============================================================================
// EDITOR PAGE WRAPPER
// =============================================================================

/**
 * Editor Page Wrapper
 *
 * Handles project loading and wraps the editor content with EditorProvider.
 * Extracts project configuration from URL params and navigation state.
 */
const EditorPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Project metadata from navigation state or database
  const projectState = location.state || {};
  const {
    dimensionType = 'promotional_banner',
    width = 722,
    height = 312,
    borderRadius = 12,
    isNew = false,
    projectName = 'Untitled Project',
  } = projectState;

  // Loading state for existing projects
  const [isLoading, setIsLoading] = useState(!isNew);
  const [loadedProject, setLoadedProject] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // ===========================================================================
  // PROJECT LOADING
  // ===========================================================================

  useEffect(() => {
    // If this is a new project, no need to load
    if (isNew) {
      setIsLoading(false);
      return;
    }

    // Load project from Supabase
    const loadProject = async () => {
      try {
        // getProject returns { data, error } format
        const { data: project, error } = await getProject(projectId);

        // Handle error response
        if (error) {
          console.error('Failed to load project:', error);
          setLoadError(error.message || 'Failed to load project');
          return;
        }

        // Handle success response
        if (project) {
          setLoadedProject(project);
        } else {
          setLoadError('Project not found');
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        setLoadError(error.message || 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, isNew]);

  // ===========================================================================
  // LOADING STATE
  // ===========================================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // ERROR STATE
  // ===========================================================================

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-400">{loadError}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // BUILD PROJECT CONFIG
  // ===========================================================================

  // Determine project configuration from loaded data or navigation state
  const projectConfig = loadedProject
    ? {
        projectId: loadedProject.id,
        projectName: loadedProject.name,
        dimensionType: loadedProject.dimension_type,
        width: loadedProject.width,
        height: loadedProject.height,
        borderRadius: loadedProject.border_radius,
        isNew: false,
        initialState: loadedProject.canvas_state,
      }
    : {
        projectId,
        projectName,
        dimensionType,
        width,
        height,
        borderRadius,
        isNew,
        initialState: null,
      };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <EditorProvider projectConfig={projectConfig}>
      <EditorContent />
    </EditorProvider>
  );
};

// =============================================================================
// EDITOR CONTENT
// =============================================================================

/**
 * Editor Content Component
 *
 * Main editor UI that consumes EditorContext.
 * Renders header, input form, preview, and search panel.
 */
const EditorContent = () => {
  const {
    // Project metadata
    project,

    // Banner state
    bannerState,

    // State handlers
    updateSection,
    updateBackground,
    updateBrandLogo,
    updateHeading,
    updateSubheading,
    updateSubheadingLeft,
    updateSubheadingRight,
    updateCtaButton,
    updateTcText,
    updateOfferBadge,
    updateProductImage,
    openSearchPanel,

    // Search panel
    searchPanel,
    closeSearchPanel,
    handleSearchSelect,

    // Validation
    isFormValid,

    // Save status
    saveStatus,

    // Editor type detection
    isPreset,
    isCustom,
  } = useEditor();

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Custom canvas state (for custom editor)
  const [customCanvasState, setCustomCanvasState] = useState({
    getCanvas: null,
    initializeCanvas: null,
    isInitialized: false,
    width: project.width,
    height: project.height,
    borderRadius: project.borderRadius,
  });

  // Get canvas from banner generator hook (for preset editor export)
  const { getFabricCanvas } = useBannerGenerator(bannerState, project.dimensionType);

  /**
   * Handle custom canvas ready callback
   * Called by CustomEditor when canvas is available
   */
  const handleCustomCanvasReady = useCallback((canvasState) => {
    setCustomCanvasState(canvasState);
  }, []);

  /**
   * Get the active canvas for export
   * Returns the correct canvas based on editor type
   */
  const getActiveCanvas = useCallback(() => {
    if (isCustom && customCanvasState.getCanvas) {
      return customCanvasState.getCanvas();
    }
    return getFabricCanvas();
  }, [isCustom, customCanvasState, getFabricCanvas]);

  // ===========================================================================
  // STATE HANDLERS OBJECT (for InputForm compatibility)
  // ===========================================================================

  const stateHandlers = {
    updateSection,
    updateBackground,
    updateBrandLogo,
    updateHeading,
    updateSubheading,
    updateSubheadingLeft,
    updateSubheadingRight,
    updateCtaButton,
    updateTcText,
    updateOfferBadge,
    updateProductImage,
    openSearchPanel,
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#0f0f0f]">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        containerClassName="toast-container"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Editor Header */}
      <EditorHeader
        project={project}
        saveStatus={saveStatus}
        isCustom={isCustom}
        onExport={() => setIsExportModalOpen(true)}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        getCanvas={getActiveCanvas}
        project={project}
      />

      {/* Main Layout — 40/60 split on desktop */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Input Form Section - Left Panel (40%) */}
        <div className="lg:w-2/5 h-1/2 lg:h-full overflow-y-auto p-3 sm:p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* Render preset editor for preset dimension types */}
          {isPreset && (
            <PresetEditor
              dimensionType={project.dimensionType}
              bannerState={bannerState}
              handlers={stateHandlers}
            />
          )}

          {/* Render custom editor for custom dimensions */}
          {isCustom && (
            <CustomEditor onCanvasReady={handleCustomCanvasReady} />
          )}
        </div>

        {/* Preview Section - Right Panel (60%) */}
        <div className="flex-1 lg:w-3/5 h-1/2 lg:h-full flex flex-col overflow-hidden">
          {/* Banner Preview - for preset editors */}
          {isPreset && (
            <div className={`overflow-auto p-3 sm:p-4 lg:p-6 ${searchPanel.isOpen ? 'h-1/2' : 'flex-1'}`}>
              <BannerPreview
                bannerState={bannerState}
                isValid={isFormValid()}
                dimensionType={project.dimensionType}
                width={project.width}
                height={project.height}
              />
            </div>
          )}

          {/* Custom Canvas Preview - for custom editors */}
          {isCustom && (
            <div className={`overflow-auto p-3 sm:p-4 lg:p-6 ${searchPanel.isOpen ? 'h-1/2' : 'flex-1'}`}>
              <CustomCanvasPreview
                initializeCanvas={customCanvasState.initializeCanvas}
                getCanvas={customCanvasState.getCanvas}
                isInitialized={customCanvasState.isInitialized}
                width={customCanvasState.width}
                height={customCanvasState.height}
                borderRadius={customCanvasState.borderRadius}
              />
            </div>
          )}

          {/* AI Image Search Panel — takes bottom half when open */}
          {searchPanel.isOpen && (
            <div className="h-1/2 overflow-hidden border-t border-gray-800">
              <ImageSearchPanel
                activeField={searchPanel.activeField}
                onClose={closeSearchPanel}
                onSelect={handleSearchSelect}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// =============================================================================
// EDITOR HEADER
// =============================================================================

/**
 * Editor Header Component
 *
 * Displays project info, navigation, save status, and export button.
 *
 * @param {Object} props - Component props
 * @param {Object} props.project - Project metadata
 * @param {string} props.saveStatus - Current save status
 * @param {boolean} props.isCustom - Whether this is a custom dimension project
 * @param {Function} props.onExport - Callback to open export modal
 */
const EditorHeader = ({ project, saveStatus, isCustom, onExport }) => {
  const { undo, redo, canUndo, canRedo } = useEditor();
  const navigate = useNavigate();

  /**
   * Get display name for dimension type
   */
  const getProjectTypeName = () => {
    if (isCustom) return 'Custom Project';

    const typeNames = {
      promotional_banner: 'Promotional Banner',
      widget: 'Widget',
      circular_badge: 'Circular Badge',
      rounded_square: 'Rounded Square',
      banner2: 'Banner 2',
    };

    return typeNames[project.dimensionType] ||
      project.dimensionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0">
      {/* Left Side - Back Button & Project Info */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title="Back to Home"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-medium">
            {project.name || getProjectTypeName()}
          </h1>
          <p className="text-gray-500 text-xs">{project.width} × {project.height} px</p>
        </div>
      </div>

      {/* Center - Undo/Redo (for custom editor) */}
      {isCustom && (
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Right Side - Language Selector, Save Status & Export */}
      <div className="flex items-center gap-3">
        {/* Target Language Selector */}
        <LanguageSelector />

        {/* Save Status */}
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saved' && (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-400 hidden sm:inline">Saved</span>
            </>
          )}
          {saveStatus === 'saving' && (
            <>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-gray-400 hidden sm:inline">Saving...</span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <>
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-gray-400 hidden sm:inline">Unsaved</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-400 hidden sm:inline">Save failed</span>
            </>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};

export default EditorPage;
