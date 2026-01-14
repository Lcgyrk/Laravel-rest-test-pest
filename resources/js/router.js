// Simple Router
const routes = {};

// Register a route
window.addRoute = (path, handler) => {
    routes[path] = handler;
};

// Navigate to a route
window.navigateTo = (path) => {
    window.history.pushState({}, path, `/${path}`);
    handleRoute(path);
};

// Handle route
const handleRoute = (path) => {
    const handler = routes[path] || routes['404'];
    if (handler) {
        handler();
    }
};

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const path = window.location.pathname.slice(1) || 'login';
    handleRoute(path);
});

// Initialize router on page load
window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.slice(1) || 'login';
    handleRoute(path);
});

// Navigation helper
window.setupNavigation = () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Update active link
            navLinks.forEach(l => {
                l.classList.remove('border-indigo-500', 'text-gray-900');
                l.classList.add('border-transparent', 'text-gray-500');
            });
            link.classList.remove('border-transparent', 'text-gray-500');
            link.classList.add('border-indigo-500', 'text-gray-900');
            
            navigateTo(page);
        });
    });
};
