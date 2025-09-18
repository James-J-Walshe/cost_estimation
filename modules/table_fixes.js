/**
 * COMPREHENSIVE TABLE FIX - Addresses all identified issues
 * 
 * Issues Fixed:
 * 1. Table formatting problems
 * 2. Internal resources not rendering
 * 3. Save/discard buttons not working
 * 4. Edit mode cells too small and illegible
 */

// SOLUTION 1: Fixed Internal Resources Rendering (addresses issue #2)
function renderInternalResourcesTableFixed() {
    console.log('Starting renderInternalResourcesTableFixed...');
    
    const tbody = document.getElementById('internalResourcesTable');
    if (!tbody) {
        console.error('Internal resources table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    console.log('Project data for internal resources:', projectData);
    
    if (!projectData.internalResources || projectData.internalResources.length === 0) {
        const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : { count: 16 };
        const colspan = 3 + monthInfo.count + 2; // Fixed columns + months + Total Cost + Actions
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state" style="padding: 2rem; text-align: center; color: #6b7280;">No internal resources added yet</td></tr>`;
        console.log('No internal resources found, showing empty state');
        return;
    }
    
    // Use the same month calculation as your existing table renderer
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        count: 16
    };
    
    console.log('Rendering Internal Resources with', monthInfo.count, 'months for', projectData.internalResources.length, 'resources');
    
    projectData.internalResources.forEach((resource, index) => {
        console.log(`Rendering resource ${index}:`, resource);
        
        let monthCells = '';
        let totalDays = 0;
        
        // Create cells for ALL calculated months
        for (let i = 1; i <= monthInfo.count; i++) {
            const fieldName = `month${i}Days`;
            // Get value with proper fallback to old format
            let days = resource[fieldName];
            if (days === undefined) {
                // Fallback to old quarterly format
                const quarterIndex = Math.ceil(i / 3);
                days = resource[`q${quarterIndex}Days`] || 0;
            } else {
                days = days || 0;
            }
            
            totalDays += days;
            
            // Create properly styled and functional editable cells
            monthCells += `<td class="month-cell editable-cell" 
                              data-field="${fieldName}" 
                              data-item-id="${resource.id}" 
                              data-item-type="internal-resource"
                              style="text-align: center; padding: 8px 4px; cursor: pointer; background-color: #f8fafc; border-right: 1px solid #e2e8f0; min-width: 60px;"
                              onclick="makeEditableFixed(this)">${days}</td>`;
        }
        
        const totalCost = totalDays * (resource.dailyRate || 0);
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', resource.id);
        row.setAttribute('data-type', 'internal-resource');
        row.style.borderBottom = '1px solid #f3f4f6';
        
        // Proper table structure with correct styling
        row.innerHTML = `
            <td style="padding: 12px; white-space: nowrap;">${resource.role || 'Unknown Role'}</td>
            <td style="padding: 12px;"><span class="category-badge" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; background-color: #dcfce7; color: #166534;">${resource.rateCard || 'Internal'}</span></td>
            <td style="padding: 12px; text-align: right;">$${(resource.dailyRate || 0).toLocaleString()}</td>
            ${monthCells}
            <td class="cost-total" style="background-color: #f0fdf4; font-weight: 700; color: #166534; text-align: right; padding: 12px; border-left: 3px solid #16a34a;"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell" style="background-color: #fafafa; text-align: center; padding: 8px; white-space: nowrap;">
                <div class="action-buttons" style="display: flex; gap: 4px; align-items: center; justify-content: center;">
                    ${createEditButtonFixed(resource.id, 'internal-resource')}
                    ${createDeleteButtonFixed(resource.id, 'internalResources')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Internal Resources table rendered successfully with', monthInfo.count, 'editable month columns');
}

// SOLUTION 2: Fixed Vendor Costs Rendering with proper formatting (addresses issue #1)
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
    
    console.log('Rendering Vendor Costs with proper formatting');
    
    projectData.vendorCosts.forEach(vendor => {
        let monthCells = '';
        let totalCost = 0;
        
        // Create cells for ALL calculated months with proper formatting
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
            
            // Properly formatted and styled cells
            monthCells += `<td class="month-cell editable-cell" 
                              data-field="${fieldName}" 
                              data-item-id="${vendor.id}" 
                              data-item-type="vendor-cost"
                              style="text-align: center; padding: 8px 4px; cursor: pointer; background-color: #f8fafc; border-right: 1px solid #e2e8f0; min-width: 60px;"
                              onclick="makeEditableFixed(this)">$${cost.toLocaleString()}</td>`;
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', vendor.id);
        row.setAttribute('data-type', 'vendor-cost');
        row.style.borderBottom = '1px solid #f3f4f6';
        
        // Proper table structure with correct styling
        row.innerHTML = `
            <td style="padding: 12px; white-space: nowrap;">${vendor.vendor || 'Unknown Vendor'}</td>
            <td style="padding: 12px;"><span class="category-badge" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; background-color: #dbeafe; color: #1e40af;">${vendor.category || 'Other'}</span></td>
            <td style="padding: 12px;">${vendor.description || 'No description'}</td>
            ${monthCells}
            <td class="cost-total" style="background-color: #f0fdf4; font-weight: 700; color: #166534; text-align: right; padding: 12px; border-left: 3px solid #16a34a;"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell" style="background-color: #fafafa; text-align: center; padding: 8px; white-space: nowrap;">
                <div class="action-buttons" style="display: flex; gap: 4px; align-items: center; justify-content: center;">
                    ${createEditButtonFixed(vendor.id, 'vendor-cost')}
                    ${createDeleteButtonFixed(vendor.id, 'vendorCosts')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Vendor Costs table rendered with proper formatting');
}

// SOLUTION 3: Enhanced cell editing with proper sizing and functional buttons (addresses issues #3 and #4)
function makeEditableFixed(cell) {
    if (cell.classList.contains('editing')) return;
    
    const currentValue = cell.textContent.replace(/[$,]/g, '');
    const fieldName = cell.getAttribute('data-field');
    const itemId = cell.getAttribute('data-item-id');
    const itemType = cell.getAttribute('data-item-type');
    
    console.log(`Making cell editable: ${fieldName} for ${itemType} ${itemId}, current value: ${currentValue}`);
    
    // Create larger, properly styled input element (addresses issue #4)
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.step = itemType === 'internal-resource' ? '0.5' : '0.01';
    input.min = '0';
    input.className = 'cell-editor';
    
    // Enhanced styling for better visibility and usability
    input.style.cssText = `
        width: 100% !important;
        padding: 8px 6px !important;
        border: 2px solid #007bff !important;
        border-radius: 4px !important;
        text-align: center !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        background: white !important;
        color: #2d3748 !important;
        min-width: 60px !important;
        box-sizing: border-box !important;
    `;
    
    const originalValue = currentValue;
    
    // Create properly styled and functional save/cancel buttons (addresses issue #3)
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'edit-buttons';
    buttonsDiv.style.cssText = `
        display: flex !important;
        gap: 4px !important;
        margin-top: 4px !important;
        justify-content: center !important;
    `;
    
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '✓';
    saveBtn.className = 'btn-save';
    saveBtn.title = 'Save changes';
    saveBtn.style.cssText = `
        background: #28a745 !important;
        color: white !important;
        border: none !important;
        padding: 6px 10px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: bold !important;
        transition: background-color 0.2s ease !important;
        z-index: 1000 !important;
        position: relative !important;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '✗';
    cancelBtn.className = 'btn-cancel';
    cancelBtn.title = 'Cancel changes';
    cancelBtn.style.cssText = `
        background: #dc3545 !important;
        color: white !important;
        border: none !important;
        padding: 6px 10px !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        font-weight: bold !important;
        transition: background-color 0.2s ease !important;
        z-index: 1000 !important;
        position: relative !important;
    `;
    
    // Add hover effects
    saveBtn.addEventListener('mouseenter', () => {
        saveBtn.style.background = '#218838 !important';
    });
    saveBtn.addEventListener('mouseleave', () => {
        saveBtn.style.background = '#28a745 !important';
    });
    
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = '#c82333 !important';
    });
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = '#dc3545 !important';
    });
    
    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);
    
    // Enhanced cell styling during edit
    cell.style.cssText = `
        background-color: #fff3cd !important;
        border: 2px solid #ffc107 !important;
        padding: 6px !important;
        position: relative !important;
        min-width: 80px !important;
    `;
    
    // Replace cell content
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.appendChild(buttonsDiv);
    cell.classList.add('editing');
    
    // Focus and select input
    input.focus();
    input.select();
    
    // Enhanced save function with proper error handling
    function saveValue() {
        const newValue = parseFloat(input.value) || 0;
        console.log(`Saving value: ${newValue} for field: ${fieldName}`);
        
        try {
            updateCellValueFixed(itemId, fieldName, newValue, itemType);
            
            // Update display with proper formatting
            const displayValue = itemType === 'vendor-cost' ? `$${newValue.toLocaleString()}` : newValue.toString();
            
            // Restore original cell styling
            cell.style.cssText = `
                text-align: center;
                padding: 8px 4px;
                cursor: pointer;
                background-color: #f8fafc;
                border-right: 1px solid #e2e8f0;
                min-width: 60px;
            `;
            
            cell.innerHTML = displayValue;
            cell.classList.remove('editing');
            
            // Recalculate totals
            recalculateRowTotalFixed(cell.closest('tr'), itemType);
            
            console.log('Value saved successfully');
        } catch (error) {
            console.error('Error saving value:', error);
            alert('Error saving value: ' + error.message);
            cancelEdit();
        }
    }
    
    // Enhanced cancel function
    function cancelEdit() {
        console.log('Cancelling edit');
        
        const displayValue = itemType === 'vendor-cost' ? `$${parseFloat(originalValue).toLocaleString()}` : originalValue;
        
        // Restore original cell styling
        cell.style.cssText = `
            text-align: center;
            padding: 8px 4px;
            cursor: pointer;
            background-color: #f8fafc;
            border-right: 1px solid #e2e8f0;
            min-width: 60px;
        `;
        
        cell.innerHTML = displayValue;
        cell.classList.remove('editing');
    }
    
    // Enhanced event listeners with proper event handling
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        saveValue();
    });
    
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        cancelEdit();
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveValue();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    });
    
    // Enhanced blur handling
    input.addEventListener('blur', (e) => {
        // Only auto-save if not clicking on buttons
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || 
            (!relatedTarget.classList.contains('btn-save') && 
             !relatedTarget.classList.contains('btn-cancel'))) {
            setTimeout(() => {
                if (cell.classList.contains('editing')) {
                    saveValue();
                }
            }, 200);
        }
    });
}

// SOLUTION 4: Enhanced data update function with proper error handling
function updateCellValueFixed(itemId, fieldName, newValue, itemType) {
    const projectData = window.projectData || {};
    
    let item = null;
    if (itemType === 'internal-resource') {
        item = projectData.internalResources?.find(r => r.id == itemId);
    } else if (itemType === 'vendor-cost') {
        item = projectData.vendorCosts?.find(v => v.id == itemId);
    }
    
    if (item) {
        item[fieldName] = newValue;
        
        // Enhanced save with multiple fallbacks
        try {
            if (window.DataManager && window.DataManager.saveToLocalStorage) {
                window.DataManager.saveToLocalStorage();
            } else if (typeof(Storage) !== "undefined") {
                localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            }
            
            console.log(`Successfully updated ${fieldName} for ${itemType} ${itemId} to ${newValue}`);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw new Error('Failed to save changes');
        }
    } else {
        console.error(`Item not found: ${itemType} with id ${itemId}`);
        throw new Error('Item not found');
    }
}

// SOLUTION 5: Enhanced row total recalculation
function recalculateRowTotalFixed(row, itemType) {
    const monthCells = row.querySelectorAll('.month-cell');
    const totalCell = row.querySelector('.cost-total');
    
    let total = 0;
    
    if (itemType === 'internal-resource') {
        const dailyRateCell = row.querySelector('td:nth-child(3)');
        const dailyRateText = dailyRateCell ? dailyRateCell.textContent.replace(/[$,]/g, '') : '0';
        const dailyRate = parseFloat(dailyRateText) || 0;
        
        monthCells.forEach(cell => {
            const days = parseFloat(cell.textContent.replace(/[$,]/g, '')) || 0;
            total += days * dailyRate;
        });
    } else {
        monthCells.forEach(cell => {
            const cost = parseFloat(cell.textContent.replace(/[$,]/g, '')) || 0;
            total += cost;
        });
    }
    
    if (totalCell) {
        totalCell.innerHTML = `<strong>$${total.toLocaleString()}</strong>`;
    }
    
    // Update overall summary
    if (window.updateSummary) {
        setTimeout(window.updateSummary, 200);
    }
}

// SOLUTION 6: Enhanced button creation functions
function createEditButtonFixed(itemId, itemType) {
    return `<button class="edit-btn icon-btn" data-id="${itemId}" data-type="${itemType}" title="Edit" 
                style="background-color: #17a2b8; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer; margin-right: 4px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    </button>`;
}

function createDeleteButtonFixed(itemId, arrayName) {
    return `<button class="delete-btn icon-btn" onclick="deleteItem('${arrayName}', ${typeof itemId === 'string' ? `'${itemId}'` : itemId})" title="Delete"
                style="background-color: #dc3545; color: white; border: none; padding: 6px 8px; border-radius: 4px; cursor: pointer;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
        </svg>
    </button>`;
}

// SOLUTION 7: Comprehensive fix application
function applyComprehensiveFixes() {
    console.log('Applying comprehensive table fixes...');
    
    if (window.tableRenderer) {
        // Store original methods
        window.tableRenderer._originalRenderInternalResourcesTable = window.tableRenderer.renderInternalResourcesTable;
        window.tableRenderer._originalRenderVendorCostsTable = window.tableRenderer.renderVendorCostsTable;
        
        // Replace with comprehensive fixed versions
        window.tableRenderer.renderInternalResourcesTable = renderInternalResourcesTableFixed;
        window.tableRenderer.renderVendorCostsTable = renderVendorCostsTableFixed;
        
        console.log('Table methods replaced with comprehensive fixed versions');
        
        // Re-render tables
        try {
            console.log('Rendering internal resources...');
            window.tableRenderer.renderInternalResourcesTable();
            
            console.log('Rendering vendor costs...');
            window.tableRenderer.renderVendorCostsTable();
            
            console.log('Comprehensive table fixes applied successfully');
        } catch (error) {
            console.error('Error rendering comprehensive fixed tables:', error);
        }
    } else {
        console.error('Table renderer not found');
    }
}

// SOLUTION 8: Make all functions globally available
window.makeEditableFixed = makeEditableFixed;
window.updateCellValueFixed = updateCellValueFixed;
window.recalculateRowTotalFixed = recalculateRowTotalFixed;
window.applyComprehensiveFixes = applyComprehensiveFixes;
window.renderInternalResourcesTableFixed = renderInternalResourcesTableFixed;
window.renderVendorCostsTableFixed = renderVendorCostsTableFixed;

// Auto-apply comprehensive fixes
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('Auto-applying comprehensive table fixes...');
        applyComprehensiveFixes();
    }, 1500);
});

console.log('COMPREHENSIVE table fixes loaded - All issues addressed');

/**
 * SUMMARY OF FIXES:
 * 
 * ✅ Issue #1 (Table formatting) - Fixed with proper inline styling and structure
 * ✅ Issue #2 (Internal resources not rendering) - Enhanced rendering with better error handling  
 * ✅ Issue #3 (Save/discard buttons inactive) - Improved event handling and error checking
 * ✅ Issue #4 (Edit cells too small) - Larger inputs, better styling, improved visibility
 * 
 * FEATURES:
 * - All 16 month columns are editable
 * - Proper table formatting maintained
 * - Functional save/cancel buttons with visual feedback
 * - Enhanced error handling and logging
 * - Totals appear in correct "Total Cost" column
 * - Better responsive design for edit mode
 */
