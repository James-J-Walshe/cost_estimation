// app-init.js - Application Initialization & Coordination
// ============================================================================

const App = {
    initialized: false,
    initializationSteps: [],
    
    /**
     * Main initialization function
     */
    init() {
        try {
            console.log('=== ICT Cost Estimation App Initialization ===');
            
            // Track initialization steps
            this.initializationSteps = [];
            
            // Phase 1: Core Dependencies
            this.log('Phase 1: Initializing core dependencies...');
            if (!this.initializeCoreModules()) {
                throw new Error('Core module initialization failed');
            }
            
            // Phase 2: Data and State
            this.log('Phase 2: Setting up data and state...');
            if (!this.initializeDataAndState()) {
                throw new Error('Data and state initialization failed');
            }
            
            // Phase 3: UI and Navigation
            this.log('Phase 3: Initializing UI and navigation...');
            if (!this.initializeUI()) {
                throw new Error('UI initialization failed');
            }
            
            // Phase 4: Event Handlers
            this.log('Phase 4: Setting up event handlers...');
            if (!this.initializeEventHandlers()) {
                throw new Error('Event handler initialization failed');
            }
            
            // Phase 5: Rendering and Display
            this.log('Phase 5: Initial rendering...');
            if (!this.performInitialRender()) {
                throw new Error('Initial rendering failed');
            }
            
            // Phase 6: Final Setup
            this.log('Phase 6: Final setup...');
            this.finalizeInitialization();
            
            this.initialized = true;
            this.log('=== Application initialized successfully ===');
            
            // Show initialization summary
            this.showInitializationSummary();
            
            return true;
            
        } catch (error) {
            console.error('=== Application initialization failed ===');
            console.error('Error:', error.message);
            console.error('Initialization steps completed:', this.initializationSteps);
            
            // Show user-friendly error
            this.showInitializationError(error);
            return false;
        }
    },

    /**
     * Initialize core modules
     */
    initializeCoreModules() {
        try {
            // Initialize DOM Manager first (required by all other modules)
            this.step('Initializing DOM Manager...');
            if (!window.DOMManager || !DOMManager.init()) {
                throw new Error('DOMManager initialization failed');
            }
            
            // Initialize App State
            this.step('Initializing App State...');
            if (!window.AppState || !AppState.init()) {
                throw new Error('AppState initialization failed');
            }
            
            // Initialize Navigation
            this.step('Initializing Navigation...');
            if (!window.Navigation || !Navigation.init()) {
                throw new Error('Navigation initialization failed');
            }
            
            this.step('Core modules initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Core module initialization failed:', error);
            return false;
        }
    },

    /**
     * Initialize data and state
     */
    initializeDataAndState() {
        try {
            // Load saved data
            this.step('Loading saved project data...');
            AppState.loadFromStorage();
            
            // Populate form fields from loaded data
            this.step('Populating form fields...');
            this.populateFormFields();
            
            this.step('Data and state initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Data and state initialization failed:', error);
            return false;
        }
    },

    /**
     * Initialize UI components
     */
    initializeUI() {
        try {
            // Initialize modal system (if available)
            this.step('Setting up modal system...');
            if (window.ModalManager && ModalManager.init) {
                ModalManager.init();
            }
            
            // Set initial tab
            this.step('Setting initial tab...');
            Navigation.setActiveTab('project-info');
            
            this.step('UI initialized successfully');
            return true;
            
        } catch (error) {
            console.error('UI initialization failed:', error);
            return false;
        }
    },

    /**
     * Initialize event handlers
     */
    initializeEventHandlers() {
        try {
            this.step('Setting up form event handlers...');
            this.setupFormEventHandlers();
            
            this.step('Setting up button event handlers...');
            this.setupButtonEventHandlers();
            
            this.step('Setting up modal event handlers...');
            this.setupModalEventHandlers();
            
            this.step('Setting up keyboard shortcuts...');
            this.setupKeyboardShortcuts();
            
            this.step('Event handlers initialized successfully');
            return true;
            
        } catch (error) {
            console.error('Event handler initialization failed:', error);
            return false;
        }
    },

    /**
     * Perform initial rendering
     */
    performInitialRender() {
        try {
            this.step('Rendering tables...');
            if (window.renderAllTables) {
                renderAllTables();
            }
            
            this.step('Updating summaries...');
            if (window.updateSummary) {
                updateSummary();
            }
            
            this.step('Updating headers...');
            if (window.updateMonthHeaders) {
                updateMonthHeaders();
            }
            
            this.step('Initial rendering completed successfully');
            return true;
            
        } catch (error) {
            console.error('Initial rendering failed:', error);
            return false;
        }
    },

    /**
     * Finalize initialization
     */
    finalizeInitialization() {
        try {
            // Set up auto-save if available
            this.step('Setting up auto-save...');
            if (window.enableAutoSave) {
                enableAutoSave(5); // Auto-save every 5 minutes
            }
            
            // Set up error handling
            this.step('Setting up global error handling...');
            this.setupGlobalErrorHandling();
            
            // Mark as ready
            this.step('Application ready for use');
            document.body.classList.add('app-ready');
            
        } catch (error) {
            console.error('Finalization failed:', error);
        }
    },

    /**
     * Populate form fields from app state
     */
    populateFormFields() {
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
        
        Object.keys(formFields).forEach(fieldName => {
            DOMManager.setValue(fieldName, formFields[fieldName]);
        });
    },

    /**
     * Setup form event handlers
     */
    setupFormEventHandlers() {
        // Project info form handlers
        const formFields = ['projectName', 'startDate', 'endDate', 'projectManager', 'projectDescription'];
        
        formFields.forEach(fieldName => {
            const element = DOMManager.get(fieldName);
            if (element) {
                element.addEventListener('input', (e) => {
                    AppState.updateProjectInfo(fieldName, e.target.value);
                    if (fieldName === 'startDate' || fieldName === 'endDate') {
                        if (window.updateMonthHeaders) {
                            updateMonthHeaders();
                        }
                    }
                    if (window.updateSummary) {
                        updateSummary();
                    }
                });
            }
        });
        
        // Contingency percentage handler
        const contingencyEl = DOMManager.get('contingencyPercentage');
        if (contingencyEl) {
            contingencyEl.addEventListener('input', (e) => {
                AppState.setContingencyPercentage(parseFloat(e.target.value) || 0);
                if (window.updateSummary) {
                    updateSummary();
                }
            });
        }
    },

    /**
     * Setup button event handlers
     */
    setupButtonEventHandlers() {
        // Main action buttons
        const buttonHandlers = {
            saveBtn: () => this.handleSave(),
            loadBtn: () => this.handleLoad(),
            exportBtn: () => this.handleExport(),
            newProjectBtn: () => this.handleNewProject(),
            downloadBtn: () => this.handleDownload(),
            printBtn: () => this.handlePrint()
        };
        
        Object.keys(buttonHandlers).forEach(buttonName => {
            const button = DOMManager.get(buttonName);
            if (button) {
                button.addEventListener('click', buttonHandlers[buttonName]);
            }
        });
        
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
        
        addButtons.forEach(btn => {
            const element = DOMManager.get(btn.id);
            if (element) {
                element.addEventListener('click', () => {
                    if (window.openModal) {
                        openModal(btn.title, btn.type);
                    }
                });
            }
        });
    },

    /**
     * Setup modal event handlers
     */
    setupModalEventHandlers() {
        const modal = DOMManager.get('modal');
        const closeModal = DOMManager.get('closeModal');
        const cancelModal = DOMManager.get('cancelModal');
        const modalForm = DOMManager.get('modalForm');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                DOMManager.hide('modal');
            });
        }
        
        if (cancelModal) {
            cancelModal.addEventListener('click', () => {
                DOMManager.hide('modal');
            });
        }
        
        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    DOMManager.hide('modal');
                }
            });
        }
        
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (window.handleModalSubmit) {
                    handleModalSubmit();
                }
            });
        }
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.handleSave();
            }
            
            // Ctrl+N for new project
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.handleNewProject();
            }
            
            // Ctrl+P to print
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                this.handlePrint();
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                const modal = DOMManager.get('modal');
                if (modal && modal.style.display === 'block') {
                    DOMManager.hide('modal');
                }
            }
        });
    },

    /**
     * Setup global error handling
     */
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            DOMManager.showAlert('An unexpected error occurred. Please check the console for details.', 'error');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            DOMManager.showAlert('An unexpected error occurred. Please check the console for details.', 'error');
        });
    },

    /**
     * Button handler methods
     */
    handleSave() {
        if (AppState.saveToStorage()) {
            DOMManager.showAlert('Project saved successfully!', 'success');
        } else {
            DOMManager.showAlert('Failed to save project.', 'error');
        }
    },

    handleLoad() {
        if (window.loadProject) {
            loadProject();
        }
    },

    handleExport() {
        if (window.exportToExcel) {
            exportToExcel();
        }
    },

    handleNewProject() {
        if (window.newProject) {
            newProject();
        }
    },

    handleDownload() {
        if (window.downloadProject) {
            downloadProject();
        }
    },

    handlePrint() {
        if (window.printReport) {
            printReport();
        }
    },

    /**
     * Utility methods
     */
    step(message) {
        console.log(`  ✓ ${message}`);
        this.initializationSteps.push(message);
    },

    log(message) {
        console.log(message);
    },

    showInitializationSummary() {
        console.log('\n=== Initialization Summary ===');
        console.log(`Steps completed: ${this.initializationSteps.length}`);
        console.log('Modules status:');
        console.log('  - DOMManager:', DOMManager.initialized ? '✓' : '✗');
        console.log('  - AppState:', AppState.initialized ? '✓' : '✗');
        console.log('  - Navigation:', Navigation.initialized ? '✓' : '✗');
        
        const diagnostics = this.getDiagnostics();
        console.log('Application ready:', diagnostics.ready);
    },

    showInitializationError(error) {
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'initialization-error';
        errorDiv.innerHTML = `
            <h2>Application Initialization Failed</h2>
            <p>There was an error starting the application: ${error.message}</p>
            <p>Please refresh the page and try again. If the problem persists, check the browser console for details.</p>
            <button onclick="location.reload()">Refresh Page</button>
        `;
        errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; padding: 20px; border: 2px solid #dc3545;
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000; max-width: 500px; text-align: center;
        `;
        
        document.body.appendChild(errorDiv);
    },

    /**
     * Get application diagnostics
     */
    getDiagnostics() {
        return {
            initialized: this.initialized,
            ready: this.initialized && DOMManager.initialized && AppState.initialized && Navigation.initialized,
            modules: {
                domManager: DOMManager.getDiagnostics ? DOMManager.getDiagnostics() : { initialized: !!DOMManager.initialized },
                appState: AppState.getDiagnostics ? AppState.getDiagnostics() : { initialized: !!AppState.initialized },
                navigation: Navigation.getDiagnostics ? Navigation.getDiagnostics() : { initialized: !!Navigation.initialized }
            },
            initializationSteps: this.initializationSteps
        };
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}

// Make available globally
window.App = App;