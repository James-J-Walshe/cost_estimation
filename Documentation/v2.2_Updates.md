# Quick Reference Guide - Documentation v2.2 Updates

## 🎯 What You Need to Know

This documentation update captures everything from your two debugging/implementation sessions:
1. **Resource Plan table rendering fixes** (missing headers, tool costs row)
2. **Tool Costs Manager implementation** (Issue #65)

---

## 📍 Where to Find Things

### New Module: Tool Costs Manager

**Location in docs:** Section "Tool Costs Feature"

**Quick lookup:**
- What it does: Line ~560
- How to use it: Line ~570
- Data structure: Line ~640
- Billing frequencies: Line ~660

**Code file:** `modules/tool_costs_manager.js`

### Resource Plan Enhancements

**Location in docs:** Section "Resource Plan Enhancements"

**Quick lookup:**
- Five-row forecast: Line ~700
- Dynamic months: Line ~720
- HTML structure: Line ~730
- Key functions: Line ~750
- Tool cost calculations: Line ~780

**Code files:** 
- `js/table_renderer.js` (renderForecastTable)
- `script.js` (renderResourcePlanForecast)

### Troubleshooting Your Issues

#### Issue 1: Tool Costs Showing $0
**Location:** Troubleshooting section, line ~950

**What you'll find:**
- Case sensitivity bug (Monthly vs monthly)
- Quarterly billing not handled
- Debug commands to test
- Console emoji indicators (🎯📦💰)

#### Issue 2: Missing Resource Plan Headers/Rows
**Location:** Troubleshooting section, line ~1000

**What you'll find:**
- HTML ID requirements
- Conflicting renderer detection
- Manual testing commands
- Expected console output

#### Issue 3: Quarterly Costs Smoothed
**Location:** Troubleshooting section, line ~1050

**What you'll find:**
- Why smoothing is wrong for cash flow
- Correct billing logic code
- Monthly vs quarterly example

#### Issue 4: Syntax Error (Duplicate Backtick)
**Location:** Troubleshooting section, line ~840

**What you'll find:**
- Template literal syntax error
- Line-by-line fix
- How to find duplicate backticks

---

## 🔧 Common Tasks

### Add a Tool Cost with Billing Frequency

**Where to look:** 
- "Tool Costs Feature" section (line ~560)
- "Pattern 6: Billing Frequency Calculations" (line ~540)

**Example:**
```javascript
// Monthly billing
{
    procurementType: 'Software License',
    toolName: 'Test Software',
    billingFrequency: 'monthly',  // lowercase!
    costPerPeriod: 200,
    quantity: 5,
    startDate: '2025-02',
    endDate: '2025-12'
}
```

### Debug Resource Plan Not Rendering

**Where to look:**
- "Resource Plan Enhancements" section (line ~690)
- "Troubleshooting" → "Resource Plan table missing" (line ~1000)

**Quick debug:**
```javascript
// Check dates
console.log(window.projectData.projectInfo.startDate);
console.log(window.projectData.projectInfo.endDate);

// Check HTML
console.log(document.getElementById('forecastTableHead'));
console.log(document.getElementById('forecastTableBody'));

// Manual render
renderResourcePlanForecast();
```

### Calculate Tool Costs Manually

**Where to look:**
- "Tool Costs Feature" → "Calculating Monthly Breakdown" (line ~595)

**Code:**
```javascript
const breakdown = window.toolCostsManager.calculateMonthlyBreakdown(
    toolCost,
    '2025-02-01',  // Project start
    '2025-12-31'   // Project end
);
console.log(breakdown);
```

### Add a New Module

**Where to look:**
- "Development Guidelines" → "Adding a New Module" (line ~270)
- Module checklist (line ~860)

**Critical steps:**
1. Create module file with class
2. Export to window: `window.myModule = new MyModule()`
3. Add script tag BEFORE init_manager.js
4. Register in init_manager modules object
5. **Don't forget the comma!** ⚠️

---

## 💡 Key Learnings to Remember

### 1. Billing Frequency = Lowercase Always
**Where:** "Best Practices" section (line ~1120)

```javascript
✅ CORRECT: 'monthly', 'quarterly', 'annual', 'one-time'
❌ WRONG: 'Monthly', 'Quarterly', 'Annual', 'One-time'
```

### 2. Show Costs in Billing Months, Don't Smooth
**Where:** "Resource Plan Enhancements" → "Tool Cost Calculation" (line ~780)

```javascript
✅ CORRECT: Quarterly $3,000 → months 1, 4, 7, 10
❌ WRONG: Quarterly $3,000 ÷ 3 = $1,000 every month
```

**Why:** Cash flow planning needs to see actual spending spikes!

### 3. Export Before Using
**Where:** "Development Guidelines" → "Adding Global Functions" (line ~320)

```javascript
// Define function
function myFunction() { /* ... */ }

// MUST export to window
window.myFunction = myFunction;
```

### 4. Check for Duplicate Backticks
**Where:** "Troubleshooting" → "Uncaught SyntaxError" (line ~840)

```javascript
// WRONG:
        `,
        `,  // ❌ Duplicate = syntax error

// CORRECT:
        `,
        miscCost: `  // ✓ Only one
```

### 5. Use Emoji Debug Logs
**Where:** "Troubleshooting" → "Tool Costs showing $0" (line ~980)

Look for these in console:
- 🎯 = Starting calculation
- 📦 = Processing tool
- 💰 = Cost values
- ✅ = Success
- ⚠️ = Warning

---

## 📊 Data Structures at a Glance

### Tool Cost Object (Enhanced)
**Where:** "Pattern 5: Tool Costs Data Structure" (line ~500)

```javascript
{
    id: 1234567890,
    procurementType: 'Software License',  // NEW
    toolName: 'Test Software',
    billingFrequency: 'monthly',          // NEW
    costPerPeriod: 200,                   // NEW
    quantity: 5,                          // NEW
    startDate: '2025-08',                 // NEW
    endDate: '2025-12',                   // NEW
    isOngoing: false,                     // NEW
    totalCost: 5000
}
```

### Resource Plan HTML Structure
**Where:** "Resource Plan Enhancements" → "HTML Structure" (line ~730)

```html
<table class="data-table" id="forecastTable">
    <thead id="forecastTableHead">
        <!-- Year + month headers -->
    </thead>
    <tbody id="forecastTableBody">
        <!-- 5 rows: Internal, Vendor, Tool, Misc, Total -->
    </tbody>
</table>
```

---

## 🧪 Testing Checklist

**Where:** "Testing Scenarios" section (line ~885)

Quick test suite:
- [ ] Monthly billing (Test 1)
- [ ] Quarterly billing (Test 2)
- [ ] One-time purchase (Test 3)
- [ ] Ongoing license (Test 4)
- [ ] Date validation (Test 5)
- [ ] Resource Plan shows tool costs (Test 6)

---

## 🔄 Initialization Sequence

**Where:** "Initialization Flow Diagram" (line ~1160)

**New steps added:**
- Step 12: Initialize Tool Costs Manager
- Step 13: Render Resource Plan forecast

**Critical modules loaded:**
```javascript
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
```

---

## 🎓 Development Patterns

### Pattern: Tool Cost Calculation
**Where:** "Pattern 6: Billing Frequency Calculations" (line ~540)

```javascript
// Monthly: Every month
if (billingFreq === 'monthly') {
    for (let i = 0; i < monthInfo.count; i++) {
        toolMonthly[i] += cost;
    }
}

// Quarterly: Months 1, 4, 7, 10...
if (billingFreq === 'quarterly') {
    for (let i = 0; i < monthInfo.count; i += 3) {
        toolMonthly[i] += cost;
    }
}

// Annual: First month only (then month 13 if applicable)
if (billingFreq === 'annual') {
    toolMonthly[0] += cost;
    if (monthInfo.count > 12) {
        toolMonthly[12] += cost;
    }
}

// One-time: First month only
if (billingFreq === 'one-time') {
    toolMonthly[0] += cost;
}
```

---

## 📝 Before You Code

### Adding Tool Cost Features?
Read these sections first:
1. Tool Costs Feature (line ~560)
2. Pattern 6: Billing Frequency Calculations (line ~540)
3. Troubleshooting: Tool Costs showing $0 (line ~950)

### Modifying Resource Plan?
Read these sections first:
1. Resource Plan Enhancements (line ~690)
2. Troubleshooting: Resource Plan missing headers (line ~1000)
3. Key Functions: renderResourcePlanForecast (line ~750)

### Adding New Module?
Read these sections first:
1. Development Guidelines: Adding a New Module (line ~270)
2. Module Checklist (line ~860)
3. Initialization Manager Pattern (line ~60)

---

## 🚨 Critical Reminders

### 1. **COMMA in modules object**
**Line ~840 and ~1140**

```javascript
this.modules = {
    currencyManager: false,     // ← MUST have comma
    toolCostsManager: false     // ← Last item, no comma
};
```

### 2. **Lowercase billing frequencies**
**Line ~1120**

Always: `'monthly'`, `'quarterly'`, `'annual'`, `'one-time'`

### 3. **HTML IDs must match**
**Line ~730 and ~1000**

- `forecastTable` (table)
- `forecastTableHead` (thead)
- `forecastTableBody` (tbody)

### 4. **Export functions to window**
**Line ~320 and ~1125**

```javascript
window.myFunction = myFunction;
```

---

## 📚 Documentation Map

```
app_documentation.md
├── Project Overview (lines 1-50)
│   └── Features list (updated)
│
├── Architecture Pattern (lines 50-120)
│   └── Why Init Manager?
│
├── Initialization Manager (lines 120-250)
│   └── Sequence (Steps 1-14)
│
├── File Structure (lines 250-270)
│   └── tool_costs_manager.js (NEW)
│
├── Development Guidelines (lines 270-380)
│   └── Adding modules, functions, listeners
│
├── Common Patterns (lines 380-680)
│   ├── Pattern 1-4 (existing)
│   ├── Pattern 5: Tool Costs (NEW)
│   └── Pattern 6: Billing Frequencies (NEW)
│
├── Tool Costs Feature (lines 560-690) ⭐ NEW
│   ├── Overview
│   ├── Usage
│   ├── Data structure
│   └── Billing frequencies
│
├── Resource Plan (lines 690-860) ⭐ NEW
│   ├── Five-row forecast
│   ├── Dynamic months
│   ├── HTML structure
│   ├── Key functions
│   └── Debugging
│
├── Troubleshooting (lines 860-1120)
│   ├── Existing issues
│   ├── Tool costs = $0 (NEW)
│   ├── Missing headers (NEW)
│   └── Smoothed costs (NEW)
│
├── Best Practices (lines 1120-1160)
│   └── Enhanced DO's and DON'Ts
│
├── Testing Scenarios (lines 885-930) ⭐ NEW
│   └── 6 manual tests
│
└── Version History (lines 1220-1280)
    └── v2.2 (current)
```

---

## 🎯 Next Steps

After reviewing this documentation:

1. **Replace your documentation:**
   - Replace `Strategy/app_documentation.md` with the new version

2. **Review your implementation:**
   - Check `modules/tool_costs_manager.js` exists
   - Verify `js/table_renderer.js` has updated renderForecastTable()
   - Confirm `script.js` has renderResourcePlanForecast()
   - Validate `index.html` has correct forecast table IDs

3. **Test the changes:**
   - Run through the 6 test scenarios (line ~885)
   - Check console for emoji debug logs
   - Verify Resource Plan shows all 5 rows
   - Test different billing frequencies

4. **Reference when needed:**
   - Use this quick reference to find topics fast
   - Check troubleshooting for specific issues
   - Follow patterns for new features

---

**Documentation Version:** 2.2  
**Quick Reference Created:** October 29, 2025  
**Based on:** Resource Plan fixes + Tool Costs implementation (Issue #65)
