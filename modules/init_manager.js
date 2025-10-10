// Initialization Manager
// Ensures proper loading order and dependency availability

class InitializationManager {
    constructor() {
        this.initialized = false;
        this.modules = {
            dataManager: false,
            tableRenderer: false,
            editManager: false,
            dynamicFormHelper: false,
            domManager: false,
            tableFixes: false,
            newProjectWelcome: false,
            currencyManager: false
        };
    }

    // Initialize project data structure
    initializeProjectData() {
        if (!window.projectData) {
            window.projectData = {
                projectInfo: {
                    projectName: '',
                    startDate: '',
                    endDate: '',
                    projectManager: '',
                    projectDescription: ''
                },
                currency: {
                    primaryCurrency: 'USD',
                    exchangeRates: []
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
                contingencyPercentage: 10
            };
            console.log('✓ Project data structure initialized');
        }
    }

    // Check if all required modules are loaded
    checkModules() {
        // Check for data manager
        this.modules.dataManager = !!(window.dataManager || window.DataManager);
        
        // Check for table renderer
        this.modules.tableRenderer = !!(window.tableRenderer || window.TableRenderer);
        
        // Check for edit manager
        this.modules.editManager = !!(window.editManager || window.EditManager);
        
        // Check for dynamic form helper
        this.modules.dynamicFormHelper = !!(window.dynamicFormHelper || window.DynamicFormHelper);
        
        // Check for DOM manager
        this.modules.domManager = !!(window.domManager || window.DOMManager);
        
        // Check for table fixes
        this.modules.tableFixes = !!(window.tableFixes || window.TableFixes);
        
        // Check for new project welcome
        this.modules.newProjectWelcome = !!(window.newProjectWelcome);

        const loaded = Object.entries(this.modules)
            .filter(([_, status]) => status)
            .map(([name, _]) => name);

         // Check for Currency Manager
         this.modules.currencyManager = !!(window.currencyManager || window.CurrencyManager);

        
        console.log('✓ Modules loaded:', loaded.join(', '));
        
        return this.modules;
    }

    // Wait for a function to be available
    waitForFunction(funcName, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkFunction = () => {
                if (typeof window[funcName] === 'function') {
                    resolve(window[funcName]);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for function: ${funcName}`));
                } else {
                    setTimeout(checkFunction, 50);
                }
            };
            
            checkFunction();
        });
    }

    // Initialize DOM Manager if available
    initializeDOMManager() {
        if (this.modules.domManager) {
            if (typeof window.DOMManager !== 'undefined' && typeof window.DOMManager.initialize === 'function') {
                console.log('Initializing DOMManager...');
                window.DOMManager.initialize();
            } else if (typeof window.domManager !== 'undefined') {
                if (typeof window.domManager.initialize === 'function') {
                    console.log('Initializing domManager...');
                    window.domManager.initialize();
                } else if (typeof window.domManager.init === 'function') {
                    console.log('Initializing domManager (init method)...');
                    window.domManager.init();
                }
            }
            console.log('✓ DOM Manager initialized');
            
            // ALWAYS also initialize basic functionality from script.js
            // This sets up tab listeners, button listeners, etc.
            if (typeof window.initializeBasicFunctionality === 'function') {
                console.log('Initializing basic event listeners from script.js...');
                window.initializeBasicFunctionality();
                console.log('✓ Basic event listeners initialized');
            }
        } else {
            console.log('DOM Manager not available, using fallback initialization');
            if (typeof window.initializeBasicFunctionality === 'function') {
                window.initializeBasicFunctionality();
            }
        }
    }

    // Initialize application in correct order
    async initialize() {
        if (this.initialized) {
            console.warn('Application already initialized');
            return;
        }

        console.log('🚀 Starting application initialization...');

        try {
            // Step 1: Initialize data structure
            this.initializeProjectData();

            // Step 2: Check which modules are available
            this.checkModules();

            // Step 3: Initialize DOM Manager
            this.initializeDOMManager();

            // Step 4: Wait for critical functions
            await this.waitForFunction('updateSummary');
            await this.waitForFunction('updateMonthHeaders');
            console.log('✓ Core functions available');

            // Step 5: Initialize Project Info Save Button
            if (typeof window.initializeProjectInfoSaveButton === 'function') {
                window.initializeProjectInfoSaveButton();
                console.log('✓ Project Info Save Button initialized');
            }

            // Step 6: Load data
            if (this.modules.dataManager) {
                if (window.DataManager && typeof window.DataManager.loadDefaultData === 'function') {
                    window.DataManager.loadDefaultData();
                } else if (window.dataManager && typeof window.dataManager.loadDefaultData === 'function') {
                    window.dataManager.loadDefaultData();
                }
                console.log('✓ Data loaded from storage');
            }

            // Step 7: Render tables
            if (this.modules.tableRenderer) {
                if (window.TableRenderer && typeof window.TableRenderer.renderAllTables === 'function') {
                    window.TableRenderer.renderAllTables();
                } else if (window.tableRenderer && typeof window.tableRenderer.renderAllTables === 'function') {
                    window.tableRenderer.renderAllTables();
                }
                console.log('✓ Tables rendered');
            }

            // Step 8: Update UI
            if (typeof window.updateSummary === 'function') {
                window.updateSummary();
            }
            if (typeof window.updateMonthHeaders === 'function') {
                window.updateMonthHeaders();
            }
            console.log('✓ UI updated');

            // Step 9: Initialize New Project Welcome if available
            if (this.modules.newProjectWelcome && typeof window.newProjectWelcome.initialize === 'function') {
                window.newProjectWelcome.initialize();
                console.log('✓ New Project Welcome initialized');
            }

            // Step 10: Initialize Currency Manager
            if (this.modules.currencyManager && typeof window.currencyManager.initialize === 'function') {
                window.currencyManager.initialize();
                console.log('✓ Step 11: Currency Manager initialized');
            } else {
                console.log('⚠ Step 11: Currency Manager not available');
            }
            
            // Step 11: Re-render after short delay for loaded data
            setTimeout(() => {
                if (this.modules.tableRenderer) {
                    if (window.TableRenderer && typeof window.TableRenderer.renderAllTables === 'function') {
                        window.TableRenderer.renderAllTables();
                    } else if (window.tableRenderer && typeof window.tableRenderer.renderAllTables === 'function') {
                        window.tableRenderer.renderAllTables();
                    }
                }
                if (typeof window.updateSummary === 'function') {
                    window.updateSummary();
                }
                console.log('✓ Final render complete');
            }, 100);

            this.initialized = true;
            console.log('✅ Application initialization complete');

        } catch (error) {
            console.error('❌ Error during initialization:', error);
            console.error('Stack trace:', error.stack);
            // Don't throw - try to continue with partial initialization
            this.initialized = true; // Mark as initialized to prevent retry loops
        }
    }
}

// Create global instance
window.initManager = new InitializationManager();

console.log('✓ Initialization Manager loaded');
