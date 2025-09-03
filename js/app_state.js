// app-state.js - Application State Management
// ============================================================================

const AppState = {
    // Application data
    projectData: {
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
    },

    // State tracking
    initialized: false,
    isDirty: false, // Has unsaved changes

    /**
     * Initialize application state
     */
    init() {
        try {
            this.loadFromStorage();
            this.initialized = true;
            console.log('AppState initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing AppState:', error);
            return false;
        }
    },

    /**
     * Get entire project data
     */
    getProjectData() {
        return this.projectData;
    },

    /**
     * Set entire project data
     */
    setProjectData(data) {
        this.projectData = { ...this.projectData, ...data };
        this.markDirty();
        return this.projectData;
    },

    /**
     * Get project info
     */
    getProjectInfo() {
        return this.projectData.projectInfo;
    },

    /**
     * Update project info field
     */
    updateProjectInfo(field, value) {
        if (this.projectData.projectInfo.hasOwnProperty(field)) {
            this.projectData.projectInfo[field] = value;
            this.markDirty();
            return true;
        }
        console.warn(`Field ${field} does not exist in project info`);
        return false;
    },

    /**
     * Get specific resource array
     */
    getResources(type) {
        const validTypes = ['internalResources', 'vendorCosts', 'toolCosts', 'miscCosts', 'risks', 'rateCards'];
        if (validTypes.includes(type)) {
            return this.projectData[type] || [];
        }
        console.warn(`Invalid resource type: ${type}`);
        return [];
    },

    /**
     * Add resource to specific array
     */
    addResource(type, resourceData) {
        const validTypes = ['internalResources', 'vendorCosts', 'toolCosts', 'miscCosts', 'risks', 'rateCards'];
        
        if (!validTypes.includes(type)) {
            console.warn(`Invalid resource type: ${type}`);
            return false;
        }

        if (!this.projectData[type]) {
            this.projectData[type] = [];
        }

        // Add unique ID if not present
        if (!resourceData.id) {
            resourceData.id = this.generateId();
        }

        this.projectData[type].push(resourceData);
        
        // Handle rate cards backward compatibility
        if (type === 'rateCards') {
            this.updateLegacyRateArrays(resourceData);
        }

        this.markDirty();
        return resourceData.id;
    },

    /**
     * Update resource in specific array
     */
    updateResource(type, id, updatedData) {
        const resources = this.getResources(type);
        const index = resources.findIndex(item => item.id === id);
        
        if (index === -1) {
            console.warn(`Resource with id ${id} not found in ${type}`);
            return false;
        }

        this.projectData[type][index] = { ...this.projectData[type][index], ...updatedData };
        this.markDirty();
        return true;
    },

    /**
     * Remove resource from specific array
     */
    removeResource(type, id) {
        if (!this.projectData[type]) {
            return false;
        }

        const initialLength = this.projectData[type].length;
        
        if (type === 'rateCards' || type === 'internalRates' || type === 'externalRates') {
            // Handle rate cards with string or numeric ID
            this.projectData.rateCards = this.projectData.rateCards.filter(item => 
                (item.id && item.id !== id) || (item.role !== id)
            );
            
            // Also remove from legacy arrays
            if (this.projectData.internalRates) {
                this.projectData.internalRates = this.projectData.internalRates.filter(item => 
                    (item.id && item.id !== id) || (item.role !== id)
                );
            }
            if (this.projectData.externalRates) {
                this.projectData.externalRates = this.projectData.externalRates.filter(item => 
                    (item.id && item.id !== id) || (item.role !== id)
                );
            }
        } else {
            this.projectData[type] = this.projectData[type].filter(item => item.id !== id);
        }

        const removed = this.projectData[type].length < initialLength;
        if (removed) {
            this.markDirty();
        }
        return removed;
    },

    /**
     * Get contingency percentage
     */
    getContingencyPercentage() {
        return this.projectData.contingencyPercentage || 10;
    },

    /**
     * Set contingency percentage
     */
    setContingencyPercentage(percentage) {
        this.projectData.contingencyPercentage = Math.max(0, Math.min(100, percentage));
        this.markDirty();
        return this.projectData.contingencyPercentage;
    },

    /**
     * Update legacy rate arrays when rate cards change
     */
    updateLegacyRateArrays(rateCard) {
        if (rateCard.category === 'Internal') {
            if (!this.projectData.internalRates) {
                this.projectData.internalRates = [];
            }
            const existing = this.projectData.internalRates.find(r => r.role === rateCard.role);
            if (!existing) {
                this.projectData.internalRates.push({
                    id: rateCard.id,
                    role: rateCard.role,
                    rate: rateCard.rate
                });
            }
        } else if (rateCard.category === 'External') {
            if (!this.projectData.externalRates) {
                this.projectData.externalRates = [];
            }
            const existing = this.projectData.externalRates.find(r => r.role === rateCard.role);
            if (!existing) {
                this.projectData.externalRates.push({
                    id: rateCard.id,
                    role: rateCard.role,
                    rate: rateCard.rate
                });
            }
        }
    },

    /**
     * Reset to default state
     */
    reset() {
        const defaultData = {
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

        this.projectData = defaultData;
        this.markDirty();
        return this.projectData;
    },

    /**
     * Validate project data
     */
    validate() {
        const errors = [];

        // Validate project info
        if (!this.projectData.projectInfo.projectName) {
            errors.push('Project name is required');
        }

        if (!this.projectData.projectInfo.startDate) {
            errors.push('Start date is required');
        }

        if (!this.projectData.projectInfo.endDate) {
            errors.push('End date is required');
        }

        if (this.projectData.projectInfo.startDate && this.projectData.projectInfo.endDate) {
            const start = new Date(this.projectData.projectInfo.startDate);
            const end = new Date(this.projectData.projectInfo.endDate);
            if (end <= start) {
                errors.push('End date must be after start date');
            }
        }

        // Validate at least one resource type
        const hasResources = this.projectData.internalResources.length > 0 ||
                           this.projectData.vendorCosts.length > 0 ||
                           this.projectData.toolCosts.length > 0;

        if (!hasResources) {
            errors.push('At least one resource type must be added');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * Save to localStorage
     */
    saveToStorage() {
        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.setItem('ictProjectData', JSON.stringify(this.projectData));
                this.isDirty = false;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Load from localStorage
     */
    loadFromStorage() {
        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                const savedData = localStorage.getItem('ictProjectData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    this.projectData = { ...this.projectData, ...parsed };
                    
                    // Migrate old rate cards if needed
                    this.migrateRateCards();
                    
                    this.isDirty = false;
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return false;
        }
    },

    /**
     * Migrate old rate card format to new unified format
     */
    migrateRateCards() {
        if (!this.projectData.rateCards && (this.projectData.internalRates || this.projectData.externalRates)) {
            this.projectData.rateCards = [];

            // Migrate internal rates
            if (this.projectData.internalRates) {
                this.projectData.internalRates.forEach(rate => {
                    this.projectData.rateCards.push({
                        id: rate.id || this.generateId(),
                        role: rate.role,
                        rate: rate.rate,
                        category: 'Internal'
                    });
                });
            }

            // Migrate external rates
            if (this.projectData.externalRates) {
                this.projectData.externalRates.forEach(rate => {
                    this.projectData.rateCards.push({
                        id: rate.id || this.generateId(),
                        role: rate.role,
                        rate: rate.rate,
                        category: 'External'
                    });
                });
            }

            console.log('Migrated rate cards to unified format');
        }
    },

    /**
     * Clear localStorage
     */
    clearStorage() {
        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.removeItem('ictProjectData');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Mark state as dirty (has unsaved changes)
     */
    markDirty() {
        this.isDirty = true;
    },

    /**
     * Check if state has unsaved changes
     */
    hasUnsavedChanges() {
        return this.isDirty;
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now() + Math.random();
    },

    /**
     * Get state diagnostics
     */
    getDiagnostics() {
        return {
            initialized: this.initialized,
            isDirty: this.isDirty,
            projectName: this.projectData.projectInfo.projectName,
            resourceCounts: {
                internal: this.projectData.internalResources.length,
                vendor: this.projectData.vendorCosts.length,
                tools: this.projectData.toolCosts.length,
                misc: this.projectData.miscCosts.length,
                risks: this.projectData.risks.length,
                rateCards: this.projectData.rateCards.length
            },
            validation: this.validate()
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppState;
}

// Make available globally
window.AppState = AppState;