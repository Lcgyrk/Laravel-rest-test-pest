// Dashboard Page
addRoute('dashboard', async () => {
    if (!requireAuth()) return;

    const user = getUser();
    
    const content = `
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                                        <dd class="text-3xl font-semibold text-gray-900" id="stat-total"></dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                                        <dd class="text-3xl font-semibold text-yellow-600" id="stat-open"></dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-5">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div class="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt class="text-sm font-medium text-gray-500 truncate">Resolved Tickets</dt>
                                        <dd class="text-3xl font-semibold text-green-600" id="stat-resolved"></dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Welcome Message -->
                <div class="bg-white shadow rounded-lg p-6 mb-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-2">Welcome back, ${user.name}!</h2>
                    <p class="text-gray-600">You're logged in as <span class="font-medium text-indigo-600">${user.role}</span>.</p>
                    <div class="mt-4">
                        <a href="#" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700" id="view-tickets-btn">
                            View All Tickets
                        </a>
                    </div>
                </div>

                <!-- Recent Tickets -->
                <div class="bg-white shadow rounded-lg">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-medium text-gray-900">Recent Tickets</h3>
                    </div>
                    <div id="recent-tickets" class="p-6">
                        <div class="text-center py-4 text-gray-500">Loading tickets...</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    updateUserUI();
    setupNavigation();

    // Load tickets data
    try {
        showLoading();
        const response = await api.getTickets();
        const tickets = response.tickets;

        // Calculate stats
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'open').length;
        const resolved = tickets.filter(t => t.status === 'resolved').length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-open').textContent = open;
        document.getElementById('stat-resolved').textContent = resolved;

        // Display recent tickets (last 5)
        const recentTickets = tickets.slice(0, 5);
        const recentTicketsDiv = document.getElementById('recent-tickets');

        if (recentTickets.length === 0) {
            recentTicketsDiv.innerHTML = '<p class="text-gray-500 text-center py-4">No tickets found</p>';
        } else {
            recentTicketsDiv.innerHTML = `
                <div class="space-y-4">
                    ${recentTickets.map(ticket => `
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div class="flex-1">
                                <h4 class="text-sm font-medium text-gray-900">${ticket.title}</h4>
                                <p class="text-sm text-gray-500 mt-1">${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}</p>
                                <div class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                                    <span>By: ${ticket.user?.name || 'Unknown'}</span>
                                    <span>•</span>
                                    <span>${new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div class="ml-4">
                                ${getStatusBadge(ticket.status)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading tickets:', error);
        showToast('Failed to load tickets', 'error');
    } finally {
        hideLoading();
    }

    // View tickets button
    document.getElementById('view-tickets-btn').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('tickets');
    });
});

// Helper function to get status badge
function getStatusBadge(status) {
    const badges = {
        open: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Open</span>',
        in_progress: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>',
        resolved: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Resolved</span>',
        closed: '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Closed</span>',
    };
    return badges[status] || badges.open;
}

window.getStatusBadge = getStatusBadge;
