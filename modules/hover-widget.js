/**
 * Hover Widget Navigation
 * Provides a side-panel navigation widget for switching between Zyantik applications
 */

class HoverWidget {
    constructor(config = {}) {
        this.config = {
            items: config.items || [],
            position: config.position || 'left',
            ...config
        };
        
        this.init();
    }
    
    init() {
        this.createWidget();
        this.attachEventListeners();
    }
    
    createWidget() {
        // Create main container
        const container = document.createElement('div');
        container.className = 'hover-widget-container';
        container.id = 'hoverWidget';
        
        // Create panel structure
        const panel = document.createElement('div');
        panel.className = 'widget-panel';
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'panel-content';
        
        // Create icons container
        const icons = document.createElement('div');
        icons.className = 'panel-icons';
        
        // Add configured items
        this.config.items.forEach(item => {
            const iconItem = document.createElement('div');
            iconItem.className = 'icon-item';
            iconItem.dataset.url = item.url;
            iconItem.dataset.app = item.id;
            
            // Add emoji icon
            const emoji = document.createElement('span');
            emoji.className = 'icon-emoji';
            emoji.textContent = item.icon;
            
            // Add label
            const label = document.createElement('span');
            label.className = 'icon-label';
            label.textContent = item.label;
            
            iconItem.appendChild(emoji);
            iconItem.appendChild(label);
            icons.appendChild(iconItem);
        });
        
        // Create tab
        const tab = document.createElement('div');
        tab.className = 'widget-tab';
        
        const arrow = document.createElement('span');
        arrow.className = 'widget-tab-arrow';
        arrow.textContent = '❯';
        
        tab.appendChild(arrow);
        
        // Assemble structure
        content.appendChild(icons);
        panel.appendChild(content);
        panel.appendChild(tab);
        container.appendChild(panel);
        
        // Add to body
        document.body.appendChild(container);
        
        this.container = container;
        this.icons = icons;
    }
    
    attachEventListeners() {
        // Navigation click handlers
        this.icons.addEventListener('click', (e) => {
            const iconItem = e.target.closest('.icon-item');
            if (iconItem) {
                this.handleNavigation(iconItem);
            }
        });
        
        // Optional: Keyboard shortcut (Ctrl/Cmd + M to toggle)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
                e.preventDefault();
                this.container.classList.toggle('force-open');
            }
        });
    }
    
    handleNavigation(iconItem) {
        const url = iconItem.dataset.url;
        const appId = iconItem.dataset.app;
        
        console.log(`🚀 Navigating to: ${appId}`);
        
        // Add visual feedback
        iconItem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            iconItem.style.transform = '';
        }, 150);
        
        // Navigate after brief delay for visual feedback
        setTimeout(() => {
            if (url) {
                window.location.href = url;
            } else {
                console.warn(`No URL configured for ${appId}`);
            }
        }, 200);
    }
    
    // Public method to add new items dynamically
    addItem(item) {
        this.config.items.push(item);
        
        const iconItem = document.createElement('div');
        iconItem.className = 'icon-item';
        iconItem.dataset.url = item.url;
        iconItem.dataset.app = item.id;
        
        const emoji = document.createElement('span');
        emoji.className = 'icon-emoji';
        emoji.textContent = item.icon;
        
        const label = document.createElement('span');
        label.className = 'icon-label';
        label.textContent = item.label;
        
        iconItem.appendChild(emoji);
        iconItem.appendChild(label);
        this.icons.appendChild(iconItem);
    }
    
    // Public method to remove the widget
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Initialize widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Configuration for Zyantik applications
    const widgetConfig = {
        items: [
            {
                id: 'estimator',
                label: 'Cost Estimator',
                icon: '📊',
                url: 'index.html' // Current application - could link to home or refresh
            },
            {
                id: 'portfolio',
                label: 'Portfolio Manager',
                icon: '📁',
                url: 'portfolio.html' // Update with actual URL when available
            }
            // Add more applications as needed:
            // {
            //     id: 'resource-manager',
            //     label: 'Resource Manager',
            //     icon: '👥',
            //     url: 'resources.html'
            // }
        ],
        position: 'left'
    };
    
    // Create the widget
    window.zyantikWidget = new HoverWidget(widgetConfig);
    
    console.log('✅ Zyantik Hover Widget initialized');
});
