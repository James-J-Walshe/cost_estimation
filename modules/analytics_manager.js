// modules/analytics_manager.js
// Google Analytics 4 Integration Module
// Follows the Initialization Manager Pattern
// Version: 1.0.0

class AnalyticsManager {
    constructor() {
        // =============================================
        // CONFIGURATION - UPDATE THIS VALUE
        // =============================================
        this.measurementId = 'G-2KD38HBZB2';  // ← Replace with your GA4 Measurement ID
        
        this.initialized = false;
        this.debugMode = false; // Set to true during development
        this.consentRequired = true; // Set to false to skip consent check
        
        console.log('📊 Analytics Manager loaded');
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    /**
     * Initialize GA4 - called by init_manager.js
     * If consent is required, use checkConsent() instead
     */
    initialize() {
        if (this.initialized) {
            console.log('📊 Analytics Manager already initialized');
            return;
        }

        // Don't initialize if consent is required but not given
        if (this.consentRequired && !this.hasConsent()) {
            console.log('📊 Analytics initialization skipped - awaiting consent');
            return;
        }

        try {
            // Load GA4 script dynamically
            this.loadGA4Script();
            
            // Initialize dataLayer
            window.dataLayer = window.dataLayer || [];
            
            // Define gtag function
            window.gtag = function() {
                window.dataLayer.push(arguments);
            };
            
            // Initialize GA4
            window.gtag('js', new Date());
            window.gtag('config', this.measurementId, {
                'debug_mode': this.debugMode,
                'send_page_view': true,
                'anonymize_ip': true  // Privacy enhancement
            });

            // Set up automatic event tracking
            this.setupEventTracking();
            
            this.initialized = true;
            console.log('✓ Analytics Manager initialized with ID:', this.measurementId);
            
        } catch (error) {
            console.error('❌ Analytics Manager initialization failed:', error);
        }
    }

    /**
     * Dynamically load the GA4 script
     */
    loadGA4Script() {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);
    }

    /**
     * Set up automatic event tracking for common actions
     */
    setupEventTracking() {
        // Track tab changes
        this.setupTabTracking();
        
        // Track button clicks (add resources, export, etc.)
        this.setupButtonTracking();
        
        // Track project actions
        this.setupProjectTracking();
        
        // Track session engagement
        this.setupEngagementTracking();
        
        console.log('📊 Event tracking configured');
    }

    // ========================================
    // CONSENT MANAGEMENT
    // ========================================
    
    /**
     * Check if user has given consent
     * @returns {boolean}
     */
    hasConsent() {
        return localStorage.getItem('zyantik_analytics_consent') === 'true';
    }

    /**
     * Set consent status
     * @param {boolean} consent - Whether user consents to analytics
     */
    setConsent(consent) {
        localStorage.setItem('zyantik_analytics_consent', consent ? 'true' : 'false');
        
        if (consent && !this.initialized) {
            this.initialize();
        }
    }

    /**
     * Check consent and show banner if needed
     * Called by init_manager.js instead of initialize() when consent is required
     */
    checkConsent() {
        const consentStatus = localStorage.getItem('zyantik_analytics_consent');
        
        if (consentStatus === null) {
            // No consent recorded - show banner
            this.showConsentBanner();
        } else if (consentStatus === 'true') {
            // User has consented - initialize
            this.initialize();
        }
        // If declined ('false'), don't initialize analytics
    }

    /**
     * Show the cookie consent banner
     */
    showConsentBanner() {
        // Check if banner already exists
        if (document.getElementById('cookieConsent')) {
            document.getElementById('cookieConsent').style.display = 'block';
            this.setupConsentListeners();
            return;
        }

        // Create banner dynamically
        const banner = document.createElement('div');
        banner.id = 'cookieConsent';
        banner.className = 'cookie-consent';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>🍪 We use analytics to understand how you use this tool and improve your experience. No personal data is collected.</p>
                <div class="cookie-buttons">
                    <button id="acceptCookies" class="btn btn-primary">Accept</button>
                    <button id="declineCookies" class="btn btn-secondary">Decline</button>
                </div>
            </div>
        `;
        
        // Add styles if not already present
        this.injectConsentStyles();
        
        document.body.appendChild(banner);
        this.setupConsentListeners();
    }

    /**
     * Set up consent button listeners
     */
    setupConsentListeners() {
        const acceptBtn = document.getElementById('acceptCookies');
        const declineBtn = document.getElementById('declineCookies');
        const banner = document.getElementById('cookieConsent');

        if (acceptBtn && !acceptBtn.hasAttribute('data-listener-attached')) {
            acceptBtn.setAttribute('data-listener-attached', 'true');
            acceptBtn.addEventListener('click', () => {
                this.setConsent(true);
                if (banner) banner.style.display = 'none';
                console.log('📊 Analytics consent accepted');
            });
        }

        if (declineBtn && !declineBtn.hasAttribute('data-listener-attached')) {
            declineBtn.setAttribute('data-listener-attached', 'true');
            declineBtn.addEventListener('click', () => {
                this.setConsent(false);
                if (banner) banner.style.display = 'none';
                console.log('📊 Analytics consent declined');
            });
        }
    }

    /**
     * Inject consent banner styles
     */
    injectConsentStyles() {
        if (document.getElementById('cookieConsentStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'cookieConsentStyles';
        styles.textContent = `
            .cookie-consent {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #1a1a2e;
                color: white;
                padding: 1rem 2rem;
                z-index: 10000;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
            }
            .cookie-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                flex-wrap: wrap;
            }
            .cookie-content p {
                margin: 0;
                flex: 1;
                min-width: 200px;
            }
            .cookie-buttons {
                display: flex;
                gap: 0.5rem;
            }
            @media (max-width: 600px) {
                .cookie-consent {
                    padding: 1rem;
                }
                .cookie-content {
                    flex-direction: column;
                    text-align: center;
                }
                .cookie-buttons {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // ========================================
    // TAB TRACKING
    // ========================================
    
    setupTabTracking() {
        // Use event delegation for tab buttons
        document.addEventListener('click', (e) => {
            const tabButton = e.target.closest('.tab-btn');
            if (tabButton) {
                const tabName = tabButton.getAttribute('data-tab') || tabButton.textContent.trim();
                this.trackEvent('navigation', 'tab_change', tabName);
            }
        });
    }

    // ========================================
    // BUTTON TRACKING
    // ========================================
    
    setupButtonTracking() {
        // Track "Add" buttons
        const addButtons = [
            { id: 'addInternalResource', label: 'add_internal_resource' },
            { id: 'addVendorCost', label: 'add_vendor_cost' },
            { id: 'addToolCost', label: 'add_tool_cost' },
            { id: 'addMiscCost', label: 'add_misc_cost' },
            { id: 'addRisk', label: 'add_risk' },
            { id: 'addRateCard', label: 'add_rate_card' }
        ];

        addButtons.forEach(({ id, label }) => {
            const button = document.getElementById(id);
            if (button && !button.hasAttribute('data-ga-tracked')) {
                button.setAttribute('data-ga-tracked', 'true');
                button.addEventListener('click', () => {
                    this.trackEvent('engagement', 'add_item', label);
                });
            }
        });

        // Track export/import using event delegation
        document.addEventListener('click', (e) => {
            const target = e.target;
            const targetId = target.id || target.closest('[id]')?.id;
            
            switch (targetId) {
                case 'exportCSV':
                    this.trackEvent('export', 'csv_export', 'project_data');
                    break;
                case 'exportJSON':
                    this.trackEvent('export', 'json_export', 'project_data');
                    break;
                case 'importJSON':
                    this.trackEvent('import', 'json_import', 'project_data');
                    break;
            }
        });
    }

    // ========================================
    // PROJECT TRACKING
    // ========================================
    
    setupProjectTracking() {
        // Track project save
        const saveButton = document.getElementById('saveProjectInfo');
        if (saveButton && !saveButton.hasAttribute('data-ga-tracked')) {
            saveButton.setAttribute('data-ga-tracked', 'true');
            saveButton.addEventListener('click', () => {
                this.trackEvent('project', 'save_project_info');
            });
        }

        // Track new project creation using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.id === 'newProject' || e.target.closest('#newProject')) {
                this.trackEvent('project', 'new_project');
            }
        });
    }

    // ========================================
    // ENGAGEMENT TRACKING
    // ========================================
    
    setupEngagementTracking() {
        // Track time on page
        const startTime = Date.now();
        
        // Send engagement time when user leaves
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('engagement', 'session_duration', 'seconds', timeSpent);
        });

        // Track scroll depth
        let maxScroll = 0;
        const scrollMilestones = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestones: 25%, 50%, 75%, 100%
                [25, 50, 75, 100].forEach(milestone => {
                    if (maxScroll >= milestone && !scrollMilestones.has(milestone)) {
                        scrollMilestones.add(milestone);
                        this.trackEvent('engagement', 'scroll_depth', `${milestone}%`);
                    }
                });
            }
        });
    }

    // ========================================
    // CORE TRACKING METHODS
    // ========================================
    
    /**
     * Track a custom event
     * @param {string} category - Event category (e.g., 'navigation', 'engagement')
     * @param {string} action - Event action (e.g., 'tab_change', 'button_click')
     * @param {string} label - Event label (optional)
     * @param {number} value - Event value (optional)
     */
    trackEvent(category, action, label = null, value = null) {
        if (!this.initialized || typeof window.gtag !== 'function') {
            if (this.debugMode) {
                console.log('📊 [Debug] Event not sent - GA not initialized:', { category, action, label, value });
            }
            return;
        }

        const eventParams = {
            'event_category': category
        };

        if (label !== null) {
            eventParams['event_label'] = label;
        }

        if (value !== null) {
            eventParams['value'] = value;
        }

        window.gtag('event', action, eventParams);

        if (this.debugMode) {
            console.log('📊 Event tracked:', { category, action, label, value });
        }
    }

    /**
     * Track a page view (useful for SPA-style navigation)
     * @param {string} pagePath - The page path
     * @param {string} pageTitle - The page title
     */
    trackPageView(pagePath, pageTitle) {
        if (!this.initialized || typeof window.gtag !== 'function') {
            return;
        }

        window.gtag('config', this.measurementId, {
            'page_path': pagePath,
            'page_title': pageTitle
        });

        if (this.debugMode) {
            console.log('📊 Page view tracked:', { pagePath, pageTitle });
        }
    }

    /**
     * Track user properties (for segmentation)
     * @param {object} properties - User properties object
     */
    setUserProperties(properties) {
        if (!this.initialized || typeof window.gtag !== 'function') {
            return;
        }

        window.gtag('set', 'user_properties', properties);

        if (this.debugMode) {
            console.log('📊 User properties set:', properties);
        }
    }

    /**
     * Track feature usage with additional context
     * @param {string} featureName - Name of the feature used
     * @param {object} details - Additional details
     */
    trackFeatureUsage(featureName, details = {}) {
        const detailsStr = Object.keys(details).length > 0 ? JSON.stringify(details) : null;
        this.trackEvent('feature_usage', featureName, detailsStr);
    }

    // ========================================
    // UTILITY METHODS
    // ========================================
    
    /**
     * Enable debug mode for development
     */
    enableDebugMode() {
        this.debugMode = true;
        console.log('📊 Analytics debug mode enabled');
    }

    /**
     * Disable debug mode for production
     */
    disableDebugMode() {
        this.debugMode = false;
        console.log('📊 Analytics debug mode disabled');
    }

    /**
     * Check if analytics is properly initialized
     * @returns {boolean}
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Get current consent status
     * @returns {string|null} 'true', 'false', or null if not set
     */
    getConsentStatus() {
        return localStorage.getItem('zyantik_analytics_consent');
    }

    /**
     * Reset consent (for testing or user request)
     */
    resetConsent() {
        localStorage.removeItem('zyantik_analytics_consent');
        console.log('📊 Analytics consent reset');
    }
}

// Create and export global instance
window.analyticsManager = new AnalyticsManager();

console.log('✓ Analytics Manager module loaded');
