// ============================================================================
// MODAL CLOSE BUTTON FIX - V3 (Non-Breaking)
// This file fixes the inactive close button without breaking Add buttons
// ============================================================================

(function() {
    'use strict';
    
    console.log('🔧 Loading modal close button fix V3...');
    
    // Fix function that only handles close button
    function fixModalCloseButtons() {
        console.log('🔧 Fixing modal close buttons...');
        
        const modal = document.getElementById('modal');
        const mergeModal = document.getElementById('mergeModal');
        
        if (modal) {
            // Get the close button
            const closeBtn = modal.querySelector('.close');
            const cancelBtn = document.getElementById('cancelModal');
            
            if (closeBtn) {
                // Remove existing onclick to avoid conflicts
                closeBtn.onclick = null;
                
                // Add new click handler
                closeBtn.addEventListener('click', function(e) {
                    console.log('✅ Close button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    modal.style.setProperty('display', 'none', 'important');
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                });
                
                console.log('✅ Close button event listener added');
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function(e) {
                    console.log('✅ Cancel button clicked');
                    e.preventDefault();
                    modal.style.setProperty('display', 'none', 'important');
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                });
            }
            
            // Click outside modal to close
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    console.log('✅ Clicked outside modal - closing');
                    modal.style.setProperty('display', 'none', 'important');
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                }
            });
            
            // Escape key to close
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    console.log('✅ Escape key pressed - closing modal');
                    modal.style.setProperty('display', 'none', 'important');
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                }
            });
        }
        
        // Fix merge modal too
        if (mergeModal) {
            const mergeCloseBtn = mergeModal.querySelector('.close');
            if (mergeCloseBtn) {
                mergeCloseBtn.onclick = null;
                mergeCloseBtn.addEventListener('click', function(e) {
                    console.log('✅ Merge modal close button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    mergeModal.style.setProperty('display', 'none', 'important');
                    mergeModal.style.visibility = 'hidden';
                    mergeModal.style.opacity = '0';
                });
            }
        }
        
        console.log('✅ Modal close button fix complete');
    }
    
    // Force CSS styles
    function forceCloseButtonStyles() {
        const style = document.createElement('style');
        style.id = 'modal-close-fix-styles';
        style.textContent = `
            .modal .close {
                position: absolute !important;
                top: 1rem !important;
                right: 1.5rem !important;
                z-index: 9999 !important;
                cursor: pointer !important;
                pointer-events: auto !important;
                width: 32px !important;
                height: 32px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 2rem !important;
                font-weight: bold !important;
                color: #6b7280 !important;
                background: transparent !important;
                border: none !important;
                transition: all 0.2s ease !important;
            }
            
            .modal .close:hover {
                color: #374151 !important;
                background-color: #f3f4f6 !important;
                border-radius: 4px !important;
            }
            
            .modal .close:active {
                background-color: #e5e7eb !important;
                transform: scale(0.95) !important;
            }
            
            .modal-content {
                position: relative !important;
                z-index: 1001 !important;
            }
            
            .modal {
                z-index: 1000 !important;
            }
        `;
        
        // Only add if not already added
        if (!document.getElementById('modal-close-fix-styles')) {
            document.head.appendChild(style);
            console.log('✅ Force close button styles applied');
        }
    }
    
    // Monitor for modal opening and re-apply fix
    function monitorModalOpening() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        
        // Use MutationObserver to watch for display changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const display = modal.style.display;
                    if (display === 'block') {
                        console.log('📢 Modal opened - ensuring close button is active');
                        
                        // Small delay to ensure modal is fully rendered
                        setTimeout(function() {
                            const closeBtn = modal.querySelector('.close');
                            if (closeBtn) {
                                // Ensure styles are correct
                                closeBtn.style.pointerEvents = 'auto';
                                closeBtn.style.cursor = 'pointer';
                                closeBtn.style.zIndex = '9999';
                                console.log('✅ Close button styles refreshed');
                            }
                        }, 50);
                    }
                }
            });
        });
        
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['style']
        });
        
        console.log('✅ Modal opening monitor active');
    }
    
    // Initialize everything
    function init() {
        fixModalCloseButtons();
        forceCloseButtonStyles();
        monitorModalOpening();
        console.log('✅ Modal close button fix V3 initialized');
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also run on window load as backup
    window.addEventListener('load', function() {
        setTimeout(init, 100);
    });
    
})();

console.log('✅ Modal close button fix V3 script loaded - Non-breaking version');
