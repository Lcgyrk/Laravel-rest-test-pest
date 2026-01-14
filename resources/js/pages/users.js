// Users Management Page (Admin Only)
addRoute('users', async () => {
    if (!requireAuth()) return;

    const user = getUser();
    if (user.role !== 'admin') {
        showToast('Access denied. Admin only.', 'error');
        navigateTo('dashboard');
        return;
    }
    
    const content = `
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
                    <button id="create-user-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add User
                    </button>
                </div>

                <!-- Users List -->
                <div id="users-list" class="bg-white shadow rounded-lg overflow-hidden">
                    <div class="text-center py-8 text-gray-500">Loading users...</div>
                </div>
            </div>
        </div>

        <!-- Create User Modal -->
        <div id="create-user-modal" class="hidden fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" id="user-modal-backdrop"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
                        <form id="create-user-form" class="space-y-4">
                            <div>
                                <label for="user-name" class="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="user-name" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="John Doe">
                            </div>
                            <div>
                                <label for="user-email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="user-email" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="john@example.com">
                            </div>
                            <div>
                                <label for="user-password" class="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="user-password" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Min 6 characters">
                            </div>
                            <div>
                                <label for="user-password-confirm" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input type="password" id="user-password-confirm" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Confirm password">
                            </div>
                            <div>
                                <label for="user-role" class="block text-sm font-medium text-gray-700">Role</label>
                                <select id="user-role" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="">Select a role</option>
                                    <option value="admin">Admin</option>
                                    <option value="agent">Agent</option>
                                    <option value="customer">Customer</option>
                                </select>
                            </div>
                            <div id="create-user-error" class="hidden text-red-600 text-sm"></div>
                        </form>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" form="create-user-form" 
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Create User
                        </button>
                        <button type="button" id="cancel-user-btn" 
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    updateUserUI();
    setupNavigation();

    // Load users
    const loadUsers = async () => {
        try {
            showLoading();
            const response = await api.getUsers();
            const users = response.users;
            
            const usersList = document.getElementById('users-list');
            
            if (users.length === 0) {
                usersList.innerHTML = '<p class="text-gray-500 text-center py-8">No users found</p>';
                return;
            }

            usersList.innerHTML = `
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${users.map(u => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">${u.name}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500">${u.email}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    ${getRoleBadge(u.role)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    ${u.id !== user.id ? `
                                        <button class="delete-user-btn text-red-600 hover:text-red-900" data-user-id="${u.id}" data-user-name="${u.name}">
                                            Delete
                                        </button>
                                    ` : '<span class="text-gray-400">Current User</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // Add delete handlers
            document.querySelectorAll('.delete-user-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const userId = btn.dataset.userId;
                    const userName = btn.dataset.userName;
                    
                    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
                        try {
                            showLoading();
                            await api.deleteUser(userId);
                            showToast('User deleted successfully!', 'success');
                            await loadUsers();
                        } catch (error) {
                            showToast(error.data?.message || 'Failed to delete user', 'error');
                        } finally {
                            hideLoading();
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error loading users:', error);
            showToast('Failed to load users', 'error');
        } finally {
            hideLoading();
        }
    };

    // Create user button
    document.getElementById('create-user-btn').addEventListener('click', () => {
        document.getElementById('create-user-modal').classList.remove('hidden');
    });

    // Cancel create
    document.getElementById('cancel-user-btn').addEventListener('click', () => {
        document.getElementById('create-user-modal').classList.add('hidden');
        document.getElementById('create-user-form').reset();
    });

    document.getElementById('user-modal-backdrop').addEventListener('click', () => {
        document.getElementById('create-user-modal').classList.add('hidden');
        document.getElementById('create-user-form').reset();
    });

    // Submit create form
    document.getElementById('create-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const password_confirmation = document.getElementById('user-password-confirm').value;
        const role = document.getElementById('user-role').value;
        const errorDiv = document.getElementById('create-user-error');

        try {
            showLoading();
            errorDiv.classList.add('hidden');
            
            await api.createUser({ name, email, password, password_confirmation, role });
            
            document.getElementById('create-user-modal').classList.add('hidden');
            document.getElementById('create-user-form').reset();
            showToast('User created successfully!', 'success');
            
            // Reload users
            await loadUsers();
        } catch (error) {
            errorDiv.classList.remove('hidden');
            if (error.data?.errors) {
                const errors = Object.values(error.data.errors).flat();
                errorDiv.innerHTML = errors.map(err => `<p>${err}</p>`).join('');
            } else {
                errorDiv.textContent = error.data?.message || 'Failed to create user';
            }
        } finally {
            hideLoading();
        }
    });

    // Initial load
    await loadUsers();
});

// Helper function for role badges
function getRoleBadge(role) {
    const badges = {
        admin: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Admin</span>',
        agent: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Agent</span>',
        customer: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Customer</span>',
    };
    return badges[role] || badges.customer;
}
