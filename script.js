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

// NEW: Fix the forecast table headers to be dynamic instead of hardcoded
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

// NEW: Fix table headers in Internal Resources to use dynamic month names
function updateInternalResourcesHeaders() {
    const months = calculateProjectMonths();
    
    // Update the headers to show actual month names instead of hardcoded labels
    const headers = document.querySelectorAll('#internal-resources table thead th');
    if (headers.length >= 7) {
        // Headers 3, 4, 5, 6 are the month columns
        for (let i = 0; i < 4; i++) {
            const headerIndex = i + 3; // Start from 4th column (index 3)
            if (headers[headerIndex] && months[i]) {
                headers[headerIndex].textContent = `${months[i]} Days`;
            }
        }
    }
}

// NEW: Fix table headers in Vendor Costs to use dynamic month names
function updateVendorCostsHeaders() {
    const months = calculateProjectMonths();
    
    // Update the headers to show actual month names instead of hardcoded labels
    const headers = document.querySelectorAll('#vendor-costs table thead th');
    if (headers.length >= 8) {
        // Headers 3, 4, 5, 6 are the month columns
        for (let i = 0; i < 4; i++) {
            const headerIndex = i + 3; // Start from 4th column (index 3)
            if (headers[headerIndex] && months[i]) {
                headers[headerIndex].textContent = `${months[i]} Cost`;
            }
        }
    }
}

// ENHANCED: Update all month headers to cover all tables
function updateMonthHeaders() {
    const months = calculateProjectMonths();
    
    // Update forecast table headers (6 months shown)
    updateForecastTableHeaders();
    
    // Update internal resources headers (4 months shown)
    updateInternalResourcesHeaders();
    
    // Update vendor costs headers (4 months shown)
    updateVendorCostsHeaders();
    
    // Update existing month headers for compatibility
    for (let i = 1; i <= 6; i++) {
        const header = document.getElementById(`month${i}Header`);
        if (header && months[i-1]) {
            header.textContent = months[i-1];
        }
    }
    
    // Update internal resources headers (4 months shown) - legacy support
    for (let i = 1; i <= 4; i++) {
        const header = document.getElementById(`month${i}DaysHeader`);
        if (header && months[i-1]) {
            header.textContent = `${months[i-1]} Days`;
        }
    }
    
    // Update vendor costs headers (4 months shown) - legacy support
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
                updateSummary();
            });
        }
        
        if (startDateEl) {
            startDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.startDate = e.target.value;
                updateMonthHeaders();
                updateSummary();
            });
        }
        
        if (endDateEl) {
            endDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.endDate = e.target.value;
                updateMonthHeaders();
                updateSummary();
            });
        }
        
        if (projectManagerEl) {
            projectManagerEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectManager = e.target.value;
                updateSummary();
            });
        }
        
        if (projectDescriptionEl) {
            projectDescriptionEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectDescription = e.target.value;
                updateSummary();
            });
        }

        // Contingency percentage
        if (contingencyPercentageEl) {
            contingencyPercentageEl.addEventListener('input', (e) => {
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
            { id: 'addInternalRate', type: 'rateCard', title: 'Add Rate Card' },
            { id: 'addExternalRate', type: 'rateCard', title: 'Add Rate Card' },
            { id: 'addRate', type: 'rateCard', title: 'Add Rate Card' }
        ];

        addButtons.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element) {
                element.addEventListener('click', () => {
                    openModal(btn.title, btn.type);
                });
            }
        });

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

        // Save/Load buttons - Updated to include download and new project functionality
        const saveBtn = document.getElementById('saveBtn');
        const loadBtn = document.getElementById('loadBtn');
        const exportBtn = document.getElementById('exportBtn');
        const newProjectBtn = document.getElementById('newProjectBtn');
        
        if (saveBtn) saveBtn.addEventListener('click', saveProject);
        if (loadBtn) loadBtn.addEventListener('click', loadProject);
        if (exportBtn) exportBtn.addEventListener('click', exportToExcel);
        if (newProjectBtn) newProjectBtn.addEventListener('click', newProject);
        
        // Add download project functionality if button exists
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadProject);
        }

        // Add print button functionality if it exists
        const printBtn = document.getElementById('printBtn');
        if (printBtn) {
            printBtn.addEventListener('click', printReport);
        }

        // Modal form submission
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submit event triggered');
                handleModalSubmit();
            });
        }
        
        // Also add click listener to the modal save button as backup
        const modalSaveBtn = document.querySelector('.modal-actions .btn-primary');
        if (modalSaveBtn) {
            modalSaveBtn.addEventListener('click', (e) => {
                if (e.target.type === 'submit') {
                    return;
                }
                e.preventDefault();
                console.log('Modal save button clicked');
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
                    ${projectData.rateCards.map(rate => `<option value="${rate.role}" data-category="${rate.category}">${rate.role} (${rate.category})</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>${months[0] || 'Month 1'} Days:</label>
                <input type="number" name="month1Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>${months[1] || 'Month 2'} Days:</label>
                <input type="number" name="month2Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>${months[2] || 'Month 3'} Days:</label>
                <input type="number" name="month3Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>${months[3] || 'Month 4'} Days:</label>
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
                <label>${months[0] || 'Month 1'} Cost:</label>
                <input type="number" name="month1Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>${months[1] || 'Month 2'} Cost:</label>
                <input type="number" name="month2Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>${months[2] || 'Month 3'} Cost:</label>
                <input type="number" name="month3Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>${months[3] || 'Month 4'} Cost:</label>
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
                renderUnifiedRateCardsTable();
                break;
        }
        
        updateSummary();
        renderForecastTable(); // Make sure forecast table is updated
        modal.style.display = 'none';
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
            <td>$${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('rateCards', ${rate.id || '\\'' + rate.role + '\\''})">Delete</button>
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
                <button class="btn btn-danger btn-small" onclick="deleteItem('risks', ${risk.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderInternalRatesTable() {
    const tbody = document.getElementById('internalRatesTable');
    console.log('renderInternalRatesTable - tbody element:', tbody);
    
    if (!tbody) {
        console.log('Internal rates table not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    // Show internal rates from unified rateCards
    const internalRates = projectData.rateCards.filter(rate => rate.category === 'Internal');
    console.log('Internal rates to render:', internalRates);
    
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
    console.log('Internal rates table rendered successfully');
}

function renderExternalRatesTable() {
    const tbody = document.getElementById('externalRatesTable');
    console.log('renderExternalRatesTable - tbody element:', tbody);
    
    if (!tbody) {
        console.log('External rates table not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    // Show external rates from unified rateCards
    const externalRates = projectData.rateCards.filter(rate => rate.category === 'External');
    console.log('External rates to render:', externalRates);
    
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
    console.log('External rates table rendered successfully');
}

// ENHANCED: renderForecastTable to show 6 months as per HTML structure
function renderForecastTable() {
    const tbody = document.getElementById('forecastTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Calculate monthly totals for 6 months
    const months = calculateProjectMonths();
    
    // Internal Resources - extend to 6 months
    const internalMonthly = [0, 0, 0, 0, 0, 0];
    projectData.internalResources.forEach(resource => {
        internalMonthly[0] += (resource.month1Days || 0) * resource.dailyRate;
        internalMonthly[1] += (resource.month2Days || 0) * resource.dailyRate;
        internalMonthly[2] += (resource.month3Days || 0) * resource.dailyRate;
        internalMonthly[3] += (resource.month4Days || 0) * resource.dailyRate;
        // Months 5 and 6 would be 0 unless we extend the data model
    });
    
    // Vendor Costs - extend to 6 months
    const vendorMonthly = [0, 0, 0, 0, 0, 0];
    projectData.vendorCosts.forEach(vendor => {
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
        if (contingencyAmountEl) contingencyAmountEl.textContent = `${contingency.toLocaleString()}`;
        
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

        // Update project info in summary if elements exist
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

// NEW: Print functionality
function printReport() {
    try {
        const printWindow = window.open('', '_blank');
        const printContent = generatePrintContent();
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>ICT Project Cost Estimate - ${projectData.projectInfo.projectName || 'Project'}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1, h2, h3 { color: #2c3e50; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .summary-section { background-color: #f8f9fa; padding: 15px; margin: 20px 0; }
                    .total-cost { font-size: 1.2em; font-weight: bold; color: #28a745; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                ${printContent}
                <div class="no-print" style="margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer;">Print</button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; cursor: pointer; margin-left: 10px;">Close</button>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
    } catch (error) {
        console.error('Error generating print report:', error);
        showAlert('Error generating print report: ' + error.message, 'error');
    }
}

// NEW: Generate print content
function generatePrintContent() {
    const months = calculateProjectMonths();
    
    let content = `
        <h1>ICT Project Cost Estimate</h1>
        <div class="summary-section">
            <h2>Project Information</h2>
            <p><strong>Project Name:</strong> ${projectData.projectInfo.projectName || 'Not specified'}</p>
            <p><strong>Start Date:</strong> ${projectData.projectInfo.startDate || 'Not specified'}</p>
            <p><strong>End Date:</strong> ${projectData.projectInfo.endDate || 'Not specified'}</p>
            <p><strong>Project Manager:</strong> ${projectData.projectInfo.projectManager || 'Not specified'}</p>
            <p><strong>Description:</strong> ${projectData.projectInfo.projectDescription || 'Not specified'}</p>
        </div>
    `;

    // Rate Cards
    if (projectData.rateCards && projectData.rateCards.length > 0) {
        content += `
            <h2>Rate Cards</h2>
            <table>
                <thead>
                    <tr><th>Role</th><th>Category</th><th>Daily Rate</th></tr>
                </thead>
                <tbody>
        `;
        projectData.rateCards.forEach(rate => {
            content += `<tr><td>${rate.role}</td><td>${rate.category}</td><td>${rate.rate.toLocaleString()}</td></tr>`;
        });
        content += `</tbody></table>`;
    }

    // Internal Resources
    if (projectData.internalResources.length > 0) {
        content += `
            <h2>Internal Resources</h2>
            <table>
                <thead>
                    <tr><th>Role</th><th>Rate Card</th><th>Daily Rate</th><th>${months[0]} Days</th><th>${months[1]} Days</th><th>${months[2]} Days</th><th>${months[3]} Days</th><th>Total Cost</th></tr>
                </thead>
                <tbody>
        `;
        projectData.internalResources.forEach(resource => {
            const month1Days = resource.month1Days || 0;
            const month2Days = resource.month2Days || 0;
            const month3Days = resource.month3Days || 0;
            const month4Days = resource.month4Days || 0;
            const totalCost = (month1Days + month2Days + month3Days + month4Days) * resource.dailyRate;
            content += `<tr><td>${resource.role}</td><td>${resource.rateCard}</td><td>${resource.dailyRate.toLocaleString()}</td><td>${month1Days}</td><td>${month2Days}</td><td>${month3Days}</td><td>${month4Days}</td><td>${totalCost.toLocaleString()}</td></tr>`;
        });
        content += `</tbody></table>`;
    }

    // Vendor Costs
    if (projectData.vendorCosts.length > 0) {
        content += `
            <h2>Vendor Costs</h2>
            <table>
                <thead>
                    <tr><th>Vendor</th><th>Description</th><th>Category</th><th>${months[0]} Cost</th><th>${months[1]} Cost</th><th>${months[2]} Cost</th><th>${months[3]} Cost</th><th>Total Cost</th></tr>
                </thead>
                <tbody>
        `;
        projectData.vendorCosts.forEach(vendor => {
            const month1Cost = vendor.month1Cost || 0;
            const month2Cost = vendor.month2Cost || 0;
            const month3Cost = vendor.month3Cost || 0;
            const month4Cost = vendor.month4Cost || 0;
            const totalCost = month1Cost + month2Cost + month3Cost + month4Cost;
            content += `<tr><td>${vendor.vendor}</td><td>${vendor.description}</td><td>${vendor.category}</td><td>${month1Cost.toLocaleString()}</td><td>${month2Cost.toLocaleString()}</td><td>${month3Cost.toLocaleString()}</td><td>${month4Cost.toLocaleString()}</td><td>${totalCost.toLocaleString()}</td></tr>`;
        });
        content += `</tbody></table>`;
    }

    // Tool Costs
    if (projectData.toolCosts.length > 0) {
        content += `
            <h2>Tool Costs</h2>
            <table>
                <thead>
                    <tr><th>Tool/Software</th><th>License Type</th><th>Users/Licenses</th><th>Monthly Cost</th><th>Duration (Months)</th><th>Total Cost</th></tr>
                </thead>
                <tbody>
        `;
        projectData.toolCosts.forEach(tool => {
            const totalCost = tool.users * tool.monthlyCost * tool.duration;
            content += `<tr><td>${tool.tool}</td><td>${tool.licenseType}</td><td>${tool.users}</td><td>${tool.monthlyCost.toLocaleString()}</td><td>${tool.duration}</td><td>${totalCost.toLocaleString()}</td></tr>`;
        });
        content += `</tbody></table>`;
    }

    // Summary
    const internalTotal = calculateInternalResourcesTotal();
    const vendorTotal = calculateVendorCostsTotal();
    const toolTotal = calculateToolCostsTotal();
    const miscTotal = calculateMiscCostsTotal();
    const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
    const contingency = subtotal * (projectData.contingencyPercentage / 100);
    const total = subtotal + contingency;

    content += `
        <div class="summary-section">
            <h2>Project Summary</h2>
            <table>
                <tr><td>Internal Resources</td><td>${internalTotal.toLocaleString()}</td></tr>
                <tr><td>Vendor Costs</td><td>${vendorTotal.toLocaleString()}</td></tr>
                <tr><td>Tool Costs</td><td>${toolTotal.toLocaleString()}</td></tr>
                <tr><td>Miscellaneous</td><td>${miscTotal.toLocaleString()}</td></tr>
                <tr><td><strong>Subtotal</strong></td><td><strong>${subtotal.toLocaleString()}</strong></td></tr>
                <tr><td>Contingency (${projectData.contingencyPercentage}%)</td><td>${contingency.toLocaleString()}</td></tr>
                <tr><td class="total-cost">Total Project Cost</td><td class="total-cost">${total.toLocaleString()}</td></tr>
            </table>
        </div>
    `;

    return content;
}

// Data Management
function loadDefaultData() {
    try {
        // Only try to load from localStorage if it's available
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
            showAlert('Project saved to browser storage successfully!', 'success');
        } else {
            showAlert('Local storage not available. Cannot save project.', 'error');
        }
    } catch (e) {
        console.error('Error saving project:', e);
        showAlert('Error saving project: ' + e.message, 'error');
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
        showAlert('Project file downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error downloading project:', error);
        showAlert('Error downloading project file: ' + error.message, 'error');
    }
}

// NEW: New Project functionality
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
            const formFields = ['projectName', 'startDate', 'endDate', 'projectManager', 'projectDescription'];
            formFields.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.value = '';
            });
            
            const contingencyEl = document.getElementById('contingencyPercentage');
            if (contingencyEl) contingencyEl.value = '10';
            
            // Clear localStorage
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.removeItem('ictProjectData');
            }
            
            // Re-render all tables and summaries
            renderAllTables();
            updateSummary();
            updateMonthHeaders();
            
            // Switch to project info tab
            switchTab('project-info');
            
            showAlert('New project started successfully! Please enter your project information.', 'success');
            
        } catch (error) {
            console.error('Error creating new project:', error);
            showAlert('Error creating new project: ' + error.message, 'error');
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
        showAlert('Export completed successfully!', 'success');
    } catch (error) {
        console.error('Error exporting:', error);
        showAlert('Error exporting project: ' + error.message, 'error');
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

function showAlert(message, type) {
    try {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Insert at top of content
        const content = document.querySelector('.content');
        if (content) {
            content.insertBefore(alert, content.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        } else {
            // Fallback to console if content area not found
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    } catch (error) {
        console.error('Error showing alert:', error);
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// NEW: Function to update project info in summary tab (if elements exist)
function updateSummaryProjectInfo() {
    try {
        console.log('Updating summary project info...');
        
        // Update project info in summary tab if elements exist
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
        
        // Update resource counts if elements exist
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

// Export functions for global access
window.printReport = printReport;
window.newProject = newProject;
window.updateMonthHeaders = updateMonthHeaders;
window.renderForecastTable = renderForecastTable;
