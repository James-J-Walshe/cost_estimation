/**
 * ENHANCED ROW EDITING TABLE FIX
 * 
 * New Features:
 * 1. Whole row editing when pen icon is clicked
 * 2. Single save/cancel buttons at row level
 * 3. Original light blue/grey table formatting
 * 4. Resource plan tab updates when saved
 */

// SOLUTION 1: Enhanced Internal Resources with original styling and row editing
function renderInternalResourcesTableFixed() {
    console.log('Starting renderInternalResourcesTableFixed with row editing...');
    
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
    
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        count: 16
    };
    
    console.log('Rendering Internal Resources with original styling and row editing');
    
    projectData.internalResources.forEach((resource, index) => {
        let monthCells = '';
        let totalDays = 0;
        
        // Create cells for ALL calculated months with original light styling
        for (let i = 1; i <= monthInfo.count; i++) {
            const fieldName = `month${i}Days`;
            let days = resource[fieldName];
            if (days === undefined) {
                const quarterIndex = Math.ceil(i / 3);
                days = resource[`q${quarterIndex}Days`] || 0;
            } else {
                days = days || 0;
            }
            
            totalDays += days;
            
            // Original light styling - alternating light blue/grey
            const bgColor = i % 2 === 0 ? '#f8fafc' : '#f1f5f9';
            monthCells += `<td class="month-cell" 
                              data-field="${fieldName}" 
                              style="text-align: center; padding: 8px 4px; background-color: ${bgColor}; border-right: 1px solid #e2e8f0; min-width: 60px;">${days}</td>`;
        }
        
        const totalCost = totalDays * (resource.dailyRate || 0);
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', resource.id);
        row.setAttribute('data-type', 'internal-resource');
        row.style.borderBottom = '1px solid #f3f4f6';
        
        // Original table structure with light styling
        row.innerHTML = `
            <td style="padding: 12px; background-color: white;">${resource.role || 'Unknown Role'}</td>
            <td style="padding: 12px; background-color: #f8fafc;"><span class="category-badge" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; background-color: #dcfce7; color: #166534;">${resource.rateCard || 'Internal'}</span></td>
            <td style="padding: 12px; text-align: right; background-color: white;">$${(resource.dailyRate || 0).toLocaleString()}</td>
            ${monthCells}
            <td class="cost-total" style="background-color: #f0fdf4; font-weight: 700; color: #166534; text-align: right; padding: 12px; border-left: 3px solid #16a34a;"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell" style="background-color: white; text-align: center; padding: 8px;">
                <div class="action-buttons">
                    <button class="edit-row-btn icon-btn" data-id="${resource.id}" data-type="internal-resource" title="Edit Row" onclick="editWholeRow(this)"
                            style="background-color: #17a2b8; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    ${createDeleteButtonFixed(resource.id, 'internalResources')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Internal Resources table rendered with original styling and row editing');
}

// SOLUTION 2: Enhanced Vendor Costs with original styling and row editing
function renderVendorCostsTableFixed() {
    const tbody = document.getElementById('vendorCostsTable');
    if (!tbody) {
        console.error('Vendor costs table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    if (!projectData.vendorCosts || projectData.vendorCosts.length === 0) {
        const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : { count: 16 };
        const colspan = 3 + monthInfo.count + 2;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state" style="padding: 2rem; text-align: center; color: #6b7280;">No vendor costs added yet</td></tr>`;
        return;
    }
    
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        count: 16
    };
    
    console.log('Rendering Vendor Costs with original styling and row editing');
    
    projectData.vendorCosts.forEach(vendor => {
        let monthCells = '';
        let totalCost = 0;
        
        // Create cells with original light styling
        for (let i = 1; i <= monthInfo.count; i++) {
            const fieldName = `month${i}Cost`;
            let cost = vendor[fieldName];
            if (cost === undefined) {
                const quarterIndex = Math.ceil(i / 3);
                cost = vendor[`q${quarterIndex}Cost`] || 0;
            } else {
                cost = cost || 0;
            }
            
            totalCost += cost;
            
            // Original alternating colors
            const bgColor = i % 2 === 0 ? '#f8fafc' : '#f1f5f9';
            monthCells += `<td class="month-cell" 
                              data-field="${fieldName}" 
                              style="text-align: center; padding: 8px 4px; background-color: ${bgColor}; border-right: 1px solid #e2e8f0; min-width: 60px;">$${cost.toLocaleString()}</td>`;
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', vendor.id);
        row.setAttribute('data-type', 'vendor-cost');
        row.style.borderBottom = '1px solid #f3f4f6';
        
        row.innerHTML = `
            <td style="padding: 12px; background-color: white;">${vendor.vendor || 'Unknown Vendor'}</td>
            <td style="padding: 12px; background-color: #f8fafc;"><span class="category-badge" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; background-color: #dbeafe; color: #1e40af;">${vendor.category || 'Other'}</span></td>
            <td style="padding: 12px; background-color: white;">${vendor.description || 'No description'}</td>
            ${monthCells}
            <td class="cost-total" style="background-color: #f0fdf4; font-weight: 700; color: #166534; text-align: right; padding: 12px; border-left: 3px solid #16a34a;"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell" style="background-color: white; text-align: center; padding: 8px;">
                <div class="action-buttons">
                    <button class="edit-row-btn icon-btn" data-id="${vendor.id}" data-type="vendor-cost" title="Edit Row" onclick="editWholeRow(this)"
                            style="background-color: #17a2b8; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    ${createDeleteButtonFixed(vendor.id, 'vendorCosts')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Vendor Costs table rendered with original styling and row editing');
}

// SOLUTION 3: Whole row editing functionality
function editWholeRow(button) {
    const row = button.closest('tr');
    const itemId = button.getAttribute('data-id');
    const itemType = button.getAttribute('data-type');
    
    // Prevent multiple edits on same row
    if (row.classList.contains('editing-row')) {
        return;
    }
    
    console.log(`Starting whole row edit for ${itemType} ${itemId}`);
    
    // Mark row as being edited
    row.classList.add('editing-row');
    
    // Store original row data
    const originalData = {};
    const monthCells = row.querySelectorAll('.month-cell');
    
    monthCells.forEach(cell => {
        const fieldName = cell.getAttribute('data-field');
        originalData[fieldName] = cell.textContent.replace(/[$,]/g, '');
    });
    
    // Convert all month cells to inputs
    monthCells.forEach((cell, index) => {
        const fieldName = cell.getAttribute('data-field');
        const currentValue = cell.textContent.replace(/[$,]/g, '');
        
        const input = document.createElement('input');
        input.type = 'number';
        input.value = currentValue;
        input.step = itemType === 'internal-resource' ? '0.5' : '0.01';
        input.min = '0';
        input.className = 'row-edit-input';
        input.setAttribute('data-field', fieldName);
        
        // Enhanced input styling
        input.style.cssText = `
            width: 100% !important;
            padding: 6px !important;
            border: 1px solid #007bff !important;
            border-radius: 3px !important;
            text-align: center !important;
            font-size: 13px !important;
            background: white !important;
            min-width: 50px !important;
            box-sizing: border-box !important;
        `;
        
        // Highlight editing state
        cell.style.backgroundColor = '#fff3cd';
        cell.style.border = '1px solid #ffc107';
        
        cell.innerHTML = '';
        cell.appendChild(input);
    });
    
    // Replace action buttons with save/cancel
    const actionCell = row.querySelector('.action-cell');
    actionCell.innerHTML = `
        <div class="row-edit-actions" style="display: flex; gap: 4px; justify-content: center;">
            <button class="save-row-btn" onclick="saveWholeRow(this, '${itemId}', '${itemType}')" title="Save Row Changes"
                    style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;">
                ✓
            </button>
            <button class="cancel-row-btn" onclick="cancelWholeRow(this, '${itemId}', '${itemType}')" title="Cancel Row Changes"
                    style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;">
                ✗
            </button>
        </div>
    `;
    
    // Store original data for potential cancellation
    row.setAttribute('data-original', JSON.stringify(originalData));
    
    // Focus first input
    const firstInput = row.querySelector('.row-edit-input');
    if (firstInput) {
        firstInput.focus();
        firstInput.select();
    }
}

// SOLUTION 4: Save whole row functionality with resource plan update
function saveWholeRow(button, itemId, itemType) {
    const row = button.closest('tr');
    console.log(`Saving whole row for ${itemType} ${itemId}`);
    
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
        
        // Update all month fields
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
        
        // Save data if changes were made
        if (hasChanges) {
            if (window.DataManager && window.DataManager.saveToLocalStorage) {
                window.DataManager.saveToLocalStorage();
            } else if (typeof(Storage) !== "undefined") {
                localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            }
        }
        
        // Re-render the specific table to show updated values
        if (itemType === 'internal-resource') {
            renderInternalResourcesTableFixed();
        } else if (itemType === 'vendor-cost') {
            renderVendorCostsTableFixed();
        }
        
        // Update resource plan tab (NEW REQUIREMENT)
        updateResourcePlanTab();
        
        // Update main summary
        if (window.updateSummary) {
            window.updateSummary();
        }
        
        console.log('Whole row saved successfully and resource plan updated');
        
    } catch (error) {
        console.error('Error saving whole row:', error);
        alert('Error saving changes: ' + error.message);
        cancelWholeRow(button, itemId, itemType);
    }
}

// SOLUTION 5: Cancel whole row functionality
function cancelWholeRow(button, itemId, itemType) {
    const row = button.closest('tr');
    console.log(`Cancelling whole row edit for ${itemType} ${itemId}`);
    
    // Re-render the specific table to restore original values
    if (itemType === 'internal-resource') {
        renderInternalResourcesTableFixed();
    } else if (itemType === 'vendor-cost') {
        renderVendorCostsTableFixed();
    }
}

// SOLUTION 6: Update resource plan tab functionality
function updateResourcePlanTab() {
    console.log('Updating resource plan tab...');
    
    try {
        // Re-render forecast table if it exists
        if (window.tableRenderer && window.tableRenderer.renderForecastTable) {
            window.tableRenderer.renderForecastTable();
        }
        
        // Update cost summary cards
        const internalTotal = calculateInternalResourcesTotalFixed();
        const vendorTotal = calculateVendorCostsTotalFixed();
        const toolTotal = calculateToolCostsTotalFixed();
        const miscTotal = calculateMiscCostsTotalFixed();
        
        const totalProject = internalTotal + vendorTotal + toolTotal + miscTotal;
        const totalExternal = vendorTotal + toolTotal + miscTotal;
        
        // Update resource plan cards
        const totalProjectCostEl = document.getElementById('totalProjectCost');
        const totalInternalCostEl = document.getElementById('totalInternalCost');
        const totalExternalCostEl = document.getElementById('totalExternalCost');
        
        if (totalProjectCostEl) totalProjectCostEl.textContent = `$${totalProject.toLocaleString()}`;
        if (totalInternalCostEl) totalInternalCostEl.textContent = `$${internalTotal.toLocaleString()}`;
        if (totalExternalCostEl) totalExternalCostEl.textContent = `$${totalExternal.toLocaleString()}`;
        
        console.log('Resource plan tab updated successfully');
        
    } catch (error) {
        console.error('Error updating resource plan tab:', error);
    }
}

// SOLUTION 7: Enhanced calculation functions
function calculateInternalResourcesTotalFixed() {
    const projectData = window.projectData || {};
    return (projectData.internalResources || []).reduce((total, resource) => {
        let totalDays = 0;
        
        // Sum all month days
        for (let i = 1; i <= 24; i++) {
            const monthField = `month${i}Days`;
            if (resource[monthField] !== undefined) {
                totalDays += resource[monthField] || 0;
            }
        }
        
        // Fallback to quarterly data if no monthly data
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
        
        // Sum all month costs
        for (let i = 1; i <= 24; i++) {
            const monthField = `month${i}Cost`;
            if (vendor[monthField] !== undefined) {
                totalCost += vendor[monthField] || 0;
            }
        }
        
        // Fallback to quarterly data
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

// SOLUTION 8: Enhanced delete button (unchanged)
function createDeleteButtonFixed(itemId, arrayName) {
    return `<button class="delete-btn icon-btn" onclick="deleteItem('${arrayName}', ${typeof itemId === 'string' ? `'${itemId}'` : itemId})" title="Delete"
                style="background-color: #dc3545; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
        </svg>
    </button>`;
}

// SOLUTION 9: Apply enhanced fixes
function applyEnhancedRowEditingFixes() {
    console.log('Applying enhanced row editing fixes with original styling...');
    
    if (window.tableRenderer) {
        window.tableRenderer._originalRenderInternalResourcesTable = window.tableRenderer.renderInternalResourcesTable;
        window.tableRenderer._originalRenderVendorCostsTable = window.tableRenderer.renderVendorCostsTable;
        
        window.tableRenderer.renderInternalResourcesTable = renderInternalResourcesTableFixed;
        window.tableRenderer.renderVendorCostsTable = renderVendorCostsTableFixed;
        
        console.log('Enhanced table methods applied');
        
        try {
            window.tableRenderer.renderInternalResourcesTable();
            window.tableRenderer.renderVendorCostsTable();
            console.log('Enhanced row editing tables rendered successfully');
        } catch (error) {
            console.error('Error rendering enhanced tables:', error);
        }
    } else {
        console.error('Table renderer not found');
    }
}

// SOLUTION 10: Make all functions globally available
window.editWholeRow = editWholeRow;
window.saveWholeRow = saveWholeRow;
window.cancelWholeRow = cancelWholeRow;
window.updateResourcePlanTab = updateResourcePlanTab;
window.applyEnhancedRowEditingFixes = applyEnhancedRowEditingFixes;

// Auto-apply enhanced fixes
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Auto-applying enhanced row editing fixes...');
        applyEnhancedRowEditingFixes();
    }, 1500);
});

console.log('ENHANCED ROW EDITING fixes loaded with original styling and resource plan updates');

