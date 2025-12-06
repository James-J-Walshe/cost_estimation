# Project Estimating Tool - Architecture & Development Guidelines

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Pattern](#architecture-pattern)
- [Initialization Manager Pattern](#initialization-manager-pattern)
- [File Structure](#file-structure)
- [Development Guidelines](#development-guidelines)
- [Common Patterns](#common-patterns)
- [Feature Documentation](#feature-documentation)
  - [Currency Management](#currency-management)
  - [Merge Functionality](#merge-functionality) ⭐
  - [Rate Card Editing](#rate-card-editing) ⭐
  - [Hover Widget Navigation](#hover-widget-navigation) ⭐ NEW
- [Troubleshooting](#troubleshooting)

---

## Project Overview

A web-based ICT project estimation tool for calculating and managing project costs, resources, and timelines. Built with vanilla JavaScript using a modular architecture with centralized initialization management.

**Key Features:**
- Project cost estimation with multiple cost categories
- Internal and external resource planning
- Dynamic month-based timeline calculations
- Vendor, tool, and miscellaneous cost tracking
- Risk assessment and contingency planning
- Currency management with exchange rates
- Specialist team estimate merging ⭐
- Rate card conflict resolution ⭐
- Inline rate card editing ⭐
- **Hover widget navigation between Zyantik applications** ⭐ NEW
- Data persistence via localStorage
- Export capabilities

---

## Architecture Pattern

### Core Principle: Initialization Manager Pattern

This project uses a **centralized initialization manager** (`init_manager.js`) to coordinate module loading and startup sequencing. This pattern ensures:

1. ✅ **Predictable Load Order** - Modules load in the correct sequence
2. ✅ **Dependency Management** - Checks for required dependencies before proceeding
3. ✅ **Error Resilience** - Graceful fallbacks when modules are unavailable
4. ✅ **Clear Debugging** - Comprehensive console logging of initialization steps
5. ✅ **Separation of Concerns** - Initialization logic separate from business logic

### Why NOT Use DOMContentLoaded in Multiple Files?

❌ **ANTI-PATTERN: Multiple DOMContentLoaded listeners across files**

```javascript
// DON'T DO THIS - in script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything here
});

// DON'T DO THIS - in other modules
document.addEventListener('DOMContentLoaded', function() {
    // Initialize more stuff here
});
```

**Problems with this approach:**
- Unpredictable execution order
- Race conditions between modules
- Difficult to debug initialization issues
- No centralized control over startup sequence
- Duplicate code and event listeners

✅ **CORRECT PATTERN: Single initialization manager**

```javascript
// init_manager.js handles ALL initialization
window.initManager.initialize();
```

---

## Initialization Manager Pattern

### File: `modules/init_manager.js`

**Purpose:** Orchestrates the entire application startup sequence.

### Key Responsibilities

1. **Data Structure Initialization**
   - Creates `window.projectData` if it doesn't exist
   - Sets up default rate cards and project structure
   - Initializes currency settings with default primary currency

2. **Module Detection**
   - Checks for available modules (DataManager, TableRenderer, EditManager, CurrencyManager, MergeManager, etc.)
   - Logs which modules are loaded
   - Handles both capitalized and lowercase module naming

3. **Dependency Waiting**
   - Uses timeout-based polling to wait for critical functions
   - Fails gracefully if dependencies aren't available within timeout

4. **Controlled Initialization Sequence**
   ```
   Step 1: Initialize project data structure
   Step 2: Check which modules are available
   Step 3: Initialize DOM Manager
   Step 4: Initialize basic event listeners from script.js
   Step 5: Wait for critical functions (updateSummary, updateMonthHeaders)
   Step 6: Initialize Project Info Save Button
   Step 7: Load saved data from localStorage
   Step 8: Render all tables
   Step 9: Update UI (summary and month headers)
   Step 10: Initialize New Project Welcome feature
   Step 11: Initialize User Manager
   Step 12: Initialize Feature Toggle Manager
   Step 13: Initialize Currency Manager
   Step 14: Initialize Tool Costs Manager
   Step 15: Initialize Merge Manager
   Step 16: Initialize Edit Manager
   Step 17: Initialize Hover Widget Navigation ⭐ NEW
   Step 18: Final re-render after delay
   ```

5. **Comprehensive Logging**
   - All initialization steps logged to console with ✓ checkmarks
   - Clear error messages with stack traces
   - Easy to debug startup issues

### Critical Code Structure

```javascript
class InitializationManager {
    constructor() {
        this.initialized = false;
        this.modules = {
            dataManager: false,
            tableRenderer: false,
            editManager: false,
            dynamicFormHelper: false,
            domManager: false,
            tableFixes: false,
            newProjectWelcome: false,
            currencyManager: false,
            userManager: false,
            featureToggleManager: false,
            toolCostsManager: false,
            rateCardMerger: false,
            mergeManager: false,
            hoverWidget: false          // ⭐ NEW
        };
    }

    async initialize() {
        // Orchestrate entire startup sequence
        // Each step logs its completion
        // Errors are caught and logged but don't stop initialization
    }
}
```

### Integration in index.html

**CRITICAL: Load order matters!**

```html
<!-- Load all modules FIRST -->
<script src="js/dom_manager.js"></script>
<script src="js/table_renderer.js"></script> 
<script src="js/data_manager.js"></script>
<script src="modules/editManager.js"></script>
<script src="modules/dynamic_form_helper.js"></script>
<script src="modules/table_fixes.js"></script>
<script src="modules/new_project_welcome.js"></script>
<script src="modules/currency_manager.js"></script>
<script src="modules/user_manager.js"></script>
<script src="modules/feature_toggle_manager.js"></script>
<script src="modules/tool_costs_manager.js"></script>
<script src="modules/rate_card_merger.js"></script>
<script src="modules/merge_manager.js"></script>

<!-- Load main script (contains functions but NO auto-init) -->
<script src="script.js"></script>

<!-- Load hover widget ⭐ NEW -->
<script src="hover-widget.js"></script>

<!-- Load initialization manager LAST -->
<script src="modules/init_manager.js"></script>

<!-- Trigger initialization -->
<script>
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.initManager.initialize();
        });
    } else {
        window.initManager.initialize();
    }
</script>
```

---

## File Structure

```
cost_estimation/
├── index.html                          # Main HTML file
├── script.js                           # Core application logic & functions
├── style.css                           # Main stylesheet
├── hover-widget.css                    # ⭐ Hover widget styles
├── hover-widget.js                     # ⭐ Hover widget navigation
├── README.md                           # Project README
├── js/
│   ├── dom_manager.js                 # DOM manipulation utilities
│   ├── table_renderer.js              # Table rendering logic
│   └── data_manager.js                # Data persistence & loading
├── modules/
│   ├── editManager.js                 # Inline editing functionality
│   ├── dynamic_form_helper.js         # Dynamic form generation
│   ├── table_fixes.js                 # Table styling fixes
│   ├── init_manager.js                # ⭐ INITIALIZATION MANAGER (load LAST)
│   ├── new_project_welcome.js         # New project popup
│   ├── currency_manager.js            # Currency & exchange rate management
│   ├── user_manager.js                # User profile management
│   ├── feature_toggle_manager.js      # Feature flag management
│   ├── tool_costs_manager.js          # Tool costs handling
│   ├── rate_card_merger.js            # Rate card conflict resolution
│   └── merge_manager.js               # Specialist estimate merging
├── Styles/
│   └── edit-styles.css                # Edit-specific styles
└── Documentation/
    └── 00_app_documentation.md        # This file
```

### File Responsibilities

#### `hover-widget.js` ⭐ NEW
- **What:** Provides side-panel navigation between Zyantik applications
- **Key features:**
  - Hover-activated sliding panel
  - Material Design SVG icons
  - Smooth animations
  - Configurable application list
  - Keyboard shortcut support (Ctrl/Cmd + M)
  - Mobile-responsive (hidden on mobile)
- **Global export:** `window.zyantikWidget` (HoverWidget instance)
- **Styling:** Requires `hover-widget.css`

#### `hover-widget.css` ⭐ NEW
- **What:** Styles for hover widget navigation
- **Key features:**
  - Zyantik dark navy brand colors
  - Smooth transitions and animations
  - Responsive design
  - Visual states (inactive, hover, active)
  - Material Design icon styling

#### `modules/editManager.js`
- **What:** Handles inline editing for all data types including rate cards
- **Key features:**
  - Inline editing with visual feedback
  - Unique role name validation (case-insensitive)
  - Required field validation
  - Keyboard shortcuts (Enter/Escape)
  - Data persistence integration
- **Global export:** `window.editManager` (class instance)

#### `modules/init_manager.js` ⭐ **START HERE**
- **What:** Central initialization orchestrator
- **When to modify:** Adding new modules, changing startup sequence
- **Key principle:** This is the ONLY file that should run initialization logic
- **Global export:** `window.initManager`

#### `script.js`
- **What:** Core application functions and business logic
- **Key principle:** NO DOMContentLoaded listener - only function definitions
- **Must export to window:**
  - `window.projectData`
  - `window.updateSummary`
  - `window.updateMonthHeaders`
  - `window.calculateProjectMonths`
  - `window.openModal`
  - `window.handleModalSubmit`
  - `window.deleteItem`
  - `window.initializeBasicFunctionality` ⭐ **CRITICAL**
  - `window.initializeProjectInfoSaveButton`
  - All calculation functions

---

## Feature Documentation

### Hover Widget Navigation ⭐ NEW

#### Overview

The Hover Widget provides a **persistent side-panel navigation** that allows users to quickly switch between different Zyantik applications (Cost Estimator, Portfolio Manager, etc.) without using the browser's back button or navigating through menus.

**Design Goals:**
- ✅ **Minimal UI Footprint** - Discreet when inactive, visible on hover
- ✅ **Brand Consistency** - Matches Zyantik dark navy theme
- ✅ **Professional Appearance** - Material Design icons, smooth animations
- ✅ **Mobile-Friendly** - Hidden on mobile devices to avoid interference
- ✅ **Accessible** - Keyboard shortcuts and clear visual states

#### Visual Design

**Brand Colors:**
- **Background:** `linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)` - Zyantik dark navy
- **Icons:** `#667eea` - Purple accent matching app theme
- **Hover States:** White backgrounds with shadow elevation

**States:**

**Inactive State:**
```
┌─────┐
│  ❯  │  ← Semi-transparent tab (30% opacity)
└─────┘     Subtle, barely visible
```

**Hover State:**
```
┌──────────────┬─────┐
│   📊         │  ❯  │  ← Panel slides out (140px)
│ Estimator    │     │     Full opacity gradient
│              │     │     Icons fade in
│   📁         │     │
│ Portfolio    │     │
└──────────────┴─────┘
```

**Active Icon Hover:**
```
┌──────────────┐
│   📊         │  ← Icon lifts up
│ Estimator    │     Background lightens
└──────────────┘     Shadow increases
```

#### Integration

**Files Required:**

1. **hover-widget.css** - Styling
   ```html
   <link rel="stylesheet" href="hover-widget.css">
   ```

2. **hover-widget.js** - Functionality
   ```html
   <script src="hover-widget.js"></script>
   ```

**Load Order:**
- CSS: In `<head>` after existing stylesheets
- JS: Before `init_manager.js` but after other modules

**Automatic Initialization:**
The widget initializes automatically on DOMContentLoaded with default configuration.

#### Configuration

**Default Configuration:**
```javascript
const widgetConfig = {
    items: [
        {
            id: 'estimator',
            label: 'Cost Estimator',
            iconSvg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
            url: 'index.html'
        },
        {
            id: 'portfolio',
            label: 'Portfolio Manager',
            iconSvg: '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 12H5V8h14v10z"/>',
            url: 'portfolio.html'
        }
    ],
    position: 'left'
};
```

**Adding Applications:**

To add new applications to the widget, edit the `widgetConfig` in `hover-widget.js`:

```javascript
{
    id: 'resource-manager',
    label: 'Resource Manager',
    iconSvg: '<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>',
    url: 'resources.html'
}
```

**Icon Selection:**

Use Material Design SVG paths from [Google Material Icons](https://fonts.google.com/icons). Popular icons for business applications:

| Icon | SVG Path | Use Case |
|------|----------|----------|
| 📊 Bar Chart | `<path d="M19 3H5c-1.1..."/>` | Analytics, Reports |
| 📁 Folder | `<path d="M20 6h-8l-2..."/>` | Files, Portfolio |
| 👥 People | `<path d="M16 11c1.66..."/>` | Resources, Teams |
| 📈 Trending Up | `<path d="M16 6l2.29..."/>` | Growth, Performance |
| ⚙️ Settings | `<path d="M19.14,12.94..."/>` | Configuration |
| 📅 Calendar | `<path d="M9 11H7v2h2v-2zm4..."/>` | Schedule, Timeline |

#### User Interaction

**Mouse Interaction:**
1. Hover over the arrow tab on left side
2. Panel slides out smoothly (400ms)
3. Icons fade in with slight delay (150ms)
4. Click any icon to navigate
5. Visual feedback: icon lifts and scales
6. Brief delay then navigation occurs

**Keyboard Shortcut:**
- **Ctrl+M** (Windows/Linux) or **Cmd+M** (Mac)
- Toggles force-open state
- Useful for accessibility

**Touch Devices:**
- Widget hidden on screens < 768px
- Prevents interference with touch navigation
- Mobile users rely on standard navigation

#### Technical Details

**CSS Classes:**

```css
.hover-widget-container      /* Main container, fixed position */
.widget-panel                /* Flexbox wrapper for content + tab */
.panel-content              /* Sliding content area */
.widget-tab                 /* Arrow tab trigger */
.widget-tab-arrow           /* Arrow icon (❯) */
.panel-icons                /* Icons container */
.icon-item                  /* Individual app icon button */
```

**Animations:**

```css
/* Panel slide-out */
transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);

/* Icon fade-in */
transition: opacity 0.4s ease 0.15s;

/* Icon hover */
transition: all 0.2s ease;
transform: translateY(-2px);
```

**Z-Index Management:**
- Widget: `z-index: 999`
- Modal overlays: `z-index: 1000`
- Widget stays below modals but above content

#### Styling Customization

**Changing Colors:**

```css
/* Inactive tab opacity */
.widget-tab {
    background: rgba(30, 58, 95, 0.3);  /* 30% opacity */
}

/* Active tab */
.hover-widget-container:hover .widget-tab {
    background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
}

/* Icon color */
.icon-item svg {
    fill: #667eea;  /* Purple accent */
}
```

**Adjusting Size:**

```css
/* Panel width when expanded */
.hover-widget-container:hover .panel-content {
    width: 140px;  /* Adjust as needed */
}

/* Tab dimensions */
.widget-tab {
    width: 30px;
    height: 80px;
}

/* Icon size */
.icon-item svg {
    width: 32px;
    height: 32px;
}
```

**Animation Speed:**

```css
/* Faster animation */
transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Slower animation */
transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
```

#### API Reference

**HoverWidget Class:**

```javascript
class HoverWidget {
    constructor(config)
    // Initialize widget with configuration
    
    init()
    // Set up widget structure and events
    
    createWidget()
    // Build DOM structure
    
    attachEventListeners()
    // Bind click and keyboard events
    
    handleNavigation(iconItem)
    // Process navigation with visual feedback
    
    addItem(item)
    // Dynamically add new application
    
    destroy()
    // Remove widget from DOM
}
```

**Global Access:**

```javascript
// Access widget instance
window.zyantikWidget

// Add application dynamically
window.zyantikWidget.addItem({
    id: 'new-app',
    label: 'New Application',
    iconSvg: '<path d="..."/>',
    url: 'new-app.html'
});

// Remove widget
window.zyantikWidget.destroy();
```

#### Browser Compatibility

**Tested Browsers:**
- ✅ Chrome 90+ (desktop/mobile)
- ✅ Firefox 88+ (desktop/mobile)
- ✅ Safari 14+ (desktop/mobile)
- ✅ Edge 90+ (desktop)

**Required Features:**
- CSS3 transitions
- CSS3 gradients
- Flexbox layout
- SVG support
- ES6 Classes
- addEventListener

**Fallback Behavior:**
- Degrades gracefully if CSS3 not supported
- Widget hidden if JavaScript disabled
- No layout breaking on older browsers

#### Responsive Design

**Breakpoints:**

```css
/* Desktop (default) */
@media (min-width: 769px) {
    .hover-widget-container { display: block; }
}

/* Mobile and Tablet */
@media (max-width: 768px) {
    .hover-widget-container { display: none; }
}
```

**Rationale:**
- Mobile devices have limited screen space
- Touch interaction with hover effects is problematic
- Mobile users typically use full-page navigation
- Prevents accidental activation

#### Testing Checklist

**Visual Testing:**
- [ ] Tab visible but subtle when inactive
- [ ] Panel slides out smoothly on hover
- [ ] Icons appear with fade-in effect
- [ ] Rounded corners render correctly
- [ ] Colors match Zyantik brand
- [ ] Shadows appear appropriate
- [ ] Icons are crisp (not blurry)

**Interaction Testing:**
- [ ] Hover activates panel
- [ ] Mouse leave deactivates panel
- [ ] Click navigates to correct URL
- [ ] Visual feedback on icon hover
- [ ] Visual feedback on icon click
- [ ] Keyboard shortcut works (Ctrl/Cmd+M)

**Responsive Testing:**
- [ ] Widget hidden on mobile (< 768px)
- [ ] Widget appears on tablet landscape
- [ ] No horizontal scrollbar introduced
- [ ] No layout shifts when activating

**Integration Testing:**
- [ ] Doesn't interfere with modals
- [ ] Doesn't block clickable elements
- [ ] Doesn't affect page scrolling
- [ ] Works with all navigation tabs
- [ ] Settings page displays correctly

#### Troubleshooting

**Problem: Widget not appearing**

**Checklist:**
1. ✅ `hover-widget.css` loaded in `<head>`?
2. ✅ `hover-widget.js` loaded before closing `</body>`?
3. ✅ Browser console shows no errors?
4. ✅ Screen width > 768px?
5. ✅ Widget not blocked by browser extension?

**Console Check:**
```javascript
// Verify widget loaded
window.zyantikWidget
// Should show HoverWidget instance

// Check initialization
console.log('✅ Zyantik Hover Widget initialized')
// Should appear in console
```

**Problem: Navigation not working**

**Checklist:**
1. ✅ URLs in config are correct?
2. ✅ Console shows navigation logs?
3. ✅ Click event firing? (check console)
4. ✅ Browser not blocking navigation?

**Console Debug:**
```javascript
// Should appear on icon click:
🚀 Navigating to: estimator
```

**Problem: Styling looks wrong**

**Checklist:**
1. ✅ CSS file fully loaded? (check Network tab)
2. ✅ No CSS conflicts with other styles?
3. ✅ Browser cache cleared?
4. ✅ Correct `hover-widget.css` version deployed?

**CSS Debug:**
```javascript
// Check computed styles
const widget = document.querySelector('.hover-widget-container');
window.getComputedStyle(widget).zIndex;  // Should be 999
window.getComputedStyle(widget).position; // Should be 'fixed'
```

**Problem: Icons not showing**

**Cause:** SVG paths invalid or missing

**Fix:**
1. Verify `iconSvg` property contains valid SVG path
2. Check SVG viewBox is `0 0 24 24`
3. Ensure `fill` attribute not set in path (CSS controls fill)

**Test SVG:**
```javascript
// Test icon rendering
const testItem = {
    id: 'test',
    label: 'Test',
    iconSvg: '<path d="M12 2L2 7l10 5 10-5-10-5z"/>',
    url: '#'
};
window.zyantikWidget.addItem(testItem);
```

#### Performance Considerations

**Optimization:**
- Widget uses CSS transitions (GPU-accelerated)
- Minimal JavaScript execution
- No external dependencies
- SVG icons are lightweight
- No image assets required

**Load Impact:**
- CSS file: ~3KB
- JavaScript file: ~4KB
- Total overhead: ~7KB
- Initialization: < 10ms

**Best Practices:**
- Load CSS in `<head>` for FOUC prevention
- Load JS before closing `</body>` for non-blocking
- Use CDN if serving multiple sites
- Minify CSS/JS for production

#### Accessibility

**Keyboard Navigation:**
- Tab key focuses icon items
- Enter activates focused icon
- Escape closes forced-open state
- Ctrl/Cmd+M toggles widget

**Screen Readers:**
```html
<!-- Add aria attributes for better accessibility -->
<div class="hover-widget-container" 
     role="navigation" 
     aria-label="Application Navigator">
```

**Color Contrast:**
- Icons: 4.5:1 contrast ratio (WCAG AA)
- Text labels: 4.5:1 contrast ratio (WCAG AA)
- Hover states: Enhanced contrast

#### Future Enhancements

**Planned Features:**
1. **Active State Indicator** - Highlight current application
2. **Badge Notifications** - Show unread counts (e.g., "3 pending items")
3. **Recent Apps** - Track and display recently visited
4. **User Preferences** - Position customization (left/right)
5. **Animation Settings** - Speed adjustment or disable
6. **Tooltips** - Full app descriptions on hover
7. **Drag to Reorder** - Custom icon ordering
8. **Search** - Filter applications by name

**Under Consideration:**
- Dark mode variant
- Compact mode (smaller icons)
- Horizontal orientation (top/bottom)
- Multi-level navigation (sub-menus)
- Pin/unpin applications

---

### Currency Management

#### Overview
The Currency Manager module provides comprehensive currency management including:
- Primary currency selection from 33 global currencies
- Exchange rate management (manual entry)
- Currency conversion utilities
- Persistent storage of settings

[... rest of existing Currency Management section ...]

---

### Merge Functionality

[... existing Merge Functionality section ...]

---

### Rate Card Editing

[... existing Rate Card Editing section ...]

---

## Troubleshooting

### Problem: Hover widget not appearing ⭐ NEW

**Cause:** Files not loaded or screen too small

**Checklist:**
1. ✅ `hover-widget.css` linked in `<head>`?
2. ✅ `hover-widget.js` loaded before closing `</body>`?
3. ✅ Screen width > 768px? (hidden on mobile)
4. ✅ Browser console shows no errors?
5. ✅ Check Network tab - files loaded successfully?

**Console Check:**
```javascript
// Verify widget exists
window.zyantikWidget
// Should return HoverWidget instance

// Check initialization message
// Should see: ✅ Zyantik Hover Widget initialized
```

**Fix:**
```html
<!-- In <head> -->
<link rel="stylesheet" href="hover-widget.css">

<!-- Before </body> -->
<script src="hover-widget.js"></script>
```

### Problem: Widget navigation not working ⭐ NEW

**Cause:** Invalid URLs or click handler not firing

**Console Check:**
```javascript
// Click should show:
🚀 Navigating to: estimator

// If no log appears, click handler not attached
```

**Fix:**
1. Verify URLs in `widgetConfig` are correct
2. Check `iconItem.dataset.url` is set
3. Ensure no JavaScript errors blocking execution
4. Test with simple URL first (e.g., `url: '#'`)

### Problem: Widget styling incorrect ⭐ NEW

**Cause:** CSS conflicts or cache issues

**Fix:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check for CSS conflicts in DevTools
3. Verify correct `hover-widget.css` version deployed
4. Inspect computed styles in DevTools

**CSS Validation:**
```javascript
// Check key styles
const widget = document.querySelector('.hover-widget-container');
getComputedStyle(widget).position;  // Should be 'fixed'
getComputedStyle(widget).zIndex;    // Should be '999'
getComputedStyle(widget).left;      // Should be '0px'
```

### Problem: "Timeout waiting for function: updateSummary"

[... existing troubleshooting sections ...]

---

## Quick Reference: Module Checklist

When creating a new module, ensure:

- [ ] Module file created in appropriate directory
- [ ] Class or object pattern used
- [ ] Constructor initializes state
- [ ] `initialize()` method for setup (if needed)
- [ ] Exported to window: `window.moduleName = new ModuleName()`
- [ ] Console log on load: `console.log('Module Name loaded')`
- [ ] Added to index.html (before init_manager.js)
- [ ] Dependencies loaded before this module
- [ ] Registered in init_manager.js modules object
- [ ] Comma added after previous module in modules object
- [ ] Initialization code added to init_manager.initialize() if needed
- [ ] Public methods documented
- [ ] Dependencies checked before use
- [ ] Error handling implemented
- [ ] Tested in isolation and integrated
- [ ] Console logs added for debugging
- [ ] Validation rules documented (for editing features)
- [ ] User feedback implemented (for validation errors)
- [ ] Data persistence tested (for data modifications)
- [ ] **CSS loaded if module has styling** ⭐ NEW
- [ ] **Responsive behavior tested** ⭐ NEW

---

## Version History

### v3.2 - Hover Widget Navigation (Current) ⭐ NEW
- ✅ Added hover-activated navigation widget
- ✅ Material Design SVG icons
- ✅ Zyantik dark navy brand colors
- ✅ Smooth slide-out animations (400ms)
- ✅ Configurable application list
- ✅ Keyboard shortcut (Ctrl/Cmd + M)
- ✅ Mobile-responsive (hidden < 768px)
- ✅ Professional visual states
- ✅ No external dependencies
- ✅ Lightweight (~7KB total)

### v3.1 - Rate Card Editing
- ✅ Added inline rate card editing functionality
- ✅ Unique role name validation (case-insensitive)
- ✅ Required field validation
- ✅ Keyboard shortcuts (Enter/Escape)
- ✅ Visual feedback (yellow highlight, save/cancel buttons)
- ✅ Data persistence integration
- ✅ Integration with existing edit patterns
- ✅ Comprehensive error messages
- ✅ Self-edit exception (allows keeping same role name)
- ✅ Updated initialization sequence (Step 16)
- ✅ Enhanced EditManager with rate-card support

### v3.0 - Merge Functionality
- ✅ Added Merge Manager module
- ✅ Added Rate Card Merger module
- ✅ Multi-step merge workflow (4 steps)
- ✅ File validation and structure checking
- ✅ Project timeline comparison and alignment
- ✅ Rate card conflict detection and resolution
- ✅ Transactional merge with backup/rollback
- ✅ Resource data merging with tagging
- ✅ Referential integrity maintenance
- ✅ Comprehensive error handling and user feedback
- ✅ Updated initialization sequence (Steps 15-16)

### v2.1 - Currency Management
- ✅ Added Currency Manager module
- ✅ Primary currency selection (33 global currencies)
- ✅ Exchange rate management
- ✅ Currency conversion utilities
- ✅ Settings page currency tab
- ✅ Updated initialization sequence (Step 11)

### v2.0 - Init Manager Pattern
- ✅ Centralized initialization with init_manager.js
- ✅ Removed DOMContentLoaded from script.js
- ✅ Proper module dependency management
- ✅ Comprehensive error handling and logging
- ✅ Cleaner code structure

### v1.0 - Initial Release
- Multiple DOMContentLoaded listeners (deprecated)
- Mixed initialization across files (deprecated)

---

## Support & Contribution

When asking for help or suggesting improvements:

1. **Always mention you're using the Init Manager pattern**
2. **Provide the console log output** (especially initialization messages)
3. **Reference this documentation** so context is clear
4. **Describe which module you're working on**
5. **Note any deviations from these patterns**
6. **For merge issues, include:**
   - File structure of both master and specialist files
   - Console logs from merge process
   - Specific error messages
   - Step where merge failed
7. **For rate card issues, include:**
   - Rate card data structure
   - Validation error messages
   - Edit operation attempted
   - Console logs during edit
8. **For editing issues, include:**
   - Item type being edited (rate-card, internal-resource, etc.)
   - Data values before and after edit
   - Validation error messages
   - Whether changes persisted
   - Console logs during edit operation
9. **For hover widget issues, include:** ⭐ NEW
   - Browser and version
   - Screen size/resolution
   - Console logs and errors
   - Network tab showing file loads
   - Screenshots of visual issues
   - Steps to reproduce

This ensures efficient problem-solving and maintains architectural consistency.

---

**Last Updated:** December 2024  
**Maintained By:** Project Development Team  
**Architecture Pattern:** Centralized Initialization Manager  
**Latest Feature:** Hover Widget Navigation v3.2 with Material Design Icons
