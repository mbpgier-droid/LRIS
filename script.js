// DOM Elements
const navLinks = document.querySelectorAll('.nav a');
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('section[id]');
const searchInput = document.querySelector('.search-box input');
const filterSelects = document.querySelectorAll('.filters select');

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Update navigation active states
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Update sidebar active states
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Find corresponding menu item and activate it
    const menuItemMap = {
        'dashboard': 0,
        'school': 1,
        'items': 2,
        'resources': 3,
        'records': 4,
        'report': 5,
        'settings': 6
    };
    
    if (menuItemMap[sectionId] !== undefined) {
        menuItems[menuItemMap[sectionId]].classList.add('active');
    }
    
    // Initialize specific section functionality
    if (sectionId === 'items') {
        console.log('Items section selected, initializing...');
        setTimeout(() => {
            console.log('Calling initializeItems...');
            initializeItems();
        }, 100);
    } else if (sectionId === 'resources') {
        setTimeout(() => {
            initializeResources();
        }, 100);
    } else if (sectionId === 'school') {
        setTimeout(() => {
            initializeSchoolSection();
        }, 100);
    }
}

// Event listeners for navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

const menuItemMap = {
    'dashboard': 0,
    'school': 1,
    'items': 2,
    'resources': 3,
    'records': 4,
    'report': 5,
    'settings': 6
};
const sectionMap = ['dashboard', 'school', 'items', 'resources', 'records', 'report', 'settings'];

menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const sectionId = sectionMap[index];
        showSection(sectionId);
        // Update URL hash
        window.location.hash = sectionId;
    });
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('.inventory-table tbody tr');
    
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Filter functionality
filterSelects.forEach(select => {
    select.addEventListener('change', () => {
        const categoryFilter = filterSelects[0].value;
        const statusFilter = filterSelects[1].value;
        const tableRows = document.querySelectorAll('.inventory-table tbody tr');
        
        tableRows.forEach(row => {
            const category = row.children[1].textContent;
            const status = row.children[3].textContent;
            
            const categoryMatch = categoryFilter === 'All Categories' || category === categoryFilter;
            const statusMatch = statusFilter === 'All Status' || status === statusFilter;
            
            if (categoryMatch && statusMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});

// Add new item functionality
const addItemBtn = document.querySelector('.btn-primary');
if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
        showAddItemModal();
    });
}

// Modal functionality

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

function addNewItem() {
    const form = document.getElementById('addItemForm');
    const formData = new FormData(form);
    
    const itemName = document.getElementById('itemName').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemQuantity = document.getElementById('itemQuantity').value;
    const itemStatus = document.getElementById('itemStatus').value;
    
    // Add to table
    const tableBody = document.querySelector('.inventory-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${itemName}</td>
        <td>${itemCategory}</td>
        <td>${itemQuantity}</td>
        <td><span class="status ${itemStatus.toLowerCase().replace(' ', '-')}">${itemStatus}</span></td>
        <td>${new Date().toISOString().split('T')[0]}</td>
        <td>
            <button class="btn-icon"><i class="fas fa-edit"></i></button>
            <button class="btn-icon"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tableBody.appendChild(newRow);
    
    // Update stats
    updateStats();
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification('Item added successfully!', 'success');
}

// Stats update functionality
function updateStats() {
    const tableRows = document.querySelectorAll('.inventory-table tbody tr');
    let totalBooks = 0;
    let totalEquipment = 0;
    
    tableRows.forEach(row => {
        const category = row.children[1].textContent;
        const quantity = parseInt(row.children[2].textContent);
        
        if (category === 'Books') {
            totalBooks += quantity;
        } else if (category === 'Equipment') {
            totalEquipment += quantity;
        }
    });
    
    // Update stats display
    const bookStat = document.querySelector('.stat-card:nth-child(1) .stat-number');
    const equipmentStat = document.querySelector('.stat-card:nth-child(2) .stat-number');
    
    if (bookStat) bookStat.textContent = totalBooks;
    if (equipmentStat) equipmentStat.textContent = totalEquipment;
}

// Activity tracking system
let activities = [];

// Activity types and their icons
const activityTypes = {
    'school_added': { icon: 'fas fa-plus', color: '#10b981' },
    'school_updated': { icon: 'fas fa-edit', color: '#3b82f6' },
    'school_deleted': { icon: 'fas fa-trash', color: '#ef4444' },
    'resource_added': { icon: 'fas fa-book', color: '#8b5cf6' },
    'resource_updated': { icon: 'fas fa-edit', color: '#3b82f6' },
    'resource_deleted': { icon: 'fas fa-trash', color: '#ef4444' },
    'subject_added': { icon: 'fas fa-book-open', color: '#10b981' },
    'subject_updated': { icon: 'fas fa-edit', color: '#3b82f6' },
    'subject_deleted': { icon: 'fas fa-trash', color: '#ef4444' },
    'report_generated': { icon: 'fas fa-chart-bar', color: '#f59e0b' },
    'data_exported': { icon: 'fas fa-download', color: '#06b6d4' },
    'data_imported': { icon: 'fas fa-upload', color: '#84cc16' }
};

// Add new activity
function addActivity(type, title, description) {
    const activity = {
        id: Date.now(),
        type: type,
        title: title,
        description: description,
        timestamp: new Date(),
        timeAgo: 'Just now'
    };
    
    // Add to beginning of array
    activities.unshift(activity);
    
    // Keep only last 20 activities for storage
    if (activities.length > 20) {
        activities = activities.slice(0, 20);
    }
    
    // Update display
    updateActivityDisplay();
    
    // Store in localStorage for persistence
    localStorage.setItem('lris_activities', JSON.stringify(activities));
}

// Update activity display
function updateActivityDisplay() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    // Show only first 5 activities by default
    const activitiesToShow = activities.slice(0, 5);
    
    activitiesToShow.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.style.animation = 'fadeIn 0.5s ease-out';
        
        const activityType = activityTypes[activity.type] || { icon: 'fas fa-info-circle', color: '#64748b' };
        
        activityItem.innerHTML = `
            <div class="activity-icon" style="background: ${activityType.color}20; color: ${activityType.color};">
                <i class="${activityType.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <span class="activity-time">${activity.timeAgo}</span>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
    
    // Update "View All" button text
    const viewAllBtn = document.querySelector('.section-title .btn-secondary');
    if (viewAllBtn) {
        if (activities.length > 5) {
            viewAllBtn.textContent = `View All (${activities.length})`;
            viewAllBtn.style.display = 'block';
        } else {
            viewAllBtn.style.display = 'none';
        }
    }
}

// Update time ago for activities
function updateActivityTimes() {
    activities.forEach(activity => {
        const timeDiff = Date.now() - activity.timestamp;
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(timeDiff / 3600000);
        const days = Math.floor(timeDiff / 86400000);
        
        if (minutes < 1) {
            activity.timeAgo = 'Just now';
        } else if (minutes < 60) {
            activity.timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
            activity.timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            activity.timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
        }
    });
    
    updateActivityDisplay();
}

// Load activities from localStorage
function loadActivities() {
    const savedActivities = localStorage.getItem('lris_activities');
    if (savedActivities) {
        activities = JSON.parse(savedActivities);
        // Convert timestamp strings back to Date objects
        activities.forEach(activity => {
            activity.timestamp = new Date(activity.timestamp);
        });
        updateActivityTimes();
        updateActivityDisplay();
    }
    
    // Add event listener for "View All" button
    const viewAllBtn = document.querySelector('.section-title .btn-secondary');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', toggleActivityView);
    }
}

// Toggle between showing all activities and showing only 5
let showingAllActivities = false;

function toggleActivityView() {
    const activityList = document.querySelector('.activity-list');
    const viewAllBtn = document.querySelector('.section-title .btn-secondary');
    
    if (!activityList || !viewAllBtn) return;
    
    showingAllActivities = !showingAllActivities;
    
    if (showingAllActivities) {
        // Show all activities
        activityList.innerHTML = '';
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.style.animation = 'fadeIn 0.5s ease-out';
            
            const activityType = activityTypes[activity.type] || { icon: 'fas fa-info-circle', color: '#64748b' };
            
            activityItem.innerHTML = `
                <div class="activity-icon" style="background: ${activityType.color}20; color: ${activityType.color};">
                    <i class="${activityType.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.timeAgo}</span>
                </div>
            `;
            
            activityList.appendChild(activityItem);
        });
        viewAllBtn.textContent = 'Show Less';
    } else {
        // Show only 5 activities
        updateActivityDisplay();
    }
}

// Dashboard stats update functionality
async function updateDashboardStats() {
    try {
        const response = await fetch('http://localhost:3000/api/schools');
        const schools = await response.json();
        
        let totalSchools = schools.length;
        let totalLearners = 0;
        let totalResourcesDistributed = 0;
        
        schools.forEach(school => {
            totalLearners += parseInt(school.Enrollees) || 0;
            totalResourcesDistributed += parseInt(school.ResourcesAllocated) || 0;
        });
        
        // Update dashboard stats
        const schoolStat = document.querySelector('.stat-card:nth-child(1) .stat-number');
        const learnerStat = document.querySelector('.stat-card:nth-child(2) .stat-number');
        const resourcesStat = document.querySelector('.stat-card:nth-child(3) .stat-number');
        
        if (schoolStat) schoolStat.textContent = totalSchools.toLocaleString();
        if (learnerStat) learnerStat.textContent = totalLearners.toLocaleString();
        if (resourcesStat) resourcesStat.textContent = totalResourcesDistributed.toLocaleString();
        
        // Update change indicators
        const schoolChange = document.querySelector('.stat-card:nth-child(1) .stat-change');
        const learnerChange = document.querySelector('.stat-card:nth-child(2) .stat-change');
        const resourcesChange = document.querySelector('.stat-card:nth-child(3) .stat-change');
        
        if (schoolChange) schoolChange.textContent = `+${totalSchools} total schools`;
        if (learnerChange) learnerChange.textContent = `+${totalLearners.toLocaleString()} total learners`;
        if (resourcesChange) resourcesChange.textContent = `+${totalResourcesDistributed.toLocaleString()} total resources`;
        
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
        // Keep default values if there's an error
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 0.5rem;
                padding: 1rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #3b82f6;
                z-index: 3000;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-content i {
                color: #3b82f6;
            }
            
            .notification-success .notification-content i {
                color: #10b981;
            }
            
            .notification-error .notification-content i {
                color: #ef4444;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Delete item functionality
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-icon') && e.target.closest('.fa-trash')) {
        const row = e.target.closest('tr');
        const tableId = row.closest('table').id || row.closest('table').className;
        if (confirm('Are you sure you want to delete this item?')) {
            // Handle different table types
            if (tableId === 'schoolTableBody' || tableId === 'school-table') {
                // Delete school from backend
                const schoolId = row.querySelector('td:nth-child(2)').textContent; // School ID
                deleteSchool(schoolId, row);
            } else if (tableId === 'resourcesTableBody' || tableId === 'resources-table') {
                // Delete resource (frontend only for now)
                const resourceName = row.querySelector('td:nth-child(1)').textContent;
                const resourceCategory = row.querySelector('td:nth-child(2)').textContent;
                const resourceGradeLevel = row.querySelector('td:nth-child(6)').textContent;
                const resourceSchool = row.querySelector('td:nth-child(7)').textContent;
                row.remove();
                showNotification('Resource deleted successfully!', 'success');
                addActivity('resource_deleted', 'Resource removed', `${resourceName} (${resourceCategory}) - ${resourceGradeLevel} was deleted from ${resourceSchool}`);
            }
            // Remove the generic delete for other tables
        }
    }
});

// Edit item functionality
// Restrict this handler to only school and resource tables
// Only handle school and resource tables here
// Do not call showEditSchoolModal for item tables
document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-icon') && e.target.closest('.fa-edit')) {
        const row = e.target.closest('tr');
        const tableId = row.closest('table').id || row.closest('table').className;
        if (tableId === 'schoolTableBody' || tableId === 'school-table') {
            showEditSchoolModal(row);
        } else if (tableId === 'resourcesTableBody' || tableId === 'resources-table') {
            showEditResourceModal(row);
        }
        // Do not handle item tables here
    }
});

// Delete school from backend
async function deleteSchool(schoolId, row) {
    try {
        const response = await fetch(`http://localhost:3000/api/schools/${schoolId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            const schoolName = row.querySelector('td:nth-child(1)').textContent;
            row.remove();
            showNotification('School deleted successfully!', 'success');
            addActivity('school_deleted', 'School removed', `${schoolName} was deleted from the system`);
            populateSchoolDropdowns(); // Refresh school dropdowns
        } else {
            const errorData = await response.json();
            showNotification(`Failed to delete school: ${errorData.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting school:', error);
        showNotification('Error deleting school: Network error', 'error');
    }
}

// Show edit school modal
function showEditSchoolModal(row) {
    const cells = row.children;
    const schoolData = {
        name: cells[0].textContent,
        id: cells[1].textContent,
        enrollees: cells[2].textContent,
        resourcesAllocated: cells[3].textContent,
        district: cells[4].textContent,
        level: cells[5].textContent,
        principal: cells[6].textContent,
        contact: cells[7].textContent,
        email: cells[8].textContent
    };
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit School</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editSchoolForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editSchoolName">School Name</label>
                            <input type="text" id="editSchoolName" value="${schoolData.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editSchoolId">School ID</label>
                            <input type="text" id="editSchoolId" value="${schoolData.id}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editEnrollees">Number of Enrollees</label>
                            <input type="number" id="editEnrollees" value="${schoolData.enrollees}" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="editResourcesAllocated">Resources Allocated</label>
                            <input type="number" id="editResourcesAllocated" value="${schoolData.resourcesAllocated}" min="0" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editDistrict">District</label>
                            <select id="editDistrict" required>
                                <option value="District 1" ${schoolData.district === 'District 1' ? 'selected' : ''}>District 1</option>
                                <option value="District 2" ${schoolData.district === 'District 2' ? 'selected' : ''}>District 2</option>
                                <option value="District 3" ${schoolData.district === 'District 3' ? 'selected' : ''}>District 3</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editLevel">Level</label>
                            <select id="editLevel" required>
                                <option value="Elementary" ${schoolData.level === 'Elementary' ? 'selected' : ''}>Elementary</option>
                                <option value="High School" ${schoolData.level === 'High School' ? 'selected' : ''}>High School</option>
                                <option value="Senior High" ${schoolData.level === 'Senior High' ? 'selected' : ''}>Senior High</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editPrincipal">Principal</label>
                            <input type="text" id="editPrincipal" value="${schoolData.principal}" required>
                        </div>
                        <div class="form-group">
                            <label for="editContact">Contact Number</label>
                            <input type="text" id="editContact" value="${schoolData.contact}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editEmail">Email Address</label>
                            <input type="email" id="editEmail" value="${schoolData.email}" required>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn-primary">Update School</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('editSchoolForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedSchool = {
            name: document.getElementById('editSchoolName').value,
            id: document.getElementById('editSchoolId').value,
            enrollees: document.getElementById('editEnrollees').value,
            resourcesAllocated: document.getElementById('editResourcesAllocated').value,
            district: document.getElementById('editDistrict').value,
            level: document.getElementById('editLevel').value,
            principal: document.getElementById('editPrincipal').value,
            contact: document.getElementById('editContact').value,
            email: document.getElementById('editEmail').value
        };
        
        try {
            const response = await fetch(`http://localhost:3000/api/schools/${schoolData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSchool)
            });
            
            if (response.ok) {
                // Update the row in the table
                cells[0].textContent = updatedSchool.name;
                cells[1].textContent = updatedSchool.id;
                cells[2].textContent = updatedSchool.enrollees;
                cells[3].textContent = updatedSchool.resourcesAllocated;
                cells[4].textContent = updatedSchool.district;
                cells[5].textContent = updatedSchool.level;
                cells[6].textContent = updatedSchool.principal;
                cells[7].textContent = updatedSchool.contact;
                cells[8].textContent = updatedSchool.email;
                
                modal.remove();
                showNotification('School updated successfully!', 'success');
                addActivity('school_updated', 'School information updated', `${updatedSchool.name} details were modified`);
            } else {
                const errorData = await response.json();
                showNotification(`Failed to update school: ${errorData.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error updating school:', error);
            showNotification('Error updating school: Network error', 'error');
        }
    });
}



// Add Resource Modal Functionality
const addResourceBtn = document.getElementById('addResourceBtn');
const addResourceModal = document.getElementById('addResourceModal');
const closeResourceModal = document.getElementById('closeResourceModal');
const cancelResourceModal = document.getElementById('cancelResourceModal');
const addResourceForm = document.getElementById('addResourceForm');
const resourcesTableBody = document.getElementById('resourcesTableBody');

if (addResourceBtn && addResourceModal && closeResourceModal && cancelResourceModal && addResourceForm && resourcesTableBody) {
    addResourceBtn.addEventListener('click', () => {
        addResourceModal.style.display = 'flex';
        // Ensure school dropdown is populated when modal opens
        populateSchoolDropdowns();
        // Reset to first step
        showFirstStep();
        // Always re-attach Next Step event listener to avoid lost handler
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.onclick = null; // Remove previous handler if any
            nextStepBtn.addEventListener('click', () => {
                if (validateFirstStep()) {
                    showSecondStep();
                }
            });
        }
    });
    
    // Add event listener for school selection to populate grade levels
    const resourceSchoolSelect = document.getElementById('resourceSchool');
    if (resourceSchoolSelect) {
        resourceSchoolSelect.addEventListener('change', (e) => {
            populateGradeLevels(e.target.value);
        });
    }
    
    function hideResourceModal() {
        addResourceModal.style.display = 'none';
        // Reset forms when modal is closed
        showFirstStep();
    }
    
    closeResourceModal.addEventListener('click', hideResourceModal);
    cancelResourceModal.addEventListener('click', hideResourceModal);
    
    // Next Step button functionality
    const nextStepBtn = document.getElementById('nextStepBtn');
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (validateFirstStep()) {
                showSecondStep();
            }
        });
    }
    
    // Back button functionality
    const backToFirstStep = document.getElementById('backToFirstStep');
    if (backToFirstStep) {
        backToFirstStep.addEventListener('click', showFirstStep);
    }
    
    // Second form submission
    const resourceDetailsForm = document.getElementById('resourceDetailsForm');
    if (resourceDetailsForm) {
        resourceDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processResourceSubmission();
        });
    }
}

// Show first step form
function showFirstStep() {
    const firstForm = document.getElementById('addResourceForm');
    const secondForm = document.getElementById('resourceDetailsForm');
    
    if (firstForm && secondForm) {
        firstForm.style.display = 'block';
        secondForm.style.display = 'none';
        firstForm.classList.add('form-slide', 'visible');
        secondForm.classList.remove('form-slide', 'visible');
    }
}

// Show second step form
async function showSecondStep() {
    const firstForm = document.getElementById('addResourceForm');
    const secondForm = document.getElementById('resourceDetailsForm');
    const gradeLevelSelect = document.getElementById('resourceGradeLevel');
    const selectedGradeLevel = gradeLevelSelect ? gradeLevelSelect.value : '';
    const resourceCategory = document.getElementById('resourceCategory') ? document.getElementById('resourceCategory').value : '';

    if (firstForm && secondForm) {
        firstForm.style.display = 'none';
        secondForm.style.display = 'block';
        const gradeLevelForms = document.getElementById('gradeLevelForms');
        if (gradeLevelForms) {
            gradeLevelForms.innerHTML = '';
            let formHtml = '';
            if (resourceCategory === 'SLM/SLAS') {
                formHtml = `<div class="form-group"><label for="resourceItemSelect">Select SLM/SLAS Item</label><select id="resourceItemSelect" required><option value="">Loading...</option></select></div>`;
                formHtml += `<div class="form-group"><label for="resourceQuantity">Quantity</label><input type="number" id="resourceQuantity" min="1" required></div>`;
                gradeLevelForms.innerHTML = formHtml;
                fetch('/api/items/slm').then(r => r.json()).then(items => {
                    const select = document.getElementById('resourceItemSelect');
                    if (select) {
                        select.innerHTML = '<option value="">Select SLM/SLAS Item</option>';
                        items.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.SLMItemID || item.id || item._id || item.Title;
                            option.textContent = (item.Title || '') + (item.Subject ? ' - ' + item.Subject : '');
                            select.appendChild(option);
                        });
                        if (items.length === 0) {
                            select.innerHTML = '<option value="">No SLM/SLAS items found</option>';
                        }
                    }
                });
            } else if (resourceCategory === 'Equipment') {
                formHtml = `<div class="form-group"><label for="resourceItemSelect">Select Equipment Item</label><select id="resourceItemSelect" required><option value="">Loading...</option></select></div>`;
                formHtml += `<div class="form-group"><label for="resourceQuantity">Quantity</label><input type="number" id="resourceQuantity" min="1" required></div>`;
                gradeLevelForms.innerHTML = formHtml;
                fetch('/api/items/equipment').then(r => r.json()).then(items => {
                    const select = document.getElementById('resourceItemSelect');
                    if (select) {
                        select.innerHTML = '<option value="">Select Equipment Item</option>';
                        items.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.EquipmentID || item.id || item._id || item.EquipmentName;
                            option.textContent = (item.EquipmentName || '') + (item.EquipmentType ? ' - ' + item.EquipmentType : '');
                            select.appendChild(option);
                        });
                        if (items.length === 0) {
                            select.innerHTML = '<option value="">No Equipment items found</option>';
                        }
                    }
                });
            } else if (resourceCategory === 'TVL') {
                formHtml = `<div class="form-group"><label for="resourceItemSelect">Select TVL Item</label><select id="resourceItemSelect" required><option value="">Loading...</option></select></div>`;
                formHtml += `<div class="form-group"><label for="resourceQuantity">Quantity</label><input type="number" id="resourceQuantity" min="1" required></div>`;
                gradeLevelForms.innerHTML = formHtml;
                fetch('/api/items/tvl').then(r => r.json()).then(items => {
                    const select = document.getElementById('resourceItemSelect');
                    if (select) {
                        select.innerHTML = '<option value="">Select TVL Item</option>';
                        items.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.TVLItemID || item.id || item._id || item.ItemName;
                            option.textContent = (item.ItemName || '') + (item.Track ? ' - ' + item.Track : '');
                            select.appendChild(option);
                        });
                        if (items.length === 0) {
                            select.innerHTML = '<option value="">No TVL items found</option>';
                        }
                    }
                });
            } else if (resourceCategory === 'Lesson Exemplar(Matatag)') {
                formHtml = `<div class="form-group"><label for="resourceItemSelect">Select Lesson Exemplar</label><select id="resourceItemSelect" required><option value="">Loading...</option></select></div>`;
                formHtml += `<div class="form-group"><label for="resourceQuantity">Quantity</label><input type="number" id="resourceQuantity" min="1" required></div>`;
                gradeLevelForms.innerHTML = formHtml;
                fetch('/api/items/lesson').then(r => r.json()).then(items => {
                    const select = document.getElementById('resourceItemSelect');
                    if (select) {
                        select.innerHTML = '<option value="">Select Lesson Exemplar</option>';
                        items.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.LessonID || item.id || item._id || item.LessonTitle;
                            option.textContent = (item.LessonTitle || '') + (item.Subject ? ' - ' + item.Subject : '');
                            select.appendChild(option);
                        });
                        if (items.length === 0) {
                            select.innerHTML = '<option value="">No Lesson Exemplar items found</option>';
                        }
                    }
                });
            } else if (resourceCategory === 'Others') {
                formHtml = `<div class=\"form-group\"><label for=\"resourceOtherName\">Resource Name</label><input type=\"text\" id=\"resourceOtherName\" required></div>`;
                formHtml += `<div class=\"form-group\"><label for=\"resourceQuantity\">Quantity</label><input type=\"number\" id=\"resourceQuantity\" min=\"1\" required></div>`;
                gradeLevelForms.innerHTML = formHtml;
            } else {
                formHtml = `<div class=\"form-group\">Please select a category in the previous step.</div>`;
                gradeLevelForms.innerHTML = formHtml;
            }
        }
    }
}

// Validate first step
function validateFirstStep() {
    // Only check for the fields that are still present in the HTML
    // Example: Category, School, Quarter
    const resourceCategory = document.getElementById('resourceCategory');
    const resourceSchool = document.getElementById('resourceSchool');
    const resourceQuarter = document.getElementById('resourceQuarter');

    if (resourceCategory && !resourceCategory.value) {
        showNotification('Please select a category.', 'error');
        return false;
    }
    if (resourceSchool && !resourceSchool.value) {
        showNotification('Please select a school.', 'error');
        return false;
    }
    if (resourceQuarter && !resourceQuarter.value) {
        showNotification('Please select a quarter.', 'error');
        return false;
    }
    return true;
}

// Generate grade level forms for second step
function generateGradeLevelForms() {
    const selectedSchool = document.getElementById('resourceSchool').value;
    const selectedQuarter = document.getElementById('resourceQuarter').value;
    const gradeLevelFormsContainer = document.getElementById('gradeLevelForms');
    const selectedSchoolNameSpan = document.getElementById('selectedSchoolName');
    
    if (!gradeLevelFormsContainer || !selectedSchoolNameSpan) return;
    
    // Update school name in header
    selectedSchoolNameSpan.textContent = selectedSchool;
    
    // Clear existing forms
    gradeLevelFormsContainer.innerHTML = '';
    
    // Get available grade levels for the selected school
    const resourceSchoolSelect = document.getElementById('resourceSchool');
    const selectedOption = resourceSchoolSelect.querySelector(`option[value="${selectedSchool}"]`);
    
    if (selectedOption) {
        const schoolLevel = selectedOption.getAttribute('data-level');
        const availableGrades = gradeLevels[schoolLevel] || [];
        
        availableGrades.forEach(grade => {
            const gradeSection = document.createElement('div');
            gradeSection.className = 'grade-level-section';
            gradeSection.innerHTML = `
                <div class="grade-level-header">
                    <div class="grade-level-title">${grade}</div>
                    <button type="button" class="add-subject-btn" onclick="addSubjectRow('${grade}')">
                        <i class="fas fa-plus"></i> Add Subject
                    </button>
                </div>
                <div class="subjects-container" id="subjects-${grade}">
                    <!-- Subject rows will be added here -->
                </div>
            `;
            gradeLevelFormsContainer.appendChild(gradeSection);
            
            // Add initial subject row for each grade
            addSubjectRow(grade);
        });
    }
}

// Add subject row to a grade level
function addSubjectRow(gradeLevel) {
    const subjectsContainer = document.getElementById('subjects-' + gradeLevel);
    if (!subjectsContainer) return;
    subjectsContainer.appendChild(subjectRow);
}

// Remove subject row
function removeSubjectRow(button) {
    const subjectRow = button.closest('.subject-row');
    const subjectsContainer = subjectRow.parentElement;
    
    // Don't remove if it's the last subject row
    if (subjectsContainer.children.length > 1) {
        subjectRow.remove();
    } else {
        showNotification('At least one subject is required per grade level.', 'error');
    }
}

// Process final resource submission
async function processResourceSubmission() {
    const SchoolID = document.getElementById('resourceSchool').value;
    const ResourceCategory = document.getElementById('resourceCategory').value;
    let ResourceItemID = null;
    let ResourceName = null;
    if (document.getElementById('resourceItemSelect')) {
        ResourceItemID = document.getElementById('resourceItemSelect').value || null;
    }
    if (document.getElementById('resourceOtherName')) {
        ResourceName = document.getElementById('resourceOtherName').value || null;
    }
    const Quantity = document.getElementById('resourceQuantity').value;
    const Notes = '';

    // Send to backend
    const response = await fetch('/api/distributed-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            SchoolID,
            ResourceCategory,
            ResourceItemID: ResourceItemID ? parseInt(ResourceItemID) : null,
            ResourceName,
            Quantity: parseInt(Quantity),
            Notes
        })
    });
    const data = await response.json();
    if (response.ok) {
        showNotification('Resource distribution recorded!', 'success');
    } else {
        showNotification('Error: ' + (data.error || 'Failed to record distribution'), 'error');
    }
}

// Show edit resource modal
function showEditResourceModal(row) {
    const cells = row.children;
    const resourceData = {
        name: cells[0].textContent,
        category: cells[1].textContent,
        subject: cells[2].textContent,
        quantity: cells[3].textContent,
        quarter: cells[4].textContent,
        gradeLevel: cells[5].textContent,
        school: cells[6].textContent
    };
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Resource</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editResourceForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editResourceName">Resource Name</label>
                            <input type="text" id="editResourceName" value="${resourceData.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="editResourceCategory">Category</label>
                            <select id="editResourceCategory" required>
                                <option value="Books" ${resourceData.category === 'Books' ? 'selected' : ''}>Books</option>
                                <option value="Equipment" ${resourceData.category === 'Equipment' ? 'selected' : ''}>Equipment</option>
                                <option value="Supplies" ${resourceData.category === 'Supplies' ? 'selected' : ''}>Supplies</option>
                                <option value="Digital Resources" ${resourceData.category === 'Digital Resources' ? 'selected' : ''}>Digital Resources</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editResourceSubject">Subject</label>
                            <input type="text" id="editResourceSubject" value="${resourceData.subject}" required>
                        </div>
                        <div class="form-group">
                            <label for="editResourceQuantity">Quantity</label>
                            <input type="number" id="editResourceQuantity" value="${resourceData.quantity}" min="1" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editResourceQuarter">Quarter</label>
                            <select id="editResourceQuarter" required>
                                <option value="1st Quarter" ${resourceData.quarter === '1st Quarter' ? 'selected' : ''}>1st Quarter</option>
                                <option value="2nd Quarter" ${resourceData.quarter === '2nd Quarter' ? 'selected' : ''}>2nd Quarter</option>
                                <option value="3rd Quarter" ${resourceData.quarter === '3rd Quarter' ? 'selected' : ''}>3rd Quarter</option>
                                <option value="4th Quarter" ${resourceData.quarter === '4th Quarter' ? 'selected' : ''}>4th Quarter</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editResourceGradeLevel">Grade Level</label>
                            <select id="editResourceGradeLevel" required>
                                <option value="">Select Grade Level</option>
                                <!-- Grade levels will be populated dynamically -->
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editResourceSchool">School</label>
                            <select id="editResourceSchool" required>
                                <option value="">Select School</option>
                                <!-- Schools will be populated dynamically -->
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn-primary">Update Resource</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Populate school dropdown in edit modal
    populateEditResourceSchoolDropdown(resourceData.school, resourceData.gradeLevel);
    
    // Handle form submission
    document.getElementById('editResourceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Update the row in the table
        cells[0].textContent = document.getElementById('editResourceName').value;
        cells[1].textContent = document.getElementById('editResourceCategory').value;
        cells[2].textContent = document.getElementById('editResourceSubject').value;
        cells[3].textContent = document.getElementById('editResourceQuantity').value;
        cells[4].textContent = document.getElementById('editResourceQuarter').value;
        cells[5].textContent = document.getElementById('editResourceGradeLevel').value;
        cells[6].textContent = document.getElementById('editResourceSchool').value;
        
        const resourceName = document.getElementById('editResourceName').value;
        const resourceCategory = document.getElementById('editResourceCategory').value;
        const resourceGradeLevel = document.getElementById('editResourceGradeLevel').value;
        const resourceSchool = document.getElementById('editResourceSchool').value;
        
        modal.remove();
        showNotification('Resource updated successfully!', 'success');
        addActivity('resource_updated', 'Resource information updated', `${resourceName} (${resourceCategory}) - ${resourceGradeLevel} details were modified for ${resourceSchool}`);
    });
}

// Populate school dropdown in edit resource modal
async function populateEditResourceSchoolDropdown(selectedSchool, selectedGradeLevel) {
    try {
        const response = await fetch('http://localhost:3000/api/schools');
        const schools = await response.json();
        
        const editResourceSchoolSelect = document.getElementById('editResourceSchool');
        if (editResourceSchoolSelect) {
            // Clear existing options except the first one
            editResourceSchoolSelect.innerHTML = '<option value="">Select School</option>';
            
            schools.forEach(school => {
                const option = document.createElement('option');
                option.value = school.SchoolID; // Use the unique SchoolID
                option.textContent = `${school.Name} (${school.District})`;
                option.setAttribute('data-level', school.Level);
                if (school.Name === selectedSchool) {
                    option.selected = true;
                }
                editResourceSchoolSelect.appendChild(option);
            });
            
            // Populate grade levels for the selected school
            populateEditResourceGradeLevels(selectedSchool, selectedGradeLevel);
        }
    } catch (error) {
        console.error('Error populating edit resource school dropdown:', error);
    }
}

// Populate grade levels in edit resource modal
function populateEditResourceGradeLevels(selectedSchoolName, selectedGradeLevel) {
    const editGradeLevelSelect = document.getElementById('editResourceGradeLevel');
    if (!editGradeLevelSelect) return;
    
    // Clear existing options
    editGradeLevelSelect.innerHTML = '<option value="">Select Grade Level</option>';
    
    if (!selectedSchoolName) return;
    
    // Find the selected school to get its level
    const editResourceSchoolSelect = document.getElementById('editResourceSchool');
    const selectedOption = editResourceSchoolSelect.querySelector(`option[value="${selectedSchoolName}"]`);
    
    if (selectedOption) {
        const schoolLevel = selectedOption.getAttribute('data-level');
        const availableGrades = gradeLevels[schoolLevel] || [];
        
        availableGrades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade;
            if (grade === selectedGradeLevel) {
                option.selected = true;
            }
            editGradeLevelSelect.appendChild(option);
        });
    }
}

// Add School Modal Functionality
const addSchoolBtn = document.getElementById('addSchoolBtn');
const addSchoolModal = document.getElementById('addSchoolModal');
const closeSchoolModal = document.getElementById('closeSchoolModal');
const cancelSchoolModal = document.getElementById('cancelSchoolModal');
const addSchoolForm = document.getElementById('addSchoolForm');
const schoolTableBody = document.getElementById('schoolTableBody');

// Fetch and display schools from the backend
async function loadSchoolsForTable() {
    console.log('loadSchoolsForTable called');
    const schoolTableBody = document.getElementById('schoolTableBody');
    console.log('schoolTableBody element:', schoolTableBody);
    if (!schoolTableBody) {
        console.error('School table body not found!');
        return;
    }
    
    try {
        console.log('Attempting to fetch schools from database for table...');
        const response = await fetch('http://localhost:3000/api/schools');
        console.log('Response status:', response.status);
        const schools = await response.json();
        console.log('Fetched schools for table:', schools);
        console.log('Number of schools fetched:', schools.length);
        
        schoolTableBody.innerHTML = '';
        schools.forEach((school, index) => {
            console.log(`Processing school ${index + 1}:`, school);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${school.Name || 'N/A'}</td>
                <td>${school.SchoolID || 'N/A'}</td>
                <td>${school.Enrollees || 'N/A'}</td>
                <td>${school.ResourcesAllocated || 'N/A'}</td>
                <td>${school.District || 'N/A'}</td>
                <td>${school.Level || 'N/A'}</td>
                <td>${school.Principal || 'N/A'}</td>
                <td>${school.Contact || 'N/A'}</td>
                <td>${school.Email || 'N/A'}</td>
                <td>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                </td>
            `;
            schoolTableBody.appendChild(tr);
            console.log(`Added school ${index + 1} to table`);
        });
        console.log('Added database schools to table. Total rows:', schoolTableBody.children.length);
    } catch (error) {
        console.error('Error fetching schools for table:', error);
        console.log('Falling back to sample schools for table...');
        
        // Fallback to sample schools
        schoolTableBody.innerHTML = '';
        sampleSchools.forEach(school => {
            console.log('Creating table row for sample school:', school.name);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${school.name}</td>
                <td>${school.schoolId}</td>
                <td>${school.enrollees}</td>
                <td>${school.resourcesAllocated}</td>
                <td>${school.district}</td>
                <td>${school.level}</td>
                <td>${school.principal}</td>
                <td>${school.contact}</td>
                <td>${school.email}</td>
                <td>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                </td>
            `;
            schoolTableBody.appendChild(tr);
        });
        console.log('Added sample schools to table. Total:', sampleSchools.length);
    }
}

if (addSchoolBtn && addSchoolModal && closeSchoolModal && cancelSchoolModal && addSchoolForm && schoolTableBody) {
    addSchoolBtn.addEventListener('click', () => {
        // Safeguard: Remove any duplicate modals
        document.querySelectorAll('#addSchoolModal').forEach((modal, idx) => {
            if (idx > 0) modal.remove();
        });
        addSchoolModal.style.display = 'flex';
    });
    function hideSchoolModal() {
        addSchoolModal.style.display = 'none';
    }
    closeSchoolModal.addEventListener('click', hideSchoolModal);
    cancelSchoolModal.addEventListener('click', hideSchoolModal);
    addSchoolForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const school = {
            name: document.getElementById('schoolName').value,
            id: document.getElementById('schoolId').value,
            enrollees: document.getElementById('enrollees').value,
            resourcesAllocated: document.getElementById('resourcesAllocated').value,
            district: document.getElementById('district').value,
            level: document.getElementById('level').value,
            principal: document.getElementById('principal').value,
            contact: document.getElementById('contact').value,
            email: document.getElementById('email').value
        };
        try {
            const response = await fetch('http://localhost:3000/api/schools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(school)
            });
            if (!response.ok) {
                const errorData = await response.json();
                showNotification('Failed to add school: ' + (errorData.error || 'Unknown error'), 'error');
                console.error('Failed to add school:', errorData);
                return;
            }
            hideSchoolModal();
            addSchoolForm.reset();
            showNotification('School added successfully!', 'success');
            addActivity('school_added', 'New school registered', `${school.name} added to ${school.district}`);
            await loadSchoolsForTable(); // Refresh the table from the backend
            updateDashboardStats(); // Update dashboard stats
            populateSchoolDropdowns(); // Refresh school dropdowns
        } catch (err) {
            showNotification('Error adding school: ' + err.message, 'error');
            console.error('Error adding school:', err);
        }
    });
} else {
    console.log('Add School modal or form elements not found on DOMContentLoaded');
}

// Load schools on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - initializing school table');
    
    // Initialize school table
    loadSchoolsForTable();
    
    // Initialize other components
    updateDashboardStats();
    loadActivities(); // Load saved activities
    
    // Populate school dropdowns with a small delay to ensure DOM is ready
    setTimeout(() => {
        populateSchoolDropdowns();
    }, 100);
    
    // Update activity times every minute
    setInterval(updateActivityTimes, 60000);
});

// Grade level configurations for different school types
const gradeLevels = {
    'Elementary': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    'High School': ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
    'Senior High': ['Grade 11', 'Grade 12']
};

// Populate school dropdowns in forms
async function populateSchoolDropdowns() {
    try {
        const response = await fetch('http://localhost:3000/api/schools');
        const schools = await response.json();
        console.log('Fetched schools:', schools); // Debug log
        // Populate resource form school dropdown
        const resourceSchoolSelect = document.getElementById('resourceSchool');
        console.log('Resource school select element:', resourceSchoolSelect); // Debug log
        if (resourceSchoolSelect) {
            // Clear existing options except the first one
            resourceSchoolSelect.innerHTML = '<option value="">Select School</option>';
            schools.forEach(school => {
                const option = document.createElement('option');
                option.value = school.SchoolID; // Use the unique SchoolID
                option.textContent = `${school.Name} (${school.District})`;
                // Store school level as data attribute for grade level population
                option.setAttribute('data-level', school.Level);
                resourceSchoolSelect.appendChild(option);
            });
            console.log('Populated dropdown with', schools.length, 'schools'); // Debug log
        } else {
            console.log('Resource school select element not found, will retry in 500ms'); // Debug log
            setTimeout(() => {
                populateSchoolDropdowns();
            }, 500);
        }
    } catch (error) {
        console.error('Error populating school dropdowns:', error);
    }
}

// Populate grade levels based on selected school
function populateGradeLevels(selectedSchoolName) {
    const gradeLevelSelect = document.getElementById('resourceGradeLevel');
    if (!gradeLevelSelect) return;
    
    // Clear existing options
    gradeLevelSelect.innerHTML = '<option value="">Select Grade Level</option>';
    
    if (!selectedSchoolName) return;
    
    // Find the selected school to get its level
    const resourceSchoolSelect = document.getElementById('resourceSchool');
    const selectedOption = resourceSchoolSelect.querySelector(`option[value="${selectedSchoolName}"]`);
    
    if (selectedOption) {
        const schoolLevel = selectedOption.getAttribute('data-level');
        console.log(`Selected school: ${selectedSchoolName}, Level: ${schoolLevel}`);
        
        // Get available grades based on school level
        let availableGrades = [];
        if (schoolLevel === 'Elementary') {
            availableGrades = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
        } else if (schoolLevel === 'High School') {
            availableGrades = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
        } else if (schoolLevel === 'Senior High') {
            availableGrades = ['Grade 11', 'Grade 12'];
        }
        
        availableGrades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade;
            gradeLevelSelect.appendChild(option);
        });
        
        console.log(`Populated grade levels for ${schoolLevel}:`, availableGrades);
    }
}




    
    const subjectRow = document.createElement('div');
    subjectRow.className = 'subject-row';
    subjectRow.innerHTML = `
        <div class="form-group">
            <label>Subject</label>
            <select class="subject-select" required>
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Filipino">Filipino</option>
                <option value="Social Studies">Social Studies</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Arts">Arts</option>
                <option value="Technology and Livelihood Education">Technology and Livelihood Education</option>
                <option value="Values Education">Values Education</option>
            </select>
        </div>
        <div class="form-group">
            <label>Modules</label>
            <input type="number" class="modules-input" min="1" value="1" required>
        </div>
        <button type="button" class="remove-subject-btn" onclick="removeSubjectRow(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    subjectsContainer.appendChild(subjectRow);


// Print only the editable table in the Report section
function printEditableTable() {
    const table = document.getElementById('editableTable');
    if (!table) return;
    const printWindow = window.open('', '', 'height=600,width=900');
    printWindow.document.write('<html><head><title>Print Table</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>Records Table</h2>');
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
        addActivity('report_generated', 'Report generated', 'Records table was printed successfully');
    }, 500);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Show dashboard by default
    const hash = window.location.hash.substring(1) || 'dashboard';
    showSection(hash);
    
    // Add some sample data if table is empty
    const tableBody = document.querySelector('.inventory-table tbody');
    if (tableBody && tableBody.children.length === 0) {
        // Add sample data
        const sampleData = [
            ['Mathematics Textbook Grade 7', 'Books', '45', 'Available'],
            ['Science Lab Laptop', 'Equipment', '12', 'Checked Out'],
            ['Art Supplies Kit', 'Supplies', '8', 'Low Stock']
        ];
        
        sampleData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item[0]}</td>
                <td>${item[1]}</td>
                <td>${item[2]}</td>
                <td><span class="status ${item[3].toLowerCase().replace(' ', '-')}">${item[3]}</span></td>
                <td>2024-01-15</td>
                <td>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    // Update stats on load
    updateStats();
    
    // Initialize Items functionality
    initializeItems();
    
    // Initialize Settings functionality
    initializeSettings();
    
    // Initialize animations
    initializeAnimations();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Add any responsive adjustments here
});

// Export functions for global access
window.showSection = showSection;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.populateSchoolDropdowns = populateSchoolDropdowns; // Export for testing
window.addSubjectRow = addSubjectRow;
window.removeSubjectRow = removeSubjectRow; 

// Export Items functions for global access
window.switchItemCategory = switchItemCategory; 

// Logout button functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        showNotification('You have been logged out.', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    });
} 

// Import/Export Excel for Records Section
const importSchoolBtn = document.getElementById('importSchoolBtn');
const exportSchoolBtn = document.getElementById('exportSchoolBtn');
const importSchoolExcel = document.getElementById('importSchoolExcel');
const recordsTableBody = document.querySelector('.records-table tbody');

if (importSchoolBtn && importSchoolExcel && recordsTableBody) {
    importSchoolBtn.addEventListener('click', () => {
        importSchoolExcel.click();
    });
    importSchoolExcel.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        const fileExt = file.name.split('.').pop().toLowerCase();
        reader.onload = function (evt) {
            let workbook, json;
            if (fileExt === 'csv' || fileExt === 'txt') {
                // Parse CSV or TXT
                const csv = evt.target.result;
                workbook = XLSX.read(csv, { type: 'string' });
            } else {
                // Parse Excel
                const data = new Uint8Array(evt.target.result);
                workbook = XLSX.read(data, { type: 'array' });
            }
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // Update table header
            const recordsTable = document.querySelector('.records-table');
            const thead = recordsTable.querySelector('thead');
            if (thead && json.length > 0) {
                thead.innerHTML = '<tr>' + json[0].map(h => `<th>${h || ''}</th>`).join('') + '<th>Actions</th></tr>';
            }
            // Clear table body
            recordsTableBody.innerHTML = '';
            for (let i = 1; i < json.length; i++) {
                const row = json[i];
                if (row.length < 1) continue;
                const tr = document.createElement('tr');
                tr.innerHTML = row.map(cell => `<td>${cell || ''}</td>`).join('') + `
                    <td>
                        <button class="btn-icon"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    </td>`;
                recordsTableBody.appendChild(tr);
            }
            showNotification('Records data imported from file!', 'success');
        };
        if (fileExt === 'csv' || fileExt === 'txt') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    });
}

if (exportSchoolBtn && recordsTableBody) {
    exportSchoolBtn.addEventListener('click', () => {
        const table = document.querySelector('.records-table');
        const wb = XLSX.utils.table_to_book(table, { sheet: 'Records' });
        XLSX.writeFile(wb, 'records.xlsx');
    });
} 

// Records section: filter and modal logic
const schoolYearLevelFilter = document.getElementById('schoolYearLevelFilter');
const schoolListTableBody = document.getElementById('schoolListTableBody');
const schoolRows = () => document.querySelectorAll('.school-row');

if (schoolYearLevelFilter && schoolListTableBody) {
    schoolYearLevelFilter.addEventListener('change', () => {
        const filter = schoolYearLevelFilter.value;
        schoolRows().forEach(row => {
            if (!filter || row.getAttribute('data-year') === filter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Modal logic for viewing resources delivered to a school
const schoolResourcesModal = document.getElementById('schoolResourcesModal');
const closeSchoolResourcesModal = document.getElementById('closeSchoolResourcesModal');
const schoolResourcesTitle = document.getElementById('schoolResourcesTitle');
const schoolResourcesTableBody = document.getElementById('schoolResourcesTableBody');

function showSchoolResourcesModal(schoolName) {
    // Example data; in a real app, fetch from backend or data store
    const resourcesData = {
        'San Juan Elementary School': [
            { name: 'Math Textbook', category: 'Books', subject: 'Math', quantity: 50, quarter: '1st Quarter', date: '2024-01-10' },
            { name: 'Science Kit', category: 'Supplies', subject: 'Science', quantity: 10, quarter: '2nd Quarter', date: '2024-02-15' }
        ],
        'Quezon City High School': [
            { name: 'Laptop', category: 'Equipment', subject: 'ICT', quantity: 5, quarter: '1st Quarter', date: '2024-01-20' },
            { name: 'English Book', category: 'Books', subject: 'English', quantity: 30, quarter: '3rd Quarter', date: '2024-03-05' }
        ],
        'Makati Senior High School': [
            { name: 'Chemistry Set', category: 'Supplies', subject: 'Chemistry', quantity: 8, quarter: '2nd Quarter', date: '2024-02-28' }
        ]
    };
    schoolResourcesTitle.textContent = `Resources Delivered - ${schoolName}`;
    schoolResourcesTableBody.innerHTML = '';
    (resourcesData[schoolName] || []).forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${r.name}</td>
            <td>${r.category}</td>
            <td>${r.subject}</td>
            <td>${r.quantity}</td>
            <td>${r.quarter}</td>
            <td>${r.date}</td>
        `;
        schoolResourcesTableBody.appendChild(tr);
    });
    schoolResourcesModal.style.display = 'flex';
}

if (schoolListTableBody) {
    schoolListTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('.school-link');
        if (target) {
            const schoolRow = target.closest('.school-row');
            const schoolName = schoolRow.getAttribute('data-school');
            showSchoolResourcesModal(schoolName);
        }
    });
}
if (closeSchoolResourcesModal && schoolResourcesModal) {
    closeSchoolResourcesModal.addEventListener('click', () => {
        schoolResourcesModal.style.display = 'none';
    });
} 

// Settings functionality
function initializeSettings() {
    // System Information Form
    const systemInfoForm = document.getElementById('systemInfoForm');
    if (systemInfoForm) {
        systemInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const systemName = document.getElementById('systemName').value;
            const divisionName = document.getElementById('divisionName').value;
            const academicYear = document.getElementById('academicYear').value;
            
            // Update header title
            const headerTitle = document.querySelector('.logo h1');
            if (headerTitle) {
                headerTitle.textContent = systemName;
            }
            
            // Update dashboard header
            const dashboardHeader = document.querySelector('.dashboard-header-bg h2');
            if (dashboardHeader) {
                dashboardHeader.textContent = divisionName;
            }
            
            // Save to localStorage
            localStorage.setItem('systemName', systemName);
            localStorage.setItem('divisionName', divisionName);
            localStorage.setItem('academicYear', academicYear);
            
            showNotification('System information updated successfully!', 'success');
        });
    }
    
    // Logo Upload Form
    const logoUploadForm = document.getElementById('logoUploadForm');
    if (logoUploadForm) {
        logoUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('newLogo');
            const file = fileInput.files[0];
            
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    showNotification('File size must be less than 2MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const logoImg = document.getElementById('currentLogo');
                    const headerLogo = document.querySelector('.logo img');
                    
                    if (logoImg) logoImg.src = e.target.result;
                    if (headerLogo) headerLogo.src = e.target.result;
                    
                    localStorage.setItem('customLogo', e.target.result);
                    showNotification('Logo updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            } else {
                showNotification('Please select a file', 'error');
            }
        });
    }
    
    // Academic Year Form
    const academicYearForm = document.getElementById('academicYearForm');
    if (academicYearForm) {
        academicYearForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentAcademicYear = document.getElementById('currentAcademicYear').value;
            const semester = document.getElementById('semester').value;
            const schoolYearStart = document.getElementById('schoolYearStart').value;
            const schoolYearEnd = document.getElementById('schoolYearEnd').value;
            
            // Save to localStorage
            localStorage.setItem('currentAcademicYear', currentAcademicYear);
            localStorage.setItem('semester', semester);
            localStorage.setItem('schoolYearStart', schoolYearStart);
            localStorage.setItem('schoolYearEnd', schoolYearEnd);
            
            showNotification('Academic year settings updated successfully!', 'success');
        });
    }
    
    // Preferences Form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const autoBackup = document.getElementById('autoBackup').checked;
            const emailNotifications = document.getElementById('emailNotifications').checked;
            const darkMode = document.getElementById('darkMode').checked;
            const itemsPerPage = document.getElementById('itemsPerPage').value;
            
            // Save to localStorage
            localStorage.setItem('autoBackup', autoBackup);
            localStorage.setItem('emailNotifications', emailNotifications);
            localStorage.setItem('darkMode', darkMode);
            localStorage.setItem('itemsPerPage', itemsPerPage);
            
            // Apply dark mode if enabled
            if (darkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            showNotification('Preferences saved successfully!', 'success');
        });
    }
    
    // Database Management Buttons
    const backupDbBtn = document.getElementById('backupDbBtn');
    if (backupDbBtn) {
        backupDbBtn.addEventListener('click', function() {
            // Simulate database backup
            showNotification('Database backup initiated...', 'info');
            setTimeout(() => {
                showNotification('Database backup completed successfully!', 'success');
            }, 2000);
        });
    }
    
    const restoreDbBtn = document.getElementById('restoreDbBtn');
    if (restoreDbBtn) {
        restoreDbBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,.sql';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    showNotification('Database restore initiated...', 'info');
                    setTimeout(() => {
                        showNotification('Database restored successfully!', 'success');
                    }, 2000);
                }
            };
            input.click();
        });
    }
    
    const exportDataBtn = document.getElementById('exportDataBtn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            // Export data as JSON
            const data = {
                schools: JSON.parse(localStorage.getItem('schools') || '[]'),
                subjects: JSON.parse(localStorage.getItem('subjects') || '[]'),
                resources: JSON.parse(localStorage.getItem('resources') || '[]'),
                settings: {
                    systemName: localStorage.getItem('systemName'),
                    divisionName: localStorage.getItem('divisionName'),
                    academicYear: localStorage.getItem('academicYear')
                }
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lris_data_export.json';
            a.click();
            URL.revokeObjectURL(url);
            
            showNotification('Data exported successfully!', 'success');
        });
    }
    
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                localStorage.clear();
                location.reload();
            }
        });
    }
    
    // Load saved settings on page load
    loadSavedSettings();
}

function loadSavedSettings() {
    // Load system information
    const systemName = localStorage.getItem('systemName');
    const divisionName = localStorage.getItem('divisionName');
    const academicYear = localStorage.getItem('academicYear');
    
    if (systemName) document.getElementById('systemName').value = systemName;
    if (divisionName) document.getElementById('divisionName').value = divisionName;
    if (academicYear) document.getElementById('academicYear').value = academicYear;
    
    // Load academic year settings
    const currentAcademicYear = localStorage.getItem('currentAcademicYear');
    const semester = localStorage.getItem('semester');
    const schoolYearStart = localStorage.getItem('schoolYearStart');
    const schoolYearEnd = localStorage.getItem('schoolYearEnd');
    
    if (currentAcademicYear) document.getElementById('currentAcademicYear').value = currentAcademicYear;
    if (semester) document.getElementById('semester').value = semester;
    if (schoolYearStart) document.getElementById('schoolYearStart').value = schoolYearStart;
    if (schoolYearEnd) document.getElementById('schoolYearEnd').value = schoolYearEnd;
    
    // Load preferences
    const autoBackup = localStorage.getItem('autoBackup');
    const emailNotifications = localStorage.getItem('emailNotifications');
    const darkMode = localStorage.getItem('darkMode');
    const itemsPerPage = localStorage.getItem('itemsPerPage');
    
    if (autoBackup !== null) document.getElementById('autoBackup').checked = autoBackup === 'true';
    if (emailNotifications !== null) document.getElementById('emailNotifications').checked = emailNotifications === 'true';
    if (darkMode !== null) document.getElementById('darkMode').checked = darkMode === 'true';
    if (itemsPerPage) document.getElementById('itemsPerPage').value = itemsPerPage;
    
    // Apply dark mode if enabled
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Load custom logo
    const customLogo = localStorage.getItem('customLogo');
    if (customLogo) {
        const logoImg = document.getElementById('currentLogo');
        const headerLogo = document.querySelector('.logo img');
        
        if (logoImg) logoImg.src = customLogo;
        if (headerLogo) headerLogo.src = customLogo;
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check server status first
    checkServerStatus();
    
    // Initialize Settings functionality
    initializeSettings();
    
    // Initialize Items functionality
    initializeItems();
    
    // Initialize animations
    initializeAnimations();
});

// Check if server is running
async function checkServerStatus() {
    try {
        const response = await fetch('/test');
        if (response.ok) {
            console.log('✅ Server is running');
        } else {
            console.warn('⚠️ Server responded with error status');
        }
    } catch (error) {
        console.error('❌ Server is not running or not accessible:', error.message);
        showNotification('Warning: Server is not running. Some features may not work.', 'error');
    }
}

// Initialize animations for all sections
function initializeAnimations() {
    // Set animation delays for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
    
    // Set animation delays for activity items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Set animation delays for table rows
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, index) => {
        row.style.setProperty('--row-index', index);
    });
    
    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[class*="animation"], .stat-card, .activity-item, .settings-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Switch item category function
function switchItemCategory(category) {
    // Get all navigation buttons and content sections
    const itemNavBtns = document.querySelectorAll('.item-nav-btn');
    const itemContents = document.querySelectorAll('.item-content');
            
    // Remove active class from all buttons and contents
    itemNavBtns.forEach(btn => btn.classList.remove('active'));
    itemContents.forEach(content => content.classList.remove('active'));
            
    // Add active class to clicked button and corresponding content
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    const targetContent = document.getElementById(`${category}-content`);
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Reload items data when switching categories
    loadItems();
}

// Initialize Items section functionality
function initializeItems() {
    console.log('Initializing Items functionality...');
    
    // Load items data immediately when section is initialized
    console.log('Loading items data on initialization...');
    loadItems();
    
    // Mini navigation functionality is now handled by onclick attributes
    // This function now only handles modal functionality
    
    // SLM/SLAS functionality
    const addSlmBtn = document.getElementById('addSlmBtn');
    const addSlmModal = document.getElementById('addSlmModal');
    const closeSlmModal = document.getElementById('closeSlmModal');
    const cancelSlmModal = document.getElementById('cancelSlmModal');
    // const addSlmForm = document.getElementById('addSlmForm');
    
    console.log('SLM elements found:', {
        addSlmBtn: !!addSlmBtn,
        addSlmModal: !!addSlmModal,
        closeSlmModal: !!closeSlmModal,
        cancelSlmModal: !!cancelSlmModal
    });
    
    if (addSlmBtn) {
        console.log('Adding click event listener to SLM button');
        addSlmBtn.replaceWith(addSlmBtn.cloneNode(true));
        const newAddSlmBtn = document.getElementById('addSlmBtn');
        newAddSlmBtn.addEventListener('click', () => {
            console.log('SLM button clicked');
            addSlmModal.style.display = 'flex';
        });
    } else {
        console.log('SLM button not found');
    }
    
    if (closeSlmModal) {
        closeSlmModal.replaceWith(closeSlmModal.cloneNode(true));
        const newCloseSlmModal = document.getElementById('closeSlmModal');
        newCloseSlmModal.addEventListener('click', () => {
            addSlmModal.style.display = 'none';
        });
    }
    
    if (cancelSlmModal) {
        cancelSlmModal.replaceWith(cancelSlmModal.cloneNode(true));
        const newCancelSlmModal = document.getElementById('cancelSlmModal');
        newCancelSlmModal.addEventListener('click', () => {
            addSlmModal.style.display = 'none';
        });
    }
    // Removed addSlmForm submit event listener
    
    // Equipment functionality
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    const addEquipmentModal = document.getElementById('addEquipmentModal');
    const closeEquipmentModal = document.getElementById('closeEquipmentModal');
    const cancelEquipmentModal = document.getElementById('cancelEquipmentModal');
    // const addEquipmentForm = document.getElementById('addEquipmentForm');
    
    if (addEquipmentBtn) {
        addEquipmentBtn.addEventListener('click', () => {
            addEquipmentModal.style.display = 'flex';
        });
    }
    
    if (closeEquipmentModal) {
        closeEquipmentModal.addEventListener('click', () => {
            addEquipmentModal.style.display = 'none';
        });
    }
    
    if (cancelEquipmentModal) {
        cancelEquipmentModal.addEventListener('click', () => {
            addEquipmentModal.style.display = 'none';
        });
    }
    // Removed addEquipmentForm submit event listener
    
    // TVL functionality
    const addTvlBtn = document.getElementById('addTvlBtn');
    const addTvlModal = document.getElementById('addTvlModal');
    const closeTvlModal = document.getElementById('closeTvlModal');
    const cancelTvlModal = document.getElementById('cancelTvlModal');
    // const addTvlForm = document.getElementById('addTvlForm');
    
    if (addTvlBtn) {
        addTvlBtn.addEventListener('click', () => {
            addTvlModal.style.display = 'flex';
        });
    }
    
    if (closeTvlModal) {
        closeTvlModal.addEventListener('click', () => {
            addTvlModal.style.display = 'none';
        });
    }
    
    if (cancelTvlModal) {
        cancelTvlModal.addEventListener('click', () => {
            addTvlModal.style.display = 'none';
        });
    }
    // Removed addTvlForm submit event listener
    
    // Lesson Exemplar functionality
    const addLessonBtn = document.getElementById('addLessonBtn');
    const addLessonModal = document.getElementById('addLessonModal');
    const closeLessonModal = document.getElementById('closeLessonModal');
    const cancelLessonModal = document.getElementById('cancelLessonModal');
    // const addLessonForm = document.getElementById('addLessonForm');
    
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', () => {
            addLessonModal.style.display = 'flex';
        });
    }
    
    if (closeLessonModal) {
        closeLessonModal.addEventListener('click', () => {
            addLessonModal.style.display = 'none';
        });
    }
    
    if (cancelLessonModal) {
        cancelLessonModal.addEventListener('click', () => {
            addLessonModal.style.display = 'none';
        });
    }
    // Removed addLessonForm submit event listener
    
    // Check if table bodies exist
    console.log('Checking table bodies...');
    console.log('SLM table body:', document.getElementById('slmTableBody'));
    console.log('Equipment table body:', document.getElementById('equipmentTableBody'));
    console.log('TVL table body:', document.getElementById('tvlTableBody'));
    console.log('Lesson table body:', document.getElementById('lessonTableBody'));
    
    // Load existing items
    loadItems();
}

window.switchItemCategory = switchItemCategory;

// =============================================
// RESOURCES SECTION - SCHOOLS LIST FUNCTIONALITY
// =============================================

// Sample school data (in a real application, this would come from a database)
const sampleSchools = [
    {
        id: 1,
        name: "Tandag City Central Elementary School",
        schoolId: "TCES-001",
        district: "District 1",
        level: "Elementary",
        enrollees: 1250,
        resourcesAllocated: 45,
        principal: "Dr. Maria Santos",
        contact: "09123456789",
        email: "tces@deped.gov.ph",
        status: "active"
    },
    {
        id: 2,
        name: "Tandag City National High School",
        schoolId: "TCNHS-001",
        district: "District 1",
        level: "High School",
        enrollees: 980,
        resourcesAllocated: 38,
        principal: "Dr. Juan Dela Cruz",
        contact: "09187654321",
        email: "tcnhs@deped.gov.ph",
        status: "active"
    },
    {
        id: 3,
        name: "San Miguel Elementary School",
        schoolId: "SMES-001",
        district: "District 2",
        level: "Elementary",
        enrollees: 850,
        resourcesAllocated: 32,
        principal: "Mrs. Ana Rodriguez",
        contact: "09234567890",
        email: "smes@deped.gov.ph",
        status: "active"
    },
    {
        id: 4,
        name: "Quezon City High School",
        schoolId: "QCHS-001",
        district: "District 2",
        level: "High School",
        enrollees: 1200,
        resourcesAllocated: 42,
        principal: "Dr. Pedro Martinez",
        contact: "09345678901",
        email: "qchs@deped.gov.ph",
        status: "active"
    },
    {
        id: 5,
        name: "Tandag City Senior High School",
        schoolId: "TCSHS-001",
        district: "District 3",
        level: "Senior High",
        enrollees: 650,
        resourcesAllocated: 28,
        principal: "Dr. Carmen Reyes",
        contact: "09456789012",
        email: "tcshs@deped.gov.ph",
        status: "active"
    },
    {
        id: 6,
        name: "Barangay Elementary School",
        schoolId: "BES-001",
        district: "District 4",
        level: "Elementary",
        enrollees: 450,
        resourcesAllocated: 18,
        principal: "Mrs. Luz Fernandez",
        contact: "09567890123",
        email: "bes@deped.gov.ph",
        status: "active"
    }
];

// Sample resources data for schools
const sampleResources = {
    1: [
        { name: "Mathematics Textbook Grade 7", category: "SLM/SLAS", subject: "Mathematics", quantity: 45, quarter: "1st Quarter", gradeLevel: "Grade 7" },
        { name: "Science Lab Microscope", category: "Equipment", subject: "Science", quantity: 12, quarter: "2nd Quarter", gradeLevel: "Grade 8" },
        { name: "Art Supplies Kit", category: "Supplies", subject: "Arts", quantity: 8, quarter: "3rd Quarter", gradeLevel: "Grade 6" }
    ],
    2: [
        { name: "English Literature Books", category: "SLM/SLAS", subject: "English", quantity: 35, quarter: "1st Quarter", gradeLevel: "Grade 9" },
        { name: "Computer Lab Equipment", category: "Equipment", subject: "ICT", quantity: 20, quarter: "2nd Quarter", gradeLevel: "Grade 10" }
    ],
    3: [
        { name: "Filipino Textbooks", category: "SLM/SLAS", subject: "Filipino", quantity: 25, quarter: "1st Quarter", gradeLevel: "Grade 4" },
        { name: "Physical Education Equipment", category: "Equipment", subject: "PE", quantity: 15, quarter: "2nd Quarter", gradeLevel: "Grade 5" }
    ],
    4: [
        { name: "Social Studies Materials", category: "SLM/SLAS", subject: "Social Studies", quantity: 30, quarter: "1st Quarter", gradeLevel: "Grade 8" },
        { name: "Science Laboratory Kit", category: "Equipment", subject: "Science", quantity: 18, quarter: "2nd Quarter", gradeLevel: "Grade 9" }
    ],
    5: [
        { name: "TVL Equipment Set", category: "TVL", subject: "Technical Vocational", quantity: 22, quarter: "1st Quarter", gradeLevel: "Grade 11" },
        { name: "Computer Programming Tools", category: "TVL", subject: "ICT", quantity: 16, quarter: "2nd Quarter", gradeLevel: "Grade 12" }
    ],
    6: [
        { name: "Early Childhood Materials", category: "SLM/SLAS", subject: "Early Childhood", quantity: 20, quarter: "1st Quarter", gradeLevel: "Kindergarten" },
        { name: "Basic Learning Tools", category: "Supplies", subject: "General", quantity: 12, quarter: "2nd Quarter", gradeLevel: "Grade 1" }
    ]
};

let currentSchoolId = null;
let currentResourceCategory = 'all';

// Initialize school section
async function initializeSchoolSection() {
    console.log('initializeSchoolSection called');
    
    // Load schools for the school table (first loadSchools function)
    const schoolTableBody = document.getElementById('schoolTableBody');
    console.log('School table body found in initializeSchoolSection:', schoolTableBody);
    if (schoolTableBody) {
        console.log('School table body found, loading schools...');
        await loadSchoolsForTable();
        console.log('loadSchoolsForTable completed');
    } else {
        console.error('School table body not found in initializeSchoolSection');
    }
}

// Initialize resources section
async function initializeResources() {
    console.log('initializeResources called');
    await loadSchoolsForResources();
    console.log('loadSchoolsForResources completed');
    setupEventListeners();
    console.log('setupEventListeners completed');
}

// Load and display schools for resources section
async function loadSchoolsForResources() {
    console.log('loadSchoolsForResources function called');
    const schoolsGrid = document.getElementById('schoolsGrid');
    console.log('Schools grid element:', schoolsGrid);
    if (!schoolsGrid) {
        console.error('Schools grid element not found!');
        return;
    }

    schoolsGrid.innerHTML = '';
    console.log('Cleared schools grid');
    
    try {
        // Fetch schools from database
        console.log('Attempting to fetch schools from database...');
        const response = await fetch('http://localhost:3000/api/schools');
        const schools = await response.json();
        
        console.log('Fetched schools for resources section:', schools);
        
        schools.forEach(school => {
            const schoolCard = createSchoolCard(school);
            schoolsGrid.appendChild(schoolCard);
        });
        console.log('Added database schools to grid');
    } catch (error) {
        console.error('Error fetching schools for resources section:', error);
        console.log('Falling back to sample schools...');
        // Fallback to sample schools if database is not available
        sampleSchools.forEach(school => {
            console.log('Creating card for sample school:', school.name);
            const schoolCard = createSchoolCard(school);
            schoolsGrid.appendChild(schoolCard);
        });
        console.log('Added sample schools to grid. Total schools:', sampleSchools.length);
    }
}

// Create a school card element
function createSchoolCard(school) {
    console.log('Creating school card for:', school.name || school.Name);
    const card = document.createElement('div');
    card.className = 'school-card';
    card.setAttribute('data-school-id', school.ID || school.id);
    
    // Handle both database and sample school structures
    const schoolName = school.Name || school.name;
    const schoolId = school.SchoolID || school.schoolId;
    const district = school.District || school.district;
    const level = school.Level || school.level;
    const enrollees = school.Enrollees || school.enrollees;
    const resourcesAllocated = school.ResourcesAllocated || school.resourcesAllocated;
    const status = school.Status || school.status || 'active';
    
    const statusClass = status === 'active' ? 'active' : 'inactive';
    const statusText = status === 'active' ? 'Active' : 'Inactive';
    
    card.innerHTML = `
        <div class="school-status ${statusClass}">${statusText}</div>
        <div class="school-header">
            <div class="school-icon">
                <i class="fas fa-school"></i>
            </div>
            <div class="school-info">
                <h4>${schoolName}</h4>
                <p>${schoolId}</p>
            </div>
        </div>
        <div class="school-details">
            <div class="school-detail">
                <span class="school-detail-label">District</span>
                <span class="school-detail-value">${district}</span>
            </div>
            <div class="school-detail">
                <span class="school-detail-label">Level</span>
                <span class="school-detail-value">${level}</span>
            </div>
            <div class="school-detail">
                <span class="school-detail-label">Enrollees</span>
                <span class="school-detail-value">${enrollees ? enrollees.toLocaleString() : '0'}</span>
            </div>
            <div class="school-detail">
                <span class="school-detail-label">Resources</span>
                <span class="school-detail-value">${resourcesAllocated || '0'}</span>
            </div>
        </div>
    `;
    
    // Add click event listener
    card.addEventListener('click', () => {
        showSchoolResources(school);
    });
    
    return card;
}

// Show school resources
function showSchoolResources(school) {
    currentSchoolId = school.id;
    
    // Update breadcrumb
    updateBreadcrumb(school.name);
    
    // Hide schools container and show resources container
    document.getElementById('schoolsContainer').style.display = 'none';
    document.getElementById('schoolResourcesContainer').style.display = 'block';
    
    // Update school name in header
    document.getElementById('selectedSchoolName').textContent = school.name;
    
    // Load and display resources
    loadSchoolResources(school.id);
}

// Update breadcrumb navigation
function updateBreadcrumb(schoolName = null) {
    const breadcrumb = document.getElementById('resourcesBreadcrumb');
    
    if (schoolName) {
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item" data-level="schools" onclick="backToSchools()">Schools</span>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-item active" data-level="resources">${schoolName}</span>
        `;
    } else {
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item active" data-level="schools">Schools</span>
        `;
    }
}

// Back to schools list
function backToSchools() {
    currentSchoolId = null;
    currentResourceCategory = 'all';
    
    // Update breadcrumb
    updateBreadcrumb();
    
    // Show schools container and hide resources container
    document.getElementById('schoolsContainer').style.display = 'block';
    document.getElementById('schoolResourcesContainer').style.display = 'none';
}

// Load school resources
function loadSchoolResources(schoolId) {
    const resources = sampleResources[schoolId] || [];
    displaySchoolResources(resources);
}

// Display school resources in table
function displaySchoolResources(resources) {
    const tableBody = document.getElementById('schoolResourcesTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (resources.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" style="text-align: center; color: #666;">No resources found for this school</td>';
        tableBody.appendChild(row);
        return;
    }
    
    // Filter resources by category if needed
    const filteredResources = currentResourceCategory === 'all' 
        ? resources 
        : resources.filter(resource => resource.category.toLowerCase().includes(currentResourceCategory.toLowerCase()));
    
    filteredResources.forEach(resource => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.name}</td>
            <td>${resource.category}</td>
            <td>${resource.subject}</td>
            <td>${resource.quantity}</td>
            <td>${resource.quarter}</td>
            <td>${resource.gradeLevel}</td>
            <td>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add resource button (main resources section)
    const addResourceBtn = document.getElementById('addResourceBtn');
    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', showAddResourceModal);
    }
    
    // Add school resource button (when viewing a specific school)
    const addSchoolResourceBtn = document.getElementById('addSchoolResourceBtn');
    if (addSchoolResourceBtn) {
        addSchoolResourceBtn.addEventListener('click', showAddSchoolResourceModal);
    }
    
    // Back to schools button
    const backBtn = document.getElementById('backToSchoolsBtn');
    if (backBtn) {
        backBtn.addEventListener('click', backToSchools);
    }
    
    // Resource tabs
    const resourceTabs = document.querySelectorAll('.resource-tab');
    resourceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            resourceTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update current category
            currentResourceCategory = tab.getAttribute('data-category');
            
            // Reload resources with new filter
            if (currentSchoolId) {
                loadSchoolResources(currentSchoolId);
            }
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('schoolSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterSchools(searchTerm);
        });
    }
    
    // Filter functionality
    const districtFilter = document.getElementById('districtFilter');
    const levelFilter = document.getElementById('levelFilter');
    
    if (districtFilter) {
        districtFilter.addEventListener('change', filterSchools);
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', filterSchools);
    }
    
    // Modal close functionality
    const closeResourceModal = document.getElementById('closeResourceModal');
    const cancelResourceModal = document.getElementById('cancelResourceModal');
    
    if (closeResourceModal) {
        closeResourceModal.addEventListener('click', hideResourceModal);
    }
    
    if (cancelResourceModal) {
        cancelResourceModal.addEventListener('click', hideResourceModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('addResourceModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideResourceModal();
            }
        });
    }
}

// Hide resource modal
function hideResourceModal() {
    const modal = document.getElementById('addResourceModal');
    if (modal) {
        modal.style.display = 'none';
        // Reset forms
        document.getElementById('addResourceForm').reset();
        document.getElementById('resourceDetailsForm').style.display = 'none';
        document.getElementById('addResourceForm').style.display = 'block';
    }
}

// Filter schools based on search and filters
function filterSchools(searchTerm = '') {
    const districtFilter = document.getElementById('districtFilter');
    const levelFilter = document.getElementById('levelFilter');
    
    const selectedDistrict = districtFilter ? districtFilter.value : '';
    const selectedLevel = levelFilter ? levelFilter.value : '';
    
    const schoolsGrid = document.getElementById('schoolsGrid');
    if (!schoolsGrid) return;
    
    const schoolCards = schoolsGrid.querySelectorAll('.school-card');
    
    schoolCards.forEach(card => {
        const schoolId = parseInt(card.getAttribute('data-school-id'));
        const school = sampleSchools.find(s => s.id === schoolId);
        
        if (!school) return;
        
        const matchesSearch = school.name.toLowerCase().includes(searchTerm) || 
                            school.schoolId.toLowerCase().includes(searchTerm);
        const matchesDistrict = !selectedDistrict || school.district === selectedDistrict;
        const matchesLevel = !selectedLevel || school.level === selectedLevel;
        
        if (matchesSearch && matchesDistrict && matchesLevel) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}



// Show add resource modal (from main resources section)
async function showAddResourceModal() {
    console.log('showAddResourceModal called - timestamp:', new Date().toISOString());
    try {
        const modal = document.getElementById('addResourceModal');
        console.log('Modal element:', modal);
        if (modal) {
            console.log('Setting modal display to flex');
            modal.style.display = 'flex';
            console.log('Modal display style:', modal.style.display);
            await populateResourceSchoolDropdown();
            console.log('Modal should be visible now');
            // Ensure Next Step button always works
            const nextStepBtn = document.getElementById('nextStepBtn');
            if (nextStepBtn) {
                nextStepBtn.onclick = null;
                nextStepBtn.addEventListener('click', () => {
                    if (validateFirstStep()) {
                        showSecondStep();
                    }
                });
            }
        } else {
            console.error('Modal element not found!');
            // Try to find any modal
            const allModals = document.querySelectorAll('.modal');
            console.log('All modals found:', allModals);
        }
    } catch (error) {
        console.error('Error in showAddResourceModal:', error);
    }
}

// Show add school resource modal (when viewing a specific school)
async function showAddSchoolResourceModal() {
    const modal = document.getElementById('addResourceModal');
    if (modal) {
        modal.style.display = 'flex';
        // Get the current school name from the breadcrumb or header
        const schoolNameElement = document.getElementById('selectedSchoolName');
        if (schoolNameElement) {
            const currentSchoolName = schoolNameElement.textContent;
            console.log('Current school name:', currentSchoolName);
            // Populate dropdown and select current school
            await populateResourceSchoolDropdown(currentSchoolName);
            // Trigger grade level population
            populateGradeLevels(currentSchoolName);
        }
        // Ensure Next Step button always works
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.onclick = null;
            nextStepBtn.addEventListener('click', () => {
                if (validateFirstStep()) {
                    showSecondStep();
                }
            });
        }
    }
}

// Populate resource school dropdown
async function populateResourceSchoolDropdown(selectedSchool = '') {
    const schoolSelect = document.getElementById('resourceSchool');
    if (!schoolSelect) return;
    
    schoolSelect.innerHTML = '<option value="">Select School</option>';
    
    try {
        // Fetch schools from database
        const response = await fetch('http://localhost:3000/api/schools');
        const schools = await response.json();
        
        schools.forEach(school => {
            const option = document.createElement('option');
            option.value = school.SchoolID; // Use the unique SchoolID
            option.textContent = `${school.Name} (${school.District})`;
            option.setAttribute('data-level', school.Level); // Store school level for grade level population
            if (school.Name === selectedSchool) {
                option.selected = true;
            }
            schoolSelect.appendChild(option);
        });
        
        // Add event listener for school selection
        schoolSelect.addEventListener('change', function() {
            const selectedSchoolName = this.value;
            populateGradeLevels(selectedSchoolName);
        });
        
        console.log('Populated school dropdown with database schools:', schools);
    } catch (error) {
        console.error('Error fetching schools:', error);
        // Fallback to sample schools if database is not available
        sampleSchools.forEach(school => {
            const option = document.createElement('option');
            option.value = school.name;
            option.textContent = school.name;
            option.setAttribute('data-level', school.level);
            if (school.name === selectedSchool) {
                option.selected = true;
            }
            schoolSelect.appendChild(option);
        });
    }
}

// Make functions globally available
window.backToSchools = backToSchools;
window.showAddResourceModal = showAddResourceModal;
window.showAddSchoolResourceModal = showAddSchoolResourceModal;
window.loadSchools = loadSchools; // Make loadSchools available globally for testing
window.testDatabaseConnection = async () => {
    console.log('Testing database connection...');
    try {
        const response = await fetch('http://localhost:3000/api/schools');
        const schools = await response.json();
        console.log('Database connection successful! Schools found:', schools.length);
        console.log('First school:', schools[0]);
        return schools;
    } catch (error) {
        console.error('Database connection failed:', error);
        return null;
    }
};

// Global event listener setup for modals
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up global event listeners');
    
    // Initialize school section if it's the current section
    const currentSection = window.location.hash.substring(1) || 'dashboard';
    console.log('Current section from URL hash:', currentSection);
    
    if (currentSection === 'school') {
        console.log('School section detected, initializing...');
        setTimeout(() => {
            initializeSchoolSection();
        }, 100);
    }
    
    // Add resource button (main resources section)
    const addResourceBtn = document.getElementById('addResourceBtn');
    console.log('Add resource button:', addResourceBtn);
    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', async function(e) {
            console.log('Add resource button clicked');
            e.preventDefault();
            await showAddResourceModal();
        });
    }
    
    // Modal close functionality
    const closeResourceModal = document.getElementById('closeResourceModal');
    const cancelResourceModal = document.getElementById('cancelResourceModal');
    
    if (closeResourceModal) {
        closeResourceModal.addEventListener('click', hideResourceModal);
    }
    
    if (cancelResourceModal) {
        cancelResourceModal.addEventListener('click', hideResourceModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('addResourceModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideResourceModal();
            }
        });
    }
});

// Debug function to manually test school loading
window.testLoadSchools = async function() {
    console.log('Manual test of loadSchoolsForTable');
    await loadSchoolsForTable();
};

// Debug function to check if elements exist
window.checkElements = function() {
    console.log('Checking if elements exist:');
    console.log('schoolTableBody:', document.getElementById('schoolTableBody'));
    console.log('school section:', document.getElementById('school'));
    console.log('Current active section:', document.querySelector('section[style*="block"]'));
};

// Ensure event listener is always attached after showing the second step
function attachResourceDetailsFormListener() {
    const resourceDetailsForm = document.getElementById('resourceDetailsForm');
    if (resourceDetailsForm) {
        resourceDetailsForm.onsubmit = null;
        resourceDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('processResourceSubmission called');
            processResourceSubmission();
        });
    }
}

// Patch showSecondStep to always attach the listener
const originalShowSecondStep = showSecondStep;
showSecondStep = async function() {
    await originalShowSecondStep.apply(this, arguments);
    attachResourceDetailsFormListener();
};
async function addDistributedResource({ SchoolID, ResourceCategory, ResourceItemID, ResourceName, Quantity, DateDistributed, Notes }) {
    const pool = await getConnection();
    await pool.request()
        .input('SchoolID', sql.NVarChar, SchoolID)
        .input('ResourceCategory', sql.NVarChar, ResourceCategory)
        .input('ResourceItemID', sql.Int, ResourceItemID)
        .input('ResourceName', sql.NVarChar, ResourceName)
        .input('Quantity', sql.Int, Quantity)
        .input('DateDistributed', sql.DateTime, DateDistributed || new Date())
        .input('Notes', sql.NVarChar, Notes)
        .query(`
            INSERT INTO DistributedResources (SchoolID, ResourceCategory, ResourceItemID, ResourceName, Quantity, DateDistributed, Notes)
            VALUES (@SchoolID, @ResourceCategory, @ResourceItemID, @ResourceName, @Quantity, @DateDistributed, @Notes)
        `);
}

// --- Distributed Schools Grid Logic ---
async function loadDistributedSchools() {
    const res = await fetch('/api/distributed-resources');
    const data = await res.json();
    // Get unique schools
    const schoolsMap = {};
    data.forEach(r => {
        if (!schoolsMap[r.SchoolID]) {
            schoolsMap[r.SchoolID] = r;
        }
    });
    const schools = Object.values(schoolsMap);
    displaySchoolsGrid(schools);
}

function displaySchoolsGrid(schools) {
    const container = document.getElementById('distributedSchoolsGrid');
    if (!container) return;
    container.innerHTML = '';
    schools.forEach(school => {
        const card = document.createElement('div');
        card.className = 'school-card';
        card.innerHTML = `<strong>${school.SchoolID}</strong><br>${school.ResourceName || school.ResourceCategory}`;
        card.onclick = () => showSchoolDistributedResources(school.SchoolID);
        container.appendChild(card);
    });
}

async function showSchoolDistributedResources(schoolId) {
    const res = await fetch(`/api/distributed-resources/by-school/${schoolId}`);
    const data = await res.json();
    const container = document.getElementById('schoolDistributedResources');
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = '<p>No distributed resources for this school.</p>';
        return;
    }
    let html = `<h3>Distributed Resources for School ID: ${schoolId}</h3><table><tr>
        <th>Category</th><th>Item ID</th><th>Resource Name</th><th>Quantity</th><th>Date</th><th>Notes</th></tr>`;
    data.forEach(r => {
        html += `<tr>
            <td>${r.ResourceCategory}</td>
            <td>${r.ResourceItemID || ''}</td>
            <td>${r.ResourceName || ''}</td>
            <td>${r.Quantity}</td>
            <td>${new Date(r.DateDistributed).toLocaleDateString()}</td>
            <td>${r.Notes || ''}</td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    // Call this after a resource is added or on page load
    loadDistributedSchools();
});

// Ensure dashboard is shown and updated on page load
window.addEventListener('DOMContentLoaded', () => {
    // If no hash, show dashboard by default
    if (!window.location.hash || window.location.hash === '#dashboard') {
        showSection('dashboard');
    }
    // Always update dashboard stats and activities
    updateDashboardStats();
    loadActivities();
});

// Patch showSection to refresh dashboard stats and activities when navigating to dashboard
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    if (sectionId === 'dashboard') {
        updateDashboardStats();
        loadActivities();
    }
    if (sectionId === 'school') {
        const schoolSection = document.getElementById('school');
        if (schoolSection) {
            schoolSection.style.display = 'block';
            console.log('School section forced visible');
        }
        initializeSchoolSection();
        console.log('School section initialized');
    }
};

// --- School Section Functionality ---
// Enhanced search bar design
const schoolSearchInput = document.getElementById('schoolSearchInput');
if (schoolSearchInput) {
    schoolSearchInput.classList.add('enhanced-search');
    schoolSearchInput.placeholder = '🔍 Search schools by name, ID, district, or principal...';
    schoolSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('.school-table tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Event delegation for edit/delete actions in school table
document.addEventListener('DOMContentLoaded', function() {
    const schoolTableBody = document.getElementById('schoolTableBody');
    if (schoolTableBody) {
        console.log('Attaching event delegation to schoolTableBody');
        schoolTableBody.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.btn-icon .fa-edit');
            const deleteBtn = e.target.closest('.btn-icon .fa-trash');
            const row = e.target.closest('tr');
            if (!row) return;
            const schoolId = row.children[1]?.textContent;
            if (editBtn) {
                console.log('Edit button clicked for schoolId:', schoolId);
                showEditSchoolModal(row);
            } else if (deleteBtn) {
                console.log('Delete button clicked for schoolId:', schoolId);
                deleteSchool(schoolId, row);
            }
        });
    } else {
        console.log('schoolTableBody not found on DOMContentLoaded');
    }
});
// --- End School Section Functionality ---

// --- Item Category & Item Dropdown Logic (Fetch from Backend) ---
document.addEventListener('DOMContentLoaded', function() {
    const resourceCategorySelect = document.getElementById('resourceCategory');
    const resourceItemDropdown = document.getElementById('resourceItemDropdown');
    const resourceItemLabel = document.getElementById('resourceItemLabel');
    const addResourceForm = document.getElementById('addResourceForm');
    if (!resourceCategorySelect || !resourceItemDropdown || !resourceItemLabel || !addResourceForm) return;

    // Helper: Fetch items from backend based on category
    async function fetchItemsForCategory(category) {
        let url = '';
        if (category === 'SLM/SLAS') url = '/api/items/slm';
        else if (category === 'Equipment') url = '/api/items/equipment';
        else if (category === 'TVL') url = '/api/items/tvl';
        else if (category === 'Lesson Exemplar(Matatag)') url = '/api/items/lesson';
        if (!url) return [];
        try {
            const response = await fetch(url);
            if (!response.ok) return [];
            const items = await response.json();
            if (category === 'SLM/SLAS') {
                return items.map(item => ({
                    value: item.Title || item.title || '',
                    label: `${item.Title || item.title || ''} (${item.Subject || item.subject || ''}, ${item.GradeLevel || item.gradeLevel || ''}, ${item.Quarter || item.quarter || ''})`
                }));
            } else if (category === 'Equipment') {
                return items.map(item => ({
                    value: item.EquipmentName || item.equipmentName || '',
                    label: `${item.EquipmentName || item.equipmentName || ''} (${item.EquipmentType || item.equipmentType || ''})`
                }));
            } else if (category === 'TVL') {
                return items.map(item => ({
                    value: item.ItemName || item.itemName || '',
                    label: `${item.ItemName || item.itemName || ''} (${item.Track || item.track || ''}, ${item.Strand || item.strand || ''})`
                }));
            } else if (category === 'Lesson Exemplar(Matatag)') {
                return items.map(item => ({
                    value: item.LessonTitle || item.lessonTitle || '',
                    label: `${item.LessonTitle || item.lessonTitle || ''} (${item.Subject || item.subject || ''}, ${item.GradeLevel || item.gradeLevel || ''}, ${item.Quarter || item.quarter || ''}, Week ${item.Week || item.week || ''})`
                }));
            }
            return [];
        } catch (err) {
            console.error('Error fetching items for category', category, err);
            return [];
        }
    }

    // Populate Item dropdown based on selected category
    resourceCategorySelect.addEventListener('change', async function() {
        const category = this.value;
        resourceItemDropdown.innerHTML = '<option value="">Select Item</option>';
        resourceItemLabel.textContent = 'Item';
        if (!category) return;
        // Set label for clarity
        if (category === 'SLM/SLAS') resourceItemLabel.textContent = 'SLM/SLAS Item';
        else if (category === 'Equipment') resourceItemLabel.textContent = 'Equipment Item';
        else if (category === 'TVL') resourceItemLabel.textContent = 'TVL Item';
        else if (category === 'Lesson Exemplar(Matatag)') resourceItemLabel.textContent = 'Lesson Exemplar Item';
        // Show loading
        const loadingOpt = document.createElement('option');
        loadingOpt.value = '';
        loadingOpt.textContent = 'Loading...';
        resourceItemDropdown.appendChild(loadingOpt);
        // Fetch items
        const items = await fetchItemsForCategory(category);
        resourceItemDropdown.innerHTML = '<option value="">Select Item</option>';
        if (items.length > 0) {
            items.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.value;
                opt.textContent = item.label;
                resourceItemDropdown.appendChild(opt);
            });
        } else {
            const emptyOpt = document.createElement('option');
            emptyOpt.value = '';
            emptyOpt.textContent = 'No items found';
            resourceItemDropdown.appendChild(emptyOpt);
        }
    });

    // On form submit, require a selection if a category is chosen
    addResourceForm.addEventListener('submit', function(e) {
        const category = resourceCategorySelect.value;
        if (category && !resourceItemDropdown.value) {
            e.preventDefault();
            alert('Please select an item for the chosen category.');
            return false;
        }
    });
});
// --- End Item Category & Item Dropdown Logic (Fetch from Backend) ---


// Robust event delegation for SLM/SLAS edit and delete
// Use the already declared slmTableBody from earlier in the file
if (slmTableBody) {
    slmTableBody.addEventListener('click', async function(e) {
        const btn = e.target.closest('.btn-icon');
        if (!btn) return;
        const isEdit = btn.querySelector('.fa-edit');
        const isDelete = btn.querySelector('.fa-trash');
        const row = btn.closest('tr');
        if (!row) return;
        const itemId = row.getAttribute('data-id');
        if (!itemId) return;
        // Edit SLM/SLAS
        if (isEdit) {
            // Get current item data from row
            const cells = row.children;
            const itemData = {
                Title: cells[0].textContent,
                Subject: cells[1].textContent,
                GradeLevel: cells[2].textContent,
                Quarter: cells[3].textContent,
                Quantity: cells[4].textContent,
                Status: cells[5].textContent,
                Description: '' // Description is not shown in table, will fetch from backend
            };
            // Fetch full item data (including Description)
            let fullItem = { ...itemData };
            try {
                const res = await fetch(`/api/items/slm`);
                if (res.ok) {
                    const items = await res.json();
                    const found = items.find(i => String(i.SLMItemID) === String(itemId));
                    if (found) fullItem = found;
                }
            } catch {}
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'flex';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Edit SLM/SLAS Item</h3>
                        <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="editSlmForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editSlmTitle">Title</label>
                                    <input type="text" id="editSlmTitle" name="editSlmTitle" value="${fullItem.Title || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label for="editSlmSubject">Subject</label>
                                    <input type="text" id="editSlmSubject" name="editSlmSubject" value="${fullItem.Subject || ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editSlmGradeLevel">Grade Level</label>
                                    <input type="text" id="editSlmGradeLevel" name="editSlmGradeLevel" value="${fullItem.GradeLevel || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label for="editSlmQuarter">Quarter</label>
                                    <input type="text" id="editSlmQuarter" name="editSlmQuarter" value="${fullItem.Quarter || ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editSlmQuantity">Quantity</label>
                                    <input type="number" id="editSlmQuantity" name="editSlmQuantity" value="${fullItem.Quantity || 0}" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label for="editSlmStatus">Status</label>
                                    <input type="text" id="editSlmStatus" name="editSlmStatus" value="${fullItem.Status || ''}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group" style="width:100%">
                                    <label for="editSlmDescription">Description</label>
                                    <textarea id="editSlmDescription" name="editSlmDescription" rows="2">${fullItem.Description || ''}</textarea>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                                <button type="submit" class="btn-primary">Update Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            document.getElementById('editSlmForm').addEventListener('submit', async function(ev) {
                ev.preventDefault();
                const updatedItem = {
                    title: document.getElementById('editSlmTitle').value,
                    subject: document.getElementById('editSlmSubject').value,
                    gradeLevel: document.getElementById('editSlmGradeLevel').value,
                    quarter: document.getElementById('editSlmQuarter').value,
                    quantity: parseInt(document.getElementById('editSlmQuantity').value),
                    status: document.getElementById('editSlmStatus').value,
                    description: document.getElementById('editSlmDescription').value
                };
                try {
                    const res = await fetch(`/api/items/slm/${itemId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedItem)
                    });
                    if (res.ok) {
                        showNotification('SLM/SLAS item updated!', 'success');
                        modal.remove();
                        await loadItems();
                    } else {
                        showNotification('Update failed', 'error');
                    }
                } catch (err) {
                    showNotification('Error updating item', 'error');
                }
            });
        }
        // Delete SLM/SLAS
        if (isDelete) {
            if (!confirm('Are you sure you want to delete this item?')) return;
            try {
                const res = await fetch(`/api/items/slm/${itemId}`, { method: 'DELETE' });
                if (res.ok) {
                    showNotification('Item deleted!', 'success');
                    await loadItems();
                } else {
                    showNotification('Delete failed', 'error');
                }
            } catch (err) {
                showNotification('Error deleting item', 'error');
            }
        }
    });
}

// --- BEGIN: Edit functionality for Items section tables ---

function getItemEditConfig(category) {
    if (category === 'slm') {
        return {
            endpoint: '/api/items/slm/',
            fields: [
                { label: 'Title', id: 'editSlmTitle', type: 'text', key: 'Title' },
                { label: 'Subject', id: 'editSlmSubject', type: 'text', key: 'Subject' },
                { label: 'Grade Level', id: 'editSlmGradeLevel', type: 'text', key: 'GradeLevel' },
                { label: 'Quarter', id: 'editSlmQuarter', type: 'text', key: 'Quarter' },
                { label: 'Quantity', id: 'editSlmQuantity', type: 'number', key: 'Quantity' },
                { label: 'Status', id: 'editSlmStatus', type: 'text', key: 'Status' },
                { label: 'Description', id: 'editSlmDescription', type: 'textarea', key: 'Description' }
            ],
            modalTitle: 'Edit SLM/SLAS Item',
            idField: 'SLMItemID',
            buildPayload: (fd) => ({
                title: fd.get('editSlmTitle'),
                subject: fd.get('editSlmSubject'),
                gradeLevel: fd.get('editSlmGradeLevel'),
                quarter: fd.get('editSlmQuarter'),
                quantity: parseInt(fd.get('editSlmQuantity')),
                status: fd.get('editSlmStatus'),
                description: fd.get('editSlmDescription')
            })
        };
    } else if (category === 'equipment') {
        return {
            endpoint: '/api/items/equipment/',
            fields: [
                { label: 'Equipment Name', id: 'editEquipmentName', type: 'text', key: 'EquipmentName' },
                { label: 'Equipment Type', id: 'editEquipmentType', type: 'text', key: 'EquipmentType' },
                { label: 'Quantity', id: 'editEquipmentQuantity', type: 'number', key: 'Quantity' },
                { label: 'Status', id: 'editEquipmentStatus', type: 'text', key: 'Status' },
                { label: 'Description', id: 'editEquipmentDescription', type: 'textarea', key: 'Description' }
            ],
            modalTitle: 'Edit Equipment Item',
            idField: 'EquipmentID',
            buildPayload: (fd) => ({
                equipmentName: fd.get('editEquipmentName'),
                equipmentType: fd.get('editEquipmentType'),
                quantity: parseInt(fd.get('editEquipmentQuantity')),
                status: fd.get('editEquipmentStatus'),
                description: fd.get('editEquipmentDescription')
            })
        };
    } else if (category === 'tvl') {
        return {
            endpoint: '/api/items/tvl/',
            fields: [
                { label: 'Item Name', id: 'editTvlName', type: 'text', key: 'ItemName' },
                { label: 'Track', id: 'editTvlTrack', type: 'text', key: 'Track' },
                { label: 'Strand', id: 'editTvlStrand', type: 'text', key: 'Strand' },
                { label: 'Grade Level', id: 'editTvlGradeLevel', type: 'text', key: 'GradeLevel' },
                { label: 'Quantity', id: 'editTvlQuantity', type: 'number', key: 'Quantity' },
                { label: 'Status', id: 'editTvlStatus', type: 'text', key: 'Status' },
                { label: 'Description', id: 'editTvlDescription', type: 'textarea', key: 'Description' }
            ],
            modalTitle: 'Edit TVL Item',
            idField: 'TVLItemID',
            buildPayload: (fd) => ({
                itemName: fd.get('editTvlName'),
                track: fd.get('editTvlTrack'),
                strand: fd.get('editTvlStrand'),
                gradeLevel: fd.get('editTvlGradeLevel'),
                quantity: parseInt(fd.get('editTvlQuantity')),
                status: fd.get('editTvlStatus'),
                description: fd.get('editTvlDescription')
            })
        };
    } else if (category === 'lesson') {
        return {
            endpoint: '/api/items/lesson/',
            fields: [
                { label: 'Lesson Title', id: 'editLessonTitle', type: 'text', key: 'LessonTitle' },
                { label: 'Subject', id: 'editLessonSubject', type: 'text', key: 'Subject' },
                { label: 'Grade Level', id: 'editLessonGradeLevel', type: 'text', key: 'GradeLevel' },
                { label: 'Quarter', id: 'editLessonQuarter', type: 'text', key: 'Quarter' },
                { label: 'Week', id: 'editLessonWeek', type: 'number', key: 'Week' },
                { label: 'Status', id: 'editLessonStatus', type: 'text', key: 'Status' },
                { label: 'Description', id: 'editLessonDescription', type: 'textarea', key: 'Description' }
            ],
            modalTitle: 'Edit Lesson Exemplar Item',
            idField: 'LessonID',
            buildPayload: (fd) => ({
                lessonTitle: fd.get('editLessonTitle'),
                subject: fd.get('editLessonSubject'),
                gradeLevel: fd.get('editLessonGradeLevel'),
                quarter: fd.get('editLessonQuarter'),
                week: parseInt(fd.get('editLessonWeek')),
                status: fd.get('editLessonStatus'),
                description: fd.get('editLessonDescription')
            })
        };
    }
    return null;
}

function getCategoryFromTable(table) {
    if (table.id === 'slmTableBody' || table.closest('#slm-content')) return 'slm';
    if (table.id === 'equipmentTableBody' || table.closest('#equipment-content')) return 'equipment';
    if (table.id === 'tvlTableBody' || table.closest('#tvl-content')) return 'tvl';
    if (table.id === 'lessonTableBody' || table.closest('#lesson-content')) return 'lesson';
    return null;
}

// Attach edit event delegation for all item tables
['slmTableBody', 'equipmentTableBody', 'tvlTableBody', 'lessonTableBody'].forEach(tableId => {
    const tableBody = document.getElementById(tableId);
    if (!tableBody) return;
    tableBody.addEventListener('click', async function(e) {
        const btn = e.target.closest('.btn-icon');
        if (!btn) return;
        if (!btn.querySelector('.fa-edit')) return;
        const row = btn.closest('tr');
        if (!row) return;
        const itemId = row.getAttribute('data-id');
        if (!itemId) return;
        const category = getCategoryFromTable(tableBody);
        const config = getItemEditConfig(category);
        if (!config) return;
        // Fetch full item data from backend
        let itemData = {};
        try {
            const res = await fetch(config.endpoint + itemId);
            if (res.ok) {
                itemData = await res.json();
            }
        } catch {}
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        let formHtml = `<div class="modal-content"><div class="modal-header"><h3>${config.modalTitle}</h3><button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button></div><div class="modal-body"><form id="editItemForm">`;
        config.fields.forEach(field => {
            const val = itemData[field.id.replace('edit', '').replace(/^[A-Z]/, m => m.toUpperCase())] || '';
            if (field.type === 'textarea') {
                formHtml += `<div class="form-group"><label for="${field.id}">${field.label}</label><textarea id="${field.id}" name="${field.id}" rows="2">${val}</textarea></div>`;
            } else {
                formHtml += `<div class="form-group"><label for="${field.id}">${field.label}</label><input type="${field.type}" id="${field.id}" name="${field.id}" value="${val}" required></div>`;
            }
        });
        formHtml += `<div class="form-actions"><button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button><button type="submit" class="btn-primary">Update Item</button></div></form></div></div>`;
        modal.innerHTML = formHtml;
        document.body.appendChild(modal);
        document.getElementById('editItemForm').addEventListener('submit', async function(ev) {
            ev.preventDefault();
            // Build updated item object
            const formData = new FormData(this);
            let updatedItem = {};
            config.fields.forEach(field => {
                let key = field.id.replace('edit', '');
                key = key.charAt(0).toLowerCase() + key.slice(1);
                updatedItem[key] = formData.get(field.id);
                if (field.type === 'number') updatedItem[key] = parseInt(updatedItem[key]);
            });
            try {
                const res = await fetch(config.endpoint + itemId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedItem)
                });
                if (res.ok) {
                    showNotification('Item updated!', 'success');
                    modal.remove();
                    loadItems();
                } else {
                    showNotification('Update failed', 'error');
                }
            } catch (err) {
                showNotification('Error updating item', 'error');
            }
        });
    });
});
// --- END: Edit functionality for Items section tables ---

// SLM/SLAS Table Edit
if (document.getElementById('slmTableBody')) {
    document.getElementById('slmTableBody').addEventListener('click', function(e) {
        console.log('Clicked in SLM table:', e.target);
        const editBtnSlm = e.target.closest('.btn-icon');
        if (!editBtnSlm || !editBtnSlm.querySelector('.fa-edit')) return;
        const row = editBtnSlm.closest('tr');
        if (!row) return;
        const itemId = row.getAttribute('data-id');
        if (!itemId) return;
        const cells = row.children;
        const itemData = {
            title: cells[0].textContent,
            subject: cells[1].textContent,
            gradeLevel: cells[2].textContent,
            quarter: cells[3].textContent,
            quantity: cells[4].textContent,
            status: cells[5].textContent,
            description: ''
        };
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit SLM/SLAS Item</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editSlmForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editSlmTitle">Title</label>
                                <input type="text" id="editSlmTitle" value="${itemData.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="editSlmSubject">Subject</label>
                                <input type="text" id="editSlmSubject" value="${itemData.subject}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editSlmGradeLevel">Grade Level</label>
                                <input type="text" id="editSlmGradeLevel" value="${itemData.gradeLevel}" required>
                            </div>
                            <div class="form-group">
                                <label for="editSlmQuarter">Quarter</label>
                                <input type="text" id="editSlmQuarter" value="${itemData.quarter}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editSlmQuantity">Quantity</label>
                                <input type="number" id="editSlmQuantity" value="${itemData.quantity}" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="editSlmStatus">Status</label>
                                <input type="text" id="editSlmStatus" value="${itemData.status}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="width:100%">
                                <label for="editSlmDescription">Description</label>
                                <textarea id="editSlmDescription" rows="2">${itemData.description}</textarea>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn-primary">Update Item</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('editSlmForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const updatedItem = {
                title: document.getElementById('editSlmTitle').value,
                subject: document.getElementById('editSlmSubject').value,
                gradeLevel: document.getElementById('editSlmGradeLevel').value,
                quarter: document.getElementById('editSlmQuarter').value,
                quantity: parseInt(document.getElementById('editSlmQuantity').value),
                status: document.getElementById('editSlmStatus').value,
                description: document.getElementById('editSlmDescription').value
            };
            try {
                const res = await fetch(`/api/items/slm/${itemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedItem)
                });
                if (res.ok) {
                    showNotification('SLM/SLAS item updated!', 'success');
                    modal.remove();
                    loadItems();
                } else {
                    showNotification('Update failed', 'error');
                }
            } catch (err) {
                showNotification('Error updating item', 'error');
            }
        });
    });
}

// Equipment Table Edit
if (document.getElementById('equipmentTableBody')) {
    document.getElementById('equipmentTableBody').addEventListener('click', function(e) {
        console.log('Clicked in Equipment table:', e.target);
        const editBtnEquipment = e.target.closest('.btn-icon');
        if (!editBtnEquipment || !editBtnEquipment.querySelector('.fa-edit')) return;
        const row = editBtnEquipment.closest('tr');
        if (!row) return;
        const itemId = row.getAttribute('data-id');
        if (!itemId) return;
        const cells = row.children;
        const itemData = {
            equipmentName: cells[0].textContent,
            equipmentType: cells[1].textContent,
            quantity: cells[2].textContent,
            status: cells[3].textContent,
            description: ''
        };
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Equipment Item</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editEquipmentForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editEquipmentName">Equipment Name</label>
                                <input type="text" id="editEquipmentName" value="${itemData.equipmentName}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEquipmentType">Equipment Type</label>
                                <input type="text" id="editEquipmentType" value="${itemData.equipmentType}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editEquipmentQuantity">Quantity</label>
                                <input type="number" id="editEquipmentQuantity" value="${itemData.quantity}" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="editEquipmentStatus">Status</label>
                                <input type="text" id="editEquipmentStatus" value="${itemData.status}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="width:100%">
                                <label for="editEquipmentDescription">Description</label>
                                <textarea id="editEquipmentDescription" rows="2">${itemData.description}</textarea>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn-primary">Update Item</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('editEquipmentForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const updatedItem = {
                equipmentName: document.getElementById('editEquipmentName').value,
                equipmentType: document.getElementById('editEquipmentType').value,
                quantity: parseInt(document.getElementById('editEquipmentQuantity').value),
                status: document.getElementById('editEquipmentStatus').value,
                description: document.getElementById('editEquipmentDescription').value
            };
            try {
                const res = await fetch(`/api/items/equipment/${itemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedItem)
                });
                if (res.ok) {
                    showNotification('Equipment item updated!', 'success');
                    modal.remove();
                    loadItems();
                } else {
                    showNotification('Update failed', 'error');
                }
            } catch (err) {
                showNotification('Error updating item', 'error');
            }
        });
    });
}

// TVL Table Edit
if (document.getElementById('tvlTableBody')) {
    document.getElementById('tvlTableBody').addEventListener('click', function(e) {
        console.log('Clicked in TVL table:', e.target);
        const editBtnTvl = e.target.closest('.btn-icon');
        if (!editBtnTvl || !editBtnTvl.querySelector('.fa-edit')) return;
        const row = editBtnTvl.closest('tr');
        if (!row) return;
        const itemId = row.getAttribute('data-id');
        if (!itemId) return;
        const cells = row.children;
        const itemData = {
            itemName: cells[0].textContent,
            track: cells[1].textContent,
            strand: cells[2].textContent,
            gradeLevel: cells[3].textContent,
            quantity: cells[4].textContent,
            status: cells[5].textContent,
            description: ''
        };
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit TVL Item</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editTvlForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editTvlName">Item Name</label>
                                <input type="text" id="editTvlName" value="${itemData.itemName}" required>
                            </div>
                            <div class="form-group">
                                <label for="editTvlTrack">Track</label>
                                <input type="text" id="editTvlTrack" value="${itemData.track}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editTvlStrand">Strand</label>
                                <input type="text" id="editTvlStrand" value="${itemData.strand}" required>
                            </div>
                            <div class="form-group">
                                <label for="editTvlGradeLevel">Grade Level</label>
                                <input type="text" id="editTvlGradeLevel" value="${itemData.gradeLevel}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editTvlQuantity">Quantity</label>
                                <input type="number" id="editTvlQuantity" value="${itemData.quantity}" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="editTvlStatus">Status</label>
                                <input type="text" id="editTvlStatus" value="${itemData.status}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="width:100%">
                                <label for="editTvlDescription">Description</label>
                                <textarea id="editTvlDescription" rows="2">${itemData.description}</textarea>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn-primary">Update Item</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('editTvlForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const updatedItem = {
                itemName: document.getElementById('editTvlName').value,
                track: document.getElementById('editTvlTrack').value,
                strand: document.getElementById('editTvlStrand').value,
                gradeLevel: document.getElementById('editTvlGradeLevel').value,
                quantity: parseInt(document.getElementById('editTvlQuantity').value),
                status: document.getElementById('editTvlStatus').value,
                description: document.getElementById('editTvlDescription').value
            };
            try {
                const res = await fetch(`/api/items/tvl/${itemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedItem)
                });
                if (res.ok) {
                    showNotification('TVL item updated!', 'success');
                    modal.remove();
                    loadItems();
                } else {
                    showNotification('Update failed', 'error');
                }
            } catch (err) {
                showNotification('Error updating item', 'error');
            }
        });
    });
}

// Lesson Table Edit
if (document.getElementById('lessonTableBody')) {
    document.getElementById('lessonTableBody').addEventListener('click', function(e) {
        console.log('Clicked in Lesson table:', e.target);
        const editBtnLesson = e.target.closest('.btn-icon');
        if (!editBtnLesson || !editBtnLesson.querySelector('.fa-edit')) return;
        const row = editBtnLesson.closest('tr');
        if (!row) return;
        const itemId = row.getAttribute('data-id');
        if (!itemId) return;
        const cells = row.children;
        const itemData = {
            lessonTitle: cells[0].textContent,
            subject: cells[1].textContent,
            gradeLevel: cells[2].textContent,
            quarter: cells[3].textContent,
            week: cells[4].textContent,
            status: cells[5].textContent,
            description: ''
        };
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Lesson Exemplar Item</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editLessonForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editLessonTitle">Lesson Title</label>
                                <input type="text" id="editLessonTitle" value="${itemData.lessonTitle}" required>
                            </div>
                            <div class="form-group">
                                <label for="editLessonSubject">Subject</label>
                                <input type="text" id="editLessonSubject" value="${itemData.subject}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editLessonGradeLevel">Grade Level</label>
                                <input type="text" id="editLessonGradeLevel" value="${itemData.gradeLevel}" required>
                            </div>
                            <div class="form-group">
                                <label for="editLessonQuarter">Quarter</label>
                                <input type="text" id="editLessonQuarter" value="${itemData.quarter}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editLessonWeek">Week</label>
                                <input type="number" id="editLessonWeek" value="${itemData.week}" min="1" required>
                            </div>
                            <div class="form-group">
                                <label for="editLessonStatus">Status</label>
                                <input type="text" id="editLessonStatus" value="${itemData.status}" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group" style="width:100%">
                                <label for="editLessonDescription">Description</label>
                                <textarea id="editLessonDescription" rows="2">${itemData.description}</textarea>
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                            <button type="submit" class="btn-primary">Update Item</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('editLessonForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const updatedItem = {
                lessonTitle: document.getElementById('editLessonTitle').value,
                subject: document.getElementById('editLessonSubject').value,
                gradeLevel: document.getElementById('editLessonGradeLevel').value,
                quarter: document.getElementById('editLessonQuarter').value,
                week: parseInt(document.getElementById('editLessonWeek').value),
                status: document.getElementById('editLessonStatus').value,
                description: document.getElementById('editLessonDescription').value
            };
            try {
                const res = await fetch(`/api/items/lesson/${itemId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedItem)
                });
                if (res.ok) {
                    showNotification('Lesson Exemplar item updated!', 'success');
                    modal.remove();
                    loadItems();
                } else {
                    showNotification('Update failed', 'error');
                }
            } catch (err) {
                showNotification('Error updating item', 'error');
            }
        });
    });
}

// --- Add Item Modal Submission Logic for Items Section ---
document.addEventListener('DOMContentLoaded', function() {
    // SLM/SLAS
    const addSlmBtn = document.getElementById('addSlmBtn');
    if (addSlmBtn) {
        addSlmBtn.addEventListener('click', () => {
            document.getElementById('addSlmModal').style.display = 'flex';
            const addSlmForm = document.getElementById('addSlmForm');
            // Remove any previous listener
            addSlmForm.onsubmit = null;
            addSlmForm.addEventListener('submit', async function handler(e) {
                e.preventDefault();
                console.log('SLM form submitted');
                const data = {
                    Title: document.getElementById('slmTitle').value,
                    Subject: document.getElementById('slmSubject').value,
                    GradeLevel: document.getElementById('slmGradeLevel').value,
                    Quarter: document.getElementById('slmQuarter').value,
                    Quantity: parseInt(document.getElementById('slmQuantity').value),
                    Status: document.getElementById('slmStatus').value,
                    Description: document.getElementById('slmDescription').value
                };
                console.log('Data to send:', data);
                const res = await fetch('/api/items/slm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                console.log('POST /api/items/slm response:', result);
                if (res.ok) {
                    showNotification('SLM/SLAS item added!', 'success');
                    document.getElementById('addSlmModal').style.display = 'none';
                    addSlmForm.reset();
                    loadItems();
                } else {
                    showNotification('Failed to add SLM/SLAS item', 'error');
                }
                addSlmForm.removeEventListener('submit', handler);
            }, { once: true });
        });
    }

    // Equipment
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    if (addEquipmentBtn) {
        addEquipmentBtn.addEventListener('click', () => {
            document.getElementById('addEquipmentModal').style.display = 'flex';
            const addEquipmentForm = document.getElementById('addEquipmentForm');
            addEquipmentForm.onsubmit = null;
            addEquipmentForm.addEventListener('submit', async function handler(e) {
                e.preventDefault();
                console.log('Equipment form submitted');
                const data = {
                    EquipmentName: document.getElementById('equipmentName').value,
                    EquipmentType: document.getElementById('equipmentType').value,
                    Quantity: parseInt(document.getElementById('equipmentQuantity').value),
                    Status: document.getElementById('equipmentStatus').value,
                    Description: document.getElementById('equipmentDescription').value
                };
                console.log('Data to send:', data);
                const res = await fetch('/api/items/equipment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                console.log('POST /api/items/equipment response:', result);
                if (res.ok) {
                    showNotification('Equipment item added!', 'success');
                    document.getElementById('addEquipmentModal').style.display = 'none';
                    addEquipmentForm.reset();
                    loadItems();
                } else {
                    showNotification('Failed to add equipment item', 'error');
                }
                addEquipmentForm.removeEventListener('submit', handler);
            }, { once: true });
        });
    }

    // TVL
    const addTvlBtn = document.getElementById('addTvlBtn');
    if (addTvlBtn) {
        addTvlBtn.addEventListener('click', () => {
            document.getElementById('addTvlModal').style.display = 'flex';
            const addTvlForm = document.getElementById('addTvlForm');
            addTvlForm.onsubmit = null;
            addTvlForm.addEventListener('submit', async function handler(e) {
                e.preventDefault();
                console.log('TVL form submitted');
                const data = {
                    ItemName: document.getElementById('tvlName').value,
                    Track: document.getElementById('tvlTrack').value,
                    Strand: document.getElementById('tvlStrand').value,
                    GradeLevel: document.getElementById('tvlGradeLevel').value,
                    Quantity: parseInt(document.getElementById('tvlQuantity').value),
                    Status: document.getElementById('tvlStatus').value,
                    Description: document.getElementById('tvlDescription').value
                };
                console.log('Data to send:', data);
                const res = await fetch('/api/items/tvl', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                console.log('POST /api/items/tvl response:', result);
                if (res.ok) {
                    showNotification('TVL item added!', 'success');
                    document.getElementById('addTvlModal').style.display = 'none';
                    addTvlForm.reset();
                    loadItems();
                } else {
                    showNotification('Failed to add TVL item', 'error');
                }
                addTvlForm.removeEventListener('submit', handler);
            }, { once: true });
        });
    }

    // Lesson Exemplar
    const addLessonBtn = document.getElementById('addLessonBtn');
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', () => {
            document.getElementById('addLessonModal').style.display = 'flex';
            const addLessonForm = document.getElementById('addLessonForm');
            addLessonForm.onsubmit = null;
            addLessonForm.addEventListener('submit', async function handler(e) {
                e.preventDefault();
                console.log('Lesson form submitted');
                const data = {
                    LessonTitle: document.getElementById('lessonTitle').value,
                    Subject: document.getElementById('lessonSubject').value,
                    GradeLevel: document.getElementById('lessonGradeLevel').value,
                    Quarter: document.getElementById('lessonQuarter').value,
                    Week: parseInt(document.getElementById('lessonWeek').value),
                    Status: document.getElementById('lessonStatus').value,
                    Description: document.getElementById('lessonDescription').value
                };
                console.log('Data to send:', data);
                const res = await fetch('/api/items/lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                console.log('POST /api/items/lesson response:', result);
                if (res.ok) {
                    showNotification('Lesson Exemplar item added!', 'success');
                    document.getElementById('addLessonModal').style.display = 'none';
                    addLessonForm.reset();
                    loadItems();
                } else {
                    showNotification('Failed to add lesson exemplar item', 'error');
                }
                addLessonForm.removeEventListener('submit', handler);
            }, { once: true });
        });
    }
});
// --- End Add Item Modal Submission Logic ---

function loadItems() {
    // Determine active category
    let activeCategory = 'slm';
    const navBtns = document.querySelectorAll('.item-nav-btn');
    navBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            activeCategory = btn.getAttribute('data-category');
        }
    });

    // Map category to endpoint and table body
    const config = {
        slm: {
            endpoint: '/api/items/slm',
            tableBodyId: 'slmTableBody',
            renderRow: item => `
                <td>${item.Title || ''}</td>
                <td>${item.Subject || ''}</td>
                <td>${item.GradeLevel || ''}</td>
                <td>${item.Quarter || ''}</td>
                <td>${item.Quantity || ''}</td>
                <td>${item.Status || ''}</td>
                <td><!-- Actions --></td>
            `
        },
        equipment: {
            endpoint: '/api/items/equipment',
            tableBodyId: 'equipmentTableBody',
            renderRow: item => `
                <td>${item.EquipmentName || ''}</td>
                <td>${item.EquipmentType || ''}</td>
                <td>${item.Quantity || ''}</td>
                <td>${item.Status || ''}</td>
                <td><!-- Actions --></td>
            `
        },
        tvl: {
            endpoint: '/api/items/tvl',
            tableBodyId: 'tvlTableBody',
            renderRow: item => `
                <td>${item.ItemName || ''}</td>
                <td>${item.Track || ''}</td>
                <td>${item.Strand || ''}</td>
                <td>${item.GradeLevel || ''}</td>
                <td>${item.Quantity || ''}</td>
                <td>${item.Status || ''}</td>
                <td><!-- Actions --></td>
            `
        },
        lesson: {
            endpoint: '/api/items/lesson',
            tableBodyId: 'lessonTableBody',
            renderRow: item => `
                <td>${item.LessonTitle || ''}</td>
                <td>${item.Subject || ''}</td>
                <td>${item.GradeLevel || ''}</td>
                <td>${item.Quarter || ''}</td>
                <td>${item.Week || ''}</td>
                <td>${item.Status || ''}</td>
                <td><!-- Actions --></td>
            `
        }
    };

    const { endpoint, tableBodyId, renderRow } = config[activeCategory];
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

    fetch(endpoint)
        .then(res => res.json())
        .then(items => {
            tableBody.innerHTML = '';
            if (!items || items.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;">No items found.</td></tr>';
                return;
            }
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = renderRow(item);
                tableBody.appendChild(row);
            });
        })
        .catch(err => {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#e53e3e;">Failed to load items.</td></tr>';
            console.error('Error loading items:', err);
        });
}
ip
