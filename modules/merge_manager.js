// modules/merge_manager.js
// Merge Manager - Handles merging specialist team estimates into master project
// Version: 1.1 - Syntax Errors Fixed

class MergeManager {
    constructor() {
        this.masterProject = null;
        this.specialistProject = null;
        this.mergeState = 'idle'; // idle, validated, dates-compared, ready-to-merge
        console.log('Merge Manager initialized');
    }

    initialize() {
        this.setupEventListeners();
        console.log('✓ Merge Manager ready');
    }

    setupEventListeners() {
        const mergeBtn = document.getElementById('mergeFileBtn');
        if (mergeBtn) {
            mergeBtn.addEventListener('click', () => this.openMergeModal());
            console.log('✓ Merge button listener attached');
        } else {
            console.warn('Merge button not found');
        }
    }

    openMergeModal() {
        // Store current project as master
        this.masterProject = JSON.parse(JSON.stringify(window.projectData));
        
        // Show merge modal
        const modal = document.getElementById('mergeModal');
        if (modal) {
            modal.style.display = 'block';
            this.resetMergeSteps();
        } else {
            console.error('Merge modal not found');
        }
    }

    resetMergeSteps() {
        // Show step 1, hide others
        const step1 = document.getElementById('mergeStep1');
        const step2 = document.getElementById('mergeStep2');
        const step3 = document.getElementById('mergeStep3');
        
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        
        // Reset file input
        const fileInput = document.getElementById('specialistFileInput');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clear results
        const validationResult = document.getElementById('validationResult');
        if (validationResult) {
            validationResult.innerHTML = '';
        }
        
        this.specialistProject = null;
        this.mergeState = 'idle';
    }

    // Handle file upload
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        console.log('File selected:', file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const result = this.validateFile(content);
            
            if (result.valid) {
                this.specialistProject = result.project;
                this.mergeState = 'validated';
                console.log('File validated successfully');
            } else {
                console.error('File validation failed:', result.errors);
            }
            
            this.displayValidationResult(result);
        };
        reader.readAsText(file);
    }

    // Validate uploaded file
    validateFile(fileContent) {
        try {
            const project = JSON.parse(fileContent);
            
            // Check required fields
            const requiredFields = [
                'projectInfo',
                'internalResources',
                'vendorCosts',
                'toolCosts',
                'miscCosts',
                'risks',
                'rateCards'
            ];
            
            const missingFields = requiredFields.filter(field => !project[field]);
            
            if (missingFields.length > 0) {
                return {
                    valid: false,
                    errors: [`Missing required fields: ${missingFields.join(', ')}`],
                    warnings: []
                };
            }
            
            // Check for start/end dates
            const warnings = [];
            if (!project.projectInfo.startDate || !project.projectInfo.endDate) {
                warnings.push('Project dates are missing - merge will use master project dates');
            }
            
            return {
                valid: true,
                errors: [],
                warnings: warnings,
                project: project,
                metadata: {
                    projectName: project.projectInfo.projectName || 'Unnamed Project',
                    startDate: project.projectInfo.startDate || 'Not set',
                    endDate: project.projectInfo.endDate || 'Not set',
                    teamName: project.projectInfo.projectManager || 'Unknown',
                    resourceCount: project.internalResources.length,
                    vendorCount: project.vendorCosts.length,
                    toolCount: project.toolCosts.length,
                    miscCount: project.miscCosts.length,
                    riskCount: project.risks.length
                }
            };
            
        } catch (error) {
            return {
                valid: false,
                errors: ['Invalid JSON format: ' + error.message],
                warnings: []
            };
        }
    }

    // Display validation results
    displayValidationResult(result) {
        const container = document.getElementById('validationResult');
        if (!container) return;
        
        if (result.valid) {
            container.innerHTML = `
                <div class="alert alert-success">
                    <h4>✓ File Validated Successfully</h4>
                    <div class="metadata-display">
                        <p><strong>Project Name:</strong> ${result.metadata.projectName}</p>
                        <p><strong>Team Manager:</strong> ${result.metadata.teamName}</p>
                        <p><strong>Project Dates:</strong> ${result.metadata.startDate} to ${result.metadata.endDate}</p>
                        <p><strong>Resources:</strong> ${result.metadata.resourceCount} internal resources</p>
                        <p><strong>Vendor Costs:</strong> ${result.metadata.vendorCount} items</p>
                        <p><strong>Tool Costs:</strong> ${result.metadata.toolCount} items</p>
                        <p><strong>Miscellaneous:</strong> ${result.metadata.miscCount} items</p>
                        <p><strong>Risks:</strong> ${result.metadata.riskCount} items</p>
                    </div>
                    ${result.warnings.length > 0 ? `
                        <div class="warnings">
                            <strong>⚠ Warnings:</strong>
                            <ul>${result.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    <button class="btn btn-primary" onclick="window.mergeManager.proceedToDateComparison()">
                        Next: Compare Dates →
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="alert alert-error">
                    <h4>✗ Validation Failed</h4>
                    <p>The file cannot be merged because:</p>
                    <ul>${result.errors.map(e => `<li>${e}</li>`).join('')}</ul>
                    <p><strong>Please upload a valid project estimate file.</strong></p>
                </div>
            `;
        }
    }

    proceedToDateComparison() {
        // Hide step 1, show step 2
        const step1 = document.getElementById('mergeStep1');
        const step2 = document.getElementById('mergeStep2');
        
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
        
        // Compare dates and display
        const comparison = this.compareDates();
        this.displayDateComparison(comparison);
        this.mergeState = 'dates-compared';
    }

    compareDates() {
        const master = this.masterProject.projectInfo;
        const specialist = this.specialistProject.projectInfo;
        
        // Handle missing dates
        if (!specialist.startDate || !specialist.endDate) {
            return {
                masterStart: master.startDate,
                masterEnd: master.endDate,
                masterDuration: this.calculateDuration(master.startDate, master.endDate),
                specialistStart: 'Not set',
                specialistEnd: 'Not set',
                specialistDuration: 0,
                startVariance: 0,
                endVariance: 0,
                durationVariance: 0,
                hasDifferences: false,
                missingDates: true
            };
        }
        
        const masterStart = new Date(master.startDate);
        const masterEnd = new Date(master.endDate);
        const specialistStart = new Date(specialist.startDate);
        const specialistEnd = new Date(specialist.endDate);
        
        // Calculate variances in days
        const startVariance = Math.round((specialistStart - masterStart) / (1000 * 60 * 60 * 24));
        const endVariance = Math.round((masterEnd - specialistEnd) / (1000 * 60 * 60 * 24));
        
        const masterDuration = Math.round((masterEnd - masterStart) / (1000 * 60 * 60 * 24));
        const specialistDuration = Math.round((specialistEnd - specialistStart) / (1000 * 60 * 60 * 24));
        
        return {
            masterStart: master.startDate,
            masterEnd: master.endDate,
            masterDuration: masterDuration,
            specialistStart: specialist.startDate,
            specialistEnd: specialist.endDate,
            specialistDuration: specialistDuration,
            startVariance: startVariance,
            endVariance: endVariance,
            durationVariance: specialistDuration - masterDuration,
            hasDifferences: startVariance !== 0 || endVariance !== 0,
            missingDates: false
        };
    }

    calculateDuration(startDate, endDate) {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.round((end - start) / (1000 * 60 * 60 * 24));
    }

    displayDateComparison(comparison) {
        const container = document.getElementById('dateComparisonResult');
        if (!container) return;
        
        if (comparison.missingDates) {
            container.innerHTML = `
                <div class="date-comparison-panel">
                    <h3>Project Timeline Comparison</h3>
                    
                    <div class="alert alert-info">
                        <strong>ℹ No Dates in Specialist File</strong>
                        <p>The specialist team's file does not contain project dates. The master project dates will be used.</p>
                    </div>
                    
                    <div class="comparison-grid">
                        <div class="comparison-column">
                            <h4>Master Project</h4>
                            <div class="date-display">
                                <p><strong>Start:</strong> ${comparison.masterStart}</p>
                                <p><strong>End:</strong> ${comparison.masterEnd}</p>
                                <p><strong>Duration:</strong> ${comparison.masterDuration} days</p>
                            </div>
                        </div>
                        
                        <div class="comparison-column">
                            <h4>Specialist Team Project</h4>
                            <div class="date-display">
                                <p><strong>Start:</strong> Not set</p>
                                <p><strong>End:</strong> Not set</p>
                                <p><strong>Duration:</strong> Not set</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="merge-actions">
                        <button class="btn btn-secondary" onclick="window.mergeManager.goBackToFileSelection()">
                            ← Back
                        </button>
                        <button class="btn btn-primary" onclick="window.mergeManager.proceedToDateSelection()">
                            Next: Complete Merge →
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        const startDiffClass = comparison.startVariance === 0 ? 'match' : 'differ';
        const endDiffClass = comparison.endVariance === 0 ? 'match' : 'differ';
        
        container.innerHTML = `
            <div class="date-comparison-panel">
                <h3>Project Timeline Comparison</h3>
                
                <div class="comparison-grid">
                    <div class="comparison-column">
                        <h4>Master Project</h4>
                        <div class="date-display">
                            <p><strong>Start:</strong> ${comparison.masterStart}</p>
                            <p><strong>End:</strong> ${comparison.masterEnd}</p>
                            <p><strong>Duration:</strong> ${comparison.masterDuration} days</p>
                        </div>
                    </div>
                    
                    <div class="comparison-column">
                        <h4>Specialist Team Project</h4>
                        <div class="date-display">
                            <p class="${startDiffClass}">
                                <strong>Start:</strong> ${comparison.specialistStart}
                                ${comparison.startVariance !== 0 ? 
                                    `<span class="variance">(${comparison.startVariance > 0 ? '+' : ''}${comparison.startVariance} days difference)</span>` 
                                    : ''}
                            </p>
                            <p class="${endDiffClass}">
                                <strong>End:</strong> ${comparison.specialistEnd}
                                ${comparison.endVariance !== 0 ? 
                                    `<span class="variance">(${comparison.endVariance > 0 ? '+' : ''}${comparison.endVariance} days difference)</span>` 
                                    : ''}
                            </p>
                            <p>
                                <strong>Duration:</strong> ${comparison.specialistDuration} days
                                ${comparison.durationVariance !== 0 ? 
                                    `<span class="variance">(${comparison.durationVariance > 0 ? '+' : ''}${comparison.durationVariance} days difference)</span>` 
                                    : ''}
                            </p>
                        </div>
                    </div>
                </div>
                
                ${comparison.hasDifferences ? `
                    <div class="alert alert-info">
                        <strong>⚠ Timeline Differences Detected</strong>
                        <p>The projects have different timelines. You'll need to choose which dates to use in the next step.</p>
                        <p><strong>Impact:</strong> Cost items from the specialist file will be mapped to the appropriate months in the chosen timeline. Items with monthly allocations (internal resources, vendor costs) will be redistributed proportionally if the timelines don't align.</p>
                    </div>
                ` : `
                    <div class="alert alert-success">
                        <strong>✓ Timelines Match</strong>
                        <p>Both projects have identical start and end dates. Cost items will merge seamlessly without date adjustment.</p>
                    </div>
                `}
                
                <div class="merge-actions">
                    <button class="btn btn-secondary" onclick="window.mergeManager.goBackToFileSelection()">
                        ← Back
                    </button>
                    <button class="btn btn-primary" onclick="window.mergeManager.proceedToDateSelection()">
                        Next: Select Timeline →
                    </button>
                </div>
            </div>
        `;
    }

    goBackToFileSelection() {
        const step1 = document.getElementById('mergeStep1');
        const step2 = document.getElementById('mergeStep2');
        
        if (step2) step2.style.display = 'none';
        if (step1) step1.style.display = 'block';
        this.mergeState = 'validated';
    }

    proceedToDateSelection() {
        const step2 = document.getElementById('mergeStep2');
        const step3 = document.getElementById('mergeStep3');
        
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'block';
        
        const comparison = this.compareDates();
        this.displayDateSelection(comparison);
    }

    displayDateSelection(comparison) {
        const container = document.getElementById('dateSelectionPanel');
        if (!container) return;
        
        container.innerHTML = `
            <div class="date-selection-panel">
                <h3>Choose Project Timeline</h3>
                
                <div class="date-options">
                    <div class="date-option">
                        <input type="radio" id="keepMaster" name="dateOption" value="master" checked>
                        <label for="keepMaster">
                            <strong>Keep Master Dates</strong>
                            <p>${comparison.masterStart} to ${comparison.masterEnd} (${comparison.masterDuration} days)</p>
                            ${comparison.hasDifferences ? 
                                '<p class="impact">Specialist cost items will be adjusted to align with these dates.</p>' 
                                : ''}
                        </label>
                    </div>
                    
                    ${!comparison.missingDates ? `
                        <div class="date-option">
                            <input type="radio" id="adoptSpecialist" name="dateOption" value="specialist">
                            <label for="adoptSpecialist">
                                <strong>Adopt Specialist Dates</strong>
                                <p>${comparison.specialistStart} to ${comparison.specialistEnd} (${comparison.specialistDuration} days)</p>
                                ${comparison.hasDifferences ? 
                                    '<p class="impact">Master project timeline will be updated to match specialist dates.</p>' 
                                    : ''}
                            </label>
                        </div>
                    ` : ''}
                    
                    <div class="date-option">
                        <input type="radio" id="manualEntry" name="dateOption" value="manual">
                        <label for="manualEntry">
                            <strong>Enter Custom Dates</strong>
                            <p class="impact">Set your own timeline for the merged project.</p>
                            <div class="manual-dates" id="manualDatesInputs" style="display: none;">
                                <div class="form-group">
                                    <label>Start Date:</label>
                                    <input type="date" id="manualStartDate" class="form-control" value="${comparison.masterStart}">
                                </div>
                                <div class="form-group">
                                    <label>End Date:</label>
                                    <input type="date" id="manualEndDate" class="form-control" value="${comparison.masterEnd}">
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
                
                <div class="merge-preview-section">
                    <h4>What will be merged:</h4>
                    <ul>
                        <li><strong>${this.specialistProject.internalResources.length}</strong> internal resource entries</li>
                        <li><strong>${this.specialistProject.vendorCosts.length}</strong> vendor cost entries</li>
                        <li><strong>${this.specialistProject.toolCosts.length}</strong> tool cost entries</li>
                        <li><strong>${this.specialistProject.miscCosts.length}</strong> miscellaneous cost entries</li>
                        <li><strong>${this.specialistProject.risks.length}</strong> risk entries</li>
                    </ul>
                    <p class="info-note">All items will be added to your current project with a "Specialist Team" source tag for easy identification.</p>
                </div>
                
                <div class="merge-actions">
                    <button class="btn btn-secondary" onclick="window.mergeManager.goBackToComparison()">
                        ← Back
                    </button>
                    <button class="btn btn-primary" onclick="window.mergeManager.executeMerge()">
                        Complete Merge
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener for manual date option
        const manualEntry = document.getElementById('manualEntry');
        const manualDatesInputs = document.getElementById('manualDatesInputs');
        
        if (manualEntry && manualDatesInputs) {
            manualEntry.addEventListener('change', (e) => {
                manualDatesInputs.style.display = e.target.checked ? 'block' : 'none';
            });
        }
        
        // Hide manual dates when other options selected
        ['keepMaster', 'adoptSpecialist'].forEach(id => {
            const element = document.getElementById(id);
            if (element && manualDatesInputs) {
                element.addEventListener('change', () => {
                    manualDatesInputs.style.display = 'none';
                });
            }
        });
    }

    goBackToComparison() {
        const step2 = document.getElementById('mergeStep2');
        const step3 = document.getElementById('mergeStep3');
        
        if (step3) step3.style.display = 'none';
        if (step2) step2.style.display = 'block';
    }

    // Merging Rate Card Information for Specialist Team
    createRateCardReviewStep(analysis) {
        const { conflicts, newCards, hasConflicts, hasNewCards } = analysis;
        
        let html = `
            <div class="rate-card-review">
                <h3 style="margin-bottom: 1rem;">Step 4: Review Rate Cards</h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">
                    Review and resolve rate card differences between the files.
                </p>
        `;
        
        // Show new rate cards to be added
        if (hasNewCards) {
            html += `
                <div class="new-rate-cards-section" style="margin-bottom: 2rem;">
                    <h4 style="color: #059669; margin-bottom: 1rem;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="vertical-align: middle;">
                            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                        </svg>
                        New Rate Cards to Add (${newCards.length})
                    </h4>
                    <div class="rate-card-list" style="background: #f0fdf4; padding: 1rem; border-radius: 8px;">
            `;
            
            newCards.forEach(card => {
                html += `
                    <div class="rate-card-item" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #d1fae5;">
                        <span><strong>${card.role}</strong> (${card.category})</span>
                        <span style="font-weight: 500;">$${card.rate}/day</span>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Show conflicts to resolve
        if (hasConflicts) {
            html += `
                <div class="rate-card-conflicts-section">
                    <h4 style="color: #dc2626; margin-bottom: 1rem;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="vertical-align: middle;">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        Rate Card Conflicts to Resolve (${conflicts.length})
                    </h4>
                    <div class="conflicts-list">
            `;
            
            conflicts.forEach((conflict, index) => {
                html += `
                    <div class="conflict-item" style="background: #fef2f2; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <h5 style="margin-bottom: 0.75rem; font-weight: 600;">${conflict.role}</h5>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.75rem;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; color: #6b7280;">Master File Rate:</label>
                                <div style="font-weight: 500;">$${conflict.master.rate}/day (${conflict.master.category})</div>
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.875rem; color: #6b7280;">Specialist File Rate:</label>
                                <div style="font-weight: 500;">$${conflict.specialist.rate}/day (${conflict.specialist.category})</div>
                            </div>
                        </div>
                        <div class="resolution-options">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Resolution:</label>
                            <select id="conflict_resolution_${index}" class="rate-card-resolution" data-role="${conflict.role}" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;">
                                <option value="keep_master">Keep Master Rate ($${conflict.master.rate})</option>
                                <option value="use_specialist">Use Specialist Rate ($${conflict.specialist.rate})</option>
                            </select>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // Summary section
        if (!hasConflicts && !hasNewCards) {
            html += `
                <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; text-align: center;">
                    <svg width="48" height="48" viewBox="0 0 20 20" fill="#3b82f6" style="margin: 0 auto 0.5rem;">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <p style="font-weight: 500; color: #1e40af;">No rate card conflicts detected!</p>
                    <p style="color: #64748b; margin-top: 0.5rem;">All rate cards are compatible between files.</p>
                </div>
            `;
        }
        
        html += `</div>`;
        
        return html;
    }
    
    // Function to collect rate card resolutions
    collectRateCardResolutions() {
        const resolutions = [];
        const selects = document.querySelectorAll('.rate-card-resolution');
        
        selects.forEach(select => {
            const role = select.dataset.role;
            const action = select.value;
            
            // Find the conflict data
            const conflict = window.RateCardMerger.conflicts.find(c => c.role === role);
            
            if (conflict) {
                resolutions.push({
                    role: role,
                    action: action,
                    masterRate: conflict.master.rate,
                    specialistRate: conflict.specialist.rate,
                    masterCategory: conflict.master.category,
                    specialistCategory: conflict.specialist.category
                });
            }
        });
        
        return resolutions;
    }
    
    // Modified merge execution function to include the rate card merge steps
    executeMergeWithRateCards(masterData, specialistData, dateAlignment, rateCardResolutions) {
        try {
            // Step 1: Create full backup
            const fullBackup = JSON.parse(JSON.stringify(masterData));
            
            // Step 2: Merge timeline data (existing)
            this.mergeTimelineData(masterData, specialistData, dateAlignment);
            
            // Step 3: Merge rate cards (new)
            const rateCardResult = window.RateCardMerger.executeMerge(masterData, rateCardResolutions);
            
            // Step 4: Merge cost data (existing)
            this.mergeResourceData(masterData, specialistData);
            
            // Step 5: Save to localStorage
            if (window.DataManager) {
                window.DataManager.saveToLocalStorage();
            }
            
            // Step 6: Re-render tables
            if (window.TableRenderer) {
                window.TableRenderer.renderAllTables();
            }
            
            // Step 7: Update summary
            if (window.updateSummary) {
                window.updateSummary();
            }
            
            // Success message
            const summary = window.RateCardMerger.getMergeSummary(rateCardResolutions);
            this.showMergeSuccessMessage(summary);
            
            return true;
            
        } catch (error) {
            console.error('Merge failed:', error);
            // Rollback everything
            Object.assign(masterData, fullBackup);
            this.showMergeErrorMessage(error.message);
            return false;
        }
    }
    
    // Success message display
    showMergeSuccessMessage(summary) {
        const message = `
            <div style="background: #d1fae5; color: #065f46; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4 style="margin-bottom: 0.5rem;">✅ Merge Completed Successfully!</h4>
                <ul style="margin: 0.5rem 0 0 1.5rem;">
                    <li>${summary.newCardsAdded} new rate cards added</li>
                    <li>${summary.cardsUpdated} rate cards updated</li>
                    <li>${summary.cardsKept} rate cards kept unchanged</li>
                </ul>
            </div>
        `;
        
        // Display in your modal or notification area
        if (window.showAlert) {
            window.showAlert(message, 'success');
        }
    }
    
    // Error message display
    showMergeErrorMessage(message) {
        if (window.showAlert) {
            window.showAlert(`Merge failed: ${message}`, 'error');
        } else {
            alert(`Merge failed: ${message}`);
        }
    }
    
    // Execute the merge
    executeMerge() {
        const selectedOption = document.querySelector('input[name="dateOption"]:checked')?.value;
        
        if (!selectedOption) {
            alert('Please select a date option');
            return;
        }
        
        let targetStart, targetEnd;
        
        // Determine target dates based on selection
        switch(selectedOption) {
            case 'master':
                targetStart = this.masterProject.projectInfo.startDate;
                targetEnd = this.masterProject.projectInfo.endDate;
                break;
            case 'specialist':
                targetStart = this.specialistProject.projectInfo.startDate;
                targetEnd = this.specialistProject.projectInfo.endDate;
                break;
            case 'manual':
                targetStart = document.getElementById('manualStartDate')?.value;
                targetEnd = document.getElementById('manualEndDate')?.value;
                if (!targetStart || !targetEnd) {
                    alert('Please enter both start and end dates for custom timeline.');
                    return;
                }
                if (new Date(targetStart) >= new Date(targetEnd)) {
                    alert('End date must be after start date.');
                    return;
                }
                break;
        }
        
        console.log('Executing merge with dates:', targetStart, 'to', targetEnd);
        
        // Create merged project
        const mergedProject = {
            ...this.masterProject,
            projectInfo: {
                ...this.masterProject.projectInfo,
                startDate: targetStart,
                endDate: targetEnd,
                projectDescription: (this.masterProject.projectInfo.projectDescription || '') + 
                    `\n\n[Merged with specialist team estimate "${this.specialistProject.projectInfo.projectName}" on ${new Date().toISOString().split('T')[0]}]`
            }
        };
        
        // Merge internal resources
        this.specialistProject.internalResources.forEach(resource => {
            mergedProject.internalResources.push({
                ...resource,
                id: Date.now() + Math.random(), // Ensure unique ID
                vendor: resource.vendor ? `${resource.vendor} (Specialist Team)` : undefined,
                role: resource.role ? `${resource.role} (Specialist Team)` : resource.role
            });
        });
        
        // Merge vendor costs
        this.specialistProject.vendorCosts.forEach(vendor => {
            mergedProject.vendorCosts.push({
                ...vendor,
                id: Date.now() + Math.random(),
                vendor: vendor.vendor ? `${vendor.vendor} (Specialist Team)` : 'Specialist Team'
            });
        });
        
        // Merge tool costs
        this.specialistProject.toolCosts.forEach(tool => {
            mergedProject.toolCosts.push({
                ...tool,
                id: Date.now() + Math.random(),
                tool: tool.tool ? `${tool.tool} (Specialist Team)` : 'Specialist Team'
            });
        });
        
        // Merge miscellaneous costs
        this.specialistProject.miscCosts.forEach(misc => {
            mergedProject.miscCosts.push({
                ...misc,
                id: Date.now() + Math.random(),
                item: misc.item ? `${misc.item} (Specialist Team)` : 'Specialist Team'
            });
        });
        
        // Merge risks
        this.specialistProject.risks.forEach(risk => {
            mergedProject.risks.push({
                ...risk,
                id: Date.now() + Math.random(),
                description: risk.description ? `${risk.description} (Specialist Team)` : 'Specialist Team Risk'
            });
        });
        
        // Merge rate cards (avoid duplicates)
        this.specialistProject.rateCards.forEach(rateCard => {
            const exists = mergedProject.rateCards.find(
                r => r.role === rateCard.role && r.category === rateCard.category
            );
            if (!exists) {
                mergedProject.rateCards.push(rateCard);
            }
        });
        
        // Count total items merged
        const totalItemsMerged = 
            this.specialistProject.internalResources.length +
            this.specialistProject.vendorCosts.length +
            this.specialistProject.toolCosts.length +
            this.specialistProject.miscCosts.length +
            this.specialistProject.risks.length;
        
        // Replace current project data with merged version
        window.projectData = mergedProject;
        
        // Save to localStorage
        if (window.dataManager && window.dataManager.saveToLocalStorage) {
            window.dataManager.saveToLocalStorage();
        }
        
        // Refresh all displays
        if (window.updateMonthHeaders) {
            window.updateMonthHeaders();
        }
        
        // Render all tables including forecast AND rate cards
        if (window.tableRenderer) {
            window.tableRenderer.renderInternalResourcesTable();
            window.tableRenderer.renderVendorCostsTable();
            window.tableRenderer.renderToolCostsTable();
            window.tableRenderer.renderMiscCostsTable();
            window.tableRenderer.renderRisksTable();
            window.tableRenderer.renderForecastTable();
            
            // Check if rate cards method exists before calling
            if (typeof window.tableRenderer.renderUnifiedRateCardsTable === 'function') {
                window.tableRenderer.renderUnifiedRateCardsTable();
            }
        }
        
        // CRITICAL: Use longer delay and ensure DOM is fully updated
        // Update summary AFTER all rendering is complete
        setTimeout(() => {
            console.log('🔄 Starting post-merge summary update...');
            
            // Force a re-render of all tables one more time to ensure data is loaded
            if (window.tableRenderer) {
                window.tableRenderer.renderInternalResourcesTable();
                window.tableRenderer.renderVendorCostsTable();
                window.tableRenderer.renderToolCostsTable();
                window.tableRenderer.renderMiscCostsTable();
            }
            
            // Now update the summary
            if (window.updateSummary) {
                window.updateSummary();
                console.log('✅ Summary updated after merge');
            }
            
            // Double-check summary after another short delay
            setTimeout(() => {
                if (window.updateSummary) {
                    window.updateSummary();
                    console.log('✅ Summary double-checked');
                }
            }, 200);
            
        }, 300); // Increased from 100ms to 300ms
        
        // Close modal
        const modal = document.getElementById('mergeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Show success message
        if (window.dataManager && window.dataManager.showAlert) {
            window.dataManager.showAlert(
                `Successfully merged specialist team estimate "${this.specialistProject.projectInfo.projectName}". Added ${totalItemsMerged} cost items.`,
                'success'
            );
        } else {
            alert(`Merge completed successfully! Added ${totalItemsMerged} items from specialist team estimate.`);
        }
        
        console.log('Merge completed successfully');
        this.mergeState = 'idle';
    }
}

// Export module
window.mergeManager = new MergeManager();
window.MergeManager = window.mergeManager; // Backwards compatibility

console.log('Merge Manager module loaded');
