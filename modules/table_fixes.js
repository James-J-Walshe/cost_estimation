/**
 * FINAL HEADER COLOR FIX
 * 
 * The issue: Header elements need the CSS classes applied to the <tr> elements, not just <th>
 * This ensures the correct blue color (#667EEA) is applied instead of default gray
 */

// SOLUTION: Fixed header rendering with correct CSS class application
function renderTableHeadersCorrectly() {
    console.log('Rendering table headers with CORRECT CSS classes applied to TR elements...');
    
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        monthKeys: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12'],
        yearGroups: [
            { year: 2026, months: ['Oct', 'Nov', 'Dec'], count: 3 },
            { year: 2027, months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], count: 12 }
        ],
        count: 12
    };
    
    // Update Internal Resources table headers
    const internalYearHeader = document.getElementById('internalResourcesYearHeader');
    const internalMonthHeader = document.getElementById('internalResourcesTableHeader');
    
    if (internalYearHeader && internalMonthHeader) {
        // CRITICAL FIX: Apply CSS classes to the TR elements themselves
        internalYearHeader.className = 'year-header-row';
        internalMonthHeader.className = 'month-header-row';
        
        // Build year header row
        let yearRowHTML = `
            <th rowspan="2" class="fixed-column">Role</th>
            <th rowspan="2" class="fixed-column">Rate Card</th>
            <th rowspan="2" class="fixed-column">Daily Rate</th>
        `;
        
        // Add year columns with proper colspan
        monthInfo.yearGroups.forEach(yearGroup => {
            yearRowHTML += `<th colspan="${yearGroup.count}">${yearGroup.year}</th>`;
        });
        
        yearRowHTML += `
            <th rowspan="2" class="fixed-column">Total Cost</th>
            <th rowspan="2" class="fixed-column">Actions</th>
        `;
        
        // Build month header row (only month names, no fixed columns)
        let monthRowHTML = '';
        monthInfo.months.forEach(month => {
            monthRowHTML += `<th>${month}</th>`;
        });
        
        internalYearHeader.innerHTML = yearRowHTML;
        internalMonthHeader.innerHTML = monthRowHTML;
        
        console.log('Internal Resources headers rendered with CORRECT CSS classes on TR elements');
    }
    
    // Update Vendor Costs table headers
    const vendorYearHeader = document.getElementById('vendorCostsYearHeader');
    const vendorMonthHeader = document.getElementById('vendorCostsTableHeader');
    
    if (vendorYearHeader && vendorMonthHeader) {
        // CRITICAL FIX: Apply CSS classes to the TR elements themselves
        vendorYearHeader.className = 'year-header-row';
        vendorMonthHeader.className = 'month-header-row';
        
        // Build year header row
        let yearRowHTML = `
            <th rowspan="2" class="fixed-column">Vendor</th>
            <th rowspan="2" class="fixed-column">Category</th>
            <th rowspan="2" class="fixed-column">Description</th>
        `;
        
        // Add year columns with proper colspan
        monthInfo.yearGroups.forEach(yearGroup => {
            yearRowHTML += `<th colspan="${yearGroup.count}">${yearGroup.year}</th>`;
        });
        
        yearRowHTML += `
            <th rowspan="2" class="fixed-column">Total Cost</th>
            <th rowspan="2" class="fixed-column">Actions</th>
        `;
        
        // Build month header row (only month names, no fixed columns)
        let monthRowHTML = '';
        monthInfo.months.forEach(month => {
            monthRowHTML += `<th>${month}</th>`;
        });
        
        vendorYearHeader.innerHTML = yearRowHTML;
        vendorMonthHeader.innerHTML = monthRowHTML;
        
        console.log('Vendor Costs headers rendered with CORRECT CSS classes on TR elements');
    }
    
    // Update Forecast table headers
    const forecastYearHeader = document.getElementById('forecastTableYearHeader');
    const forecastMonthHeader = document.getElementById('forecastTableHeader');
    
    if (forecastYearHeader && forecastMonthHeader) {
        // CRITICAL FIX: Apply CSS classes to the TR elements themselves
        forecastYearHeader.className = 'year-header-row';
        forecastMonthHeader.className = 'month-header-row';
        
        // Build year header row
        let yearRowHTML = `<th rowspan="2" class="fixed-column">Category</th>`;
        
        // Add year columns with proper colspan
        monthInfo.yearGroups.forEach(yearGroup => {
            yearRowHTML += `<th colspan="${yearGroup.count}">${yearGroup.year}</th>`;
        });
        
        yearRowHTML += `<th rowspan="2" class="fixed-column">Total</th>`;
        
        // Build month header row (only month names, no fixed columns)
        let monthRowHTML = '';
        monthInfo.months.forEach(month => {
            monthRowHTML += `<th>${month}</th>`;
        });
        
        forecastYearHeader.innerHTML = yearRowHTML;
        forecastMonthHeader.innerHTML = monthRowHTML;
        
        console.log('Forecast headers rendered with CORRECT CSS classes on TR elements');
    }
    
    console.log('All headers now have correct CSS classes applied to TR elements for proper blue coloring');
}

// SOLUTION: Force CSS class application and override any conflicting styles
function forceCorrectHeaderColors() {
    console.log('Forcing correct header colors by applying CSS classes directly...');
    
    // Find all year header rows and ensure they have the correct class and style
    const yearHeaderRows = document.querySelectorAll('#internalResourcesYearHeader, #vendorCostsYearHeader, #forecastTableYearHeader');
    yearHeaderRows.forEach(row => {
        if (row) {
            row.className = 'year-header-row';
            // Force the background color to ensure it overrides any conflicting styles
            row.style.backgroundColor = '#667eea';
            row.style.color = 'white';
            console.log('Applied year-header-row class and forced blue background to:', row.id);
        }
    });
    
    // Find all month header rows and ensure they have the correct class and style
    const monthHeaderRows = document.querySelectorAll('#internalResourcesTableHeader, #vendorCostsTableHeader, #forecastTableHeader');
    monthHeaderRows.forEach(row => {
        if (row) {
            row.className = 'month-header-row';
            // Force the background color to ensure it overrides any conflicting styles
            row.style.backgroundColor = '#f1f5f9';
            row.style.color = '#374151';
            console.log('Applied month-header-row class and forced light background to:', row.id);
        }
    });
    
    console.log('Header colors forced to correct values');
}

// SOLUTION: Complete header fix with both CSS classes AND forced styles
function applyCompleteHeaderFix() {
    console.log('Applying COMPLETE header fix - CSS classes AND forced colors...');
    
    // First apply the correct structure and CSS classes
    renderTableHeadersCorrectly();
    
    // Then force the correct colors to override any conflicting styles
    setTimeout(() => {
        forceCorrectHeaderColors();
    }, 100);
    
    console.log('Complete header fix applied');
}

// Export the functions
window.renderTableHeadersCorrectly = renderTableHeadersCorrectly;
window.forceCorrectHeaderColors = forceCorrectHeaderColors;
window.applyCompleteHeaderFix = applyCompleteHeaderFix;

// Auto-apply the complete fix
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Auto-applying COMPLETE header color fix...');
        applyCompleteHeaderFix();
    }, 2000);
});

console.log('FINAL HEADER COLOR FIX loaded - Will apply correct blue (#667EEA) colors');/**

 * CSS OVERRIDE FIX - Force Blue Headers
 * 
 * Based on Copilot's analysis, there's a conflicting gradient rule overriding the blue color.
 * This fix will inject CSS with !important to ensure the blue color wins.
 */

function injectForceBlueHeadersCSS() {
    console.log('Injecting CSS to force blue headers and override conflicting gradient...');
    
    // Create a style element to inject our override CSS
    const styleElement = document.createElement('style');
    styleElement.id = 'force-blue-headers-override';
    
    // CSS to force the correct colors with !important
    styleElement.textContent = `
        /* FORCE BLUE YEAR HEADERS - Override any conflicting gradients */
        .data-table thead tr.year-header-row th {
            background: #667eea !important;
            background-color: #667eea !important;
            background-image: none !important;
            color: white !important;
            font-weight: 700 !important;
            text-align: center !important;
            font-size: 0.9rem !important;
            padding: 0.4rem 1rem !important;
            border-bottom: 1px solid rgba(255,255,255,0.3) !important;
        }
        
        /* FORCE LIGHT GRAY MONTH HEADERS */
        .data-table thead tr.month-header-row th {
            background: #f1f5f9 !important;
            background-color: #f1f5f9 !important;
            background-image: none !important;
            color: #374151 !important;
            font-weight: 600 !important;
            text-align: center !important;
            font-size: 0.8rem !important;
            padding: 0.4rem 0.5rem !important;
            border-bottom: 2px solid #e5e7eb !important;
            white-space: nowrap !important;
        }
        
        /* SPECIAL STYLING FOR FIXED COLUMNS IN MONTH HEADER ROW */
        .data-table thead tr.month-header-row th.fixed-column {
            background: #f8fafc !important;
            background-color: #f8fafc !important;
            background-image: none !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            padding: 1rem !important;
            text-align: left !important;
        }
        
        /* ADDITIONAL OVERRIDE: Remove any gradient from year header rows */
        .year-header-row th {
            background: #667eea !important;
            background-image: none !important;
        }
        
        /* ENSURE NO CONFLICTING GRADIENTS */
        thead tr.year-header-row th,
        tr.year-header-row th,
        .year-header-row th {
            background: #667eea !important;
            background-color: #667eea !important;
            background-image: none !important;
            color: white !important;
        }
    `;
    
    // Remove any existing override styles
    const existingOverride = document.getElementById('force-blue-headers-override');
    if (existingOverride) {
        existingOverride.remove();
    }
    
    // Inject the new styles
    document.head.appendChild(styleElement);
    
    console.log('Blue header override CSS injected successfully');
}

function applyHeaderClassesAndColors() {
    console.log('Applying header classes and forcing colors...');
    
    // Apply the CSS override first
    injectForceBlueHeadersCSS();
    
    // Get month info for structure
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
        yearGroups: [
            { year: 2026, count: 8 },
            { year: 2027, count: 12 },
            { year: 2028, count: 1 }
        ]
    };
    
    // Apply classes to Internal Resources headers
    const internalYearHeader = document.getElementById('internalResourcesYearHeader');
    const internalMonthHeader = document.getElementById('internalResourcesTableHeader');
    
    if (internalYearHeader && internalMonthHeader) {
        // Set the correct classes
        internalYearHeader.className = 'year-header-row';
        internalMonthHeader.className = 'month-header-row';
        
        // Force the background colors directly as well
        internalYearHeader.style.cssText = 'background-color: #667eea !important; color: white !important;';
        internalMonthHeader.style.cssText = 'background-color: #f1f5f9 !important; color: #374151 !important;';
        
        console.log('Internal Resources headers: classes and styles applied');
    }
    
    // Apply classes to Vendor Costs headers
    const vendorYearHeader = document.getElementById('vendorCostsYearHeader');
    const vendorMonthHeader = document.getElementById('vendorCostsTableHeader');
    
    if (vendorYearHeader && vendorMonthHeader) {
        // Set the correct classes
        vendorYearHeader.className = 'year-header-row';
        vendorMonthHeader.className = 'month-header-row';
        
        // Force the background colors directly as well
        vendorYearHeader.style.cssText = 'background-color: #667eea !important; color: white !important;';
        vendorMonthHeader.style.cssText = 'background-color: #f1f5f9 !important; color: #374151 !important;';
        
        console.log('Vendor Costs headers: classes and styles applied');
    }
    
    // Apply classes to Forecast headers
    const forecastYearHeader = document.getElementById('forecastTableYearHeader');
    const forecastMonthHeader = document.getElementById('forecastTableHeader');
    
    if (forecastYearHeader && forecastMonthHeader) {
        // Set the correct classes
        forecastYearHeader.className = 'year-header-row';
        forecastMonthHeader.className = 'month-header-row';
        
        // Force the background colors directly as well
        forecastYearHeader.style.cssText = 'background-color: #667eea !important; color: white !important;';
        forecastMonthHeader.style.cssText = 'background-color: #f1f5f9 !important; color: #374151 !important;';
        
        console.log('Forecast headers: classes and styles applied');
    }
    
    console.log('All header classes and forced colors applied successfully');
}

function forceBlueHeadersEverywhere() {
    console.log('NUCLEAR OPTION: Forcing blue headers everywhere with maximum specificity...');
    
    // First apply the CSS override
    injectForceBlueHeadersCSS();
    
    // Then apply classes and inline styles
    applyHeaderClassesAndColors();
    
    // Finally, use JavaScript to force the styles on every possible header element
    setTimeout(() => {
        // Target all possible year header elements
        const yearHeaders = document.querySelectorAll(`
            #internalResourcesYearHeader,
            #vendorCostsYearHeader,
            #forecastTableYearHeader,
            .year-header-row,
            tr.year-header-row
        `);
        
        yearHeaders.forEach(header => {
            if (header) {
                header.style.setProperty('background-color', '#667eea', 'important');
                header.style.setProperty('background', '#667eea', 'important');
                header.style.setProperty('background-image', 'none', 'important');
                header.style.setProperty('color', 'white', 'important');
                
                // Also apply to all th elements within
                const thElements = header.querySelectorAll('th');
                thElements.forEach(th => {
                    th.style.setProperty('background-color', '#667eea', 'important');
                    th.style.setProperty('background', '#667eea', 'important');
                    th.style.setProperty('background-image', 'none', 'important');
                    th.style.setProperty('color', 'white', 'important');
                });
            }
        });
        
        // Target all possible month header elements
        const monthHeaders = document.querySelectorAll(`
            #internalResourcesTableHeader,
            #vendorCostsTableHeader,
            #forecastTableHeader,
            .month-header-row,
            tr.month-header-row
        `);
        
        monthHeaders.forEach(header => {
            if (header) {
                header.style.setProperty('background-color', '#f1f5f9', 'important');
                header.style.setProperty('background', '#f1f5f9', 'important');
                header.style.setProperty('background-image', 'none', 'important');
                header.style.setProperty('color', '#374151', 'important');
                
                // Also apply to all th elements within (except fixed columns)
                const thElements = header.querySelectorAll('th:not(.fixed-column)');
                thElements.forEach(th => {
                    th.style.setProperty('background-color', '#f1f5f9', 'important');
                    th.style.setProperty('background', '#f1f5f9', 'important');
                    th.style.setProperty('background-image', 'none', 'important');
                    th.style.setProperty('color', '#374151', 'important');
                });
            }
        });
        
        console.log('NUCLEAR OPTION: Blue headers forced with maximum specificity');
    }, 200);
}

// Export functions
window.injectForceBlueHeadersCSS = injectForceBlueHeadersCSS;
window.applyHeaderClassesAndColors = applyHeaderClassesAndColors;
window.forceBlueHeadersEverywhere = forceBlueHeadersEverywhere;

// Auto-apply the nuclear option
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Auto-applying NUCLEAR OPTION for blue headers...');
        forceBlueHeadersEverywhere();
    }, 2500);
});

console.log('CSS OVERRIDE FIX loaded - Will force blue headers with !important and maximum specificity');
