# CLAUDE.md — AI Assistant Reference for cost_estimation

> This file provides a concise reference for AI assistants working in this repository.
> Full architecture docs live in `Documentation/00_app_documentation.md`.

---

## Project Overview

**ICT Project Cost Estimation Tool** — A fully client-side, vanilla JavaScript web application for creating detailed project cost estimates. Deployed via GitHub Pages at https://james-j-walshe.github.io/cost_estimation/.

No build step, no bundler, no npm. Open `index.html` in a browser or serve with any static file server.

**Tech stack:** HTML5 · CSS3 · Vanilla JavaScript · localStorage

---

## Repository Layout

```
cost_estimation/
├── index.html                  # Single-page app entry point
├── script.js                   # Core logic (tabs, calculations, rendering, event wiring)
├── style.css                   # Main stylesheet
│
├── js/                         # Split-out JS modules (loaded by index.html)
│   ├── data_manager.js         # Save/load/export/import project data
│   ├── dom_manager.js          # DOM manipulation helpers
│   ├── table_renderer.js       # Renders all data tables + forecast
│   └── modal_close_fix.js      # Patch for modal close/reopen behaviour
│
├── modules/                    # Feature modules (loaded by index.html)
│   ├── init_manager.js         # ⭐ Orchestration: loads all modules in order
│   ├── analytics_manager.js    # GA4 + GDPR consent management
│   ├── currency_manager.js     # Multi-currency + exchange rates
│   ├── dynamic_form_helper.js  # Dynamic form field generation
│   ├── editManager.js          # Inline editing for table rows
│   ├── feature_toggle_manager.js # Runtime feature flags
│   ├── hover-widget.js         # Cross-app navigation widget (Zyantik suite)
│   ├── merge_manager.js        # Merge specialist estimate files
│   ├── multi_resource_manager.js # Multi-resource assignments (#134)
│   ├── new_project_welcome.js  # New project wizard/onboarding
│   ├── rate_card_merger.js     # Rate card conflict resolution
│   ├── table_fixes.js          # Miscellaneous table patches
│   ├── tool_costs_manager.js   # Tool/software licensing cost logic
│   └── user_manager.js         # User profile + role management
│
├── Styles/
│   ├── edit-styles.css         # Styles for inline editing
│   └── hover-widget.css        # Hover widget styles
│
├── patches/
│   └── modal_close_fix.js      # Standalone modal close patch
│
├── images/
│   ├── zyantik-logo.png
│   └── zyantik-logo [white background].png
│
└── Documentation/
    ├── 00_app_documentation.md     # Full architecture & pattern guide (primary ref)
    ├── v2.2_Updates.md             # Quick reference for v2.2 changes
    ├── 01_google_analytics.MD      # GA4 setup guide
    ├── 02_rate_card_update_visual_Workflow.md
    ├── Env_Mgt/Git_Workflow.md     # Branch strategy & CI/CD setup
    ├── Strategy/improvement_strategy.md
    └── Testing/TESTING_RATE_CARD_EDITING.md
```

---

## Architecture: The InitializationManager Pattern

All modules register with **`window.initManager`** (from `modules/init_manager.js`).

### Module Registration Checklist

When adding a new module, you must do **all four** of these things:

1. **Create the module file** with a class that has an `initialize()` method.
2. **Export to `window`** at the bottom of the file:
   ```javascript
   window.myModule = new MyModule();
   ```
3. **Add a `<script>` tag in `index.html`** *before* the `init_manager.js` script tag.
4. **Register in `init_manager.js`** in three places:
   - `this.modules` object in the constructor (add `myModule: false`)
   - `checkModules()` method (add detection logic)
   - `initialize()` method (add the step that calls `window.myModule.initialize()`)

> ⚠️ Always add a **trailing comma** on the previous module's entry in the `modules` object — a missing comma causes a syntax error that silently prevents the whole app from loading.

### Initialization Sequence (21 steps)

`init_manager.js:initialize()` runs these steps in order:

1. Init `window.projectData` structure
2. Check which modules are present
3. Init DOM Manager
4. Wait for `updateSummary` and `updateMonthHeaders`
5. Init Project Info Save Button
6. Load data from localStorage
7. Render all tables
8. Render Resource Plan forecast
9. Update UI
10. Init New Project Welcome
11. Init User Manager
12. Init Feature Toggle Manager
13. Init Currency Manager
14. Init Tool Costs Manager
15. Init header dropdown menus
16. Setup user view navigation
17. Update user display in header
18. Init Merge Manager
19. Init Multi Resource Manager
20. Init Analytics Manager
21. Re-render tables after 100ms delay (ensures loaded data displays)

---

## global `window.projectData` Structure

```javascript
window.projectData = {
    projectInfo: {
        projectName: '',
        startDate: '',    // 'YYYY-MM' format
        endDate: '',      // 'YYYY-MM' format
        projectManager: '',
        projectDescription: ''
    },
    currency: {
        primaryCurrency: 'USD',
        exchangeRates: []
    },
    internalResources: [],  // [{ role, rate, months: {}, ... }]
    vendorCosts: [],        // [{ vendor, category, quarters: {}, ... }]
    toolCosts: [],          // see Tool Cost Object below
    miscCosts: [],
    risks: [],
    rateCards: [
        { role: 'Project Manager', rate: 800, category: 'Internal' },
        // ...
    ],
    contingencyPercentage: 10
};
```

### Tool Cost Object

```javascript
{
    id: 1234567890,           // Date.now()
    procurementType: 'Software License',
    toolName: 'My Tool',
    billingFrequency: 'monthly',   // ← MUST be lowercase
    costPerPeriod: 200,
    quantity: 5,
    startDate: '2025-08',          // 'YYYY-MM' format
    endDate: '2025-12',
    isOngoing: false,
    totalCost: 5000
}
```

---

## Key Conventions

### 1. Billing Frequency Values — Always Lowercase

```javascript
// ✅ CORRECT
'monthly' | 'quarterly' | 'annual' | 'one-time'

// ❌ WRONG — will break calculations silently
'Monthly' | 'Quarterly' | 'Annual' | 'One-time'
```

### 2. Show Costs in Actual Billing Months — Do Not Smooth

```
✅ Quarterly $3,000  →  appears in months 1, 4, 7, 10
❌ Quarterly $3,000  →  spread as $1,000/month (breaks cash flow planning)
```

### 3. Event Listener Guard Pattern

Prevent duplicate listeners using a data attribute:

```javascript
if (button.hasAttribute('data-dropdown-listener-attached')) {
    return; // Already wired up — skip
}
button.addEventListener('click', handler);
button.setAttribute('data-dropdown-listener-attached', 'true');
```

### 4. Export All Public Functions to `window`

Functions called from outside their file **must** be assigned to `window`:

```javascript
function myCalculation() { /* ... */ }
window.myCalculation = myCalculation;  // Required!
```

### 5. Module Access Pattern

Modules expose themselves with two possible naming conventions — always check both:

```javascript
// Access any module defensively:
const dm = window.DataManager || window.dataManager;
if (dm && typeof dm.saveProject === 'function') {
    dm.saveProject();
}
```

### 6. Console Logging Conventions

Use emoji prefixes in `console.log` to categorise output:

| Emoji | Meaning |
|-------|---------|
| `✓` | Step completed successfully |
| `✅` | Full initialisation complete |
| `⚠` | Warning / degraded state |
| `❌` | Error |
| `🚀` | App startup |
| `🎯` | Calculation starting |
| `📦` | Processing an item |
| `💰` | Cost value computed |
| `📊` | Analytics |
| `🔧` | Patch/fix loading |

---

## Resource Plan Forecast Table

The HTML IDs **must** exactly match what `table_renderer.js` targets:

```html
<table class="data-table" id="forecastTable">
    <thead id="forecastTableHead"></thead>
    <tbody id="forecastTableBody"></tbody>
</table>
```

The tbody always renders **5 rows**: Internal Resources · Vendor · Tool Costs · Miscellaneous · Total.

---

## App Views (Three-Panel Layout)

The app has three distinct view areas toggled by `display: none/block`:

| Element ID | Purpose |
|------------|---------|
| `#mainApp` | Primary estimation tabs |
| `#settingsApp` | Project Info / Rate Cards / Currency settings |
| `#userApp` | User profile + feature toggles |

Navigation between views is handled by `initManager.showSettingsView()` and `initManager.showUserView()`.

---

## Data Persistence

- **Auto-save**: `localStorage` key `'ictProjectData'`
- **Manual save**: `DataManager.saveProject()` / `dataManager.saveProject()`
- **Download**: JSON file via `DataManager.downloadProject()`
- **Load**: JSON file via `DataManager.loadProject()`
- **Export**: CSV/Excel via `DataManager.exportToExcel()`
- **Merge**: Merge a specialist's JSON estimate via Merge Manager

---

## Git Workflow

Branches:

| Branch | Purpose |
|--------|---------|
| `main` | Production — auto-deploys to GitHub Pages |
| `develop` | Integration testing |
| `feature/*` | Individual features |
| `hotfix/*` | Urgent production fixes |

**Commit message format:**

```
feat: add bulk edit for internal resources
fix: resolve modal reopen after close
docs: update init sequence documentation
refactor: split editManager into sub-modules
style: update dropdown hover states
test: add billing frequency calculation tests
```

**Pre-commit checklist:**
- [ ] Browser console is free of errors
- [ ] All tabs navigate correctly
- [ ] localStorage save/load works
- [ ] CSV export produces valid output
- [ ] No `console.log` statements left in production code
- [ ] Responsive layout intact on mobile widths

---

## Debugging Quickstart

```javascript
// Inspect app state
console.log(window.projectData);
console.log(window.initManager.modules);

// Check module availability
console.log(!!window.dataManager);
console.log(!!window.toolCostsManager);

// Force re-render
window.tableRenderer?.renderAllTables();
window.updateSummary?.();

// Debug Resource Plan
console.log(window.projectData.projectInfo.startDate);
console.log(document.getElementById('forecastTableHead'));
renderResourcePlanForecast?.();

// Debug tool cost calculation
const breakdown = window.toolCostsManager?.calculateMonthlyBreakdown(
    window.projectData.toolCosts[0],
    window.projectData.projectInfo.startDate,
    window.projectData.projectInfo.endDate
);
console.log(breakdown);
```

---

## Analytics (GA4)

Module: `modules/analytics_manager.js`
Measurement ID: `G-2KD38HBZB2` (configured in the class constructor)
Features: GDPR cookie consent banner, localStorage-based consent state, tracking prevention detection.

---

## Known Issues & Patterns to Watch

- **Duplicate backtick in template literals** — a common syntax error when editing `table_renderer.js`. Search for `` `, `` `` `, `` on the same line if you get an `Uncaught SyntaxError`.
- **Missing comma in modules object** — adding a new module without a trailing comma on the previous entry will crash the init sequence silently.
- **Tool costs showing $0** — almost always a billing frequency case mismatch (e.g. `'Monthly'` vs `'monthly'`).
- **Forecast table not rendering** — check `startDate`/`endDate` are set in `projectData.projectInfo`, and that `forecastTableHead` / `forecastTableBody` IDs exist in the DOM.

---

## References

- Full architecture guide: `Documentation/00_app_documentation.md`
- v2.2 quick reference (Tool Costs + Resource Plan): `Documentation/v2.2_Updates.md`
- GA4 setup: `Documentation/01_google_analytics.MD`
- Git workflow & CI/CD: `Documentation/Env_Mgt/Git_Workflow.md`
- Future roadmap: `Documentation/Strategy/improvement_strategy.md`
