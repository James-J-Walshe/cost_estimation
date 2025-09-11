// Table Renderer Module
// Handles all table rendering functionality with edit capabilities and dynamic month columns
// Compatible with existing dynamic_form_helper.js

class TableRenderer {
    constructor() {
        console.log('Table Renderer initialized');
    }

    // Calculate dynamic months based on project dates - IDENTICAL to dynamic_form_helper.js
    calculateProjectMonths() {
        const projectData = window.projectData || {};
        const projectInfo = projectData.projectInfo || {};
        
        if (!projectInfo.startDate || !projectInfo.endDate) {
            console.log('No project dates found, using default 4 months');
            return {
                months: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
                monthKeys: ['month1', 'month2', 'month3', 'month4'],
                count: 4
            };
        }

        const startDate = new Date(projectInfo.startDate);
        const endDate = new Date(projectInfo.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.log('Invalid project dates, using default 4 months');
            return {
                months: ['Month 1', 'Month 2', 'Month 3', 'Month 4'],
                monthKeys: ['month1', 'month2', 'month3', 'month4'],
                count: 4
            };
        }

        const months = [];
        const monthKeys = [];
        let currentDate = new Date(startDate);
        let monthIndex = 1;

        // Calculate months between start and end date
        while (currentDate <= endDate) {
            const monthName = currentDate.toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });
            months.push(monthName);
            monthKeys.push(`month${monthIndex}`);
            
            // Move to next month
            currentDate.setMonth(currentDate.getMonth() + 1);
            monthIndex++;
            
            // Safety check to prevent infinite loops
            if (monthIndex > 24) {
                console.warn('Project duration exceeds 24 months, limiting to 24 months');
                break;
            }
        }

        // Ensure at least 1 month
        if (months.length === 0) {
            months.push('Month 1');
            monthKeys.push('month1');
        }

        console.log(`Dynamic months calculated: ${months.length} months`, months);
        
        return {
            months: months,
            monthKeys: monthKeys,
            count: months.length
        };
    }

    // Helper function to create action buttons with edit functionality
    createActionButtons(itemId, itemType) {
        const editButton = window.editManager ? 
            window.editManager.createEditButton(itemId, itemType) : '';
        
        return `
            <div class="action-buttons">
                ${editButton}
                <button class="btn btn-danger btn-small delete-btn icon-btn" onclick="deleteItem('${this.getArrayName(itemType)}', ${typeof itemId === 'string' ? `'${itemId}'` : itemId})" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
                    </svg>
                </button>
            </div>
        `;
    }

    // Helper function to get array name from item type
    getArrayName(itemType) {
        const mapping = {
            'internal-resource': 'internalResources',
            'vendor-cost': 'vendorCosts',
            'tool-cost': 'toolCosts',
            'misc-cost': 'miscCosts',
            'risk': 'risks',
            'rate-card': 'rateCards'
        };
        return mapping[itemType] || itemType;
    }

    // Helper function to get month value with backward compatibility - IDENTICAL to dynamic_form_helper.js
    getMonthValue(item, monthKey, fallbackPrefix = 'q') {
        // Try new format first (month1Days, month1Cost, etc.)
        const newKey = monthKey + (item.hasOwnProperty(monthKey + 'Days') ? 'Days' : 'Cost');
        if (item.hasOwnProperty(newKey)) {
            return item[newKey] || 0;
        }
        
        // Fall back to old format (q1Days, q1Cost, etc.)
        const monthNumber = monthKey.replace('month', '');
        const oldKey = fallbackPrefix + monthNumber + (item.hasOwnProperty('q' + monthNumber + 'Days') ? 'Days' : 'Cost');
        return item[oldKey] || 0;
    }

    // Update table headers dynamically - FIXED to match your HTML IDs
    updateTableHeaders() {
        const monthInfo = this.calculateProjectMonths();
        
        // Update Internal Resources table header - matches your HTML exactly
        const internalHeader = document.getElementById('internalResourcesTableHeader');
        if (internalHeader) {
            let headerHTML = '<th>Role</th><th>Rate Card</th><th>Daily Rate</th>';
            headerHTML += monthInfo.months.map(month => `<th>${month}</th>`).join('');
            headerHTML += '<th>Total Cost</th><th>Actions</th>';
            internalHeader.innerHTML = headerHTML;
        }

        // Update Vendor Costs table header - matches your HTML exactly
        const vendorHeader = document.getElementById('vendorCostsTableHeader');
        if (vendorHeader) {
            let headerHTML = '<th>Vendor</th><th>Category</th><th>Description</th>';
            headerHTML += monthInfo.months.map(month => `<th>${month}</th>`).join('');
            headerHTML += '<th>Total Cost</th><th>Actions</th>';
            vendorHeader.innerHTML = headerHTML;
        }

        // Update Forecast table header - matches your HTML exactly
        const forecastHeader = document.getElementById('forecastTableHeader');
        if (forecastHeader) {
            let headerHTML = '<th>Category</th>';
            headerHTML += monthInfo.months.map(month => `<th>${month}</th>`).join('');
            headerHTML += '<th>Total</th>';
            forecastHeader.innerHTML = headerHTML;
        }

        console.log('Table headers updated with dynamic months:', monthInfo.months);
    }

    // Render all tables
    renderAllTables() {
        try {
            this.updateTableHeaders(); // Update headers first
            this.renderInternalResourcesTable();
            this.renderVendorCostsTable();
            this.renderToolCostsTable();
            this.renderMiscCostsTable();
            this.renderRisksTable();
            this.renderInternalRatesTable();
            this.renderExternalRatesTable();
            this.renderUnifiedRateCardsTable();
            this.renderForecastTable();
            console.log('All tables rendered successfully with dynamic months');
        } catch (error) {
            console.error('Error rendering tables:', error);
        }
    }

    // Unified rate cards table rendering
    renderUnifiedRateCardsTable() {
        const tbody = document.getElementById('rateCardsTable');
        console.log('renderUnifiedRateCardsTable - tbody element:', tbody);
        
        if (!tbody) {
            console.log('rateCardsTable not found');
            return;
        }
        
        tbody.innerHTML = '';
        
        // Access global projectData variable
        const projectData = window.projectData || {};
        if (!projectData.rateCards || projectData.rateCards.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No rate cards added yet</td></tr>';
            return;
        }
        
        // Sort by category then by role
        const sortedRates = [...projectData.rateCards].sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.role.localeCompare(b.role);
        });
        
        console.log('Rates to render:', sortedRates);
        
        sortedRates.forEach(rate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rate.role}</td>
                <td><span class="category-badge category-${rate.category.toLowerCase()}">${rate.category}</span></td>
                <td>$${rate.rate.toLocaleString()}</td>
                <td>${this.createActionButtons(rate.id || rate.role, 'rate-card')}</td>
            `;
            tbody.appendChild(row);
        });
        
        console.log('Unified rate cards table rendered successfully');
    }

    // Internal resources table with dynamic months
    renderInternalResourcesTable() {
        const tbody = document.getElementById('internalResourcesTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.internalResources || projectData.internalResources.length === 0) {
            const monthInfo = this.calculateProjectMonths();
            const colspan = 3 + monthInfo.count + 2; // Role, Rate Card, Daily Rate + months + Total Cost, Actions
            tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">No internal resources added yet</td></tr>`;
            return;
        }
        
        const monthInfo = this.calculateProjectMonths();
        
        projectData.internalResources.forEach(resource => {
            let monthlyDays = [];
            let totalDays = 0;
            
            // Get days for each month
            monthInfo.monthKeys.forEach(monthKey => {
                const days = this.getMonthValue(resource, monthKey, 'q');
                monthlyDays.push(days);
                totalDays += days;
            });
            
            const totalCost = totalDays * resource.dailyRate;
            
            const row = document.createElement('tr');
            let rowHTML = `
                <td>${resource.role}</td>
                <td>${resource.rateCard || 'Internal'}</td>
                <td>$${resource.dailyRate.toLocaleString()}</td>
            `;
            
            // Add month columns
            monthlyDays.forEach(days => {
                rowHTML += `<td>${days}</td>`;
            });
            
            rowHTML += `
                <td>$${totalCost.toLocaleString()}</td>
                <td>${this.createActionButtons(resource.id, 'internal-resource')}</td>
            `;
            
            row.innerHTML = rowHTML;
            tbody.appendChild(row);
        });
    }

    // Vendor costs table with dynamic months
    renderVendorCostsTable() {
        const tbody = document.getElementById('vendorCostsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.vendorCosts || projectData.vendorCosts.length === 0) {
            const monthInfo = this.calculateProjectMonths();
            const colspan = 3 + monthInfo.count + 2; // Vendor, Category, Description + months + Total Cost, Actions
            tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">No vendor costs added yet</td></tr>`;
            return;
        }
        
        const monthInfo = this.calculateProjectMonths();
        
        projectData.vendorCosts.forEach(vendor => {
            let monthlyCosts = [];
            let totalCost = 0;
            
            // Get costs for each month
            monthInfo.monthKeys.forEach(monthKey => {
                const cost = this.getMonthValue(vendor, monthKey, 'q');
                monthlyCosts.push(cost);
                totalCost += cost;
            });
            
            const row = document.createElement('tr');
            let rowHTML = `
                <td>${vendor.vendor}</td>
                <td>${vendor.category}</td>
                <td>${vendor.description}</td>
            `;
            
            // Add month columns
            monthlyCosts.forEach(cost => {
                rowHTML += `<td>$${cost.toLocaleString()}</td>`;
            });
            
            rowHTML += `
                <td>$${totalCost.toLocaleString()}</td>
                <td>${this.createActionButtons(vendor.id, 'vendor-cost')}</td>
            `;
            
            row.innerHTML = rowHTML;
            tbody.appendChild(row);
        });
    }

    // Tool costs table
    renderToolCostsTable() {
        const tbody = document.getElementById('toolCostsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.toolCosts || projectData.toolCosts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tool costs added yet</td></tr>';
            return;
        }
        
        projectData.toolCosts.forEach(tool => {
            const totalCost = tool.users * tool.monthlyCost * tool.duration;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tool.tool}</td>
                <td>${tool.licenseType}</td>
                <td>$${tool.monthlyCost.toLocaleString()}</td>
                <td>${tool.users}</td>
                <td>${tool.duration}</td>
                <td>$${totalCost.toLocaleString()}</td>
                <td>${this.createActionButtons(tool.id, 'tool-cost')}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Miscellaneous costs table
    renderMiscCostsTable() {
        const tbody = document.getElementById('miscCostsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.miscCosts || projectData.miscCosts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No miscellaneous costs added yet</td></tr>';
            return;
        }
        
        projectData.miscCosts.forEach(misc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${misc.category}</td>
                <td>${misc.item}</td>
                <td>${misc.description}</td>
                <td>$${misc.cost.toLocaleString()}</td>
                <td>${this.createActionButtons(misc.id, 'misc-cost')}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Risks table
    renderRisksTable() {
        const tbody = document.getElementById('risksTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.risks || projectData.risks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No risks added yet</td></tr>';
            return;
        }
        
        projectData.risks.forEach(risk => {
            const riskScore = risk.probability * risk.impact;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${risk.description}</td>
                <td>${risk.probability}</td>
                <td>${risk.impact}</td>
                <td>${riskScore}</td>
                <td>$${(risk.mitigationCost || 0).toLocaleString()}</td>
                <td>${this.createActionButtons(risk.id, 'risk')}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Internal rates table (backward compatibility)
    renderInternalRatesTable() {
        const tbody = document.getElementById('internalRatesTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.rateCards) return;
        
        // Show internal rates from unified rateCards
        const internalRates = projectData.rateCards.filter(rate => rate.category === 'Internal');
        
        if (internalRates.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No internal rates added yet</td></tr>';
            return;
        }
        
        internalRates.forEach(rate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rate.role}</td>
                <td>$${rate.rate.toLocaleString()}</td>
                <td>${this.createActionButtons(rate.id || rate.role, 'rate-card')}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // External rates table (backward compatibility)
    renderExternalRatesTable() {
        const tbody = document.getElementById('externalRatesTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.rateCards) return;
        
        // Show external rates from unified rateCards
        const externalRates = projectData.rateCards.filter(rate => rate.category === 'External');
        
        if (externalRates.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No external rates added yet</td></tr>';
            return;
        }
        
        externalRates.forEach(rate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rate.role}</td>
                <td>$${rate.rate.toLocaleString()}</td>
                <td>${this.createActionButtons(rate.id || rate.role, 'rate-card')}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Forecast table with dynamic months
    renderForecastTable() {
        const tbody = document.getElementById('forecastTable');
        const projectData = window.projectData || {};
        if (!tbody || !projectData) return;
        
        tbody.innerHTML = '';
        
        const monthInfo = this.calculateProjectMonths();
        
        // Initialize arrays for each month
        const internalMonthly = new Array(monthInfo.count).fill(0);
        const vendorMonthly = new Array(monthInfo.count).fill(0);
        
        // Calculate Internal Resources costs
        if (projectData.internalResources) {
            projectData.internalResources.forEach(resource => {
                monthInfo.monthKeys.forEach((monthKey, index) => {
                    const days = this.getMonthValue(resource, monthKey, 'q');
                    internalMonthly[index] += days * resource.dailyRate;
                });
            });
        }
        
        // Calculate Vendor Costs
        if (projectData.vendorCosts) {
            projectData.vendorCosts.forEach(vendor => {
                monthInfo.monthKeys.forEach((monthKey, index) => {
                    const cost = this.getMonthValue(vendor, monthKey, 'q');
                    vendorMonthly[index] += cost;
                });
            });
        }
        
        // Calculate totals
        const internalTotal = internalMonthly.reduce((sum, val) => sum + val, 0);
        const vendorTotal = vendorMonthly.reduce((sum, val) => sum + val, 0);
        
        // Create internal resources row
        let internalRowHTML = '<td><strong>Internal Resources</strong></td>';
        internalMonthly.forEach(cost => {
            internalRowHTML += `<td>$${cost.toLocaleString()}</td>`;
        });
        internalRowHTML += `<td><strong>$${internalTotal.toLocaleString()}</strong></td>`;
        
        // Create vendor costs row
        let vendorRowHTML = '<td><strong>Vendor Costs</strong></td>';
        vendorMonthly.forEach(cost => {
            vendorRowHTML += `<td>$${cost.toLocaleString()}</td>`;
        });
        vendorRowHTML += `<td><strong>$${vendorTotal.toLocaleString()}</strong></td>`;
        
        tbody.innerHTML = `
            <tr>${internalRowHTML}</tr>
            <tr>${vendorRowHTML}</tr>
        `;
    }
}

// Data update integration for edit functionality
function updateItemById(itemId, newData, itemType) {
    const projectData = window.projectData || {};
    
    switch (itemType) {
        case 'internal-resource':
            const resourceIndex = projectData.internalResources.findIndex(r => r.id === itemId);
            if (resourceIndex !== -1) {
                // Update the resource with new data
                Object.assign(projectData.internalResources[resourceIndex], newData);
                
                // Update rate if role changed
                const rate = projectData.rateCards.find(r => r.role === newData.role);
                if (rate) {
                    projectData.internalResources[resourceIndex].dailyRate = rate.rate;
                    projectData.internalResources[resourceIndex].rateCard = rate.category;
                }
            }
            break;
            
        case 'vendor-cost':
            const vendorIndex = projectData.vendorCosts.findIndex(v => v.id === itemId);
            if (vendorIndex !== -1) {
                Object.assign(projectData.vendorCosts[vendorIndex], newData);
            }
            break;
            
        case 'tool-cost':
            const toolIndex = projectData.toolCosts.findIndex(t => t.id === itemId);
            if (toolIndex !== -1) {
                Object.assign(projectData.toolCosts[toolIndex], newData);
            }
            break;
            
        case 'misc-cost':
            const miscIndex = projectData.miscCosts.findIndex(m => m.id === itemId);
            if (miscIndex !== -1) {
                Object.assign(projectData.miscCosts[miscIndex], newData);
            }
            break;
            
        case 'risk':
            const riskIndex = projectData.risks.findIndex(r => r.id === itemId);
            if (riskIndex !== -1) {
                Object.assign(projectData.risks[riskIndex], newData);
            }
            break;
            
        case 'rate-card':
            const rateIndex = projectData.rateCards.findIndex(r => 
                (r.id && r.id === itemId) || r.role === itemId
            );
            if (rateIndex !== -1) {
                Object.assign(projectData.rateCards[rateIndex], newData);
                
                // Also update old arrays for backward compatibility
                if (newData.category === 'Internal') {
                    const internalIndex = projectData.internalRates?.findIndex(r => 
                        (r.id && r.id === itemId) || r.role === itemId
                    );
                    if (internalIndex !== -1 && projectData.internalRates) {
                        Object.assign(projectData.internalRates[internalIndex], {
                            role: newData.role,
                            rate: newData.rate
                        });
                    }
                } else if (newData.category === 'External') {
                    const externalIndex = projectData.externalRates?.findIndex(r => 
                        (r.id && r.id === itemId) || r.role === itemId
                    );
                    if (externalIndex !== -1 && projectData.externalRates) {
                        Object.assign(projectData.externalRates[externalIndex], {
                            role: newData.role,
                            rate: newData.rate
                        });
                    }
                }
            }
            break;
    }
    
    // Save to localStorage if available
    if (window.DataManager && window.DataManager.saveToLocalStorage) {
        window.DataManager.saveToLocalStorage();
    }
}

// Create and export table renderer instance
const tableRenderer = new TableRenderer();

// Make it globally available
window.tableRenderer = tableRenderer;
window.TableRenderer = tableRenderer; // For backward compatibility with your existing code

// Export individual functions for backward compatibility
window.renderAllTables = () => tableRenderer.renderAllTables();
window.renderUnifiedRateCardsTable = () => tableRenderer.renderUnifiedRateCardsTable();
window.renderInternalResourcesTable = () => tableRenderer.renderInternalResourcesTable();
window.renderVendorCostsTable = () => tableRenderer.renderVendorCostsTable();
window.renderToolCostsTable = () => tableRenderer.renderToolCostsTable();
window.renderMiscCostsTable = () => tableRenderer.renderMiscCostsTable();
window.renderRisksTable = () => tableRenderer.renderRisksTable();
window.renderInternalRatesTable = () => tableRenderer.renderInternalRatesTable();
window.renderExternalRatesTable = () => tableRenderer.renderExternalRatesTable();
window.renderForecastTable = () => tableRenderer.renderForecastTable();
window.updateTableHeaders = () => tableRenderer.updateTableHeaders();

// Export the update function for edit functionality
window.updateItemById = updateItemById;

console.log('Enhanced Table Renderer module loaded with dynamic month support - Compatible with dynamic_form_helper.js');
