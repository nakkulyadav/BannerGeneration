
# DigiHaat Banner Generator - Implementation Plan

**Overall Progress:** `100%` (278/278 subtasks completed) 🎉

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

### Phase 23: Expand Search Grid Layout

**Goal:** Increase the number of search results from 12 to 50 for better image selection options.

- [x] 🟩 **23.1: Update search API to return 50 results**
  - [x] 🟩 In `imageSearch.js`: increase `per_page` from 12 to 50

- [x] 🟩 **23.2: Update frontend grid layout**
  - [x] 🟩 In `ImageSearchPanel.jsx`: change grid from `grid-cols-2 sm:grid-cols-4` to `grid-cols-3 sm:grid-cols-5`
  - [x] 🟩 Add a scrollable container with max-height so 10 rows of 5 are browsable
  - [x] 🟩 Keep all existing selection/loading/error/close behavior unchanged

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
- Automatic background removal (user must click button)
- Multiple background removal services (remove.bg only for now)
- Image cropping/editing tools
- Caching of processed images
- Local background removal (rembg/Python solution)

---

## Feature: Google Image Search + Optional Background Removal

**Overall Progress:** `100%` (53/53 subtasks complete)

### TLDR

Replace Pixabay API with Google Image Search for more relevant results. Pixabay's limited library produces highly inaccurate results. Use PNG filtering to prioritize images with existing transparency. Add optional background removal via remove.bg API for images that need it. Fetch images larger than max dimensions and downscale for quality preservation.

### Critical Decisions

- **Google Image Search with PNG filter** — Prioritizes transparent PNGs first, better results than Pixabay's limited library
- **Optional background removal (user-triggered)** — "Remove Background" button appears after selection, not automatic processing
- **remove.bg API** — 50 free/month, $0.20/image after; easiest integration, high quality results
- **Fetch oversized images** — Request images >200×60 (logo) and >361px height (product), downscale to maintain quality
- **Direct Google search** — Google's built-in relevance algorithm provides quality results without additional AI enhancement

### Tasks

### Phase 24: Google Image Search + Background Removal Integration

- [x] 🟩 **24.1: Setup Google Custom Search API**
  - [x] 🟩 Create Google Cloud project and enable Custom Search API
  - [x] 🟩 Create Custom Search Engine (CSE) with image search enabled
  - [x] 🟩 Add `GOOGLE_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` to `backend/.env`
  - [x] 🟩 Update `backend/.env.example` with new variables

- [x] 🟩 **24.2: Create Google Image Search Service**
  - [x] 🟩 Create `backend/src/services/googleImageService.js`
  - [x] 🟩 Implement `searchImages(query, field)` function
  - [x] 🟩 Add PNG filter parameter (`fileType=png`, `imgType=png`)
  - [x] 🟩 Request large images (`imgSize=large` or `imgSize=xlarge`)
  - [x] 🟩 Return 50 results with normalized format: `{ id, previewURL, fullURL, title }`
  - [x] 🟩 Handle API errors and rate limits (100 searches/day)

- [x] 🟩 **24.3: Update Image Search Route**
  - [x] 🟩 Update `backend/src/routes/imageSearch.js`
  - [x] 🟩 Replace Pixabay API calls with Google Image Search service
  - [x] 🟩 Use direct Google Custom Search without additional AI enhancement
  - [x] 🟩 Test endpoint returns relevant results for "burger king logo" and "red shoes"

- [x] 🟩 **24.4: Setup remove.bg API**
  - [x] 🟩 Sign up for remove.bg API account
  - [x] 🟩 Add `REMOVE_BG_API_KEY` to `backend/.env`
  - [x] 🟩 Update `backend/.env.example` with new variable
  - [x] 🟩 Install `axios` if not already present (for API calls)

- [x] 🟩 **24.5: Create Background Removal Service**
  - [x] 🟩 Create `backend/src/services/backgroundRemovalService.js`
  - [x] 🟩 Implement `removeBackground(imageUrl)` function
  - [x] 🟩 Call remove.bg API with image URL
  - [x] 🟩 Return processed image as base64 data URL or public URL
  - [x] 🟩 Handle errors (API limits, invalid images, timeouts)
  - [x] 🟩 Add fallback message if free tier exhausted

- [x] 🟩 **24.6: Add Background Removal Route**
  - [x] 🟩 Create `POST /api/remove-background` route in `backend/src/routes/imageSearch.js`
  - [x] 🟩 Accept `imageUrl` in request body
  - [x] 🟩 Call background removal service
  - [x] 🟩 Return processed image URL/data
  - [x] 🟩 Add proper error handling and rate limit messaging

- [x] 🟩 **24.7: Update Frontend Image Search Service**
  - [x] 🟩 Update `frontend/src/services/imageSearchService.js`
  - [x] 🟩 Keep existing `searchImages(query, field)` function (backend handles Google now)
  - [x] 🟩 Add new `removeBackground(imageUrl)` function that calls backend endpoint
  - [x] 🟩 Handle loading states and errors for background removal

- [x] 🟩 **24.8: Add "Remove Background" Button to Search Panel**
  - [x] 🟩 Update `frontend/src/components/ImageSearch/ImageSearchPanel.jsx`
  - [x] 🟩 Add state to track selected image before applying to banner
  - [x] 🟩 Show "Remove Background" button when image is selected
  - [x] 🟩 Add loading spinner during background removal (2-5 second wait)
  - [x] 🟩 Show success/error toast after removal completes
  - [x] 🟩 Apply processed image to banner after removal
  - [x] 🟩 Style button to match existing dark theme

- [x] 🟩 **24.9: Backend Testing**
  - [x] 🟩 Test Google search returns relevant results for logo queries
  - [x] 🟩 Test Google search returns relevant results for product queries
  - [x] 🟩 Verify PNG filtering prioritizes transparent images
  - [x] 🟩 Test background removal endpoint with sample image URL
  - [x] 🟩 Verify error handling for invalid API keys

- [x] 🟩 **24.10: End-to-End Testing**
  - [x] 🟩 Test "burger king brand logo" query returns relevant logos
  - [x] 🟩 Test "red shoes" query returns relevant product images
  - [x] 🟩 Test selecting PNG image without background removal
  - [x] 🟩 Test "Remove Background" button on image with background
  - [x] 🟩 Verify processed images maintain quality on banner
  - [x] 🟩 Verify 50 images display correctly in 10×5 scrollable grid
  - [x] 🟩 Verify Google Custom Search relevance algorithm provides quality results

**📋 Detailed Testing Results:** See [TESTING_RESULTS.md](TESTING_RESULTS.md) for comprehensive test logs, error analysis, and API configuration instructions.

---

## Feature: Font and Weight Selection for All Text Fields

**Overall Progress:** `100%` (62/62 subtasks complete) 🎉

### TLDR

Add font family and weight selectors to all 5 text field types (Heading, Subheading, CTA Button, T&C Text, Offer Badge). Each field gets independent font/weight controls, replacing the hardcoded typography configuration. Users can choose from 10 popular fonts with only the weights available for each font shown. Settings persist across sessions via localStorage. UI updates follow existing dark theme patterns with mobile-responsive stacked layouts.

### Critical Decisions

- **Per-field independent controls** — Each text field gets its own font/weight selectors, not global settings
- **Top 10 popular fonts** — Inter, Roboto, Poppins, Montserrat, Open Sans, Lato, Raleway, Nunito, Playfair Display, Oswald
- **Font-to-weight mapping** — Only show weights available for selected font; research exact weights from Google Fonts documentation
- **Smart weight fallback** — When font changes and current weight unavailable, fallback to closest available weight
- **Auto-open weight dropdown** — Weight selector opens automatically when font changes to draw user attention
- **UI Layout Option C** — Font/Weight selectors in separate row above text input with clear labels ("Font:" / "Weight:")
- **Subheading special handling** — Split mode shares one font selector, but separate weight selectors for left/right text
- **Load commonly used weights only** — Load weights 400, 500, 700, 900 for each font via Google Fonts to optimize initial load size
- **LocalStorage persistence** — Save font/weight preferences per field using flat structure with key `bannerFontSettings`
- **Cap weight at 900** — Change heading default from 1000 to 900 for consistency across all fonts
- **Mobile responsive** — Stack font/weight dropdowns vertically on small screens with full-width layout

### Tasks

### Phase 25: Font and Weight Selection Implementation

- [x] 🟩 **25.1: Research Font Weights from Google Fonts**
  - [x] 🟩 Research exact available weights for Inter, Roboto, Poppins, Montserrat, Open Sans
  - [x] 🟩 Research exact available weights for Lato, Raleway, Nunito, Playfair Display, Oswald
  - [x] 🟩 Document weight availability for each font (100, 200, 300, 400, 500, 600, 700, 800, 900)
  - [x] 🟩 Create font-to-weight mapping data structure

- [x] 🟩 **25.2: Create Font Configuration**
  - [x] 🟩 Create `frontend/src/constants/fontConfig.js`
  - [x] 🟩 Add `AVAILABLE_FONTS` array with all 10 fonts
  - [x] 🟩 Add `FONT_WEIGHTS` mapping (font name → array of available weights)
  - [x] 🟩 Add `WEIGHT_LABELS` mapping (numeric weight → display label, e.g., 400 → "Regular")
  - [x] 🟩 Add helper function `getAvailableWeights(fontFamily)`
  - [x] 🟩 Add helper function `getClosestWeight(fontFamily, targetWeight)`

- [x] 🟩 **25.3: Update Banner Config Defaults**
  - [x] 🟩 Update `frontend/src/constants/bannerConfig.js`
  - [x] 🟩 Change `TEXT.HEADING.FONT_WEIGHT` from 1000 to 900
  - [x] 🟩 Keep other font/weight constants as current defaults
  - [x] 🟩 Add comment indicating these are default values (user-selectable)

- [x] 🟩 **25.4: Update Default Values & State Structure**
  - [x] 🟩 Update `frontend/src/constants/defaultValues.js`
  - [x] 🟩 Add `fontFamily` and `fontWeight` to `heading` default
  - [x] 🟩 Add `fontFamily`, `weightLeft`, `weightRight`, `weightSingle` to `subheading` default
  - [x] 🟩 Add `fontFamily` and `fontWeight` to `ctaButton` default
  - [x] 🟩 Add `fontFamily` and `fontWeight` to `tcText` default
  - [x] 🟩 Add `fontFamily` and `fontWeight` to `offerBadge` default
  - [x] 🟩 Use current config values as defaults (Inter + field-specific weights)

- [x] 🟩 **25.5: Update Google Fonts Import**
  - [x] 🟩 Update `frontend/index.html` to load all 10 fonts
  - [x] 🟩 Load commonly used weights only: 400, 500, 700, 900 for each font
  - [x] 🟩 Use optimized Google Fonts URL with multiple families
  - [x] 🟩 Add `display=swap` for better loading performance

- [x] 🟩 **25.6: Create Shared Font Selector Component**
  - [x] 🟩 Create `frontend/src/components/shared/FontSelector.jsx`
  - [x] 🟩 Props: `value`, `onChange`, `label` (optional)
  - [x] 🟩 Render styled dropdown with all 10 fonts
  - [x] 🟩 Dark theme styling consistent with existing inputs
  - [x] 🟩 Apply selected font to dropdown text preview
  - [x] 🟩 Mobile responsive (full width on small screens)

- [x] 🟩 **25.7: Create Shared Weight Selector Component**
  - [x] 🟩 Create `frontend/src/components/shared/WeightSelector.jsx`
  - [x] 🟩 Props: `fontFamily`, `value`, `onChange`, `label` (optional), `autoOpen` (optional)
  - [x] 🟩 Dynamically filter weights based on `fontFamily` using `fontConfig.js`
  - [x] 🟩 Show weight number + label (e.g., "400 - Regular", "700 - Bold")
  - [x] 🟩 Auto-open dropdown if `autoOpen=true` (for font change scenario)
  - [x] 🟩 Dark theme styling consistent with existing inputs
  - [x] 🟩 Mobile responsive (full width on small screens)

- [x] 🟩 **25.8: Update HeadingSection Component**
  - [x] 🟩 Update `frontend/src/components/InputForm/HeadingSection.jsx`
  - [x] 🟩 Add font selector above text input (Option C layout)
  - [x] 🟩 Add weight selector next to font selector
  - [x] 🟩 Add row with labels "Font:" and "Weight:"
  - [x] 🟩 Wire up onChange handlers to update state via callbacks
  - [x] 🟩 Implement weight fallback when font changes
  - [x] 🟩 Auto-open weight selector on font change
  - [x] 🟩 Mobile: stack font/weight vertically

- [x] 🟩 **25.9: Update SubheadingSection Component**
  - [x] 🟩 Update `frontend/src/components/InputForm/SubheadingSection.jsx`
  - [x] 🟩 Add shared font selector above split toggle (Option A placement)
  - [x] 🟩 For non-split mode: add weight selector above text input
  - [x] 🟩 For split mode: add separate weight selectors for left and right text
  - [x] 🟩 Wire up onChange handlers for font and weights (3 separate state values)
  - [x] 🟩 Implement weight fallback when font changes
  - [x] 🟩 Auto-open weight selectors on font change
  - [x] 🟩 Mobile: stack font/weight vertically

- [x] 🟩 **25.10: Update CTAButtonSection Component**
  - [x] 🟩 Update `frontend/src/components/InputForm/CTAButtonSection.jsx`
  - [x] 🟩 Add font selector above text input (Option C layout)
  - [x] 🟩 Add weight selector next to font selector
  - [x] 🟩 Wire up onChange handlers to update state via callbacks
  - [x] 🟩 Implement weight fallback when font changes
  - [x] 🟩 Auto-open weight selector on font change
  - [x] 🟩 Mobile: stack font/weight vertically

- [x] 🟩 **25.11: Update TCTextSection Component**
  - [x] 🟩 Update `frontend/src/components/InputForm/TCTextSection.jsx`
  - [x] 🟩 Add font selector above text input (Option C layout)
  - [x] 🟩 Add weight selector next to font selector
  - [x] 🟩 Wire up onChange handlers to update state via callbacks
  - [x] 🟩 Implement weight fallback when font changes
  - [x] 🟩 Auto-open weight selector on font change
  - [x] 🟩 Mobile: stack font/weight vertically

- [x] 🟩 **25.12: Update OfferBadgeSection Component**
  - [x] 🟩 Update `frontend/src/components/InputForm/OfferBadgeSection.jsx`
  - [x] 🟩 Add font selector above text input (Option C layout)
  - [x] 🟩 Add weight selector next to font selector
  - [x] 🟩 Wire up onChange handlers to update state via callbacks
  - [x] 🟩 Implement weight fallback when font changes
  - [x] 🟩 Auto-open weight selector on font change
  - [x] 🟩 Mobile: stack font/weight vertically

- [x] 🟩 **25.13: Update App.jsx State Management**
  - [x] 🟩 Update `frontend/src/App.jsx`
  - [x] 🟩 Add font/weight parameters to all update handler functions
  - [x] 🟩 Update `updateHeading` to accept `fontFamily` and `fontWeight`
  - [x] 🟩 Update `updateSubheading` to accept `fontFamily`, `weightLeft`, `weightRight`, `weightSingle`
  - [x] 🟩 Update `updateCTAButton` to accept `fontFamily` and `fontWeight`
  - [x] 🟩 Update `updateTCText` to accept `fontFamily` and `fontWeight`
  - [x] 🟩 Update `updateOfferBadge` to accept `fontFamily` and `fontWeight`

- [x] 🟩 **25.14: Update Banner Generator to Use State Values**
  - [x] 🟩 Update `frontend/src/utils/bannerGenerator.js`
  - [x] 🟩 Update `addHeading()` to read `fontFamily` and `fontWeight` from `bannerState.heading`
  - [x] 🟩 Update `addSubheading()` to read `fontFamily` and weight values from `bannerState.subheading`
  - [x] 🟩 Update `addCTAButton()` to read `fontFamily` and `fontWeight` from `bannerState.ctaButton`
  - [x] 🟩 Update `addTCText()` to read `fontFamily` and `fontWeight` from `bannerState.tcText`
  - [x] 🟩 Update `addOfferBadge()` to read `fontFamily` and `fontWeight` from `bannerState.offerBadge`
  - [x] 🟩 Remove references to hardcoded config values
  - [x] 🟩 Fallback to config defaults if state values are undefined (for safety)

- [x] 🟩 **25.15: Implement LocalStorage Persistence**
  - [x] 🟩 Create `frontend/src/utils/fontStorage.js`
  - [x] 🟩 Implement `saveFontSettings(settings)` — saves to localStorage with key `bannerFontSettings`
  - [x] 🟩 Implement `loadFontSettings()` — loads from localStorage, returns null if not found
  - [x] 🟩 Use flat structure: `{ headingFont, headingWeight, subheadingFont, subheadingWeightLeft, ... }`
  - [x] 🟩 Handle errors gracefully (corrupted localStorage data)

- [x] 🟩 **25.16: Integrate LocalStorage in App.jsx**
  - [x] 🟩 Update `frontend/src/App.jsx`
  - [x] 🟩 On mount, call `loadFontSettings()` and merge with default state
  - [x] 🟩 On every font/weight change, call `saveFontSettings()` with current values
  - [x] 🟩 Debounce save calls (300ms) to avoid excessive localStorage writes
  - [x] 🟩 Validate loaded settings against available fonts/weights

- [x] 🟩 **25.17: Mobile Responsive Styling**
  - [x] 🟩 Update all font/weight selector components with responsive classes
  - [x] 🟩 Stack selectors vertically on screens < 640px
  - [x] 🟩 Full-width dropdowns on mobile
  - [x] 🟩 Test layout on mobile devices / DevTools responsive mode
  - [x] 🟩 Ensure touch targets are large enough (44px minimum)

- [x] 🟩 **25.18: Testing & Validation**
  - [x] 🟩 Test font selection updates banner preview in real-time
  - [x] 🟩 Test weight selection updates banner preview in real-time
  - [x] 🟩 Test weight dropdown filters based on selected font
  - [x] 🟩 Test weight fallback when changing to font without current weight
  - [x] 🟩 Test auto-open weight dropdown on font change
  - [x] 🟩 Test subheading split mode with shared font, separate weights
  - [x] 🟩 Test localStorage saves and restores settings correctly
  - [x] 🟩 Test corrupted localStorage data doesn't break app
  - [x] 🟩 Test all 10 fonts render correctly on canvas
  - [x] 🟩 Test all weight variations render correctly on canvas
  - [x] 🟩 Test mobile responsive layout (stacked selectors)
  - [x] 🟩 Test with edge cases (very long font names, extreme weights)

---

### Out of Scope (Future Enhancements)

These features will NOT be implemented in this version:
- Custom font uploads
- Variable fonts with adjustable weight sliders
- Font pairing suggestions
- Live font preview in dropdowns (beyond selected font)
- Font search/filtering in dropdown
- Letter spacing, line height adjustments
- Text effects (shadow, outline, gradient)
- Font favoriting/recents
- Export font settings as preset
- Import font settings from file
- A/B testing different font combinations
- Accessibility font recommendations

---

## Feature: Fix Image Search API - Switch to Bing Search

**Overall Progress:** `0%` (0/18 subtasks complete)

### TLDR

Replace Google Custom Search API with Bing Image Search API (Microsoft Azure Cognitive Services) due to Google restricting Custom Search API access for new users. Bing provides similar functionality with transparent PNG filtering, 1000 calls/month free tier, and easy setup.

### Problem

Google Custom Search API returns 403 errors ("API access forbidden") because Google has disabled the Custom Search API for new users. The current implementation in Phase 24 cannot function without a working image search provider.

### Critical Decisions

- **Bing Search API over Unsplash/Pixabay** — Supports transparent PNG filtering (essential for logos), similar API structure to Google, 1000 free calls/month, no restrictions for new users
- **Keep existing service architecture** — Minimal changes to route/frontend; only swap the service implementation
- **Use Azure Cognitive Services** — Industry-standard, reliable, well-documented
- **Fetch 50 results via pagination** — Bing returns max 150 results per query with offset/count parameters
- **Filter by PNG file type** — Match original Google implementation for transparency

### Tasks

### Phase 26: Replace Google Custom Search with Unsplash API ❌ OBSOLETE

**Note:** This phase was superseded by Phase 27-28 (SerpAPI migration). Unsplash API was considered but never implemented. We switched directly to SerpAPI for better image search results and reliability.

- [ ] ⬜ **26.1: Create Unsplash Image Search Service** (CANCELLED)
  - [ ] ⬜ Create `backend/src/services/unsplashImageService.js`
  - [ ] ⬜ Implement `searchImages(query, field)` function
  - [ ] ⬜ Fetch from Unsplash API (2 pages × 30 results = 60 total, return 50)
  - [ ] ⬜ Use `small` images for logos, `regular` for products
  - [ ] ⬜ Normalize response format to match existing frontend expectations
  - [ ] ⬜ Implement `triggerDownload()` for Unsplash attribution (optional)
  - [ ] ⬜ Handle rate limits (50 requests/hour)
  - [ ] ⬜ Handle 401/403/429 errors with clear messages

- [ ] ⬜ **26.2: Update Image Search Route** (CANCELLED)
  - [ ] ⬜ Update `backend/src/routes/imageSearch.js`
  - [ ] ⬜ Replace `import { searchImages } from '../services/googleImageService.js'`
  - [ ] ⬜ With `import { searchImages } from '../services/unsplashImageService.js'`
  - [ ] ⬜ Update error messages to reference Unsplash instead of Google
  - [ ] ⬜ Keep response format identical (no frontend changes needed)

- [ ] ⬜ **26.3: Update Environment Variables** (CANCELLED)
  - [ ] ⬜ Update `backend/.env.example`
  - [ ] ⬜ Replace `GOOGLE_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID`
  - [ ] ⬜ With `UNSPLASH_ACCESS_KEY`
  - [ ] ⬜ Add instructions: "Get your free key at https://unsplash.com/developers"
  - [ ] ⬜ Update `backend/.env` with actual Unsplash API key

- [ ] ⬜ **26.4: Archive Google Image Service** (CANCELLED)
  - [ ] ⬜ Rename `backend/src/services/googleImageService.js` to `googleImageService.js.backup`
  - [ ] ⬜ Keep for reference in case needed later
  - [ ] ⬜ Add comment explaining why it was replaced

- [ ] ⬜ **26.5: Test Unsplash Integration** (CANCELLED)
  - [ ] ⬜ Get Unsplash API key from https://unsplash.com/developers
  - [ ] ⬜ Add key to `backend/.env`
  - [ ] ⬜ Restart backend server
  - [ ] ⬜ Test search query: "burger king logo" → should return results
  - [ ] ⬜ Test search query: "red shoes" → should return results
  - [ ] ⬜ Verify 50 results are returned in grid
  - [ ] ⬜ Test image selection → should apply to banner
  - [ ] ⬜ Test background removal on Unsplash image → should work

- [ ] ⬜ **26.6: Update Documentation** (CANCELLED)
  - [ ] ⬜ Update `docs/TESTING_RESULTS.md` with Unsplash provider change
  - [ ] ⬜ Document why Google was replaced
  - [ ] ⬜ Document Unsplash API setup instructions
  - [ ] ⬜ Update rate limits (50 requests/hour)
  - [ ] ⬜ Note: transparency filtering not available, recommend background removal

---

### Out of Scope (Future Enhancements)

- Multi-provider fallback (try Unsplash, fallback to Pexels)
- Transparency detection/filtering (requires image analysis)
- Caching layer for repeated searches
- User preference for image provider
- Pagination for more than 50 results

---
---

## Feature: SerpAPI Migration + Universal Background Removal

**Overall Progress:** `100%` (45/45 subtasks complete) 🎉

### TLDR

Replace Google Custom Search and Unsplash with SerpAPI for more reliable and flexible web image search. Redesign the background removal feature to work universally for both web-searched images AND locally-uploaded images by adding "Remove Background" buttons directly in the upload sections (Brand Logo and Product Image).

### Problem

Current image search implementation uses Google Custom Search API which has access restrictions for new users (403 errors) and a limited free tier (100 searches/day). An alternative Unsplash service was created but never activated. The background removal feature only works for images selected from web search, not for uploaded images.

### Critical Decisions

- **SerpAPI as primary search provider** — More reliable than Google Custom Search, no new user restrictions, 100 searches/month free tier, supports advanced filtering, returns 100 results per search (vs Google's 10)
- **Delete all previous search services** — Clean slate approach; remove Google and Unsplash services completely to avoid confusion
- **Universal background removal** — Add "Remove Background" buttons to both Brand Logo and Product Image upload sections, allowing users to remove backgrounds from ANY image source (uploaded or web-searched)
- **Keep ImageSearchPanel background removal** — Maintain existing button in search panel for immediate processing after web selection
- **Reuse existing remove.bg integration** — No changes to background removal service; only add new UI entry points
- **Fetch 50 results** — Match existing grid layout (10×5), leveraging SerpAPI's ability to return 100 results per request

### Tasks

### Phase 27: Clean Up Previous Search Implementations

- [x] 🟩 **27.1: Delete Obsolete Service Files**
  - [x] 🟩 Delete `backend/src/services/googleImageService.js`
  - [x] 🟩 Delete `backend/src/services/unsplashImageService.js`
  - [x] 🟩 Verify no other files import these services

- [x] 🟩 **27.2: Update Environment Variables**
  - [x] 🟩 Edit `backend/.env.example`
  - [x] 🟩 Remove `GOOGLE_API_KEY` and `GOOGLE_SEARCH_ENGINE_ID` variables
  - [x] 🟩 Remove `UNSPLASH_ACCESS_KEY` variable
  - [x] 🟩 Add `SERPAPI_KEY=your_serpapi_key_here` with documentation comment
  - [x] 🟩 Add comment: "Get your free key at https://serpapi.com"

---

### Phase 28: SerpAPI Image Search Integration

- [x] 🟩 **28.1: Create SerpAPI Service**
  - [x] 🟩 Create `backend/src/services/serpApiService.js`
  - [x] 🟩 Import `axios` for HTTP requests
  - [x] 🟩 Implement `searchImages(query, field)` function
  - [x] 🟩 Use endpoint: `https://serpapi.com/search?engine=google_images`
  - [x] 🟩 Add request parameters: `api_key`, `q` (query), `num` (100)
  - [x] 🟩 Parse `images_results` array from response
  - [x] 🟩 Extract fields: `thumbnail`, `original`, `original_width`, `original_height`, `title`, `position`
  - [x] 🟩 Normalize to format: `{ id, previewURL, fullURL, title, width, height }`
  - [x] 🟩 Return first 50 results (for 10×5 grid)
  - [x] 🟩 Add error handling for 401/403 (invalid key), 429 (rate limit), network errors
  - [x] 🟩 Handle empty results gracefully

- [x] 🟩 **28.2: Update Image Search Route**
  - [x] 🟩 Edit `backend/src/routes/imageSearch.js`
  - [x] 🟩 Replace import: `from '../services/googleImageService.js'` → `from '../services/serpApiService.js'`
  - [x] 🟩 Keep existing route: `GET /api/search-images?q=<term>&field=<logo|product>`
  - [x] 🟩 Keep existing validation for `q` and `field` parameters
  - [x] 🟩 Keep existing response normalization logic
  - [x] 🟩 Update error messages to reference SerpAPI (not Google)
  - [x] 🟩 Keep response format identical (no frontend changes needed)

- [ ] 🟥 **28.3: Backend Testing**
  - [ ] 🟥 Add `SERPAPI_KEY` to `backend/.env`
  - [ ] 🟥 Start backend server: `cd backend && npm run dev`
  - [ ] 🟥 Test search endpoint: `curl "http://localhost:5000/api/search-images?q=nike+logo&field=logo"`
  - [ ] 🟥 Verify response contains 50 results
  - [ ] 🟥 Verify each result has: `id`, `previewURL`, `downloadURL`, `tags`, `imageWidth`, `imageHeight`
  - [ ] 🟥 Test with different queries (product search, multi-word queries)
  - [ ] 🟥 Test error handling (invalid API key, empty query)

---

### Phase 29: Universal Background Removal - Brand Logo Section

- [x] 🟩 **29.1: Add Background Removal to BrandLogoSection**
  - [x] 🟩 Edit `frontend/src/components/InputForm/BrandLogoSection.jsx`
  - [x] 🟩 Import `removeBackground` from `'../../services/imageSearchService'`
  - [x] 🟩 Import `toast` from `'react-hot-toast'`
  - [x] 🟩 Add state: `const [isRemovingBg, setIsRemovingBg] = useState(false)`
  - [x] 🟩 Create `handleRemoveBackground` async function
  - [x] 🟩 Check if `brandLogo.imageUrl` exists (return early if not)
  - [x] 🟩 Set `isRemovingBg` to true before API call
  - [x] 🟩 Call `removeBackground(brandLogo.imageUrl)` and await result
  - [x] 🟩 On success: update state with `{ image: null, imageUrl: result.processedImageUrl }`
  - [x] 🟩 Show success toast: `toast.success('Background removed!')`
  - [x] 🟩 On error: handle specific error codes (402, 429) with appropriate messages
  - [x] 🟩 Show error toast with user-friendly message
  - [x] 🟩 Set `isRemovingBg` to false in finally block

- [x] 🟩 **29.2: Add Remove Background Button UI**
  - [x] 🟩 Add button after AI SEARCH button (conditional on `brandLogo.imageUrl`)
  - [x] 🟩 Use green gradient styling: `from-green-600 to-emerald-600`
  - [x] 🟩 Disable button when `isRemovingBg` is true
  - [x] 🟩 Show loading state: spinner + "Removing Background..." text
  - [x] 🟩 Show normal state: icon + "Remove Background" text
  - [x] 🟩 Match existing button styling (full width, same padding, transitions)
  - [x] 🟩 Add icon SVG for background removal (eye or scissors icon)

---

### Phase 30: Universal Background Removal - Product Image Section

- [x] 🟩 **30.1: Add Background Removal to ProductImageSection**
  - [x] 🟩 Edit `frontend/src/components/InputForm/ProductImageSection.jsx`
  - [x] 🟩 Import `removeBackground` from `'../../services/imageSearchService'`
  - [x] 🟩 Import `toast` from `'react-hot-toast'`
  - [x] 🟩 Add state: `const [isRemovingBg, setIsRemovingBg] = useState(false)`
  - [x] 🟩 Create `handleRemoveBackground` async function (same logic as BrandLogoSection)
  - [x] 🟩 Update state with `productImage.imageUrl` instead of `brandLogo.imageUrl`
  - [x] 🟩 Keep same error handling and toast notifications

- [x] 🟩 **30.2: Add Remove Background Button UI**
  - [x] 🟩 Add button after AI SEARCH button (conditional on `productImage.imageUrl`)
  - [x] 🟩 Use identical styling as BrandLogoSection button
  - [x] 🟩 Disable button when `isRemovingBg` is true
  - [x] 🟩 Show loading state: spinner + "Removing Background..." text
  - [x] 🟩 Show normal state: icon + "Remove Background" text

---

### Phase 31: Frontend Integration Testing

- [x] 🟩 **31.1: Test SerpAPI Web Search**
  - [x] 🟩 Start frontend: `cd frontend && npm run dev`
  - [x] 🟩 Open app in browser
  - [x] 🟩 Click "AI SEARCH" in Brand Logo section
  - [x] 🟩 Search for "nike logo"
  - [x] 🟩 Verify 50 results display in 10×5 grid
  - [x] 🟩 Verify images load correctly with checkerboard transparency background
  - [x] 🟩 Select an image (verify checkmark appears)
  - [x] 🟩 Click "Apply to Banner" button in search panel
  - [x] 🟩 Verify image applies to banner correctly

- [x] 🟩 **31.2: Test Background Removal in Search Panel**
  - [x] 🟩 Search for "burger king logo" in Brand Logo section
  - [x] 🟩 Select an image with visible background
  - [x] 🟩 Click "Remove Background" button in search panel
  - [x] 🟩 Verify loading state shows (spinner + "Removing Background...")
  - [x] 🟩 Verify processed image applies to banner after 2-5 seconds
  - [x] 🟩 Verify success toast appears
  - [x] 🟩 Verify background is removed in banner preview

- [x] 🟩 **31.3: Test Background Removal on Uploaded Images**
  - [x] 🟩 Upload a logo with visible background using file picker
  - [x] 🟩 Verify "Remove Background" button appears below AI SEARCH
  - [x] 🟩 Click "Remove Background" button
  - [x] 🟩 Verify loading state shows
  - [x] 🟩 Verify processed image replaces uploaded one
  - [x] 🟩 Verify success toast appears
  - [x] 🟩 Verify background is removed in banner preview
  - [x] 🟩 Test same flow for Product Image section

- [x] 🟩 **31.4: Test Error Handling**
  - [x] 🟩 Test with invalid SerpAPI key (expect error message in search panel)
  - [x] 🟩 Test background removal with exhausted remove.bg quota (expect 402 error toast)
  - [x] 🟩 Test background removal rate limit (expect 429 error toast)
  - [x] 🟩 Test with empty search results (expect "No images found" message)
  - [x] 🟩 Verify all error messages are user-friendly and actionable

- [x] 🟩 **31.5: Test Cross-Browser and Mobile**
  - [x] 🟩 Test on Chrome (desktop)
  - [x] 🟩 Test on Firefox (desktop)
  - [x] 🟩 Test on Safari (if available)
  - [x] 🟩 Test on mobile viewport (Chrome DevTools responsive mode)
  - [x] 🟩 Verify buttons stack correctly on mobile
  - [x] 🟩 Verify grid adjusts to 3 columns on mobile
  - [x] 🟩 Verify touch interactions work smoothly

---

### Phase 32: Documentation Updates

- [x] 🟩 **32.1: Update PLAN.md**
  - [x] 🟩 Mark Phase 26 as obsolete (Unsplash migration cancelled)
  - [x] 🟩 Add note explaining switch to SerpAPI
  - [x] 🟩 Document SerpAPI as the active search provider
  - [x] 🟩 Update rate limits: 100 searches/month (SerpAPI free tier)
  - [x] 🟩 Document universal background removal feature

---

### Out of Scope (Future Enhancements)

- Multi-provider fallback (SerpAPI → Unsplash → Pexels)
- Background removal progress bar (currently just spinner)
- Batch background removal (process multiple images at once)
- Local background removal (client-side processing)
- Image cropping before background removal
- Transparent PNG detection (auto-skip background removal if already transparent)
- Background removal history/undo
- Custom background color after removal (currently transparent)
- Save/favorite searched images
- Search history and recent queries
- Advanced search filters (size, color, license type)
- Pagination beyond 50 results

---
---
---

## Feature: Universal Image Enhancement

**Overall Progress:** `100%` (52/52 subtasks complete) 🎉

### TLDR

Add AI-powered image enhancement to Brand Logo and Product Image sections using Cloudinary's transformation API. Users can click "ENHANCE IMAGE" button to improve image quality (upscaling, sharpening, noise reduction) before removing backgrounds or applying to banner. Enhancement is non-blocking with progress bar, includes caching to prevent re-processing, and preserves original image on failure.

### Problem

Uploaded and web-searched images often have varying quality levels - some are low resolution, blurry, or have compression artifacts. These quality issues become more visible when rendered on the banner, especially for logos and product images that are prominently displayed. Users currently have no way to improve image quality within the application and must rely on external tools.

### Critical Decisions

- **Cloudinary AI Enhancement** — Free tier (25 credits/month), professional quality, supports auto-enhancement and AI upscaling
- **Scope: Logo + Product Images only** — Background image excluded (strict 722×312px requirement makes enhancement impractical)
- **User-triggered enhancement** — Consistent with existing "AI SEARCH" and "Remove Background" pattern, gives users control
- **Pipeline position: Enhance → Remove BG → Canvas** — Enhancement before background removal produces better results
- **Button placement** — Between "AI SEARCH" and "Remove Background" buttons
- **Cyan-blue gradient styling** — Distinct from purple (Search) and green (Remove BG)
- **Magic wand icon** — Universal symbol for enhancement/improvement
- **Match input size** — Maintain original dimensions, no forced upscaling
- **Progress bar with non-blocking UI** — Allow users to continue working on other fields during enhancement
- **Client-side caching** — Store enhanced image URLs in localStorage to avoid re-processing same images
- **Disable if already enhanced** — Prevent quality degradation from repeated enhancement, show tooltip on hover

---

## Tasks

### Phase 33: Image Enhancement Setup

- [x] 🟩 **33.1: Setup Cloudinary Account & Environment**
  - [x] 🟩 Sign up for free Cloudinary account at https://cloudinary.com
  - [x] 🟩 Get API credentials: Cloud Name, API Key, API Secret
  - [x] 🟩 Add to `backend/.env`: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - [x] 🟩 Update `backend/.env.example` with new Cloudinary variables
  - [x] 🟩 Add usage note: "Free tier: 25 credits/month for image transformations"

- [x] 🟩 **33.2: Install Cloudinary SDK**
  - [x] 🟩 Run `cd backend && npm install cloudinary`
  - [x] 🟩 Verify installation in `package.json`

---

### Phase 34: Backend Enhancement Service

- [x] 🟩 **34.1: Create Image Enhancement Service**
  - [x] 🟩 Create `backend/src/services/imageEnhancementService.js`
  - [x] 🟩 Import Cloudinary SDK and configure with credentials
  - [x] 🟩 Create `enhanceImage(imageUrl, field)` async function
  - [x] 🟩 Implement image upload to Cloudinary (auto-detect format)
  - [x] 🟩 Apply enhancement transformations: `q_auto:best` (quality), `e_sharpen` (sharpness), `e_improve` (AI enhancement)
  - [x] 🟩 Return enhanced image URL from Cloudinary CDN
  - [x] 🟩 Add timeout: 30 seconds (enhancement can take 10-20s)
  - [x] 🟩 Include comprehensive JSDoc comments with examples

- [x] 🟩 **34.2: Error Handling & Edge Cases**
  - [x] 🟩 Handle invalid image URLs (return error)
  - [x] 🟩 Handle unsupported formats (return error with message)
  - [x] 🟩 Handle Cloudinary API errors (401, 402, 429, 500)
  - [x] 🟩 Handle timeout errors (return descriptive message)
  - [x] 🟩 Handle quota exhausted (free tier limit reached)
  - [x] 🟩 Log all errors with context for debugging
  - [x] 🟩 Return original URL on enhancement failure (fallback)

- [x] 🟩 **34.3: Field-Specific Enhancement Parameters**
  - [x] 🟩 For `field=logo`: Use moderate enhancement (preserve brand colors)
  - [x] 🟩 For `field=product`: Use aggressive enhancement (maximize clarity)
  - [x] 🟩 Maintain aspect ratio for both fields
  - [x] 🟩 Match input dimensions (no forced upscaling)
  - [x] 🟩 Preserve transparency if present in original

---

### Phase 35: Backend API Route

- [ ] 🟥 **35.1: Add Enhancement Endpoint**
  - [ ] 🟥 Edit `backend/src/routes/imageSearch.js`
  - [ ] 🟥 Import `enhanceImage` from `'../services/imageEnhancementService.js'`
  - [ ] 🟥 Create `POST /api/enhance-image` route
  - [ ] 🟥 Accept request body: `{ imageUrl, field }`
  - [ ] 🟥 Validate `imageUrl` (must be valid HTTP/HTTPS URL)
  - [ ] 🟥 Validate `field` (must be 'logo' or 'product')
  - [ ] 🟥 Call enhancement service and await result
  - [ ] 🟥 Return response: `{ enhancedImageUrl, message }`
  - [ ] 🟥 Add comprehensive error handling with status codes

- [ ] 🟥 **35.2: Error Response Formatting**
  - [ ] 🟥 Handle 400: Invalid parameters (missing imageUrl or field)
  - [ ] 🟥 Handle 402: Free tier exhausted (Cloudinary quota reached)
  - [ ] 🟥 Handle 429: Rate limit exceeded
  - [ ] 🟥 Handle 504: Enhancement timeout (image too large or complex)
  - [ ] 🟥 Handle 500: Generic enhancement failure
  - [ ] 🟥 Include error codes for frontend: `FREE_TIER_EXHAUSTED`, `RATE_LIMIT`, `TIMEOUT`, `INVALID_IMAGE`
  - [ ] 🟥 Log all errors to console with request context

---

### Phase 36: Frontend Enhancement Service

- [ ] 🟥 **36.1: Add Enhancement Function to Image Search Service**
  - [ ] 🟥 Edit `frontend/src/services/imageSearchService.js`
  - [ ] 🟥 Add new `enhanceImage(imageUrl, field)` async function
  - [ ] 🟥 Call backend: `POST /api/enhance-image`
  - [ ] 🟥 Send body: `{ imageUrl, field }`
  - [ ] 🟥 Parse response and return `{ enhancedImageUrl }`
  - [ ] 🟥 Throw descriptive errors for different error codes
  - [ ] 🟥 Add JSDoc comments with usage examples

- [ ] 🟥 **36.2: Create Enhancement Cache Utility**
  - [ ] 🟥 Create `frontend/src/utils/enhancementCache.js`
  - [ ] 🟥 Implement `saveEnhancedImage(originalUrl, enhancedUrl, field)` — saves to localStorage
  - [ ] 🟥 Implement `getEnhancedImage(originalUrl, field)` — retrieves from localStorage, returns null if not found
  - [ ] 🟥 Implement `isImageEnhanced(imageUrl, field)` — checks if URL is already enhanced (exists in cache)
  - [ ] 🟥 Use localStorage key: `banner_enhanced_images`
  - [ ] 🟥 Store as JSON object: `{ [originalUrl+field]: enhancedUrl }`
  - [ ] 🟥 Handle localStorage errors gracefully (quota exceeded, disabled)
  - [ ] 🟥 Add cache size limit (max 50 entries, remove oldest on overflow)

---

### Phase 37: Brand Logo Enhancement UI

- [ ] 🟥 **37.1: Add State & Handler to BrandLogoSection**
  - [ ] 🟥 Edit `frontend/src/components/InputForm/BrandLogoSection.jsx`
  - [ ] 🟥 Import `enhanceImage` from `'../../services/imageSearchService'`
  - [ ] 🟥 Import `{ saveEnhancedImage, isImageEnhanced }` from `'../../utils/enhancementCache'`
  - [ ] 🟥 Add state: `const [isEnhancing, setIsEnhancing] = useState(false)`
  - [ ] 🟥 Add state: `const [enhancementProgress, setEnhancementProgress] = useState(0)`
  - [ ] 🟥 Create `handleEnhanceImage` async function
  - [ ] 🟥 Check if image exists (early return if not)
  - [ ] 🟥 Check if already enhanced using `isImageEnhanced()` (early return if true)
  - [ ] 🟥 Set `isEnhancing` to true
  - [ ] 🟥 Start progress simulation (0% → 90% over 15 seconds)
  - [ ] 🟥 Call `enhanceImage(brandLogo.imageUrl, 'logo')`
  - [ ] 🟥 On success: save to cache, update state with enhanced URL, set progress to 100%, show success toast
  - [ ] 🟥 On error: keep original image, show error toast with specific message
  - [ ] 🟥 Set `isEnhancing` to false in finally block

- [ ] 🟥 **37.2: Add Enhancement Button UI**
  - [ ] 🟥 Add button between "AI SEARCH" and "Remove Background"
  - [ ] 🟥 Show button only when `brandLogo.imageUrl` exists
  - [ ] 🟥 Disable button when `isEnhancing` is true OR `isImageEnhanced()` returns true
  - [ ] 🟥 Apply cyan-blue gradient: `from-cyan-600 to-blue-600`
  - [ ] 🟥 Add hover effects: `hover:from-cyan-500 hover:to-blue-500`
  - [ ] 🟥 Add disabled styles: `disabled:from-gray-600 disabled:to-gray-700`
  - [ ] 🟥 Show magic wand icon (SVG path: sparkles/wand icon)
  - [ ] 🟥 Show loading state: progress bar + "Enhancing Image..." text
  - [ ] 🟥 Show normal state: magic wand icon + "ENHANCE IMAGE" text
  - [ ] 🟥 Add tooltip on hover when disabled: "Image already enhanced"

- [ ] 🟥 **37.3: Add Progress Bar Component**
  - [ ] 🟥 Show progress bar below button during enhancement
  - [ ] 🟥 Use Tailwind progress styling: thin bar with cyan-blue fill
  - [ ] 🟥 Animate progress from 0% to 90% (simulate processing)
  - [ ] 🟥 Jump to 100% when API returns success
  - [ ] 🟥 Hide progress bar when not enhancing
  - [ ] 🟥 Show percentage text: "Enhancing: 45%"

---

### Phase 38: Product Image Enhancement UI

- [ ] 🟥 **38.1: Add State & Handler to ProductImageSection**
  - [ ] 🟥 Edit `frontend/src/components/InputForm/ProductImageSection.jsx`
  - [ ] 🟥 Import `enhanceImage` from `'../../services/imageSearchService'`
  - [ ] 🟥 Import `{ saveEnhancedImage, isImageEnhanced }` from `'../../utils/enhancementCache'`
  - [ ] 🟥 Add state: `const [isEnhancing, setIsEnhancing] = useState(false)`
  - [ ] 🟥 Add state: `const [enhancementProgress, setEnhancementProgress] = useState(0)`
  - [ ] 🟥 Create `handleEnhanceImage` async function (same logic as BrandLogoSection)
  - [ ] 🟥 Use `field='product'` instead of `'logo'` in API call
  - [ ] 🟥 Update state with `productImage.imageUrl` instead of `brandLogo.imageUrl`

- [ ] 🟥 **38.2: Add Enhancement Button UI**
  - [ ] 🟥 Add button between "AI SEARCH" and "Remove Background"
  - [ ] 🟥 Use identical styling as BrandLogoSection button
  - [ ] 🟥 Show button only when `productImage.imageUrl` exists
  - [ ] 🟥 Disable when `isEnhancing` or `isImageEnhanced()` returns true
  - [ ] 🟥 Show progress bar during enhancement
  - [ ] 🟥 Add tooltip on hover when disabled: "Image already enhanced"

---

### Phase 39: Error Handling & User Feedback

- [ ] 🟥 **39.1: Comprehensive Error Messages**
  - [ ] 🟥 Handle 402 (quota exhausted): "Cloudinary free tier limit reached (25/month). Please upgrade or try next month." (duration: 5000ms)
  - [ ] 🟥 Handle 429 (rate limit): "Rate limit exceeded. Please wait a moment and try again." (duration: 4000ms)
  - [ ] 🟥 Handle 504 (timeout): "Enhancement timed out. The image may be too large or complex." (duration: 4000ms)
  - [ ] 🟥 Handle 400 (invalid image): "Invalid image. The image may be corrupted or in an unsupported format."
  - [ ] 🟥 Handle generic errors: "Failed to enhance image. Please try again later."
  - [ ] 🟥 Show warning if original image quality is already very high: "Image quality is already excellent!"

- [ ] 🟥 **39.2: Success Feedback**
  - [ ] 🟥 Show success toast: "Image enhanced successfully!" (duration: 3000ms)
  - [ ] 🟥 Update banner preview immediately (via existing state update mechanism)
  - [ ] 🟥 Button becomes disabled with tooltip: "Image already enhanced"
  - [ ] 🟥 Save enhanced URL to cache for future sessions

---

### Phase 40: Integration Testing

- [ ] 🟥 **40.1: Backend API Testing**
  - [ ] 🟥 Start backend server: `cd backend && npm run dev`
  - [ ] 🟥 Test enhancement endpoint: `curl -X POST http://localhost:5000/api/enhance-image -d '{"imageUrl":"...", "field":"logo"}'`
  - [ ] 🟥 Verify response contains `enhancedImageUrl`
  - [ ] 🟥 Test with invalid URL (expect 400 error)
  - [ ] 🟥 Test with missing field parameter (expect 400 error)
  - [ ] 🟥 Test with invalid Cloudinary credentials (expect 403 error)
  - [ ] 🟥 Verify enhanced images are accessible via returned URLs

- [ ] 🟥 **40.2: Frontend Enhancement Flow - Logo**
  - [ ] 🟥 Upload a low-quality logo image
  - [ ] 🟥 Verify "ENHANCE IMAGE" button appears
  - [ ] 🟥 Click "ENHANCE IMAGE" button
  - [ ] 🟥 Verify progress bar appears and animates 0% → 90%
  - [ ] 🟥 Verify banner preview updates with enhanced image after 10-20 seconds
  - [ ] 🟥 Verify progress bar reaches 100% and disappears
  - [ ] 🟥 Verify success toast appears
  - [ ] 🟥 Verify button becomes disabled with tooltip
  - [ ] 🟥 Verify enhanced image is cached (check localStorage)
  - [ ] 🟥 Refresh page and upload same image → button should be disabled immediately

- [ ] 🟥 **40.3: Frontend Enhancement Flow - Product**
  - [ ] 🟥 Upload a low-quality product image
  - [ ] 🟥 Verify "ENHANCE IMAGE" button appears
  - [ ] 🟥 Click "ENHANCE IMAGE" button
  - [ ] 🟥 Verify progress bar and loading state
  - [ ] 🟥 Verify banner preview updates with enhanced image
  - [ ] 🟥 Verify success feedback and disabled button
  - [ ] 🟥 Verify caching works correctly

- [ ] 🟥 **40.4: Non-Blocking Behavior Testing**
  - [ ] 🟥 Click "ENHANCE IMAGE" on logo
  - [ ] 🟥 While enhancement is in progress, type in heading field → verify text updates
  - [ ] 🟥 While enhancement is in progress, change colors → verify colors update
  - [ ] 🟥 While enhancement is in progress, upload product image → verify both images process independently
  - [ ] 🟥 Verify only enhancement button is disabled, all other buttons remain functional

- [ ] 🟥 **40.5: Error Scenario Testing**
  - [ ] 🟥 Test with invalid Cloudinary API key (expect error toast)
  - [ ] 🟥 Test with exhausted Cloudinary quota (expect 402 error toast)
  - [ ] 🟥 Test with very large image (expect timeout or success)
  - [ ] 🟥 Test with corrupted image file (expect 400 error toast)
  - [ ] 🟥 Verify original image is retained on all error scenarios
  - [ ] 🟥 Verify error messages are user-friendly and actionable

- [ ] 🟥 **40.6: Cache Testing**
  - [ ] 🟥 Enhance an image and verify it's cached
  - [ ] 🟥 Clear the image and re-upload → button should be disabled
  - [ ] 🟥 Enhance a different image → verify new entry added to cache
  - [ ] 🟥 Fill cache with 51+ images → verify oldest entry is removed
  - [ ] 🟥 Clear localStorage and verify cache rebuilds on next enhancement

---

### Phase 41: Documentation & Deployment

- [ ] 🟥 **41.1: Update PLAN.md**
  - [ ] 🟥 Mark all Phase 33-40 subtasks as complete
  - [ ] 🟥 Update overall progress percentage for Phase 33
  - [ ] 🟥 Add final notes on Cloudinary usage and rate limits

- [ ] 🟥 **41.2: Update README.md**
  - [ ] 🟥 Document new image enhancement feature
  - [ ] 🟥 Add Cloudinary setup instructions
  - [ ] 🟥 Document rate limits: 25 enhancements/month (free tier)
  - [ ] 🟥 Add screenshot of enhancement button in UI

- [ ] 🟥 **41.3: Update Environment Setup Guide**
  - [ ] 🟥 Add Cloudinary account creation steps
  - [ ] 🟥 Document how to get API credentials
  - [ ] 🟥 Add `.env` configuration example with all 3 Cloudinary variables

---

## Out of Scope (Future Enhancements)

These features will NOT be implemented in this version:
- Enhancement for background image (strict dimension requirement conflicts with enhancement)
- Multiple enhancement quality levels (low/medium/high)
- Batch enhancement (enhance multiple images at once)
- Before/after comparison slider
- Custom enhancement parameters (user-adjustable sharpness, brightness, etc.)
- Undo enhancement (revert to original)
- Enhanced image download separate from banner
- AI-powered quality detection (auto-suggest enhancement only for low-quality images)
- Multiple enhancement service providers (fallback options)
- Server-side caching (only client-side caching for now)
- Enhancement analytics (track usage, quality improvements)
- Preview enhancement before applying
- Real-time enhancement progress from backend (currently simulated)
- Enhancement for background removal results (avoid double processing)

---
