// modules/ai_project_extractor.js
// AI Project Extractor - Uses Claude API to extract project details from text or images
// Populates project name, dates, and suggests a resource profile

class AIProjectExtractor {
    constructor() {
        this.modalId = 'aiExtractorModal';
        this.activeMode = 'text'; // 'text' or 'image'
        this.imageData = null;    // { base64, mediaType }
        console.log('🤖 AI Project Extractor loaded');
    }

    initialize() {
        console.log('✓ AI Project Extractor initialized');
        this.connectButton();
    }

    connectButton() {
        const btn = document.getElementById('aiExtractBtn');
        if (btn && !btn.hasAttribute('data-ai-listener-attached')) {
            btn.addEventListener('click', () => {
                if (window.initManager) window.initManager.closeAllDropdowns();
                this.showModal();
            });
            btn.setAttribute('data-ai-listener-attached', 'true');
        }
    }

    // ─── Modal ───────────────────────────────────────────────────────────────

    showModal() {
        const existing = document.getElementById(this.modalId);
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = this.modalId;
        container.innerHTML = this.buildModalHTML();
        document.body.appendChild(container);

        this.injectStyles();
        this.wireModalEvents(container);

        // Fade in
        const overlay = container.querySelector('.aipe-overlay');
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    buildModalHTML() {
        const savedKey = localStorage.getItem('claudeApiKey') || '';
        const maskedKey = savedKey ? savedKey : '';

        return `
        <div class="aipe-overlay" style="opacity:0;">
            <div class="aipe-modal">
                <div class="aipe-header">
                    <div class="aipe-header-title">
                        <span class="aipe-icon">✨</span>
                        <h2>AI Project Extractor</h2>
                    </div>
                    <button class="aipe-close" id="aipeClose" title="Close">✕</button>
                </div>

                <div class="aipe-body">
                    <!-- API Key -->
                    <div class="aipe-section">
                        <label class="aipe-label">Claude API Key</label>
                        <div class="aipe-api-row">
                            <input type="password" id="aipeApiKey" class="aipe-input"
                                   value="${maskedKey}" placeholder="sk-ant-api03-…" autocomplete="off">
                            <button type="button" id="aipeToggleKey" class="aipe-icon-btn" title="Show/hide key">👁</button>
                        </div>
                        <p class="aipe-hint">
                            Stored locally in your browser.
                            Get your key at <strong>console.anthropic.com</strong>
                        </p>
                    </div>

                    <!-- Mode tabs -->
                    <div class="aipe-tabs">
                        <button class="aipe-tab active" data-mode="text">📝 Text Description</button>
                        <button class="aipe-tab" data-mode="image">🖼️ Image / Timeline</button>
                    </div>

                    <!-- Text panel -->
                    <div id="aipeTextPanel" class="aipe-panel">
                        <textarea id="aipeText" class="aipe-textarea"
                            placeholder="Describe your project here. For example:&#10;&#10;'We need to deliver a new customer portal by end of Q4 2025. The project starts in July 2025. We'll need a project manager full-time, two developers for 6 months, a business analyst for the first 3 months, and QA for the final 2 months. The project is called Customer Portal Upgrade and will be led by Sarah Johnson.'"></textarea>
                    </div>

                    <!-- Image panel -->
                    <div id="aipeImagePanel" class="aipe-panel" style="display:none;">
                        <div class="aipe-drop-zone" id="aipeDropZone">
                            <div class="aipe-drop-icon">📎</div>
                            <p>Drop an image here, or <strong>click to browse</strong></p>
                            <p class="aipe-hint">Supports PNG, JPG, GIF, WEBP (max 5MB)</p>
                            <input type="file" id="aipeFileInput" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none;">
                        </div>
                        <img id="aipeImagePreview" class="aipe-img-preview" style="display:none;" alt="Preview">
                        <button type="button" id="aipeClearImage" class="aipe-clear-img" style="display:none;">✕ Remove image</button>
                    </div>

                    <!-- Submit -->
                    <div class="aipe-actions">
                        <button type="button" id="aipeSubmit" class="aipe-btn-primary">
                            🔍 Extract Project Details
                        </button>
                        <button type="button" id="aipeCancel" class="aipe-btn-secondary">Cancel</button>
                    </div>

                    <!-- Loading -->
                    <div id="aipeLoading" class="aipe-loading" style="display:none;">
                        <div class="aipe-spinner"></div>
                        <p>Analysing with Claude AI…</p>
                    </div>

                    <!-- Results -->
                    <div id="aipeResults" style="display:none;">
                        <div class="aipe-results-header">
                            <h3>✅ Extracted Project Details</h3>
                            <p class="aipe-hint">Review the details below, then click <strong>Apply</strong> to populate your project.</p>
                        </div>
                        <div id="aipeResultsContent" class="aipe-results-content"></div>
                        <div class="aipe-results-actions">
                            <button type="button" id="aipeApply" class="aipe-btn-primary">Apply to Project</button>
                            <button type="button" id="aipeRetry" class="aipe-btn-secondary">Try Again</button>
                        </div>
                    </div>

                    <!-- Error -->
                    <div id="aipeError" class="aipe-error" style="display:none;"></div>
                </div>
            </div>
        </div>`;
    }

    wireModalEvents(container) {
        // Close
        container.querySelector('#aipeClose').addEventListener('click', () => this.closeModal());
        container.querySelector('#aipeCancel').addEventListener('click', () => this.closeModal());
        container.querySelector('.aipe-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('aipe-overlay')) this.closeModal();
        });

        // Escape key
        this._escHandler = (e) => { if (e.key === 'Escape') this.closeModal(); };
        document.addEventListener('keydown', this._escHandler);

        // API key toggle visibility
        container.querySelector('#aipeToggleKey').addEventListener('click', () => {
            const inp = container.querySelector('#aipeApiKey');
            inp.type = inp.type === 'password' ? 'text' : 'password';
        });

        // Mode tabs
        container.querySelectorAll('.aipe-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.aipe-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeMode = tab.dataset.mode;
                container.querySelector('#aipeTextPanel').style.display = this.activeMode === 'text' ? 'block' : 'none';
                container.querySelector('#aipeImagePanel').style.display = this.activeMode === 'image' ? 'block' : 'none';
            });
        });

        // Image upload
        const dropZone = container.querySelector('#aipeDropZone');
        const fileInput = container.querySelector('#aipeFileInput');

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) this.loadImageFile(file, container);
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) this.loadImageFile(file, container);
        });

        container.querySelector('#aipeClearImage').addEventListener('click', () => {
            this.imageData = null;
            container.querySelector('#aipeImagePreview').style.display = 'none';
            container.querySelector('#aipeClearImage').style.display = 'none';
            container.querySelector('#aipeDropZone').style.display = 'flex';
            fileInput.value = '';
        });

        // Submit
        container.querySelector('#aipeSubmit').addEventListener('click', () => this.handleSubmit(container));
    }

    loadImageFile(file, container) {
        if (file.size > 5 * 1024 * 1024) {
            this.showError('Image must be smaller than 5MB.', container);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            const base64 = dataUrl.split(',')[1];
            this.imageData = { base64, mediaType: file.type };

            const preview = container.querySelector('#aipeImagePreview');
            preview.src = dataUrl;
            preview.style.display = 'block';
            container.querySelector('#aipeClearImage').style.display = 'inline-block';
            container.querySelector('#aipeDropZone').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    closeModal() {
        document.removeEventListener('keydown', this._escHandler);
        const modal = document.getElementById(this.modalId);
        if (modal) {
            const overlay = modal.querySelector('.aipe-overlay');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
        this.imageData = null;
        this.activeMode = 'text';
    }

    // ─── API Call ─────────────────────────────────────────────────────────────

    async handleSubmit(container) {
        const apiKey = container.querySelector('#aipeApiKey').value.trim();
        if (!apiKey) {
            this.showError('Please enter your Claude API key.', container);
            return;
        }

        if (this.activeMode === 'text') {
            const text = container.querySelector('#aipeText').value.trim();
            if (!text) {
                this.showError('Please enter a project description.', container);
                return;
            }
        } else {
            if (!this.imageData) {
                this.showError('Please upload an image.', container);
                return;
            }
        }

        // Save the API key
        localStorage.setItem('claudeApiKey', apiKey);

        // Show loading
        this.setLoadingState(true, container);
        this.hideError(container);
        container.querySelector('#aipeResults').style.display = 'none';

        try {
            const result = await this.callClaudeAPI(apiKey, container);
            this.setLoadingState(false, container);
            this.showResults(result, container);
        } catch (err) {
            this.setLoadingState(false, container);
            this.showError(`Error: ${err.message}`, container);
        }
    }

    async callClaudeAPI(apiKey, container) {
        const systemPrompt = `You are an expert project analyst. Extract structured project details from the user's input (text description or image of a project timeline/plan).

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "projectName": "string",
  "startDate": "YYYY-MM",
  "endDate": "YYYY-MM",
  "projectManager": "string or empty string",
  "projectDescription": "string - 1-3 sentence summary",
  "suggestedResources": [
    {
      "role": "string - must be one of the available roles",
      "category": "Internal or External",
      "allocationPercent": number between 0 and 100,
      "startMonthOffset": number (0 = project start),
      "endMonthOffset": number (0-based from project start, inclusive),
      "rationale": "brief explanation"
    }
  ],
  "confidence": "high or medium or low",
  "notes": "string - any important caveats or assumptions"
}

Available roles (use exact names):
Internal: Project Manager, Business Analyst, Technical Lead, Developer, Tester
External: Senior Consultant, Technical Architect, Implementation Specialist, Support Specialist

Rules:
- Dates must be YYYY-MM format (e.g. "2025-07")
- If a date cannot be determined, make a reasonable estimate and note it
- allocationPercent: 100 = full time (20 days/month), 50 = half time (10 days/month)
- startMonthOffset and endMonthOffset are 0-indexed from project start
- Only suggest roles that are genuinely needed
- projectManager field: extract the name if mentioned, otherwise leave empty`;

        let userContent;

        if (this.activeMode === 'text') {
            const text = container.querySelector('#aipeText').value.trim();
            userContent = [{ type: 'text', text: `Extract project details from this description:\n\n${text}` }];
        } else {
            userContent = [
                {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: this.imageData.mediaType,
                        data: this.imageData.base64
                    }
                },
                {
                    type: 'text',
                    text: 'Extract project details from this project timeline or plan image.'
                }
            ];
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: 'user', content: userContent }]
            })
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({}));
            const errMsg = errBody?.error?.message || `HTTP ${response.status}`;
            throw new Error(errMsg);
        }

        const data = await response.json();
        const rawText = data.content?.[0]?.text || '';

        // Strip any accidental markdown fences
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

        try {
            return JSON.parse(cleaned);
        } catch {
            throw new Error(`Could not parse AI response. Raw output: ${rawText.substring(0, 200)}`);
        }
    }

    // ─── Results ──────────────────────────────────────────────────────────────

    showResults(result, container) {
        const projectMonthCount = this.monthsBetween(result.startDate, result.endDate);

        const resourceRows = (result.suggestedResources || []).map(r => {
            const daysPerMonth = Math.round((r.allocationPercent / 100) * 20);
            const duration = (r.endMonthOffset - r.startMonthOffset + 1);
            return `
                <tr>
                    <td><strong>${r.role}</strong></td>
                    <td>${r.category}</td>
                    <td>${r.allocationPercent}% (${daysPerMonth} days/mo)</td>
                    <td>${duration} month${duration !== 1 ? 's' : ''}</td>
                    <td class="aipe-rationale">${r.rationale || ''}</td>
                </tr>`;
        }).join('');

        const confidenceBadge = {
            high: '<span class="aipe-badge aipe-badge-high">High confidence</span>',
            medium: '<span class="aipe-badge aipe-badge-medium">Medium confidence</span>',
            low: '<span class="aipe-badge aipe-badge-low">Low confidence</span>'
        }[result.confidence] || '';

        container.querySelector('#aipeResultsContent').innerHTML = `
            <div class="aipe-result-grid">
                <div class="aipe-result-item">
                    <span class="aipe-result-label">Project Name</span>
                    <span class="aipe-result-value">${this.esc(result.projectName || '—')}</span>
                </div>
                <div class="aipe-result-item">
                    <span class="aipe-result-label">Start Date</span>
                    <span class="aipe-result-value">${this.esc(result.startDate || '—')}</span>
                </div>
                <div class="aipe-result-item">
                    <span class="aipe-result-label">End Date</span>
                    <span class="aipe-result-value">${this.esc(result.endDate || '—')}</span>
                </div>
                <div class="aipe-result-item">
                    <span class="aipe-result-label">Duration</span>
                    <span class="aipe-result-value">${projectMonthCount} months</span>
                </div>
                <div class="aipe-result-item">
                    <span class="aipe-result-label">Project Manager</span>
                    <span class="aipe-result-value">${this.esc(result.projectManager || '—')}</span>
                </div>
                <div class="aipe-result-item aipe-result-wide">
                    <span class="aipe-result-label">Description</span>
                    <span class="aipe-result-value">${this.esc(result.projectDescription || '—')}</span>
                </div>
            </div>

            ${resourceRows ? `
            <h4 class="aipe-section-title">Suggested Resource Profile</h4>
            <div class="aipe-table-wrap">
                <table class="aipe-resource-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Category</th>
                            <th>Allocation</th>
                            <th>Duration</th>
                            <th>Rationale</th>
                        </tr>
                    </thead>
                    <tbody>${resourceRows}</tbody>
                </table>
            </div>` : ''}

            ${result.notes ? `<div class="aipe-notes">ℹ️ ${this.esc(result.notes)}</div>` : ''}
            ${confidenceBadge}
        `;

        container.querySelector('#aipeResults').style.display = 'block';

        // Apply button
        const applyBtn = container.querySelector('#aipeApply');
        applyBtn.onclick = () => this.applyToProject(result, container);

        // Retry button
        const retryBtn = container.querySelector('#aipeRetry');
        retryBtn.onclick = () => {
            container.querySelector('#aipeResults').style.display = 'none';
        };
    }

    // ─── Apply ────────────────────────────────────────────────────────────────

    applyToProject(result, container) {
        const pd = window.projectData;
        if (!pd) {
            this.showError('projectData not available.', container);
            return;
        }

        // Apply project info
        if (result.projectName)      pd.projectInfo.projectName      = result.projectName;
        if (result.startDate)        pd.projectInfo.startDate        = result.startDate;
        if (result.endDate)          pd.projectInfo.endDate          = result.endDate;
        if (result.projectManager)   pd.projectInfo.projectManager   = result.projectManager;
        if (result.projectDescription) pd.projectInfo.projectDescription = result.projectDescription;

        // Sync form fields
        this.syncFormFields(pd.projectInfo);

        // Apply resource profile
        const resources = result.suggestedResources || [];
        if (resources.length > 0) {
            this.applyResources(resources, pd);
        }

        // Re-render
        if (typeof window.updateSummary === 'function') window.updateSummary();
        if (typeof window.updateMonthHeaders === 'function') window.updateMonthHeaders();
        if (window.tableRenderer?.renderAllTables) window.tableRenderer.renderAllTables();
        if (typeof window.renderResourcePlanForecast === 'function') window.renderResourcePlanForecast();

        // Save to localStorage
        try { localStorage.setItem('ictProjectData', JSON.stringify(pd)); } catch (_) {}

        this.closeModal();

        // Navigate to project info in settings so the user can review
        if (window.initManager?.showSettingsView) {
            window.initManager.showSettingsView('project-info');
        }

        console.log('✅ AI-extracted project details applied successfully');
    }

    syncFormFields(info) {
        const fieldMap = {
            projectName: 'projectName',
            startDate: 'startDate',
            endDate: 'endDate',
            projectManager: 'projectManager',
            projectDescription: 'projectDescription'
        };
        Object.entries(fieldMap).forEach(([key, id]) => {
            const el = document.getElementById(id);
            if (el && info[key]) el.value = info[key];
        });
    }

    applyResources(resources, pd) {
        const totalMonths = this.monthsBetween(pd.projectInfo.startDate, pd.projectInfo.endDate);
        if (totalMonths < 1) return;

        resources.forEach(r => {
            const rateCard = pd.rateCards.find(rc => rc.role === r.role && rc.category === r.category)
                          || pd.rateCards.find(rc => rc.role === r.role);
            if (!rateCard) {
                console.warn(`⚠ Rate card not found for role: ${r.role}`);
                return;
            }

            const daysPerMonth = Math.round((r.allocationPercent / 100) * 20);
            const resource = {
                id: Date.now() + Math.random(),
                role: rateCard.role,
                rateCard: rateCard.category,
                dailyRate: rateCard.rate
            };

            // Populate month day fields for each project month
            for (let m = 1; m <= Math.min(totalMonths, 24); m++) {
                const monthIndex = m - 1; // 0-based
                const inRange = monthIndex >= (r.startMonthOffset || 0) &&
                                monthIndex <= (r.endMonthOffset !== undefined ? r.endMonthOffset : totalMonths - 1);
                resource[`month${m}Days`] = inRange ? daysPerMonth : 0;
            }

            pd.internalResources.push(resource);
        });

        console.log(`✓ Applied ${resources.length} resource(s) to project`);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    monthsBetween(startStr, endStr) {
        if (!startStr || !endStr) return 0;
        const [sy, sm] = startStr.split('-').map(Number);
        const [ey, em] = endStr.split('-').map(Number);
        return (ey - sy) * 12 + (em - sm) + 1;
    }

    setLoadingState(loading, container) {
        container.querySelector('#aipeLoading').style.display  = loading ? 'flex' : 'none';
        container.querySelector('#aipeSubmit').disabled        = loading;
    }

    showError(msg, container) {
        const el = container.querySelector('#aipeError');
        el.textContent = msg;
        el.style.display = 'block';
    }

    hideError(container) {
        container.querySelector('#aipeError').style.display = 'none';
    }

    esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ─── Styles ───────────────────────────────────────────────────────────────

    injectStyles() {
        if (document.getElementById('aipe-styles')) return;
        const style = document.createElement('style');
        style.id = 'aipe-styles';
        style.textContent = `
        .aipe-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 10500;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            transition: opacity 0.25s ease;
        }
        .aipe-modal {
            background: #fff;
            border-radius: 12px;
            width: 100%;
            max-width: 680px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column;
        }
        .aipe-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px 16px;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 12px 12px 0 0;
            color: white;
        }
        .aipe-header-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .aipe-header-title h2 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
            color: white;
        }
        .aipe-icon { font-size: 1.4rem; }
        .aipe-close {
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 6px;
            color: white;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }
        .aipe-close:hover { background: rgba(255,255,255,0.35); }
        .aipe-body {
            padding: 20px 24px 24px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .aipe-section { display: flex; flex-direction: column; gap: 6px; }
        .aipe-label {
            font-weight: 600;
            font-size: 0.875rem;
            color: #374151;
        }
        .aipe-api-row {
            display: flex;
            gap: 8px;
        }
        .aipe-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            font-family: monospace;
        }
        .aipe-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .aipe-icon-btn {
            padding: 8px 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #f9fafb;
            cursor: pointer;
            font-size: 1rem;
        }
        .aipe-icon-btn:hover { background: #f3f4f6; }
        .aipe-hint { font-size: 0.78rem; color: #9ca3af; margin: 0; }
        .aipe-tabs {
            display: flex;
            gap: 8px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0;
        }
        .aipe-tab {
            padding: 8px 16px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
            transition: color 0.15s, border-color 0.15s;
        }
        .aipe-tab:hover { color: #4f46e5; }
        .aipe-tab.active {
            color: #4f46e5;
            border-bottom-color: #4f46e5;
        }
        .aipe-panel {}
        .aipe-textarea {
            width: 100%;
            min-height: 140px;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.875rem;
            line-height: 1.5;
            resize: vertical;
            font-family: inherit;
            box-sizing: border-box;
        }
        .aipe-textarea:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .aipe-drop-zone {
            border: 2px dashed #d1d5db;
            border-radius: 10px;
            padding: 32px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: border-color 0.15s, background 0.15s;
        }
        .aipe-drop-zone:hover, .aipe-drop-zone.drag-over {
            border-color: #6366f1;
            background: rgba(99,102,241,0.04);
        }
        .aipe-drop-icon { font-size: 2rem; }
        .aipe-drop-zone p { margin: 0; color: #6b7280; font-size: 0.875rem; text-align: center; }
        .aipe-img-preview {
            max-width: 100%;
            max-height: 260px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            object-fit: contain;
            display: block;
        }
        .aipe-clear-img {
            display: inline-block;
            margin-top: 6px;
            padding: 4px 10px;
            border: 1px solid #fca5a5;
            border-radius: 6px;
            background: #fef2f2;
            color: #b91c1c;
            font-size: 0.8rem;
            cursor: pointer;
        }
        .aipe-actions {
            display: flex;
            gap: 10px;
        }
        .aipe-btn-primary {
            flex: 1;
            padding: 10px 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.15s;
        }
        .aipe-btn-primary:hover:not(:disabled) { opacity: 0.9; }
        .aipe-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .aipe-btn-secondary {
            padding: 10px 20px;
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
        }
        .aipe-btn-secondary:hover { background: #e5e7eb; }
        .aipe-loading {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: #f8f9ff;
            border-radius: 8px;
            color: #4f46e5;
            font-weight: 500;
        }
        .aipe-spinner {
            width: 22px;
            height: 22px;
            border: 3px solid #c7d2fe;
            border-top-color: #4f46e5;
            border-radius: 50%;
            animation: aipe-spin 0.7s linear infinite;
            flex-shrink: 0;
        }
        @keyframes aipe-spin { to { transform: rotate(360deg); } }
        .aipe-error {
            padding: 12px 16px;
            background: #fef2f2;
            border: 1px solid #fca5a5;
            border-radius: 8px;
            color: #b91c1c;
            font-size: 0.875rem;
        }
        .aipe-results-header h3 { margin: 0 0 4px; font-size: 1rem; color: #065f46; }
        .aipe-result-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 16px;
        }
        .aipe-result-wide { grid-column: 1 / -1; }
        .aipe-result-item {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 10px 14px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .aipe-result-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #9ca3af;
        }
        .aipe-result-value {
            font-size: 0.9rem;
            color: #111827;
            font-weight: 500;
        }
        .aipe-section-title {
            margin: 8px 0 10px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #374151;
        }
        .aipe-table-wrap { overflow-x: auto; }
        .aipe-resource-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.82rem;
        }
        .aipe-resource-table th {
            background: #f3f4f6;
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
            color: #6b7280;
            border-bottom: 2px solid #e5e7eb;
        }
        .aipe-resource-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #f3f4f6;
            color: #374151;
        }
        .aipe-resource-table tr:last-child td { border-bottom: none; }
        .aipe-rationale { color: #9ca3af; font-style: italic; }
        .aipe-notes {
            margin-top: 12px;
            padding: 10px 14px;
            background: #fffbeb;
            border: 1px solid #fcd34d;
            border-radius: 8px;
            font-size: 0.82rem;
            color: #92400e;
        }
        .aipe-badge {
            display: inline-block;
            margin-top: 10px;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .aipe-badge-high   { background: #d1fae5; color: #065f46; }
        .aipe-badge-medium { background: #fef3c7; color: #92400e; }
        .aipe-badge-low    { background: #fee2e2; color: #b91c1c; }
        .aipe-results-actions {
            display: flex;
            gap: 10px;
            margin-top: 16px;
        }
        @media (max-width: 540px) {
            .aipe-result-grid { grid-template-columns: 1fr; }
            .aipe-result-wide { grid-column: auto; }
            .aipe-modal { max-height: 95vh; }
        }
        `;
        document.head.appendChild(style);
    }
}

window.aiProjectExtractor = new AIProjectExtractor();
