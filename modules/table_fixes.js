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

console.log('FINAL HEADER COLOR FIX loaded - Will apply correct blue (#667EEA) colors');
