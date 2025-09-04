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

// Make projectData globally available
window.projectData = projectData;

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
        
        // Use data manager to load saved data
        window.dataManager.loadDefaultData();
        
        // Debug: Check data after loading
        console.log('After loadDefaultData:', {
            vendorCosts: projectData.vendorCosts.length,
            toolCosts: projectData.toolCosts.length,
            windowProjectData: window.projectData?.vendorCosts?.length
        });
        
        renderAllTables();
        updateSummary();
        
        // Ensure global projectData is properly set after all initialization
        window.projectData = projectData;
        
        console.log('Final data check:', {
            vendorCosts: projectData.vendorCosts.length,
            toolCosts: projectData.toolCosts.length,
            windowProjectData: window.projectData?.vendorCosts?.length
        });
        
        // Re-render tables after a brief delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Re-rendering tables with loaded data...');
            renderAllTables();
        }, 100);
        
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
                // Update global reference
                window.projectData = projectData;
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
                // Update global reference
                window.projectData = projectData;
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
                // Update global reference
                window.projectData = projectData;
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
                // Update global reference
                window.projectData = projectData;
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
