# Defect Ticket — DEF-006: AC1 — Currency Selector Error Border Not Applied

## Story
STR-001 — Use Exchange Rate for Multi-Currency Cost Entry

## AC
AC1 — Missing exchange rate validation (save and focus-out)

## Description
When a non-base currency with no configured exchange rate is selected in the vendor cost modal, the `.currency-selector.input-error` CSS class is correctly applied to the `<select>` element but the `border-color: var(--danger-border)` (#fecaca) rule has no visible effect. The background colour (`--danger-bg`, #fef2f2) applies correctly.

**Root cause:** The `#entryCurrencyVendor` `<select>` element is rendered with an inline `style` attribute containing `border: 1px solid var(--border)`. Inline styles have higher specificity than class-based rules, so the `.input-error` border-color override is silently suppressed. The same inline style is likely present on the currency selectors for `internalResource` and `toolCost` modal types.

## Observed vs expected

| | Expected | Observed |
|---|---|---|
| Border colour (error state) | `rgb(254, 202, 202)` (#fecaca) | `rgb(228, 228, 231)` (#e4e4e7 — default) |
| Background colour (error state) | `rgb(254, 242, 242)` (#fef2f2) | `rgb(254, 242, 242)` ✓ |
| `.input-error` class applied | yes | yes ✓ |

## Fix
Remove the inline `border` style from the currency selector `<select>` elements in `getModalFields()` in `js/dom_manager.js` for all three modal types (`vendorCost`, `internalResource`, `toolCost`). The border styling should be provided solely by the CSS classes (`.form-control` default + `.input-error` override).

## Steps to reproduce
1. Open the app and navigate to Vendor Costs
2. Open Add Vendor Cost modal
3. Select any currency that has no configured exchange rate (e.g. INR)
4. Inspect `#entryCurrencyVendor` computed border-color — it reads #e4e4e7 instead of #fecaca

## Status
RESOLVED — Removed `border: 1px solid var(--border)` inline style from `#entryCurrencyVendor` (dom_manager.js, script.js) and `#entryCurrencyTool` (dom_manager.js). CSS `.currency-selector.input-error { border-color: var(--danger-border) }` rule now takes effect correctly.
