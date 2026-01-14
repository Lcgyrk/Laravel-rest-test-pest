// API Configuration and Helper Functions
const API_BASE_URL = '/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('auth_token');

// Set auth token
const setToken = (token) => localStorage.setItem('auth_token', token);

// Remove auth token
const removeToken = () => localStorage.removeItem('auth_token');

// Get current user
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Set current user
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Remove current user
const removeUser = () => localStorage.removeItem('user');

// Show loading spinner
const showLoading = () => {
    document.getElementById('loading').classList.remove('hidden');
};

// Hide loading spinner
const hideLoading = () => {
    document.getElementById('loading').classList.add('hidden');
};

// Show toast notification
const showToast = (message, type = 'success') => {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    
    // Set background color based on type
    if (type === 'success') {
        toast.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 bg-green-500';
    } else if (type === 'error') {
        toast.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 bg-red-500';
    } else if (type === 'info') {
        toast.className = 'fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 bg-blue-500';
    }
    
    toast.classList.remove('hidden');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
};

// API Request Helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw { status: response.status, data };
        }

        return data;
    } catch (error) {
        if (error.status === 401) {
            // Unauthorized - redirect to login
            removeToken();
            removeUser();
            window.navigateTo('login');
        }
        throw error;
    }
};

// Export API methods
window.api = {
    // Auth
    register: (data) => apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    login: (data) => apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    logout: () => apiRequest('/logout', {
        method: 'POST',
    }),
    
    getUser: () => apiRequest('/user'),
    
    // Tickets
    getTickets: () => apiRequest('/tickets'),
    
    getTicket: (id) => apiRequest(`/tickets/${id}`),
    
    createTicket: (data) => apiRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    updateTicket: (id, data) => apiRequest(`/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    deleteTicket: (id) => apiRequest(`/tickets/${id}`, {
        method: 'DELETE',
    }),
    
    // Users
    getUsers: () => apiRequest('/users'),
    
    createUser: (data) => apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    deleteUser: (id) => apiRequest(`/users/${id}`, {
        method: 'DELETE',
    }),
};

// Export helper functions
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.getUser = getUser;
window.setUser = setUser;
window.removeUser = removeUser;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;
