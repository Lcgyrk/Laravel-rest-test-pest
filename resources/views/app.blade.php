<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaraDesk - Support Ticket System</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50">
    <div id="app">
        <!-- Navigation -->
        <nav id="navbar" class="bg-white shadow-lg hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <span class="text-2xl font-bold text-indigo-600">LaraDesk</span>
                        <div class="hidden md:ml-10 md:flex md:space-x-8">
                            <a href="#" data-page="dashboard" class="nav-link border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Dashboard
                            </a>
                            <a href="#" data-page="tickets" class="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Tickets
                            </a>
                            <a href="#" data-page="users" class="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium hidden" id="users-link">
                                Users
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-700">
                            <span class="font-medium" id="user-name"></span>
                            <span class="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800" id="user-role"></span>
                        </span>
                        <button id="logout-btn" class="text-gray-500 hover:text-gray-700">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main id="main-content" class="min-h-screen">
            <!-- Content will be loaded here dynamically -->
        </main>
    </div>

    <!-- Loading Spinner -->
    <div id="loading" class="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Toast Notification -->
    <div id="toast" class="hidden fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300">
        <div class="flex items-center">
            <span id="toast-message" class="text-white font-medium"></span>
        </div>
    </div>
</body>
</html>
