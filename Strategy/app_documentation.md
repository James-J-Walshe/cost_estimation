# Project Estimating Tool - Architecture & Development Guidelines

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Pattern](#architecture-pattern)
- [Initialization Manager Pattern](#initialization-manager-pattern)
- [File Structure](#file-structure)
- [Development Guidelines](#development-guidelines)
- [Common Patterns](#common-patterns)
- [Tool Costs Feature](#tool-costs-feature)
- [Resource Plan Enhancements](#resource-plan-enhancements)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

A web-based ICT project estimation tool for calculating and managing project costs, resources, and timelines. Built with vanilla JavaScript using a modular architecture with centralized initialization management.

**Key Features:**
- Project cost estimation with multiple cost categories
- Internal and external resource planning
- Dynamic month-based timeline calculations
- Vendor, tool, and miscellaneous cost tracking
- **Enhanced tool cost management with recurring costs** ⭐ NEW (v2.2)
- **Flexible billing frequencies** (monthly, quarterly, annual, one-time) ⭐ NEW
- Risk assessment and contingency planning
- Currency management with exchange rates
- **Resource Plan with 5-row forecast table** ⭐ ENHANCED (v2.2)
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
   - Initializes tool costs array with enhanced structure

2. **Module Detection**
   - Checks for available modules (DataManager, TableRenderer, CurrencyManager, ToolCostsManager, etc.)
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
   Step 11: Initialize Currency Manager
   Step 12: Initialize Tool Costs Manager ⭐ NEW
   Step 13: Render Resource Plan forecast ⭐ NEW
   Step 14: Final re-render after 100ms delay
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
            toolCostsManager: false  // ⭐ NEW
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
<script src="modules/tool_costs_manager.js"></script> <!-- ⭐ NEW -->

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
│   ├── table_renderer.js              # Table rendering logic ⭐ ENHANCED
│   └── data_manager.js                # Data persistence & loading
├── modules/
│   ├── editManager.js                 # Inline editing functionality
│   ├── dynamic_form_helper.js         # Dynamic form generation
│   ├── table_fixes.js                 # Table styling fixes
│   ├── init_manager.js                # ⭐ INITIALIZATION MANAGER (load LAST)
│   ├── new_project_welcome.js         # New project popup
│   ├── currency_manager.js            # Currency & exchange rate management
│   └── tool_costs_manager.js          # ⭐ Tool costs calculation & management (NEW)
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
  - `window.renderResourcePlanForecast` ⭐ NEW
  - All calculation functions

#### `modules/tool_costs_manager.js` ⭐ **NEW MODULE**
- **What:** Manages tool cost calculations and validations
- **Key features:**
  - Supports multiple billing frequencies (monthly, quarterly, annual, one-time)
  - Handles start/end dates and ongoing licenses
  - Calculates monthly breakdowns for Resource Plan
  - Validates tool cost data
  - Manages procurement types (Software License, Hardware, Cloud Services)
- **Global export:** `window.toolCostsManager`
- **Must have:** `initialize()` method called by init_manager

#### `js/table_renderer.js` ⭐ **ENHANCED**
- **What:** Renders all data tables including Resource Plan forecast
- **Key enhancements:**
  - `renderForecastTable()` - Renders 5-row forecast with all cost categories
  - Supports dynamic month columns based on project dates
  - Handles tool costs with different billing frequencies
  - Displays costs in actual billing months (not smoothed)
  - Two-row headers (year + month names)
- **Global export:** `window.tableRenderer` or `window.TableRenderer`

#### `modules/currency_manager.js`
- **What:** Manages currency selection and exchange rates
- **Key features:**
  - Primary currency selection from 33 global currencies
  - Exchange rate management (add, edit, delete)
  - Currency conversion utilities
  - Currency symbol mapping
- **Global export:** `window.currencyManager`

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
       toolCostsManager: false,  // ← MUST have comma here
       myNewModule: false        // ← Add your module (no comma if last)
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

### Pattern 5: Tool Costs Data Structure ⭐ NEW

```javascript
// Tool costs are stored in window.projectData.toolCosts
window.projectData = {
    projectInfo: { /* ... */ },
    currency: { /* ... */ },
    toolCosts: [
        {
            id: 1234567890,
            procurementType: 'Software License',  // or 'Hardware', 'Cloud Services'
            toolName: 'Test Software',
            billingFrequency: 'monthly',           // or 'quarterly', 'annual', 'one-time'
            costPerPeriod: 200,
            quantity: 5,
            startDate: '2025-08',                  // YYYY-MM format
            endDate: '2025-12',                    // YYYY-MM format or null
            isOngoing: false,                      // true if no end date
            totalCost: 5000                        // Calculated value
        }
    ],
    internalResources: [],
    // ... other data
};

// Using tool costs utilities
const monthlyBreakdown = window.toolCostsManager.calculateMonthlyBreakdown(toolCost);
const isValid = window.toolCostsManager.validateToolCost(toolCost);
```

### Pattern 6: Billing Frequency Calculations ⭐ NEW

```javascript
// Tool Costs Manager handles different billing frequencies

// Monthly billing - charged every month
{
    billingFrequency: 'monthly',
    costPerPeriod: 1000,
    // Result: $1,000 charged every month
}

// Quarterly billing - charged every 3 months
{
    billingFrequency: 'quarterly',
    costPerPeriod: 3000,
    startDate: '2025-01',
    // Result: $3,000 charged in months 1, 4, 7, 10
}

// Annual billing - charged once per year
{
    billingFrequency: 'annual',
    costPerPeriod: 12000,
    startDate: '2025-01',
    // Result: $12,000 charged in month 1, then month 13 if applicable
}

// One-time - charged once in start month
{
    billingFrequency: 'one-time',
    costPerPeriod: 15439,
    startDate: '2025-10',
    // Result: $15,439 charged in month 10 only
}
```

---

## Tool Costs Feature

### Overview ⭐ NEW (v2.2)
The Tool Costs Manager module provides comprehensive tool cost management including:
- Multiple procurement types (Software License, Hardware, Cloud Services)
- Flexible billing frequencies (monthly, quarterly, annual, one-time)
- Start/end date tracking with ongoing option
- Automatic monthly breakdown calculations
- Integration with Resource Plan forecast

### Using the Tool Costs Manager

#### Adding Tool Costs
```javascript
// Tool costs are added through the modal form
// Access through "Add Tool Cost" button in the Tool Costs tab

// The form provides:
// - Procurement Type dropdown
// - Tool Name input
// - Billing Frequency selector
// - Cost Per Period input
// - Quantity input
// - Start Date picker (YYYY-MM format)
// - End Date picker or "Ongoing" checkbox
```

#### Calculating Monthly Breakdown
```javascript
// Get monthly breakdown for a tool cost
const toolCost = {
    procurementType: 'Software License',
    toolName: 'Test Software',
    billingFrequency: 'monthly',
    costPerPeriod: 200,
    quantity: 5,
    startDate: '2025-02',
    endDate: '2025-12',
    isOngoing: false
};

const breakdown = window.toolCostsManager.calculateMonthlyBreakdown(
    toolCost,
    '2025-02-01',  // Project start date
    '2025-12-31'   // Project end date
);

// Returns object with monthly costs:
// {
//     '2025-02': 1000,
//     '2025-03': 1000,
//     ...
//     '2025-12': 1000
// }
```

#### Validating Tool Costs
```javascript
// Validate a tool cost entry
const isValid = window.toolCostsManager.validateToolCost(toolCost);
// Returns true if valid, shows alert if invalid
```

#### Calculating Total Cost
```javascript
// Get total cost for a tool
const total = window.toolCostsManager.calculateTotalCost(toolCost);
// Returns total cost considering billing frequency and duration
```

### Data Structure
```javascript
{
  toolCosts: [
    {
      id: 1234567890,                   // Timestamp ID
      procurementType: 'Software License', // Type of tool
      toolName: 'Test Software',        // Name/description
      billingFrequency: 'monthly',      // How often charged
      costPerPeriod: 200,               // Cost per billing period
      quantity: 5,                      // Number of licenses/units
      startDate: '2025-02',             // YYYY-MM format
      endDate: '2025-12',               // YYYY-MM format or null
      isOngoing: false,                 // True if perpetual
      totalCost: 5000                   // Calculated total
    }
  ]
}
```

### Supported Billing Frequencies

1. **Monthly** - Charges appear every month
   - Example: $1,000/month for 11 months = $11,000 total
   
2. **Quarterly** - Charges appear every 3 months
   - Example: $3,000/quarter starting in month 1 → charges in months 1, 4, 7, 10
   
3. **Annual** - Charges appear once per year
   - Example: $12,000/year → charges in month 1 only (or month 13 if project spans 2 years)
   
4. **One-time** - Single charge in start month
   - Example: $15,439 hardware purchase → charges in month 9 only

### Resource Plan Integration
Tool costs automatically appear in the Resource Plan forecast table as a dedicated row:
- Monthly costs display in their billing months (not smoothed)
- Allows visibility into spending spikes
- Essential for cash flow planning

---

## Resource Plan Enhancements

### Overview ⭐ ENHANCED (v2.2)
The Resource Plan tab has been significantly enhanced to provide comprehensive cost forecasting.

### Five-Row Forecast Table
The Resource Plan now displays a complete forecast with:

1. **Internal Resources** - Daily rate costs for internal staff
2. **Vendor Costs** - External vendor and contractor costs
3. **Tool Costs** ⭐ NEW - Software licenses, hardware, and tool costs
4. **Miscellaneous** - Other project costs
5. **Total Monthly Cost** - Sum of all categories

### Dynamic Month Columns
- Columns automatically adjust based on project start/end dates
- Two-row headers display year and month names (e.g., "2025" / "Feb")
- Supports projects from 1 month to multiple years

### HTML Structure
```html
<div id="resource-plan" class="tab-content">
    <h2>Resource Plan Overview</h2>
    
    <div class="forecast-section">
        <h3>Cost Forecast by Month</h3>
        <div class="table-container">
            <table class="data-table" id="forecastTable">
                <thead id="forecastTableHead">
                    <!-- Year row and month row generated dynamically -->
                </thead>
                <tbody id="forecastTableBody">
                    <!-- 5 rows: Internal, Vendor, Tool, Misc, Total -->
                </tbody>
            </table>
        </div>
    </div>
</div>
```

### Key Functions

#### `renderResourcePlanForecast()` (script.js)
Main function for rendering the Resource Plan forecast table. Called by init_manager after all modules load.

```javascript
function renderResourcePlanForecast() {
    const head = document.getElementById('forecastTableHead');
    const body = document.getElementById('forecastTableBody');
    
    // Validates project dates
    // Calculates month span
    // Renders headers (year + month)
    // Renders 5 data rows
    // Handles all cost categories
}
```

#### `renderForecastTable()` (table_renderer.js)
Enhanced version that renders all 5 rows with proper calculations:

```javascript
renderForecastTable() {
    // Calculates internal resource costs
    // Calculates vendor costs
    // Calculates tool costs with billing frequency support ⭐ NEW
    // Calculates miscellaneous costs
    // Renders all rows with monthly totals
    // Properly formats currency
    // Styles total row
}
```

### Tool Cost Calculation in Forecast

The forecast table handles tool costs intelligently:

**Monthly Billing:**
```javascript
// $1,000 per month for 11 months
// Shows: $1,000 in each month from start to end
```

**Quarterly Billing:**
```javascript
// $3,000 per quarter starting in month 1
// Shows: $3,000 in months 1, 4, 7, 10 (not smoothed!)
```

**One-time Purchase:**
```javascript
// $15,439 hardware purchase in month 9
// Shows: $15,439 in month 9 only
```

**Annual Billing:**
```javascript
// $12,000 per year starting in month 1
// Shows: $12,000 in month 1, then month 13 if project spans 2 years
```

### Debugging Resource Plan

If the Resource Plan doesn't render correctly:

1. **Check project dates are set:**
   ```javascript
   console.log('Start:', window.projectData.projectInfo.startDate);
   console.log('End:', window.projectData.projectInfo.endDate);
   ```

2. **Check HTML IDs exist:**
   ```javascript
   console.log('Head:', document.getElementById('forecastTableHead'));
   console.log('Body:', document.getElementById('forecastTableBody'));
   ```

3. **Manually trigger rendering:**
   ```javascript
   renderResourcePlanForecast();
   ```

4. **Check for conflicting renderers:**
   - Look for old `renderForecastTable()` in table_renderer.js
   - Ensure it's updated to handle 5 rows
   - Verify it's not overwriting the new table

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

**Cause:** Missing comma in modules object or duplicate backtick in template literal

**Fix 1:** In init_manager.js, ensure there's a comma after each module except the last:
```javascript
this.modules = {
    // ... other modules
    currencyManager: false,  // ← MUST have comma here
    toolCostsManager: false  // ← Last item, no comma
};
```

**Fix 2:** In script.js, check for duplicate closing backticks:
```javascript
// WRONG:
        `,
        `,  // ❌ Duplicate backtick and comma

// CORRECT:
        `,
        miscCost: `  // ✓ Only one closing
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

### Problem: Tool Costs showing $0 in Resource Plan ⭐ NEW

**Cause:** Billing frequency case mismatch or unsupported billing type

**Fix:**
1. Check console for tool cost debug logs (look for 🎯📦💰 emojis)
2. Verify billing frequency is lowercase: 'monthly', 'quarterly', 'annual', 'one-time'
3. Check tool start/end dates are within project date range
4. Verify `renderForecastTable()` includes tool cost calculation logic
5. Look for "✅ Distributed" messages in console to confirm costs are being calculated

**Debug commands:**
```javascript
// Check tool costs data
console.log('Tool costs:', window.projectData.toolCosts);

// Check tool costs manager
console.log('Manager:', window.toolCostsManager);

// Test calculation manually
const tool = window.projectData.toolCosts[0];
const breakdown = window.toolCostsManager.calculateMonthlyBreakdown(
    tool,
    window.projectData.projectInfo.startDate,
    window.projectData.projectInfo.endDate
);
console.log('Breakdown:', breakdown);
```

### Problem: Resource Plan table missing headers or rows ⭐ NEW

**Cause:** HTML structure doesn't match expected IDs or old rendering function is overwriting

**Fix:**
1. **Check HTML structure** in index.html:
   ```html
   <table class="data-table" id="forecastTable">
       <thead id="forecastTableHead"></thead>
       <tbody id="forecastTableBody"></tbody>
   </table>
   ```

2. **Check for conflicting renderers** in table_renderer.js:
   - Look for old `renderForecastTable()` method
   - Ensure it handles all 5 rows (Internal, Vendor, Tool, Misc, Total)
   - Verify it includes tool cost calculation logic

3. **Manually test:**
   ```javascript
   // Run function manually
   renderResourcePlanForecast();
   
   // Check what was rendered
   const head = document.getElementById('forecastTableHead');
   const body = document.getElementById('forecastTableBody');
   console.log('Head HTML:', head.innerHTML);
   console.log('Body HTML:', body.innerHTML);
   ```

### Problem: Quarterly costs are smoothed instead of showing in billing months ⭐ NEW

**Cause:** Calculation logic is dividing quarterly costs by 3 instead of showing them in actual billing months

**Fix:** Update `renderForecastTable()` in table_renderer.js to use the correct billing logic:
```javascript
// Calculate tool costs with proper billing logic
if (projectData.toolCosts) {
    projectData.toolCosts.forEach(tool => {
        const costPerPeriod = tool.costPerPeriod || 0;
        const qty = tool.quantity || 1;
        const billingFreq = (tool.billingFrequency || 'one-time').toLowerCase();
        
        if (billingFreq === 'monthly') {
            // Charge every month
            for (let i = 0; i < monthInfo.count; i++) {
                toolMonthly[i] += costPerPeriod * qty;
            }
        } else if (billingFreq === 'quarterly') {
            // Charge every 3 months (1, 4, 7, 10...)
            for (let i = 0; i < monthInfo.count; i += 3) {
                toolMonthly[i] += costPerPeriod * qty;
            }
        } else if (billingFreq === 'annual') {
            // Charge once per year
            toolMonthly[0] += costPerPeriod * qty;
            if (monthInfo.count > 12) {
                toolMonthly[12] += costPerPeriod * qty;
            }
        } else if (billingFreq === 'one-time') {
            // Charge in first month only
            toolMonthly[0] += costPerPeriod * qty;
        }
    });
}
```

### Problem: Currency settings not saving

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
- **Use lowercase for billing frequencies** - 'monthly', 'quarterly', 'annual', 'one-time'
- **Show costs in actual billing months** - Don't smooth quarterly/annual costs
- **Validate dates** - Ensure end date is after start date
- **Export functions before calling them** - Always export to window first
- **Check console logs during debugging** - Look for emoji indicators (🎯📦💰)

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
- **Don't smooth billing frequency costs** - Show charges in actual billing months
- **Don't use capital letters in billing frequency** - Always lowercase
- **Don't add code after return statements** - It will never execute
- **Don't create template literal syntax errors** - Check for duplicate backticks

---

## Initialization Flow Diagram

```
Browser Loads Page
      ↓
All module scripts load (dom_manager, table_renderer, tool_costs_manager, etc.)
      ↓
script.js loads (defines functions, NO execution)
      ↓
init_manager.js loads
      ↓
DOMContentLoaded fires
      ↓
init_manager.initialize() called
      ↓
1. Initialize projectData (including currency and toolCosts structures)
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
11. Initialize Currency Manager
      ↓
12. Initialize Tool Costs Manager ⭐ NEW
   - Load tool costs settings
   - Setup validation rules
   - Initialize calculation engine
      ↓
13. Render Resource Plan forecast ⭐ NEW
   - Check project dates
   - Calculate month span
   - Render 5-row forecast table
   - Include tool costs with billing frequencies
      ↓
14. Final re-render after 100ms
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

## Testing Scenarios ⭐ NEW

### Manual Testing for Tool Costs

#### Test 1: Monthly Billing
1. Add tool cost: Software License, Monthly, $1,000, Qty 1, Feb 2025 - Dec 2025
2. Expected: $11,000 total (11 months × $1,000)
3. Resource Plan: $1,000 in each month from Feb to Dec

#### Test 2: Quarterly Billing
1. Add tool cost: Software License, Quarterly, $3,000, Qty 1, Jan 2025 - Dec 2025
2. Expected: $12,000 total (4 quarters × $3,000)
3. Resource Plan: $3,000 in months 1, 4, 7, 10 only

#### Test 3: One-time Purchase
1. Add tool cost: Hardware, One-time, $15,439, Qty 1, Oct 2025
2. Expected: $15,439 total
3. Resource Plan: $15,439 in Oct 2025 only

#### Test 4: Ongoing License
1. Add tool cost: Software License, Monthly, $500, Qty 2, Check "Ongoing"
2. Expected: Costs continue through project end
3. Resource Plan: $1,000 every month (no end date)

#### Test 5: Date Validation
1. Try to add tool cost with End Date before Start Date
2. Expected: Error message "End date cannot be before start date"
3. Modal should not close

#### Test 6: Resource Plan Integration
1. Add multiple tool costs with different billing frequencies
2. Navigate to Resource Plan tab
3. Expected: See "Tool Costs" row with monthly breakdown
4. Expected: See spending spikes in appropriate months
5. Expected: Total Monthly Cost row includes tool costs

---

## Version History

### v2.2 - Tool Costs Enhancement (Current) ⭐ NEW
- ✅ Added Tool Costs Manager module
- ✅ Multiple billing frequencies (monthly, quarterly, annual, one-time)
- ✅ Enhanced tool cost data structure with start/end dates
- ✅ Procurement types (Software License, Hardware, Cloud Services)
- ✅ Resource Plan integration with 5-row forecast table
- ✅ Dynamic month columns based on project dates
- ✅ Cost display in actual billing months (not smoothed)
- ✅ Ongoing license support
- ✅ Enhanced validation and error handling
- ✅ Updated initialization sequence (Steps 12-13)

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
3. **Reference this README** so context is clear
4. **Describe which module you're working on**
5. **Note any deviations from these patterns**
6. **For tool cost issues, include the billing frequency and dates**
7. **For Resource Plan issues, check HTML structure and rendering functions**
8. **Look for emoji debug logs** (🎯📦💰) in the console

This ensures efficient problem-solving and maintains architectural consistency.

---

**Last Updated:** October 2025  
**Maintained By:** Project Development Team  
**Architecture Pattern:** Centralized Initialization Manager  
**Latest Feature:** Tool Costs Enhancement v2.2
