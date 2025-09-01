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
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error initializing application. Please check the console for details.');
    }
});

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
            });
        }
        
        if (endDateEl) {
            endDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.endDate = e.target.value;
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

        // Add buttons
        const addButtons = [
            { id: 'addInternalResource', type: 'internalResource', title: 'Add Internal Resource' },
            { id: 'addVendorCost', type: 'vendorCost', title: 'Add Vendor Cost' },
            { id: 'addToolCost', type: 'toolCost', title: 'Add Tool Cost' },
            { id: 'addMiscCost', type: 'miscCost', title: 'Add Miscellaneous Cost' },
            { id: 'addRisk', type: 'risk', title: 'Add Risk' },
            { id: 'addInternalRate', type: 'internalRate', title: 'Add Internal Rate' },
            { id: 'addExternalRate', type: 'externalRate', title: 'Add External Rate' }
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
    const fields = {
        internalResource: `
            <div class="form-group">
                <label>Role:</label>
                <select name="role" class="form-control" required>
                    ${projectData.internalRates.map(rate => `<option value="${rate.role}">${rate.role}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Q1 Days:</label>
                <input type="number" name="q1Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>Q2 Days:</label>
                <input type="number" name="q2Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>Q3 Days:</label>
                <input type="number" name="q3Days" class="form-control" min="0" step="0.5" value="0">
            </div>
            <div class="form-group">
                <label>Q4 Days:</label>
                <input type="number" name="q4Days" class="form-control" min="0" step="0.5" value="0">
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
                <label>Q1 Cost:</label>
                <input type="number" name="q1Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>Q2 Cost:</label>
                <input type="number" name="q2Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>Q3 Cost:</label>
                <input type="number" name="q3Cost" class="form-control" min="0" step="0.01" value="0">
            </div>
            <div class="form-group">
                <label>Q4 Cost:</label>
                <input type="number" name="q4Cost" class="form-control" min="0" step="0.01" value="0">
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
        internalRate: `
            <div class="form-group">
                <label>Role:</label>
                <input type="text" name="role" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Daily Rate:</label>
                <input type="number" name="rate" class="form-control" min="0" step="0.01" required>
            </div>
        `,
        externalRate: `
            <div class="form-group">
                <label>Role:</label>
                <input type="text" name="role" class="form-control" required>
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
                const rate = projectData.internalRates.find(r => r.role === data.role);
                projectData.internalResources.push({
                    id: Date.now(),
                    role: data.role,
                    rateCard: 'Internal',
                    dailyRate: rate ? rate.rate : 0,
                    q1Days: parseFloat(data.q1Days) || 0,
                    q2Days: parseFloat(data.q2Days) || 0,
                    q3Days: parseFloat(data.q3Days) || 0,
                    q4Days: parseFloat(data.q4Days) || 0
                });
                renderInternalResourcesTable();
                break;
            case 'vendorCost':
                projectData.vendorCosts.push({
                    id: Date.now(),
                    vendor: data.vendor,
                    description: data.description,
                    category: data.category,
                    q1Cost: parseFloat(data.q1Cost) || 0,
                    q2Cost: parseFloat(data.q2Cost) || 0,
                    q3Cost: parseFloat(data.q3Cost) || 0,
                    q4Cost: parseFloat(data.q4Cost) || 0
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
            case 'internalRate':
                projectData.internalRates.push({
                    id: Date.now(),
                    role: data.role,
                    rate: parseFloat(data.rate)
                });
                renderInternalRatesTable();
                break;
            case 'externalRate':
                projectData.externalRates.push({
                    id: Date.now(),
                    role: data.role,
                    rate: parseFloat(data.rate)
                });
                renderExternalRatesTable();
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
        renderInternalRatesTable();
        renderExternalRatesTable();
        renderForecastTable();
    } catch (error) {
        console.error('Error rendering tables:', error);
    }
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
        const totalCost = (resource.q1Days + resource.q2Days + resource.q3Days + resource.q4Days) * resource.dailyRate;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.role}</td>
            <td>${resource.rateCard}</td>
            <td>$${resource.dailyRate.toLocaleString()}</td>
            <td>${resource.q1Days}</td>
            <td>${resource.q2Days}</td>
            <td>${resource.q3Days}</td>
            <td>${resource.q4Days}</td>
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
        const totalCost = vendor.q1Cost + vendor.q2Cost + vendor.q3Cost + vendor.q4Cost;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vendor.vendor}</td>
            <td>${vendor.description}</td>
            <td>${vendor.category}</td>
            <td>$${vendor.q1Cost.toLocaleString()}</td>
            <td>$${vendor.q2Cost.toLocaleString()}</td>
            <td>$${vendor.q3Cost.toLocaleString()}</td>
            <td>$${vendor.q4Cost.toLocaleString()}</td>
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
    
    projectData.internalRates.forEach(rate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rate.role}</td>
            <td>$${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('internalRates', ${rate.id || rate.role})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderExternalRatesTable() {
    const tbody = document.getElementById('externalRatesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    projectData.externalRates.forEach(rate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rate.role}</td>
            <td>$${rate.rate.toLocaleString()}</td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteItem('externalRates', ${rate.id || rate.role})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderForecastTable() {
    const tbody = document.getElementById('forecastTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Calculate quarterly totals
    const quarters = ['Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25'];
    
    // Internal Resources
    const internalQuarterly = [0, 0, 0, 0, 0, 0];
    projectData.internalResources.forEach(resource => {
        internalQuarterly[0] += resource.q1Days * resource.dailyRate;
        internalQuarterly[1] += resource.q2Days * resource.dailyRate;
        internalQuarterly[2] += resource.q3Days * resource.dailyRate;
        internalQuarterly[3] += resource.q4Days * resource.dailyRate;
    });
    
    // Vendor Costs
    const vendorQuarterly = [0, 0, 0, 0, 0, 0];
    projectData.vendorCosts.forEach(vendor => {
        vendorQuarterly[0] += vendor.q1Cost;
        vendorQuarterly[1] += vendor.q2Cost;
        vendorQuarterly[2] += vendor.q3Cost;
        vendorQuarterly[3] += vendor.q4Cost;
    });
    
    // Add rows
    const internalTotal = internalQuarterly.reduce((sum, val) => sum + val, 0);
    const vendorTotal = vendorQuarterly.reduce((sum, val) => sum + val, 0);
    
    tbody.innerHTML = `
        <tr>
            <td><strong>Internal Resources</strong></td>
            <td>$${internalQuarterly[0].toLocaleString()}</td>
            <td>$${internalQuarterly[1].toLocaleString()}</td>
            <td>$${internalQuarterly[2].toLocaleString()}</td>
            <td>$${internalQuarterly[3].toLocaleString()}</td>
            <td>$${internalQuarterly[4].toLocaleString()}</td>
            <td>$${internalQuarterly[5].toLocaleString()}</td>
            <td><strong>$${internalTotal.toLocaleString()}</strong></td>
        </tr>
        <tr>
            <td><strong>Vendor Costs</strong></td>
            <td>$${vendorQuarterly[0].toLocaleString()}</td>
            <td>$${vendorQuarterly[1].toLocaleString()}</td>
            <td>$${vendorQuarterly[2].toLocaleString()}</td>
            <td>$${vendorQuarterly[3].toLocaleString()}</td>
            <td>$${vendorQuarterly[4].toLocaleString()}</td>
            <td>$${vendorQuarterly[5].toLocaleString()}</td>
            <td><strong>$${vendorTotal.toLocaleString()}</strong></td>
        </tr>
    `;
}

// Delete Item Function
function deleteItem(arrayName, id) {
    if (confirm('Are you sure you want to delete this item?')) {
        if (arrayName === 'internalRates' || arrayName === 'externalRates') {
            // For rate cards, id might be the role name for default items
            projectData[arrayName] = projectData[arrayName].filter(item => 
                (item.id && item.id !== id) || (item.role !== id)
            );
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
    } catch (error) {
        console.error('Error updating summary:', error);
    }
}

function calculateInternalResourcesTotal() {
    return projectData.internalResources.reduce((total, resource) => {
        return total + ((resource.q1Days + resource.q2Days + resource.q3Days + resource.q4Days) * resource.dailyRate);
    }, 0);
}

function calculateVendorCostsTotal() {
    return projectData.vendorCosts.reduce((total, vendor) => {
        return total + (vendor.q1Cost + vendor.q2Cost + vendor.q3Cost + vendor.q4Cost);
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
        // Only try to load from localStorage if it's available
        if (typeof(Storage) !== "undefined" && localStorage) {
            const savedData = localStorage.getItem('ictProjectData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                projectData = { ...projectData, ...parsed };
                
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
    let csv = 'ICT Project Cost Estimate Export\n\n';
    
    // Project Info
    csv += 'PROJECT INFORMATION\n';
    csv += `Project Name,"${projectData.projectInfo.projectName}"\n`;
    csv += `Start Date,"${projectData.projectInfo.startDate}"\n`;
    csv += `End Date,"${projectData.projectInfo.endDate}"\n`;
    csv += `Project Manager,"${projectData.projectInfo.projectManager}"\n`;
    csv += `Description,"${projectData.projectInfo.projectDescription}"\n\n`;
    
    // Internal Resources
    csv += 'INTERNAL RESOURCES\n';
    csv += 'Role,Rate Card,Daily Rate,Q1 Days,Q2 Days,Q3 Days,Q4 Days,Total Cost\n';
    projectData.internalResources.forEach(resource => {
        const totalCost = (resource.q1Days + resource.q2Days + resource.q3Days + resource.q4Days) * resource.dailyRate;
        csv += `"${resource.role}","${resource.rateCard}",${resource.dailyRate},${resource.q1Days},${resource.q2Days},${resource.q3Days},${resource.q4Days},${totalCost}\n`;
    });
    
    // Vendor Costs
    csv += '\nVENDOR COSTS\n';
    csv += 'Vendor,Description,Category,Q1 Cost,Q2 Cost,Q3 Cost,Q4 Cost,Total Cost\n';
    projectData.vendorCosts.forEach(vendor => {
        const totalCost = vendor.q1Cost + vendor.q2Cost + vendor.q3Cost + vendor.q4Cost;
        csv += `"${vendor.vendor}","${vendor.description}","${vendor.category}",${vendor.q1Cost},${vendor.q2Cost},${vendor.q3Cost},${vendor.q4Cost},${totalCost}\n`;
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

// Global function for delete buttons
window.deleteItem = deleteItem;