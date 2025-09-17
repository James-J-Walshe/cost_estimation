/**
 * TARGETED FIX for your existing table_renderer.js
 * 
 * Issue 1: Only first 4 months are editable
 * Issue 2: Total appears in 5th month column instead of Total Cost column
 * 
 * ADD these fixes to your existing table_renderer.js file
 */

// SOLUTION 1: Fix the month cell rendering to make ALL months editable
// Replace your existing createMonthCells-like functionality in renderInternalResourcesTable and renderVendorCostsTable

// UPDATED: Internal Resources Table Rendering - FIXED VERSION
TableRenderer.prototype.renderInternalResourcesTableFixed = function() {
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
