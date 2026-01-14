// Login Page
addRoute('login', () => {
    if (!requireGuest()) return;

    const content = `
        <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900">
                        LaraDesk
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>
                <form id="login-form" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
                    <div class="rounded-md shadow-sm space-y-4">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                            <input id="email" name="email" type="email" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Email address">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <input id="password" name="password" type="password" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Password">
                        </div>
                    </div>

                    <div id="login-error" class="hidden text-red-600 text-sm"></div>

                    <div>
                        <button type="submit" 
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign in
                        </button>
                    </div>

                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Don't have an account? 
                            <a href="#" id="register-link" class="font-medium text-indigo-600 hover:text-indigo-500">
                                Register here
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('main-content').innerHTML = content;
    updateUserUI();

    // Handle form submission
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            showLoading();
            errorDiv.classList.add('hidden');
            
            const response = await api.login({ email, password });
            
            setToken(response.token);
            setUser(response.user);
            
            showToast('Login successful!', 'success');
            navigateTo('dashboard');
        } catch (error) {
            errorDiv.classList.remove('hidden');
            errorDiv.textContent = error.data?.message || 'Invalid credentials';
        } finally {
            hideLoading();
        }
    });

    // Handle register link
    document.getElementById('register-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('register');
    });
});
