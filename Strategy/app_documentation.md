# Project Estimating Tool - Architecture & Development Guidelines

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Pattern](#architecture-pattern)
- [Initialization Manager Pattern](#initialization-manager-pattern)
- [File Structure](#file-structure)
- [Development Guidelines](#development-guidelines)
- [Feature Toggle System](#feature-toggle-system) ⭐ **NEW**
- [User Management System](#user-management-system) ⭐ **NEW**
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
- **Currency management with exchange rates**
- **Feature toggle system for controlled feature rollout** ⭐ NEW
- **User authentication and role-based access control** ⭐ NEW
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
   - Initializes feature toggle data structure

2. **Module Detection**
   - Checks for available modules (DataManager, TableRenderer, CurrencyManager, UserManager, FeatureToggleManager, etc.)
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
   Step 10: Initialize User Manager ⭐ NEW
   Step 11: Initialize Feature Toggle Manager ⭐ NEW
   Step 12: Initialize Currency Manager
   Step 13: Final re-render after 100ms delay
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
            userManager: false,           // ⭐ NEW
            featureToggleManager: false   // ⭐ NEW
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
<script src="modules/user_manager.js"></script> <!-- ⭐ NEW -->
<script src="modules/feature_toggle_manager.js"></script> <!-- ⭐ NEW -->

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
│   ├── currency_manager.js            # Currency & exchange rate management
│   ├── user_manager.js                # ⭐ User authentication & session (NEW)
│   └── feature_toggle_manager.js      # ⭐ Feature flag management (NEW)
└── Styles/
    └── edit-styles.css                # Edit-specific styles
```

### File Responsibilities

#### `modules/init_manager.js` ⭐ **START HERE**
- **What:** Central initialization orchestrator
- **When to modify:** Adding new modules, changing startup sequence
- **Key principle:** This is the ONLY file that should run initialization logic
- **Global export:** `window.initManager`

#### `modules/user_manager.js` ⭐ **NEW MODULE**
- **What:** Manages user authentication and sessions
- **Key features:**
  - Simple login/logout system
  - Role-based access (Admin/User/Guest)
  - Session persistence via localStorage
  - User display in header
- **Global export:** `window.userManager`
- **Must have:** `initialize()` method called by init_manager

#### `modules/feature_toggle_manager.js` ⭐ **NEW MODULE**
- **What:** Manages feature flags and controlled feature rollout
- **Key features:**
  - Define feature toggles with metadata
  - Role-based feature restrictions
  - Runtime feature availability checking
  - Admin UI for toggle management
  - Persistence via localStorage
- **Global export:** `window.featureToggleManager`
- **Must have:** `initialize()` method called by init_manager

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

#### `modules/currency_manager.js`
- **What:** Manages currency selection and exchange rates
- **Key features:**
  - Primary currency selection from 33 global currencies
  - Exchange rate management (add, edit, delete)
  - Currency conversion utilities
  - Currency symbol mapping
- **Global export:** `window.currencyManager`
- **Must have:** `initialize()` method called by init_manager

---

## Feature Toggle System ⭐ **NEW**

### Overview
The Feature Toggle System allows dynamic control of application features without code deployment, enabling:
- Controlled feature rollout
- A/B testing capabilities
- Role-based feature access
- Risk mitigation for new features
- Zero-downtime feature deployment

### Data Structure
```javascript
window.projectData.featureToggles = {
    toggles: {
        "feature_key": {
            key: "feature_key",
            displayName: "Feature Name",
            description: "Feature description",
            enabled: true,
            restrictions: {
                roles: ["admin"],      // Empty array = all roles
                userIds: ["user123"]   // Empty array = all users
            }
        }
    },
    lastUpdated: "2024-10-10T12:00:00Z"
}
```

### Using Feature Toggles

#### Checking if a Feature is Enabled
```javascript
// Check if a feature is available for the current user
if (window.featureToggleManager.isFeatureEnabled('export_excel')) {
    // Feature is enabled and user has access
    showExportButton();
} else {
    // Feature is disabled or user doesn't have access
    hideExportButton();
}
```

#### Admin UI Access
Admin users will see a "⚡ Feature Toggles" button in the header that opens the management interface where they can:
- View all feature toggles
- Enable/disable features globally
- Set role restrictions
- Add new feature toggles
- Edit existing toggles
- Delete unused toggles

#### Default Feature Toggles
The system comes with pre-configured toggles:
- **export_excel**: Excel export functionality
- **currency_management**: Multi-currency support (Admin only)
- **risk_assessment**: Risk and contingency planning
- **advanced_reporting**: Advanced analytics (Admin only, disabled by default)
- **project_templates**: Template management (disabled by default)
- **api_integration**: External API support (Admin only, disabled by default)

### Implementation Pattern
```javascript
// In any module, wrap feature-specific code
function renderFeature() {
    if (!window.featureToggleManager.isFeatureEnabled('my_feature')) {
        return; // Feature not available
    }
    
    // Feature implementation
    doFeatureWork();
}

// For UI elements
const button = document.getElementById('featureButton');
if (button) {
    button.style.display = 
        window.featureToggleManager.isFeatureEnabled('my_feature') 
        ? 'block' : 'none';
}
```

---

## User Management System ⭐ **NEW**

### Overview
The User Management System provides simple authentication and role-based access control:
- Login/logout functionality
- Role-based permissions (Admin/User/Guest)
- Session persistence
- Integration with Feature Toggle System

### User Roles
- **Admin**: Full access to all features and toggle management
- **User**: Standard access with role-based restrictions
- **Guest**: No login required, limited feature access

### Login Process
1. On first load, users see a login prompt
2. Users can:
   - Login with username and role
   - Continue as guest (Cancel button)
3. Session persists across page refreshes

### API Reference

#### Get Current User
```javascript
const user = window.userManager.getCurrentUser();
if (user) {
    console.log('Username:', user.username);
    console.log('Role:', user.role);
    console.log('Login time:', user.loginTime);
}
```

#### Check Authentication
```javascript
if (window.userManager.isAuthenticated()) {
    // User is logged in
}

if (window.userManager.hasRole('admin')) {
    // User is an admin
}
```

#### Programmatic Login/Logout
```javascript
// Login
window.userManager.login('john_doe', 'admin');

// Logout
window.userManager.logout();
```

### Demo Users
For testing purposes:
- **Admin**: username: `admin`, role: `Admin`
- **User**: username: `user1`, role: `User`
- **Guest**: Click "Cancel" on login prompt

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
       featureToggleManager: false,  // ← MUST have comma here
       myNewModule: false            // ← Add your module (no comma if last)
   };

   // In checkModules()
   this.modules.myNewModule = !!(window.myNewModule || window.MyNewModule);

   // In initialize() - add initialization step if needed
   if (this.modules.myNewModule && typeof window.myNewModule.initialize === 'function') {
       window.myNewModule.initialize();
       console.log('✓ My New Module initialized');
   }
   ```

### Adding Feature-Toggled Functionality

1. **Define the toggle** (in feature_toggle_manager.js or via Admin UI)
   ```javascript
   window.featureToggleManager.toggles['my_feature'] = {
       key: 'my_feature',
       displayName: 'My New Feature',
       description: 'Description of the feature',
       enabled: false,
       restrictions: { roles: [], userIds: [] }
   };
   ```

2. **Implement with toggle check**
   ```javascript
   function myFeatureFunction() {
       if (!window.featureToggleManager.isFeatureEnabled('my_feature')) {
           console.log('Feature not available');
           return;
       }
       
       // Feature implementation
   }
   ```

3. **Apply to UI elements**
   ```javascript
   window.featureToggleManager.applyToggleToElement('buttonId', 'my_feature');
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

### Pattern 2: Feature Toggle Integration

```javascript
// Check feature availability before rendering
renderAdvancedFeature() {
    // Guard clause for feature toggle
    if (!window.featureToggleManager?.isFeatureEnabled('advanced_feature')) {
        return;
    }
    
    // Render the feature
    const container = document.getElementById('advancedContainer');
    container.innerHTML = '...';
}

// Apply toggles to multiple elements
applyFeatureVisibility() {
    const features = [
        { elementId: 'exportBtn', toggle: 'export_excel' },
        { elementId: 'currencyTab', toggle: 'currency_management' },
        { elementId: 'risksTab', toggle: 'risk_assessment' }
    ];
    
    features.forEach(({ elementId, toggle }) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 
                window.featureToggleManager.isFeatureEnabled(toggle) 
                ? '' : 'none';
        }
    });
}
```

### Pattern 3: Role-Based Rendering

```javascript
// Show admin-only features
if (window.userManager.hasRole('admin')) {
    document.getElementById('adminPanel').style.display = 'block';
}

// Conditional rendering based on authentication
const user = window.userManager.getCurrentUser();
if (user) {
    // Logged in user features
    enableUserFeatures();
} else {
    // Guest mode limitations
    showGuestWarning();
}
```

### Pattern 4: Global Data Access

```javascript
// ALWAYS access projectData through window

// ✅ CORRECT
window.projectData.projectInfo.projectName = 'New Project';
window.projectData.featureToggles.toggles['my_feature'].enabled = true;

// ❌ WRONG (might reference local scope)
projectData.projectInfo.projectName = 'New Project';
```

---

## Troubleshooting

### Feature Toggle Issues

#### Problem: Feature toggles button not visible
**Cause:** Not logged in as admin or module not initialized
**Fix:** 
1. Login as admin user
2. Check console for initialization errors
3. Verify feature_toggle_manager.js is loaded

#### Problem: Features not hiding/showing
**Cause:** Toggle not applied or saved
**Fix:**
1. Check if `isFeatureEnabled()` returns expected value
2. Verify toggles are saved in localStorage
3. Call `applyFeatureToggles()` after changes

#### Problem: Toggle changes not persisting
**Cause:** Save not called or localStorage issue
**Fix:**
1. Click "Save All Changes" in admin UI
2. Check localStorage size limits
3. Verify DataManager is working

### User Management Issues

#### Problem: Login modal doesn't appear
**Cause:** User manager not initialized
**Fix:**
1. Check browser console for errors
2. Verify user_manager.js is loaded before init_manager.js
3. Check if localStorage is enabled

#### Problem: Session not persisting
**Cause:** localStorage disabled or cleared
**Fix:**
1. Check browser settings for localStorage
2. Verify session data in localStorage (`userSession` key)
3. Check for errors in console

### Module Loading Issues

#### Problem: "Timeout waiting for function: updateSummary"
**Cause:** The function isn't exported to window
**Fix:** In script.js, ensure:
```javascript
window.updateSummary = updateSummary;
```

#### Problem: Module not loading
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
- **Check feature toggles before rendering** - Always verify feature availability
- **Validate user roles for sensitive features** - Don't rely on client-side only
- **Export critical functions to window** - Make them accessible to all modules
- **Log initialization steps** - Use console.log with ✓ for successful steps
- **Provide fallback implementations** - Don't break if a module is missing
- **Test with different user roles** - Verify features work for all user types
- **Use consistent naming** - Either MyModule or myModule, but be consistent
- **Add commas in object literals** - Remember the comma before adding new properties ⚠️

### DON'T ❌

- **Don't add DOMContentLoaded listeners in multiple files** - Use init_manager only
- **Don't hardcode feature availability** - Use feature toggles
- **Don't trust client-side role checks for security** - Validate on server
- **Don't initialize on file load** - Wait for init_manager to call initialize()
- **Don't assume modules are loaded** - Always check before using
- **Don't mix global and local scope** - Always be explicit with window.
- **Don't skip error handling** - Wrap critical code in try-catch blocks
- **Don't forget commas in modules object** - This causes syntax errors! ⚠️

---

## Initialization Flow Diagram

```
Browser Loads Page
      ↓
All module scripts load (dom_manager, user_manager, feature_toggle_manager, etc.)
      ↓
script.js loads (defines functions, NO execution)
      ↓
init_manager.js loads
      ↓
DOMContentLoaded fires
      ↓
init_manager.initialize() called
      ↓
1. Initialize projectData (including feature toggles)
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
10. Initialize User Manager ⭐ NEW
   - Load user session
   - Setup user interface
   - Show login if needed
      ↓
11. Initialize Feature Toggle Manager ⭐ NEW
   - Load toggle configuration
   - Apply toggles to UI
   - Setup admin button if applicable
      ↓
12. Initialize Currency Manager
   - Load currency settings
   - Setup event listeners
   - Render exchange rates table
      ↓
13. Final re-render after 100ms
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
- [ ] Feature toggle integration if applicable
- [ ] Role-based access checks if needed
- [ ] Public methods documented
- [ ] Dependencies checked before use
- [ ] Error handling implemented
- [ ] Tested in isolation and integrated
- [ ] Tested with different user roles

---

## Version History

### v3.0 - Feature Toggle & User Management (Current) ⭐ NEW
- ✅ Added User Manager module for authentication
- ✅ Added Feature Toggle Manager for controlled rollout
- ✅ Role-based access control (Admin/User/Guest)
- ✅ Admin UI for feature toggle management
- ✅ Session persistence via localStorage
- ✅ Integration with existing modules
- ✅ Updated initialization sequence (Steps 10-11)

### v2.1 - Currency Management
- ✅ Added Currency Manager module
- ✅ Primary currency selection (33 global currencies)
- ✅ Exchange rate management
- ✅ Currency conversion utilities
- ✅ Settings page currency tab

### v2.0 - Init Manager Pattern
- ✅ Centralized initialization with init_manager.js
- ✅ Removed DOMContentLoaded from script.js
- ✅ Proper module dependency management
- ✅ Comprehensive error handling and logging

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
5. **Include user role and feature toggle states if relevant**
6. **Note any deviations from these patterns**
7. **For feature toggle issues, export toggle configuration**

This ensures efficient problem-solving and maintains architectural consistency.

---

**Last Updated:** November 2024  
**Maintained By:** Project Development Team  
**Architecture Pattern:** Centralized Initialization Manager  
**Latest Features:** Feature Toggle System v3.0, User Management v3.0
