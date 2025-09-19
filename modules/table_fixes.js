// SOLUTION 1: Auto-expanding input functionality (unchanged)
function createAutoExpandingInput(value, fieldName, itemType) {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = value;
    input.step = itemType === 'internal-resource' ? '0.5' : '0.01';
    input.min = '0';
    input.className = 'row-edit-input';
    input.setAttribute('data-field', fieldName);
    
    const minWidth = Math.max(60, value.toString().length * 10 + 20);
    
    input.style.cssText = `
        width: ${minWidth}px !important;
        max-width: 120px !important;
        min-width: 60px !important;
        padding: 6px !important;
        border: 1px solid #007bff !important;
        border-radius: 3px !important;
        text-align: center !important;
        font-size: 13px !important;
        background: white !important;
        box-sizing: border-box !important;
        transition: width 0.2s ease !important;
    `;
    
    function adjustWidth() {
        const textLength = input.value.length;
        const newWidth = Math.max(60, Math.min(120, textLength * 10 + 20));
        input.style.width = newWidth + 'px';
    }
    
    input.addEventListener('input', adjustWidth);
    input.addEventListener('keyup', adjustWidth);
    input.addEventListener('paste', () => setTimeout(adjustWidth, 10));
    
    return input;
}

// SOLUTION 2: Fixed header rendering with proper colspan
function renderTableHeadersCorrectly() {
    console.log('Rendering table headers with CORRECT structure and CSS...');
    
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
        
        console.log('Internal Resources headers rendered correctly');
    }
    
    // Update Vendor Costs table headers
    const vendorYearHeader = document.getElementById('vendorCostsYearHeader');
    const vendorMonthHeader = document.getElementById('vendorCostsTableHeader');
    
    if (vendorYearHeader && vendorMonthHeader) {
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
        
        console.log('Vendor Costs headers rendered correctly');
    }
    
    // Update Forecast table headers
    const forecastYearHeader = document.getElementById('forecastTableYearHeader');
    const forecastMonthHeader = document.getElementById('forecastTableHeader');
    
    if (forecastYearHeader && forecastMonthHeader) {
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
        
        console.log('Forecast headers rendered correctly');
    }
}

// SOLUTION 3: Enhanced rendering with CORRECT CSS header support and auto-expanding inputs
function renderInternalResourcesTableFixed() {
    console.log('Starting renderInternalResourcesTableFixed with CORRECT CSS headers...');
    
    // First ensure headers are correct
    renderTableHeadersCorrectly();
    
    const tbody = document.getElementById('internalResourcesTable');
    if (!tbody) {
        console.error('Internal resources table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    
    if (!projectData.internalResources || projectData.internalResources.length === 0) {
        const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : { count: 16 };
        const colspan = 3 + monthInfo.count + 2;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state" style="padding: 2rem; text-align: center; color: #6b7280;">No internal resources added yet</td></tr>`;
        return;
    }
    
    // Get month information
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        monthKeys: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12'],
        count: 12
    };
    
    console.log('Rendering Internal Resources with CORRECT CSS header styling - NO inline overrides');
    
    projectData.internalResources.forEach((resource, index) => {
        let monthCells = '';
        let totalDays = 0;
        
        // Generate month cells using monthKeys
        monthInfo.monthKeys.forEach((monthKey, i) => {
            const fieldName = `${monthKey}Days`;
            let days = resource[fieldName];
            if (days === undefined) {
                const quarterIndex = Math.ceil((i + 1) / 3);
                days = resource[`q${quarterIndex}Days`] || 0;
            } else {
                days = days || 0;
            }
            
            totalDays += days;
            
            // Let CSS handle all styling
            monthCells += `<td class="month-cell" data-field="${fieldName}">${days}</td>`;
        });
        
        const totalCost = totalDays * (resource.dailyRate || 0);
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', resource.id);
        row.setAttribute('data-type', 'internal-resource');
        
        row.innerHTML = `
            <td>${resource.role || 'Unknown Role'}</td>
            <td><span class="category-badge category-internal">${resource.rateCard || 'Internal'}</span></td>
            <td style="text-align: right;">$${(resource.dailyRate || 0).toLocaleString()}</td>
            ${monthCells}
            <td class="cost-total"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell">
                <div class="action-buttons" style="display: flex; gap: 4px; align-items: center; justify-content: center;">
                    <button class="edit-row-btn icon-btn" data-id="${resource.id}" data-type="internal-resource" title="Edit Row" onclick="editWholeRowProfessional(this)"
                            style="background-color: #17a2b8; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    ${createDeleteButtonProfessional(resource.id, 'internalResources')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Internal Resources table rendered with CORRECT CSS header styling');
}

// SOLUTION 4: Enhanced vendor costs rendering with CORRECT CSS header support
function renderVendorCostsTableFixed() {
    console.log('Starting renderVendorCostsTableFixed with CORRECT CSS headers...');
    
    // First ensure headers are correct
    renderTableHeadersCorrectly();
    
    const tbody = document.getElementById('vendorCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    if (!projectData.vendorCosts || projectData.vendorCosts.length === 0) {
        const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : { count: 16 };
        const colspan = 3 + monthInfo.count + 2;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state" style="padding: 2rem; text-align: center; color: #6b7280;">No vendor costs added yet</td></tr>`;
        return;
    }
    
    // Get month information
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        monthKeys: ['month1', 'month2', 'month3', 'month4', 'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12'],
        count: 12
    };
    
    console.log('Rendering Vendor Costs with CORRECT CSS header styling - NO inline overrides');
    
    projectData.vendorCosts.forEach(vendor => {
        let monthCells = '';
        let totalCost = 0;
        
        // Generate month cells using monthKeys
        monthInfo.monthKeys.forEach((monthKey, i) => {
            const fieldName = `${monthKey}Cost`;
            let cost = vendor[fieldName];
            if (cost === undefined) {
                const quarterIndex = Math.ceil((i + 1) / 3);
                cost = vendor[`q${quarterIndex}Cost`] || 0;
            } else {
                cost = cost || 0;
            }
            
            totalCost += cost;
            
            // Let CSS handle all styling
            monthCells += `<td class="month-cell" data-field="${fieldName}">$${cost.toLocaleString()}</td>`;
        });
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', vendor.id);
        row.setAttribute('data-type', 'vendor-cost');
        
        row.innerHTML = `
            <td>${vendor.vendor || 'Unknown Vendor'}</td>
            <td><span class="category-badge">${vendor.category || 'Other'}</span></td>
            <td>${vendor.description || 'No description'}</td>
            ${monthCells}
            <td class="cost-total"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell">
                <div class="action-buttons" style="display: flex; gap: 4px; align-items: center; justify-content: center;">
                    <button class="edit-row-btn icon-btn" data-id="${vendor.id}" data-type="vendor-cost" title="Edit Row" onclick="editWholeRowProfessional(this)"
                            style="background-color: #17a2b8; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    ${createDeleteButtonProfessional(vendor.id, 'vendorCosts')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Vendor Costs table rendered with CORRECT CSS header styling');
}

// SOLUTION 5: Professional whole row editing (same as before)
function editWholeRowProfessional(button) {
    const row = button.closest('tr');
    const itemId = button.getAttribute('data-id');
    const itemType = button.getAttribute('data-type');
    
    if (row.classList.contains('editing-row')) return;
    
    console.log(`Starting professional whole row edit for ${itemType} ${itemId}`);
    
    row.classList.add('editing-row');
    
    // Store original data
    const originalData = {};
    const monthCells = row.querySelectorAll('.month-cell');
    
    monthCells.forEach(cell => {
        const fieldName = cell.getAttribute('data-field');
        originalData[fieldName] = cell.textContent.replace(/[$,]/g, '');
    });
    
    // Convert cells to auto-expanding inputs
    monthCells.forEach((cell, index) => {
        const fieldName = cell.getAttribute('data-field');
        const currentValue = cell.textContent.replace(/[$,]/g, '');
        
        const input = createAutoExpandingInput(currentValue, fieldName, itemType);
        
        // Enhanced editing state styling
        cell.style.cssText = `
            background-color: #fff3cd !important;
            border: 1px solid #ffc107 !important;
            padding: 8px !important;
            text-align: center !important;
        `;
        
        cell.innerHTML = '';
        cell.appendChild(input);
    });
    
    // Professional save/cancel buttons
    const actionCell = row.querySelector('.action-cell');
    actionCell.innerHTML = `
        <div class="row-edit-actions" style="display: flex; gap: 4px; justify-content: center;">
            <button class="save-row-btn icon-btn" onclick="saveWholeRowProfessional(this, '${itemId}', '${itemType}')" title="Save Row Changes"
                    style="background-color: #28a745; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
            </button>
            <button class="cancel-row-btn icon-btn" onclick="cancelWholeRowProfessional(this, '${itemId}', '${itemType}')" title="Cancel Row Changes"
                    style="background-color: #dc3545; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    row.setAttribute('data-original', JSON.stringify(originalData));
    
    // Focus first input
    const firstInput = row.querySelector('.row-edit-input');
    if (firstInput) {
        firstInput.focus();
        firstInput.select();
    }
}

// SOLUTION 6: Professional save function (same as before)
function saveWholeRowProfessional(button, itemId, itemType) {
    const row = button.closest('tr');
    console.log(`Saving professional whole row for ${itemType} ${itemId}`);
    
    try {
        const projectData = window.projectData || {};
        let item = null;
        
        if (itemType === 'internal-resource') {
            item = projectData.internalResources?.find(r => r.id == itemId);
        } else if (itemType === 'vendor-cost') {
            item = projectData.vendorCosts?.find(v => v.id == itemId);
        }
        
        if (!item) {
            throw new Error('Item not found');
        }
        
        const inputs = row.querySelectorAll('.row-edit-input');
        let hasChanges = false;
        
        inputs.forEach(input => {
            const fieldName = input.getAttribute('data-field');
            const newValue = parseFloat(input.value) || 0;
            const oldValue = item[fieldName] || 0;
            
            if (newValue !== oldValue) {
                hasChanges = true;
                item[fieldName] = newValue;
            }
        });
        
        if (hasChanges) {
            if (window.DataManager && window.DataManager.saveToLocalStorage) {
                window.DataManager.saveToLocalStorage();
            } else if (typeof(Storage) !== "undefined") {
                localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            }
        }
        
        // Re-render with professional styling and CORRECT headers
        if (itemType === 'internal-resource') {
            renderInternalResourcesTableFixed();
        } else if (itemType === 'vendor-cost') {
            renderVendorCostsTableFixed();
        }
        
        updateResourcePlanTabProfessional();
        
        if (window.updateSummary) {
            window.updateSummary();
        }
        
        console.log('Professional row saved successfully with CORRECT CSS headers');
        
    } catch (error) {
        console.error('Error saving professional row:', error);
        alert('Error saving changes: ' + error.message);
        cancelWholeRowProfessional(button, itemId, itemType);
    }
}

// SOLUTION 7: Professional cancel function (same as before)
function cancelWholeRowProfessional(button, itemId, itemType) {
    const row = button.closest('tr');
    console.log(`Cancelling professional row edit for ${itemType} ${itemId}`);
    
    if (itemType === 'internal-resource') {
        renderInternalResourcesTableFixed();
    } else if (itemType === 'vendor-cost') {
        renderVendorCostsTableFixed();
    }
}

// SOLUTION 8: Enhanced resource plan update (same as before)
function updateResourcePlanTabProfessional() {
    console.log('Updating resource plan tab with professional calculations...');
    
    try {
        if (window.tableRenderer && window.tableRenderer.renderForecastTable) {
            window.tableRenderer.renderForecastTable();
        }
        
        const internalTotal = calculateInternalResourcesTotalFixed();
        const vendorTotal = calculateVendorCostsTotalFixed();
        const toolTotal = calculateToolCostsTotalFixed();
        const miscTotal = calculateMiscCostsTotalFixed();
        
        const totalProject = internalTotal + vendorTotal + toolTotal + miscTotal;
        const totalExternal = vendorTotal + toolTotal + miscTotal;
        
        const totalProjectCostEl = document.getElementById('totalProjectCost');
        const totalInternalCostEl = document.getElementById('totalInternalCost');
        const totalExternalCostEl = document.getElementById('totalExternalCost');
        
        if (totalProjectCostEl) totalProjectCostEl.textContent = `$${totalProject.toLocaleString()}`;
        if (totalInternalCostEl) totalInternalCostEl.textContent = `$${internalTotal.toLocaleString()}`;
        if (totalExternalCostEl) totalExternalCostEl.textContent = `$${totalExternal.toLocaleString()}`;
        
        console.log('Resource plan updated professionally');
        
    } catch (error) {
        console.error('Error updating resource plan:', error);
    }
}

// SOLUTION 9: Professional delete button (same as before)
function createDeleteButtonProfessional(itemId, arrayName) {
    return `<button class="delete-btn icon-btn" onclick="deleteItem('${arrayName}', ${typeof itemId === 'string' ? `'${itemId}'` : itemId})" title="Delete"
                style="background-color: #dc3545; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; transition: all 0.2s ease;"
                onmouseover="this.style.backgroundColor='#c82333'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 2px 8px rgba(220, 53, 69, 0.3)';"
                onmouseout="this.style.backgroundColor='#dc3545'; this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
        </svg>
    </button>`;
}

// SOLUTION 10: Calculation functions (same as before)
function calculateInternalResourcesTotalFixed() {
    const projectData = window.projectData || {};
    return (projectData.internalResources || []).reduce((total, resource) => {
        let totalDays = 0;
        for (let i = 1; i <= 24; i++) {
            const monthField = `month${i}Days`;
            if (resource[monthField] !== undefined) {
                totalDays += resource[monthField] || 0;
            }
        }
        if (totalDays === 0) {
            totalDays = (resource.q1Days || 0) + (resource.q2Days || 0) + (resource.q3Days || 0) + (resource.q4Days || 0);
        }
        return total + (totalDays * (resource.dailyRate || 0));
    }, 0);
}

function calculateVendorCostsTotalFixed() {
    const projectData = window.projectData || {};
    return (projectData.vendorCosts || []).reduce((total, vendor) => {
        let totalCost = 0;
        for (let i = 1; i <= 24; i++) {
            const monthField = `month${i}Cost`;
            if (vendor[monthField] !== undefined) {
                totalCost += vendor[monthField] || 0;
            }
        }
        if (totalCost === 0) {
            totalCost = (vendor.q1Cost || 0) + (vendor.q2Cost || 0) + (vendor.q3Cost || 0) + (vendor.q4Cost || 0);
        }
        return total + totalCost;
    }, 0);
}

function calculateToolCostsTotalFixed() {
    const projectData = window.projectData || {};
    return (projectData.toolCosts || []).reduce((total, tool) => {
        return total + ((tool.users || 0) * (tool.monthlyCost || 0) * (tool.duration || 0));
    }, 0);
}

function calculateMiscCostsTotalFixed() {
    const projectData = window.projectData || {};
    return (projectData.miscCosts || []).reduce((total, misc) => {
        return total + (misc.cost || 0);
    }, 0);
}

// SOLUTION 11: Apply COMPLETE professional fixes
function applyCompleteProfessionalStylingFixes() {
    console.log('Applying COMPLETE professional styling fixes with CORRECT headers AND body...');
    
    // CRITICAL: Completely override both header AND body rendering
    if (window.tableRenderer) {
        // Override the header update function
        window.tableRenderer.updateTableHeaders = renderTableHeadersCorrectly;
        
        // Override the table rendering functions
        window.tableRenderer.renderInternalResourcesTable = renderInternalResourcesTableFixed;
        window.tableRenderer.renderVendorCostsTable = renderVendorCostsTableFixed;
        
        try {
            // First render headers correctly
            renderTableHeadersCorrectly();
            
            // Then render tables with corrected styling
            renderInternalResourcesTableFixed();
            renderVendorCostsTableFixed();
            
            console.log('COMPLETE professional styling applied successfully with CORRECT CSS headers');
        } catch (error) {
            console.error('Error applying COMPLETE professional styling:', error);
        }
    } else {
        console.warn('tableRenderer not found, applying fixes directly');
        renderTableHeadersCorrectly();
        renderInternalResourcesTableFixed();
        renderVendorCostsTableFixed();
    }
}

// SOLUTION 12: Global function exports
window.editWholeRowProfessional = editWholeRowProfessional;
window.saveWholeRowProfessional = saveWholeRowProfessional;
window.cancelWholeRowProfessional = cancelWholeRowProfessional;
window.updateResourcePlanTabProfessional = updateResourcePlanTabProfessional;
window.applyCompleteProfessionalStylingFixes = applyCompleteProfessionalStylingFixes;
window.renderTableHeadersCorrectly = renderTableHeadersCorrectly;

// Auto-apply COMPLETE professional fixes
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Auto-applying COMPLETE professional styling fixes with CORRECT headers AND body...');
        applyCompleteProfessionalStylingFixes();
    }, 1500);
});

console.log('COMPLETE PROFESSIONAL STYLING fixes loaded - Headers AND Body with auto-expanding inputs, CORRECT CSS headers, professional buttons');
