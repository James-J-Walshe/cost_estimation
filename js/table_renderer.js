// Table Renderer Module
// Handles all table rendering functionality with edit capabilities

class TableRenderer {
    constructor() {
        console.log('Table Renderer initialized');
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

    // Render all tables
    renderAllTables() {
        try {
            this.renderInternalResourcesTable();
            this.renderVendorCostsTable();
            this.renderToolCostsTable();
            this.renderMiscCostsTable();
            this.renderRisksTable();
            this.renderInternalRatesTable();
            this.renderExternalRatesTable();
            this.renderUnifiedRateCardsTable();
            this.renderForecastTable();
            console.log('All tables rendered successfully');
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

    // Internal resources table
    renderInternalResourcesTable() {
        const tbody = document.getElementById('internalResourcesTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.internalResources || projectData.internalResources.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No internal resources added yet</td></tr>';
            return;
        }
        
        projectData.internalResources.forEach(resource => {
            // Handle both old format (q1Days) and new format (month1Days)
            const month1Days = resource.month1Days || resource.q1Days || 0;
            const month2Days = resource.month2Days || resource.q2Days || 0;
            const month3Days = resource.month3Days || resource.q3Days || 0;
            const month4Days = resource.month4Days || resource.q4Days || 0;
            
            const totalDays = month1Days + month2Days + month3Days + month4Days;
            const totalCost = totalDays * resource.dailyRate;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${resource.role}</td>
                <td>${resource.rateCard || 'Internal'}</td>
                <td>$${resource.dailyRate.toLocaleString()}</td>
                <td>${month1Days}</td>
                <td>${month2Days}</td>
                <td>${month3Days}</td>
                <td>${month4Days}</td>
                <td>$${totalCost.toLocaleString()}</td>
                <td>${this.createActionButtons(resource.id, 'internal-resource')}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Vendor costs table
    renderVendorCostsTable() {
        const tbody = document.getElementById('vendorCostsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const projectData = window.projectData || {};
        if (!projectData.vendorCosts || projectData.vendorCosts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No vendor costs added yet</td></tr>';
            return;
        }
        
        projectData.vendorCosts.forEach(vendor => {
            // Handle both old format (q1Cost) and new format (month1Cost)
            const month1Cost = vendor.month1Cost || vendor.q1Cost || 0;
            const month2Cost = vendor.month2Cost || vendor.q2Cost || 0;
            const month3Cost = vendor.month3Cost || vendor.q3Cost || 0;
            const month4Cost = vendor.month4Cost || vendor.q4Cost || 0;
            
            const totalCost = month1Cost + month2Cost + month3Cost + month4Cost;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vendor.vendor}</td>
                <td>${vendor.category}</td>
                <td>${vendor.description}</td>
                <td>$${month1Cost.toLocaleString()}</td>
                <td>$${month2Cost.toLocaleString()}</td>
                <td>$${month3Cost.toLocaleString()}</td>
                <td>$${month4Cost.toLocaleString()}</td>
                <td>$${totalCost.toLocaleString()}</td>
                <td>${this.createActionButtons(vendor.id, 'vendor-cost')}</td>
            `;
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

    // Forecast table
    renderForecastTable() {
        const tbody = document.getElementById('forecastTable');
        const projectData = window.projectData || {};
        if (!tbody || !projectData) return;
        
        tbody.innerHTML = '';
        
        // Internal Resources
        const internalMonthly = [0, 0, 0, 0, 0, 0];
        if (projectData.internalResources) {
            projectData.internalResources.forEach(resource => {
                internalMonthly[0] += (resource.month1Days || resource.q1Days || 0) * resource.dailyRate;
                internalMonthly[1] += (resource.month2Days || resource.q2Days || 0) * resource.dailyRate;
                internalMonthly[2] += (resource.month3Days || resource.q3Days || 0) * resource.dailyRate;
                internalMonthly[3] += (resource.month4Days || resource.q4Days || 0) * resource.dailyRate;
            });
        }
        
        // Vendor Costs
        const vendorMonthly = [0, 0, 0, 0, 0, 0];
        if (projectData.vendorCosts) {
            projectData.vendorCosts.forEach(vendor => {
                vendorMonthly[0] += vendor.month1Cost || vendor.q1Cost || 0;
                vendorMonthly[1] += vendor.month2Cost || vendor.q2Cost || 0;
                vendorMonthly[2] += vendor.month3Cost || vendor.q3Cost || 0;
                vendorMonthly[3] += vendor.month4Cost || vendor.q4Cost || 0;
            });
        }
        
        // Add rows
        const internalTotal = internalMonthly.reduce((sum, val) => sum + val, 0);
        const vendorTotal = vendorMonthly.reduce((sum, val) => sum + val, 0);
        
        tbody.innerHTML = `
            <tr>
                <td><strong>Internal Resources</strong></td>
                <td>$${internalMonthly[0].toLocaleString()}</td>
                <td>$${internalMonthly[1].toLocaleString()}</td>
                <td>$${internalMonthly[2].toLocaleString()}</td>
                <td>$${internalMonthly[3].toLocaleString()}</td>
                <td>$${internalMonthly[4].toLocaleString()}</td>
                <td>$${internalMonthly[5].toLocaleString()}</td>
                <td><strong>$${internalTotal.toLocaleString()}</strong></td>
            </tr>
            <tr>
                <td><strong>Vendor Costs</strong></td>
                <td>$${vendorMonthly[0].toLocaleString()}</td>
                <td>$${vendorMonthly[1].toLocaleString()}</td>
                <td>$${vendorMonthly[2].toLocaleString()}</td>
                <td>$${vendorMonthly[3].toLocaleString()}</td>
                <td>$${vendorMonthly[4].toLocaleString()}</td>
                <td>$${vendorMonthly[5].toLocaleString()}</td>
                <td><strong>$${vendorTotal.toLocaleString()}</strong></td>
            </tr>
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

// Export the update function for edit functionality
window.updateItemById = updateItemById;

console.log('Table Renderer module loaded with edit functionality');
