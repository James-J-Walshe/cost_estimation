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
  - [Rate Card Editing](#rate-card-editing) ⭐ NEW
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
- **Inline rate card editing** ⭐ NEW
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
   Step 16: Initialize Edit Manager ⭐ NEW
   Step 17: Final re-render after delay
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
            editManager: false,        // ⭐ Critical for rate card editing
            dynamicFormHelper: false,
            domManager: false,
            tableFixes: false,
            newProjectWelcome: false,
            currencyManager: false,
            userManager: false,
            featureToggleManager: false,
            toolCostsManager: false,
            rateCardMerger: false,
            mergeManager: false
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
<script src="modules/editManager.js"></script> <!-- ⭐ Required for rate card editing -->
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
├── README.md                           # Project README
├── js/
│   ├── dom_manager.js                 # DOM manipulation utilities
│   ├── table_renderer.js              # Table rendering logic
│   └── data_manager.js                # Data persistence & loading
├── modules/
│   ├── editManager.js                 # ⭐ Inline editing functionality (includes rate cards)
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

#### `modules/editManager.js` ⭐ **Critical for Rate Card Editing**
- **What:** Handles inline editing for all data types including rate cards
- **Key features:**
  - Inline editing with visual feedback
  - Unique role name validation (case-insensitive)
  - Required field validation
  - Keyboard shortcuts (Enter/Escape)
  - Data persistence integration
- **Global export:** `window.editManager` (class instance)
- **Supports item types:**
  - `internal-resource` - Internal resource allocations
  - `vendor-cost` - Vendor cost entries
  - `tool-cost` - Tool and license costs
  - `misc-cost` - Miscellaneous expenses
  - `risk` - Risk assessments
  - `rate-card` ⭐ NEW - Rate card entries
- **Key methods:**
  - `handleEditClick(button)` - Enter edit mode
  - `handleSaveEdit(button)` - Save changes
  - `handleCancelEdit(button)` - Revert changes
  - `extractRowData(row, itemType)` - Get current values
  - `convertToEditInputs(row, itemType, data)` - Create edit inputs
  - `validateEditData(data, itemType, itemId)` - Validate with unique checks
  - `updateItemData(itemId, newData, itemType)` - Update data structure

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

#### `modules/rate_card_merger.js`
- **What:** Handles rate card conflict detection and resolution during merge
- **Key features:**
  - Analyzes rate cards between master and specialist files
  - Detects conflicts (different rates for same role)
  - Identifies new rate cards to add
  - Transactional merge with backup/rollback
  - Maintains referential integrity
- **Global export:** `window.RateCardMerger` (class instance)
- **Must load:** BEFORE merge_manager.js (dependency)

#### `modules/merge_manager.js`
- **What:** Orchestrates specialist team estimate merging workflow
- **Key features:**
  - Multi-step merge wizard
  - Project timeline alignment
  - Resource data merging
  - Integration with RateCardMerger
- **Global export:** `window.mergeManager` (class instance)
- **Depends on:** `window.RateCardMerger` (optional, graceful fallback)

#### `modules/currency_manager.js`
- **What:** Manages currency selection and exchange rates
- **Global export:** `window.currencyManager`
- **Must have:** `initialize()` method called by init_manager

#### Module Files (`js/*.js` and `modules/*.js`)
- **What:** Specific functionality modules
- **Key principle:** Export module to window, but DON'T initialize automatically
- **Pattern:**
  ```javascript
  class MyModule {
      constructor() { }
      initialize() { }
      // ... methods
  }
  window.myModule = new MyModule();
  ```

---

## Development Guidelines

### Adding a New Module

1. **Create the module file**
   ```javascript
   // modules/my_new_module.js
   class MyNewModule {
       constructor() {
           console.log('My New Module initialized');
       }

       initialize() {
           // Setup code here
       }

       myMethod() {
           // Functionality here
       }
   }

   window.myNewModule = new MyNewModule();
   console.log('My New Module loaded');
   ```

2. **Add script tag to index.html** (BEFORE init_manager.js)
   ```html
   <script src="modules/my_new_module.js"></script>
   ```

3. **Register in init_manager.js** ⚠️ **CRITICAL: Don't forget the comma!**
   ```javascript
   this.modules = {
       // ... existing modules
       editManager: false,        // ← MUST have comma here
       myNewModule: false         // ← Add your module (no comma if last)
   };

   // In checkModules()
   this.modules.myNewModule = !!(window.myNewModule || window.MyNewModule);

   // In initialize() - add initialization step if needed
   if (this.modules.myNewModule && typeof window.myNewModule.initialize === 'function') {
       window.myNewModule.initialize();
       console.log('✓ My New Module initialized');
   }
   ```

### Adding Global Functions

Any function that needs to be called from other modules MUST be exported to window:

```javascript
// In script.js or module file

function myFunction() {
    // Function code
}

// CRITICAL: Export to window
window.myFunction = myFunction;
```

### Event Listener Setup

**All DOM event listeners should be set up in ONE place:**

```javascript
// script.js - initializeBasicFunctionality()

function initializeBasicFunctionality() {
    // Tab listeners
    // Button listeners
    // Modal listeners
    // Form listeners
}

// Export it
window.initializeBasicFunctionality = initializeBasicFunctionality;
```

**This function is called by init_manager.js** - you don't need to call it manually.

---

## Common Patterns

### Pattern 1: Module with Initialization

```javascript
// modules/example_module.js

class ExampleModule {
    constructor() {
        this.data = [];
        console.log('Example Module constructor called');
    }

    initialize() {
        console.log('Example Module initializing...');
        this.setupEventListeners();
        this.loadData();
    }

    setupEventListeners() {
        // Add event listeners here
    }

    loadData() {
        // Load data here
    }

    publicMethod() {
        // Public API
    }
}

// Create and export instance
window.exampleModule = new ExampleModule();
console.log('Example Module loaded');
```

### Pattern 2: Checking for Dependencies

```javascript
// In your module

myMethod() {
    // Check if dependency exists
    if (window.TableRenderer && typeof window.TableRenderer.renderAllTables === 'function') {
        window.TableRenderer.renderAllTables();
    } else if (window.tableRenderer && typeof window.tableRenderer.renderAllTables === 'function') {
        window.tableRenderer.renderAllTables();
    } else {
        console.warn('TableRenderer not available');
    }
}
```

### Pattern 3: Fallback Functions

```javascript
// Always provide fallbacks for critical operations

function saveProjectFallback() {
    if (window.DataManager) {
        window.DataManager.saveProject();
    } else if (window.dataManager) {
        window.dataManager.saveProject();
    } else {
        // Basic fallback implementation
        try {
            localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            console.log('Project saved using fallback method');
        } catch (e) {
            console.error('Error saving project:', e);
        }
    }
}
```

### Pattern 4: Global Data Access

```javascript
// ALWAYS access projectData through window

// ✅ CORRECT
window.projectData.projectInfo.projectName = 'New Project';

// ❌ WRONG (might reference local scope)
projectData.projectInfo.projectName = 'New Project';
```

### Pattern 5: Transactional Operations

```javascript
// Use backup/rollback pattern for critical data operations

class DataModule {
    performCriticalOperation(data) {
        try {
            // Step 1: Create backup
            const backup = JSON.parse(JSON.stringify(data));
            
            // Step 2: Perform operation
            this.modifyData(data);
            
            // Step 3: Validate result
            if (!this.validateData(data)) {
                throw new Error('Validation failed');
            }
            
            return { success: true, data };
            
        } catch (error) {
            // Step 4: Rollback on error
            console.error('Operation failed, rolling back:', error);
            Object.assign(data, backup);
            return { success: false, error: error.message };
        }
    }
}
```

### Pattern 6: Inline Editing ⭐ NEW

```javascript
// Standard pattern for inline editing across all data types

class EditManager {
    handleEditClick(button) {
        const itemId = button.dataset.id;
        const itemType = button.dataset.type;  // 'rate-card', 'internal-resource', etc.
        const row = button.closest('tr');
        
        // Store original values
        this.originalValues.set(itemId, this.extractRowData(row, itemType));
        
        // Convert to edit mode
        this.convertToEditInputs(row, itemType, originalData);
    }
    
    handleSaveEdit(button) {
        const itemId = button.dataset.id;
        const editState = this.editingStates.get(itemId);
        
        // Extract edited values
        const newData = this.extractEditData(row, editState.type);
        
        // Validate (includes unique checks for rate cards)
        if (!this.validateEditData(newData, editState.type, itemId)) {
            return;  // Stay in edit mode
        }
        
        // Update data
        this.updateItemData(itemId, newData, editState.type);
        
        // Re-render tables
        window.tableRenderer.renderAllTables();
    }
}
```

---

## Feature Documentation

### Currency Management

#### Overview
The Currency Manager module provides comprehensive currency management including:
- Primary currency selection from 33 global currencies
- Exchange rate management (manual entry)
- Currency conversion utilities
- Persistent storage of settings

#### Using the Currency Manager

**Setting Primary Currency:**
```javascript
// Access current primary currency
const primaryCurrency = window.projectData.currency.primaryCurrency;  // 'USD'

// Change primary currency (through UI or programmatically)
window.projectData.currency.primaryCurrency = 'EUR';
window.currencyManager.updateCurrencyDisplay();
```

**Managing Exchange Rates:**
```javascript
// Add an exchange rate
window.currencyManager.addExchangeRate('EUR', 0.85);

// Delete an exchange rate
window.currencyManager.deleteExchangeRate(rateId);

// Get all exchange rates
const rates = window.projectData.currency.exchangeRates;
```

**Converting Currency:**
```javascript
// Convert 100 USD to EUR
const converted = window.currencyManager.convertCurrency(100, 'USD', 'EUR');

// Get currency symbol
const symbol = window.currencyManager.getCurrencySymbol('USD');  // '$'
const name = window.currencyManager.getCurrencyName('USD');      // 'US Dollar'
```

#### Supported Currencies
**Top 10 (Priority Display):**
USD, EUR, GBP, JPY, CNY, AUD, CAD, CHF, INR, SGD

**Additional 23 Currencies:**
AED, ARS, BRL, CZK, DKK, HKD, HUF, IDR, ILS, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, THB, TRY, TWD, ZAR

#### Data Structure
```javascript
{
  currency: {
    primaryCurrency: 'USD',           // ISO 4217 code
    exchangeRates: [
      {
        id: 1234567890,              // Timestamp ID
        currency: 'EUR',              // Target currency
        rate: 0.85,                   // 1 primary = rate target
        lastUpdated: '2024-10-10'     // ISO date string
      }
    ]
  }
}
```

---

### Merge Functionality

#### Overview

The Merge functionality allows central project managers to merge specialist team estimates into a master project file. This is essential for collaborative project estimation where different teams work on separate portions of a project.

**Use Case:**
- Central PM creates master project with overall timeline and structure
- Specialist teams (e.g., Infrastructure, Security, Development) create their own detailed estimates
- Central PM merges specialist estimates into master file
- System handles timeline alignment, rate card conflicts, and data integration

#### Architecture

The merge system consists of two primary modules working together:

1. **MergeManager** (`merge_manager.js`)
   - Orchestrates the multi-step merge workflow
   - Handles file validation and UI flow
   - Manages date comparison and selection
   - Coordinates with RateCardMerger for conflict resolution

2. **RateCardMerger** (`rate_card_merger.js`)
   - Analyzes rate cards for conflicts
   - Provides transactional merge execution
   - Maintains referential integrity
   - Supports rollback on failure

#### Merge Workflow

**Step 1: File Selection & Validation**
- User selects specialist file via file input
- System validates JSON structure and required fields
- Displays file metadata (resource counts, dates, team info)

**Step 2: Date Comparison**
- Compares project timelines (master vs specialist)
- Shows start/end date differences
- Calculates duration variances
- Displays impact warnings

**Step 3: Rate Card Review** (Conditional)
- Analyzes rate cards using RateCardMerger
- Identifies conflicts (same role, different rates)
- Identifies new cards to add
- Allows user to resolve conflicts

**Step 4: Date Selection & Final Merge**
- Choose timeline: Keep Master, Adopt Specialist, or Custom
- Execute merge with selected options
- Tag all merged data with "(Specialist Team)"
- Update all displays and save

#### Key Features

✅ **File Validation** - Comprehensive structure checking
✅ **Timeline Alignment** - Three date selection options
✅ **Rate Card Management** - Conflict detection and resolution
✅ **Data Integrity** - Backup, rollback, reference updating
✅ **User Feedback** - Step-by-step progress and clear messages

For complete merge functionality documentation, see the Merge Functionality section above.

---

### Rate Card Editing ⭐ NEW

#### Overview

The Rate Card editing feature provides **inline editing** of rate card entries directly within the Settings → Rate Cards table. Users can modify role names, categories, and daily rates without navigating to separate forms or dialogs.

**Key Benefits:**
- ✅ **Faster Updates** - Edit in-place with fewer clicks
- ✅ **Data Integrity** - Unique role name validation prevents duplicates
- ✅ **User-Friendly** - Visual feedback and clear error messages
- ✅ **Keyboard Support** - Enter to save, Escape to cancel
- ✅ **Consistent UX** - Matches edit patterns used throughout the app

#### Accessing Rate Card Editing

1. Navigate to **Settings** (⚙️ icon in top navigation)
2. Select **Rate Cards** in the left sidebar
3. Click **Edit** button (pencil icon) on any rate card
4. Row highlights in yellow and fields become editable
5. Modify fields as needed
6. **Save** (✓) or **Cancel** (✗)

#### Editable Fields

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| **Role** | Text Input | Required, Must be unique | Case-insensitive uniqueness |
| **Category** | Dropdown | Required (Internal/External) | Determines resource type |
| **Daily Rate** | Number Input | Required, Must be ≥ 0 | Zero is valid (volunteer roles) |

#### Visual States

**Normal Mode:**
```
┌──────────────────┬──────────┬────────┬──────────────┐
│ Senior Consultant│ EXTERNAL │ 1,200  │ [✏️] [🗑️]   │
└──────────────────┴──────────┴────────┴──────────────┘
```

**Edit Mode:**
```
┌──────────────────────────────────────────────────────┐
│ [Senior Consultant  ] │ [External ▼] │ [1200] │ [✅] [❌] [🗑️] │
└──────────────────────────────────────────────────────┘
Yellow highlight, input fields, Save/Cancel buttons
```

#### Validation Rules

**1. Unique Role Name (Case-Insensitive)**
```javascript
// These are all considered duplicates:
"Developer" = "developer" = "DEVELOPER" = "DEvELoPeR"

// Error message:
"A rate card with the role 'Developer' already exists. 
Please use a unique role name."
```

**Self-Edit Exception:**
- Editing "Developer" and keeping name "Developer" → ✅ Allowed
- Changing only rate or category, keeping same role → ✅ Allowed

**2. Required Fields**
All three fields must have values:
- Role: Cannot be empty
- Category: Must select Internal or External
- Rate: Must be number ≥ 0

**3. Rate Validation**
- ✅ Zero (0) is valid for volunteer roles
- ✅ Decimals allowed (e.g., 1250.50)
- ✅ Large values accepted (e.g., 999,999)
- ❌ Negative values rejected

#### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| **Enter** | Save changes | While in edit mode |
| **Escape** | Cancel editing | While in edit mode |
| **Tab** | Navigate between fields | While in edit mode |

#### Integration with Internal Resources

**Important Behavior:**  
When a rate card is edited, existing Internal Resources using that rate card **DO NOT** automatically update. This is intentional:

```javascript
// Before edit:
Rate Card: "Developer" → 600
Internal Resource: "Developer" → dailyRate: 600

// After editing rate card to 750:
Rate Card: "Developer" → 750
Internal Resource: "Developer" → dailyRate: 600 (unchanged)

// New resources added AFTER edit will use 750
```

**Rationale:**
- Preserves historical cost data
- Prevents unexpected budget changes
- Gives users control over rate updates
- Aligns with project accounting best practices

#### Code Implementation

**EditManager Pattern:**
```javascript
// editManager.js handles all inline editing

class EditManager {
    constructor() {
        this.editingStates = new Map();
        this.originalValues = new Map();
        this.setupEventListeners();
    }
    
    // Rate card editing uses these methods:
    extractRowData(row, 'rate-card') {
        // Extracts: role, category (from badge), rate
    }
    
    convertToEditInputs(row, 'rate-card', data) {
        // Creates: text input, dropdown, number input
    }
    
    validateEditData(data, 'rate-card', itemId) {
        // Validates: required fields, unique name, rate >= 0
        // Returns: boolean + shows alert if invalid
    }
    
    updateItemData(itemId, newData, 'rate-card') {
        // Calls: window.updateItemById()
        // Updates: projectData.rateCards array
    }
}
```

**Table Renderer Integration:**
```javascript
// js/table_renderer.js generates edit buttons

renderUnifiedRateCardsTable() {
    rateCards.forEach(rate => {
        row.innerHTML = `
            <td>${rate.role}</td>
            <td><span class="category-badge category-${rate.category.toLowerCase()}">
                ${rate.category}
            </span></td>
            <td>${rate.rate.toLocaleString()}</td>
            <td>${this.createActionButtons(rate.id, 'rate-card')}</td>
        `;
    });
}

createActionButtons(itemId, itemType) {
    return `
        <button class="edit-btn icon-btn" 
                data-id="${itemId}" 
                data-type="${itemType}">
            <!-- Edit icon SVG -->
        </button>
        <button class="delete-btn icon-btn" 
                data-id="${itemId}" 
                data-type="${itemType}">
            <!-- Delete icon SVG -->
        </button>
    `;
}
```

#### Data Flow

```
User clicks Edit
    ↓
handleEditClick(button)
    ↓
extractRowData(row, 'rate-card')
    → Store original: {role, category, rate}
    ↓
convertToEditInputs(row, 'rate-card', data)
    → Replace cells with inputs
    → Show Save/Cancel buttons
    ↓
User modifies fields
    ↓
User clicks Save (or presses Enter)
    ↓
handleSaveEdit(button)
    ↓
extractEditData(row, 'rate-card')
    → Get edited values from inputs
    ↓
validateEditData(data, 'rate-card', itemId)
    ├─ Required fields? ✓
    ├─ Unique name? ✓ (case-insensitive, excludes self)
    └─ Rate >= 0? ✓
    ↓
updateItemData(itemId, newData, 'rate-card')
    → window.updateItemById()
    → Update projectData.rateCards
    ↓
window.tableRenderer.renderAllTables()
    → Re-render with new values
    ↓
window.DataManager.saveToLocalStorage()
    → Persist changes
    ↓
Success!
```

#### UI/UX Patterns

**Visual Feedback:**
```css
/* Row in edit mode */
tr.editing {
    background-color: #fffbeb;  /* Light yellow */
    border: 2px solid #fbbf24;  /* Yellow border */
}

/* Action buttons */
.icon-btn.success {
    background-color: #10b981;  /* Green save */
}

.icon-btn.secondary {
    background-color: #6b7280;  /* Grey cancel */
}
```

**Button Placement:**
```
[✅ Save] [❌ Cancel] [🗑️ Delete]
 Primary   Secondary   Destructive
 Green     Grey        Red
```

**Category Badges:**
```css
.category-internal {
    background: #dcfce7;  /* Light green */
    color: #166534;       /* Dark green */
}

.category-external {
    background: #dbeafe;  /* Light blue */
    color: #1e40af;       /* Dark blue */
}
```

#### Testing Scenarios

**Basic Functionality:**
- ✅ Click Edit → Row enters edit mode
- ✅ Fields become editable
- ✅ Save button works
- ✅ Cancel button works
- ✅ Changes persist after refresh

**Validation Testing:**
- ✅ Empty role name rejected
- ✅ Duplicate role name rejected (exact match)
- ✅ Duplicate role name rejected (case variation: "Developer" vs "developer")
- ✅ Self-edit allowed (same role name)
- ✅ Negative rate rejected
- ✅ Zero rate accepted

**Keyboard Navigation:**
- ✅ Tab moves between fields
- ✅ Enter saves changes
- ✅ Escape cancels editing

**Edge Cases:**
- ✅ Special characters in role names
- ✅ Very long role names (100+ chars)
- ✅ Large rate values (999,999)
- ✅ Decimal rates (1250.50)

#### Error Messages

**Duplicate Role Name:**
```
⚠️ Alert: "A rate card with the role 'Developer' already exists. 
Please use a unique role name."
```

**Required Fields:**
```
⚠️ Alert: "Please fill in all required fields:
- Role name
- Category (Internal/External)
- Daily Rate (must be 0 or greater)"
```

#### Best Practices

**For Project Managers:**
- Use descriptive, specific role names ("Senior Java Developer" not just "Developer")
- Be consistent with naming conventions across projects
- Review rate cards periodically for accuracy
- Update resource rates manually if needed (not automatic)

**For Developers:**
- Always check `window.editManager` is loaded before using
- Verify edit buttons have `data-type="rate-card"` attribute
- Test with files containing duplicate names
- Handle graceful degradation if module unavailable

#### Console Logging

**Successful Edit:**
```
Edit Manager loaded with Rate Card editing support and unique role name validation
Updating item: Senior Consultant {role: "Senior Technical Consultant", category: "External", rate: 1300} rate-card
Rate cards merge completed successfully
✅ Summary updated after merge
```

**Validation Error:**
```
No edit state found for item: Developer
Validation failed: Duplicate role name detected
```

#### Troubleshooting

**Problem: Edit button not working**
- ✅ Check `window.editManager` exists in console
- ✅ Verify editManager.js loaded in HTML
- ✅ Check console for JavaScript errors
- ✅ Force refresh browser (Ctrl+F5)

**Problem: Fields not becoming editable**
- ✅ Check `data-type="rate-card"` on edit button
- ✅ Verify `convertToEditInputs` has rate-card case
- ✅ Check cells array has expected elements

**Problem: Duplicate validation not working**
- ✅ Verify `projectData.rateCards` populated
- ✅ Check `.toLowerCase()` comparison used
- ✅ Ensure `itemId` exclusion logic correct

**Problem: Changes not persisting**
- ✅ Check localStorage not in private/incognito mode
- ✅ Verify `DataManager.saveToLocalStorage()` called
- ✅ Check for errors in save operation

#### Future Enhancements

**Planned Improvements:**
1. **Batch Editing** - Edit multiple rate cards simultaneously
2. **Rate Card Templates** - Pre-defined sets for quick setup
3. **Historical Rate Tracking** - Track rate changes over time
4. **Usage Analytics** - Show which rate cards are most used
5. **Import/Export** - CSV import/export for rate cards
6. **Rate Calculator** - Show weekly/monthly/annual equivalents

#### Data Structure

```javascript
// Rate card object
{
    id: 'rc-1',              // Unique identifier
    role: 'Developer',        // Role name (unique, case-insensitive)
    category: 'Internal',     // 'Internal' or 'External'
    rate: 600                // Daily rate (number >= 0)
}

// Stored in projectData
window.projectData = {
    // ... other data
    rateCards: [
        {id: 'rc-1', role: 'Developer', category: 'Internal', rate: 600},
        {id: 'rc-2', role: 'Consultant', category: 'External', rate: 1200},
        // ... more rate cards
    ]
}
```

#### API Reference

**EditManager Methods for Rate Cards:**

| Method | Parameters | Returns | Purpose |
|--------|-----------|---------|---------|
| `extractRowData()` | row, 'rate-card' | {role, category, rate} | Get current values |
| `convertToEditInputs()` | row, 'rate-card', data | void | Create edit inputs |
| `validateEditData()` | data, 'rate-card', itemId | boolean | Validate with unique check |
| `getCategoryOptions()` | selectedCategory | HTML string | Generate dropdown |
| `handleEditClick()` | button | void | Enter edit mode |
| `handleSaveEdit()` | button | void | Save and validate |
| `handleCancelEdit()` | button | void | Revert changes |

**Global Functions:**

```javascript
// Update item in data structure
window.updateItemById(itemId, newData, 'rate-card')

// Re-render all tables
window.tableRenderer.renderAllTables()

// Save to localStorage
window.DataManager.saveToLocalStorage()
```

---

## Troubleshooting

### Problem: "Timeout waiting for function: updateSummary"

**Cause:** The function isn't exported to window

**Fix:** In script.js, ensure:
```javascript
window.updateSummary = updateSummary;
```

### Problem: Tabs/buttons not working

**Cause:** Event listeners not being set up

**Fix:** Ensure `initializeBasicFunctionality()` is:
1. Defined in script.js
2. Exported to window: `window.initializeBasicFunctionality = initializeBasicFunctionality;`
3. Called by init_manager.js in the `initializeDOMManager()` method

### Problem: "Uncaught SyntaxError: Unexpected identifier"

**Cause:** Missing comma before the new module in the modules object

**Fix:** In init_manager.js, ensure there's a comma after the previous module:
```javascript
this.modules = {
    // ... other modules
    mergeManager: false,       // ← MUST have comma here
    editManager: false         // ← Add module (no comma if last)
};
```

### Problem: Edit button not working ⭐ NEW

**Cause:** EditManager not loaded or edit button missing data attribute

**Checklist:**
1. ✅ editManager.js loaded in HTML?
2. ✅ Console shows "Edit Manager loaded with Rate Card editing support"?
3. ✅ Edit button has `data-type="rate-card"` attribute?
4. ✅ `window.editManager` exists in console?

**Fix:**
```html
<!-- Ensure editManager.js loaded -->
<script src="modules/editManager.js"></script>
```

### Problem: Duplicate validation not working ⭐ NEW

**Cause:** Rate card validation not checking correctly

**Console Check:**
```javascript
// Test in console:
window.editManager.validateEditData(
    {role: 'Developer', category: 'Internal', rate: 600}, 
    'rate-card', 
    'test-id'
)
// Should return true/false and show alert if duplicate
```

**Fix:** Verify:
1. `projectData.rateCards` populated with current data
2. `.toLowerCase()` comparison being used
3. `itemId` exclusion logic correct

### Problem: Rate card changes not persisting ⭐ NEW

**Cause:** localStorage not saving or browser in private mode

**Console Check:**
```javascript
// Check localStorage:
localStorage.getItem('projectData')
// Should contain rate cards with updated values
```

**Fix:**
1. Exit private/incognito browsing
2. Verify `DataManager.saveToLocalStorage()` called after edit
3. Check browser allows localStorage

### Problem: Module not loading

**Checklist:**
1. ✅ Script tag in index.html? (before init_manager.js)
2. ✅ Module exports to window? (`window.myModule = ...`)
3. ✅ Module registered in init_manager.js modules list?
4. ✅ **Comma added after previous module?** ⚠️ Common mistake!
5. ✅ Check browser console for loading errors

---

## Best Practices

### DO ✅

- **Use init_manager for all initialization** - Keep startup logic centralized
- **Export critical functions to window** - Make them accessible to all modules
- **Check dependencies before using them** - Handle missing modules gracefully
- **Log initialization steps** - Use console.log with ✓ for successful steps
- **Provide fallback implementations** - Don't break if a module is missing
- **Use consistent naming** - Either MyModule or myModule, but be consistent
- **Comment your code** - Especially initialization and integration points
- **Test in isolation** - Each module should work independently when possible
- **Add commas in object literals** - Remember the comma before adding new properties ⚠️
- **Load modules in correct order** - Dependencies first
- **Use transactional patterns** - Backup before critical operations, rollback on error
- **Validate user input** - Prevent bad data at the source
- **Provide clear error messages** - Users should understand what went wrong
- **Test with realistic data** - Include edge cases and special characters
- **Document validation rules** - Make constraints clear to users and developers

### DON'T ❌

- **Don't add DOMContentLoaded listeners in multiple files** - Use init_manager only
- **Don't initialize on file load** - Wait for init_manager to call initialize()
- **Don't assume modules are loaded** - Always check before using
- **Don't use setTimeout for initialization** - Use init_manager's waitForFunction()
- **Don't hardcode dependencies** - Check for availability at runtime
- **Don't mix global and local scope** - Always be explicit with window.
- **Don't duplicate functions** - Check for existing implementations first
- **Don't skip error handling** - Wrap critical code in try-catch blocks
- **Don't forget commas in modules object** - This causes syntax errors! ⚠️
- **Don't skip validation** - Always validate before updating data
- **Don't assume uniqueness** - Always check for duplicates when required
- **Don't modify data without backup** - Use transactional approach
- **Don't use ambiguous error messages** - Be specific about what's wrong
- **Don't forget to re-render** - Update UI after data changes

---

## Initialization Flow Diagram

```
Browser Loads Page
      ↓
All module scripts load in order:
  - dom_manager
  - table_renderer
  - data_manager
  - editManager ⭐ (Rate card editing)
  - dynamic_form_helper
  - table_fixes
  - new_project_welcome
  - currency_manager
  - user_manager
  - feature_toggle_manager
  - tool_costs_manager
  - rate_card_merger
  - merge_manager
      ↓
script.js loads (defines functions, NO execution)
      ↓
init_manager.js loads
      ↓
DOMContentLoaded fires
      ↓
init_manager.initialize() called
      ↓
1. Initialize projectData (including currency structure)
      ↓
2. Check which modules are available
      ↓
3. Initialize DOM Manager
      ↓
4. Call initializeBasicFunctionality()
   - Set up tab listeners
   - Set up button listeners
   - Set up modal listeners
   - Set up form listeners
      ↓
5. Wait for critical functions
      ↓
6. Initialize Project Info Save Button
      ↓
7. Load data from localStorage
      ↓
8. Render all tables
      ↓
9. Update UI (summary, month headers)
      ↓
10. Initialize New Project Welcome
      ↓
11. Initialize User Manager
      ↓
12. Initialize Feature Toggle Manager
      ↓
13. Initialize Currency Manager
      ↓
14. Initialize Tool Costs Manager
      ↓
15. Initialize Merge Manager
   - Setup merge button listener
   - Ready to handle merge workflows
      ↓
16. Initialize Edit Manager ⭐ NEW
   - Setup event listeners for edit buttons
   - Ready to handle inline editing
   - Rate card editing enabled
      ↓
17. Final re-render after delay
      ↓
✅ Application Ready
```

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
- [ ] **Dependencies loaded before this module** ⚠️ Critical!
- [ ] Registered in init_manager.js modules object
- [ ] **Comma added after previous module in modules object** ⚠️ Critical!
- [ ] Initialization code added to init_manager.initialize() if needed
- [ ] Public methods documented
- [ ] Dependencies checked before use
- [ ] Error handling implemented
- [ ] Tested in isolation and integrated
- [ ] Console logs added for debugging
- [ ] **Validation rules documented** ⭐ For editing features
- [ ] **User feedback implemented** ⭐ For validation errors
- [ ] **Data persistence tested** ⭐ For data modifications

---

## Version History

### v3.1 - Rate Card Editing (Current) ⭐ NEW
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
8. **For editing issues, include:** ⭐ NEW
   - Item type being edited (rate-card, internal-resource, etc.)
   - Data values before and after edit
   - Validation error messages
   - Whether changes persisted
   - Console logs during edit operation

This ensures efficient problem-solving and maintains architectural consistency.

---

**Last Updated:** November 2024  
**Maintained By:** Project Development Team  
**Architecture Pattern:** Centralized Initialization Manager  
**Latest Feature:** Rate Card Editing v3.1 with Inline Editing & Unique Validation
