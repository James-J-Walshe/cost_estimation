// DOM Manager Module
// Handles all DOM manipulation, event listeners, and modal management

class DOMManager {
    constructor() {
        this.elements = {};
        this.modal = null;
        this.modalContent = null;
        this.modalTitle = null;
        this.modalForm = null;
        this.modalFields = null;
        this.closeModal = null;
        this.cancelModal = null;
    }

    // Initialize all DOM elements
    initializeDOMElements() {
        try {
            // Tab elements
            this.elements.tabButtons = document.querySelectorAll('.tab-btn');
            this.elements.tabContents = document.querySelectorAll('.tab-content');
            
            // Modal elements
            this.modal = document.getElementById('modal');
            this.modalContent = document.querySelector('.modal-content');
            this.modalTitle = document.getElementById('modalTitle');
            this.modalForm = document.getElementById('modalForm');
            this.modalFields = document.getElementById('modalFields');
            this.closeModal = document.querySelector('.close');
            this.cancelModal = document.getElementById('cancelModal');

            console.log('DOM elements initialized');
            return true;
        } catch (error) {
            console.error('Error initializing DOM elements:', error);
            return false;
        }
    }

    // Initialize tab navigation
    initializeTabs() {
        if (!this.elements.tabButtons) {
            console.error('Tab buttons not found');
            return;
        }
        
        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    // Switch between tabs
    switchTab(targetTab) {
        try {
            // Update active tab button
            this.elements.tabButtons.forEach(btn => btn.classList.remove('active'));
            const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
            
            // Update active tab content
            this.elements.tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Trigger tab-specific updates
            if (targetTab === 'summary' && window.updateSummary) {
                window.updateSummary();
            }
        } catch (error) {
            console.error('Error switching tabs:', error);
        }
    }

    // Initialize all event listeners
    initializeEventListeners() {
        try {
            this.initializeProjectInfoListeners();
            this.initializeButtonListeners();
            this.initializeModalListeners();
            console.log('Event listeners initialized');
        } catch (error) {
            console.error('Error initializing event listeners:', error);
        }
    }

    // Project info form listeners
    initializeProjectInfoListeners() {
        const projectFields = [
            { id: 'projectName', prop: 'projectName' },
            { id: 'startDate', prop: 'startDate', callback: window.updateMonthHeaders },
            { id: 'endDate', prop: 'endDate', callback: window.updateMonthHeaders },
            { id: 'projectManager', prop: 'projectManager' },
            { id: 'projectDescription', prop: 'projectDescription' }
        ];

        projectFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                element.addEventListener('input', (e) => {
                    if (window.projectData && window.projectData.projectInfo) {
                        window.projectData.projectInfo[field.prop] = e.target.value;
                    }
                    if (field.callback) field.callback();
                    if (window.updateSummary) window.updateSummary();
                });
            }
        });

        // Contingency percentage
        const contingencyEl = document.getElementById('contingencyPercentage');
        if (contingencyEl) {
            contingencyEl.addEventListener('input', (e) => {
                if (window.projectData) {
                    window.projectData.contingencyPercentage = parseFloat(e.target.value) || 0;
                }
                if (window.updateSummary) window.updateSummary();
            });
        }
    }

    // Initialize button listeners
    initializeButtonListeners() {
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
                    this.openModal(btn.title, btn.type);
                });
            }
        });

        // Save/Load buttons
        const actionButtons = [
            { id: 'saveBtn', handler: window.saveProject },
            { id: 'loadBtn', handler: window.loadProject },
            { id: 'exportBtn', handler: window.exportToExcel },
            { id: 'newProjectBtn', handler: window.newProject },
            { id: 'downloadBtn', handler: window.downloadProject }
        ];

        actionButtons.forEach(btn => {
            const element = document.getElementById(btn.id);
            if (element && btn.handler) {
                element.addEventListener('click', btn.handler);
            }
        });
    }

    // Initialize modal event listeners
    initializeModalListeners() {
        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
        }
        
        if (this.cancelModal) {
            this.cancelModal.addEventListener('click', () => {
                this.modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });

        // Modal form submission
        if (this.modalForm) {
            this.modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (window.handleModalSubmit) {
                    window.handleModalSubmit();
                }
            });
        }
        
        // Modal save button backup
        const modalSaveBtn = document.querySelector('.modal-actions .btn-primary');
        if (modalSaveBtn) {
            modalSaveBtn.addEventListener('click', (e) => {
                if (e.target.type === 'submit') return;
                e.preventDefault();
                if (window.handleModalSubmit) {
                    window.handleModalSubmit();
                }
            });
        }
    }

    // Open modal with specified content
    openModal(title, type) {
        try {
            if (!this.modal || !this.modalTitle || !this.modalFields || !this.modalForm) {
                console.error('Modal elements not found');
                return;
            }
            
            this.modalTitle.textContent = title;
            this.modalFields.innerHTML = this.getModalFields(type);
            this.modal.style.display = 'block';
            this.modalForm.setAttribute('data-type', type);
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }

    // Generate modal fields based on type
    getModalFields(type) {
        const months = window.calculateProjectMonths ? window.calculateProjectMonths() : 
                      ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
        
        const fields = {
            internalResource: `
                <div class="form-group">
                    <label>Role:</label>
                    <select name="role" class="form-control" required>
                        ${window.projectData?.rateCards?.map(rate => 
                            `<option value="${rate.role}" data-category="${rate.category}">${rate.role} (${rate.category})</option>`
                        ).join('') || ''}
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

    // Update month headers across the application
    updateMonthHeaders() {
        const months = window.calculateProjectMonths ? window.calculateProjectMonths() : 
                      ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
        
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

    // Show alert messages
    showAlert(message, type) {
        try {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            const content = document.querySelector('.content');
            if (content) {
                content.insertBefore(alert, content.firstChild);
                
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.remove();
                    }
                }, 5000);
            } else {
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        } catch (error) {
            console.error('Error showing alert:', error);
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Create and export DOM manager instance
window.domManager = new DOMManager();

// Export functions that need to be globally accessible
window.updateMonthHeaders = () => window.domManager.updateMonthHeaders();
window.showAlert = (message, type) => window.domManager.showAlert(message, type);
window.openModal = (title, type) => window.domManager.openModal(title, type);
window.switchTab = (targetTab) => window.domManager.switchTab(targetTab);
