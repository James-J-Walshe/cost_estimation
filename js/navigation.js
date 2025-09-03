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
            }

            console.log(`Switching from '${this.currentTab}' to '${targetTab}'`);

            // Update active tab button
            this.updateActiveButton(targetTab);
            
            // Show target tab content
            this.showTabContent(targetTab);
            
            // Handle tab-specific actions
            this.handleTabSpecificActions(targetTab);
            
            // Update current tab
            this.currentTab = targetTab;
            
            // Trigger custom event
            this.triggerTabChangeEvent(targetTab);
            
            return true;
        } catch (error) {
            console.error('Error switching tabs:', error);
            return false;
        }
    },

    /**
     * Update active button styling
     */
    updateActiveButton(targetTab) {
        const tabButtons = DOMManager.get('tabButtons');
        
        if (tabButtons) {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to target button
            const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
                console.log(`Activated button for tab: ${targetTab}`);
            } else {
                console.warn(`Button for tab '${targetTab}' not found`);
            }
        }
    },

    /**
     * Show target tab content
     */
    showTabContent(targetTab) {
        const tabContents = DOMManager.get('tabContents');
        
        if (tabContents) {
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log(`Showed content for tab: ${targetTab}`);
            } else {
                console.warn(`Content for tab '${targetTab}' not found`);
            }
        }
    },

    /**
     * Handle tab-specific actions when switching
     */
    handleTabSpecificActions(targetTab) {
        const tabConfig = this.tabs[targetTab];
        
        // Refresh data if needed
        if (tabConfig.refreshOnShow) {
            this.refreshTabData(targetTab);
        }

        // Tab-specific logic
        switch (targetTab) {
            case 'summary':
                this.refreshSummary();
                break;
            case 'resource-plan':
                this.refreshResourcePlan();
                break;
            case 'rate-cards':
                this.refreshRateCards();
                break;
            default:
                // No specific action needed
                break;
        }
    },

    /**
     * Refresh data for specific tab
     */
    refreshTabData(targetTab) {
        try {
            switch (targetTab) {
                case 'summary':
                    if (window.updateSummary) {
                        window.updateSummary();
                    }
                    break;
                case 'resource-plan':
                    if (window.renderForecastTable) {
                        window.renderForecastTable();
                    }
                    if (window.updateSummary) {
                        window.updateSummary();
                    }
                    break;
                default:
                    console.log(`No specific refresh action for tab: ${targetTab}`);
            }
        } catch (error) {
            console.error(`Error refreshing data for tab ${targetTab}:`, error);
        }
    },

    /**
     * Refresh summary tab data
     */
    refreshSummary() {
        try {
            if (window.updateSummary) {
                window.updateSummary();
            }
            if (window.updateSummaryProjectInfo) {
                window.updateSummaryProjectInfo();
            }
            console.log('Summary tab refreshed');
        } catch (error) {
            console.error('Error refreshing summary:', error);
        }
    },

    /**
     * Refresh resource plan tab data
     */
    refreshResourcePlan() {
        try {
            if (window.renderForecastTable) {
                window.renderForecastTable();
            }
            if (window.updateMonthHeaders) {
                window.updateMonthHeaders();
            }
            console.log('Resource plan tab refreshed');
        } catch (error) {
            console.error('Error refreshing resource plan:', error);
        }
    },

    /**
     * Refresh rate cards tab data
     */
    refreshRateCards() {
        try {
            if (window.renderUnifiedRateCardsTable) {
                window.renderUnifiedRateCardsTable();
            }
            if (window.renderInternalRatesTable) {
                window.renderInternalRatesTable();
            }
            if (window.renderExternalRatesTable) {
                window.renderExternalRatesTable();
            }
            console.log('Rate cards tab refreshed');
        } catch (error) {
            console.error('Error refreshing rate cards:', error);
        }
    },

    /**
     * Set active tab (used during initialization)
     */
    setActiveTab(tabId) {
        if (this.tabs[tabId]) {
            this.switchTab(tabId);
        } else {
            console.warn(`Cannot set active tab to '${tabId}' - tab does not exist`);
            // Fallback to first available tab
            const firstTab = Object.keys(this.tabs)[0];
            if (firstTab) {
                this.switchTab(firstTab);
            }
        }
    },

    /**
     * Get current active tab
     */
    getCurrentTab() {
        return this.currentTab;
    },

    /**
     * Get all available tabs
     */
    getAvailableTabs() {
        return Object.keys(this.tabs);
    },

    /**
     * Check if tab is currently active
     */
    isTabActive(tabId) {
        return this.currentTab === tabId;
    },

    /**
     * Navigate to next tab
     */
    nextTab() {
        const tabs = this.getAvailableTabs();
        const currentIndex = tabs.indexOf(this.currentTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        this.switchTab(tabs[nextIndex]);
    },

    /**
     * Navigate to previous tab
     */
    previousTab() {
        const tabs = this.getAvailableTabs();
        const currentIndex = tabs.indexOf(this.currentTab);
        const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        this.switchTab(tabs[prevIndex]);
    },

    /**
     * Trigger custom tab change event
     */
    triggerTabChangeEvent(targetTab) {
        const event = new CustomEvent('tabChanged', {
            detail: {
                previousTab: this.currentTab,
                currentTab: targetTab,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    },

    /**
     * Get navigation diagnostics
     */
    getDiagnostics() {
        const tabButtons = DOMManager.get('tabButtons');
        const tabContents = DOMManager.get('tabContents');
        
        return {
            initialized: this.initialized,
            currentTab: this.currentTab,
            availableTabs: this.getAvailableTabs(),
            tabButtonsCount: tabButtons ? tabButtons.length : 0,
            tabContentsCount: tabContents ? tabContents.length : 0,
            activeButton: document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || null,
            activeContent: document.querySelector('.tab-content.active')?.id || null
        };
    },

    /**
     * Reset navigation to initial state
     */
    reset() {
        this.currentTab = 'project-info';
        this.setActiveTab(this.currentTab);
        console.log('Navigation reset to initial state');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}

// Make available globally
window.Navigation = Navigation;
