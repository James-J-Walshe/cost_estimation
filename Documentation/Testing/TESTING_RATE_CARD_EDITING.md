# Rate Card Editing - Testing Scenarios

## Overview
This document provides comprehensive testing scenarios for the newly implemented Rate Card editing functionality in the Zyantik Cost Estimation Tool.

## Feature Summary
- **What**: Inline editing of Rate Cards (Role, Category, Daily Rate)
- **Where**: Settings → Rate Cards section
- **How**: Click Edit button → Modify fields → Save or Cancel
- **Validation**: Unique role names (case-insensitive)

## Test Environment Setup

### Prerequisites
1. Access to Zyantik tool at: https://zyantik.com
2. Browser: Chrome, Firefox, Safari, or Edge (latest version)
3. Test data: At least 3 rate cards loaded

### Initial Setup
1. Open the application
2. Click Settings (⚙️ icon in top navigation)
3. Navigate to "Rate Cards" section in left sidebar
4. Verify you see the rate cards table with Edit and Delete buttons

---

## Test Scenarios

### Scenario 1: Basic Edit Functionality
**Objective**: Verify that clicking Edit converts fields to editable inputs

**Given**: User is viewing the Rate Cards table with existing rate cards
**When**: User clicks the Edit button (pencil icon) on any rate card
**Then**: 
- ✅ Row background highlights (yellow/edit mode indicator)
- ✅ Role field becomes a text input
- ✅ Category field becomes a dropdown (Internal/External)
- ✅ Daily Rate field becomes a number input
- ✅ Edit button is replaced with Save (✓) and Cancel (✗) buttons
- ✅ Delete button remains visible

**Test Data**:
- Rate Card: "Senior Consultant", External, 1200

---

### Scenario 2: Successful Edit and Save
**Objective**: Verify that editing and saving updates the rate card

**Given**: User has clicked Edit on "Senior Consultant" rate card
**When**: User changes:
- Role to "Senior Technical Consultant"
- Category to "External" (unchanged)
- Rate to 1300
- Clicks Save button (✓)

**Then**:
- ✅ Row returns to normal display mode
- ✅ Role displays "Senior Technical Consultant"
- ✅ Category badge shows "EXTERNAL" in blue
- ✅ Daily Rate displays "1,300"
- ✅ Edit and Delete buttons reappear
- ✅ No error messages shown
- ✅ Data persists after page refresh

---

### Scenario 3: Cancel Edit Operation
**Objective**: Verify that canceling returns fields to original values

**Given**: User has clicked Edit on "Support Specialist" rate card
**When**: User changes:
- Role to "Junior Support Engineer"
- Rate to 500
- Clicks Cancel button (✗)

**Then**:
- ✅ Row returns to normal display mode
- ✅ Role displays original "Support Specialist"
- ✅ Rate displays original "700"
- ✅ Category remains unchanged
- ✅ Edit and Delete buttons reappear
- ✅ Changes are not saved

---

### Scenario 4: Unique Role Name Validation - Duplicate Detection
**Objective**: Verify that duplicate role names are prevented

**Given**: Rate cards exist:
- "Implementation Specialist", External, 900
- "Senior Consultant", External, 1200

**When**: User edits "Senior Consultant" and changes role to "Implementation Specialist"
**Then**:
- ✅ Alert message displays: "A rate card with the role 'Implementation Specialist' already exists. Please use a unique role name."
- ✅ Row remains in edit mode
- ✅ User can continue editing
- ✅ Save operation is prevented

**Test Variations**:
- Try with different case: "implementation specialist" (lowercase)
- Try with extra spaces: " Implementation Specialist "
- Both should trigger duplicate validation

---

### Scenario 5: Unique Role Name Validation - Self-Edit Allowed
**Objective**: Verify that editing a role's own name doesn't trigger duplicate error

**Given**: Rate card "Senior Consultant", External, 1200
**When**: User edits and changes:
- Role to "Senior Consultant" (same name)
- Rate to 1250
- Clicks Save

**Then**:
- ✅ No duplicate error shown
- ✅ Rate successfully updates to 1250
- ✅ Role name remains "Senior Consultant"
- ✅ Save operation completes successfully

---

### Scenario 6: Required Field Validation - Empty Role
**Objective**: Verify that empty role names are prevented

**Given**: User is editing "Support Specialist"
**When**: User clears the role field (makes it empty) and clicks Save
**Then**:
- ✅ Alert displays: "Please fill in all required fields: Role name, Category, Daily Rate"
- ✅ Row remains in edit mode
- ✅ Save operation is prevented
- ✅ User can correct the error

---

### Scenario 7: Required Field Validation - Empty Category
**Objective**: Verify that category selection is required

**Given**: User is editing "Technical Lead"
**When**: User:
- Changes category dropdown to blank/empty option
- Clicks Save

**Then**:
- ✅ Alert displays: "Please fill in all required fields..."
- ✅ Save is prevented
- ✅ Row remains in edit mode

---

### Scenario 8: Rate Validation - Negative Values
**Objective**: Verify that negative rates are prevented

**Given**: User is editing "Developer"
**When**: User enters -500 in the rate field and clicks Save
**Then**:
- ✅ Alert displays: "...Daily Rate (must be 0 or greater)"
- ✅ Save is prevented
- ✅ Row remains in edit mode

**Note**: Zero (0) should be allowed as a valid rate

---

### Scenario 9: Category Change - Internal to External
**Objective**: Verify category can be changed freely

**Given**: Rate card "Business Analyst", Internal, 650
**When**: User edits and changes:
- Category from Internal to External
- Rate to 950
- Clicks Save

**Then**:
- ✅ Category badge updates to "EXTERNAL" (blue styling)
- ✅ Rate updates to 950
- ✅ Save completes successfully
- ✅ No warning about changing category

---

### Scenario 10: Keyboard Shortcuts
**Objective**: Verify Enter and Escape keys work during editing

**Test 10a - Enter to Save**:
**Given**: User is in edit mode on "Project Manager"
**When**: User makes changes and presses Enter key
**Then**:
- ✅ Same behavior as clicking Save button
- ✅ Changes are saved
- ✅ Row exits edit mode

**Test 10b - Escape to Cancel**:
**Given**: User is in edit mode on "Tester"
**When**: User makes changes and presses Escape key
**Then**:
- ✅ Same behavior as clicking Cancel button
- ✅ Changes are discarded
- ✅ Row exits edit mode

---

### Scenario 11: Multiple Edits in Sequence
**Objective**: Verify multiple rate cards can be edited one after another

**Given**: Rate cards table with 5+ rate cards
**When**: User sequentially:
1. Edits "Role A", changes rate, saves
2. Edits "Role B", changes category, saves
3. Edits "Role C", changes name, saves

**Then**:
- ✅ Each edit completes successfully
- ✅ No interference between edits
- ✅ All changes persist
- ✅ No memory leaks or UI issues

---

### Scenario 12: Edit During Existing Resource Usage
**Objective**: Verify rate card can be edited even when used by Internal Resources

**Given**: 
- Rate card "Developer", Internal, 600
- Internal Resource using "Developer" role with 10 days allocated

**When**: User edits "Developer" rate card:
- Changes rate to 650
- Clicks Save

**Then**:
- ✅ Rate card updates to 650
- ✅ Existing Internal Resource KEEPS rate of 600 (frozen at assignment)
- ✅ No automatic recalculation of existing resources
- ✅ New Internal Resources added after this will use 650

---

### Scenario 13: Special Characters in Role Name
**Objective**: Verify special characters are handled correctly

**Given**: User is creating/editing a rate card
**When**: User enters role names with special characters:
- "C++ Developer"
- "Sys Admin / DevOps"
- "Architect & Designer"

**Then**:
- ✅ Special characters are accepted
- ✅ Save completes successfully
- ✅ Characters display correctly in table
- ✅ No encoding issues

---

### Scenario 14: Very Long Role Names
**Objective**: Verify UI handles long role names appropriately

**Given**: User is editing a rate card
**When**: User enters a very long role name (100+ characters):
"Senior Enterprise Solutions Architect with Cloud Infrastructure Specialization and DevOps Experience"

**Then**:
- ✅ Text input accepts the full name
- ✅ Save completes successfully
- ✅ Table cell handles overflow (ellipsis, wrapping, or scrolling)
- ✅ No UI breaking

---

### Scenario 15: Data Persistence Across Sessions
**Objective**: Verify edited rate cards persist after browser refresh

**Given**: User has edited 3 rate cards successfully
**When**: User refreshes the browser (F5) or closes and reopens the app
**Then**:
- ✅ All edited rate cards display with updated values
- ✅ No data loss
- ✅ localStorage contains updated data

---

### Scenario 16: Concurrent Edit Prevention
**Objective**: Verify only one rate card can be edited at a time

**Given**: User is editing "Senior Consultant" (row in edit mode)
**When**: User clicks Edit on "Developer" row
**Then**:
- ✅ Current edit on "Senior Consultant" completes first (or is cancelled)
- ✅ "Developer" enters edit mode
- ✅ No multiple rows in edit mode simultaneously

**Note**: This prevents data corruption from simultaneous edits

---

## Edge Cases & Boundary Testing

### Edge Case 1: Whitespace Handling
**Test**: Enter role name with leading/trailing spaces "  Developer  "
**Expected**: Spaces trimmed automatically, saved as "Developer"

### Edge Case 2: Zero Rate
**Test**: Enter rate of 0
**Expected**: Accepted as valid (some roles may be volunteer/free)

### Edge Case 3: Large Rate Values
**Test**: Enter rate of 999,999
**Expected**: Accepted, displayed with proper formatting "999,999"

### Edge Case 4: Decimal Rates
**Test**: Enter rate of 1250.50
**Expected**: Accepted, though typically rates are whole numbers

### Edge Case 5: Empty Table
**Test**: Edit when no rate cards exist (fresh install)
**Expected**: Add Rate Card button works, no edit errors

---

## Browser Compatibility Testing

Test all scenarios in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)  
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## Performance Testing

### Test 1: Large Dataset
**Setup**: 50+ rate cards
**Action**: Edit a rate card
**Expected**: 
- Edit mode activates within 100ms
- Save completes within 500ms
- No UI lag or freezing

### Test 2: Rapid Edits
**Setup**: Edit 10 rate cards in quick succession
**Expected**:
- No memory leaks
- Consistent performance
- All edits save correctly

---

## Regression Testing

Verify existing functionality still works:
- ✅ Add Rate Card functionality
- ✅ Delete Rate Card functionality  
- ✅ Internal Resources can still select roles from dropdown
- ✅ Rate card changes don't auto-update existing resources
- ✅ Settings navigation works
- ✅ Summary calculations remain accurate

---

## Accessibility Testing

- ✅ Tab navigation works through edit fields
- ✅ Screen readers announce edit mode
- ✅ Save/Cancel buttons have proper ARIA labels
- ✅ Error messages are accessible
- ✅ Keyboard shortcuts documented

---

## Bug Report Template

If you find issues, please report using this format:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [etc.]

**Expected Result**: [What should happen]

**Actual Result**: [What actually happened]

**Environment**:
- Browser: [Chrome 120.0]
- OS: [Windows 11 / macOS 14 / etc.]
- URL: [https://zyantik.com]

**Screenshots**: [Attach if applicable]

**Console Errors**: [Check browser console for errors]
```

---

## Sign-Off Checklist

Before marking testing complete, verify:

- [ ] All 16 main scenarios pass
- [ ] All 5 edge cases handled correctly
- [ ] Tested in at least 3 browsers
- [ ] Performance is acceptable (< 500ms saves)
- [ ] Accessibility requirements met
- [ ] Regression tests pass
- [ ] Documentation updated
- [ ] No console errors during normal operation

---

## Contact & Support

For questions or issues during testing:
- Check console log for "✅ Edit Manager loaded with Rate Card editing support"
- Verify `window.editManager` exists in browser console
- Report bugs through project issue tracker

---

**Last Updated**: [Date]
**Tested By**: [Your Name]
**Version**: 1.0.0 - Rate Card Editing Feature
