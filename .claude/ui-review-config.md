# UI Review Config

## App URL
http://127.0.0.1:5500

## Screenshots folder
screenshots/

## Review-2 folder
screenshots/review-2/

## Source files in scope
- index.html
- style.css
- Styles/edit-styles.css
- modules/ (all JS files)

## Pages to capture

### 01 — Home (on load)
- URL: http://127.0.0.1:5500
- Action: Load page, dismiss welcome modal (click backdrop or "Start New Project Manually"), dismiss cookie banner (click Decline)
- Screenshot: `01-home.png`

### 02 — Summary tab
- Action: Click "Summary" in the tab navigation
- Screenshot: `02-summary.png`

### 03 — Resource Plan tab
- Action: Click "Resource Plan" in the tab navigation
- Screenshot: `03-resource-plan.png`

### 04 — Internal Resources tab
- Action: Click "Internal Resources" in the tab navigation
- Screenshot: `04-internal-resources.png`
- Then: Click the "Add..." button — wait for modal — screenshot: `04b-internal-resources-add-modal.png`
- Then: Close the modal before continuing

### 05 — Vendor Costs tab
- Action: Click "Vendor Costs" in the tab navigation
- Screenshot: `05-vendor-costs.png`
- Then: Click the "Add..." button — wait for modal — screenshot: `05b-vendor-costs-add-modal.png`
- Then: Close the modal before continuing

### 06 — Tool Costs tab
- Action: Click "Tool Costs" in the tab navigation
- Screenshot: `06-tool-costs.png`
- Then: Click the "Add..." button — wait for modal — screenshot: `06b-tool-costs-add-modal.png`
- Then: Close the modal before continuing

### 07 — Miscellaneous tab
- Action: Click "Miscellaneous" in the tab navigation
- Screenshot: `07-miscellaneous.png`
- Then: Click the "Add..." button — wait for modal — screenshot: `07b-miscellaneous-add-modal.png`
- Then: Close the modal before continuing

### 08 — Risks & Contingency tab
- Action: Click "Risks & Contingency" in the tab navigation
- Screenshot: `08-risks-contingency.png`
- Then: Click the "Add..." button — wait for modal — screenshot: `08b-risks-contingency-add-modal.png`
- Then: Close the modal before continuing

### 09 — Project functions menu
- Action: Navigate to http://127.0.0.1:5500, dismiss any modals, click the grid icon (top right)
- Screenshot: `09-project-functions-menu.png`
- Then: Close the dropdown

### 10 — Settings menu
- Action: Click the cog/settings icon (top right of header)
- Screenshot: `10-settings-menu.png`

## Modal dismiss instructions
- Welcome modal: click the dark backdrop overlay first; if that fails, click "Start New Project Manually"
- Cookie banner: click "Decline"
- Add modals: click the X close button or click the backdrop to close
