// Admin Dashboard JavaScript
// Add debug utility if not already present
if (typeof LiveChatDebug === 'undefined') {
  // Get debug setting from URL parameter or default to true
  const urlParams = new URLSearchParams(window.location.search);
  const debugParam = urlParams.get('debug');
  const DEBUG_ENABLED = debugParam !== null ? debugParam === 'true' : true;

  /**
   * Debug logger that respects the DEBUG_ENABLED setting
   */
  function debugLog(...args) {
    if (DEBUG_ENABLED) {
      console.log('[LiveChat Admin Debug]', ...args);
    }
  }

  /**
   * Debug error logger that respects the DEBUG_ENABLED setting
   */
  function debugError(...args) {
    if (DEBUG_ENABLED) {
      console.error('[LiveChat Admin Debug]', ...args);
    }
  }

  // Export functions for use in other modules
  window.LiveChatDebug = {
    log: debugLog,
    error: debugError,
    isEnabled: DEBUG_ENABLED
  };
}

class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('adminToken');
        this.currentPage = {
            users: 1,
            rooms: 1,
            messages: 1
        };
        this.currentSearch = {
            users: '',
            rooms: '',
            messages: ''
        };
        
        this.init();
    }
    
    init() {
        // Check if user is logged in
        if (!this.token) {
            this.redirectToLogin();
            return;
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadDashboardData();
        this.loadUsers();
        this.loadRooms();
        this.loadMessages();
        
        // Set up periodic refresh
        setInterval(() => {
            if (document.querySelector('#dashboard-tab').classList.contains('active')) {
                this.loadDashboardData();
            }
        }, 30000); // Refresh every 30 seconds
    }
    
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.sidebar nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
        
        // User search
        document.getElementById('user-search').addEventListener('input', (e) => {
            this.currentSearch.users = e.target.value;
            this.currentPage.users = 1;
            this.loadUsers();
        });
        
        // Room search
        document.getElementById('room-search').addEventListener('input', (e) => {
            this.currentSearch.rooms = e.target.value;
            this.currentPage.rooms = 1;
            this.loadRooms();
        });
        
        // Message search
        document.getElementById('message-search').addEventListener('input', (e) => {
            this.currentSearch.messages = e.target.value;
            this.currentPage.messages = 1;
            this.loadMessages();
        });
        
        // Refresh buttons
        document.getElementById('refresh-users').addEventListener('click', () => {
            this.loadUsers();
        });
        
        document.getElementById('refresh-rooms').addEventListener('click', () => {
            this.loadRooms();
        });
        
        document.getElementById('refresh-messages').addEventListener('click', () => {
            this.loadMessages();
        });
        
        // Modal actions
        document.getElementById('modal-cancel').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('modal-confirm').addEventListener('click', () => {
            const action = document.getElementById('confirmation-modal').dataset.action;
            const id = document.getElementById('confirmation-modal').dataset.id;
            this.executeAction(action, id);
        });
    }
    
    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all nav links
        document.querySelectorAll('.sidebar nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Set active class on clicked nav link
        document.querySelector(`.sidebar nav a[data-tab="${tabName}"]`).classList.add('active');
        
        // Load data for the selected tab if needed
        switch(tabName) {
            case 'users':
                this.loadUsers();
                break;
            case 'rooms':
                this.loadRooms();
                break;
            case 'messages':
                this.loadMessages();
                break;
        }
    }
    
    async loadDashboardData() {
        try {
            const response = await fetch('/api/admin/analytics', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update stats
                document.getElementById('total-users').textContent = data.data.stats.totalUsers;
                document.getElementById('total-rooms').textContent = data.data.stats.totalRooms;
                document.getElementById('total-messages').textContent = data.data.stats.totalMessages;
                
                // Update recent users table
                const usersTable = document.querySelector('#recent-users-table tbody');
                usersTable.innerHTML = '';
                data.data.recentUsers.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.role}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    `;
                    usersTable.appendChild(row);
                });
                
                // Update recent rooms table
                const roomsTable = document.querySelector('#recent-rooms-table tbody');
                roomsTable.innerHTML = '';
                data.data.recentRooms.forEach(room => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${room.name}</td>
                        <td>${room.createdBy?.username || 'Unknown'}</td>
                        <td>${room.members.length}</td>
                        <td>${new Date(room.createdAt).toLocaleDateString()}</td>
                    `;
                    roomsTable.appendChild(row);
                });
                
                // Update recent messages table
                const messagesTable = document.querySelector('#recent-messages-table tbody');
                messagesTable.innerHTML = '';
                data.data.recentMessages.forEach(message => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${message.username}</td>
                        <td>${message.roomId?.name || 'Unknown'}</td>
                        <td>${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}</td>
                        <td>${new Date(message.createdAt).toLocaleDateString()}</td>
                    `;
                    messagesTable.appendChild(row);
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            LiveChatDebug.error('Error loading dashboard data:', error);
            this.showMessage('Failed to load dashboard data', 'error');
        }
    }
    
    async loadUsers(page = 1) {
        try {
            const response = await fetch(`/api/admin/users?page=${page}&limit=10&search=${encodeURIComponent(this.currentSearch.users)}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update users table
                const usersTable = document.querySelector('#users-table tbody');
                usersTable.innerHTML = '';
                
                data.data.users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>
                            <select class="role-select" data-user-id="${user._id}" data-current-role="${user.role}">
                                <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                        </td>
                        <td>${user.provider}</td>
                        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                        <td class="actions">
                            ${user.role !== 'admin' ? 
                                `<button class="btn btn-delete" onclick="adminDashboard.deleteUser('${user._id}')">Delete</button>` : 
                                ''}
                        </td>
                    `;
                    usersTable.appendChild(row);
                });
                
                // Add event listeners for role selects
                document.querySelectorAll('.role-select').forEach(select => {
                    select.addEventListener('change', (e) => {
                        const userId = e.target.dataset.userId;
                        const newRole = e.target.value;
                        this.updateUserRole(userId, newRole);
                    });
                });
                
                // Update pagination
                this.updatePagination('users', data.data.pagination);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            LiveChatDebug.error('Error loading users:', error);
            this.showMessage('Failed to load users', 'error');
        }
    }
    
    async loadRooms(page = 1) {
        try {
            const response = await fetch(`/api/admin/rooms?page=${page}&limit=10&search=${encodeURIComponent(this.currentSearch.rooms)}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update rooms table
                const roomsTable = document.querySelector('#rooms-table tbody');
                roomsTable.innerHTML = '';
                
                data.data.rooms.forEach(room => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${room.name}</td>
                        <td>${room.description || 'N/A'}</td>
                        <td>${room.createdBy?.username || 'Unknown'}</td>
                        <td>${room.members.length}</td>
                        <td>${room.isPrivate ? 'Yes' : 'No'}</td>
                        <td>${new Date(room.createdAt).toLocaleDateString()}</td>
                        <td class="actions">
                            <button class="btn btn-delete" onclick="adminDashboard.deleteRoom('${room._id}')">Delete</button>
                        </td>
                    `;
                    roomsTable.appendChild(row);
                });
                
                // Update pagination
                this.updatePagination('rooms', data.data.pagination);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            LiveChatDebug.error('Error loading rooms:', error);
            this.showMessage('Failed to load rooms', 'error');
        }
    }
    
    async loadMessages(page = 1) {
        try {
            const response = await fetch(`/api/admin/messages?page=${page}&limit=10&search=${encodeURIComponent(this.currentSearch.messages)}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update messages table
                const messagesTable = document.querySelector('#messages-table tbody');
                messagesTable.innerHTML = '';
                
                data.data.messages.forEach(message => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${message.username}</td>
                        <td>${message.roomId?.name || 'Unknown'}</td>
                        <td>${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}</td>
                        <td>${message.messageType}</td>
                        <td>${new Date(message.createdAt).toLocaleDateString()}</td>
                        <td class="actions">
                            <button class="btn btn-delete" onclick="adminDashboard.deleteMessage('${message._id}')">Delete</button>
                        </td>
                    `;
                    messagesTable.appendChild(row);
                });
                
                // Update pagination
                this.updatePagination('messages', data.data.pagination);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            LiveChatDebug.error('Error loading messages:', error);
            this.showMessage('Failed to load messages', 'error');
        }
    }
    
    updatePagination(type, pagination) {
        const paginationEl = document.getElementById(`${type}-pagination`);
        paginationEl.innerHTML = '';
        
        if (pagination.totalPages > 1) {
            // Previous button
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = !pagination.hasPrev;
            prevButton.addEventListener('click', () => {
                if (pagination.hasPrev) {
                    this.currentPage[type] = pagination.currentPage - 1;
                    this[`load${type.charAt(0).toUpperCase() + type.slice(1)}`](this.currentPage[type]);
                }
            });
            paginationEl.appendChild(prevButton);
            
            // Page numbers
            for (let i = 1; i <= pagination.totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.classList.toggle('active', i === pagination.currentPage);
                pageButton.addEventListener('click', () => {
                    this.currentPage[type] = i;
                    this[`load${type.charAt(0).toUpperCase() + type.slice(1)}`](i);
                });
                paginationEl.appendChild(pageButton);
            }
            
            // Next button
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.disabled = !pagination.hasNext;
            nextButton.addEventListener('click', () => {
                if (pagination.hasNext) {
                    this.currentPage[type] = pagination.currentPage + 1;
                    this[`load${type.charAt(0).toUpperCase() + type.slice(1)}`](this.currentPage[type]);
                }
            });
            paginationEl.appendChild(nextButton);
        }
    }
    
    async updateUserRole(userId, newRole) {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage('User role updated successfully', 'success');
                // Reload users to reflect changes
                this.loadUsers(this.currentPage.users);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            LiveChatDebug.error('Error updating user role:', error);
            this.showMessage('Failed to update user role', 'error');
        }
    }
    
    deleteUser(userId) {
        this.showModal('Delete User', 'Are you sure you want to delete this user? This action cannot be undone.', 'deleteUser', userId);
    }
    
    deleteRoom(roomId) {
        this.showModal('Delete Room', 'Are you sure you want to delete this room? This will also delete all messages in this room.', 'deleteRoom', roomId);
    }
    
    deleteMessage(messageId) {
        this.showModal('Delete Message', 'Are you sure you want to delete this message?', 'deleteMessage', messageId);
    }
    
    async executeAction(action, id) {
        this.hideModal();
        
        try {
            let response;
            switch(action) {
                case 'deleteUser':
                    response = await fetch(`/api/admin/users/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                    break;
                case 'deleteRoom':
                    response = await fetch(`/api/admin/rooms/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                    break;
                case 'deleteMessage':
                    response = await fetch(`/api/admin/messages/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                    break;
                default:
                    throw new Error('Unknown action');
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.showMessage('Action completed successfully', 'success');
                // Reload current tab data
                const activeTab = document.querySelector('.tab-content.active').id.replace('-tab', '');
                switch(activeTab) {
                    case 'users':
                        this.loadUsers(this.currentPage.users);
                        break;
                    case 'rooms':
                        this.loadRooms(this.currentPage.rooms);
                        break;
                    case 'messages':
                        this.loadMessages(this.currentPage.messages);
                        break;
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            LiveChatDebug.error('Error executing action:', error);
            this.showMessage('Failed to execute action', 'error');
        }
    }
    
    showModal(title, message, action, id) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        const modal = document.getElementById('confirmation-modal');
        modal.dataset.action = action;
        modal.dataset.id = id;
        modal.classList.remove('hidden');
    }
    
    hideModal() {
        document.getElementById('confirmation-modal').classList.add('hidden');
    }
    
    showMessage(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '4px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '1000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c'
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    logout() {
        localStorage.removeItem('adminToken');
        this.redirectToLogin();
    }
    
    redirectToLogin() {
        window.location.href = '/';
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});
