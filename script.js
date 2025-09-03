// Complete ICT Project Cost Estimation Tool - Standalone Version
// All functionality in one file, no external dependencies
// ============================================================================

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

// DOM Elements Cache
let domElements = {};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('=== Initializing ICT Cost Estimation App ===');
        
        // Initialize DOM elements
        initializeDOMElements();
        
        // Initialize navigation
        initializeTabs();
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Load saved data
        loadDefaultData();
        
        // Render all tables
        renderAllTables();
        
        // Update summaries
        updateSummary();
        
        // Update month headers
        updateMonthHeaders();
        
        console.log('=== Application initialized successfully ===');
    } catch (error) {
        console.error('Error initializing application:', error);
        showAlert('Error initializing application. Please refresh the page.', 'error');
    }
});

// ============================================================================
// DOM MANAGEMENT
// ============================================================================

function initializeDOMElements() {
    domElements = {
        // Navigation elements
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),

        // Modal elements
        modal: document.getElementById('modal'),
        modalContent: document.querySelector('.modal-content'),
        modalTitle: document.getElementById('modalTitle'),
        modalForm: document.getElementById('modalForm'),
        modalFields: document.getElementById('modalFields'),
        closeModal: document.querySelector('.close'),
        cancelModal: document.getElementById('cancelModal'),

        // Form elements
        projectName: document.getElementById('projectName'),
        startDate: document.getElementById('startDate'),
        endDate: document.getElementById('endDate'),
        projectManager: document.getElementById('projectManager'),
        projectDescription: document.getElementById('projectDescription'),
        contingencyPercentage: document.getElementById('contingencyPercentage'),

        // Summary display elements
        totalProjectCost: document.getElementById('totalProjectCost'),
        totalInternalCost: document.getElementById('totalInternalCost'),
        totalExternalCost: document.getElementById('totalExternalCost'),
        contingencyAmount: document.getElementById('contingencyAmount'),

        // Summary tab elements
        summaryInternalCost: document.getElementById('summaryInternalCost'),
        summaryVendorCost: document.getElementById('summaryVendorCost'),
        summaryToolCost: document.getElementById('summaryToolCost'),
        summaryMiscCost: document.getElementById('summaryMiscCost'),
        summarySubtotal: document.getElementById('summarySubtotal'),
        summaryContingency: document.getElementById('summaryContingency'),
        summaryTotal: document.getElementById('summaryTotal'),

        // Table body elements
        internalResourcesTable: document.getElementById('internalResourcesTable'),
        vendorCostsTable: document.getElementById('vendorCostsTable'),
        toolCostsTable: document.getElementById('toolCostsTable'),
        miscCostsTable: document.getElementById('miscCostsTable'),
        risksTable: document.getElementById('risksTable'),
        internalRatesTable: document.getElementById('internalRatesTable'),
        externalRatesTable: document.getElementById('externalRatesTable'),
        rateCardsTable: document.getElementById('rateCardsTable'),
        forecastTable: document.getElementById('forecastTable'),

        // Content area
        content: document.querySelector('.content')
    };

    console.log('DOM elements initialized');
}

// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================

function initializeTabs() {
    if (!domElements.tabButtons || domElements.tabButtons.length === 0) {
        console.error('No tab buttons found');
        return;
    }

    // Bind tab navigation events
    domElements.tabButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = button.getAttribute('data-tab');
            if (targetTab) {
                switchTab(targetTab);
            }
        });
    });

    // Set initial active tab
    switchTab('project-info');
    
    console.log('Navigation initialized successfully');
}

function switchTab(targetTab) {
    try {
        console.log('Switching to tab: ' + targetTab);

        // Update active tab button
        domElements.tabButtons.forEach(function(btn) {
            btn.classList.remove('active');
        });
        const targetButton = document.querySelector('[data-tab="' + targetTab + '"]');
        if (targetButton) {
            targetButton.classList.add('active');
        }

        // Update active tab content
        domElements.tabContents.forEach(function(content) {
            content.classList.remove('active');
        });
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Handle tab-specific actions
        handleTabSpecificActions(targetTab);

        return true;
    } catch (error) {
        console.error('Error switching tabs:', error);
        return false;
    }
}

function handleTabSpecificActions(targetTab) {
    try {
        switch (targetTab) {
            case 'summary':
                updateSummary();
                updateSummaryProjectInfo();
                break;
            case 'resource-plan':
                renderForecastTable();
                updateSummary();
                break;
            case 'rate-cards':
                renderUnifiedRateCardsTable();
                renderInternalRatesTable();
                renderExternalRatesTable();
                break;
            default:
                // No specific action needed
                break;
        }
    } catch (error) {
        console.error('Error in tab-specific actions for ' + targetTab + ':', error);
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function initializeEventListeners() {
    try {
        // Project Info Form
        if (domElements.projectName) {
            domElements.projectName.addEventListener('input', function(e) {
                projectData.projectInfo.projectName = e.target.value;
                updateSummary();
            });
        }
        
        if (domElements.startDate) {
            domElements.startDate.addEventListener('input', function(e) {
                projectData.projectInfo.startDate = e.target.value;
                updateMonthHeaders();
                updateSummary();
            });
        }
        
        if (domElements.endDate) {
            domElements.endDate.addEventListener('input', function(e) {
                projectData.projectInfo.endDate = e.target.value;
                updateMonthHeaders();
                updateSummary();
            });
        }
        
        if (domElements.projectManager) {
            domElements.projectManager.addEventListener('input', function(e) {
                projectData.projectInfo.projectManager = e.target.value;
                updateSummary();
            });
        }
        
        if (domElements.projectDescription) {
            domElements.projectDescription.addEventListener('input', function(e) {
                projectData.projectInfo.projectDescription = e.target.value;
                updateSummary();
            });
        }

        // Contingency percentage
        if (domElements.contingencyPercentage) {
            domElements.contingencyPercentage.addEventListener('input', function(e) {
                projectData.contingencyPercentage = parseFloat(e.target.value) || 0;
                updateSummary();
            });
        }

        // Add buttons
        const addButtons = [
            { id: 'addInternalResource', type: 'internalResource', title: 'Add Internal Resource' },
            { id: 'addVendorCost', type: 'vendorCost', title: 'Add Vendor Cost' },
            { id: 'addToolCost', type: 'toolCost', title: 'Add Tool Cost' },
            { id: 'addMiscCost', type: 'miscCost', title: 'Add Miscellaneous Cost' },
            { id: 'addRisk', type: 'risk', title: 'Add Risk' },
            { id: 'addInternalRate', type: 'rateCard', title: 'Add Internal Rate' },
            { id: 'addExternalRate', type: 'rateCard', title: 'Add External Rate' },
            { id: 'addRate', type: 'rateCard', title: 'Add Rate Card' }
        ];

        addButtons.forEach(function(btn) {
            const element = document.getElementById(btn.id);
            if (element) {
                element.addEventListener('click', function() {
                    openModal(btn.title, btn.type);
                });
            }
        });

        // Modal events
        if (domElements.closeModal) {
            domElements.closeModal.addEventListener('click', function() {
                domElements.modal.style.display = 'none';
            });
        }
        
        if (domElements.cancelModal) {
            domElements.cancelModal.addEventListener('click', function() {
                domElements.modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', function(e) {
            if (e.target === domElements.modal) {
                domElements.modal.style.display = 'none';
            }
        });

        // Save/Load buttons
        const saveBtn = document.getElementById('saveBtn');
        const loadBtn = document.getElementById('loadBtn');
        const exportBtn = document.getElementById('exportBtn');
        const newProjectBtn = document.getElementById('newProjectBtn');
        const printBtn = document.getElementById('printBtn');
        
        if (saveBtn) saveBtn.addEventListener('click', saveProject);
        if (loadBtn) loadBtn.addEventListener('click', loadProject);
        if (exportBtn) exportBtn.addEventListener('click', exportToExcel);
        if (newProjectBtn) newProjectBtn.addEventListener('click', newProject);
        if (printBtn) printBtn.addEventListener('click', printReport);

        // Modal form submission
        if (domElements.modalForm) {
            domElements.modalForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleModalSubmit();
            });
        }
        
        console.log('Event listeners initialized');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// ============================================================================
// MONTH CALCULATION AND HEADERS
// ============================================================================

function calculateProjectMonths() {
    const startDate = projectData.projectInfo.startDate;
    
    if (!startDate) {
        return ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
    }
    
    const start = new Date(startDate);
    const months = [];
    const current = new Date(start);
    
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
    const headers = document.querySelectorAll('#resource-plan table thead th');
    if (headers.length > 0) {
        for (let i = 1; i <= 6 && i < headers.length - 1; i++) {
            if (headers[i] && months[i-1]) {
                headers[i].textContent = months[i-1];
            }
        }
    }
}

function updateInternalResourcesHeaders() {
    const months = calculateProjectMonths();
    const headers = document.querySelectorAll('#internal-resources table thead th');
    if (headers.length >= 7) {
        for (let i = 0; i < 4; i++) {
            const headerIndex = i + 3;
            if (headers[headerIndex] && months[i]) {
                headers[headerIndex].textContent = months[i] + ' Days';
            }
        }
    }
}

function updateVendorCostsHeaders() {
    const months = calculateProjectMonths();
    const headers = document.querySelectorAll('#vendor-costs table thead th');
    if (headers.length >= 8) {
        for (let i = 0; i < 4; i++) {
            const headerIndex = i + 3;
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
        if (!domElements.modal || !domElements.modalTitle || !domElements.modalFields || !domElements.modalForm) {
            console.error('Modal elements not found');
            return;
        }
        
        domElements.modalTitle.textContent = title;
        domElements.modalFields.innerHTML = getModalFields(type);
        domElements.modal.style.display = 'block';
        domElements.modalForm.setAttribute('data-type', type);
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

function getModalFields(type) {
    const months = calculateProjectMonths();
    
    const fields = {
        internalResource: '<div class="form-group"><label>Role:</label><select name="role" class="form-control" required>' + 
            projectData.rateCards.map(function(rate) {
                return '<option value="' + rate.role + '" data-category="' + rate.category + '">' + rate.role + ' (' + rate.category + ')</option>';
            }).join('') +
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
        const formData = new FormData(domElements.modalForm);
        const type = domElements.modalForm.getAttribute('data-type');
        const data = {};
        
        for (let pair of formData.entries()) {
            data[pair[0]] = pair[1];
        }
        
        console.log('Modal submit - Type:', type);
        console.log('Modal submit - Data:', data);
        
        switch(type) {
            case 'internalResource':
                const rate = projectData.rateCards.find(function(r) { return r.role === data.role; });
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
                const newRateCard = {
                    id: Date.now(),
                    role: data.role,
                    rate: parseFloat(data.rate),
                    category: data.category
                };
                projectData.rateCards.push(newRateCard);
                
                // Update legacy arrays for backward compatibility
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
                
                renderUnifiedRateCardsTable();
                renderInternalRatesTable();
                renderExternalRatesTable();
                break;
        }
        
        updateSummary();
        renderForecastTable();
        domElements.modal.style.display = 'none';
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
    const tbody = domElements.internalResourcesTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.internalResources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No internal resources added yet</td></tr>';
        return;
    }
    
    projectData.internalResources.forEach(function(resource) {
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
    const tbody = domElements.vendorCostsTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.vendorCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No vendor costs added yet</td></tr>';
        return;
    }
    
    projectData.vendorCosts.forEach(function(vendor) {
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
    const tbody = domElements.toolCostsTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.toolCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No tool costs added yet</td></tr>';
        return;
    }
    
    projectData.toolCosts.forEach(function(tool) {
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
    const tbody = domElements.miscCostsTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.miscCosts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No miscellaneous costs added yet</td></tr>';
        return;
    }
    
    projectData.miscCosts.forEach(function(misc) {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + misc.item + '</td>' +
            '<td>' + misc.description + '</td>' +
            '<td>' + misc.category + '</td>' +
            '<td> + misc.cost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'miscCosts\', ' + misc.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderRisksTable() {
    const tbody = domElements.risksTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.risks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No risks added yet</td></tr>';
        return;
    }
    
    projectData.risks.forEach(function(risk) {
        const riskScore = risk.probability * risk.impact;
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + risk.description + '</td>' +
            '<td>' + risk.probability + '</td>' +
            '<td>' + risk.impact + '</td>' +
            '<td>' + riskScore + '</td>' +
            '<td> + risk.mitigationCost.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'risks\', ' + risk.id + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderInternalRatesTable() {
    const tbody = domElements.internalRatesTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const internalRates = projectData.rateCards.filter(function(rate) { return rate.category === 'Internal'; });
    
    if (internalRates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No internal rates added yet</td></tr>';
        return;
    }
    
    internalRates.forEach(function(rate) {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + rate.role + '</td>' +
            '<td> + rate.rate.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'rateCards\', ' + (rate.id || '\'' + rate.role + '\'') + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderExternalRatesTable() {
    const tbody = domElements.externalRatesTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const externalRates = projectData.rateCards.filter(function(rate) { return rate.category === 'External'; });
    
    if (externalRates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-state">No external rates added yet</td></tr>';
        return;
    }
    
    externalRates.forEach(function(rate) {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + rate.role + '</td>' +
            '<td> + rate.rate.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'rateCards\', ' + (rate.id || '\'' + rate.role + '\'') + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderUnifiedRateCardsTable() {
    const tbody = domElements.rateCardsTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.rateCards.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No rate cards added yet</td></tr>';
        return;
    }
    
    const sortedRates = projectData.rateCards.slice().sort(function(a, b) {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.role.localeCompare(b.role);
    });
    
    sortedRates.forEach(function(rate) {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + rate.role + '</td>' +
            '<td><span class="category-badge category-' + rate.category.toLowerCase() + '">' + rate.category + '</span></td>' +
            '<td> + rate.rate.toLocaleString() + '</td>' +
            '<td><button class="btn btn-danger btn-small" onclick="deleteItem(\'rateCards\', ' + (rate.id || '\'' + rate.role + '\'') + ')">Delete</button></td>';
        tbody.appendChild(row);
    });
}

function renderForecastTable() {
    const tbody = domElements.forecastTable;
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const internalMonthly = [0, 0, 0, 0, 0, 0];
    const vendorMonthly = [0, 0, 0, 0, 0, 0];
    
    projectData.internalResources.forEach(function(resource) {
        internalMonthly[0] += (resource.month1Days || 0) * resource.dailyRate;
        internalMonthly[1] += (resource.month2Days || 0) * resource.dailyRate;
        internalMonthly[2] += (resource.month3Days || 0) * resource.dailyRate;
        internalMonthly[3] += (resource.month4Days || 0) * resource.dailyRate;
    });
    
    projectData.vendorCosts.forEach(function(vendor) {
        vendorMonthly[0] += vendor.month1Cost || 0;
        vendorMonthly[1] += vendor.month2Cost || 0;
        vendorMonthly[2] += vendor.month3Cost || 0;
        vendorMonthly[3] += vendor.month4Cost || 0;
    });
    
    const internalTotal = internalMonthly.reduce(function(sum, val) { return sum + val; }, 0);
    const vendorTotal = vendorMonthly.reduce(function(sum, val) { return sum + val; }, 0);
    
    tbody.innerHTML = '<tr><td><strong>Internal Resources</strong></td>' +
        '<td> + internalMonthly[0].toLocaleString() + '</td>' +
        '<td> + internalMonthly[1].toLocaleString() + '</td>' +
        '<td> + internalMonthly[2].toLocaleString() + '</td>' +
        '<td> + internalMonthly[3].toLocaleString() + '</td>' +
        '<td> + internalMonthly[4].toLocaleString() + '</td>' +
        '<td> + internalMonthly[5].toLocaleString() + '</td>' +
        '<td><strong> + internalTotal.toLocaleString() + '</strong></td></tr>' +
        '<tr><td><strong>Vendor Costs</strong></td>' +
        '<td> + vendorMonthly[0].toLocaleString() + '</td>' +
        '<td> + vendorMonthly[1].toLocaleString() + '</td>' +
        '<td> + vendorMonthly[2].toLocaleString() + '</td>' +
        '<td> + vendorMonthly[3].toLocaleString() + '</td>' +
        '<td> + vendorMonthly[4].toLocaleString() + '</td>' +
        '<td> + vendorMonthly[5].toLocaleString() + '</td>' +
        '<td><strong> + vendorTotal.toLocaleString() + '</strong></td></tr>';
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

function calculateInternalResourcesTotal() {
    return projectData.internalResources.reduce(function(total, resource) {
        const month1Days = resource.month1Days || 0;
        const month2Days = resource.month2Days || 0;
        const month3Days = resource.month3Days || 0;
        const month4Days = resource.month4Days || 0;
        return total + ((month1Days + month2Days + month3Days + month4Days) * resource.dailyRate);
    }, 0);
}

function calculateVendorCostsTotal() {
    return projectData.vendorCosts.reduce(function(total, vendor) {
        const month1Cost = vendor.month1Cost || 0;
        const month2Cost = vendor.month2Cost || 0;
        const month3Cost = vendor.month3Cost || 0;
        const month4Cost = vendor.month4Cost || 0;
        return total + (month1Cost + month2Cost + month3Cost + month4Cost);
    }, 0);
}

function calculateToolCostsTotal() {
    return projectData.toolCosts.reduce(function(total, tool) {
        return total + (tool.users * tool.monthlyCost * tool.duration);
    }, 0);
}

function calculateMiscCostsTotal() {
    return projectData.miscCosts.reduce(function(total, misc) {
        return total + misc.cost;
    }, 0);
}

// ============================================================================
// SUMMARY UPDATE FUNCTIONS
// ============================================================================

function updateSummary() {
    try {
        const internalTotal = calculateInternalResourcesTotal();
        const vendorTotal = calculateVendorCostsTotal();
        const toolTotal = calculateToolCostsTotal();
        const miscTotal = calculateMiscCostsTotal();
        
        const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
        const contingency = subtotal * (projectData.contingencyPercentage / 100);
        const total = subtotal + contingency;
        
        // Update resource plan cards
        if (domElements.totalProjectCost) domElements.totalProjectCost.textContent = ' + total.toLocaleString();
        if (domElements.totalInternalCost) domElements.totalInternalCost.textContent = ' + internalTotal.toLocaleString();
        if (domElements.totalExternalCost) domElements.totalExternalCost.textContent = ' + (vendorTotal + toolTotal + miscTotal).toLocaleString();
        
        // Update contingency display
        if (domElements.contingencyAmount) domElements.contingencyAmount.textContent = ' + contingency.toLocaleString();
        
        // Update summary tab
        if (domElements.summaryInternalCost) domElements.summaryInternalCost.textContent = ' + internalTotal.toLocaleString();
        if (domElements.summaryVendorCost) domElements.summaryVendorCost.textContent = ' + vendorTotal.toLocaleString();
        if (domElements.summaryToolCost) domElements.summaryToolCost.textContent = ' + toolTotal.toLocaleString();
        if (domElements.summaryMiscCost) domElements.summaryMiscCost.textContent = ' + miscTotal.toLocaleString();
        if (domElements.summarySubtotal) domElements.summarySubtotal.textContent = ' + subtotal.toLocaleString();
        if (domElements.summaryContingency) domElements.summaryContingency.textContent = ' + contingency.toLocaleString();
        if (domElements.summaryTotal) domElements.summaryTotal.textContent = ' + total.toLocaleString();

        updateSummaryProjectInfo();
        
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

function updateSummaryProjectInfo() {
    try {
        const projectInfoElements = {
            summaryProjectName: projectData.projectInfo.projectName || 'Not specified',
            summaryStartDate: projectData.projectInfo.startDate || 'Not specified', 
            summaryEndDate: projectData.projectInfo.endDate || 'Not specified',
            summaryProjectManager: projectData.projectInfo.projectManager || 'Not specified',
            summaryProjectDescription: projectData.projectInfo.projectDescription || 'Not specified'
        };
        
        Object.keys(projectInfoElements).forEach(function(id) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = projectInfoElements[id];
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
        if (arrayName === 'rateCards' || arrayName === 'internalRates' || arrayName === 'externalRates') {
            projectData.rateCards = projectData.rateCards.filter(function(item) {
                return (item.id && item.id !== id) || (item.role !== id);
            });
            if (projectData.internalRates) {
                projectData.internalRates = projectData.internalRates.filter(function(item) {
                    return (item.id && item.id !== id) || (item.role !== id);
                });
            }
            if (projectData.externalRates) {
                projectData.externalRates = projectData.externalRates.filter(function(item) {
                    return (item.id && item.id !== id) || (item.role !== id);
                });
            }
        } else {
            projectData[arrayName] = projectData[arrayName].filter(function(item) {
                return item.id !== id;
            });
        }
        renderAllTables();
        updateSummary();
    }
}

// ============================================================================
// DATA MANAGEMENT FUNCTIONS
// ============================================================================

function saveProject() {
    try {
        if (typeof(Storage) !== "undefined" && localStorage) {
            localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            showAlert('Project saved successfully!', 'success');
        } else {
            showAlert('Local storage not available. Cannot save project.', 'error');
        }
    } catch (e) {
        console.error('Error saving project:', e);
        showAlert('Error saving project: ' + e.message, 'error');
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
                    projectData = Object.assign(projectData, data);
                    populateFormFields();
                    renderAllTables();
                    updateSummary();
                    updateMonthHeaders();
                    showAlert('Project loaded successfully!', 'success');
                } catch (err) {
                    console.error('Error loading project:', err);
                    showAlert('Error loading project file: ' + err.message, 'error');
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
            const formFields = ['projectName', 'startDate', 'endDate', 'projectManager', 'projectDescription'];
            formFields.forEach(function(fieldName) {
                const element = domElements[fieldName];
                if (element) element.value = '';
            });
            if (domElements.contingencyPercentage) domElements.contingencyPercentage.value = '10';
            
            // Clear localStorage
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.removeItem('ictProjectData');
            }
            
            renderAllTables();
            updateSummary();
            updateMonthHeaders();
            switchTab('project-info');
            
            showAlert('New project started successfully!', 'success');
            
        } catch (error) {
            console.error('Error creating new project:', error);
            showAlert('Error creating new project: ' + error.message, 'error');
        }
    }
}

function exportToExcel() {
    try {
        const csvContent = generateCSVExport();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'ICT_Cost_Estimate_' + (projectData.projectInfo.projectName || 'Project') + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showAlert('Export completed successfully!', 'success');
    } catch (error) {
        console.error('Error exporting:', error);
        showAlert('Error exporting project: ' + error.message, 'error');
    }
}

function generateCSVExport() {
    const months = calculateProjectMonths();
    let csv = 'ICT Project Cost Estimate Export\n\n';
    
    csv += 'PROJECT INFORMATION\n';
    csv += 'Project Name,"' + projectData.projectInfo.projectName + '"\n';
    csv += 'Start Date,"' + projectData.projectInfo.startDate + '"\n';
    csv += 'End Date,"' + projectData.projectInfo.endDate + '"\n';
    csv += 'Project Manager,"' + projectData.projectInfo.projectManager + '"\n';
    csv += 'Description,"' + projectData.projectInfo.projectDescription + '"\n\n';
    
    csv += 'RATE CARDS\n';
    csv += 'Role,Category,Daily Rate\n';
    projectData.rateCards.forEach(function(rate) {
        csv += '"' + rate.role + '","' + rate.category + '",' + rate.rate + '\n';
    });
    
    const internalTotal = calculateInternalResourcesTotal();
    const vendorTotal = calculateVendorCostsTotal();
    const toolTotal = calculateToolCostsTotal();
    const miscTotal = calculateMiscCostsTotal();
    const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
    const contingency = subtotal * (projectData.contingencyPercentage / 100);
    const total = subtotal + contingency;
    
    csv += '\nPROJECT SUMMARY\n';
    csv += 'Internal Resources,' + internalTotal + '\n';
    csv += 'Vendor Costs,' + vendorTotal + '\n';
    csv += 'Tool Costs,' + toolTotal + '\n';
    csv += 'Miscellaneous,' + miscTotal + '\n';
    csv += 'Subtotal,' + subtotal + '\n';
    csv += 'Contingency (' + projectData.contingencyPercentage + '%),' + contingency + '\n';
    csv += 'Total Project Cost,' + total + '\n';
    
    return csv;
}

function populateFormFields() {
    const formFields = {
        projectName: projectData.projectInfo.projectName || '',
        startDate: projectData.projectInfo.startDate || '',
        endDate: projectData.projectInfo.endDate || '',
        projectManager: projectData.projectInfo.projectManager || '',
        projectDescription: projectData.projectInfo.projectDescription || '',
        contingencyPercentage: projectData.contingencyPercentage || 10
    };
    
    Object.keys(formFields).forEach(function(fieldName) {
        const element = domElements[fieldName];
        if (element) {
            element.value = formFields[fieldName];
        }
    });
}

function loadDefaultData() {
    try {
        if (typeof(Storage) !== "undefined" && localStorage) {
            const savedData = localStorage.getItem('ictProjectData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                projectData = Object.assign(projectData, parsed);
                populateFormFields();
            }
        }
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
}

function printReport() {
    try {
        const printWindow = window.open('', '_blank');
        const printContent = generatePrintContent();
        
        printWindow.document.write('<!DOCTYPE html><html><head>' +
            '<title>ICT Project Cost Estimate - ' + (projectData.projectInfo.projectName || 'Project') + '</title>' +
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
            '<button onclick="window.print()">Print</button>' +
            '<button onclick="window.close()">Close</button>' +
            '</div></body></html>');
        
        printWindow.document.close();
        printWindow.focus();
    } catch (error) {
        console.error('Error generating print report:', error);
        showAlert('Error generating print report: ' + error.message, 'error');
    }
}

function generatePrintContent() {
    const internalTotal = calculateInternalResourcesTotal();
    const vendorTotal = calculateVendorCostsTotal();
    const toolTotal = calculateToolCostsTotal();
    const miscTotal = calculateMiscCostsTotal();
    const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
    const contingency = subtotal * (projectData.contingencyPercentage / 100);
    const total = subtotal + contingency;

    return '<h1>ICT Project Cost Estimate</h1>' +
        '<div class="summary-section">' +
        '<h2>Project Information</h2>' +
        '<p><strong>Project Name:</strong> ' + (projectData.projectInfo.projectName || 'Not specified') + '</p>' +
        '<p><strong>Start Date:</strong> ' + (projectData.projectInfo.startDate || 'Not specified') + '</p>' +
        '<p><strong>End Date:</strong> ' + (projectData.projectInfo.endDate || 'Not specified') + '</p>' +
        '<p><strong>Project Manager:</strong> ' + (projectData.projectInfo.projectManager || 'Not specified') + '</p>' +
        '<p><strong>Description:</strong> ' + (projectData.projectInfo.projectDescription || 'Not specified') + '</p>' +
        '</div>' +
        '<div class="summary-section">' +
        '<h2>Project Summary</h2>' +
        '<table>' +
        '<tr><td>Internal Resources</td><td> + internalTotal.toLocaleString() + '</td></tr>' +
        '<tr><td>Vendor Costs</td><td> + vendorTotal.toLocaleString() + '</td></tr>' +
        '<tr><td>Tool Costs</td><td> + toolTotal.toLocaleString() + '</td></tr>' +
        '<tr><td>Miscellaneous</td><td> + miscTotal.toLocaleString() + '</td></tr>' +
        '<tr><td><strong>Subtotal</strong></td><td><strong> + subtotal.toLocaleString() + '</strong></td></tr>' +
        '<tr><td>Contingency (' + projectData.contingencyPercentage + '%)</td><td> + contingency.toLocaleString() + '</td></tr>' +
        '<tr><td class="total-cost">Total Project Cost</td><td class="total-cost"> + total.toLocaleString() + '</td></tr>' +
        '</table></div>';
}

function showAlert(message, type) {
    try {
        const alert = document.createElement('div');
        alert.className = 'alert alert-' + type;
        alert.textContent = message;
        
        if (domElements.content) {
            domElements.content.insertBefore(alert, domElements.content.firstChild);
            setTimeout(function() {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        } else {
            console.log(type.toUpperCase() + ': ' + message);
        }
    } catch (error) {
        console.error('Error showing alert:', error);
        console.log(type.toUpperCase() + ': ' + message);
    }
}

// ============================================================================
// GLOBAL FUNCTION EXPORTS
// ============================================================================

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
