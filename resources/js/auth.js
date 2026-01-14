// Auth Helper Functions
window.isAuthenticated = () => {
    return !!getToken() && !!getUser();
};

window.requireAuth = () => {
    if (!isAuthenticated()) {
        navigateTo('login');
        return false;
    }
    return true;
};

window.requireGuest = () => {
    if (isAuthenticated()) {
        navigateTo('dashboard');
        return false;
    }
    return true;
};

window.updateUserUI = () => {
    const user = getUser();
    if (user) {
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        
        // Show users link only for admins
        if (user.role === 'admin') {
            document.getElementById('users-link').classList.remove('hidden');
        } else {
            document.getElementById('users-link').classList.add('hidden');
        }
    } else {
        document.getElementById('navbar').classList.add('hidden');
    }
};

// Logout handler
window.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                showLoading();
                await api.logout();
                removeToken();
                removeUser();
                showToast('Logged out successfully', 'success');
                navigateTo('login');
            } catch (error) {
                showToast('Logout failed', 'error');
            } finally {
                hideLoading();
            }
        });
    }
});
