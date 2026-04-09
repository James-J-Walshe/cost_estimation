# Defect Ticket — DEF-008: handleModalSubmit does not call saveToLocalStorage after adding entry

## Priority
LOW

## Story
STR-001 — Use Exchange Rate for Multi-Currency Cost Entry (identified during AC5 testing)

## Description
`handleModalSubmit()` in `script.js` does not call `window.dataManager.saveToLocalStorage()` (or equivalent) after pushing a new entry into `window.projectData.toolCosts` (and likely `vendorCosts` and `internalResources`). The new entry is written correctly to the in-memory `projectData` object and the table re-renders immediately, so the user sees the new row. However, if the page is refreshed before any other action triggers a save, the new entry is not in localStorage and will be lost on reload.

## Impact
- Low probability under normal user operation (users typically do not refresh immediately after adding a single entry)
- High impact if it does occur — silent data loss with no warning to the user
- Confirmed during AC5 automated testing: an async `loadDefaultData()` call fired after `handleModalSubmit()` completed, reloading projectData from localStorage and overwriting the newly added in-memory entry

## Affected code
- `script.js` — `handleModalSubmit()` function, save paths for `toolCost`, `vendorCost`, and `internalResource` types
- Confirmed for `toolCost`; likely affects all three modal types as the same pattern is used

## Expected behaviour
After `handleModalSubmit()` successfully adds a new entry and re-renders the table, it should call `saveToLocalStorage()` to persist the updated `projectData` to localStorage immediately.

## Fix
Add a `window.dataManager.saveToLocalStorage()` (or equivalent) call at the end of each successful save branch in `handleModalSubmit()`, after the table render and summary update calls.

## Steps to reproduce
1. Open the app (fresh load)
2. Navigate to Tool Costs (or Vendor Costs / Internal Resources)
3. Add a new entry via the modal and save
4. Without clicking anything else, press F5 to refresh
5. Observe: the newly added entry is gone

## Status
OPEN — LOW PRIORITY
