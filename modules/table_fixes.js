/**
 * CORRECTED TARGETED FIX for your existing table_renderer.js
 * 
 * This version fixes the method conflicts and integrates properly with your existing code
 */

// SOLUTION 1: Create the missing button creation methods
function createEditButtonFixed(itemId, itemType) {
    if (window.editManager && window.editManager.createEditButton) {
        return window.editManager.createEditButton(itemId, itemType);
    }
    
    // Fallback edit button that works with your existing system
    return `<button class="edit-btn icon-btn" data-id="${itemId}" data-type="${itemType}" title="Edit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
    </button>`;
}

function createDeleteButtonFixed(itemId, arrayName) {
    return `<button class="delete-btn icon-btn" onclick="deleteItem('${arrayName}', ${typeof itemId === 'string' ? `'${itemId}'` : itemId})" title="Delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
        </svg>
    </button>`;
}

// SOLUTION 2: Fixed Internal Resources Table Rendering
function renderInternalResourcesTableFixed() {
    const tbody = document.getElementById('internalResourcesTable');
    if (!tbody) {
        console.warn('Internal resources table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    if (!projectData.internalResources || projectData.internalResources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="20" class="empty-state">No internal resources added yet</td></tr>';
        return;
    }
    
    // Use the same month calculation as your existing table renderer
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan'],
        count: 4
    };
    
    console.log('Rendering Internal Resources with', monthInfo.count, 'months:', monthInfo.months);
    
    projectData.internalResources.forEach(resource => {
        let monthCells = '';
        let totalDays = 0;
        
        // Create cells for ALL calculated months (not just first 4)
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
            
            // Make cell editable with proper data attributes
            monthCells += `<td class="month-cell editable-cell" 
                              data-field="${fieldName}" 
                              data-item-id="${resource.id}" 
                              data-item-type="internal-resource"
                              onclick="makeEditable(this)">${days}</td>`;
        }
        
        const totalCost = totalDays * (resource.dailyRate || 0);
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', resource.id);
        row.setAttribute('data-type', 'internal-resource');
        
        // FIXED: Ensure total goes to separate Total Cost column, not month column
        row.innerHTML = `
            <td>${resource.role || 'Unknown Role'}</td>
            <td><span class="category-badge category-${(resource.rateCard || 'internal').toLowerCase()}">${resource.rateCard || 'Internal'}</span></td>
            <td>${(resource.dailyRate || 0).toLocaleString()}</td>
            ${monthCells}
            <td class="cost-total"><strong>${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell">
                <div class="action-buttons">
                    ${createEditButtonFixed(resource.id, 'internal-resource')}
                    ${createDeleteButtonFixed(resource.id, 'internalResources')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Internal Resources table rendered with', monthInfo.count, 'editable month columns');
}

// SOLUTION 3: Fixed Vendor Costs Table Rendering
function renderVendorCostsTableFixed() {
    const tbody = document.getElementById('vendorCostsTable');
    if (!tbody) {
        console.warn('Vendor costs table body not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    if (!projectData.vendorCosts || projectData.vendorCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="20" class="empty-state">No vendor costs added yet</td></tr>';
        return;
    }
    
    // Use the same month calculation as your existing table renderer
    const monthInfo = window.tableRenderer ? window.tableRenderer.calculateProjectMonths() : {
        months: ['Oct', 'Nov', 'Dec', 'Jan'],
        count: 4
    };
    
    console.log('Rendering Vendor Costs with', monthInfo.count, 'months:', monthInfo.months);
    
    projectData.vendorCosts.forEach(vendor => {
        let monthCells = '';
        let totalCost = 0;
        
        // Create cells for ALL calculated months (not just first 4)
        for (let i = 1; i <= monthInfo.count; i++) {
            const fieldName = `month${i}Cost`;
            // Get value with proper fallback to old format
            let cost = vendor[fieldName];
            if (cost === undefined) {
                // Fallback to old quarterly format
                const quarterIndex = Math.ceil(i / 3);
                cost = vendor[`q${quarterIndex}Cost`] || 0;
            } else {
                cost = cost || 0;
            }
            
            totalCost += cost;
            
            // Make cell editable with proper data attributes
            monthCells += `<td class="month-cell editable-cell" 
                              data-field="${fieldName}" 
                              data-item-id="${vendor.id}" 
                              data-item-type="vendor-cost"
                              onclick="makeEditable(this)">${cost.toLocaleString()}</td>`;
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', vendor.id);
        row.setAttribute('data-type', 'vendor-cost');
        
        // FIXED: Ensure total goes to separate Total Cost column, not month column
        row.innerHTML = `
            <td>${vendor.vendor || 'Unknown Vendor'}</td>
            <td><span class="category-badge">${vendor.category || 'Other'}</span></td>
            <td>${vendor.description || 'No description'}</td>
            ${monthCells}
            <td class="cost-total"><strong>${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell">
                <div class="action-buttons">
                    ${createEditButtonFixed(vendor.id, 'vendor-cost')}
                    ${createDeleteButtonFixed(vendor.id, 'vendorCosts')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Vendor Costs table rendered with', monthInfo.count, 'editable month columns');
}

// SOLUTION 4: Enhanced cell editing functionality
function makeEditable(cell) {
    if (cell.classList.contains('editing')) return; // Already editing
    
    const currentValue = cell.textContent.replace(/[$,]/g, ''); // Remove currency formatting
    const fieldName = cell.getAttribute('data-field');
    const itemId = cell.getAttribute('data-item-id');
    const itemType = cell.getAttribute('data-item-type');
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.step = itemType === 'internal-resource' ? '0.5' : '0.01';
    input.min = '0';
    input.className = 'cell-editor';
    input.style.width = '100%';
    input.style.padding = '4px';
    input.style.border = '2px solid #007bff';
    input.style.borderRadius = '4px';
    input.style.textAlign = 'center';
    input.style.fontSize = '12px';
    
    // Store original value
    const originalValue = currentValue;
    
    // Create save/cancel buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'edit-buttons';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '2px';
    buttonsDiv.style.marginTop = '2px';
    
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '✓';
    saveBtn.className = 'btn-save';
    saveBtn.style.cssText = 'background: #28a745; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '✗';
    cancelBtn.className = 'btn-cancel';
    cancelBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;';
    
    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);
    
    // Replace cell content
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.appendChild(buttonsDiv);
    cell.classList.add('editing');
    
    // Focus and select input
    input.focus();
    input.select();
    
    // Save function
    function saveValue() {
        const newValue = parseFloat(input.value) || 0;
        updateCellValue(itemId, fieldName, newValue, itemType);
        
        // Update display
        const displayValue = itemType === 'vendor-cost' ? `${newValue.toLocaleString()}` : newValue.toString();
        cell.innerHTML = displayValue;
        cell.classList.remove('editing');
        
        // Recalculate totals for the row
        recalculateRowTotal(cell.closest('tr'), itemType);
    }
    
    // Cancel function
    function cancelEdit() {
        const displayValue = itemType === 'vendor-cost' ? `${parseFloat(originalValue).toLocaleString()}` : originalValue;
        cell.innerHTML = displayValue;
        cell.classList.remove('editing');
    }
    
    // Event listeners
    saveBtn.addEventListener('click', saveValue);
    cancelBtn.addEventListener('click', cancelEdit);
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveValue();
        if (e.key === 'Escape') cancelEdit();
    });
    
    input.addEventListener('blur', (e) => {
        // Only save if not clicking on buttons
        if (!e.relatedTarget || (!e.relatedTarget.classList.contains('btn-save') && !e.relatedTarget.classList.contains('btn-cancel'))) {
            setTimeout(saveValue, 100);
        }
    });
}

// SOLUTION 5: Update cell value in data and recalculate
function updateCellValue(itemId, fieldName, newValue, itemType) {
    const projectData = window.projectData || {};
    
    let item = null;
    if (itemType === 'internal-resource') {
        item = projectData.internalResources?.find(r => r.id == itemId);
    } else if (itemType === 'vendor-cost') {
        item = projectData.vendorCosts?.find(v => v.id == itemId);
    }
    
    if (item) {
        item[fieldName] = newValue;
        
        // Save to localStorage using your existing data manager
        if (window.DataManager && window.DataManager.saveToLocalStorage) {
            window.DataManager.saveToLocalStorage();
        } else if (typeof(Storage) !== "undefined") {
            localStorage.setItem('ictProjectData', JSON.stringify(projectData));
        }
        
        console.log(`Updated ${fieldName} for ${itemType} ${itemId} to ${newValue}`);
    }
}

// SOLUTION 6: Recalculate row total after editing
function recalculateRowTotal(row, itemType) {
    const monthCells = row.querySelectorAll('.month-cell');
    const totalCell = row.querySelector('.cost-total');
    const dailyRateCell = row.querySelector('td:nth-child(3)'); // Daily rate column for internal resources
    
    let total = 0;
    
    if (itemType === 'internal-resource') {
        // For internal resources: sum (days * daily rate)
        const dailyRateText = dailyRateCell ? dailyRateCell.textContent.replace(/[$,]/g, '') : '0';
        const dailyRate = parseFloat(dailyRateText) || 0;
        
        monthCells.forEach(cell => {
            const days = parseFloat(cell.textContent.replace(/[$,]/g, '')) || 0;
            total += days * dailyRate;
        });
    } else {
        // For vendor costs: sum monthly costs
        monthCells.forEach(cell => {
            const cost = parseFloat(cell.textContent.replace(/[$,]/g, '')) || 0;
            total += cost;
        });
    }
    
    if (totalCell) {
        totalCell.innerHTML = `<strong>${total.toLocaleString()}</strong>`;
    }
    
    // Update overall summary
    if (window.updateSummary) {
        setTimeout(window.updateSummary, 100);
    }
}

// SOLUTION 7: Apply the fixes to your existing table renderer (CORRECTED VERSION)
function applyTableFixes() {
    console.log('Applying corrected table fixes...');
    
    // Replace the table renderer methods with our fixed versions
    if (window.tableRenderer) {
        // Store original methods
        window.tableRenderer._originalRenderInternalResourcesTable = window.tableRenderer.renderInternalResourcesTable;
        window.tableRenderer._originalRenderVendorCostsTable = window.tableRenderer.renderVendorCostsTable;
        
        // Replace with fixed versions
        window.tableRenderer.renderInternalResourcesTable = renderInternalResourcesTableFixed;
        window.tableRenderer.renderVendorCostsTable = renderVendorCostsTableFixed;
        
        console.log('Table methods replaced with fixed versions');
        
        // Re-render tables to apply fixes
        try {
            window.tableRenderer.renderInternalResourcesTable();
            window.tableRenderer.renderVendorCostsTable();
            console.log('Fixed tables rendered successfully');
        } catch (error) {
            console.error('Error rendering fixed tables:', error);
        }
    } else {
        console.warn('Table renderer not found, cannot apply fixes');
    }
}

// SOLUTION 8: Make functions globally available
window.makeEditable = makeEditable;
window.updateCellValue = updateCellValue;
window.recalculateRowTotal = recalculateRowTotal;
window.applyTableFixes = applyTableFixes;
window.renderInternalResourcesTableFixed = renderInternalResourcesTableFixed;
window.renderVendorCostsTableFixed = renderVendorCostsTableFixed;

// Auto-apply fixes when this script loads
document.addEventListener('DOMContentLoaded', () => {
    // Apply fixes after ensuring all other scripts have loaded
    setTimeout(() => {
        console.log('Auto-applying table fixes...');
        applyTableFixes();
    }, 1000); // Increased delay to ensure all modules are loaded
});

console.log('CORRECTED targeted table fixes loaded - Addresses method conflicts and integration issues');

/**
 * USAGE INSTRUCTIONS FOR CORRECTED VERSION:
 * 
 * 1. Add this script to your HTML in the modules folder as table_fixes.js
 * 
 * 2. Update your HTML to include it AFTER your existing scripts:
 *    <script src="modules/editManager.js"></script>
 *    <script src="modules/dynamic_form_helper.js"></script>
 *    <script src="script.js"></script>
 *    <script src="modules/table_fixes.js"></script>  <!-- ADD THIS -->
 * 
 * 3. The fixes will automatically apply when the page loads
 * 
 * WHAT THIS CORRECTED VERSION FIXES:
 * - Resolves the "this.createEditButton is not a function" error
 * - Makes ALL month columns editable (not just first 4)
 * - Ensures totals appear in dedicated "Total Cost" column
 * - Works with your existing table structure and data
 * - Maintains backward compatibility
 */
    const tbody = document.getElementById('internalResourcesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    if (!projectData.internalResources || projectData.internalResources.length === 0) {
        const monthInfo = this.calculateProjectMonths();
        const colspan = 3 + monthInfo.count + 2; // Fixed columns + ALL months + Total Cost + Actions
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">No internal resources added yet</td></tr>`;
        return;
    }
    
    const monthInfo = this.calculateProjectMonths();
    console.log('Rendering Internal Resources with', monthInfo.count, 'months:', monthInfo.months);
    
    projectData.internalResources.forEach(resource => {
        let monthCells = '';
        let totalDays = 0;
        
        // Create cells for ALL calculated months (not just first 4)
        for (let i = 1; i <= monthInfo.count; i++) {
            const fieldName = `month${i}Days`;
            // Get value with proper fallback
            let days = resource[fieldName];
            if (days === undefined) {
                // Fallback to old quarterly format
                const quarterIndex = Math.ceil(i / 3);
                days = resource[`q${quarterIndex}Days`] || 0;
            } else {
                days = days || 0;
            }
            
            totalDays += days;
            
            // Make cell editable with proper data attributes
            monthCells += `<td class="month-cell editable-cell" 
                              data-field="${fieldName}" 
                              data-item-id="${resource.id}" 
                              data-item-type="internal-resource"
                              onclick="makeEditable(this)">${days}</td>`;
        }
        
        const totalCost = totalDays * (resource.dailyRate || 0);
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', resource.id);
        row.setAttribute('data-type', 'internal-resource');
        
        // FIXED: Ensure total goes to separate Total Cost column, not month column
        row.innerHTML = `
            <td>${resource.role || 'Unknown Role'}</td>
            <td><span class="category-badge category-${(resource.rateCard || 'internal').toLowerCase()}">${resource.rateCard || 'Internal'}</span></td>
            <td>$${(resource.dailyRate || 0).toLocaleString()}</td>
            ${monthCells}
            <td class="cost-total"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell">
                <div class="action-buttons">
                    ${this.createEditButton(resource.id, 'internal-resource')}
                    ${this.createDeleteButton(resource.id, 'internalResources')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Internal Resources table rendered with', monthInfo.count, 'editable month columns');
};

// UPDATED: Vendor Costs Table Rendering - FIXED VERSION
TableRenderer.prototype.renderVendorCostsTableFixed = function() {
    const tbody = document.getElementById('vendorCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const projectData = window.projectData || {};
    if (!projectData.vendorCosts || projectData.vendorCosts.length === 0) {
        const monthInfo = this.calculateProjectMonths();
        const colspan = 3 + monthInfo.count + 2; // Fixed columns + ALL months + Total Cost + Actions
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">No vendor costs added yet</td></tr>`;
        return;
    }
    
    const monthInfo = this.calculateProjectMonths();
    console.log('Rendering Vendor Costs with', monthInfo.count, 'months:', monthInfo.months);
    
    projectData.vendorCosts.forEach(vendor => {
        let monthCells = '';
        let totalCost = 0;
        
        // Create cells for ALL calculated months (not just first 4)
        for (let i = 1; i <= monthInfo.count; i++) {
            const fieldName = `month${i}Cost`;
            // Get value with proper fallback
            let cost = vendor[fieldName];
            if (cost === undefined) {
                // Fallback to old quarterly format
                const quarterIndex = Math.ceil(i / 3);
                cost = vendor[`q${quarterIndex}Cost`] || 0;
            } else {
                cost = cost || 0;
            }
            
            totalCost += cost;
            
            // Make cell editable with proper data attributes
            monthCells += `<td class="month-cell editable-cell" 
                              data-field="${fieldName}" 
                              data-item-id="${vendor.id}" 
                              data-item-type="vendor-cost"
                              onclick="makeEditable(this)">$${cost.toLocaleString()}</td>`;
        }
        
        const row = document.createElement('tr');
        row.setAttribute('data-id', vendor.id);
        row.setAttribute('data-type', 'vendor-cost');
        
        // FIXED: Ensure total goes to separate Total Cost column, not month column
        row.innerHTML = `
            <td>${vendor.vendor || 'Unknown Vendor'}</td>
            <td><span class="category-badge">${vendor.category || 'Other'}</span></td>
            <td>${vendor.description || 'No description'}</td>
            ${monthCells}
            <td class="cost-total"><strong>$${totalCost.toLocaleString()}</strong></td>
            <td class="action-cell">
                <div class="action-buttons">
                    ${this.createEditButton(vendor.id, 'vendor-cost')}
                    ${this.createDeleteButton(vendor.id, 'vendorCosts')}
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Vendor Costs table rendered with', monthInfo.count, 'editable month columns');
};

// SOLUTION 2: Enhanced cell editing functionality
function makeEditable(cell) {
    if (cell.classList.contains('editing')) return; // Already editing
    
    const currentValue = cell.textContent.replace(/[$,]/g, ''); // Remove currency formatting
    const fieldName = cell.getAttribute('data-field');
    const itemId = cell.getAttribute('data-item-id');
    const itemType = cell.getAttribute('data-item-type');
    
    // Create input element
    const input = document.createElement('input');
    input.type = 'number';
    input.value = currentValue;
    input.step = itemType === 'internal-resource' ? '0.5' : '0.01';
    input.min = '0';
    input.className = 'cell-editor';
    input.style.width = '100%';
    input.style.padding = '4px';
    input.style.border = '2px solid #007bff';
    input.style.borderRadius = '4px';
    input.style.textAlign = 'center';
    
    // Store original value
    const originalValue = currentValue;
    
    // Create save/cancel buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'edit-buttons';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.gap = '2px';
    buttonsDiv.style.marginTop = '2px';
    
    const saveBtn = document.createElement('button');
    saveBtn.innerHTML = '✓';
    saveBtn.className = 'btn-save';
    saveBtn.style.cssText = 'background: #28a745; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '✗';
    cancelBtn.className = 'btn-cancel';
    cancelBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;';
    
    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);
    
    // Replace cell content
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.appendChild(buttonsDiv);
    cell.classList.add('editing');
    
    // Focus and select input
    input.focus();
    input.select();
    
    // Save function
    function saveValue() {
        const newValue = parseFloat(input.value) || 0;
        updateCellValue(itemId, fieldName, newValue, itemType);
        
        // Update display
        const displayValue = itemType === 'vendor-cost' ? `$${newValue.toLocaleString()}` : newValue.toString();
        cell.innerHTML = displayValue;
        cell.classList.remove('editing');
        
        // Recalculate totals for the row
        recalculateRowTotal(cell.closest('tr'), itemType);
    }
    
    // Cancel function
    function cancelEdit() {
        const displayValue = itemType === 'vendor-cost' ? `$${originalValue}` : originalValue;
        cell.innerHTML = displayValue;
        cell.classList.remove('editing');
    }
    
    // Event listeners
    saveBtn.addEventListener('click', saveValue);
    cancelBtn.addEventListener('click', cancelEdit);
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveValue();
        if (e.key === 'Escape') cancelEdit();
    });
    
    input.addEventListener('blur', (e) => {
        // Only save if not clicking on buttons
        if (!e.relatedTarget || (!e.relatedTarget.classList.contains('btn-save') && !e.relatedTarget.classList.contains('btn-cancel'))) {
            setTimeout(saveValue, 100);
        }
    });
}

// SOLUTION 3: Update cell value in data and recalculate
function updateCellValue(itemId, fieldName, newValue, itemType) {
    const projectData = window.projectData || {};
    
    let item = null;
    if (itemType === 'internal-resource') {
        item = projectData.internalResources?.find(r => r.id == itemId);
    } else if (itemType === 'vendor-cost') {
        item = projectData.vendorCosts?.find(v => v.id == itemId);
    }
    
    if (item) {
        item[fieldName] = newValue;
        
        // Save to localStorage
        if (window.DataManager && window.DataManager.saveToLocalStorage) {
            window.DataManager.saveToLocalStorage();
        } else if (typeof(Storage) !== "undefined") {
            localStorage.setItem('ictProjectData', JSON.stringify(projectData));
        }
        
        console.log(`Updated ${fieldName} for ${itemType} ${itemId} to ${newValue}`);
    }
}

// SOLUTION 4: Recalculate row total after editing
function recalculateRowTotal(row, itemType) {
    const monthCells = row.querySelectorAll('.month-cell');
    const totalCell = row.querySelector('.cost-total');
    const dailyRateCell = row.querySelector('td:nth-child(3)'); // Daily rate column for internal resources
    
    let total = 0;
    
    if (itemType === 'internal-resource') {
        // For internal resources: sum (days * daily rate)
        const dailyRateText = dailyRateCell ? dailyRateCell.textContent.replace(/[$,]/g, '') : '0';
        const dailyRate = parseFloat(dailyRateText) || 0;
        
        monthCells.forEach(cell => {
            const days = parseFloat(cell.textContent.replace(/[$,]/g, '')) || 0;
            total += days * dailyRate;
        });
    } else {
        // For vendor costs: sum monthly costs
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
        setTimeout(window.updateSummary, 100);
    }
}

// SOLUTION 5: Apply the fixes to your existing table renderer
function applyTableFixes() {
    if (window.tableRenderer || window.TableRenderer) {
        const renderer = window.tableRenderer || window.TableRenderer;
        
        // Replace the existing render functions with fixed versions
        renderer.renderInternalResourcesTable = renderer.renderInternalResourcesTableFixed || renderer.renderInternalResourcesTable;
        renderer.renderVendorCostsTable = renderer.renderVendorCostsTableFixed || renderer.renderVendorCostsTable;
        
        console.log('Table fixes applied - All months are now editable and totals appear in correct column');
        
        // Re-render tables to apply fixes
        renderer.renderAllTables();
    }
}

// SOLUTION 6: Make functions globally available
window.makeEditable = makeEditable;
window.updateCellValue = updateCellValue;
window.recalculateRowTotal = recalculateRowTotal;
window.applyTableFixes = applyTableFixes;

// Auto-apply fixes when this script loads
document.addEventListener('DOMContentLoaded', () => {
    // Apply fixes after a short delay to ensure other scripts have loaded
    setTimeout(applyTableFixes, 500);
});

console.log('Targeted table fixes loaded - Addresses limited editable months and incorrect total positioning');

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Add this script to your HTML after your existing table_renderer.js:
 *    <script src="js/table_renderer.js"></script>
 *    <script src="js/table_fixes.js"></script>
 * 
 * 2. Or paste these functions into your existing table_renderer.js file
 * 
 * 3. The fixes will automatically apply when the page loads
 * 
 * WHAT THIS FIXES:
 * - Makes ALL month columns editable (not just first 4)
 * - Ensures totals appear in dedicated "Total Cost" column
 * - Maintains backward compatibility with existing data
 * - Preserves your styling and edit functionality
 */
