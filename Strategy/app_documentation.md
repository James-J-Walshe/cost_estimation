# Project Estimating Tool - Architecture & Development Guidelines

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Pattern](#architecture-pattern)
- [Initialization Manager Pattern](#initialization-manager-pattern)
- [File Structure](#file-structure)
- [Development Guidelines](#development-guidelines)
- [Common Patterns](#common-patterns)
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
- **Currency management with exchange rates** ⭐ NEW
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
   - Checks for available modules (DataManager, TableRenderer, CurrencyManager, etc.)
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
   Step 11: Initialize Currency Manager ⭐ NEW
   Step 12: Final re-render after 100ms delay
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
            currencyManager: false  // ⭐ NEW
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
<script src="modules/currency_manager.js"></script> <!-- ⭐ NEW -->

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
├── README.md                           # This file
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
│   └── currency_manager.js            # ⭐ Currency & exchange rate management (NEW)
└── Styles/
    └── edit-styles.css                # Edit-specific styles
```

### File Responsibilities

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

#### `modules/currency_manager.js` ⭐ **NEW MODULE**
- **What:** Manages currency selection and exchange rates
- **Key features:**
  - Primary currency selection from 33 global currencies
  - Exchange rate management (add, edit, delete)
  - Currency conversion utilities
  - Currency symbol mapping
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
       newProjectWelcome: false,  // ← MUST have comma here
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

### Pattern 5: Currency Data Structure ⭐ NEW

```javascript
// Currency settings are stored in window.projectData.currency
window.projectData = {
    projectInfo: { /* ... */ },
    currency: {
        primaryCurrency: 'USD',  // ISO 4217 currency code
        exchangeRates: [
            {
                id: 1234567890,
                currency: 'EUR',
                rate: 0.85,           // 1 USD = 0.85 EUR
                lastUpdated: '2024-10-10T12:00:00Z'
            }
        ]
    },
    internalResources: [],
    // ... other data
};

// Using currency utilities
const symbol = window.currencyManager.getCurrencySymbol('USD');  // Returns '$'
const converted = window.currencyManager.convertCurrency(100, 'USD', 'EUR');  // Returns 85
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

### Problem: "Uncaught SyntaxError: Unexpected identifier 'currencyManager'" ⭐ NEW

**Cause:** Missing comma before the new module in the modules object

**Fix:** In init_manager.js, ensure there's a comma after the previous module:
```javascript
this.modules = {
    // ... other modules
    newProjectWelcome: false,  // ← MUST have comma here
    currencyManager: false     // ← Last item, no comma
};
```

### Problem: "Uncaught SyntaxError: Unexpected end of input"

**Cause:** Missing closing brace `}` somewhere in the file

**Fix:** 
1. Check your code editor's bracket matching
2. Look at the line number in the error
3. Count opening and closing braces in functions

### Problem: Module not loading

**Checklist:**
1. ✅ Script tag in index.html? (before init_manager.js)
2. ✅ Module exports to window? (`window.myModule = ...`)
3. ✅ Module registered in init_manager.js modules list?
4. ✅ **Comma added after previous module?** ⚠️ Common mistake!
5. ✅ Check browser console for loading errors

### Problem: Functions not found / undefined errors

**Cause:** Function not exported to window or called before initialization

**Fix:**
1. Export function: `window.myFunction = myFunction;`
2. Ensure init_manager has completed before calling
3. Check function is defined before the export line

### Problem: Currency settings not saving ⭐ NEW

**Cause:** Currency data structure not initialized or localStorage not working

**Fix:**
1. Check browser console for errors
2. Verify `window.projectData.currency` exists
3. Try clearing localStorage: `localStorage.clear()`
4. Check if DataManager is properly saving

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

---

## Initialization Flow Diagram

```
Browser Loads Page
      ↓
All module scripts load (dom_manager, table_renderer, currency_manager, etc.)
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
11. Initialize Currency Manager ⭐ NEW
   - Load currency settings
   - Setup event listeners
   - Render exchange rates table
   - Update currency display
      ↓
12. Final re-render after 100ms
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
- [ ] Registered in init_manager.js modules object
- [ ] **Comma added after previous module in modules object** ⚠️ Critical!
- [ ] Initialization code added to init_manager.initialize() if needed
- [ ] Public methods documented
- [ ] Dependencies checked before use
- [ ] Error handling implemented
- [ ] Tested in isolation and integrated

---

## Currency Feature Documentation ⭐ NEW

### Overview
The Currency Manager module provides comprehensive currency management including:
- Primary currency selection from 33 global currencies
- Exchange rate management (manual entry)
- Currency conversion utilities
- Persistent storage of settings

### Using the Currency Manager

#### Setting Primary Currency
```javascript
// Access current primary currency
const primaryCurrency = window.projectData.currency.primaryCurrency;  // 'USD'

// Change primary currency (through UI or programmatically)
window.projectData.currency.primaryCurrency = 'EUR';
window.currencyManager.updateCurrencyDisplay();
```

#### Managing Exchange Rates
```javascript
// Add an exchange rate
window.currencyManager.addExchangeRate('EUR', 0.85);

// Delete an exchange rate
window.currencyManager.deleteExchangeRate(rateId);

// Get all exchange rates
const rates = window.projectData.currency.exchangeRates;
```

#### Converting Currency
```javascript
// Convert 100 USD to EUR
const converted = window.currencyManager.convertCurrency(100, 'USD', 'EUR');

// Get currency symbol
const symbol = window.currencyManager.getCurrencySymbol('USD');  // '$'
const name = window.currencyManager.getCurrencyName('USD');      // 'US Dollar'
```

### Supported Currencies
**Top 10 (Priority Display):**
USD, EUR, GBP, JPY, CNY, AUD, CAD, CHF, INR, SGD

**Additional 23 Currencies:**
AED, ARS, BRL, CZK, DKK, HKD, HUF, IDR, ILS, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, THB, TRY, TWD, ZAR

### Data Structure
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

### Future Enhancements
- Automatic exchange rate fetching from API
- Multi-currency cost entry in modals
- Currency conversion history
- Real-time rate updates
- Bulk exchange rate imports

---

## Version History

### v2.1 - Currency Management (Current) ⭐ NEW
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
3. **Reference this README** so context is clear
4. **Describe which module you're working on**
5. **Note any deviations from these patterns**
6. **For currency issues, include the currency data structure**

This ensures efficient problem-solving and maintains architectural consistency.

---

**Last Updated:** October 2025  
**Maintained By:** Project Development Team  
**Architecture Pattern:** Centralized Initialization Manager  
**Latest Feature:** Currency Management v2.1
