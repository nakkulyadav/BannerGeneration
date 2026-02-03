/**
 * DigiHaat Banner Generator - Main Application
 *
 * Root component that manages all banner state and provides
 * the responsive layout (desktop: side-by-side, mobile: stacked)
 */

import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { INITIAL_BANNER_STATE, REQUIRED_FIELDS } from './constants/defaultValues';
import InputForm from './components/InputForm/InputForm';
import BannerPreview from './components/BannerPreview/BannerPreview';
import ImageSearchPanel from './components/ImageSearch/ImageSearchPanel';

function App() {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  const [bannerState, setBannerState] = useState(INITIAL_BANNER_STATE);

  // Search panel state — controls the AI image search panel below the preview
  const [searchPanel, setSearchPanel] = useState({
    isOpen: false,
    activeField: null, // 'logo' | 'product'
  });

  // ==========================================================================
  // STATE UPDATE HANDLERS
  // ==========================================================================

  /**
   * Update background image and edge type
   */
  const updateBackground = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      background: { ...prev.background, ...updates }
    }));
  }, []);

  /**
   * Update brand logo
   */
  const updateBrandLogo = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      brandLogo: { ...prev.brandLogo, ...updates }
    }));
  }, []);

  /**
   * Update product heading
   */
  const updateHeading = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      heading: { ...prev.heading, ...updates }
    }));
  }, []);

  /**
   * Update product subheading (handles split mode)
   */
  const updateSubheading = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      subheading: { ...prev.subheading, ...updates }
    }));
  }, []);

  /**
   * Update subheading left part
   */
  const updateSubheadingLeft = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      subheading: {
        ...prev.subheading,
        left: { ...prev.subheading.left, ...updates }
      }
    }));
  }, []);

  /**
   * Update subheading right part
   */
  const updateSubheadingRight = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      subheading: {
        ...prev.subheading,
        right: { ...prev.subheading.right, ...updates }
      }
    }));
  }, []);

  /**
   * Update CTA button
   */
  const updateCtaButton = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      ctaButton: { ...prev.ctaButton, ...updates }
    }));
  }, []);

  /**
   * Update T&C text
   */
  const updateTcText = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      tcText: { ...prev.tcText, ...updates }
    }));
  }, []);

  /**
   * Update offer badge
   */
  const updateOfferBadge = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      offerBadge: { ...prev.offerBadge, ...updates }
    }));
  }, []);

  /**
   * Update product image
   */
  const updateProductImage = useCallback((updates) => {
    setBannerState(prev => ({
      ...prev,
      productImage: { ...prev.productImage, ...updates }
    }));
  }, []);

  // ==========================================================================
  // SEARCH PANEL HANDLERS
  // ==========================================================================

  /**
   * Open the AI search panel for a specific field.
   * If the panel is already open for a different field, switch context and clear results.
   */
  const openSearchPanel = useCallback((field) => {
    setSearchPanel({ isOpen: true, activeField: field });
  }, []);

  /**
   * Close the AI search panel
   */
  const closeSearchPanel = useCallback(() => {
    setSearchPanel({ isOpen: false, activeField: null });
  }, []);

  /**
   * Handle image selection from the search panel.
   * Applies the selected image URL to the corresponding field.
   */
  const handleSearchSelect = useCallback((imageUrl) => {
    setSearchPanel((prev) => {
      if (prev.activeField === 'logo') {
        setBannerState((s) => ({
          ...s,
          brandLogo: { image: null, imageUrl },
        }));
      } else if (prev.activeField === 'product') {
        setBannerState((s) => ({
          ...s,
          productImage: { image: null, imageUrl },
        }));
      }
      return prev;
    });
  }, []);

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  /**
   * Check if all required fields are filled
   * @returns {boolean}
   */
  const isFormValid = useCallback(() => {
    const { background, heading, ctaButton, productImage } = bannerState;

    return (
      background.imageUrl !== '' &&
      heading.text.trim() !== '' &&
      ctaButton.text.trim() !== '' &&
      ctaButton.bgColor !== '' &&
      productImage.imageUrl !== ''
    );
  }, [bannerState]);

  // ==========================================================================
  // STATE UPDATE HANDLERS OBJECT (passed to children)
  // ==========================================================================

  const stateHandlers = {
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

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#0f0f0f]">
      {/* Toast notifications - polished styling with smooth animations */}
      <Toaster
        position="top-right"
        containerClassName="toast-container"
        toastOptions={{
          // Default options for all toasts
          duration: 3000,
          style: {
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            background: '#1f1f1f',
            color: '#e5e5e5',
          },
          // Success toast styling
          success: {
            style: {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          // Error toast styling
          error: {
            style: {
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#dc2626',
            },
          },
          // Loading toast styling
          loading: {
            style: {
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
            },
          },
        }}
        // Custom gap and offset for better positioning
        gutter={8}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />

      {/* Header - Dark mode styling */}
      <header className="bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-[#2a2a2a] sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-100 tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                DigiHaat
              </span>
              <span className="text-gray-300 font-semibold"> Banner Generator</span>
            </h1>
            {/* Mobile indicator for required fields */}
            <span className="text-xs text-gray-500 sm:hidden flex items-center gap-1">
              <span className="text-red-400 text-base">*</span>
              <span>required</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main content - fixed layout with scrollable input section only */}
      <main className="flex-1 overflow-hidden max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 w-full">
        <div className="h-full flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* ================================================================
              Left Panel: Input Form
              - Full width on mobile, stacked on top
              - 1/2 width on desktop (lg+), side by side
              - Only this section is scrollable
              ================================================================ */}
          <div className="w-full lg:w-1/2 overflow-y-auto pr-1 scrollbar-thin">
            <InputForm
              bannerState={bannerState}
              handlers={stateHandlers}
            />
            {/* Bottom padding for scroll area */}
            <div className="h-4" aria-hidden="true" />
          </div>

          {/* ================================================================
              Right Panel: Preview + Search Panel
              - Full width on mobile, stacked below form
              - 1/2 width on desktop (lg+), fixed position
              - Scrollable to accommodate search panel below preview
              ================================================================ */}
          <div className="w-full lg:w-1/2 flex-shrink-0 overflow-y-auto scrollbar-thin">
            <BannerPreview
              bannerState={bannerState}
              isValid={isFormValid()}
            />

            {/* AI Image Search Panel — shown below the preview */}
            {searchPanel.isOpen && (
              <div className="mt-4">
                <ImageSearchPanel
                  activeField={searchPanel.activeField}
                  onSelect={handleSearchSelect}
                  onClose={closeSearchPanel}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
