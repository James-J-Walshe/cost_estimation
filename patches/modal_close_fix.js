// ============================================================================
// MODAL CLOSE BUTTON FIX - IMPROVED VERSION
// This file fixes the inactive close button issue in all modals
// ============================================================================

// Fix 1: Ensure event listeners are properly attached
function fixModalCloseButtons() {
    console.log('🔧 Fixing modal close buttons...');
    
    // Get the main modal
    const modal = document.getElementById('modal');
    const mergeModal = document.getElementById('mergeModal');
    
    if (modal) {
        // Method 1: Direct event listener on the close button
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            // Remove any existing listeners by cloning
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Add new listener
            newCloseBtn.addEventListener('click', function(e) {
                console.log('✅ Close button clicked - Method 1');
                e.preventDefault();
                e.stopPropagation();
                
                // IMPORTANT: Set display to none with higher specificity
                modal.style.setProperty('display', 'none', 'important');
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
                
                console.log('✅ Modal closed - display set to none');
            });
            
            console.log('✅ Close button event listener added');
        }
        
        // Method 2: Event delegation on modal content
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', function(e) {
                if (e.target.classList.contains('close') || e.target.closest('.close')) {
                    console.log('✅ Close button clicked - Method 2 (delegation)');
                    e.preventDefault();
                    e.stopPropagation();
                    modal.style.setProperty('display', 'none', 'important');
                    modal.style.visibility = 'hidden';
                    modal.style.opacity = '0';
                }
            });
            console.log('✅ Modal content delegation listener added');
        }
        
        // Method 3: Click outside modal to close
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('✅ Clicked outside modal - closing');
                modal.style.setProperty('display', 'none', 'important');
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
            }
        });
        
        // Method 4: Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                console.log('✅ Escape key pressed - closing modal');
                modal.style.setProperty('display', 'none', 'important');
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
            }
        });
        
        // Method 5: Also handle the cancel button
        const cancelBtn = document.getElementById('cancelModal');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function(e) {
                console.log('✅ Cancel button clicked');
                e.preventDefault();
                modal.style.setProperty('display', 'none', 'important');
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
            });
        }
    }
    
    // Fix the merge modal close button too
    if (mergeModal) {
        const mergeCloseBtn = mergeModal.querySelector('.close');
        if (mergeCloseBtn) {
            const newMergeCloseBtn = mergeCloseBtn.cloneNode(true);
            mergeCloseBtn.parentNode.replaceChild(newMergeCloseBtn, mergeCloseBtn);
            
            newMergeCloseBtn.addEventListener('click', function(e) {
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

// Fix 2: Override the openModal function to ensure listeners are attached
const originalOpenModal = window.openModal;
window.openModal = function(title, type) {
    // Call original function
    if (originalOpenModal) {
        originalOpenModal(title, type);
    }
    
    // Re-attach close button listeners after modal is opened
    setTimeout(() => {
        const modal = document.getElementById('modal');
        const closeBtn = modal?.querySelector('.close');
        
        if (closeBtn) {
            // Ensure the close button is clickable
            closeBtn.style.pointerEvents = 'auto';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.zIndex = '9999';
            
            // Add click handler directly
            closeBtn.onclick = function(e) {
                console.log('✅ Close button clicked - inline handler');
                e.preventDefault();
                e.stopPropagation();
                modal.style.setProperty('display', 'none', 'important');
                modal.style.visibility = 'hidden';
                modal.style.opacity = '0';
                
                console.log('✅ Modal display set to none');
            };
            
            console.log('✅ Modal opened - close button initialized');
        }
    }, 100);
};

// Fix 3: Force CSS overrides for close button
function forceCloseButtonStyles() {
    const style = document.createElement('style');
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
    document.head.appendChild(style);
    console.log('✅ Force close button styles applied');
}

// Execute fixes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        fixModalCloseButtons();
        forceCloseButtonStyles();
    });
} else {
    fixModalCloseButtons();
    forceCloseButtonStyles();
}

// Also run when the page is fully loaded
window.addEventListener('load', function() {
    fixModalCloseButtons();
});

console.log('✅ Modal close button fix script loaded - IMPROVED VERSION');
