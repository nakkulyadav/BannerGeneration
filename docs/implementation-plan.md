# DigiHaat Banner Generation - Implementation Plan

## 1. Technology Stack

### Frontend Framework
**Choice: Vite + React**
- **Rationale:**
  - Vite offers fastest dev experience with instant HMR (Hot Module Replacement)
  - Lightning-fast build times
  - Modern tooling out of the box
  - Simpler than Next.js for this use case (no need for SSR)
  - Better DX than Create React App

### Banner Generation
**Choice: HTML5 Canvas API with Fabric.js**
- **Rationale:**
  - Fabric.js provides powerful canvas manipulation
  - Easy image composition and layering
  - Built-in support for text rendering with custom fonts
  - Excellent for precise positioning and alignment
  - Can export high-quality PNG directly
  - Good performance for real-time preview

### Styling
**Choice: Tailwind CSS**
- **Rationale:**
  - Rapid UI development with utility classes
  - Modern, clean aesthetic by default
  - Easy to maintain consistency
  - Excellent mobile responsiveness utilities
  - Small bundle size with purging

### Additional Libraries
- **react-color** or **@hello-pangea/color-picker**: Color picker with presets
- **react-dropzone**: File upload with drag-and-drop
- **react-hot-toast**: User notifications and error messages
- **Google Fonts (Inter family)**: Typography

---

## 2. Project Structure

```
DigihaatBannerAutomation/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── BannerPreview/
│   │   │   ├── BannerPreview.jsx
│   │   │   ├── BannerCanvas.jsx
│   │   │   └── DownloadButton.jsx
│   │   ├── InputForm/
│   │   │   ├── InputForm.jsx
│   │   │   ├── BackgroundSection.jsx
│   │   │   ├── BrandLogoSection.jsx
│   │   │   ├── HeadingSection.jsx
│   │   │   ├── SubheadingSection.jsx
│   │   │   ├── CTAButtonSection.jsx
│   │   │   ├── TCTextSection.jsx
│   │   │   ├── OfferBadgeSection.jsx
│   │   │   └── ProductImageSection.jsx
│   │   └── shared/
│   │       ├── ColorPicker.jsx
│   │       ├── ImageUpload.jsx
│   │       └── ToggleSwitch.jsx
│   ├── hooks/
│   │   ├── useBannerGenerator.js
│   │   ├── useImageValidation.js
│   │   └── useFormValidation.js
│   ├── utils/
│   │   ├── bannerGenerator.js
│   │   ├── imageProcessor.js
│   │   ├── textFormatter.js
│   │   ├── layoutCalculator.js
│   │   └── fileNameGenerator.js
│   ├── constants/
│   │   ├── bannerConfig.js
│   │   └── defaultValues.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 3. Component Architecture

### 3.1 Top-Level Components

#### **App.jsx**
- Main application container
- Manages global state for all banner inputs
- Handles layout (desktop: side-by-side, mobile: stacked)
- Provides context for banner data

#### **InputForm.jsx**
- Container for all input sections
- Groups inputs logically
- Handles form validation
- Manages required field tracking

#### **BannerPreview.jsx**
- Container for canvas and download
- Manages preview rendering
- Handles download functionality

### 3.2 Input Section Components

Each section component handles:
- Label and description
- Input field(s) with validation
- Error/success states
- Real-time updates to global state

**Component Structure:**
```jsx
<Section>
  <Label required={boolean} />
  <Input onChange={handleChange} />
  <ValidationMessage />
</Section>
```

### 3.3 Banner Canvas Component

**BannerCanvas.jsx**
- Core banner generation logic
- Uses Fabric.js to compose elements
- Renders in real-time as state changes
- Calculates dynamic positioning and spacing
- Handles font loading and rendering

---

## 4. Implementation Phases

### Phase 1: Project Setup & Foundation
**Tasks:**
1. Initialize Vite + React project
2. Install dependencies (Tailwind, Fabric.js, etc.)
3. Configure Tailwind CSS
4. Set up project structure (folders, files)
5. Create constants file with banner specifications
6. Load Inter font family from Google Fonts
7. Create basic App layout (left/right split)

**Deliverable:** Empty UI with layout structure

---

### Phase 2: State Management & Form Foundation
**Tasks:**
1. Create global state structure for banner inputs
2. Implement form validation hooks
3. Create shared components (ColorPicker, ImageUpload, Toggle)
4. Build InputForm container component
5. Implement required field tracking logic

**Deliverable:** Form structure with state management

---

### Phase 3: Background & Edge Controls
**Tasks:**
1. Build BackgroundSection component
2. Implement image upload with dimension validation (722×312)
3. Add edge selection (sharp/rounded)
4. Create image preview thumbnail
5. Handle file validation and error messages

**Deliverable:** Working background upload with validation

---

### Phase 4: Left Section Elements (Part 1)
**Tasks:**
1. Build BrandLogoSection (optional, with max dimensions)
2. Build HeadingSection (required, 40 char limit, color picker)
3. Build SubheadingSection with:
   - Split left/right option
   - Independent rupee toggles
   - Strikethrough for left part
   - Color picker
4. Implement text wrapping logic for heading

**Deliverable:** Working input sections for logo, heading, subheading

---

### Phase 5: Left Section Elements (Part 2)
**Tasks:**
1. Build CTAButtonSection (text + color pickers)
2. Build TCTextSection (optional)
3. Implement color picker with presets
4. Add default color values

**Deliverable:** Complete left section input controls

---

### Phase 6: Right Section Elements
**Tasks:**
1. Build OfferBadgeSection (text + color picker, optional)
2. Build ProductImageSection (required, with upload)
3. Implement image upload validation
4. Add image preview thumbnails

**Deliverable:** Complete right section input controls

---

### Phase 7: Banner Generation Engine
**Tasks:**
1. Create bannerGenerator.js utility
2. Implement Fabric.js canvas initialization
3. Build background layer rendering
4. Implement rounded corner logic (12px border-radius)
5. Add brand logo rendering with scaling
6. Create text rendering functions for all text elements
7. Implement CTA button rendering (with padding, border-radius)
8. Implement offer badge rendering (custom corner radius)
9. Add product image rendering (centered, scaled)

**Deliverable:** Complete banner generation logic

---

### Phase 8: Layout & Spacing Calculator
**Tasks:**
1. Create layoutCalculator.js utility
2. Implement vertical centering algorithm for left section
3. Calculate flexible spacing based on present/absent elements
4. Handle text wrapping for heading (max 2 lines)
5. Calculate subheading split positioning (left/right with 2px gap)
6. Implement logo scaling logic (max 50×120px)
7. Calculate product image dimensions (full height minus badge)

**Deliverable:** Dynamic layout calculations working

---

### Phase 9: Real-Time Preview
**Tasks:**
1. Connect BannerCanvas to global state
2. Implement debounced rendering for performance
3. Add loading states during generation
4. Handle preview errors gracefully
5. Optimize canvas re-rendering

**Deliverable:** Working real-time preview

---

### Phase 10: Download Functionality
**Tasks:**
1. Create DownloadButton component
2. Implement PNG export at highest quality
3. Generate filename from heading text
4. Handle special characters and truncation
5. Add download success notification

**Deliverable:** Working download feature

---

### Phase 11: UI Polish & Responsiveness
**Tasks:**
1. Style all input sections with Tailwind
2. Implement mobile responsive layout (stack inputs/preview)
3. Add loading spinners and transitions
4. Improve color picker UI with recent colors
5. Add tooltips and help text
6. Implement toast notifications for errors/success
7. Polish overall aesthetic (clean, modern, simple)

**Deliverable:** Polished, responsive UI

---

### Phase 12: Testing & Bug Fixes
**Tasks:**
1. Test all required field validations
2. Test optional field removal (spacing adjustments)
3. Test edge cases (long text, large images, etc.)
4. Test background dimension validation
5. Test download with various inputs
6. Test mobile responsiveness
7. Cross-browser testing
8. Fix any bugs discovered

**Deliverable:** Stable, tested application

---

### Phase 13: Deployment
**Tasks:**
1. Build production bundle
2. Deploy to Vercel/Netlify
3. Test deployed version
4. Provide deployment URL

**Deliverable:** Live, hosted application

---

## 5. Technical Implementation Details

### 5.1 State Structure

```javascript
const bannerState = {
  // Background
  background: {
    image: null, // File object
    imageUrl: '', // Data URL for preview
    edgeType: 'sharp', // 'sharp' | 'rounded'
  },

  // Left Section
  brandLogo: {
    image: null,
    imageUrl: '',
  },

  heading: {
    text: '',
    color: '#000000',
  },

  subheading: {
    isSplit: false,
    left: {
      text: '',
      hasRupee: false,
      hasStrikethrough: false,
    },
    right: {
      text: '',
      hasRupee: false,
    },
    color: '#000000',
  },

  ctaButton: {
    text: '',
    textColor: '#FFFFFF',
    bgColor: '', // No default, required
  },

  tcText: {
    text: '',
    color: '#000000',
  },

  // Right Section
  offerBadge: {
    text: '',
    textColor: '#FFFFFF',
    bgColor: '', // Required if text present
  },

  productImage: {
    image: null,
    imageUrl: '',
  },
};
```

### 5.2 Banner Generation Flow

```javascript
// bannerGenerator.js pseudo-code

function generateBanner(state) {
  // 1. Initialize canvas (722×312)
  const canvas = new fabric.Canvas();
  canvas.setDimensions({ width: 722, height: 312 });

  // 2. Add background with optional rounded corners
  addBackground(canvas, state.background);

  // 3. Calculate layout (vertical centering, spacing)
  const layout = calculateLayout(state);

  // 4. Render left section elements
  if (state.brandLogo.image) {
    addLogo(canvas, state.brandLogo, layout.logo);
  }
  addHeading(canvas, state.heading, layout.heading);
  if (state.subheading.text) {
    addSubheading(canvas, state.subheading, layout.subheading);
  }
  addCTAButton(canvas, state.ctaButton, layout.cta);
  if (state.tcText.text) {
    addTCText(canvas, state.tcText, layout.tcText);
  }

  // 5. Render right section elements
  if (state.offerBadge.text) {
    addOfferBadge(canvas, state.offerBadge);
  }
  addProductImage(canvas, state.productImage, layout.productImage);

  // 6. Render canvas
  canvas.renderAll();

  return canvas;
}
```

### 5.3 Layout Calculation Algorithm

```javascript
// layoutCalculator.js pseudo-code

function calculateLayout(state) {
  const BANNER_HEIGHT = 312;
  const LEFT_MARGIN = 20;
  const TOP_MARGIN = 11;

  // Collect present elements
  const leftElements = [];

  if (state.brandLogo.image) leftElements.push('logo');
  leftElements.push('heading'); // Always required
  if (state.subheading.text) leftElements.push('subheading');
  leftElements.push('cta'); // Always required
  if (state.tcText.text) leftElements.push('tcText');

  // Calculate individual heights
  const heights = {
    logo: state.brandLogo.image ? getLogoHeight(state.brandLogo) : 0,
    heading: getTextHeight(state.heading, 156, 16, 2), // max width, font size, max lines
    subheading: state.subheading.text ? getTextHeight(state.subheading, 200, 14, 1) : 0,
    cta: getCTAHeight(state.ctaButton), // dynamic based on text + padding
    tcText: state.tcText.text ? 8 : 0, // font size
  };

  // Calculate total height
  const totalHeight = Object.values(heights).reduce((sum, h) => sum + h, 0);

  // Calculate spacing
  const spacings = getSpacings(leftElements); // Returns array of spacing values
  const totalSpacing = spacings.reduce((sum, s) => sum + s, 0);

  // Calculate vertical centering offset
  const contentHeight = totalHeight + totalSpacing;
  const topOffset = (BANNER_HEIGHT - contentHeight) / 2;

  // Calculate Y positions for each element
  let currentY = topOffset;
  const positions = {};

  leftElements.forEach((element, index) => {
    positions[element] = {
      x: LEFT_MARGIN,
      y: currentY,
      height: heights[element],
    };
    currentY += heights[element];
    if (index < leftElements.length - 1) {
      currentY += spacings[index];
    }
  });

  // Calculate product image position (centered in right section)
  const offerBadgeHeight = state.offerBadge.text ?
    getOfferBadgeHeight(state.offerBadge) : 0;

  positions.productImage = {
    maxHeight: BANNER_HEIGHT - offerBadgeHeight - 5, // 5px gap
    topOffset: offerBadgeHeight + 5,
    centerX: 722 * 0.75, // Right section center (~540px)
    centerY: (BANNER_HEIGHT + offerBadgeHeight + 5) / 2,
  };

  return positions;
}

function getSpacings(elements) {
  // Returns spacing array based on which elements are present
  const spacingMap = {
    'logo-heading': 5,
    'heading-subheading': 10,
    'heading-cta': 13, // Adjusted if no subheading
    'subheading-cta': 13,
    'cta-tcText': 4,
  };

  const spacings = [];
  for (let i = 0; i < elements.length - 1; i++) {
    const key = `${elements[i]}-${elements[i + 1]}`;
    spacings.push(spacingMap[key] || 10); // Default 10px
  }

  return spacings;
}
```

### 5.4 Image Validation

```javascript
// useImageValidation.js

function useImageValidation() {
  const validateBackgroundImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === 722 && img.height === 312) {
          resolve(true);
        } else {
          reject('Background image must be 722×312 format');
        }
      };
      img.onerror = () => reject('Invalid image file');
      img.src = URL.createObjectURL(file);
    });
  };

  const validateLogo = (file) => {
    // Just check if it's a valid image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject('Invalid logo file');
      img.src = URL.createObjectURL(file);
    });
  };

  return { validateBackgroundImage, validateLogo };
}
```

### 5.5 Text Rendering with Fabric.js

```javascript
function addHeading(canvas, heading, layout) {
  const text = new fabric.Textbox(heading.text, {
    left: layout.x,
    top: layout.y,
    width: 156,
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 600, // Semibold
    fill: heading.color,
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 1.4,
    splitByGrapheme: false,
  });

  // Limit to 2 lines
  if (text.textLines.length > 2) {
    // Truncate text to fit 2 lines
    // ... truncation logic
  }

  canvas.add(text);
}
```

### 5.6 Subheading Split Rendering

```javascript
function addSubheading(canvas, subheading, layout) {
  if (!subheading.isSplit) {
    // Simple single text rendering
    const text = createSubheadingText(
      subheading.left.text,
      subheading.left.hasRupee,
      layout.x,
      layout.y,
      subheading.color
    );
    canvas.add(text);
  } else {
    // Split rendering with left and right parts
    const leftText = createSubheadingText(
      subheading.left.text,
      subheading.left.hasRupee,
      layout.x,
      layout.y,
      subheading.color
    );

    if (subheading.left.hasStrikethrough) {
      leftText.set('linethrough', true);
    }

    canvas.add(leftText);

    // Calculate right text position (2px gap)
    const rightX = layout.x + leftText.width + 2;

    const rightText = createSubheadingText(
      subheading.right.text,
      subheading.right.hasRupee,
      rightX,
      layout.y,
      subheading.color
    );

    canvas.add(rightText);
  }
}

function createSubheadingText(text, hasRupee, x, y, color) {
  const displayText = hasRupee ? `Starting at ₹${text}` : text;

  return new fabric.Text(displayText, {
    left: x,
    top: y,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: 500, // Medium
    fill: color,
    textAlign: 'left',
  });
}
```

### 5.7 CTA Button Rendering

```javascript
function addCTAButton(canvas, cta, layout) {
  const text = new fabric.Text(cta.text, {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 700, // Bold
    fill: cta.textColor,
  });

  // Calculate button dimensions with padding
  const buttonWidth = text.width + 12; // 6px left + 6px right
  const buttonHeight = text.height + 8; // 4px top + 4px bottom

  // Create button background
  const button = new fabric.Rect({
    left: layout.x,
    top: layout.y,
    width: buttonWidth,
    height: buttonHeight,
    fill: cta.bgColor,
    rx: 4, // Border radius
    ry: 4,
  });

  // Position text centered in button
  text.set({
    left: layout.x + 6,
    top: layout.y + 4,
  });

  // Group button and text
  const group = new fabric.Group([button, text], {
    left: layout.x,
    top: layout.y,
  });

  canvas.add(group);
}
```

### 5.8 Offer Badge Rendering

```javascript
function addOfferBadge(canvas, badge) {
  const text = new fabric.Text(badge.text, {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: 500, // Medium
    fill: badge.textColor,
  });

  const badgeWidth = text.width + 12; // 6px padding
  const badgeHeight = text.height + 8; // 4px padding

  // Create badge background with custom corner radius
  const background = new fabric.Rect({
    left: 722 - badgeWidth, // Align to right edge
    top: 0, // Align to top edge
    width: badgeWidth,
    height: badgeHeight,
    fill: badge.bgColor,
    // Custom corner radius: top-left, top-right, bottom-right, bottom-left
    rx: 0,
    ry: 0,
  });

  // Apply custom corner radius (only bottom-left = 4px)
  // Fabric.js doesn't support individual corners directly
  // Need to use path or clipPath for this
  // Alternative: Create rounded rect and clip

  text.set({
    left: 722 - badgeWidth + 6,
    top: 4,
  });

  canvas.add(background);
  canvas.add(text);
}
```

### 5.9 High-Quality PNG Export

```javascript
function downloadBanner(canvas, heading) {
  // Generate filename
  const filename = generateFilename(heading);

  // Export at highest quality
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1.0,
    multiplier: 2, // 2x resolution for higher quality
  });

  // Trigger download
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateFilename(heading) {
  // Remove special characters
  let clean = heading.replace(/[^a-zA-Z0-9\s]/g, '');

  // Replace spaces with underscores
  clean = clean.replace(/\s+/g, '_');

  // Truncate to reasonable length (40 chars)
  if (clean.length > 40) {
    clean = clean.substring(0, 40);
  }

  return `${clean}.png`;
}
```

---

## 6. UI/UX Design Approach

### 6.1 Design Principles
- **Minimalist:** Clean, uncluttered interface
- **Intuitive:** Clear labels, logical grouping
- **Modern:** Contemporary design patterns, smooth transitions
- **Accessible:** Good contrast, readable fonts, clear error messages

### 6.2 Color Scheme
- **Background:** Light gray (#F9FAFB)
- **Cards:** White (#FFFFFF) with subtle shadow
- **Primary actions:** Blue (#3B82F6)
- **Borders:** Light gray (#E5E7EB)
- **Text:** Dark gray (#111827)
- **Error:** Red (#EF4444)
- **Success:** Green (#10B981)

### 6.3 Layout
```
Desktop (≥1024px):
┌────────────────────────────────────────────┐
│  Header: DigiHaat Banner Generator         │
├──────────────────┬─────────────────────────┤
│                  │                         │
│  INPUT FORM      │   LIVE PREVIEW          │
│  (Scrollable)    │   (Fixed position)      │
│                  │                         │
│  [Card: BG]      │   ┌─────────────────┐   │
│  [Card: Logo]    │   │                 │   │
│  [Card: Heading] │   │   722×312       │   │
│  [Card: Sub]     │   │   Canvas        │   │
│  [Card: CTA]     │   │                 │   │
│  [Card: T&C]     │   └─────────────────┘   │
│  [Card: Badge]   │                         │
│  [Card: Product] │   [Download Button]     │
│                  │                         │
└──────────────────┴─────────────────────────┘

Mobile (<1024px):
┌────────────────────────────────┐
│  Header                        │
├────────────────────────────────┤
│  INPUT FORM                    │
│  (Scrollable)                  │
│                                │
│  [Card: Background]            │
│  [Card: Brand Logo]            │
│  [Card: Product Heading]       │
│  [Card: Product Subheading]    │
│  [Card: CTA Button]            │
│  [Card: T&C Text]              │
│  [Card: Offer Badge]           │
│  [Card: Product Image]         │
│                                │
├────────────────────────────────┤
│  PREVIEW                       │
│                                │
│  ┌──────────────────────────┐  │
│  │      Banner Preview      │  │
│  └──────────────────────────┘  │
│                                │
│  [Download Button]             │
│                                │
└────────────────────────────────┘
```

### 6.4 Input Card Structure
```jsx
<Card>
  <CardHeader>
    <Label>Section Name {required && '*'}</Label>
    <HelpText>Brief description</HelpText>
  </CardHeader>
  <CardBody>
    {/* Input fields */}
  </CardBody>
  <CardFooter>
    {/* Validation messages */}
  </CardFooter>
</Card>
```

---

## 7. Performance Optimizations

### 7.1 Real-Time Preview
- **Debouncing:** Delay canvas re-render by 300ms after last input change
- **Memoization:** Use React.memo for components that don't need frequent updates
- **Lazy rendering:** Only render canvas when in viewport
- **Worker threads:** Consider Web Worker for heavy image processing (if needed)

### 7.2 Image Handling
- **Compression:** Don't compress input images (preserve quality)
- **Caching:** Cache loaded images to avoid re-loading
- **Progressive loading:** Show spinner while images load

### 7.3 Bundle Size
- **Tree shaking:** Vite handles automatically
- **Code splitting:** Lazy load color picker if heavy
- **Font subsetting:** Only load required Inter font weights

---

## 8. Error Handling & Validation

### 8.1 Validation Rules
| Field | Validation |
|-------|------------|
| Background Image | Exactly 722×312px, valid image format |
| Brand Logo | Valid image format, max 50×120px after scaling |
| Product Heading | Required, max 40 characters |
| CTA Text | Required |
| CTA Background Color | Required |
| Product Image | Required, valid image format |

### 8.2 Error Messages
- Clear, actionable messages
- Displayed inline with input fields
- Toast notifications for system errors
- Prevent download until all validations pass

### 8.3 Edge Cases
- **Very long text:** Truncate/wrap appropriately
- **Huge images:** Scale down while maintaining quality
- **Missing fonts:** Fallback to system fonts
- **Browser compatibility:** Graceful degradation

---

## 9. Testing Strategy

### 9.1 Manual Testing Checklist
- [ ] Upload valid background (722×312)
- [ ] Upload invalid background (wrong dimensions)
- [ ] Upload brand logo (various aspect ratios)
- [ ] Enter heading text (up to 40 chars)
- [ ] Enter heading text (exceeds 40 chars - should block)
- [ ] Test subheading split with both rupee toggles
- [ ] Test strikethrough on left subheading
- [ ] Select CTA colors
- [ ] Test all optional fields (presence/absence)
- [ ] Verify spacing adjustments with missing elements
- [ ] Test mobile responsive layout
- [ ] Download banner and verify quality
- [ ] Verify filename generation
- [ ] Test with no logo (should still center content)
- [ ] Test with no subheading (should adjust spacing)

### 9.2 Cross-Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 10. Deployment

### 10.1 Build Process
```bash
npm run build
```
Outputs optimized static files to `dist/` folder

### 10.2 Hosting Platform
**Recommended: Vercel**
- Free tier sufficient
- Automatic deployments from Git
- Built-in HTTPS
- Excellent performance
- Simple setup

**Alternative: Netlify**
- Similar features to Vercel
- Drag-and-drop deployment
- Free tier available

### 10.3 Deployment Steps
1. Connect GitHub repo to Vercel
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy
4. Verify production build
5. Share URL with team

---

## 11. Future Enhancements (Out of Scope)

These features are documented for future reference but NOT implemented in initial version:

1. **Drag & Drop Positioning:** Allow users to manually position elements
2. **Background Removal:** Automatic background removal for product images
3. **Multiple Templates:** Different layout templates to choose from
4. **Save/Load Configurations:** Save banner configs for reuse
5. **Batch Generation:** Generate multiple banners with CSV import
6. **Font Selection:** Allow users to choose from font library
7. **Image Editing:** Crop, resize, rotate images within app
8. **Background Auto-Scaling:** Accept any size background and auto-scale
9. **Export Multiple Formats:** JPG, WebP, SVG exports
10. **Undo/Redo History:** Full history with undo/redo
11. **Collaboration:** Share banner configs with team members
12. **Analytics:** Track which banner elements are most used

---

## 12. Implementation Timeline Estimate

**Note:** Not providing time estimates per requirement, but here's the sequence:

1. ✅ Project setup & foundation
2. ✅ State management & form foundation
3. ✅ Background & edge controls
4. ✅ Left section elements (Part 1)
5. ✅ Left section elements (Part 2)
6. ✅ Right section elements
7. ✅ Banner generation engine
8. ✅ Layout & spacing calculator
9. ✅ Real-time preview
10. ✅ Download functionality
11. ✅ UI polish & responsiveness
12. ✅ Testing & bug fixes
13. ✅ Deployment

---

## 13. Key Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Vite + React | Fast, modern, simple |
| Canvas Library | Fabric.js | Powerful, precise control |
| Styling | Tailwind CSS | Rapid development, clean UI |
| State Management | React useState + Context | Simple, no need for Redux |
| Color Picker | react-color | Feature-rich, customizable |
| File Upload | react-dropzone | Excellent UX, drag-drop |
| Fonts | Google Fonts | Easy integration, free |
| Hosting | Vercel | Free, fast, reliable |
| Preview | Real-time (debounced) | Better UX, immediate feedback |

---

## 14. Success Criteria

The implementation will be considered successful when:

✅ All required fields are functional and validated
✅ All optional fields work and adjust layout appropriately
✅ Banner generates with exact specifications (722×312)
✅ Real-time preview updates as user types
✅ Download produces high-quality PNG with correct filename
✅ UI is clean, modern, and intuitive
✅ Mobile responsive layout works correctly
✅ Background validation rejects incorrect dimensions
✅ All spacing and positioning match specifications
✅ Fonts render correctly (Inter family)
✅ Color pickers work with presets
✅ Application is deployed and accessible via URL

---

## Questions Before Implementation?

This plan covers all aspects of the implementation. Please review and let me know:

1. **Approval:** Does this plan align with your vision?
2. **Changes:** Any modifications needed?
3. **Priorities:** Any specific phase you want prioritized?
4. **Concerns:** Any technical concerns or questions?

Once approved, I'll proceed with Phase 1: Project Setup & Foundation.
