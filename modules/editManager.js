/**
 * Edit Manager Module
 * Handles inline editing functionality for all data types
 */

class EditManager {
    constructor() {
        this.editingStates = new Map(); // Track what's being edited
        this.originalValues = new Map(); // Store original values for cancellation
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for edit button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.handleEditClick(e.target);
            }
            
            if (e.target.classList.contains('save-edit-btn')) {
                e.preventDefault();
                this.handleSaveEdit(e.target);
            }
            
            if (e.target.classList.contains('cancel-edit-btn')) {
                e.preventDefault();
                this.handleCancelEdit(e.target);
            }
        });

        // Handle Enter key to save, Escape to cancel
        document.addEventListener('keydown', (e) => {
            const editingElement = document.querySelector('.editing');
            if (!editingElement) return;

            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const saveBtn = editingElement.querySelector('.save-edit-btn');
                if (saveBtn) this.handleSaveEdit(saveBtn);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                const cancelBtn = editingElement.querySelector('.cancel-edit-btn');
                if (cancelBtn) this.handleCancelEdit(cancelBtn);
            }
        });
    }

    /**
     * Creates edit button HTML
     * @param {string} itemId - Unique identifier for the item
     * @param {string} itemType - Type of item (internal-resource, vendor-cost, etc.)
     */
    createEditButton(itemId, itemType) {
        return `<button class="edit-btn icon-btn" data-id="${itemId}" data-type="${itemType}" title="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        </button>`;
    }

    /**
     * Handle edit button click
     */
    handleEditClick(button) {
        const itemId = button.dataset.id;
        const itemType = button.dataset.type;
        const row = button.closest('tr') || button.closest('.item-row');
        
        if (!row) return;

        // Prevent multiple simultaneous edits
        if (this.editingStates.has(itemId)) {
            return;
        }

        this.startEditing(row, itemId, itemType);
    }

    /**
     * Convert row to edit mode
     */
    startEditing(row, itemId, itemType) {
        row.classList.add('editing');
        this.editingStates.set(itemId, { type: itemType, row: row });

        // Store original values
        const originalData = this.extractRowData(row, itemType);
        this.originalValues.set(itemId, originalData);

        // Convert cells to edit inputs
        this.convertToEditInputs(row, itemType, originalData);

        // Replace edit button with save/cancel buttons
        const editBtn = row.querySelector('.edit-btn');
        const actionCell = editBtn.parentElement;
        actionCell.innerHTML = `
            <button class="save-edit-btn icon-btn success" data-id="${itemId}" title="Save Changes">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
            </button>
            <button class="cancel-edit-btn icon-btn secondary" data-id="${itemId}" title="Cancel">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </button>
            ${row.querySelector('.delete-btn')?.outerHTML || ''}
        `;
    }

    /**
     * Extract data from row based on item type
     */
    extractRowData(row, itemType) {
        const data = {};
        
        switch (itemType) {
            case 'internal-resource':
                const cells = row.querySelectorAll('td');
                data.name = cells[0]?.textContent?.trim() || '';
                data.role = cells[1]?.textContent?.trim() || '';
                data.dailyRate = parseFloat(cells[2]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q1Days = parseFloat(cells[3]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q2Days = parseFloat(cells[4]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q3Days = parseFloat(cells[5]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q4Days = parseFloat(cells[6]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                break;
                
            case 'vendor-cost':
                const vendorCells = row.querySelectorAll('td');
                data.vendor = vendorCells[0]?.textContent?.trim() || '';
                data.category = vendorCells[1]?.textContent?.trim() || '';
                data.description = vendorCells[2]?.textContent?.trim() || '';
                data.q1Cost = parseFloat(vendorCells[3]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q2Cost = parseFloat(vendorCells[4]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q3Cost = parseFloat(vendorCells[5]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.q4Cost = parseFloat(vendorCells[6]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                break;
                
            case 'tool-cost':
                const toolCells = row.querySelectorAll('td');
                data.tool = toolCells[0]?.textContent?.trim() || '';
                data.licenseType = toolCells[1]?.textContent?.trim() || '';
                data.cost = parseFloat(toolCells[2]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.users = parseFloat(toolCells[3]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.duration = parseFloat(toolCells[4]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                break;
                
            case 'misc-cost':
                const miscCells = row.querySelectorAll('td');
                data.category = miscCells[0]?.textContent?.trim() || '';
                data.description = miscCells[1]?.textContent?.trim() || '';
                data.cost = parseFloat(miscCells[2]?.textContent?.replace(/[^0-9.-]/g, '')) || 0;
                data.quarter = miscCells[3]?.textContent?.trim() || '';
                break;
                
            case 'risk':
                const riskCells = row.querySelectorAll('td');
                data.description = riskCells[0]?.textContent?.trim() || '';
                data.probability = riskCells[1]?.textContent?.trim() || '';
                data.impact = riskCells[2]?.textContent?.trim() || '';
                data.mitigation = riskCells[3]?.textContent?.trim() || '';
                break;
        }
        
        return data;
    }

    /**
     * Convert row cells to input fields
     */
    convertToEditInputs(row, itemType, data) {
        const cells = row.querySelectorAll('td:not(:last-child)'); // Exclude action column
        
        switch (itemType) {
            case 'internal-resource':
                cells[0].innerHTML = `<input type="text" class="edit-input" value="${data.name}" data-field="name">`;
                cells[1].innerHTML = `<select class="edit-input" data-field="role">
                    ${this.getRoleOptions(data.role)}
                </select>`;
                cells[2].innerHTML = `<input type="number" class="edit-input" value="${data.dailyRate}" data-field="dailyRate" step="0.01" min="0">`;
                cells[3].innerHTML = `<input type="number" class="edit-input" value="${data.q1Days}" data-field="q1Days" step="0.5" min="0">`;
                cells[4].innerHTML = `<input type="number" class="edit-input" value="${data.q2Days}" data-field="q2Days" step="0.5" min="0">`;
                cells[5].innerHTML = `<input type="number" class="edit-input" value="${data.q3Days}" data-field="q3Days" step="0.5" min="0">`;
                cells[6].innerHTML = `<input type="number" class="edit-input" value="${data.q4Days}" data-field="q4Days" step="0.5" min="0">`;
                break;
                
            case 'vendor-cost':
                cells[0].innerHTML = `<input type="text" class="edit-input" value="${data.vendor}" data-field="vendor">`;
                cells[1].innerHTML = `<select class="edit-input" data-field="category">
                    ${this.getVendorCategoryOptions(data.category)}
                </select>`;
                cells[2].innerHTML = `<input type="text" class="edit-input" value="${data.description}" data-field="description">`;
                cells[3].innerHTML = `<input type="number" class="edit-input" value="${data.q1Cost}" data-field="q1Cost" step="0.01" min="0">`;
                cells[4].innerHTML = `<input type="number" class="edit-input" value="${data.q2Cost}" data-field="q2Cost" step="0.01" min="0">`;
                cells[5].innerHTML = `<input type="number" class="edit-input" value="${data.q3Cost}" data-field="q3Cost" step="0.01" min="0">`;
                cells[6].innerHTML = `<input type="number" class="edit-input" value="${data.q4Cost}" data-field="q4Cost" step="0.01" min="0">`;
                break;
                
            // Add other cases as needed...
        }

        // Focus first input
        const firstInput = row.querySelector('.edit-input');
        if (firstInput) {
            firstInput.focus();
            firstInput.select();
        }
    }

    /**
     * Handle save edit
     */
    handleSaveEdit(button) {
        const itemId = button.dataset.id;
        const editState = this.editingStates.get(itemId);
        
        if (!editState) return;

        const row = editState.row;
        const newData = this.extractEditData(row, editState.type);
        
        // Validate data
        if (!this.validateEditData(newData, editState.type)) {
            alert('Please check your inputs. Some fields are invalid.');
            return;
        }

        // Update the data in your main data structure
        this.updateItemData(itemId, newData, editState.type);
        
        // Convert back to display mode
        this.finishEditing(itemId, newData, editState.type);
        
        // Recalculate totals
        if (window.updateCalculations) {
            window.updateCalculations();
        }
    }

    /**
     * Handle cancel edit
     */
    handleCancelEdit(button) {
        const itemId = button.dataset.id;
        const editState = this.editingStates.get(itemId);
        const originalData = this.originalValues.get(itemId);
        
        if (!editState || !originalData) return;
        
        this.finishEditing(itemId, originalData, editState.type);
    }

    /**
     * Extract data from edit inputs
     */
    extractEditData(row, itemType) {
        const inputs = row.querySelectorAll('.edit-input');
        const data = {};
        
        inputs.forEach(input => {
            const field = input.dataset.field;
            const value = input.type === 'number' ? parseFloat(input.value) || 0 : input.value.trim();
            data[field] = value;
        });
        
        return data;
    }

    /**
     * Validate edit data
     */
    validateEditData(data, itemType) {
        switch (itemType) {
            case 'internal-resource':
                return data.name && data.role && data.dailyRate >= 0;
            case 'vendor-cost':
                return data.vendor && data.description;
            case 'tool-cost':
                return data.tool && data.cost >= 0;
            case 'misc-cost':
                return data.description && data.cost >= 0;
            case 'risk':
                return data.description && data.probability && data.impact;
        }
        return true;
    }

    /**
     * Update item data in main data structure
     */
    updateItemData(itemId, newData, itemType) {
        // This would integrate with your existing data management
        // You'll need to adapt this to your current data structure
        console.log('Updating item:', itemId, newData, itemType);
        
        // Example: Update in localStorage or your data object
        // This is a placeholder - implement according to your data structure
        if (window.updateItemById) {
            window.updateItemById(itemId, newData, itemType);
        }
    }

    /**
     * Finish editing and restore display mode
     */
    finishEditing(itemId, data, itemType) {
        const editState = this.editingStates.get(itemId);
        if (!editState) return;

        const row = editState.row;
        
        // Restore display cells
        this.restoreDisplayCells(row, data, itemType);
        
        // Restore action buttons
        const actionCell = row.querySelector('td:last-child');
        const deleteBtn = actionCell.querySelector('.delete-btn')?.outerHTML || '';
        actionCell.innerHTML = `
            ${this.createEditButton(itemId, itemType)}
            ${deleteBtn}
        `;

        // Clean up
        row.classList.remove('editing');
        this.editingStates.delete(itemId);
        this.originalValues.delete(itemId);
    }

    /**
     * Restore display cells from data
     */
    restoreDisplayCells(row, data, itemType) {
        const cells = row.querySelectorAll('td:not(:last-child)');
        
        switch (itemType) {
            case 'internal-resource':
                cells[0].textContent = data.name;
                cells[1].textContent = data.role;
                cells[2].textContent = `$${data.dailyRate.toFixed(2)}`;
                cells[3].textContent = data.q1Days.toString();
                cells[4].textContent = data.q2Days.toString();
                cells[5].textContent = data.q3Days.toString();
                cells[6].textContent = data.q4Days.toString();
                cells[7].textContent = `$${((data.q1Days + data.q2Days + data.q3Days + data.q4Days) * data.dailyRate).toFixed(2)}`;
                break;
                
            case 'vendor-cost':
                cells[0].textContent = data.vendor;
                cells[1].textContent = data.category;
                cells[2].textContent = data.description;
                cells[3].textContent = `$${data.q1Cost.toFixed(2)}`;
                cells[4].textContent = `$${data.q2Cost.toFixed(2)}`;
                cells[5].textContent = `$${data.q3Cost.toFixed(2)}`;
                cells[6].textContent = `$${data.q4Cost.toFixed(2)}`;
                cells[7].textContent = `$${(data.q1Cost + data.q2Cost + data.q3Cost + data.q4Cost).toFixed(2)}`;
                break;
                
            // Add other cases...
        }
    }

    /**
     * Get role options for dropdown
     */
    getRoleOptions(selectedRole) {
        const roles = [
            'Project Manager', 'Technical Lead', 'Senior Developer', 'Developer',
            'Business Analyst', 'Tester', 'DevOps Engineer', 'Architect',
            'UI/UX Designer', 'Data Analyst'
        ];
        
        return roles.map(role => 
            `<option value="${role}" ${role === selectedRole ? 'selected' : ''}>${role}</option>`
        ).join('');
    }

    /**
     * Get vendor category options
     */
    getVendorCategoryOptions(selectedCategory) {
        const categories = ['Implementation', 'Consulting', 'Training', 'Support', 'Other'];
        
        return categories.map(category => 
            `<option value="${category}" ${category === selectedCategory ? 'selected' : ''}>${category}</option>`
        ).join('');
    }
}

// Initialize edit manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.editManager = new EditManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EditManager;
}
