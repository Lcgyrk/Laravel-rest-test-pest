// Tickets Page
addRoute('tickets', async () => {
    if (!requireAuth()) return;

    const user = getUser();
    const canCreateTicket = user.role === 'customer' || user.role === 'admin';
    
    const content = `
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-900">Tickets</h1>
                    ${canCreateTicket ? `
                        <button id="create-ticket-btn" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            New Ticket
                        </button>
                    ` : ''}
                </div>

                <!-- Filters -->
                <div class="bg-white shadow rounded-lg p-4 mb-6">
                    <div class="flex flex-wrap gap-2">
                        <button class="filter-btn px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white" data-filter="all">
                            All
                        </button>
                        <button class="filter-btn px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300" data-filter="open">
                            Open
                        </button>
                        <button class="filter-btn px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300" data-filter="in_progress">
                            In Progress
                        </button>
                        <button class="filter-btn px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300" data-filter="resolved">
                            Resolved
                        </button>
                        <button class="filter-btn px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300" data-filter="closed">
                            Closed
                        </button>
                    </div>
                </div>

                <!-- Tickets List -->
                <div id="tickets-list" class="bg-white shadow rounded-lg">
                    <div class="text-center py-8 text-gray-500">Loading tickets...</div>
                </div>
            </div>
        </div>

        <!-- Create Ticket Modal -->
        <div id="create-ticket-modal" class="hidden fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" id="modal-backdrop"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Create New Ticket</h3>
                        <form id="create-ticket-form" class="space-y-4">
                            <div>
                                <label for="ticket-title" class="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" id="ticket-title" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Brief description of the issue">
                            </div>
                            <div>
                                <label for="ticket-description" class="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="ticket-description" rows="4" required 
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Detailed description of your issue (minimum 10 characters)"></textarea>
                            </div>
                            <div id="create-ticket-error" class="hidden text-red-600 text-sm"></div>
                        </form>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" form="create-ticket-form" 
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Create Ticket
                        </button>
                        <button type="button" id="cancel-create-btn" 
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- View Ticket Modal -->
        <div id="view-ticket-modal" class="hidden fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" id="view-modal-backdrop"></div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-50">
                    <div id="view-ticket-content" class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <!-- Content will be loaded here -->
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" id="close-view-btn" 
                            class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    updateUserUI();
    setupNavigation();

    let allTickets = [];
    let currentFilter = 'all';

    // Load tickets
    const loadTickets = async () => {
        try {
            showLoading();
            const response = await api.getTickets();
            allTickets = response.tickets;
            displayTickets(allTickets, currentFilter);
        } catch (error) {
            console.error('Error loading tickets:', error);
            showToast('Failed to load tickets', 'error');
        } finally {
            hideLoading();
        }
    };

    // Display tickets
    const displayTickets = (tickets, filter) => {
        const filteredTickets = filter === 'all' 
            ? tickets 
            : tickets.filter(t => t.status === filter);

        const ticketsList = document.getElementById('tickets-list');

        if (filteredTickets.length === 0) {
            ticketsList.innerHTML = '<p class="text-gray-500 text-center py-8">No tickets found</p>';
            return;
        }

        ticketsList.innerHTML = `
            <div class="divide-y divide-gray-200">
                ${filteredTickets.map(ticket => `
                    <div class="p-6 hover:bg-gray-50 cursor-pointer transition-colors" data-ticket-id="${ticket.id}">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center space-x-3">
                                    <h3 class="text-lg font-medium text-gray-900">${ticket.title}</h3>
                                    ${getStatusBadge(ticket.status)}
                                </div>
                                <p class="mt-2 text-sm text-gray-600">${ticket.description.substring(0, 150)}${ticket.description.length > 150 ? '...' : ''}</p>
                                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                    <span class="flex items-center">
                                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        ${ticket.user?.name || 'Unknown'}
                                    </span>
                                    <span class="flex items-center">
                                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        ${new Date(ticket.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div class="ml-4">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers to tickets
        document.querySelectorAll('[data-ticket-id]').forEach(el => {
            el.addEventListener('click', () => {
                const ticketId = el.dataset.ticketId;
                viewTicket(ticketId);
            });
        });
    };

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            
            // Update button styles
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });
            btn.classList.remove('bg-gray-200', 'text-gray-700');
            btn.classList.add('bg-indigo-600', 'text-white');
            
            displayTickets(allTickets, currentFilter);
        });
    });

    // Create ticket button
    if (canCreateTicket) {
        document.getElementById('create-ticket-btn').addEventListener('click', () => {
            document.getElementById('create-ticket-modal').classList.remove('hidden');
        });

        // Cancel create
        document.getElementById('cancel-create-btn').addEventListener('click', () => {
            document.getElementById('create-ticket-modal').classList.add('hidden');
            document.getElementById('create-ticket-form').reset();
        });

        document.getElementById('modal-backdrop').addEventListener('click', () => {
            document.getElementById('create-ticket-modal').classList.add('hidden');
            document.getElementById('create-ticket-form').reset();
        });

        // Submit create form
        document.getElementById('create-ticket-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('ticket-title').value;
            const description = document.getElementById('ticket-description').value;
            const errorDiv = document.getElementById('create-ticket-error');

            try {
                showLoading();
                errorDiv.classList.add('hidden');
                
                await api.createTicket({ title, description });
                
                document.getElementById('create-ticket-modal').classList.add('hidden');
                document.getElementById('create-ticket-form').reset();
                showToast('Ticket created successfully!', 'success');
                
                // Reload tickets
                await loadTickets();
            } catch (error) {
                errorDiv.classList.remove('hidden');
                if (error.data?.errors) {
                    const errors = Object.values(error.data.errors).flat();
                    errorDiv.innerHTML = errors.map(err => `<p>${err}</p>`).join('');
                } else {
                    errorDiv.textContent = error.data?.message || 'Failed to create ticket';
                }
            } finally {
                hideLoading();
            }
        });
    }

    // View ticket function
    const viewTicket = async (ticketId) => {
        try {
            showLoading();
            const response = await api.getTicket(ticketId);
            const ticket = response.ticket;
            
            const canUpdate = user.role === 'admin' || user.role === 'agent' || ticket.user_id === user.id;
            const canDelete = user.role === 'admin';
            
            document.getElementById('view-ticket-content').innerHTML = `
                <h3 class="text-xl font-bold text-gray-900 mb-4">${ticket.title}</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        ${canUpdate && (user.role === 'admin' || user.role === 'agent') ? `
                            <select id="ticket-status" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Open</option>
                                <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                                <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Closed</option>
                            </select>
                        ` : `
                            <div>${getStatusBadge(ticket.status)}</div>
                        `}
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p class="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">${ticket.description}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                            <p class="text-sm text-gray-900">${ticket.user?.name || 'Unknown'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                            <p class="text-sm text-gray-900">${new Date(ticket.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    ${canUpdate || canDelete ? `
                        <div class="flex space-x-2 pt-4">
                            ${canUpdate && (user.role === 'admin' || user.role === 'agent') ? `
                                <button id="update-ticket-btn" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                                    Update Status
                                </button>
                            ` : ''}
                            ${canUpdate && user.role === 'customer' && ticket.status !== 'closed' ? `
                                <button id="close-ticket-btn" class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">
                                    Close Ticket
                                </button>
                            ` : ''}
                            ${canDelete ? `
                                <button id="delete-ticket-btn" class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                                    Delete Ticket
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
            
            document.getElementById('view-ticket-modal').classList.remove('hidden');
            
            // Update ticket button
            const updateBtn = document.getElementById('update-ticket-btn');
            if (updateBtn) {
                updateBtn.addEventListener('click', async () => {
                    const status = document.getElementById('ticket-status').value;
                    try {
                        showLoading();
                        await api.updateTicket(ticketId, { status });
                        showToast('Ticket updated successfully!', 'success');
                        document.getElementById('view-ticket-modal').classList.add('hidden');
                        await loadTickets();
                    } catch (error) {
                        showToast(error.data?.message || 'Failed to update ticket', 'error');
                    } finally {
                        hideLoading();
                    }
                });
            }
            
            // Close ticket button (for customers)
            const closeBtn = document.getElementById('close-ticket-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', async () => {
                    try {
                        showLoading();
                        await api.updateTicket(ticketId, { status: 'closed' });
                        showToast('Ticket closed successfully!', 'success');
                        document.getElementById('view-ticket-modal').classList.add('hidden');
                        await loadTickets();
                    } catch (error) {
                        showToast(error.data?.message || 'Failed to close ticket', 'error');
                    } finally {
                        hideLoading();
                    }
                });
            }
            
            // Delete ticket button
            const deleteBtn = document.getElementById('delete-ticket-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    if (confirm('Are you sure you want to delete this ticket?')) {
                        try {
                            showLoading();
                            await api.deleteTicket(ticketId);
                            showToast('Ticket deleted successfully!', 'success');
                            document.getElementById('view-ticket-modal').classList.add('hidden');
                            await loadTickets();
                        } catch (error) {
                            showToast(error.data?.message || 'Failed to delete ticket', 'error');
                        } finally {
                            hideLoading();
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error loading ticket:', error);
            showToast('Failed to load ticket details', 'error');
        } finally {
            hideLoading();
        }
    };

    // Close view modal
    document.getElementById('close-view-btn').addEventListener('click', () => {
        document.getElementById('view-ticket-modal').classList.add('hidden');
    });

    document.getElementById('view-modal-backdrop').addEventListener('click', () => {
        document.getElementById('view-ticket-modal').classList.add('hidden');
    });

    // Initial load
    await loadTickets();
});
