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
            <td><span class="category-badge category-${resource.rateCard.toLowerCase()}">${resource.rateCard}</span></td>
            <td>${resource.dailyRate.toLocaleString()}</td>
            <td>${month1Days}</td>
            <td>${month2Days}</td>
            <td>${month3Days}</td>
            <td>${month4Days}</td>
            <td>${totalCost.toLocaleString()}</td>
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
            <td>${month1Cost.toLocaleString()}</td>
            <td>${month2Cost.toLocaleString()}</td>
            <td>${month3Cost.toLocaleString()}</td>
            <td>${month4Cost.toLocaleString()}</td>
            <td>${totalCost.toLocaleString()}</td>
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
            <td>${tool.monthlyCost.toLocaleString()}</td>
            <td>${tool.duration}</td>
            <td>${totalCost.toLocaleString()}</td>
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
            <td>${misc.cost.toLocaleString()}</td>
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
            <td>${risk.mitigationCost.toLocaleString()}</td>
            <td>
                // Application State - Updated with unified rate cards
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
    // Keep old arrays for backward compatibility during transition
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

// Helper function to get rates by category
function getRatesByCategory(category) {
    return projectData.rateCards.filter(rate => rate.category === category);
}

// Helper function to get all available roles for dropdowns
function getAllRoles() {
    return projectData.rateCards.map(rate => ({
        role: rate.role,
        category: rate.category,
        rate: rate.rate
    }));
}

// DOM Elements
let tabButtons, tabContents, modal, modalContent, modalTitle, modalForm, modalFields, closeModal, cancelModal;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize DOM elements
        tabButtons = document.querySelectorAll('.tab-btn');
        tabContents = document.querySelectorAll('.tab-content');
        modal = document.getElementById('modal');
        modalContent = document.querySelector('.modal-content');
        modalTitle = document.getElementById('modalTitle');
        modalForm = document.getElementById('modalForm');
        modalFields = document.getElementById('modalFields');
        closeModal = document.querySelector('.close');
        cancelModal = document.getElementById('cancelModal');

        console.log('DOM elements initialized');
        
        initializeTabs();
        initializeEventListeners();
        loadDefaultData();
        renderAllTables();
        updateSummary();
        updateMonthHeaders();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error initializing application. Please check the console for details.');
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

// Update all month headers
function updateMonthHeaders() {
    const months = calculateProjectMonths();
    
    // Update forecast table headers (6 months shown)
    for (let i = 1; i <= 6; i++) {
        const header = document.getElementById(`month${i}Header`);
        if (header && months[i-1]) {
            header.textContent = months[i-1];
        }
    }
    
    // Update internal resources headers (4 months shown)
    for (let i = 1; i <= 4; i++) {
        const header = document.getElementById(`month${i}DaysHeader`);
        if (header && months[i-1]) {
            header.textContent = `${months[i-1]} Days`;
        }
    }
    
    // Update vendor costs headers (4 months shown)
    for (let i = 1; i <= 4; i++) {
        const header = document.getElementById(`month${i}CostHeader`);
        if (header && months[i-1]) {
            header.textContent = `${months[i-1]} Cost`;
        }
    }
}

// Tab Navigation
function initializeTabs() {
    if (!tabButtons) {
        console.error('Tab buttons not found');
        return;
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    try {
        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
        
        // Update active tab content
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Refresh data for specific tabs
        if (targetTab === 'summary') {
            updateSummary();
        }
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// Event Listeners
function initializeEventListeners() {
    try {
        // Project Info Form
        const projectNameEl = document.getElementById('projectName');
        const startDateEl = document.getElementById('startDate');
        const endDateEl = document.getElementById('endDate');
        const projectManagerEl = document.getElementById('projectManager');
        const projectDescriptionEl = document.getElementById('projectDescription');
        const contingencyPercentageEl = document.getElementById('contingencyPercentage');

        if (projectNameEl) {
            projectNameEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectName = e.target.value;
            });
        }
        
        if (startDateEl) {
            startDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.startDate = e.target.value;
                updateMonthHeaders();
            });
        }
        
        if (endDateEl) {
            endDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.endDate = e.target.value;
                updateMonthHeaders();
            });
        }
        
        if (projectManagerEl) {
            projectManagerEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectManager = e.target.value;
            });
        }
        
        if (projectDescriptionEl) {
            projectDescriptionEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectDescription = e.target.value;
            });
        }

        // Contingency percentage
        if (contingencyPercentageEl) {
            contingencyPercentageEl.addEventListener('input', (e) => {
                projectData.contingencyPercentage = parseFloat(e.target.value) || 0;
                updateSummary();
            });
        }

        // Add buttons - updated for unified rate cards
        const addButtons = [
            { id: 'addInternalResource', type: 'internalResource', title: 'Add Internal Resource' },
            { id: 'addVendorCost', type: 'vendorCost', title: 'Add Vendor Cost' },
            { id: 'addToolCost', type: 'toolCost', title: 'Add Tool Cost' },
            { id: 'addMiscCost', type: 'miscCost', title: 'Add Miscellaneous Cost' },
            { id: 'addRisk', type: 'risk', title: 'Add Risk' },
            { id: 'addRate', type: 'rateCard', title: 'Add Rate Card' } // Updated to single button
        ];

        addButtons.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element) {
                element.addEventListener('click', () => {
                    openModal(btn.title, btn.type);
                });
            }
        });

        // Handle legacy buttons if they still exist
        const addInternalRateBtn = document.getElementById('addInternalRate');
        const addExternalRateBtn = document.getElementById('addExternalRate');
        
        if (addInternalRateBtn) {
            addInternalRateBtn.addEventListener('click', () => {
                openModal('Add Rate Card', 'rateCard');
            });
        }
        
        if (addExternalRateBtn) {
            addExternalRateBtn.addEventListener('click', () => {
                openModal('Add Rate Card', 'rateCard');
            });
        }

        // Modal events
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (cancelModal) {
            cancelModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Save/Load buttons
        const saveBtn = document.getElementById('saveBtn');
        const loadBtn = document.getElementById('loadBtn');
        const exportBtn = document.getElementById('exportBtn');
        
        if (saveBtn) saveBtn.addEventListener('click', saveProject);
        if (loadBtn) loadBtn.addEventListener('click', loadProject);
        if (exportBtn) exportBtn.addEventListener('click', exportToExcel);

        // Modal form submission
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleModalSubmit();
            });
        }
        
        console.log('Event listeners initialized');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
}

// Modal Management
function openModal(title, type) {
    try {
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
        internalResource: `
            <div class="form-group">
                <label>Role:</label>
                <select name="role" class="form-control" required>
                    ${getAllRoles().map(rate => `<option value="${rate.role}" data-category="${rate.category}">${rate.role} (${rate.category})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>${months[0]} Days:</label>
                <input type="number" name="month1Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>${months[1]} Days:</label>
                <input type="number" name="month2Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>${months[2]} Days:</label>
                <input type="number" name="month3Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>${months[3]} Days:</label>
                <input type="number" name="month4Days" class="form-control" min="0" step="0.5" value="0">
            </div>
        `,
        vendorCost: `
            <div class="form-group">
                <label>Vendor:</label>
                <input type="text" name="vendor" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <input type="text" name="description" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="form-control" required>
                    <option value="Implementation">Implementation</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Training">Training</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>${months[0]} Cost:</label>
                <input type="number" name="month1Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>${months[1]} Cost:</label>
                <input type="number" name="month2Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>${months[2]} Cost:</label>
                <input type="number" name="month3Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>${months[3]} Cost:</label>
                <input type="number" name="month4Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
        `,
        toolCost: `
            <div class="form-group">
                <label>Tool/Software:</label>
                <input type="text" name="tool" class="form-control" required>
            </div>
            <div class="form-group">
                <label>License Type:</label>
                <select name="licenseType" class="form-control" required>
                    <option value="Per User">Per User</option>
                    <option value="Per Device">Per Device</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="One-time">One-time</option>
                </select>
            </div>
            <div class="form-group">
                <label>Users/Licenses:</label>
                <input type="number" name="users" class="form-control" min="1" required>
            </div>
            <div class="form-group">
                <label>Monthly Cost:</label>
                <input type="number" name="monthlyCost" class="form-control" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Duration (Months):</label>
                <input type="number" name="duration" class="form-control" min="1" required>
            </div>
        `,
        miscCost: `
            <div class="form-group">
                <label>Item:</label>
                <input type="text" name="item" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <input type="text" name="description" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="form-control" required>
                    <option value="Travel">Travel</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Training">Training</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cost:</label>
                <input type="number" name="cost" class="form-control" min="0" step="0.01" required>
            </div>
        `,
        risk: `
            <div class="form-group">
                <label>Risk Description:</label>
                <textarea name="description" class="form-control" required></textarea>
            </div>
            <div class="form-group">
                <label>Probability (1-5):</label>
                <input type="number" name="probability" class="form-control" min="1" max="5" required>
            </div>
            <div class="form-group">
                <label>Impact (1-5):</label>
                <input type="number" name="impact" class="form-control" min="1" max="5" required>
            </div>
            <div class="form-group">
                <label>Mitigation Cost:</label>
                <input type="number" name="mitigationCost" class="form-control" min="0" step="0.01" value="0">
            </div>
        `,
        // Updated unified rate card modal
        rateCard: `
            <div class="form-group">
                <label>Role:</label>
                <input type="text" name="role" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="form-control" required>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                </select>
            </div>
            <div class="form-group">
                <label>Daily Rate:</label>
                <input type="number" name="rate" class="form-control" min="0" step="0.01" required>
            </div>
        `
    };
    
    return fields[type] || '';
}

function handleModalSubmit() {
    try {
        const formData = new FormData(modalForm);
        const type = modalForm.getAttribute('data-type');
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
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
                // Add to unified rate cards
                projectData.rateCards.push({
                    id: Date.now(),
                    role: data.role,
                    rate: parseFloat(data.rate),
                    category: data.category
                });
                renderRateCardsTable();
                break;
        }
        
        updateSummary();
        modal.style.display = 'none';
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
        renderRateCardsTable(); // Updated to unified table
        renderForecastTable();
    } catch (error) {
        console.error('Error rendering tables:', error);
    }
}

// Updated unified rate cards table rendering
function renderRateCardsTable() {
    const tbody = document.getElementById('rateCardsTable') || 
                  document.getElementById('internalRatesTable') || 
                  document.getElementById('externalRatesTable');
    if (!tbody) return;
    
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
    
    sortedRates.forEach(rate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rate.role}</td>
            <td><span class="category-badge category-${rate.category.toLowerCase()}">${rate.category}</span></td>
            <td>$${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('rateCards', ${rate.id || `'${rate.role}'`})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
