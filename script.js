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
    console.log('Starting application initialization...');
    
    try {
        // Check if DOM Manager is available and initialize
        if (typeof window.DOMManager !== 'undefined') {
            console.log('DOM Manager found, initializing...');
            if (typeof window.DOMManager.initialize === 'function') {
                window.DOMManager.initialize();
            } else {
                console.log('DOM Manager found but no initialize method, checking available methods:', Object.keys(window.DOMManager));
                initializeBasicFunctionality();
            }
        } else if (typeof window.domManager !== 'undefined') {
            console.log('DOM Manager (lowercase) found, initializing...');
            console.log('Available methods on domManager:', Object.keys(window.domManager));
            
            if (typeof window.domManager.initialize === 'function') {
                window.domManager.initialize();
            } else if (typeof window.domManager.init === 'function') {
                window.domManager.init();
            } else {
                console.log('DOM Manager found but no initialize/init method, using basic functionality');
                initializeBasicFunctionality();
            }
        } else {
            console.log('DOM Manager not found, initializing basic functionality...');
            initializeBasicFunctionality();
        }
        
        console.log('DOM elements initialized successfully');
        console.log('Tabs initialized');
        console.log('Event listeners initialized');
        
        // Load data and render tables
        console.log('Loading data and rendering tables...');
        
        // Check if Data Manager is available
        if (typeof window.DataManager !== 'undefined') {
            const dataLoaded = window.DataManager.loadDefaultData();
            console.log('Data Manager found and data loaded');
            
            // Ensure we're using the updated data
            if (window.projectData) {
                projectData = window.projectData;
            }
        } else if (typeof window.dataManager !== 'undefined') {
            const dataLoaded = window.dataManager.loadDefaultData();
            console.log('Data Manager (lowercase) found and data loaded');
            
            // Ensure we're using the updated data
            if (window.projectData) {
                projectData = window.projectData;
            }
        } else {
            console.warn('Data Manager not found - using basic data loading');
            loadDefaultDataBasic();
        }
        
        // Check if Table Renderer is available
        if (typeof window.TableRenderer !== 'undefined') {
            window.TableRenderer.renderAllTables();
            console.log('Table Renderer found and tables rendered');
        } else if (typeof window.tableRenderer !== 'undefined') {
            window.tableRenderer.renderAllTables();
            console.log('Table Renderer (lowercase) found and tables rendered');
        } else {
            console.warn('Table Renderer not found - tables may not render properly');
        }
        
        // Update summary and month headers
        updateSummary();
        updateMonthHeaders();
        
        console.log('Application initialized successfully');
        
        // Re-render tables after a short delay to ensure all data is properly loaded
        setTimeout(() => {
            console.log('Re-rendering tables with loaded data...');
            if (window.TableRenderer) {
                window.TableRenderer.renderAllTables();
            } else if (window.tableRenderer) {
                window.tableRenderer.renderAllTables();
            }
            updateSummary();
        }, 100);
        
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Error initializing application. Please check the console for details.');
    }
});

// Basic functionality fallback
function initializeBasicFunctionality() {
    console.log('Initializing basic functionality...');
    
    // Initialize tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons && tabContents) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
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
            });
        });
        console.log('Tab functionality initialized');
    }
    
    // Initialize button event listeners
    initializeBasicEventListeners();
}

function initializeBasicEventListeners() {
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
            console.log(`Event listener added to ${btn.id}`);
        }
    });
    
    // Action buttons
    const actionButtons = [
        { id: 'saveBtn', action: () => saveProjectFallback() },
        { id: 'loadBtn', action: () => loadProjectFallback() },
        { id: 'exportBtn', action: () => exportToExcelFallback() },
        { id: 'newProjectBtn', action: () => newProjectFallback() },
        { id: 'downloadBtn', action: () => downloadProjectFallback() }
    ];
    
    actionButtons.forEach(({ id, action }) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', action);
            console.log(`Event listener added to ${id}`);
        }
    });
    
    // Settings button functionality
    initializeSettingsButton();
    
    // Modal listeners
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const cancelModal = document.getElementById('cancelModal');
    const modalForm = document.getElementById('modalForm');
    
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
    
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleModalSubmit();
        });
    }
    
    // Project info form listeners
    const projectFields = [
        'projectName', 'startDate', 'endDate', 
        'projectManager', 'projectDescription', 'contingencyPercentage'
    ];

    projectFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', (e) => {
                if (fieldId === 'contingencyPercentage') {
                    projectData.contingencyPercentage = parseFloat(e.target.value) || 0;
                } else {
                    projectData.projectInfo[fieldId] = e.target.value;
                }
                
                updateSummary();
                if ((fieldId === 'startDate' || fieldId === 'endDate')) {
                    updateMonthHeaders();
                }
            });
        }
    });
}

// Settings functionality
function initializeSettingsButton() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsBtnMobile = document.getElementById('settingsBtnMobile');
    const backToMain = document.getElementById('backToMain');
    const mainApp = document.getElementById('mainApp');
    const settingsApp = document.getElementById('settingsApp');
    
    // Desktop settings button
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            console.log('Settings button clicked');
            showSettingsView();
        });
        console.log('Settings button listener added');
    }
    
    // Mobile settings button
    if (settingsBtnMobile) {
        settingsBtnMobile.addEventListener('click', () => {
            console.log('Mobile settings button clicked');
            showSettingsView();
            // Close mobile menu
            const mobileDropdown = document.getElementById('mobileDropdown');
            if (mobileDropdown) {
                mobileDropdown.style.display = 'none';
            }
        });
        console.log('Mobile settings button listener added');
    }
    
    // Back to main button
    if (backToMain) {
        backToMain.addEventListener('click', () => {
            console.log('Back to main button clicked');
            showMainView();
        });
        console.log('Back to main button listener added');
    }
    
    // Initialize settings navigation
    initializeSettingsNavigation();
    
    // Initialize mobile hamburger menu
    initializeMobileMenu();
}

function showSettingsView() {
    const mainApp = document.getElementById('mainApp');
    const settingsApp = document.getElementById('settingsApp');
    
    if (mainApp && settingsApp) {
        mainApp.style.display = 'none';
        settingsApp.style.display = 'block';
        console.log('Switched to settings view');
        
        // Re-render tables in settings if needed
        if (window.TableRenderer) {
            setTimeout(() => {
                window.TableRenderer.renderUnifiedRateCardsTable();
            }, 100);
        }
    }
}

function showMainView() {
    const mainApp = document.getElementById('mainApp');
    const settingsApp = document.getElementById('settingsApp');
    
    if (mainApp && settingsApp) {
        mainApp.style.display = 'block';
        settingsApp.style.display = 'none';
        console.log('Switched to main view');
        
        // Re-render all tables when returning to main view
        if (window.TableRenderer) {
            setTimeout(() => {
                window.TableRenderer.renderAllTables();
                updateSummary();
            }, 100);
        }
    }
}

function initializeSettingsNavigation() {
    const settingsNavButtons = document.querySelectorAll('.settings-nav-btn');
    const settingsTabContents = document.querySelectorAll('.settings-tab-content');
    
    settingsNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-settings-tab');
            
            // Update active nav button
            settingsNavButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab content
            settingsTabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(`settings-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            console.log(`Switched to settings tab: ${targetTab}`);
        });
    });
    
    console.log('Settings navigation initialized');
}

function initializeMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDropdown = document.getElementById('mobileDropdown');
    
    if (hamburgerBtn && mobileDropdown) {
        hamburgerBtn.addEventListener('click', () => {
            const isVisible = mobileDropdown.style.display === 'block';
            mobileDropdown.style.display = isVisible ? 'none' : 'block';
            console.log('Mobile menu toggled');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
                mobileDropdown.style.display = 'none';
            }
        });
        
        console.log('Mobile menu initialized');
    }
}

// Fallback functions for when modules aren't available
function saveProjectFallback() {
    if (window.DataManager) {
        window.DataManager.saveProject();
    } else if (window.dataManager) {
        window.dataManager.saveProject();
    } else {
        // Basic localStorage save
        try {
            localStorage.setItem('ictProjectData', JSON.stringify(projectData));
            console.log('Project saved using fallback method');
        } catch (e) {
            console.error('Error saving project:', e);
        }
    }
}

function loadProjectFallback() {
    if (window.DataManager) {
        window.DataManager.loadProject();
    } else if (window.dataManager) {
        window.dataManager.loadProject();
    } else {
        // Basic file input
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
                        updateSummary();
                        if (window.TableRenderer) {
                            window.TableRenderer.renderAllTables();
                        }
                        console.log('Project loaded using fallback method');
                    } catch (err) {
                        console.error('Error loading project:', err);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

function exportToExcelFallback() {
    if (window.DataManager) {
        window.DataManager.exportToExcel();
    } else if (window.dataManager) {
        window.dataManager.exportToExcel();
    } else {
        console.log('Export functionality requires Data Manager module');
    }
}

function newProjectFallback() {
    if (window.DataManager) {
        window.DataManager.newProject();
    } else if (window.dataManager) {
        window.dataManager.newProject();
    } else {
        if (confirm('Start a new project? This will clear all current data.')) {
            // Reset to initial state
            projectData = {
                projectInfo: { projectName: '', startDate: '', endDate: '', projectManager: '', projectDescription: '' },
                internalResources: [], vendorCosts: [], toolCosts: [], miscCosts: [], risks: [],
                rateCards: projectData.rateCards, // Keep default rate cards
                internalRates: projectData.internalRates,
                externalRates: projectData.externalRates,
                contingencyPercentage: 10
            };
            updateSummary();
            if (window.TableRenderer) {
                window.TableRenderer.renderAllTables();
            }
            console.log('New project created using fallback method');
        }
    }
}

function downloadProjectFallback() {
    if (window.DataManager) {
        window.DataManager.downloadProject();
    } else if (window.dataManager) {
        window.dataManager.downloadProject();
    } else {
        // Basic download
        const dataStr = JSON.stringify(projectData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ICT_Project_${projectData.projectInfo.projectName || 'Untitled'}.json`;
        link.click();
        console.log('Project downloaded using fallback method');
    }
}

function loadDefaultDataBasic() {
    try {
        if (typeof(Storage) !== "undefined" && localStorage) {
            const savedData = localStorage.getItem('ictProjectData');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                projectData = { ...projectData, ...parsed };
                console.log('Data loaded using basic method');
            }
        }
    } catch (e) {
        console.error('Error loading saved data:', e);
    }
}

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

// Modal Management
function openModal(title, type) {
    try {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalFields = document.getElementById('modalFields');
        const modalForm = document.getElementById('modalForm');
        
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
        const modalForm = document.getElementById('modalForm');
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
                break;
            case 'miscCost':
                projectData.miscCosts.push({
                    id: Date.now(),
                    item: data.item,
                    description: data.description,
                    category: data.category,
                    cost: parseFloat(data.cost)
                });
                break;
            case 'risk':
                projectData.risks.push({
                    id: Date.now(),
                    description: data.description,
                    probability: parseInt(data.probability),
                    impact: parseInt(data.impact),
                    mitigationCost: parseFloat(data.mitigationCost) || 0
                });
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
                break;
        }
        
        // Re-render tables
        if (window.TableRenderer) {
            window.TableRenderer.renderAllTables();
        } else if (window.tableRenderer) {
            window.tableRenderer.renderAllTables();
        }
        
        updateSummary();
        document.getElementById('modal').style.display = 'none';
        console.log('Modal submit completed successfully');
    } catch (error) {
        console.error('Error handling modal submit:', error);
    }
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
        
        // Re-render tables
        if (window.TableRenderer) {
            window.TableRenderer.renderAllTables();
        } else if (window.tableRenderer) {
            window.tableRenderer.renderAllTables();
        }
        
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
        
        // Update project info in summary
        updateSummaryProjectInfo();
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

// Function to update project info in summary tab
function updateSummaryProjectInfo() {
    try {
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

// Expose necessary functions globally
window.openModal = openModal;
window.handleModalSubmit = handleModalSubmit;
window.deleteItem = deleteItem;
window.updateSummary = updateSummary;
window.updateMonthHeaders = updateMonthHeaders;
window.calculateProjectMonths = calculateProjectMonths;

// Calculation functions for modules
window.calculateInternalResourcesTotal = calculateInternalResourcesTotal;
window.calculateVendorCostsTotal = calculateVendorCostsTotal;
window.calculateToolCostsTotal = calculateToolCostsTotal;
window.calculateMiscCostsTotal = calculateMiscCostsTotal;

// Make projectData available globally for modules
window.projectData = projectData;
