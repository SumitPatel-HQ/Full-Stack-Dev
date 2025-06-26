// Global variables
let assignments = [];
const STORAGE_KEY = 'assignmentTrackerData';

// DOM Elements
const assignmentForm = document.getElementById('assignment-form');
const assignmentsContainer = document.getElementById('assignments-container');
const noAssignmentsMessage = document.getElementById('no-assignments');
const filterPriority = document.getElementById('filter-priority');
const sortBy = document.getElementById('sort-by');

// Load assignments from local storage when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAssignments();
    renderAssignments();
    
    // Set up event listeners
    assignmentForm.addEventListener('submit', addAssignment);
    filterPriority.addEventListener('change', renderAssignments);
    sortBy.addEventListener('change', renderAssignments);
});

// Load assignments from local storage
function loadAssignments() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        assignments = JSON.parse(storedData);
    }
}

// Save assignments to local storage
function saveAssignments() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}

// Add a new assignment
function addAssignment(e) {
    e.preventDefault();
    
    const formData = new FormData(assignmentForm);
    const newAssignment = {
        id: Date.now().toString(),
        title: formData.get('title'),
        course: formData.get('course'),
        dueDate: formData.get('dueDate'),
        priority: formData.get('priority'),
        notes: formData.get('notes'),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    assignments.push(newAssignment);
    saveAssignments();
    assignmentForm.reset();
    renderAssignments();
}

// Delete an assignment
function deleteAssignment(id) {
    assignments = assignments.filter(assignment => assignment.id !== id);
    saveAssignments();
    renderAssignments();
}

// Toggle assignment completion
function toggleComplete(id) {
    assignments = assignments.map(assignment => {
        if (assignment.id === id) {
            return { ...assignment, completed: !assignment.completed };
        }
        return assignment;
    });
    saveAssignments();
    renderAssignments();
}

// Filter and sort assignments
function getFilteredAndSortedAssignments() {
    const priorityFilter = filterPriority.value;
    const sortOption = sortBy.value;
    
    // Filter
    let filtered = [...assignments];
    if (priorityFilter !== 'all') {
        filtered = filtered.filter(assignment => assignment.priority === priorityFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
        if (sortOption === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortOption === 'priority') {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else if (sortOption === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });
    
    return filtered;
}

// Render assignments to the DOM
function renderAssignments() {
    const filteredAssignments = getFilteredAndSortedAssignments();
    
    // Show/hide no assignments message
    if (filteredAssignments.length === 0) {
        noAssignmentsMessage.style.display = 'block';
    } else {
        noAssignmentsMessage.style.display = 'none';
    }
    
    // Clear current assignments
    assignmentsContainer.innerHTML = '';
    if (filteredAssignments.length === 0) {
        assignmentsContainer.appendChild(noAssignmentsMessage);
        return;
    }
    
    // Add each assignment
    filteredAssignments.forEach(assignment => {
        const assignmentEl = document.createElement('div');
        assignmentEl.className = `border rounded-lg p-4 ${assignment.completed ? 'bg-gray-50' : ''} ${getPriorityColor(assignment.priority)}`;
        
        // Format the date
        const dueDate = new Date(assignment.dueDate);
        const formattedDate = dueDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const isOverdue = !assignment.completed && new Date() > dueDate;
        
        assignmentEl.innerHTML = `
            <div class="flex justify-between">
                <div class="flex-1">
                    <div class="flex items-start gap-3">
                        <input type="checkbox" ${assignment.completed ? 'checked' : ''} 
                            class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                        <div>
                            <h3 class="text-lg font-medium ${assignment.completed ? 'line-through text-gray-500' : ''}">${assignment.title}</h3>
                            <p class="text-gray-600">${assignment.course}</p>
                            <div class="mt-1 flex items-center gap-2">
                                <span class="text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}">
                                    ${isOverdue ? 'OVERDUE: ' : ''}Due: ${formattedDate}
                                </span>
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeColor(assignment.priority)}">
                                    ${capitalizeFirstLetter(assignment.priority)}
                                </span>
                            </div>
                            ${assignment.notes ? `<p class="mt-2 text-gray-700">${assignment.notes}</p>` : ''}
                        </div>
                    </div>
                </div>
                <div>
                    <button class="text-red-500 hover:text-red-700 p-1" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const checkbox = assignmentEl.querySelector('input[type="checkbox"]');
        const deleteButton = assignmentEl.querySelector('button');
        
        checkbox.addEventListener('change', () => toggleComplete(assignment.id));
        deleteButton.addEventListener('click', () => deleteAssignment(assignment.id));
        
        assignmentsContainer.appendChild(assignmentEl);
    });
}

// Helper functions
function getPriorityColor(priority) {
    if (priority === 'high') {
        return 'border-l-4 border-l-red-500';
    } else if (priority === 'medium') {
        return 'border-l-4 border-l-yellow-500';
    } else {
        return 'border-l-4 border-l-green-500';
    }
}

function getPriorityBadgeColor(priority) {
    if (priority === 'high') {
        return 'bg-red-100 text-red-800';
    } else if (priority === 'medium') {
        return 'bg-yellow-100 text-yellow-800';
    } else {
        return 'bg-green-100 text-green-800';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}