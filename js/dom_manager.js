// dom-manager.js - Centralized DOM Element Management
// ============================================================================

const DOMManager = {
    elements: {},
    initialized: false,

    /**
     * Initialize DOM manager and cache all elements
     */
    init() {
        try {
            this.cacheElements();
            this.validateCriticalElements();
            this.initialized = true;
            console.log('DOMManager initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing DOMManager:', error);
            return false;
        }
    },

    /**
     * Cache all DOM elements for efficient access
     */
    cacheElements() {
        // Navigation elements
        this.elements.tabButtons = document.querySelectorAll('.tab-btn');
        this.elements.tabContents = document.querySelectorAll('.tab-content');

        // Modal elements
        this.elements.modal = document.getElementById('modal');
        this.elements.modalContent = document.querySelector('.modal-content');
        this.elements.modalTitle = document.getElementById('modalTitle');
        this.elements.modalForm = document.getElementById('modalForm');
        this.elements.modalFields = document.getElementById('modalFields');
        this.elements.closeModal = document.querySelector('.close');
        this.elements.cancelModal = document.getElementById('cancelModal');

        // Form elements
        this.elements.projectName = document.getElementById('projectName');
        this.elements.startDate = document.getElementById('startDate');
        this.elements.endDate = document.getElementById('endDate');
        this.elements.projectManager = document.getElementById('projectManager');
        this.elements.projectDescription = document.getElementById('projectDescription');
        this.elements.contingencyPercentage = document.getElementById('contingencyPercentage');

        // Summary display elements
        this.elements.totalProjectCost = document.getElementById('totalProjectCost');
        this.elements.totalInternalCost = document.getElementById('totalInternalCost');
        this.elements.totalExternalCost = document.getElementById('totalExternalCost');
        this.elements.contingencyAmount = document.getElementById('contingencyAmount');

        // Summary tab elements
        this.elements.summaryInternalCost = document.getElementById('summaryInternalCost');
        this.elements.summaryVendorCost = document.getElementById('summaryVendorCost');
        this.elements.summaryToolCost = document.getElementById('summaryToolCost');
        this.elements.summaryMiscCost = document.getElementById('summaryMiscCost');
        this.elements.summarySubtotal = document.getElementById('summarySubtotal');
        this.elements.summaryContingency = document.getElementById('summaryContingency');
        this.elements.summaryTotal = document.getElementById('summaryTotal');

        // Table body elements
        this.elements.internalResourcesTable = document.getElementById('internalResourcesTable');
        this.elements.vendorCostsTable = document.getElementById('vendorCostsTable');
        this.elements.toolCostsTable = document.getElementById('toolCostsTable');
        this.elements.miscCostsTable = document.getElementById('miscCostsTable');
        this.elements.risksTable = document.getElementById('risksTable');
        this.elements.internalRatesTable = document.getElementById('internalRatesTable');
        this.elements.externalRatesTable = document.getElementById('externalRatesTable');
        this.elements.rateCardsTable = document.getElementById('rateCardsTable');
        this.elements.forecastTable = document.getElementById('forecastTable');

        // Button elements
        this.elements.saveBtn = document.getElementById('saveBtn');
        this.elements.loadBtn = document.getElementById('loadBtn');
        this.elements.exportBtn = document.getElementById('exportBtn');
        this.elements.newProjectBtn = document.getElementById('newProjectBtn');
        this.elements.downloadBtn = document.getElementById('downloadBtn');
        this.elements.printBtn = document.getElementById('printBtn');

        // Add buttons
        this.elements.addInternalResource = document.getElementById('addInternalResource');
        this.elements.addVendorCost = document.getElementById('addVendorCost');
        this.elements.addToolCost = document.getElementById('addToolCost');
        this.elements.addMiscCost = document.getElementById('addMiscCost');
        this.elements.addRisk = document.getElementById('addRisk');
        this.elements.addInternalRate = document.getElementById('addInternalRate');
        this.elements.addExternalRate = document.getElementById('addExternalRate');
        this.elements.addRate = document.getElementById('addRate');

        // Content area
        this.elements.content = document.querySelector('.content');
        this.elements.appContainer = document.querySelector('.app-container');

        console.log('DOM elements cached:', Object.keys(this.elements).length, 'elements');
    },

    /**
     * Validate that critical elements exist
     */
    validateCriticalElements() {
        const critical = [
            'tabButtons', 'tabContents', 'modal', 'modalForm',
            'projectName', 'startDate', 'endDate'
        ];

        const missing = critical.filter(elementName => {
            const element = this.elements[elementName];
            return !element || (element.length !== undefined && element.length === 0);
        });

        if (missing.length > 0) {
            console.warn('Missing critical DOM elements:', missing);
            return false;
        }

        console.log('All critical DOM elements validated successfully');
        return true;
    },

    /**
     * Get cached element by name
     */
    get(elementName) {
        if (!this.initialized) {
            console.warn('DOMManager not initialized. Call init() first.');
            return null;
        }

        return this.elements[elementName] || null;
    },

    /**
     * Get element by ID (with caching)
     */
    getElementById(id) {
        // Check cache first
        for (const [key, value] of Object.entries(this.elements)) {
            if (value && value.id === id) {
                return value;
            }
        }

        // Fallback to document.getElementById
        return document.getElementById(id);
    },

    /**
     * Find elements by selector
     */
    querySelector(selector) {
        return document.querySelector(selector);
    },

    /**
     * Find multiple elements by selector
     */
    querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Check if element exists and is visible
     */
    isElementVisible(elementName) {
        const element = this.get(elementName);
        if (!element) return false;

        return element.offsetWidth > 0 && element.offsetHeight > 0;
    },

    /**
     * Show element
     */
    show(elementName) {
        const element = this.get(elementName);
        if (element) {
            element.style.display = '';
        }
    },

    /**
     * Hide element
     */
    hide(elementName) {
        const element = this.get(elementName);
        if (element) {
            element.style.display = 'none';
        }
    },

    /**
     * Add CSS class to element
     */
    addClass(elementName, className) {
        const element = this.get(elementName);
        if (element) {
            element.classList.add(className);
        }
    },

    /**
     * Remove CSS class from element
     */
    removeClass(elementName, className) {
        const element = this.get(elementName);
        if (element) {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle CSS class on element
     */
    toggleClass(elementName, className) {
        const element = this.get(elementName);
        if (element) {
            element.classList.toggle(className);
        }
    },

    /**
     * Set element text content
     */
    setText(elementName, text) {
        const element = this.get(elementName);
        if (element) {
            element.textContent = text;
        }
    },

    /**
     * Set element HTML content
     */
    setHTML(elementName, html) {
        const element = this.get(elementName);
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Get element value
     */
    getValue(elementName) {
        const element = this.get(elementName);
        return element ? element.value : null;
    },

    /**
     * Set element value
     */
    setValue(elementName, value) {
        const element = this.get(elementName);
        if (element) {
            element.value = value;
        }
    },

    /**
     * Create and insert alert element
     */
    showAlert(message, type = 'info') {
        try {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;

            const content = this.get('content');
            if (content) {
                content.insertBefore(alert, content.firstChild);

                // Auto-remove after 5 seconds
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
    },

    /**
     * Refresh cache for specific element
     */
    refreshElement(elementName, selector) {
        if (selector) {
            this.elements[elementName] = document.querySelector(selector);
        } else {
            // Try to find by ID
            const id = elementName.replace(/([A-Z])/g, '-$1').toLowerCase();
            this.elements[elementName] = document.getElementById(id);
        }
    },

    /**
     * Get diagnostic information
     */
    getDiagnostics() {
        const total = Object.keys(this.elements).length;
        const existing = Object.values(this.elements).filter(el => el !== null).length;
        const missing = total - existing;

        return {
            total,
            existing,
            missing,
            initialized: this.initialized,
            missingElements: Object.entries(this.elements)
                .filter(([key, value]) => value === null)
                .map(([key]) => key)
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMManager;
}

// Make available globally
window.DOMManager = DOMManager;