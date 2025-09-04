// Data Manager Module
// Handles all data persistence, import/export, and file operations

class DataManager {
    constructor() {
        console.log('Data Manager initialized');
    }

    // Load data from localStorage
    loadDefaultData() {
        try {
            if (typeof(Storage) !== "undefined" && localStorage) {
                const savedData = localStorage.getItem('ictProjectData');
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    
                    // Get current projectData reference
                    const currentProjectData = window.projectData || {};
                    
                    // Merge with existing data
                    const mergedData = { ...currentProjectData, ...parsed };
                    
                    // Update global reference
                    window.projectData = mergedData;
                    
                    // Migrate old rate cards to new unified format if needed
                    if (!mergedData.rateCards && (mergedData.internalRates || mergedData.externalRates)) {
                        mergedData.rateCards = [];
                        
                        // Migrate internal rates
                        if (mergedData.internalRates) {
                            mergedData.internalRates.forEach(rate => {
                                mergedData.rateCards.push({
                                    id: rate.id || Date.now() + Math.random(),
                                    role: rate.role,
                                    rate: rate.rate,
                                    category: 'Internal'
                                });
                            });
                        }
                        
                        // Migrate external rates
                        if (mergedData.externalRates) {
                            mergedData.externalRates.forEach(rate => {
                                mergedData.rateCards.push({
                                    id: rate.id || Date.now() + Math.random(),
                                    role: rate.role,
                                    rate: rate.rate,
                                    category: 'External'
                                });
                            });
                        }
                        
                        // Update global reference after migration
                        window.projectData = mergedData;
                    }
                    
                    // Populate form fields
                    this.populateFormFields(mergedData);
                    
                    console.log('Data loaded from localStorage:', {
                        vendorCosts: mergedData.vendorCosts?.length || 0,
                        toolCosts: mergedData.toolCosts?.length || 0,
                        internalResources: mergedData.internalResources?.length || 0
                    });
                    
                    return mergedData;
                }
            }
            return window.projectData || {};
        } catch (e) {
            console.error('Error loading saved data:', e);
            return window.projectData || {};
        }
    }

    // Populate form fields with project data
    populateFormFields(projectData) {
        const formFields = {
            projectName: projectData.projectInfo?.projectName || '',
            startDate: projectData.projectInfo?.startDate || '',
            endDate: projectData.projectInfo?.endDate || '',
            projectManager: projectData.projectInfo?.projectManager || '',
            projectDescription: projectData.projectInfo?.projectDescription || '',
            contingencyPercentage: projectData.contingencyPercentage || 10
        };
        
        Object.keys(formFields).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = formFields[id];
            }
        });
    }

    // Save project to localStorage
    saveProject() {
        try {
            const projectData = window.projectData;
            if (!projectData) {
                console.error('No project data to save');
                return false;
            }

            if (typeof(Storage) !== "undefined" && localStorage) {
                localStorage.setItem('ictProjectData', JSON.stringify(projectData));
                if (window.domManager) {
                    window.domManager.showAlert('Project saved to browser storage successfully!', 'success');
                }
                return true;
            } else {
                if (window.domManager) {
                    window.domManager.showAlert('Local storage not available. Cannot save project.', 'error');
                }
                return false;
            }
        } catch (e) {
            console.error('Error saving project:', e);
            if (window.domManager) {
                window.domManager.showAlert('Error saving project: ' + e.message, 'error');
            }
            return false;
        }
    }

    // Download project as JSON file
    downloadProject() {
        try {
            const projectData = window.projectData;
            if (!projectData) {
                console.error('No project data to download');
                return false;
            }

            const dataStr = JSON.stringify(projectData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `ICT_Project_${projectData.projectInfo?.projectName || 'Untitled'}.json`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            if (window.domManager) {
                window.domManager.showAlert('Project file downloaded successfully!', 'success');
            }
            return true;
        } catch (error) {
            console.error('Error downloading project:', error);
            if (window.domManager) {
                window.domManager.showAlert('Error downloading project file: ' + error.message, 'error');
            }
            return false;
        }
    }

    // Create a new project (reset to initial state)
    newProject() {
        if (confirm('Are you sure you want to start a new project? This will clear all current data. Make sure to save or download your current project first.')) {
            try {
                // Reset project data to initial state
                const newProjectData = {
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
                
                // Update global reference
                window.projectData = newProjectData;
                
                // Clear form fields
                this.populateFormFields(newProjectData);
                
                // Clear localStorage
                if (typeof(Storage) !== "undefined" && localStorage) {
                    localStorage.removeItem('ictProjectData');
                }
                
                // Re-render all tables and summaries
                if (window.renderAllTables) window.renderAllTables();
                if (window.updateSummary) window.updateSummary();
                if (window.domManager) {
                    window.domManager.updateMonthHeaders();
                    window.domManager.switchTab('project-info');
                    window.domManager.showAlert('New project started successfully! Please enter your project information.', 'success');
                }
                
                console.log('New project created');
                return true;
                
            } catch (error) {
                console.error('Error creating new project:', error);
                if (window.domManager) {
                    window.domManager.showAlert('Error creating new project: ' + error.message, 'error');
                }
                return false;
            }
        }
        return false;
    }

    // Load project from file
    loadProject() {
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
                        const currentProjectData = window.projectData || {};
                        const mergedData = { ...currentProjectData, ...data };
                        
                        window.projectData = mergedData;
                        
                        // Reload and re-render
                        this.loadDefaultData();
                        if (window.renderAllTables) window.renderAllTables();
                        if (window.updateSummary) window.updateSummary();
                        if (window.domManager) {
                            window.domManager.updateMonthHeaders();
                            window.domManager.showAlert('Project loaded successfully!', 'success');
                        }
                    } catch (err) {
                        console.error('Error loading project:', err);
                        if (window.domManager) {
                            window.domManager.showAlert('Error loading project file: ' + err.message, 'error');
                        }
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Export project to Excel/CSV
    exportToExcel() {
        try {
            const csvContent = this.generateCSVExport();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const projectData = window.projectData;
            link.setAttribute('href', url);
            link.setAttribute('download', `ICT_Cost_Estimate_${projectData?.projectInfo?.projectName || 'Project'}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            if (window.domManager) {
                window.domManager.showAlert('Export completed successfully!', 'success');
            }
            return true;
        } catch (error) {
            console.error('Error exporting:', error);
            if (window.domManager) {
                window.domManager.showAlert('Error exporting project: ' + error.message, 'error');
            }
            return false;
        }
    }

    // Generate CSV export content
    generateCSVExport() {
        const projectData = window.projectData || {};
        const months = window.calculateProjectMonths ? window.calculateProjectMonths() : 
                      ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
        
        let csv = 'ICT Project Cost Estimate Export\n\n';
        
        // Project Info
        csv += 'PROJECT INFORMATION\n';
        csv += `Project Name,"${projectData.projectInfo?.projectName || ''}"\n`;
        csv += `Start Date,"${projectData.projectInfo?.startDate || ''}"\n`;
        csv += `End Date,"${projectData.projectInfo?.endDate || ''}"\n`;
        csv += `Project Manager,"${projectData.projectInfo?.projectManager || ''}"\n`;
        csv += `Description,"${projectData.projectInfo?.projectDescription || ''}"\n\n`;
        
        // Rate Cards
        csv += 'RATE CARDS\n';
        csv += 'Role,Category,Daily Rate\n';
        if (projectData.rateCards) {
            projectData.rateCards.forEach(rate => {
                csv += `"${rate.role}","${rate.category}",${rate.rate}\n`;
            });
        }
        
        // Internal Resources
        csv += '\nINTERNAL RESOURCES\n';
        csv += `Role,Rate Card,Daily Rate,${months[0]} Days,${months[1]} Days,${months[2]} Days,${months[3]} Days,Total Cost\n`;
        if (projectData.internalResources) {
            projectData.internalResources.forEach(resource => {
                const month1Days = resource.month1Days || resource.q1Days || 0;
                const month2Days = resource.month2Days || resource.q2Days || 0;
                const month3Days = resource.month3Days || resource.q3Days || 0;
                const month4Days = resource.month4Days || resource.q4Days || 0;
                const totalCost = (month1Days + month2Days + month3Days + month4Days) * resource.dailyRate;
                csv += `"${resource.role}","${resource.rateCard}",${resource.dailyRate},${month1Days},${month2Days},${month3Days},${month4Days},${totalCost}\n`;
            });
        }
        
        // Vendor Costs
        csv += '\nVENDOR COSTS\n';
        csv += `Vendor,Description,Category,${months[0]} Cost,${months[1]} Cost,${months[2]} Cost,${months[3]} Cost,Total Cost\n`;
        if (projectData.vendorCosts) {
            projectData.vendorCosts.forEach(vendor => {
                const month1Cost = vendor.month1Cost || vendor.q1Cost || 0;
                const month2Cost = vendor.month2Cost || vendor.q2Cost || 0;
                const month3Cost = vendor.month3Cost || vendor.q3Cost || 0;
                const month4Cost = vendor.month4Cost || vendor.q4Cost || 0;
                const totalCost = month1Cost + month2Cost + month3Cost + month4Cost;
                csv += `"${vendor.vendor}","${vendor.description}","${vendor.category}",${month1Cost},${month2Cost},${month3Cost},${month4Cost},${totalCost}\n`;
            });
        }
        
        // Tool Costs
        csv += '\nTOOL COSTS\n';
        csv += 'Tool/Software,License Type,Users/Licenses,Monthly Cost,Duration (Months),Total Cost\n';
        if (projectData.toolCosts) {
            projectData.toolCosts.forEach(tool => {
                const totalCost = tool.users * tool.monthlyCost * tool.duration;
                csv += `"${tool.tool}","${tool.licenseType}",${tool.users},${tool.monthlyCost},${tool.duration},${totalCost}\n`;
            });
        }
        
        // Miscellaneous Costs
        csv += '\nMISCELLANEOUS COSTS\n';
        csv += 'Item,Description,Category,Cost\n';
        if (projectData.miscCosts) {
            projectData.miscCosts.forEach(misc => {
                csv += `"${misc.item}","${misc.description}","${misc.category}",${misc.cost}\n`;
            });
        }
        
        // Risks
        csv += '\nRISKS\n';
        csv += 'Description,Probability,Impact,Risk Score,Mitigation Cost\n';
        if (projectData.risks) {
            projectData.risks.forEach(risk => {
                const riskScore = risk.probability * risk.impact;
                csv += `"${risk.description}",${risk.probability},${risk.impact},${riskScore},${risk.mitigationCost}\n`;
            });
        }
        
        // Summary
        csv += '\nPROJECT SUMMARY\n';
        const internalTotal = window.calculateInternalResourcesTotal ? window.calculateInternalResourcesTotal() : 0;
        const vendorTotal = window.calculateVendorCostsTotal ? window.calculateVendorCostsTotal() : 0;
        const toolTotal = window.calculateToolCostsTotal ? window.calculateToolCostsTotal() : 0;
        const miscTotal = window.calculateMiscCostsTotal ? window.calculateMiscCostsTotal() : 0;
        const subtotal = internalTotal + vendorTotal + toolTotal + miscTotal;
        const contingency = subtotal * ((projectData.contingencyPercentage || 10) / 100);
        const total = subtotal + contingency;
        
        csv += `Internal Resources,${internalTotal}\n`;
        csv += `Vendor Costs,${vendorTotal}\n`;
        csv += `Tool Costs,${toolTotal}\n`;
        csv += `Miscellaneous,${miscTotal}\n`;
        csv += `Subtotal,${subtotal}\n`;
        csv += `Contingency (${projectData.contingencyPercentage || 10}%),${contingency}\n`;
        csv += `Total Project Cost,${total}\n`;
        
        return csv;
    }
}

// Create and export data manager instance
const dataManager = new DataManager();

// Make it globally available
window.dataManager = dataManager;

// Export functions for backward compatibility
window.loadDefaultData = () => dataManager.loadDefaultData();
window.saveProject = () => dataManager.saveProject();
window.downloadProject = () => dataManager.downloadProject();
window.loadProject = () => dataManager.loadProject();
window.newProject = () => dataManager.newProject();
window.exportToExcel = () => dataManager.exportToExcel();
window.generateCSVExport = () => dataManager.generateCSVExport();

console.log('Data Manager module loaded');