# Defect Ticket — DEF-007: AC1 — Modal Closes After Failed Save (Page Reload)

## Story
STR-001 — Use Exchange Rate for Multi-Currency Cost Entry

## AC
AC1 — Missing exchange rate validation (save and focus-out)

## Description
When the user clicks Save in the Add Vendor Cost modal while an unconfigured currency is selected, the data write is correctly blocked (no row added to `window.projectData.vendorCosts`) but the modal closes and the page reloads. The user loses their form context and cannot see the validation error or correct the entry. AC1 requires the modal to remain open with the error visible.

**Root cause (suspected):** `handleModalSubmit()` calls an early return on validation failure, which prevents the data push. However, something else triggers a page reload — likely a second unguarded form submit handler or the form performing a native HTTP GET submit despite `e.preventDefault()` being called. Confirmed: all module-loaded log messages replay after the save click, indicating a full page re-initialisation.

## Observed vs expected

| | Expected | Observed |
|---|---|---|
| Modal stays open after failed save | yes | no — modal closes, page reloads |
| Error message visible after save attempt | yes | no — page reload clears state |
| Data write blocked | yes | yes ✓ |
| User can correct and resubmit | yes | no — must reopen modal and re-enter all fields |

## Screenshot
`stories/test-screenshots/STR-001-AC1-save.png` — shows Summary tab active after save attempt, modal closed, 0 vendor cost rows.

## Steps to reproduce
1. Open the app and navigate to Vendor Costs
2. Open Add Vendor Cost modal
3. Select any currency with no configured exchange rate (e.g. INR)
4. Fill in vendor name, description, category
5. Click Save
6. Observe: modal closes, page reloads, error is gone, no row was added

## Fix
Investigate `handleModalSubmit()` and any other submit listeners attached to `#modalForm`. Ensure `e.preventDefault()` is called before validation runs and that no second handler re-submits the form. Check whether the form `action` or `method` attributes are causing a native submit as a fallback.

## Status
RESOLVED — Changed `#vendorCostSave` and `#toolCostSave` from `type="submit"` to `type="button"` in both dom_manager.js and script.js templates. Added explicit click handlers in `openModal()` for both button types that call `handleModalSubmit()` directly. This eliminates any reliance on the native form submit mechanism for these custom save buttons, ensuring validation failures keep the modal open and never trigger a page reload.
