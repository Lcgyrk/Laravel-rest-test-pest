// 404 Not Found Page
addRoute('404', () => {
    const content = `
        <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full text-center">
                <h1 class="text-9xl font-bold text-indigo-600">404</h1>
                <h2 class="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
                <p class="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
                <div class="mt-6">
                    <a href="#" id="go-home" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    
    document.getElementById('go-home').addEventListener('click', (e) => {
        e.preventDefault();
        if (isAuthenticated()) {
            navigateTo('dashboard');
        } else {
            navigateTo('login');
        }
    });
});

// Set default route
addRoute('', () => {
    if (isAuthenticated()) {
        navigateTo('dashboard');
    } else {
        navigateTo('login');
    }
});
