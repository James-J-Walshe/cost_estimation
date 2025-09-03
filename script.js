// script.js - Main application logic working with modular structure
// Clean version with no syntax errors
// ============================================================================

// ============================================================================
// MONTH CALCULATION AND HEADERS
// ============================================================================

function calculateProjectMonths() {
    const projectInfo = AppState.getProjectInfo();
    const startDate = projectInfo.startDate;
    
    if (!startDate) {
        return ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
    }
    
    const start = new Date(startDate);
    const months = [];
    const current = new Date(start);
    
    // Generate up to 12 months from start date
    for (let i = 0; i < 12; i++) {
        months.push(current.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        }));
        current.setMonth(current.getMonth() + 1);
    }
    
    return months;
}

function updateForecastTableHeaders() {
    const months = calculateProjectMonths();
    
    // Update the hardcoded headers in HTML to be dynamic
    const headers = document.querySelectorAll('#resource-plan table thead th');
    if (headers.length > 0) {
        // Skip first header (Category), then update the next 6 month headers
        for (let i = 1; i <= 6 && i < headers.length - 1; i++) {
            if (headers[i] && months[i-1]) {
                headers[i].textContent = months[i-1];
            }
        }
    }
}

function updateInternalResourcesHeaders() {
    const months = calculateProjectMonths();
    
    // Update the headers to show actual month names instead of hardcoded labels
    const headers = document.querySelectorAll('#internal-resources table thead th');
    if (headers.length >= 7) {
        // Headers 3, 4, 5, 6 are the month columns
        for (let i = 0; i < 4; i++) {
            const headerIndex = i + 3; // Start from 4th column (index 3)
            if (headers[headerIndex] && months[i]) {
                headers[headerIndex].textContent = months[i] + ' Days';
            }
        }
    }
}

function updateVendorCostsHeaders() {
    const months = calculateProjectMonths();
    
    // Update the headers to show actual month names instead of hardcoded labels
    const headers = document.querySelectorAll('#vendor-costs table thead th');
    if (headers.length >= 8) {
        // Headers 3, 4, 5, 6 are the month columns
        for (let i = 0; i < 4; i++) {
            const headerIndex = i + 3; // Start from 4th column (index 3)
            if (headers[headerIndex] && months[i]) {
                headers[headerIndex].textContent = months[i] + ' Cost';
            }
        }
    }
}

function updateMonthHeaders() {
    updateForecastTableHeaders();
    updateInternalResourcesHeaders();
    updateVendorCostsHeaders();
}

// ============================================================================
// MODAL MANAGEMENT
// ============================================================================

function openModal(title, type) {
    try {
        const modal = DOMManager.get('modal');
        const modalTitle = DOMManager.get('modalTitle');
        const modalFields = DOMManager.get('modalFields');
        const modalForm = DOMManager.get('modalForm');
        
        if (!modal || !modalTitle || !modalFields || !modalForm) {
            console.error('Modal elements not found');
            return;
        }
        
        modalTitle.textContent = title;
        modalFields.innerHTML = getModalFields(type);
        modal.style.display = 'block';
        modalForm.setAttribute('data-type', type);
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function getModalFields(type) {
    const months = calculateProjectMonths();
    
    const fields = {
        internalResource: '<div class="form-group"><label>Role:</label><select name="role" class="form-control" required>' + 
            AppState.getResources('rateCards').map(rate => '<option value="' + rate.role + '" data-category="' + rate.category + '">' + rate.role + ' (' + rate.category + ')</option>').join('') +
            '</select></div>' +
            '<div class="form-group"><label>' + (months[0] || 'Month 1') + ' Days:</label><input type="number" name="month1Days" class="form-control" min="0" step="0.5" value="0"></div>' +
            '<div class="form-group"><label>' + (months[1] || 'Month 2') + ' Days:</label><input type="number" name="month2Days" class="form-control" min="0" step="0.5" value="0"></div>' +
            '<div class="form-group"><label>' + (months[2] || 'Month 3') + ' Days:</label><input type="number" name="month3Days" class="form-control" min="0" step="0.5" value="0"></div>' +
            '<div class="form-group"><label>' + (months[3] || 'Month 4') + ' Days:</label><input type="number" name="month4Days" class="form-control" min="0" step="0.5" value="0"></div>',
            
        vendorCost: '<div class="form-group"><label>Vendor:</label><input type="text" name="vendor" class="form-control" required></div>' +
            '<div class="form-group"><label>Description:</label><input type="text" name="description" class="form-control" required></div>' +
            '<div class="form-group"><label>Category:</label><select name="category" class="form-control" required>' +
            '<option value="Implementation">Implementation</option><option value="Consulting">Consulting</option><option value="Training">Training</option><option value="Support">Support</option><option value="Other">Other</option></select></div>' +
            '<div class="form-group"><label>' + (months[0] || 'Month 1') + ' Cost:</label><input type="number" name="month1Cost" class="form-control" min="0" step="0.01" value="0"></div>' +
            '<div class="form-group"><label>' + (months[1] || 'Month 2') + ' Cost:</label><input type="number" name="month2Cost" class="form-control" min="0" step="0.01" value="0"></div>' +
            '<div class="form-group"><label>' + (months[2] || 'Month 3') + ' Cost:</label><input type="number" name="month3Cost" class="form-control" min="0" step="0.01" value="0"></div>' +
            '<div class="form-group"><label>' + (months[3] || 'Month 4') + ' Cost:</label><input type="number" name="month4Cost" class="form-control" min="0" step="0.01" value="0"></div>',
            
        toolCost: '<div class="form-group"><label>Tool/Software:</label><input type="text" name="tool" class="form-control" required></div>' +
            '<div class="form-group"><label>License Type:</label><select name="licenseType" class="form-control" required>' +
            '<option value="Per User">Per User</option><option value="Per Device">Per Device</option><option value="Enterprise">Enterprise</option><option value="One-time">One-time</option></select></div>' +
            '<div class="form-group"><label>Users/Licenses:</label><input type="number" name="users" class="form-control" min="1" required></div>' +
            '<div class="form-group"><label>Monthly Cost:</label><input type="number" name="monthlyCost" class="form-control" min="0" step="0.01" required></div>' +
            '<div class="form-group"><label>Duration (Months):</label><input type="number" name="duration" class="form-control" min="1" required></div>',
            
        miscCost: '<div class="form-group"><label>Item:</label><input type="text" name="item" class="form-control" required></div>' +
            '<div class="form-group"><label>Description:</label><input type="text" name="description" class="form-control" required></div>' +
            '<div class="form-group"><label>Category:</label><select name="category" class="form-control" required>' +
            '<option value="Travel">Travel</option><option value="Equipment">Equipment</option><option value="Training">Training</option><option value="Documentation">Documentation</option><option value="Other">Other</option></select></div>' +
            '<div class="form-group"><label>Cost:</label><input type="number" name="cost" class="form-control" min="0" step="0.01" required></div>',
            
        risk: '<div class="form-group"><label>Risk Description:</label><textarea name="description" class="form-control" required></textarea></div>' +
            '<div class="form-group"><label>Probability (1-5):</label><input type="number" name="probability" class="form-control" min="1" max="5" required></div>' +
            '<div class="form-group"><label>Impact (1-5):</label><input type="number" name="impact" class="form-control" min="1" max="5" required></div>' +
            '<div class="form-group"><label>Mitigation Cost:</label><input type="number" name="mitigationCost" class="form-control" min="0" step="0.01" value="0"></div>',
            
        rateCard: '<div class="form-group"><label>Role:</label><input type="text" name="role" class="form-control" required></div>' +
            '<div class="form-group"><label>Category:</label><select name="category" class="form-control" required>' +
            '<option value="Internal">Internal</option><option value="External">External</option></select></div>' +
            '<div class="form-group"><label>Daily Rate:</label><input type="number" name="rate" class="form-control" min="0" step="0.01" required></div>'
    };
    
    return fields[type] || '';
}

function handleModalSubmit() {
    try {
        const modalForm = DOMManager.get('modalForm');
        const formData = new FormData(modalForm);
        const type = modalForm.getAttribute('data-type');
        const data = {};
        
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }
        
        console.log('Modal submit - Type:', type);
        console.log('Modal submit - Data:', data);
        
        // Add item to appropriate array using AppState
        switch(type) {
            case 'internalResource':
                const rateCards = AppState.getResources('rateCards');
                const rate = rateCards.find(r => r.role === data.role);
                const resourceData = {
                    role: data.role,
                    rateCard: rate ? rate.category || 'Internal' : 'Internal',
                    dailyRate: rate ? rate.rate : 0,
                    month1Days: parseFloat(data.month1Days) || 0,
                    month2Days: parseFloat(data.month2Days) || 0,
                    month3Days: parseFloat(data.month3Days) || 0,
                    month4Days: parseFloat(data.month4Days) || 0
                };
                AppState.addResource('internalResources', resourceData);
                renderInternalResourcesTable();
                break;
            case 'vendorCost':
                const vendorData = {
                    vendor: data.vendor,
                    description: data.description,
                    category: data.category,
                    month1Cost: parseFloat(data.month1Cost) || 0,
                    month2Cost: parseFloat(data.month2Cost) || 0,
                    month3Cost: parseFloat(data.month3Cost) || 0,
                    month4Cost: parseFloat(data.month4Cost) || 0
                };
                AppState.addResource('vendorCosts', vendorData);
                renderVendorCostsTable();
                break;
            case 'toolCost':
                const toolData = {
                    tool: data.tool,
                    licenseType: data.licenseType,
                    users: parseInt(data.users),
                    monthlyCost: parseFloat(data.monthlyCost),
                    duration: parseInt(data.duration)
                };
                AppState.addResource('toolCosts', toolData);
                renderToolCostsTable();
                break;
            case 'miscCost':
                const miscData = {
                    item: data.item,
                    description: data.description,
                    category: data.category,
                    cost: parseFloat(data.cost)
                };
                AppState.addResource('miscCosts', miscData);
                renderMiscCostsTable();
                break;
            case 'risk':
                const riskData = {
                    description: data.description,
                    probability: parseInt(data.probability),
                    impact: parseInt(data.impact),
                    mitigationCost: parseFloat(data.mitigationCost) || 0
                };
                AppState.addResource('risks', riskData);
                renderRisksTable();
                break;
            case 'rateCard':
                const newRateCard = {
                    role: data.role,
                    rate: parseFloat(data.rate),
                    category: data.category
                };
                AppState.addResource('rateCards', newRateCard);
                renderUnifiedRateCardsTable();
                renderInternalRatesTable();
                renderExternalRatesTable();
                break;
        }
        
        updateSummary();
        renderForecastTable();
        DOMManager.hide('modal');
        console.log('Modal submit completed successfully');
    } catch (error) {
        console.error('Error handling modal submit:', error);
    }
}

// ============================================================================
// TABLE RENDERING FUNCTIONS
// ============================================================================

function renderAllTables() {
    try {
        renderInternalResourcesTable();
        renderVendorCostsTable();
        renderToolCostsTable();
        renderMiscCostsTable();
        renderRisksTable();
        renderInternalRatesTable();
        renderExternalRatesTable();
        renderUnifiedRateCardsTable();
        renderForecastTable();
    } catch (error) {
        console.error('Error rendering tables:', error);
    }
}

function renderInternalResourcesTable() {
    const tbody = DOMManager.get('internalResourcesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const resources = AppState.getResources('internalResources');
    if (resources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No internal resources added yet</td></tr>';
        return;
    }
    
    resources.forEach(resource => {
        const month1Days = resource.month1Days || 0;
        const month2Days = resource.month2Days || 0;
        const month3Days = resource.month3Days || 0;
        const month4Days = resource.month4Days || 0;
        
        const totalCost = (month1Days + month2Days + month3Days + month4Days) * resource.dailyRate;
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + resource.role + '</td>' +
            '<td>' + resource.rateCard + '</td>' +
            '<td>$' + resource.dailyRate.toLocaleString() + '</td>' +
            '<td>' + month1Days + '</td>' +
            '<td>' + month2Days + '</td>' +
            '<td>' + month3Days + '</td>' +
            '<td>' + month4Days + '</td>' +
            '<td>$' + totalCost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'internalResources\', ' + resource.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderVendorCostsTable() {
    const tbody = DOMManager.get('vendorCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const vendors = AppState.getResources('vendorCosts');
    if (vendors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No vendor costs added yet</td></tr>';
        return;
    }
    
    vendors.forEach(vendor => {
        const month1Cost = vendor.month1Cost || 0;
        const month2Cost = vendor.month2Cost || 0;
        const month3Cost = vendor.month3Cost || 0;
        const month4Cost = vendor.month4Cost || 0;
        
        const totalCost = month1Cost + month2Cost + month3Cost + month4Cost;
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + vendor.vendor + '</td>' +
            '<td>' + vendor.description + '</td>' +
            '<td>' + vendor.category + '</td>' +
            '<td>$' + month1Cost.toLocaleString() + '</td>' +
            '<td>$' + month2Cost.toLocaleString() + '</td>' +
            '<td>$' + month3Cost.toLocaleString() + '</td>' +
            '<td>$' + month4Cost.toLocaleString() + '</td>' +
            '<td>$' + totalCost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'vendorCosts\', ' + vendor.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderToolCostsTable() {
    const tbody = DOMManager.get('toolCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const tools = AppState.getResources('toolCosts');
    if (tools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tool costs added yet</td></tr>';
        return;
    }
    
    tools.forEach(tool => {
        const totalCost = tool.users * tool.monthlyCost * tool.duration;
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + tool.tool + '</td>' +
            '<td>' + tool.licenseType + '</td>' +
            '<td>' + tool.users + '</td>' +
            '<td>$' + tool.monthlyCost.toLocaleString() + '</td>' +
            '<td>' + tool.duration + '</td>' +
            '<td>$' + totalCost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'toolCosts\', ' + tool.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderMiscCostsTable() {
    const tbody = DOMManager.get('miscCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const miscCosts = AppState.getResources('miscCosts');
    if (miscCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No miscellaneous costs added yet</td></tr>';
        return;
    }
    
    miscCosts.forEach(misc => {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + misc.item + '</td>' +
            '<td>' + misc.description + '</td>' +
            '<td>' + misc.category + '</td>' +
            '<td>$' + misc.cost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'miscCosts\', ' + misc.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderRisksTable() {
    const tbody = DOMManager.get('risksTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const risks = AppState.getResources('risks');
    if (risks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No risks added yet</td></tr>';
        return;
    }
    
    risks.forEach(risk => {
        const riskScore = risk.probability * risk.impact;
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + risk.description + '</td>' +
            '<td>' + risk.probability + '</td>' +
            '<td>' + risk.impact + '</td>' +
            '<td>' + riskScore + '</td>' +
            '<td>$' + risk.mitigationCost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'risks\', ' + risk.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderInternalRatesTable() {
    const tbody = DOMManager.get('internalRatesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const rateCards = AppState.getResources('rateCards');
    const internalRates = rateCards.filter(rate => rate.category === 'Internal');
    
    if (internalRates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No internal rates added yet</td></tr>';
        return;
    }
    
    internalRates.forEach(rate => {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + rate.role + '</td>' +
            '<td>$' + rate.rate.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'rateCards\', ' + (rate.id || '\'' + rate.role + '\'') + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderExternalRatesTable() {
    const tbody = DOMManager.get('externalRatesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const rateCards = AppState.getResources('rateCards');
    const externalRates = rateCards.filter(rate => rate.category === 'External');
    
    if (externalRates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No external rates added yet</td></tr>';
        return;
    }
    
    externalRates.forEach(rate => {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + rate.role + '</td>' +
            '<td>$' + rate.rate.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'rateCards\', ' + (rate.id || '\'' + rate.role + '\'') + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderUnifiedRateCardsTable() {
    const tbody = DOMManager.get('rateCardsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const rateCards = AppState.getResources('rateCards');
    if (rateCards.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No rate cards added yet</td></tr>';
        return;
    }
    
    // Sort by category then by role
    const sortedRates = rateCards.slice().sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.role.localeCompare(b.role);
    });
    
    sortedRates.forEach(rate => {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + rate.role + '</td>' +
            '<td><span class="category-badge category-' + rate.category.toLowerCase() + '">' + rate.category + '</span></td>' +
            '<td>$' + rate.rate.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'rateCards\', ' + (rate.id || '\'' + rate.role + '\'') + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderForecastTable() {
    const tbody = DOMManager.get('forecastTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Calculate monthly totals for 6 months
    const internalMonthly = [0, 0, 0, 0, 0, 0];
    const vendorMonthly = [0, 0, 0, 0, 0, 0];
    
    // Internal Resources
    const internalResources = AppState.getResources('internalResources');
    internalResources.forEach(resource => {
        internalMonthly[0] += (resource.month1Days || 0) * resource.dailyRate;
        internalMonthly[1] += (resource.month2Days || 0) * resource.dailyRate;
        internalMonthly[2] += (resource.month3Days || 0) * resource.dailyRate;
        internalMonthly[3] += (resource.month4Days || 0) * resource.dailyRate;
        // Months 5 and 6 would be 0 unless we extend the data model
    });
    
    // Vendor Costs
    const vendorCosts = AppState.getResources('vendorCosts');
    vendorCosts.forEach(vendor => {
        vendorMonthly[0] += vendor.month1Cost || 0;
        vendorMonthly[1] += vendor.month2Cost || 0;
        vendorMonthly[2] += vendor.month3Cost || 0;
        vendorMonthly[3] += vendor.month4Cost || 0;
        // Months 5 and 6 would be 0 unless we extend the data model
    });
    
    // Calculate totals
    const internalTotal = internalMonthly.reduce((sum, val) => sum + val, 0);
    const vendorTotal = vendorMonthly.reduce((sum, val) => sum + val, 0);
    
    // Render the rows to match HTML table structure (6 months + total)
    tbody.innerHTML = '<tr><td><strong>Internal Resources</strong></td>' +
        '<td>$' + internalMonthly[0].toLocaleString() + '</td>' +
        '<td>$' + internalMonthly[1].toLocaleString() + '</td>' +
        '<td>$' + internalMonthly[2].toLocaleString() + '</td>' +
        '<td>$' + internalMonthly[3].toLocaleString() + '</td>' +
        '<td>$' + internalMonthly[4].toLocaleString() + '</td>' +
        '<td>$' + internalMonthly[5].toLocaleString() + '</td>' +
        '<td><strong>$' + internalTotal.toLocaleString() + '</strong></td></tr>' +
        '<tr><td><strong>Vendor Costs</strong></td>' +
        '<td>$' + vendorMonthly[0].toLocaleString() + '</td>' +
        '<td>$' + vendorMonthly[1].toLocaleString() + '</td>' +
        '<td>$' + vendorMonthly[2].toLocaleString() + '</td>' +
        '<td>$' + vendorMonthly[3].toLocaleString() + '</td>' +
        '<td>$' + vendorMonthly[4].toLocaleString() + '</td>' +
        '<td>$' + vendorMonthly[5].toLocaleString() + '</td>' +
        '<td><strong>$' + vendorTotal.toLocaleString() + '</strong></td></tr>';
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateInternalResourcesTotal() {
    const resources = AppState.getResources('internalResources');
    return resources.reduce(function(total, resource) {
        const month1Days = resource.month1Days || 0;
        const month2Days = resource.month2Days || 0;
        const month3Days = resource.month3Days || 0;
        const month4Days = resource.month4Days || 0;
        
        return total + ((month1Days + month2Days + month3Days + month4Days) * resource.dailyRate);
    }, 0);
}

function calculateVendorCostsTotal() {
    const vendors = AppState.getResources('vendorCosts');
    return vendors.reduce(function(total, vendor) {
        const month1Cost = vendor.month1Cost || 0;
        const month2Cost = vendor.month2Cost || 0;
        const month3Cost = vendor.month3Cost || 0;
        const month4Cost = vendor.month4Cost || 0;
        
        return total + (month1Cost + month2Cost + month3Cost + month4Cost);
    }, 0);
}

function calculateToolCostsTotal() {
    const tools = AppState.getResources('toolCosts');
    return tools.reduce(function(total, tool) {
        return total + (tool.users * tool.monthlyCost * tool.duration);
    }, 0);
}

function calculateMiscCostsTotal() {
    const miscCosts = AppState.getResources('miscCosts');
    return miscCosts.reduce(function(total, misc) {
        return total + misc.cost;
    }, 0);
}

// ============================================================================
// SUMMARY UPDATE FUNCTIONS
// ============================================================================

function updateSummary() {
    try {
        // Calculate totals
        const internalTotal = calculateInternalResourcesTotal();
        const vendorTotal = calculateVendorCostsTotal();
        const toolTotal = calculateToolCostsTotal();
        const miscTotal = calculateMiscCostsTotal();
        
        const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
        const contingencyPercentage = AppState.getContingencyPercentage();
        const contingency = subtotal * (contingencyPercentage / 100);
        const total = subtotal + contingency;
        
        // Update resource plan cards
        DOMManager.setText('totalProjectCost', '$' + total.toLocaleString());
        DOMManager.setText('totalInternalCost', '$' + internalTotal.toLocaleString());
        DOMManager.setText('totalExternalCost', ' + (vendorTotal + toolTotal + miscTotal).toLocaleString());
        
        // Update contingency display
        DOMManager.setText('contingencyAmount', ' + contingency.toLocaleString());
        
        // Update summary tab
        DOMManager.setText('summaryInternalCost', ' + internalTotal.toLocaleString());
        DOMManager.setText('summaryVendorCost', ' + vendorTotal.toLocaleString());
        DOMManager.setText('summaryToolCost', ' + toolTotal.toLocaleString());
        DOMManager.setText('summaryMiscCost', ' + miscTotal.toLocaleString());
        DOMManager.setText('summarySubtotal', ' + subtotal.toLocaleString());
        DOMManager.setText('summaryContingency', ' + contingency.toLocaleString());
        DOMManager.setText('summaryTotal', ' + total.toLocaleString());

        // Update project info in summary if elements exist
        updateSummaryProjectInfo();
        
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

function updateSummaryProjectInfo() {
    try {
        const projectInfo = AppState.getProjectInfo();
        
        // Update project info in summary tab if elements exist
        const projectInfoElements = {
            summaryProjectName: projectInfo.projectName || 'Not specified',
            summaryStartDate: projectInfo.startDate || 'Not specified', 
            summaryEndDate: projectInfo.endDate || 'Not specified',
            summaryProjectManager: projectInfo.projectManager || 'Not specified',
            summaryProjectDescription: projectInfo.projectDescription || 'Not specified'
        };
        
        Object.keys(projectInfoElements).forEach(function(id) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = projectInfoElements[id];
            }
        });
        
        // Calculate project duration if both dates are provided
        const summaryDurationEl = document.getElementById('summaryProjectDuration');
        if (summaryDurationEl && projectInfo.startDate && projectInfo.endDate) {
            const start = new Date(projectInfo.startDate);
            const end = new Date(projectInfo.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.round(diffDays / 30.44);
            summaryDurationEl.textContent = diffDays + ' days (≈' + diffMonths + ' months)';
        } else if (summaryDurationEl) {
            summaryDurationEl.textContent = 'Not specified';
        }
        
        // Update resource counts if elements exist
        const resourceCountsElements = {
            summaryInternalResourceCount: AppState.getResources('internalResources').length,
            summaryVendorCount: AppState.getResources('vendorCosts').length,
            summaryToolCount: AppState.getResources('toolCosts').length,
            summaryRiskCount: AppState.getResources('risks').length
        };
        
        Object.keys(resourceCountsElements).forEach(function(id) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = resourceCountsElements[id];
            }
        });
        
    } catch (error) {
        console.error('Error in updateSummaryProjectInfo:', error);
    }
}

// ============================================================================
// DELETE FUNCTION
// ============================================================================

function deleteItem(arrayName, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        AppState.removeResource(arrayName, id);
        renderAllTables();
        updateSummary();
    }
}

// ============================================================================
// DATA MANAGEMENT FUNCTIONS
// ============================================================================

function saveProject() {
    if (AppState.saveToStorage()) {
        DOMManager.showAlert('Project saved successfully!', 'success');
    } else {
        DOMManager.showAlert('Failed to save project.', 'error');
    }
}

function loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    AppState.setProjectData(data);
                    populateFormFields();
                    renderAllTables();
                    updateSummary();
                    updateMonthHeaders();
                    DOMManager.showAlert('Project loaded successfully!', 'success');
                } catch (err) {
                    console.error('Error loading project:', err);
                    DOMManager.showAlert('Error loading project file: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function newProject() {
    if (confirm('Are you sure you want to start a new project? This will clear all current data.')) {
        try {
            AppState.reset();
            AppState.clearStorage();
            
            // Clear form fields
            const formFields = ['projectName', 'startDate', 'endDate', 'projectManager', 'projectDescription'];
            formFields.forEach(function(fieldName) {
                DOMManager.setValue(fieldName, '');
            });
            DOMManager.setValue('contingencyPercentage', '10');
            
            // Re-render everything
            renderAllTables();
            updateSummary();
            updateMonthHeaders();
            
            // Switch to project info tab
            Navigation.switchTab('project-info');
            
            DOMManager.showAlert('New project started successfully!', 'success');
            
        } catch (error) {
            console.error('Error creating new project:', error);
            DOMManager.showAlert('Error creating new project: ' + error.message, 'error');
        }
    }
}

function exportToExcel() {
    try {
        // Create a simple CSV export
        const csvContent = generateCSVExport();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        const projectInfo = AppState.getProjectInfo();
        link.setAttribute('download', 'ICT_Cost_Estimate_' + (projectInfo.projectName || 'Project') + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        DOMManager.showAlert('Export completed successfully!', 'success');
    } catch (error) {
        console.error('Error exporting:', error);
        DOMManager.showAlert('Error exporting project: ' + error.message, 'error');
    }
}

function generateCSVExport() {
    const months = calculateProjectMonths();
    const projectInfo = AppState.getProjectInfo();
    let csv = 'ICT Project Cost Estimate Export\n\n';
    
    // Project Info
    csv += 'PROJECT INFORMATION\n';
    csv += 'Project Name,"' + projectInfo.projectName + '"\n';
    csv += 'Start Date,"' + projectInfo.startDate + '"\n';
    csv += 'End Date,"' + projectInfo.endDate + '"\n';
    csv += 'Project Manager,"' + projectInfo.projectManager + '"\n';
    csv += 'Description,"' + projectInfo.projectDescription + '"\n\n';
    
    // Rate Cards
    csv += 'RATE CARDS\n';
    csv += 'Role,Category,Daily Rate\n';
    AppState.getResources('rateCards').forEach(function(rate) {
        csv += '"' + rate.role + '","' + rate.category + '",' + rate.rate + '\n';
    });
    
    // Internal Resources
    csv += '\nINTERNAL RESOURCES\n';
    csv += 'Role,Rate Card,Daily Rate,' + months[0] + ' Days,' + months[1] + ' Days,' + months[2] + ' Days,' + months[3] + ' Days,Total Cost\n';
    AppState.getResources('internalResources').forEach(function(resource) {
        const month1Days = resource.month1Days || 0;
        const month2Days = resource.month2Days || 0;
        const month3Days = resource.month3Days || 0;
        const month4Days = resource.month4Days || 0;
        const totalCost = (month1Days + month2Days + month3Days + month4Days) * resource.dailyRate;
        csv += '"' + resource.role + '","' + resource.rateCard + '",' + resource.dailyRate + ',' + month1Days + ',' + month2Days + ',' + month3Days + ',' + month4Days + ',' + totalCost + '\n';
    });
    
    // Summary
    csv += '\nPROJECT SUMMARY\n';
    const internalTotal = calculateInternalResourcesTotal();
    const vendorTotal = calculateVendorCostsTotal();
    const toolTotal = calculateToolCostsTotal();
    const miscTotal = calculateMiscCostsTotal();
    const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
    const contingency = subtotal * (AppState.getContingencyPercentage() / 100);
    const total = subtotal + contingency;
    
    csv += 'Internal Resources,' + internalTotal + '\n';
    csv += 'Vendor Costs,' + vendorTotal + '\n';
    csv += 'Tool Costs,' + toolTotal + '\n';
    csv += 'Miscellaneous,' + miscTotal + '\n';
    csv += 'Subtotal,' + subtotal + '\n';
    csv += 'Contingency (' + AppState.getContingencyPercentage() + '%),' + contingency + '\n';
    csv += 'Total Project Cost,' + total + '\n';
    
    return csv;
}

function populateFormFields() {
    const projectInfo = AppState.getProjectInfo();
    const contingency = AppState.getContingencyPercentage();
    
    const formFields = {
        projectName: projectInfo.projectName || '',
        startDate: projectInfo.startDate || '',
        endDate: projectInfo.endDate || '',
        projectManager: projectInfo.projectManager || '',
        projectDescription: projectInfo.projectDescription || '',
        contingencyPercentage: contingency
    };
    
    Object.keys(formFields).forEach(function(fieldName) {
        DOMManager.setValue(fieldName, formFields[fieldName]);
    });
}

// ============================================================================
// PRINT FUNCTIONALITY
// ============================================================================

function printReport() {
    try {
        const printWindow = window.open('', '_blank');
        const printContent = generatePrintContent();
        
        printWindow.document.write('<!DOCTYPE html><html><head>' +
            '<title>ICT Project Cost Estimate - ' + (AppState.getProjectInfo().projectName || 'Project') + '</title>' +
            '<style>body { font-family: Arial, sans-serif; margin: 20px; }' +
            'h1, h2, h3 { color: #2c3e50; }' +
            'table { width: 100%; border-collapse: collapse; margin: 20px 0; }' +
            'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }' +
            'th { background-color: #f2f2f2; }' +
            '.summary-section { background-color: #f8f9fa; padding: 15px; margin: 20px 0; }' +
            '.total-cost { font-size: 1.2em; font-weight: bold; color: #28a745; }' +
            '@media print { .no-print { display: none; } }</style>' +
            '</head><body>' + printContent +
            '<div class="no-print" style="margin-top: 20px;">' +
            '<button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer;">Print</button>' +
            '<button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; cursor: pointer; margin-left: 10px;">Close</button>' +
            '</div></body></html>');
        
        printWindow.document.close();
        printWindow.focus();
    } catch (error) {
        console.error('Error generating print report:', error);
        DOMManager.showAlert('Error generating print report: ' + error.message, 'error');
    }
}

function generatePrintContent() {
    const months = calculateProjectMonths();
    const projectInfo = AppState.getProjectInfo();
    
    let content = '<h1>ICT Project Cost Estimate</h1>' +
        '<div class="summary-section">' +
        '<h2>Project Information</h2>' +
        '<p><strong>Project Name:</strong> ' + (projectInfo.projectName || 'Not specified') + '</p>' +
        '<p><strong>Start Date:</strong> ' + (projectInfo.startDate || 'Not specified') + '</p>' +
        '<p><strong>End Date:</strong> ' + (projectInfo.endDate || 'Not specified') + '</p>' +
        '<p><strong>Project Manager:</strong> ' + (projectInfo.projectManager || 'Not specified') + '</p>' +
        '<p><strong>Description:</strong> ' + (projectInfo.projectDescription || 'Not specified') + '</p>' +
        '</div>';

    // Summary
    const internalTotal = calculateInternalResourcesTotal();
    const vendorTotal = calculateVendorCostsTotal();
    const toolTotal = calculateToolCostsTotal();
    const miscTotal = calculateMiscCostsTotal();
    const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
    const contingency = subtotal * (AppState.getContingencyPercentage() / 100);
    const total = subtotal + contingency;

    content += '<div class="summary-section">' +
        '<h2>Project Summary</h2>' +
        '<table>' +
        '<tr><td>Internal Resources</td><td> + internalTotal.toLocaleString() + '</td></tr>' +
        '<tr><td>Vendor Costs</td><td> + vendorTotal.toLocaleString() + '</td></tr>' +
        '<tr><td>Tool Costs</td><td> + toolTotal.toLocaleString() + '</td></tr>' +
        '<tr><td>Miscellaneous</td><td> + miscTotal.toLocaleString() + '</td></tr>' +
        '<tr><td><strong>Subtotal</strong></td><td><strong> + subtotal.toLocaleString() + '</strong></td></tr>' +
        '<tr><td>Contingency (' + AppState.getContingencyPercentage() + '%)</td><td> + contingency.toLocaleString() + '</td></tr>' +
        '<tr><td class="total-cost">Total Project Cost</td><td class="total-cost"> + total.toLocaleString() + '</td></tr>' +
        '</table></div>';

    return content;
}

// ============================================================================
// GLOBAL FUNCTION EXPORTS
// ============================================================================

// Make functions available globally for HTML onclick handlers
window.deleteItem = deleteItem;
window.printReport = printReport;
window.newProject = newProject;
window.saveProject = saveProject;
window.loadProject = loadProject;
window.exportToExcel = exportToExcel;
window.openModal = openModal;
window.handleModalSubmit = handleModalSubmit;
window.updateSummary = updateSummary;
window.updateMonthHeaders = updateMonthHeaders;
window.renderAllTables = renderAllTables;
window.renderForecastTable = renderForecastTable;
window.renderUnifiedRateCardsTable = renderUnifiedRateCardsTable;
window.renderInternalRatesTable = renderInternalRatesTable;
window.renderExternalRatesTable = renderExternalRatesTable;
