/**
 * Input Form Container Component
 *
 * Container for all banner input sections.
 * Groups inputs logically into styled cards with clear section headers.
 * Uses consistent visual hierarchy and spacing throughout.
 */

import BackgroundSection from './BackgroundSection';
import BrandLogoSection from './BrandLogoSection';
import HeadingSection from './HeadingSection';
import SubheadingSection from './SubheadingSection';
import CTAButtonSection from './CTAButtonSection';
import TCTextSection from './TCTextSection';
import OfferBadgeSection from './OfferBadgeSection';
import ProductImageSection from './ProductImageSection';

/**
 * Section Card Component
 * Reusable wrapper for consistent card styling across all sections.
 * Includes responsive padding, subtle hover effects, and focus-within styling.
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.description - Optional section description
 * @param {boolean} props.hasRequired - Shows indicator that section contains required fields
 * @param {React.ReactNode} props.children - Section content
 */
function SectionCard({ title, description, hasRequired = false, children }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-[#3a3a3a] focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50">
      {/* Card header - dark mode styling */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#151515] border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wide">
            {title}
          </h2>
          {hasRequired && (
            <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
              <span className="text-red-400">*</span>
              <span className="hidden sm:inline">Required</span>
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1 hidden sm:block">{description}</p>
        )}
      </div>
      {/* Card body - responsive padding */}
      <div className="p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {Object} props.bannerState - Current banner state
 * @param {Object} props.handlers - State update handlers
 */
function InputForm({ bannerState, handlers }) {
  return (
    <div className="space-y-5">
      {/* ================================================================
          Section: Background
          Required: Background image (722x312)
          ================================================================ */}
      <SectionCard
        title="Background"
        description="Upload your banner background image"
        hasRequired
      >
        <BackgroundSection
          background={bannerState.background}
          onUpdate={handlers.updateBackground}
        />
      </SectionCard>

      {/* ================================================================
          Section: Brand Identity
          Optional: Brand logo
          ================================================================ */}
      <SectionCard
        title="Brand Identity"
        description="Add your brand logo (optional)"
      >
        <BrandLogoSection
          brandLogo={bannerState.brandLogo}
          onUpdate={handlers.updateBrandLogo}
        />
      </SectionCard>

      {/* ================================================================
          Section: Text Content
          Required: Heading
          Optional: Subheading, T&C text
          ================================================================ */}
      <SectionCard
        title="Text Content"
        description="Configure the text elements for your banner"
        hasRequired
      >
        <div className="space-y-5">
          {/* Heading - Required */}
          <HeadingSection
            heading={bannerState.heading}
            onUpdate={handlers.updateHeading}
          />

          {/* Divider */}
          <hr className="border-[#2a2a2a]" />

          {/* Subheading - Optional */}
          <SubheadingSection
            subheading={bannerState.subheading}
            onUpdate={handlers.updateSubheading}
            onUpdateLeft={handlers.updateSubheadingLeft}
            onUpdateRight={handlers.updateSubheadingRight}
          />

          {/* Divider */}
          <hr className="border-[#2a2a2a]" />

          {/* T&C Text - Optional */}
          <TCTextSection
            tcText={bannerState.tcText}
            onUpdate={handlers.updateTcText}
          />
        </div>
      </SectionCard>

      {/* ================================================================
          Section: Call to Action
          Required: Button text, Background color
          ================================================================ */}
      <SectionCard
        title="Call to Action"
        description="Configure the CTA button appearance"
        hasRequired
      >
        <CTAButtonSection
          ctaButton={bannerState.ctaButton}
          onUpdate={handlers.updateCtaButton}
        />
      </SectionCard>

      {/* ================================================================
          Section: Right Panel Elements
          Required: Product image
          Optional: Offer badge
          ================================================================ */}
      <SectionCard
        title="Right Panel"
        description="Product image and optional offer badge"
        hasRequired
      >
        <div className="space-y-5">
          {/* Offer Badge - Optional */}
          <OfferBadgeSection
            offerBadge={bannerState.offerBadge}
            onUpdate={handlers.updateOfferBadge}
          />

          {/* Divider */}
          <hr className="border-[#2a2a2a]" />

          {/* Product Image - Required */}
          <ProductImageSection
            productImage={bannerState.productImage}
            onUpdate={handlers.updateProductImage}
          />
        </div>
      </SectionCard>
    </div>
  );
}

export default InputForm;
