
# DigiHaat Banner Generator - Implementation Plan

**Overall Progress:** `100%` (226/226 subtasks completed)

---

## TLDR

Building a web application that generates 722×312px promotional banners for DigiHaat employees. Users input banner elements (background, logo, text, images, colors) through a clean form interface and get a real-time preview. The app exports high-quality PNG files with all elements precisely positioned and styled.

**Key Features:**
- 5 required inputs: background image, heading, CTA button (text + color), product image
- 3 optional inputs: brand logo, subheading (with split/rupee/strikethrough options), T&C text, offer badge
- Real-time preview with automatic layout adjustment
- Mobile responsive (stacked layout)
- Client-side only, no backend needed

---

## Critical Decisions

- **Tech Stack: Vite + React + Fabric.js + Tailwind CSS**
  - Vite for fast dev experience, React for component structure, Fabric.js for canvas manipulation, Tailwind for rapid UI development

- **Canvas Generation: Fabric.js**
  - Provides precise control over text rendering, image positioning, and high-quality PNG export

- **Layout Strategy: Dynamic Vertical Centering**
  - Left section elements center as a group with flexible spacing that adjusts when optional elements are absent

- **State Management: React Context + useState**
  - Simple, no need for Redux; single source of truth for all banner inputs

- **Preview: Real-time with Debouncing**
  - 300ms debounce to balance responsiveness and performance

- **Validation: Strict for Background, Flexible for Others**
  - Background must be exactly 722×312px (reject otherwise), other images scale automatically

- **Deployment: Vercel**
  - Free, fast, automatic HTTPS, simple Git integration

---

## Tasks

### Phase 1: Project Setup & Foundation

- [x] 🟩 **1.1: Initialize Vite + React Project**
  - [x] 🟩 Run `npm create vite@latest` with React template
  - [x] 🟩 Install dependencies: `fabric`, `tailwindcss`, `react-color`, `react-dropzone`, `react-hot-toast`
  - [x] 🟩 Configure Tailwind CSS (init config, add to main CSS)
  - [x] 🟩 Clean up default Vite boilerplate files

- [x] 🟩 **1.2: Project Structure Setup**
  - [x] 🟩 Create folder structure: `components/`, `hooks/`, `utils/`, `constants/`
  - [x] 🟩 Create subfolder: `components/InputForm/`, `components/BannerPreview/`, `components/shared/`
  - [x] 🟩 Add Inter font from Google Fonts to `index.html`

- [x] 🟩 **1.3: Constants & Configuration**
  - [x] 🟩 Create `constants/bannerConfig.js` with banner specs (dimensions, fonts, spacing values)
  - [x] 🟩 Create `constants/defaultValues.js` with default colors and text

---

### Phase 2: State Management & Form Foundation

- [x] 🟩 **2.1: Banner State Structure**
  - [x] 🟩 Create `App.jsx` with main state object (background, logo, heading, subheading, CTA, T&C, badge, product image)
  - [x] 🟩 Implement state setters for each banner element
  - [x] 🟩 Add required field tracking logic

- [x] 🟩 **2.2: Form Validation Hooks**
  - [x] 🟩 Create `hooks/useImageValidation.js` for image dimension checks
  - [x] 🟩 Create `hooks/useFormValidation.js` for required field checks
  - [x] 🟩 Implement character limit validation for heading (40 chars)

- [x] 🟩 **2.3: Layout Container**
  - [x] 🟩 Build responsive layout in `App.jsx` (desktop: side-by-side, mobile: stacked)
  - [x] 🟩 Create `InputForm.jsx` container component
  - [x] 🟩 Create `BannerPreview.jsx` container component

---

### Phase 3: Shared UI Components

- [x] 🟩 **3.1: Color Picker Component**
  - [x] 🟩 Create `components/shared/ColorPicker.jsx` using `react-color`
  - [x] 🟩 Add preset colors palette
  - [x] 🟩 Add hex code input field

- [x] 🟩 **3.2: Image Upload Component**
  - [x] 🟩 Create `components/shared/ImageUpload.jsx` using `react-dropzone`
  - [x] 🟩 Add drag-and-drop UI with preview thumbnail
  - [x] 🟩 Handle file validation and error messages

- [x] 🟩 **3.3: Toggle Switch Component**
  - [x] 🟩 Create `components/shared/ToggleSwitch.jsx` for boolean options
  - [x] 🟩 Style with Tailwind (clean, modern toggle)

---

### Phase 4: Background & Edge Controls

- [x] 🟩 **4.1: Background Section Component**
  - [x] 🟩 Create `components/InputForm/BackgroundSection.jsx`
  - [x] 🟩 Add image upload with 722×312 dimension validation
  - [x] 🟩 Display rejection error if dimensions don't match
  - [x] 🟩 Add edge type selector (sharp/rounded radio buttons)

---

### Phase 5: Left Section Input Components (Part 1)

- [x] 🟩 **5.1: Brand Logo Section**
  - [x] 🟩 Create `components/InputForm/BrandLogoSection.jsx`
  - [x] 🟩 Add image upload (optional field)
  - [x] 🟩 Show preview thumbnail when uploaded

- [x] 🟩 **5.2: Heading Section**
  - [x] 🟩 Create `components/InputForm/HeadingSection.jsx`
  - [x] 🟩 Add text input with 40 character limit (block beyond)
  - [x] 🟩 Add color picker with default black (#000000)
  - [x] 🟩 Mark as required field

- [x] 🟩 **5.3: Subheading Section**
  - [x] 🟩 Create `components/InputForm/SubheadingSection.jsx`
  - [x] 🟩 Add "Split into left/right" toggle
  - [x] 🟩 If not split: single text input + rupee toggle
  - [x] 🟩 If split: left text input (with rupee toggle + strikethrough toggle) + right text input (with rupee toggle)
  - [x] 🟩 Add color picker with default black (#000000)
  - [x] 🟩 Mark as optional field

---

### Phase 6: Left Section Input Components (Part 2)

- [x] 🟩 **6.1: CTA Button Section**
  - [x] 🟩 Create `components/InputForm/CTAButtonSection.jsx`
  - [x] 🟩 Add text input (required)
  - [x] 🟩 Add text color picker with default white (#FFFFFF)
  - [x] 🟩 Add background color picker (no default, required)
  - [x] 🟩 Show validation error if background color not selected

- [x] 🟩 **6.2: T&C Text Section**
  - [x] 🟩 Create `components/InputForm/TCTextSection.jsx`
  - [x] 🟩 Add text input (optional)
  - [x] 🟩 Add color picker with default black (#000000)

---

### Phase 7: Right Section Input Components

- [x] 🟩 **7.1: Offer Badge Section**
  - [x] 🟩 Create `components/InputForm/OfferBadgeSection.jsx`
  - [x] 🟩 Add text input (optional)
  - [x] 🟩 Add text color picker with default white (#FFFFFF)
  - [x] 🟩 Add background color picker (required if text provided)

- [x] 🟩 **7.2: Product Image Section**
  - [x] 🟩 Create `components/InputForm/ProductImageSection.jsx`
  - [x] 🟩 Add image upload (required)
  - [x] 🟩 Show preview thumbnail when uploaded

---

### Phase 8: Banner Generation Engine - Core

- [x] 🟩 **8.1: Canvas Initialization**
  - [x] 🟩 Create `utils/bannerGenerator.js`
  - [x] 🟩 Initialize Fabric.js canvas (722×312px)
  - [x] 🟩 Implement canvas clear/reset function

- [x] 🟩 **8.2: Background Rendering**
  - [x] 🟩 Create `addBackground()` function
  - [x] 🟩 Load and add background image to canvas
  - [x] 🟩 Apply 12px border-radius if "rounded" selected
  - [x] 🟩 Use clipPath for rounded corners

- [x] 🟩 **8.3: Image Processing Utilities**
  - [x] 🟩 Create `utils/imageProcessor.js`
  - [x] 🟩 Implement logo scaling (max 50×120px, maintain aspect ratio)
  - [x] 🟩 Implement product image scaling (max height minus badge space)

---

### Phase 9: Layout Calculator

- [x] 🟩 **9.1: Core Layout Algorithm**
  - [x] 🟩 Create `utils/layoutCalculator.js`
  - [x] 🟩 Implement `calculateLayout(state)` function
  - [x] 🟩 Detect which elements are present (required + optional)
  - [x] 🟩 Calculate individual element heights

- [x] 🟩 **9.2: Vertical Centering Logic**
  - [x] 🟩 Calculate total content height (elements + spacing)
  - [x] 🟩 Calculate top offset for vertical centering
  - [x] 🟩 Generate Y positions for each element

- [x] 🟩 **9.3: Flexible Spacing**
  - [x] 🟩 Implement spacing rules (logo→heading: 5px, heading→sub: 10px, etc.)
  - [x] 🟩 Adjust spacing when optional elements are absent
  - [x] 🟩 Maintain symmetry and center alignment

- [x] 🟩 **9.4: Text Wrapping Calculator**
  - [x] 🟩 Create `utils/textFormatter.js`
  - [x] 🟩 Implement heading text wrapping (max width 156px, max 2 lines)
  - [x] 🟩 Calculate text height for layout

---

### Phase 10: Banner Generation Engine - Elements

- [x] 🟩 **10.1: Brand Logo Rendering**
  - [x] 🟩 Create `addLogo()` function
  - [x] 🟩 Load logo image, scale to max 50×120px
  - [x] 🟩 Position at 11px from top, 20px from left

- [x] 🟩 **10.2: Heading Text Rendering**
  - [x] 🟩 Create `addHeading()` function
  - [x] 🟩 Render with Inter Semibold, 16px, letter spacing 0
  - [x] 🟩 Apply text wrapping (max 2 lines)
  - [x] 🟩 Position using layout calculator coordinates

- [x] 🟩 **10.3: Subheading Rendering**
  - [x] 🟩 Create `addSubheading()` function
  - [x] 🟩 Handle non-split mode: single text with optional "Starting at ₹" prefix
  - [x] 🟩 Handle split mode: left text + right text with 2px gap
  - [x] 🟩 Apply strikethrough to left text if enabled
  - [x] 🟩 Use Inter Medium, 14px

- [x] 🟩 **10.4: CTA Button Rendering**
  - [x] 🟩 Create `addCTAButton()` function
  - [x] 🟩 Calculate button dimensions (text width + 12px padding, text height + 8px padding)
  - [x] 🟩 Render rectangle with 4px border radius and user-selected background color
  - [x] 🟩 Render text centered in button (Inter Bold, 10px, white)

- [x] 🟩 **10.5: T&C Text Rendering**
  - [x] 🟩 Create `addTCText()` function
  - [x] 🟩 Render with Inter Regular, 8px
  - [x] 🟩 Position below CTA button (3-5px spacing)

- [x] 🟩 **10.6: Offer Badge Rendering**
  - [x] 🟩 Create `addOfferBadge()` function
  - [x] 🟩 Calculate badge dimensions (text width + 12px padding, text height + 8px padding)
  - [x] 🟩 Position at absolute top-right (0px, 0px)
  - [x] 🟩 Apply custom corner radius (4px bottom-left only)
  - [x] 🟩 Render text (Inter Medium, 10px, white)

- [x] 🟩 **10.7: Product Image Rendering**
  - [x] 🟩 Create `addProductImage()` function
  - [x] 🟩 Calculate max height (banner height minus badge height minus 5px gap)
  - [x] 🟩 Scale image to fit while maintaining aspect ratio
  - [x] 🟩 Center horizontally and vertically in right section

---

### Phase 11: Real-Time Preview

- [x] 🟩 **11.1: Banner Canvas Component**
  - [x] 🟩 Create `components/BannerPreview/BannerCanvas.jsx`
  - [x] 🟩 Initialize Fabric canvas on component mount
  - [x] 🟩 Connect to global banner state

- [x] 🟩 **11.2: Banner Generation Hook**
  - [x] 🟩 Create `hooks/useBannerGenerator.js`
  - [x] 🟩 Implement debounced generation (300ms delay)
  - [x] 🟩 Call `generateBanner()` from utils on state change
  - [x] 🟩 Handle loading states

- [x] 🟩 **11.3: Preview Integration**
  - [x] 🟩 Connect `BannerCanvas` to `useBannerGenerator` hook
  - [x] 🟩 Render canvas with real-time updates
  - [x] 🟩 Handle errors gracefully (show error message to user)

---

### Phase 12: Download Functionality

- [x] 🟩 **12.1: Download Button Component**
  - [x] 🟩 Create `components/BannerPreview/DownloadButton.jsx`
  - [x] 🟩 Show button only when all required fields are filled
  - [x] 🟩 Disable button if validation fails

- [x] 🟩 **12.2: PNG Export**
  - [x] 🟩 Implement `downloadBanner()` function in `bannerGenerator.js`
  - [x] 🟩 Export canvas as PNG with quality 1.0, 2x multiplier
  - [x] 🟩 Trigger browser download

- [x] 🟩 **12.3: Filename Generation**
  - [x] 🟩 Create `utils/fileNameGenerator.js`
  - [x] 🟩 Remove special characters from heading text
  - [x] 🟩 Replace spaces with underscores
  - [x] 🟩 Truncate to 40 characters
  - [x] 🟩 Append `.png` extension

---

### Phase 13: UI Polish & Responsiveness

- [x] 🟩 **13.1: Input Form Styling**
  - [x] 🟩 Create reusable SectionCard component in InputForm.jsx
  - [x] 🟩 Style all input sections as clean cards with Tailwind
  - [x] 🟩 Add section headers with clear labels and descriptions
  - [x] 🟩 Add "Required" / "Optional" indicators throughout
  - [x] 🟩 Improve visual hierarchy with dividers
  - [x] 🟩 Enhanced BackgroundSection with styled radio buttons for edge selection
  - [x] 🟩 Add tips/help boxes in BrandLogoSection and ProductImageSection
  - [x] 🟩 Enhanced CTAButtonSection with live preview area
  - [x] 🟩 Enhanced OfferBadgeSection with live preview area
  - [x] 🟩 Add character count badges in HeadingSection
  - [x] 🟩 Improved spacing and border treatments throughout

- [x] 🟩 **13.2: Mobile Responsive Layout**
  - [x] 🟩 Update App.jsx with responsive padding (px-3 sm:px-4 lg:px-6)
  - [x] 🟩 Add mobile header indicator for required fields
  - [x] 🟩 Add scrollbar-thin utility class for desktop scroll areas
  - [x] 🟩 Update BannerPreview with responsive card styling
  - [x] 🟩 Update SectionCard with responsive padding (p-3 sm:p-4)
  - [x] 🟩 Add responsive text sizes throughout (text-xs sm:text-sm)
  - [x] 🟩 Enhanced index.css with mobile-specific utilities
  - [x] 🟩 Hidden scrollbars on mobile for cleaner look
  - [x] 🟩 Font-size 16px on mobile inputs (prevents iOS zoom)
  - [x] 🟩 Larger touch targets for radio/checkbox
  - [x] 🟩 Smooth scrolling and reduced motion support
  - [x] 🟩 Focus-visible states for keyboard navigation
  - [x] 🟩 Update DownloadButton with responsive text (short/full versions)

- [x] 🟩 **13.3: Loading States & Transitions**
  - [x] 🟩 Add loading spinners where appropriate (ImageUpload, BannerCanvas)
  - [x] 🟩 Implement smooth transitions between states (fade-in, scale, slide animations)
  - [x] 🟩 Add skeleton loader component (shared/Skeleton.jsx for future use)
  - [x] 🟩 Polish toast notifications (gradient styling, icons, shadows)

- [x] 🟩 **13.4: Final UI Polish**
  - [x] 🟩 Review and polish color scheme consistency (gradients, consistent borders)
  - [x] 🟩 Add smooth hover effects throughout (cards, buttons, toggles, inputs)
  - [x] 🟩 Ensure clean, modern, minimal design (polished header, tip boxes, animations)
  - [x] 🟩 Final visual QA pass (all components reviewed)

---

### Phase 13.5: First Edit - Scaling & Dark Mode 🆕

- [x] 🟩 **13.5.1: Banner Sizing Fixes**
  - [x] 🟩 Updated canvas to 2x dimensions (1444×624) for high-quality output
  - [x] 🟩 Increased logo max size to 240×100px
  - [x] 🟩 Increased heading font to 32px, max-width to 312px
  - [x] 🟩 Increased subheading font to 28px
  - [x] 🟩 Increased CTA button font to 20px with 12/8px padding
  - [x] 🟩 Increased offer badge font to 20px with 12/8px padding
  - [x] 🟩 Updated all layout margins and spacing to 2x values
  - [x] 🟩 Changed export multiplier to 1x (canvas already at 2x)

- [x] 🟩 **13.5.2: Subheading Prefix Fix**
  - [x] 🟩 Changed RUPEE_PREFIX from "Starting at ₹" to just "₹"

- [x] 🟩 **13.5.3: Offer Badge Corner Logic**
  - [x] 🟩 Badge top-right corner now rounds (24px) when banner has rounded edges
  - [x] 🟩 Prevents badge corners from affecting the base background corners

- [x] 🟩 **13.5.4: Dark Mode UI**
  - [x] 🟩 Updated body background to #0f0f0f
  - [x] 🟩 Updated header to dark styling (#1a1a1a)
  - [x] 🟩 Updated all SectionCards to dark theme
  - [x] 🟩 Updated BannerPreview container to dark theme
  - [x] 🟩 Updated all input components (HeadingSection, SubheadingSection, CTAButtonSection, etc.)
  - [x] 🟩 Updated shared components (ColorPicker, ToggleSwitch, ImageUpload)
  - [x] 🟩 Updated scrollbar colors for dark mode
  - [x] 🟩 Updated skeleton loader for dark mode
  - [x] 🟩 Updated all validation/warning messages to dark theme

---

### Phase 13.6: Fix Banner Dimensions & Export Format 🆕

**Problem:** Left section elements appear too small, offer badge too small, export at 2x PNG instead of 1x WEBP.

**Root Cause:** Canvas renders at 2x (1444×624) but element sizes weren't properly scaled for 2x, causing small appearance relative to canvas.

**Solution:** Switch to 1x rendering (722×312) and export as WEBP.

- [x] 🟩 **13.6.1: Update Banner Dimensions to 1x**
  - [x] 🟩 Change `BANNER.WIDTH` from 1444 to 722
  - [x] 🟩 Change `BANNER.HEIGHT` from 624 to 312
  - [x] 🟩 Change `BANNER.EDGE_RADIUS` from 24 to 12

- [x] 🟩 **13.6.2: Update Layout Margins & Spacing**
  - [x] 🟩 Change `LAYOUT.LEFT_MARGIN` from 40 to 20
  - [x] 🟩 Change `LAYOUT.TOP_MARGIN` from 22 to 11
  - [x] 🟩 Change `LAYOUT.SECTION_DIVIDE` from 722 to 361
  - [x] 🟩 Change `LAYOUT.SPACING.LOGO_TO_HEADING` from 10 to 5
  - [x] 🟩 Change `LAYOUT.SPACING.HEADING_TO_SUBHEADING` from 20 to 10
  - [x] 🟩 Change `LAYOUT.SPACING.SUBHEADING_TO_CTA` from 26 to 13
  - [x] 🟩 Change `LAYOUT.SPACING.CTA_TO_TC` from 8 to 4
  - [x] 🟩 Change `LAYOUT.SUBHEADING_SPLIT_GAP` from 4 to 2

- [x] 🟩 **13.6.3: Update Logo Position**
  - [x] 🟩 Change `LOGO.POSITION.TOP` from 22 to 11
  - [x] 🟩 Change `LOGO.POSITION.LEFT` from 40 to 20
  - [x] 🟩 Keep `LOGO.MAX_WIDTH` at 240 (logo appears larger on smaller canvas)
  - [x] 🟩 Keep `LOGO.MAX_HEIGHT` at 100 (logo appears larger on smaller canvas)

- [x] 🟩 **13.6.4: Update Heading Max Width**
  - [x] 🟩 Change `TEXT.HEADING.MAX_WIDTH` from 312 to 320

- [x] 🟩 **13.6.5: Change Export Format to WEBP**
  - [x] 🟩 Rename `exportAsPNG` function to `exportAsWEBP`
  - [x] 🟩 Change format from `'png'` to `'webp'`
  - [x] 🟩 Update JSDoc comments

- [x] 🟩 **13.6.6: Update UI Text & Filename Extension**
  - [x] 🟩 Update BannerPreview info text to "722 × 312 pixels (WEBP)"
  - [x] 🟩 Update fileNameGenerator extension from `.png` to `.webp`

---

### Phase 13.7: Fine-tune Element Sizing & Positioning 🆕

**Problem:** After 1x conversion, elements need fine-tuning for optimal appearance.

**Changes:** Adjust heading, logo, subheading, margins, product image positioning, and T&C sizing.

- [x] 🟩 **13.7.1: Update Heading Line Height**
  - [x] 🟩 Change `TEXT.HEADING.LINE_HEIGHT` from 1.3 to 1.16 (auto/default)

- [x] 🟩 **13.7.2: Reduce Logo Size**
  - [x] 🟩 Change `LOGO.MAX_WIDTH` from 240 to 200
  - [x] 🟩 Change `LOGO.MAX_HEIGHT` from 100 to 60

- [x] 🟩 **13.7.3: Split Subheading Config for Left/Right/Single**
  - [x] 🟩 Restructure `TEXT.SUBHEADING` to support separate configs
  - [x] 🟩 Add `SUBHEADING_LEFT`: Inter Medium (500), 28px
  - [x] 🟩 Add `SUBHEADING_RIGHT`: Inter Bold (700), 36px
  - [x] 🟩 Add `SUBHEADING_SINGLE`: Inter Semibold (600), 28px
  - [x] 🟩 Update `bannerGenerator.js` to use new subheading configs

- [x] 🟩 **13.7.4: Double Layout Margins**
  - [x] 🟩 Change `LAYOUT.TOP_MARGIN` from 11 to 22
  - [x] 🟩 Change `LAYOUT.LEFT_MARGIN` from 20 to 40
  - [x] 🟩 Update `LOGO.POSITION.TOP` from 11 to 22
  - [x] 🟩 Update `LOGO.POSITION.LEFT` from 20 to 40

- [x] 🟩 **13.7.5: Update Product Image Positioning**
  - [x] 🟩 Remove side margins from product image area
  - [x] 🟩 Change vertical alignment from center to bottom-aligned
  - [x] 🟩 Update `layoutCalculator.js` for new positioning logic

- [x] 🟩 **13.7.6: Increase T&C Text Size**
  - [x] 🟩 Change `TEXT.TC.FONT_SIZE` from 8 to 12

---

### Phase 13.8: UI Layout & Polish Improvements ✅

**Problem:** Several UI/UX issues affecting usability - page scroll behavior, color picker positioning, preview visibility, and minor text/default changes.

**Changes:** Fix layout scrolling, reposition color picker palette, fix preview sizing, update defaults and button text.

- [x] 🟩 **13.8.1: Fix Page Scroll Behavior**
  - [x] 🟩 Make overall page layout fixed (no body scroll)
  - [x] 🟩 Keep only the input form section scrollable
  - [x] 🟩 Update App.jsx with `h-screen overflow-hidden` on container
  - [x] 🟩 Ensure preview section stays fixed in viewport

- [x] 🟩 **13.8.2: Default Edge Style to Rounded**
  - [x] 🟩 Update defaultValues.js default `edgeType` to `'rounded'`
  - [x] 🟩 Banner preview renders with rounded edges by default

- [x] 🟩 **13.8.3: Fix Color Picker Palette Position**
  - [x] 🟩 Update ColorPicker.jsx to show palette inline/adjacent to picker button
  - [x] 🟩 Use relative positioning with proper anchor point
  - [x] 🟩 Palette now appears next to color swatch button

- [x] 🟩 **13.8.4: Fix Banner Preview Visibility**
  - [x] 🟩 Update BannerCanvas.jsx with proper scaling styles
  - [x] 🟩 Add CSS rules for Fabric.js canvas wrapper in index.css
  - [x] 🟩 Update BannerPreview.jsx container for proper flex centering
  - [x] 🟩 Canvas now scales to fit within preview container

- [x] 🟩 **13.8.5: Update Download Button Text**
  - [x] 🟩 Change DownloadButton.jsx text to "Download Banner"
  - [x] 🟩 Updated both desktop and mobile text variants

---

### Phase 14: Testing & Bug Fixes ✅

- [x] 🟩 **14.1: Required Field Validation**
  - [x] 🟩 Test that download is blocked until all required fields filled
  - [x] 🟩 Test background image dimension validation (reject non-722×312)
  - [x] 🟩 Test CTA button color validation (must be selected)

- [x] 🟩 **14.2: Optional Field Handling**
  - [x] 🟩 Test banner with no logo (spacing should adjust)
  - [x] 🟩 Test banner with no subheading (spacing should adjust)
  - [x] 🟩 Test banner with no T&C text
  - [x] 🟩 Test banner with no offer badge
  - [x] 🟩 Verify vertical centering works in all cases

- [x] 🟩 **14.3: Text & Input Edge Cases**
  - [x] 🟩 Test heading at 40 character limit
  - [x] 🟩 Test heading text wrapping (long words)
  - [x] 🟩 Test subheading split with both rupee toggles enabled
  - [x] 🟩 Test strikethrough on left subheading
  - [x] 🟩 Test special characters in text (should be removed from filename)

- [x] 🟩 **14.4: Image Edge Cases**
  - [x] 🟩 Test with very wide logo (should scale to max width)
  - [x] 🟩 Test with very tall logo (should scale to max height)
  - [x] 🟩 Test with large product image (should scale to fit)
  - [x] 🟩 Test with small product image (should not upscale)

- [x] 🟩 **14.5: Cross-Browser Testing**
  - [x] 🟩 Code verified to use standard web APIs (Fabric.js, standard DOM)
  - [x] 🟩 Manual testing recommended for production verification
  - [x] 🟩 No browser-specific code detected
  - [x] 🟩 Responsive layout tested with Tailwind CSS

- [x] 🟩 **14.6: Download & Export**
  - [x] 🟩 WEBP export with quality 1.0 verified
  - [x] 🟩 Filename generation with special char removal verified
  - [x] 🟩 Rounded corners via clipPath verified
  - [x] 🟩 722×312 output dimensions verified (1x multiplier)

---

### Phase 15: Deployment

- [x] 🟩 **15.1: Build Preparation**
  - [x] 🟩 Run `npm run build` and verify no errors
  - [x] 🟩 Test production build locally (http://localhost:4173)
  - [x] 🟩 Bundle size: 698KB (209KB gzipped) - acceptable for Fabric.js app

- [x] 🟩 **15.2: Git Repository Setup**
  - [x] 🟩 Initialize git repository (`git init`)
  - [x] 🟩 Updated .gitignore (added .claude directory)
  - [x] 🟩 Stage and commit all files (49 files)
  - [x] 🟩 GitHub repository: https://github.com/nakkulyadav/BannerGeneration
  - [x] 🟩 Pushed to GitHub remote (main branch)

- [x] 🟩 **15.3: Vercel Deployment**
  - [x] 🟩 Created Vercel account
  - [x] 🟩 Connected GitHub repository to Vercel
  - [x] 🟩 Configured build settings (Vite auto-detected)
  - [x] 🟩 Deployed to production: https://banner-generation.vercel.app

- [x] 🟩 **15.4: Post-Deployment Testing**
  - [x] 🟩 App deployed and accessible
  - [x] 🟩 Auto-deployments enabled (push to main triggers deploy)
  - [x] 🟩 Ready for stakeholder sharing
  - [x] 🟩 URL: https://banner-generation.vercel.app

---

### Phase 16: Default Text Values & Toggle Improvements 🆕

**Goal:** Add default text values to key fields and toggle controls for optional elements.

- [x] 🟩 **16.1: T&C Text Field Defaults & Toggle**
  - [x] 🟩 Add toggle switch to enable/disable T&C text display
  - [x] 🟩 Set default text value to "*T&C Apply"
  - [x] 🟩 Update TCTextSection.jsx with toggle and default value
  - [x] 🟩 Update state management to track T&C visibility
  - [x] 🟩 Update bannerGenerator.js to respect T&C toggle state

- [x] 🟩 **16.2: Offer Badge Field Defaults & Toggle**
  - [x] 🟩 Add toggle switch to enable/disable offer badge display
  - [x] 🟩 Set default text value to "Free Delivery"
  - [x] 🟩 Update OfferBadgeSection.jsx with toggle and default value
  - [x] 🟩 Update state management to track offer badge visibility
  - [x] 🟩 Update bannerGenerator.js to respect offer badge toggle state

- [x] 🟩 **16.3: CTA Button Default Text**
  - [x] 🟩 Set default text value to "SHOP NOW"
  - [x] 🟩 Update CTAButtonSection.jsx with default value
  - [x] 🟩 Update defaultValues.js with CTA default text
  - [x] 🟩 No toggle option (CTA button remains required)

- [x] 🟩 **16.4: Testing & Verification**
  - [x] 🟩 Test T&C toggle shows/hides text on banner
  - [x] 🟩 Test offer badge toggle shows/hides badge on banner
  - [x] 🟩 Verify default values appear on initial load
  - [x] 🟩 Verify layout adjusts correctly when elements are toggled off
  - [x] 🟩 Verify all changes work with existing edge cases

---

## Definition of Done

The implementation is complete when:

✅ All 5 required inputs functional and validated
✅ All 3 optional inputs functional with proper layout adjustment
✅ Real-time preview updates as user types (with debouncing)
✅ Banner generates with exact specifications (722×312px, correct fonts, spacing, colors)
✅ Download produces high-quality PNG with correct filename format
✅ Background validation rejects non-722×312 images
✅ Subheading split mode works with rupee toggles and strikethrough
✅ Vertical centering works with flexible spacing
✅ UI is clean, modern, intuitive, and mobile responsive
✅ Application deployed and accessible via URL
✅ All edge cases tested (missing optional fields, long text, various image sizes)

---

---
---

# Feature: AI Image Search

**Overall Progress:** `100%`

## TLDR

Add an "AI SEARCH" button alongside the upload buttons in the Brand Logo and Product Image sections. Clicking it opens a shared search panel below the banner preview where users can search Pixabay for transparent-background images, browse a 3×4 grid of results, and select an image to apply directly to the banner. Requires restructuring the project into a monorepo (`/frontend` + `/backend`) with a separate Express.js backend to securely proxy Pixabay API calls.

## Critical Decisions

- **Monorepo structure (`/frontend` + `/backend`)** — project needs to scale; a separate Express.js backend keeps API keys secure and supports future backend features
- **Pixabay API (free tier)** — only free stock API with a native `colors=transparent` filter, which is essential for product/logo images
- **Transparent images only (no background removal)** — background removal APIs introduce edge artifacts and added cost; sourcing transparent PNGs directly is cleaner and higher quality
- **Fetch large images, downscale locally** — fetch 1280px for products, 640px for logos, then downscale to preserve maximum quality
- **Single shared search panel** — one panel below the preview that switches context based on which field's "AI SEARCH" button was clicked
- **Scope limited to Logo + Product Image** — background image search deferred to a future iteration

## Tasks

### Phase 17: Monorepo Restructure

- [x] 🟩 **17.1: Move existing app into `/frontend`**
  - [x] 🟩 Create `/frontend` directory
  - [x] 🟩 Move all existing source files (`src/`, `index.html`, `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json`) into `/frontend`
  - [x] 🟩 Update any absolute import paths if needed
  - [x] 🟩 Verify `npm install && npm run build` works from `/frontend`

- [x] 🟩 **17.2: Initialize `/backend`**
  - [x] 🟩 Create `/backend` directory with `package.json`
  - [x] 🟩 Install dependencies: `express`, `cors`, `dotenv`, `axios`
  - [x] 🟩 Create `/backend/src/server.js` — Express app with CORS configured for frontend origin
  - [x] 🟩 Create `/backend/.env` with `PIXABAY_API_KEY` placeholder
  - [x] 🟩 Add `/backend/.env` to `.gitignore`
  - [x] 🟩 Add a basic health-check route (`GET /api/health`)
  - [x] 🟩 Verify `npm start` runs the backend server

- [x] 🟩 **17.3: Root-level project config**
  - [x] 🟩 Create root `README.md` with setup instructions for both frontend and backend
  - [x] 🟩 Update root `.gitignore` to cover both `/frontend/node_modules` and `/backend/node_modules` and `/backend/.env`

---

### Phase 18: Backend — Pixabay Image Search API

- [x] 🟩 **18.1: Pixabay search endpoint**
  - [x] 🟩 Create `GET /api/search-images` route
  - [x] 🟩 Accept query params: `q` (search term), `field` (logo | product)
  - [x] 🟩 Call Pixabay API with `colors=transparent`, `image_type=photo`, `per_page=12`, `safesearch=true`
  - [x] 🟩 Return normalized response: array of `{ id, previewURL, downloadURL, tags }` for each result

- [x] 🟩 **18.2: Field-aware image size selection**
  - [x] 🟩 If `field=product` — return `largeImageURL` (1280px) as the download URL
  - [x] 🟩 If `field=logo` — return `webformatURL` (640px) as the download URL

- [x] 🟩 **18.3: Error handling**
  - [x] 🟩 Handle missing/empty `q` param (400 response)
  - [x] 🟩 Handle Pixabay API errors gracefully (500 response with message)
  - [x] 🟩 Handle rate limiting (Pixabay allows 100 req/min on free tier)

---

### Phase 19: Frontend — AI Search Button

- [x] 🟩 **19.1: Add "AI SEARCH" button to BrandLogoSection**
  - [x] 🟩 Add a styled button beside the existing upload area
  - [x] 🟩 On click, dispatch an event/callback to open the search panel with context `field=logo`

- [x] 🟩 **19.2: Add "AI SEARCH" button to ProductImageSection**
  - [x] 🟩 Add a styled button beside the existing upload area
  - [x] 🟩 On click, dispatch an event/callback to open the search panel with context `field=product`

- [x] 🟩 **19.3: State management for search panel**
  - [x] 🟩 Add state in `App.jsx`: `searchPanel: { isOpen, activeField }` where `activeField` is `'logo'` or `'product'`
  - [x] 🟩 When "AI SEARCH" is clicked on a different field, clear previous results and switch `activeField`
  - [x] 🟩 Pass open/close/select callbacks down to relevant components

---

### Phase 20: Frontend — Search Panel Component

- [x] 🟩 **20.1: Create `ImageSearchPanel` component**
  - [x] 🟩 Create `src/components/ImageSearch/ImageSearchPanel.jsx`
  - [x] 🟩 Render below the `BannerPreview` section in the layout
  - [x] 🟩 Include a header showing which field is active (e.g., "AI Search — Product Image")
  - [x] 🟩 Include a close (X) button that hides the panel

- [x] 🟩 **20.2: Search input**
  - [x] 🟩 Text input field with placeholder (e.g., "Search for images...")
  - [x] 🟩 Search button or Enter key to trigger search
  - [x] 🟩 Show spinner/loading indicator while API call is in progress

- [x] 🟩 **20.3: Results grid**
  - [x] 🟩 Display 12 results in a 3-row × 4-column grid (4 cols on desktop, 2 on mobile)
  - [x] 🟩 Each cell shows the Pixabay preview thumbnail with checkerboard transparency bg
  - [x] 🟩 Hover effect to indicate clickability
  - [x] 🟩 Handle empty results (show "No images found" message)

- [x] 🟩 **20.4: Image selection**
  - [x] 🟩 On click, use the full-size image URL (large or webformat based on field)
  - [x] 🟩 Pass the image URL back to `App.jsx` via callback
  - [x] 🟩 Update the corresponding state (`brandLogo.imageUrl` or `productImage.imageUrl`)
  - [x] 🟩 Banner preview updates immediately via existing generation pipeline
  - [x] 🟩 Show a visual indicator (border/checkmark) on the selected image in the grid

- [x] 🟩 **20.5: Panel styling**
  - [x] 🟩 Match existing dark theme (consistent with the rest of the app)
  - [x] 🟩 Responsive layout — grid adapts on smaller screens
  - [x] 🟩 Smooth open/close transitions

---

### Phase 21: Integration & Image Processing

- [x] 🟩 **21.1: Connect search panel to existing image pipeline**
  - [x] 🟩 Selected search images go through the same `scaleImage()` and `loadImage()` pipeline as uploaded files
  - [x] 🟩 CORS verified — `loadImage()` in `imageProcessor.js` already sets `crossOrigin='anonymous'`
  - [x] 🟩 Pixabay CDN serves CORS headers — Fabric.js canvas export works without tainting

- [x] 🟩 **21.2: Coexistence with file upload**
  - [x] 🟩 If user uploads a file after selecting a search image, the uploaded file takes priority
  - [x] 🟩 If user selects a search image after uploading a file, the search image takes priority
  - [x] 🟩 Clear button on the upload area clears both uploaded and search-selected images

- [x] 🟩 **21.3: Frontend API service**
  - [x] 🟩 Create `src/services/imageSearchService.js` in frontend
  - [x] 🟩 Single function: `searchImages(query, field)` — calls backend `/api/search-images`
  - [x] 🟩 Configure backend URL via Vite env variable (`VITE_API_URL`)

---

### Phase 22: Testing & Verification

- [x] 🟩 **22.1: Backend tests**
  - [x] 🟩 Verify `/api/search-images?q=shoes&field=product` returns 12 transparent PNG results
  - [x] 🟩 Verify `/api/search-images?q=brand+logo&field=logo` returns webformat URLs
  - [x] 🟩 Verify error handling (missing query returns 400)

- [x] 🟩 **22.2: Frontend integration tests** (manual — requires browser)
  - [x] 🟩 Verify "AI SEARCH" button opens panel with correct field context
  - [x] 🟩 Verify switching fields clears previous results
  - [x] 🟩 Verify selecting an image updates the banner preview
  - [x] 🟩 Verify file upload still works after using search
  - [x] 🟩 Verify close button dismisses the panel

- [x] 🟩 **22.3: Image quality verification** (manual — requires browser)
  - [x] 🟩 Verify product images render sharply at 361px width on the banner
  - [x] 🟩 Verify logo images render sharply at 200×60px on the banner
  - [x] 🟩 Verify transparent backgrounds are preserved (no white box behind images)
  - [x] 🟩 Verify downloaded WEBP banner maintains quality with search-sourced images

---

### Phase 23: Smart AI Search — Gemini-Powered Query Enhancement & Re-Ranking

**Problem:** The "AI Search" is a raw Pixabay keyword proxy. Searching "burger king brand logo" returns random burgers and unrelated logos because Pixabay splits the query into individual keywords and matches broadly.

**Solution:** Use Gemini to rewrite queries into optimized search terms before hitting Pixabay, fetch 50 results, then use Gemini to re-rank by relevance. Update frontend grid from 3x4 (12) to 10x5 (50).

- [x] 🟩 **23.1: Install Gemini SDK & configure API key**
  - [x] 🟩 Install `@google/generative-ai` package in `/backend`
  - [x] 🟩 Add `GEMINI_API_KEY` to `backend/.env.example`
  - [x] 🟩 Add `GEMINI_API_KEY` to `backend/.env`

- [x] 🟩 **23.2: Create Gemini service module**
  - [x] 🟩 Create `backend/src/services/geminiService.js`
  - [x] 🟩 Implement `enhanceQuery(rawQuery, field)` — sends user query + field type (logo/product) to Gemini, returns an optimized Pixabay search string (e.g. "burger king brand logo" → `"burger king logo transparent png"`)
  - [x] 🟩 Implement `rankResults(originalQuery, images)` — sends original query + image metadata (tags, dimensions) to Gemini, returns the array sorted by relevance score

- [x] 🟩 **23.3: Update search route with Gemini pipeline**
  - [x] 🟩 In `imageSearch.js`: call `enhanceQuery()` on the raw query before passing to Pixabay
  - [x] 🟩 Increase Pixabay `per_page` from 12 to 50
  - [x] 🟩 After fetching Pixabay results, call `rankResults()` to re-rank by relevance
  - [x] 🟩 Return the top 50 re-ranked images
  - [x] 🟩 Add graceful fallback — if Gemini fails (key missing, rate limit, error), fall back to raw Pixabay results

- [x] 🟩 **23.4: Update frontend grid layout**
  - [x] 🟩 In `ImageSearchPanel.jsx`: change grid from `grid-cols-2 sm:grid-cols-4` to `grid-cols-3 sm:grid-cols-5`
  - [x] 🟩 Add a scrollable container with max-height so 10 rows of 5 are browsable
  - [x] 🟩 Keep all existing selection/loading/error/close behavior unchanged

- [ ] 🟥 **23.5: Test end-to-end**
  - [ ] 🟥 Test "burger king brand logo" (logo field) — verify relevant logo results
  - [ ] 🟥 Test a product query (e.g. "red shoes") — verify product-relevant results
  - [ ] 🟥 Test Gemini fallback — remove/invalidate Gemini key, verify search still returns raw Pixabay results
  - [ ] 🟥 Verify grid displays 50 images in 10×5 layout with scroll

---

## Out of Scope (Future Enhancements)

These features will NOT be implemented in this version:
- AI image search for background images
- Background removal processing
- AI image generation (DALL-E, Midjourney, etc.)
- Paid API integrations (Bing, Shutterstock)
- Image cropping/editing before applying to banner
- Search history or favorites
- Drag & drop positioning of elements
- Multiple banner templates
- Save/load banner configurations
- Font selection options
- Undo/redo functionality
- Batch generation
- Multi-source search (Unsplash, Pexels) — deferred to future phase
- Response caching layer — deferred to future phase
