// Application State
let projectData = {
    projectInfo: {
        projectName: '',
        startDate: '',
        endDate: '',
        projectManager: '',
        projectDescription: ''
    },
    internalResources: [],
    vendorCosts: [],
    toolCosts: [],
    miscCosts: [],
    risks: [],
    // Unified rate cards with category metadata
    rateCards: [
        { role: 'Project Manager', rate: 800, category: 'Internal' },
        { role: 'Business Analyst', rate: 650, category: 'Internal' },
        { role: 'Technical Lead', rate: 750, category: 'Internal' },
        { role: 'Developer', rate: 600, category: 'Internal' },
        { role: 'Tester', rate: 550, category: 'Internal' },
        { role: 'Senior Consultant', rate: 1200, category: 'External' },
        { role: 'Technical Architect', rate: 1500, category: 'External' },
        { role: 'Implementation Specialist', rate: 900, category: 'External' },
        { role: 'Support Specialist', rate: 700, category: 'External' }
    ],
    // Keep old arrays for backward compatibility
    internalRates: [
        { role: 'Project Manager', rate: 800 },
        { role: 'Business Analyst', rate: 650 },
        { role: 'Technical Lead', rate: 750 },
        { role: 'Developer', rate: 600 },
        { role: 'Tester', rate: 550 }
    ],
    externalRates: [
        { role: 'Senior Consultant', rate: 1200 },
        { role: 'Technical Architect', rate: 1500 },
        { role: 'Implementation Specialist', rate: 900 },
        { role: 'Support Specialist', rate: 700 }
    ],
    contingencyPercentage: 10
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Starting application initialization...');
        
        // Check if DOM manager is available
        if (!window.domManager) {
            console.error('DOM Manager not found! Make sure dom-manager.js is loaded first.');
            alert('DOM Manager not loaded. Please check that dom-manager.js is included before script.js');
            return;
        }
        
        console.log('DOM Manager found, initializing...');
        
        // Initialize DOM manager
        if (window.domManager.initializeDOMElements()) {
            console.log('DOM elements initialized successfully');
            window.domManager.initializeTabs();
            console.log('Tabs initialized');
            window.domManager.initializeEventListeners();
            console.log('Event listeners initialized');
        } else {
            console.error('Failed to initialize DOM elements');
            return;
        }
        
        console.log('Loading data and rendering tables...');
        loadDefaultData();
        renderAllTables();
        updateSummary();
        
        // Update month headers using DOM manager
        window.domManager.updateMonthHeaders();
        
        // Manually attach settings button listener with robust retry
        setTimeout(() => {
            function attachSettingsListener(attempt = 1) {
                const settingsBtn = document.getElementById('settingsBtn');
                console.log(`Settings attachment attempt ${attempt}:`, settingsBtn);
                
                if (settingsBtn && !settingsBtn.hasAttribute('data-settings-attached')) {
                    // Clear any existing listeners by cloning
                    const newBtn = settingsBtn.cloneNode(true);
                    settingsBtn.parentNode.replaceChild(newBtn, settingsBtn);
                    
                    // Add our listener
                    newBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        console.log('Settings button clicked (robust attachment)');
                        window.domManager.openSettings();
                    });
                    
                    newBtn.setAttribute('data-settings-attached', 'true');
                    console.log('Settings button event listener attached successfully');
                    return true;
                } else if (attempt < 10) {
                    setTimeout(() => attachSettingsListener(attempt + 1), 200);
                    return false;
                } else {
                    console.warn('Settings button not found after 10 attempts');
                    return false;
                }
            }
            
            attachSettingsListener();
        }, 100);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error initializing application: ' + error.message + '. Please check the console for details.');
    }
});

// Calculate months based on start date
function calculateProjectMonths() {
    const startDate = projectData.projectInfo.startDate;
    
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

// Modal form submission handler
function handleModalSubmit() {
    try {
        const modalForm = document.getElementById('modalForm');
        if (!modalForm) {
            console.error('Modal form not found');
            return;
        }

        const formData = new FormData(modalForm);
        const type = modalForm.getAttribute('data-type');
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log('Modal submit - Type:', type);
        console.log('Modal submit - Data:', data);
        
        // Add item to appropriate array
        switch(type) {
            case 'internalResource':
                const rate = projectData.rateCards.find(r => r.role === data.role) || 
                            projectData.internalRates.find(r => r.role === data.role);
                projectData.internalResources.push({
                    id: Date.now(),
                    role: data.role,
                    rateCard: rate ? rate.category || 'Internal' : 'Internal',
                    dailyRate: rate ? rate.rate : 0,
                    month1Days: parseFloat(data.month1Days) || 0,
                    month2Days: parseFloat(data.month2Days) || 0,
                    month3Days: parseFloat(data.month3Days) || 0,
                    month4Days: parseFloat(data.month4Days) || 0
                });
                renderInternalResourcesTable();
                break;
            case 'vendorCost':
                projectData.vendorCosts.push({
                    id: Date.now(),
                    vendor: data.vendor,
                    description: data.description,
                    category: data.category,
                    month1Cost: parseFloat(data.month1Cost) || 0,
                    month2Cost: parseFloat(data.month2Cost) || 0,
                    month3Cost: parseFloat(data.month3Cost) || 0,
                    month4Cost: parseFloat(data.month4Cost) || 0
                });
                renderVendorCostsTable();
                break;
            case 'toolCost':
                projectData.toolCosts.push({
                    id: Date.now(),
                    tool: data.tool,
                    licenseType: data.licenseType,
                    users: parseInt(data.users),
                    monthlyCost: parseFloat(data.monthlyCost),
                    duration: parseInt(data.duration)
                });
                renderToolCostsTable();
                break;
            case 'miscCost':
                projectData.miscCosts.push({
                    id: Date.now(),
                    item: data.item,
                    description: data.description,
                    category: data.category,
                    cost: parseFloat(data.cost)
                });
                renderMiscCostsTable();
                break;
            case 'risk':
                projectData.risks.push({
                    id: Date.now(),
                    description: data.description,
                    probability: parseInt(data.probability),
                    impact: parseInt(data.impact),
                    mitigationCost: parseFloat(data.mitigationCost) || 0
                });
                renderRisksTable();
                break;
            case 'rateCard':
                console.log('Adding rate card:', data);
                const newRateCard = {
                    id: Date.now(),
                    role: data.role,
                    rate: parseFloat(data.rate),
                    category: data.category
                };
                projectData.rateCards.push(newRateCard);
                
                // Update both old arrays for backward compatibility
                if (data.category === 'Internal') {
                    projectData.internalRates.push({
                        id: Date.now(),
                        role: data.role,
                        rate: parseFloat(data.rate)
                    });
                } else if (data.category === 'External') {
                    projectData.externalRates.push({
                        id: Date.now(),
                        role: data.role,
                        rate: parseFloat(data.rate)
                    });
                }
                
                console.log('Updated rateCards array:', projectData.rateCards);
                console.log('Updated internalRates array:', projectData.internalRates);
                console.log('Updated externalRates array:', projectData.externalRates);
                
                // Render the unified rate cards table
                console.log('About to render unified rate cards table...');
                renderUnifiedRateCardsTable();
                break;
        }
        
        updateSummary();
        
        // Close modal using DOM manager
        const modal = document.getElementById('modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        console.log('Modal submit completed successfully');
    } catch (error) {
        console.error('Error handling modal submit:', error);
    }
}

// Table Rendering Functions
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

// Unified rate cards table rendering
function renderUnifiedRateCardsTable() {
    const tbody = document.getElementById('rateCardsTable');
    console.log('renderUnifiedRateCardsTable - tbody element:', tbody);
    
    if (!tbody) {
        console.log('rateCardsTable not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (projectData.rateCards.length === 0) {
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
            <td>${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('rateCards', ${rate.id || `'${rate.role}'`})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log('Unified rate cards table rendered successfully');
}

function renderInternalResourcesTable() {
    const tbody = document.getElementById('internalResourcesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.internalResources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No internal resources added yet</td></tr>';
        return;
    }
    
    projectData.internalResources.forEach(resource => {
        // Handle both old format (q1Days) and new format (month1Days)
        const month1Days = resource.month1Days || resource.q1Days || 0;
        const month2Days = resource.month2Days || resource.q2Days || 0;
        const month3Days = resource.month3Days || resource.q3Days || 0;
        const month4Days = resource.month4Days || resource.q4Days || 0;
        
        const totalCost = (month1Days + month2Days + month3Days + month4Days) * resource.dailyRate;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.role}</td>
            <td>${resource.rateCard}</td>
            <td>$${resource.dailyRate.toLocaleString()}</td>
            <td>${month1Days}</td>
            <td>${month2Days}</td>
            <td>${month3Days}</td>
            <td>${month4Days}</td>
            <td>$${totalCost.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('internalResources', ${resource.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderVendorCostsTable() {
    const tbody = document.getElementById('vendorCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.vendorCosts.length === 0) {
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
            <td>${vendor.description}</td>
            <td>${vendor.category}</td>
            <td>$${month1Cost.toLocaleString()}</td>
            <td>$${month2Cost.toLocaleString()}</td>
            <td>$${month3Cost.toLocaleString()}</td>
            <td>$${month4Cost.toLocaleString()}</td>
            <td>$${totalCost.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('vendorCosts', ${vendor.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderToolCostsTable() {
    const tbody = document.getElementById('toolCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.toolCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tool costs added yet</td></tr>';
        return;
    }
    
    projectData.toolCosts.forEach(tool => {
        const totalCost = tool.users * tool.monthlyCost * tool.duration;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tool.tool}</td>
            <td>${tool.licenseType}</td>
            <td>${tool.users}</td>
            <td>$${tool.monthlyCost.toLocaleString()}</td>
            <td>${tool.duration}</td>
            <td>$${totalCost.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('toolCosts', ${tool.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderMiscCostsTable() {
    const tbody = document.getElementById('miscCostsTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.miscCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No miscellaneous costs added yet</td></tr>';
        return;
    }
    
    projectData.miscCosts.forEach(misc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${misc.item}</td>
            <td>${misc.description}</td>
            <td>${misc.category}</td>
            <td>$${misc.cost.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('miscCosts', ${misc.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderRisksTable() {
    const tbody = document.getElementById('risksTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.risks.length === 0) {
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
            <td>$${risk.mitigationCost.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('risks', ${risk.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderInternalRatesTable() {
    const tbody = document.getElementById('internalRatesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
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
            <td>${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('rateCards', ${rate.id || `'${rate.role}'`})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderExternalRatesTable() {
    const tbody = document.getElementById('externalRatesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
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
            <td>${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('rateCards', ${rate.id || `'${rate.role}'`})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderForecastTable() {
    const tbody = document.getElementById('forecastTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Internal Resources
    const internalMonthly = [0, 0, 0, 0, 0, 0];
    projectData.internalResources.forEach(resource => {
        internalMonthly[0] += (resource.month1Days || resource.q1Days || 0) * resource.dailyRate;
        internalMonthly[1] += (resource.month2Days || resource.q2Days || 0) * resource.dailyRate;
        internalMonthly[2] += (resource.month3Days || resource.q3Days || 0) * resource.dailyRate;
        internalMonthly[3] += (resource.month4Days || resource.q4Days || 0) * resource.dailyRate;
    });
    
    // Vendor Costs
    const vendorMonthly = [0, 0, 0, 0, 0, 0];
    projectData.vendorCosts.forEach(vendor => {
        vendorMonthly[0] += vendor.month1Cost || vendor.q1Cost || 0;
        vendorMonthly[1] += vendor.month2Cost || vendor.q2Cost || 0;
        vendorMonthly[2] += vendor.month3Cost || vendor.q3Cost || 0;
        vendorMonthly[3] += vendor.month4Cost || vendor.q4Cost || 0;
    });
    
    // Add rows
    const internalTotal = internalMonthly.reduce((sum, val) => sum + val, 0);
    const vendorTotal = vendorMonthly.reduce((sum, val) => sum + val, 0);
    
    tbody.innerHTML = `
        <tr>
            <td><strong>Internal Resources</strong></td>
            <td>${internalMonthly[0].toLocaleString()}</td>
            <td>${internalMonthly[1].toLocaleString()}</td>
            <td>${internalMonthly[2].toLocaleString()}</td>
            <td>${internalMonthly[3].toLocaleString()}</td>
            <td>${internalMonthly[4].toLocaleString()}</td>
            <td>${internalMonthly[5].toLocaleString()}</td>
            <td><strong>${internalTotal.toLocaleString()}</strong></td>
        </tr>
        <tr>
            <td><strong>Vendor Costs</strong></td>
            <td>${vendorMonthly[0].toLocaleString()}</td>
            <td>${vendorMonthly[1].toLocaleString()}</td>
            <td>${vendorMonthly[2].toLocaleString()}</td>
            <td>${vendorMonthly[3].toLocaleString()}</td>
            <td>${vendorMonthly[4].toLocaleString()}</td>
            <td>${vendorMonthly[5].toLocaleString()}</td>
            <td><strong>${vendorTotal.toLocaleString()}</strong></td>
        </tr>
    `;
}

// Delete Item Function
function deleteItem(arrayName, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        if (arrayName === 'rateCards' || arrayName === 'internalRates' || arrayName === 'externalRates') {
            projectData.rateCards = projectData.rateCards.filter(item => 
                (item.id && item.id !== id) || (item.role !== id)
            );
            // Also remove from old arrays for backward compatibility
            if (projectData.internalRates) {
                projectData.internalRates = projectData.internalRates.filter(item => 
                    (item.id && item.id !== id) || (item.role !== id)
                );
            }
            if (projectData.externalRates) {
                projectData.externalRates = projectData.externalRates.filter(item => 
                    (item.id && item.id !== id) || (item.role !== id)
                );
            }
        } else {
            projectData[arrayName] = projectData[arrayName].filter(item => item.id !== id);
        }
        renderAllTables();
        updateSummary();
    }
}

// Summary Calculations
function updateSummary() {
    try {
        // Calculate totals
        const internalTotal = calculateInternalResourcesTotal();
        const vendorTotal = calculateVendorCostsTotal();
        const toolTotal = calculateToolCostsTotal();
        const miscTotal = calculateMiscCostsTotal();
        
        const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
        const contingency = subtotal * (projectData.contingencyPercentage / 100);
        const total = subtotal + contingency;
        
        // Update resource plan cards
        const totalProjectCostEl = document.getElementById('totalProjectCost');
        const totalInternalCostEl = document.getElementById('totalInternalCost');
        const totalExternalCostEl = document.getElementById('totalExternalCost');
        
        if (totalProjectCostEl) totalProjectCostEl.textContent = `${total.toLocaleString()}`;
        if (totalInternalCostEl) totalInternalCostEl.textContent = `${internalTotal.toLocaleString()}`;
        if (totalExternalCostEl) totalExternalCostEl.textContent = `${(vendorTotal + toolTotal + miscTotal).toLocaleString()}`;
        
        // Update contingency display
        const contingencyAmountEl = document.getElementById('contingencyAmount');
        if (contingencyAmountEl) contingencyAmountEl.textContent = contingency.toLocaleString();
        
        // Update summary tab
        const summaryElements = {
            summaryInternalCost: internalTotal,
            summaryVendorCost: vendorTotal,
            summaryToolCost: toolTotal,
            summaryMiscCost: miscTotal,
            summarySubtotal: subtotal,
            summaryContingency: contingency,
            summaryTotal: total
        };
        
        Object.keys(summaryElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `${summaryElements[id].toLocaleString()}`;
            }
        });

        // Update summary project info
        updateSummaryProjectInfo();
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

function calculateInternalResourcesTotal() {
    return projectData.internalResources.reduce((total, resource) => {
        const month1Days = resource.month1Days || resource.q1Days || 0;
        const month2Days = resource.month2Days || resource.q2Days || 0;
        const month3Days = resource.month3Days || resource.q3Days || 0;
        const month4Days = resource.month4Days || resource.q4Days || 0;
        
        return total + ((month1Days + month2Days + month3Days + month4Days) * resource.dailyRate);
    }, 0);
}

function calculateVendorCostsTotal() {
    return projectData.vendorCosts.reduce((total, vendor) => {
        const month1Cost = vendor.month1Cost || vendor.q1Cost || 0;
        const month2Cost = vendor.month2Cost || vendor.q2Cost || 0;
        const month3Cost = vendor.month3Cost || vendor.q3Cost || 0;
        const month4Cost = vendor.month4Cost || vendor.q4Cost || 0;
        
        return total + (month1Cost + month2Cost + month3Cost + month4Cost);
    }, 0);
}

function calculateToolCostsTotal() {
    return projectData.toolCosts.reduce((total, tool) => {
        return total + (tool.users * tool.monthlyCost * tool.duration);
    }, 0);
}

function calculateMiscCostsTotal() {
    return projectData.miscCosts.reduce((total, misc) => {
        return total + misc.cost;
    }, 0);
}

// Data Management
function loadDefaultData() {
    try {
        if (typeof(Storage) !== "undefined" && localStorage) {
            const savedData = localStorage.getItem('ictProjectData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                projectData = { ...projectData, ...parsed };
                
                // Migrate old rate cards to new unified format if needed
                if (!projectData.rateCards && (projectData.internalRates || projectData.externalRates)) {
                    projectData.rateCards = [];
                    
                    // Migrate internal rates
                    if (projectData.internalRates) {
                        projectData.internalRates.forEach(rate => {
                            projectData.rateCards.push({
                                id: rate.id || Date.now() + Math.random(),
                                role: rate.role,
                                rate: rate.rate,
                                category: 'Internal'
                            });
                        });
                    }
                    
                    // Migrate external rates
                    if (projectData.externalRates) {
                        projectData.externalRates.forEach(rate => {
                            projectData.rateCards.push({
                                id: rate.id || Date.now() + Math.random(),
                                role: rate.role,
                                rate: rate.rate,
                                category: 'External'
                            });
                        });
                    }
                }
                
                // Populate form fields
                const formFields = {
                    projectName: projectData.projectInfo.projectName || '',
                    startDate: projectData.projectInfo.startDate || '',
                    endDate: projectData.projectInfo.endDate || '',
                    projectManager: projectData.projectInfo.projectManager || '',
                    projectDescription: projectData.projectInfo.projectDescription || '',
                    contingencyPercentage: projectData.contingencyPercentage || 10
                };
                
                Object.keys(formFields).forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = formFields[id];
                    }
                });
            }
        }
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
}

function saveProject() {
    try {
        if (typeof(Storage) !== "undefined" && localStorage) {
            localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            if (window.domManager) {
                window.domManager.showAlert('Project saved to browser storage successfully!', 'success');
            }
        } else {
            if (window.domManager) {
                window.domManager.showAlert('Local storage not available. Cannot save project.', 'error');
            }
        }
    } catch (e) {
        console.error('Error saving project:', e);
        if (window.domManager) {
            window.domManager.showAlert('Error saving project: ' + e.message, 'error');
        }
    }
}

function downloadProject() {
    try {
        const dataStr = JSON.stringify(projectData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `ICT_Project_${projectData.projectInfo.projectName || 'Untitled'}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        if (window.domManager) {
            window.domManager.showAlert('Project file downloaded successfully!', 'success');
        }
    } catch (error) {
        console.error('Error downloading project:', error);
        if (window.domManager) {
            window.domManager.showAlert('Error downloading project file: ' + error.message, 'error');
        }
    }
}

function newProject() {
    if (confirm('Are you sure you want to start a new project? This will clear all current data. Make sure to save or download your current project first.')) {
        try {
            // Reset project data to initial state
            projectData = {
                projectInfo: {
                    projectName: '',
                    startDate: '',
                    endDate: '',
                    projectManager: '',
                    projectDescription: ''
                },
                internalResources: [],
                vendorCosts: [],
                toolCosts: [],
                miscCosts: [],
                risks: [],
                rateCards: [
                    { role: 'Project Manager', rate: 800, category: 'Internal' },
                    { role: 'Business Analyst', rate: 650, category: 'Internal' },
                    { role: 'Technical Lead', rate: 750, category: 'Internal' },
                    { role: 'Developer', rate: 600, category: 'Internal' },
                    { role: 'Tester', rate: 550, category: 'Internal' },
                    { role: 'Senior Consultant', rate: 1200, category: 'External' },
                    { role: 'Technical Architect', rate: 1500, category: 'External' },
                    { role: 'Implementation Specialist', rate: 900, category: 'External' },
                    { role: 'Support Specialist', rate: 700, category: 'External' }
                ],
                internalRates: [
                    { role: 'Project Manager', rate: 800 },
                    { role: 'Business Analyst', rate: 650 },
                    { role: 'Technical Lead', rate: 750 },
                    { role: 'Developer', rate: 600 },
                    { role: 'Tester', rate: 550 }
                ],
                externalRates: [
                    { role: 'Senior Consultant', rate: 1200 },
                    { role: 'Technical Architect', rate: 1500 },
                    { role: 'Implementation Specialist', rate: 900 },
                    { role: 'Support Specialist', rate: 700 }
                ],
                contingencyPercentage: 10
            };
            
            // Clear form fields
            const formFields = {
                projectName: '',
                startDate: '',
                endDate: '',
                projectManager: '',
                projectDescription: '',
                contingencyPercentage: 10
            };
            
            Object.keys(formFields).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = formFields[id];
                }
            });
            
            // Clear localStorage
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.removeItem('ictProjectData');
            }
            
            // Re-render all tables and summaries
            renderAllTables();
            updateSummary();
            if (window.domManager) {
                window.domManager.updateMonthHeaders();
            }
            
            // Switch to project info tab
            if (window.domManager) {
                window.domManager.switchTab('project-info');
            }
            
            if (window.domManager) {
                window.domManager.showAlert('New project started successfully! Please enter your project information.', 'success');
            }
            console.log('New project created');
            
        } catch (error) {
            console.error('Error creating new project:', error);
            if (window.domManager) {
                window.domManager.showAlert('Error creating new project: ' + error.message, 'error');
            }
        }
    }
}

function loadProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    projectData = { ...projectData, ...data };
                    loadDefaultData();
                    renderAllTables();
                    updateSummary();
                    if (window.domManager) {
                        window.domManager.updateMonthHeaders();
                        window.domManager.showAlert('Project loaded successfully!', 'success');
                    }
                } catch (err) {
                    console.error('Error loading project:', err);
                    if (window.domManager) {
                        window.domManager.showAlert('Error loading project file: ' + err.message, 'error');
                    }
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function exportToExcel() {
    try {
        // Create a simple CSV export since we can't use external libraries
        const csvContent = generateCSVExport();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `ICT_Cost_Estimate_${projectData.projectInfo.projectName || 'Project'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        if (window.domManager) {
            window.domManager.showAlert('Export completed successfully!', 'success');
        }
    } catch (error) {
        console.error('Error exporting:', error);
        if (window.domManager) {
            window.domManager.showAlert('Error exporting project: ' + error.message, 'error');
        }
    }
}

function generateCSVExport() {
    const months = calculateProjectMonths();
    let csv = 'ICT Project Cost Estimate Export\n\n';
    
    // Project Info
    csv += 'PROJECT INFORMATION\n';
    csv += `Project Name,"${projectData.projectInfo.projectName}"\n`;
    csv += `Start Date,"${projectData.projectInfo.startDate}"\n`;
    csv += `End Date,"${projectData.projectInfo.endDate}"\n`;
    csv += `Project Manager,"${projectData.projectInfo.projectManager}"\n`;
    csv += `Description,"${projectData.projectInfo.projectDescription}"\n\n`;
    
    // Rate Cards
    csv += 'RATE CARDS\n';
    csv += 'Role,Category,Daily Rate\n';
    projectData.rateCards.forEach(rate => {
        csv += `"${rate.role}","${rate.category}",${rate.rate}\n`;
    });
    
    // Internal Resources
    csv += '\nINTERNAL RESOURCES\n';
    csv += `Role,Rate Card,Daily Rate,${months[0]} Days,${months[1]} Days,${months[2]} Days,${months[3]} Days,Total Cost\n`;
    projectData.internalResources.forEach(resource => {
        const month1Days = resource.month1Days || resource.q1Days || 0;
        const month2Days = resource.month2Days || resource.q2Days || 0;
        const month3Days = resource.month3Days || resource.q3Days || 0;
        const month4Days = resource.month4Days || resource.q4Days || 0;
        const totalCost = (month1Days + month2Days + month3Days + month4Days) * resource.dailyRate;
        csv += `"${resource.role}","${resource.rateCard}",${resource.dailyRate},${month1Days},${month2Days},${month3Days},${month4Days},${totalCost}\n`;
    });
    
    // Vendor Costs
    csv += '\nVENDOR COSTS\n';
    csv += `Vendor,Description,Category,${months[0]} Cost,${months[1]} Cost,${months[2]} Cost,${months[3]} Cost,Total Cost\n`;
    projectData.vendorCosts.forEach(vendor => {
        const month1Cost = vendor.month1Cost || vendor.q1Cost || 0;
        const month2Cost = vendor.month2Cost || vendor.q2Cost || 0;
        const month3Cost = vendor.month3Cost || vendor.q3Cost || 0;
        const month4Cost = vendor.month4Cost || vendor.q4Cost || 0;
        const totalCost = month1Cost + month2Cost + month3Cost + month4Cost;
        csv += `"${vendor.vendor}","${vendor.description}","${vendor.category}",${month1Cost},${month2Cost},${month3Cost},${month4Cost},${totalCost}\n`;
    });
    
    // Tool Costs
    csv += '\nTOOL COSTS\n';
    csv += 'Tool/Software,License Type,Users/Licenses,Monthly Cost,Duration (Months),Total Cost\n';
    projectData.toolCosts.forEach(tool => {
        const totalCost = tool.users * tool.monthlyCost * tool.duration;
        csv += `"${tool.tool}","${tool.licenseType}",${tool.users},${tool.monthlyCost},${tool.duration},${totalCost}\n`;
    });
    
    // Miscellaneous Costs
    csv += '\nMISCELLANEOUS COSTS\n';
    csv += 'Item,Description,Category,Cost\n';
    projectData.miscCosts.forEach(misc => {
        csv += `"${misc.item}","${misc.description}","${misc.category}",${misc.cost}\n`;
    });
    
    // Risks
    csv += '\nRISKS\n';
    csv += 'Description,Probability,Impact,Risk Score,Mitigation Cost\n';
    projectData.risks.forEach(risk => {
        const riskScore = risk.probability * risk.impact;
        csv += `"${risk.description}",${risk.probability},${risk.impact},${riskScore},${risk.mitigationCost}\n`;
    });
    
    // Summary
    csv += '\nPROJECT SUMMARY\n';
    const internalTotal = calculateInternalResourcesTotal();
    const vendorTotal = calculateVendorCostsTotal();
    const toolTotal = calculateToolCostsTotal();
    const miscTotal = calculateMiscCostsTotal();
    const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
    const contingency = subtotal * (projectData.contingencyPercentage / 100);
    const total = subtotal + contingency;
    
    csv += `Internal Resources,${internalTotal}\n`;
    csv += `Vendor Costs,${vendorTotal}\n`;
    csv += `Tool Costs,${toolTotal}\n`;
    csv += `Miscellaneous,${miscTotal}\n`;
    csv += `Subtotal,${subtotal}\n`;
    csv += `Contingency (${projectData.contingencyPercentage}%),${contingency}\n`;
    csv += `Total Project Cost,${total}\n`;
    
    return csv;
}

// Function to update project info in summary tab
function updateSummaryProjectInfo() {
    try {
        console.log('Updating summary project info...');
        
        // Update project info in summary tab
        const projectInfoElements = {
            summaryProjectName: projectData.projectInfo.projectName || 'Not specified',
            summaryStartDate: projectData.projectInfo.startDate || 'Not specified', 
            summaryEndDate: projectData.projectInfo.endDate || 'Not specified',
            summaryProjectManager: projectData.projectInfo.projectManager || 'Not specified',
            summaryProjectDescription: projectData.projectInfo.projectDescription || 'Not specified'
        };
        
        Object.keys(projectInfoElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = projectInfoElements[id];
            }
        });
        
        // Calculate project duration if both dates are provided
        const summaryDurationEl = document.getElementById('summaryProjectDuration');
        if (summaryDurationEl && projectData.projectInfo.startDate && projectData.projectInfo.endDate) {
            const start = new Date(projectData.projectInfo.startDate);
            const end = new Date(projectData.projectInfo.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.round(diffDays / 30.44);
            summaryDurationEl.textContent = `${diffDays} days (≈${diffMonths} months)`;
        } else if (summaryDurationEl) {
            summaryDurationEl.textContent = 'Not specified';
        }
        
        // Update resource counts
        const resourceCountsElements = {
            summaryInternalResourceCount: projectData.internalResources.length,
            summaryVendorCount: projectData.vendorCosts.length,
            summaryToolCount: projectData.toolCosts.length,
            summaryRiskCount: projectData.risks.length
        };
        
        Object.keys(resourceCountsElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = resourceCountsElements[id];
            }
        });
        
    } catch (error) {
        console.error('Error in updateSummaryProjectInfo:', error);
    }
}

// Global function for delete buttons
window.deleteItem = deleteItem;
