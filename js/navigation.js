// navigation.js - Tab Navigation & UI State Management
// ============================================================================

const Navigation = {
    currentTab: 'project-info',
    initialized: false,
    
    // Tab configuration
    tabs: {
        'project-info': { title: 'Project Info', refreshOnShow: false },
        'summary': { title: 'Summary', refreshOnShow: true },
        'resource-plan': { title: 'Resource Plan', refreshOnShow: true },
        'internal-resources': { title: 'Internal Resources', refreshOnShow: false },
        'vendor-costs': { title: 'Vendor Costs', refreshOnShow: false },
        'tool-costs': { title: 'Tool Costs', refreshOnShow: false },
        'miscellaneous': { title: 'Miscellaneous', refreshOnShow: false },
        'risks': { title: 'Risks & Contingency', refreshOnShow: false },
        'rate-cards': { title: 'Rate Cards', refreshOnShow: false }
    },

    /**
     * Initialize navigation system
     */
    init() {
        try {
            if (!this.validateDependencies()) {
                console.error('Navigation dependencies not met');
                return false;
            }

            this.bindEvents();
            this.setActiveTab(this.currentTab);
            this.initialized = true;
            
            console.log('Navigation initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Navigation:', error);
            return false;
        }
    },

    /**
     * Validate that required dependencies are available
     */
    validateDependencies() {
        if (!window.DOMManager || !DOMManager.initialized) {
            console.error('DOMManager is required and must be initialized first');
            return false;
        }

        const tabButtons = DOMManager.get('tabButtons');
        const tabContents = DOMManager.get('tabContents');

        if (!tabButtons || tabButtons.length === 0) {
            console.error('No tab buttons found');
            return false;
        }

        if (!tabContents || tabContents.length === 0) {
            console.error('No tab contents found');
            return false;
        }

        return true;
    },

    /**
     * Bind navigation events
     */
    bindEvents() {
        const tabButtons = DOMManager.get('tabButtons');
        
        if (tabButtons) {
            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetTab = button.getAttribute('data-tab');
                    if (targetTab) {
                        this.switchTab(targetTab);
                    }
                });
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                const tabKeys = {
                    '1': 'project-info',
                    '2': 'summary',
                    '3': 'resource-plan',
                    '4': 'internal-resources',
                    '5': 'vendor-costs',
                    '6': 'tool-costs',
                    '7': 'miscellaneous',
                    '8': 'risks',
                    '9': 'rate-cards'
                };

                if (tabKeys[e.key]) {
                    e.preventDefault();
                    this.switchTab(tabKeys[e.key]);
                }
            }
        });

        console.log('Navigation events bound successfully');
    },

    /**
     * Switch to a specific tab
     */
    switchTab(targetTab) {
        try {
            // Validate tab exists
            if (!this.tabs[targetTab]) {
                console.warn(`Tab '${targetTab}' does not exist`);
                return false;
            