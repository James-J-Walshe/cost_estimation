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
        updateSummaryProjectInfo(); // Added from Step 3
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
            updateSummaryProjectInfo(); // Added from Step 3
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
                updateSummaryProjectInfo(); // Added from Step 3
            });
        }
        
        if (startDateEl) {
            startDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.startDate = e.target.value;
                updateMonthHeaders();
                updateSummary();
                updateSummaryProjectInfo(); // Added from Step 3
            });
        }
        
        if (endDateEl) {
            endDateEl.addEventListener('input', (e) => {
                projectData.projectInfo.endDate = e.target.value;
                updateMonthHeaders();
                updateSummary();
                updateSummaryProjectInfo(); // Added from Step 3
            });
        }
        
        if (projectManagerEl) {
            projectManagerEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectManager = e.target.value;
                updateSummary();
                updateSummaryProjectInfo(); // Added from Step 3
            });
        }
        
        if (projectDescriptionEl) {
            projectDescriptionEl.addEventListener('input', (e) => {
                projectData.projectInfo.projectDescription = e.target.value;
                updateSummary();
                updateSummaryProjectInfo(); // Added from Step 3
            });
        }

        // Contingency percentage
        if (contingencyPercentageEl) {
            contingencyPercentageEl.addEventListener('input', (e) => {
                projectData.contingencyPercentage = parseFloat(e.target.value) || 0;
                updateSummary();
                updateSummaryProjectInfo(); // Added from Step 3
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
        } else {
            // If no download button exists, modify the save button to also download
            console.log('No download button found, save button will also download file');
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
                    // Let the form submit handler take care of it
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

// Modal Management - ENHANCED FOR EDITING
function openModal(title, type, editId = null) {
    try {
        if (!modal || !modalTitle || !modalFields || !modalForm) {
            console.error('Modal elements not found');
            return;
        }
        
        modalTitle.textContent = title;
        modalFields.innerHTML = getModalFields(type, editId);
        modal.style.display = 'block';
        modalForm.setAttribute('data-type', type);
        
        // Set edit mode if editing an existing item
        if (editId) {
            modalForm.setAttribute('data-edit-id', editId);
            console.log('Modal opened in edit mode for ID:', editId);
        } else {
            modalForm.removeAttribute('data-edit-id');
            console.log('Modal opened in add mode');
        }
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

// ENHANCED Modal Fields Function - Support for editing
function getModalFields(type, editId = null) {
    const months = calculateProjectMonths();
    
    // Get existing data if editing
    let existingData = null;
    if (editId) {
        switch(type) {
            case 'internalResource':
                existingData = projectData.internalResources.find(item => item.id === editId);
                break;
            case 'vendorCost':
                existingData = projectData.vendorCosts.find(item => item.id === editId);
                break;
            case 'toolCost':
                existingData = projectData.toolCosts.find(item => item.id === editId);
                break;
            case 'miscCost':
                existingData = projectData.miscCosts.find(item => item.id === editId);
                break;
            case 'risk':
                existingData = projectData.risks.find(item => item.id === editId);
                break;
            case 'rateCard':
                existingData = projectData.rateCards.find(item => item.id === editId);
                break;
        }
    }
    
    const fields = {
        internalResource: `
            <div class="form-group">
                <label>Role:</label>
                <select name="role" class="form-control" required>
                    ${projectData.rateCards.map(rate => 
                        `<option value="${rate.role}" data-category="${rate.category}" ${existingData && existingData.role === rate.role ? 'selected' : ''}>${rate.role} (${rate.category})</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>${months[0] || 'Month 1'} Days:</label>
                <input type="number" name="month1Days" class="form-control" min="0" step="0.5" value="${existingData ? (existingData.month1Days || existingData.q1Days || 0) : 0}">
            </div>
            <div class="form-group">
                <label>${months[1] || 'Month 2'} Days:</label>
                <input type="number" name="month2Days" class="form-control" min="0" step="0.5" value="${existingData ? (existingData.month2Days || existingData.q2Days || 0) : 0}">
            </div>
            <div class="form-group">
                <label>${months[2] || 'Month 3'} Days:</label>
                <input type="number" name="month3Days" class="form-control" min="0" step="0.5" value="${existingData ? (existingData.month3Days || existingData.q3Days || 0) : 0}">
            </div>
            <div class="form-group">
                <label>${months[3] || 'Month 4'} Days:</label>
                <input type="number" name="month4Days" class="form-control" min="0" step="0.5" value="${existingData ? (existingData.month4Days || existingData.q4Days || 0) : 0}">
            </div>
        `,
        vendorCost: `
            <div class="form-group">
                <label>Vendor:</label>
                <input type="text" name="vendor" class="form-control" value="${existingData ? existingData.vendor : ''}" required>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <input type="text" name="description" class="form-control" value="${existingData ? existingData.description : ''}" required>
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="form-control" required>
                    <option value="Implementation" ${existingData && existingData.category === 'Implementation' ? 'selected' : ''}>Implementation</option>
                    <option value="Consulting" ${existingData && existingData.category === 'Consulting' ? 'selected' : ''}>Consulting</option>
                    <option value="Training" ${existingData && existingData.category === 'Training' ? 'selected' : ''}>Training</option>
                    <option value="Support" ${existingData && existingData.category === 'Support' ? 'selected' : ''}>Support</option>
                    <option value="Other" ${existingData && existingData.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>${months[0] || 'Month 1'} Cost:</label>
                <input type="number" name="month1Cost" class="form-control" min="0" step="0.01" value="${existingData ? (existingData.month1Cost || existingData.q1Cost || 0) : 0}">
            </div>
            <div class="form-group">
                <label>${months[1] || 'Month 2'} Cost:</label>
                <input type="number" name="month2Cost" class="form-control" min="0" step="0.01" value="${existingData ? (existingData.month2Cost || existingData.q2Cost || 0) : 0}">
            </div>
            <div class="form-group">
                <label>${months[2] || 'Month 3'} Cost:</label>
                <input type="number" name="month3Cost" class="form-control" min="0" step="0.01" value="${existingData ? (existingData.month3Cost || existingData.q3Cost || 0) : 0}">
            </div>
            <div class="form-group">
                <label>${months[3] || 'Month 4'} Cost:</label>
                <input type="number" name="month4Cost" class="form-control" min="0" step="0.01" value="${existingData ? (existingData.month4Cost || existingData.q4Cost || 0) : 0}">
            </div>
        `,
        toolCost: `
            <div class="form-group">
                <label>Tool/Software:</label>
                <input type="text" name="tool" class="form-control" value="${existingData ? existingData.tool : ''}" required>
            </div>
            <div class="form-group">
                <label>License Type:</label>
                <select name="licenseType" class="form-control" required>
                    <option value="Per User" ${existingData && existingData.licenseType === 'Per User' ? 'selected' : ''}>Per User</option>
                    <option value="Per Device" ${existingData && existingData.licenseType === 'Per Device' ? 'selected' : ''}>Per Device</option>
                    <option value="Enterprise" ${existingData && existingData.licenseType === 'Enterprise' ? 'selected' : ''}>Enterprise</option>
                    <option value="One-time" ${existingData && existingData.licenseType === 'One-time' ? 'selected' : ''}>One-time</option>
                </select>
            </div>
            <div class="form-group">
                <label>Users/Licenses:</label>
                <input type="number" name="users" class="form-control" min="1" value="${existingData ? existingData.users : 1}" required>
            </div>
            <div class="form-group">
                <label>Monthly Cost:</label>
                <input type="number" name="monthlyCost" class="form-control" min="0" step="0.01" value="${existingData ? existingData.monthlyCost : 0}" required>
            </div>
            <div class="form-group">
                <label>Duration (Months):</label>
                <input type="number" name="duration" class="form-control" min="1" value="${existingData ? existingData.duration : 1}" required>
            </div>
        `,
        miscCost: `
            <div class="form-group">
                <label>Item:</label>
                <input type="text" name="item" class="form-control" value="${existingData ? existingData.item : ''}" required>
            </div>
            <div class="form-group">
                <label>Description:</label>
                <input type="text" name="description" class="form-control" value="${existingData ? existingData.description : ''}" required>
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="form-control" required>
                    <option value="Travel" ${existingData && existingData.category === 'Travel' ? 'selected' : ''}>Travel</option>
                    <option value="Equipment" ${existingData && existingData.category === 'Equipment' ? 'selected' : ''}>Equipment</option>
                    <option value="Training" ${existingData && existingData.category === 'Training' ? 'selected' : ''}>Training</option>
                    <option value="Documentation" ${existingData && existingData.category === 'Documentation' ? 'selected' : ''}>Documentation</option>
                    <option value="Other" ${existingData && existingData.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Cost:</label>
                <input type="number" name="cost" class="form-control" min="0" step="0.01" value="${existingData ? existingData.cost : 0}" required>
            </div>
        `,
        risk: `
            <div class="form-group">
                <label>Risk Description:</label>
                <textarea name="description" class="form-control" required>${existingData ? existingData.description : ''}</textarea>
            </div>
            <div class="form-group">
                <label>Probability (1-5):</label>
                <input type="number" name="probability" class="form-control" min="1" max="5" value="${existingData ? existingData.probability : 1}" required>
            </div>
            <div class="form-group">
                <label>Impact (1-5):</label>
                <input type="number" name="impact" class="form-control" min="1" max="5" value="${existingData ? existingData.impact : 1}" required>
            </div>
            <div class="form-group">
                <label>Mitigation Cost:</label>
                <input type="number" name="mitigationCost" class="form-control" min="0" step="0.01" value="${existingData ? existingData.mitigationCost : 0}">
            </div>
        `,
        rateCard: `
            <div class="form-group">
                <label>Role:</label>
                <input type="text" name="role" class="form-control" value="${existingData ? existingData.role : ''}" required>
            </div>
            <div class="form-group">
                <label>Category:</label>
                <select name="category" class="form-control" required>
                    <option value="Internal" ${existingData && existingData.category === 'Internal' ? 'selected' : ''}>Internal</option>
                    <option value="External" ${existingData && existingData.category === 'External' ? 'selected' : ''}>External</option>
                </select>
            </div>
            <div class="form-group">
                <label>Daily Rate:</label>
                <input type="number" name="rate" class="form-control" min="0" step="0.01" value="${existingData ? existingData.rate : 0}" required>
            </div>
        `
    };
    
    return fields[type] || '';
}

// ENHANCED Modal Submit Handler - Support for editing
function handleModalSubmit() {
    try {
        const formData = new FormData(modalForm);
        const type = modalForm.getAttribute('data-type');
        const editId = modalForm.getAttribute('data-edit-id');
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log('Modal submit - Type:', type);
        console.log('Modal submit - Edit ID:', editId);
        console.log('Modal submit - Data:', data);
        
        // Handle editing vs adding
        if (editId) {
            // EDIT MODE - Update existing item
            const id = parseInt(editId);
            switch(type) {
                case 'internalResource':
                    const resourceIndex = projectData.internalResources.findIndex(item => item.id === id);
                    if (resourceIndex !== -1) {
                        const rate = projectData.rateCards.find(r => r.role === data.role) || 
                                    projectData.internalRates.find(r => r.role === data.role);
                        projectData.internalResources[resourceIndex] = {
                            ...projectData.internalResources[resourceIndex],
                            role: data.role,
                            rateCard: rate ? rate.category || 'Internal' : 'Internal',
                            dailyRate: rate ? rate.rate : 0,
                            month1Days: parseFloat(data.month1Days) || 0,
                            month2Days: parseFloat(data.month2Days) || 0,
                            month3Days: parseFloat(data.month3Days) || 0,
                            month4Days: parseFloat(data.month4Days) || 0
                        };
                        renderInternalResourcesTable();
                    }
                    break;
                case 'vendorCost':
                    const vendorIndex = projectData.vendorCosts.findIndex(item => item.id === id);
                    if (vendorIndex !== -1) {
                        projectData.vendorCosts[vendorIndex] = {
                            ...projectData.vendorCosts[vendorIndex],
                            vendor: data.vendor,
                            description: data.description,
                            category: data.category,
                            month1Cost: parseFloat(data.month1Cost) || 0,
                            month2Cost: parseFloat(data.month2Cost) || 0,
                            month3Cost: parseFloat(data.month3Cost) || 0,
                            month4Cost: parseFloat(data.month4Cost) || 0
                        };
                        renderVendorCostsTable();
                    }
                    break;
                case 'toolCost':
                    const toolIndex = projectData.toolCosts.findIndex(item => item.id === id);
                    if (toolIndex !== -1) {
                        projectData.toolCosts[toolIndex] = {
                            ...projectData.toolCosts[toolIndex],
                            tool: data.tool,
                            licenseType: data.licenseType,
                            users: parseInt(data.users),
                            monthlyCost: parseFloat(data.monthlyCost),
                            duration: parseInt(data.duration)
                        };
                        renderToolCostsTable();
                    }
                    break;
                case 'miscCost':
                    const miscIndex = projectData.miscCosts.findIndex(item => item.id === id);
                    if (miscIndex !== -1) {
                        projectData.miscCosts[miscIndex] = {
                            ...projectData.miscCosts[miscIndex],
                            item: data.item,
                            description: data.description,
                            category: data.category,
                            cost: parseFloat(data.cost)
                        };
                        renderMiscCostsTable();
                    }
                    break;
                case 'risk':
                    const riskIndex = projectData.risks.findIndex(item => item.id === id);
                    if (riskIndex !== -1) {
                        projectData.risks[riskIndex] = {
                            ...projectData.risks[riskIndex],
                            description: data.description,
                            probability: parseInt(data.probability),
                            impact: parseInt(data.impact),
                            mitigationCost: parseFloat(data.mitigationCost) || 0
                        };
                        renderRisksTable();
                    }
                    break;
                case 'rateCard':
                    const rateIndex = projectData.rateCards.findIndex(item => item.id === id);
                    if (rateIndex !== -1) {
                        projectData.rateCards[rateIndex] = {
                            ...projectData.rateCards[rateIndex],
                            role: data.role,
                            rate: parseFloat(data.rate),
                            category: data.category
                        };
                        renderUnifiedRateCardsTable();
                        renderInternalRatesTable(); // Update backward compatibility tables
                        renderExternalRatesTable();
                    }
                    break;
            }
        } else {
            // ADD MODE - Create new item (original functionality)
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
        }
        
        updateSummary();
        updateSummaryProjectInfo(); // Added from Step 3
        modal.style.display = 'none';
        console.log('Modal submit completed successfully');
    } catch (error) {
        console.error('Error handling modal submit:', error);
    }
}

// NEW FUNCTION: Edit Internal Resource
function editInternalResource(id) {
    console.log('Editing internal resource with ID:', id);
    openModal('Edit Internal Resource', 'internalResource', id);
}

// Table Rendering Functions
function renderAllTables() {
    try {
        renderInternalResourcesTable();
        renderVendorCostsTable();
        renderToolCostsTable();
        renderMiscCostsTable();
        renderRisksTable();
        renderInternalRatesTable(); // Keep for backward compatibility
        renderExternalRatesTable(); // Keep for backward compatibility  
        renderUnifiedRateCardsTable(); // Add unified rate cards table
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

// ENHANCED Internal Resources Table with Edit Button
function renderInternalResourcesTable() {
    const tbody = document.getElementById('internalResourcesTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (projectData.internalResources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No internal resources added yet</td></tr>';
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
            <td>${resource.dailyRate.toLocaleString()}</td>
            <td>${month1Days}</td>
            <td>${month2Days}</td>
            <td>${month3Days}</td>
            <td>${month4Days}</td>
            <td>${totalCost.toLocaleString()}</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="editInternalResource(${resource.id})" style="margin-right: 5px;">Edit</button>
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
        console.log('Internal rates table not found, trying alternative selectors');
        // Try alternative selectors if the standard one doesn't work
        const altTbody = document.querySelector('#rate-cards tbody') || 
                         document.querySelector('.rate-cards-container tbody') ||
                         document.querySelector('[id*="internal"] tbody');
        if (altTbody) {
            console.log('Found alternative tbody:', altTbody);
        }
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
        console.log('External rates table not found, trying alternative selectors');
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

function renderForecastTable() {
    const tbody = document.getElementById('forecastTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Calculate monthly totals
    const months = calculateProjectMonths();
    
    // Internal Resources
    const internalMonthly = [0, 0, 0, 0, 0, 0];
    projectData.internalResources.forEach(resource => {
        // Handle both old and new format
        internalMonthly[0] += (resource.month1Days || resource.q1Days || 0) * resource.dailyRate;
        internalMonthly[1] += (resource.month2Days || resource.q2Days || 0) * resource.dailyRate;
        internalMonthly[2] += (resource.month3Days || resource.q3Days || 0) * resource.dailyRate;
        internalMonthly[3] += (resource.month4Days || resource.q4Days || 0) * resource.dailyRate;
    });
    
    // Vendor Costs
    const vendorMonthly = [0, 0, 0, 0, 0, 0];
    projectData.vendorCosts.forEach(vendor => {
        // Handle both old and new format
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
        updateSummaryProjectInfo(); // Added from Step 3
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
        // Handle both old format (q1Days) and new format (month1Days)
        const month1Days = resource.month1Days || resource.q1Days || 0;
        const month2Days = resource.month2Days || resource.q2Days || 0;
        const month3Days = resource.month3Days || resource.q3Days || 0;
        const month4Days = resource.month4Days || resource.q4Days || 0;
        
        return total + ((month1Days + month2Days + month3Days + month4Days) * resource.dailyRate);
    }, 0);
}

function calculateVendorCostsTotal() {
    return projectData.vendorCosts.reduce((total, vendor) => {
        // Handle both old format (q1Cost) and new format (month1Cost)
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
            updateSummaryProjectInfo(); // Added from Step 3
            updateMonthHeaders();
            
            // Switch to project info tab
            switchTab('project-info');
            
            showAlert('New project started successfully! Please enter your project information.', 'success');
            console.log('New project created');
            
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
                    updateSummaryProjectInfo(); // Added from Step 3
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

// Function to update project info in summary tab (From Step 3)
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

// Global functions for table buttons
window.deleteItem = deleteItem;
window.editInternalResource = editInternalResource;
