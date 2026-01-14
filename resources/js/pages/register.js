// Register Page
addRoute('register', () => {
    if (!requireGuest()) return;

    const content = `
        <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <h2 class="mt-6 text-center text-4xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                        Join LaraDesk today
                    </p>
                </div>
                <form id="register-form" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
                    <div class="rounded-md shadow-sm space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                            <input id="name" name="name" type="text" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="John Doe">
                        </div>
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
                                placeholder="Password (min 6 characters)">
                        </div>
                        <div>
                            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input id="password_confirmation" name="password_confirmation" type="password" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Confirm Password">
                        </div>
                    </div>

                    <div id="register-error" class="hidden text-red-600 text-sm"></div>

                    <div>
                        <button type="submit" 
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Register
                        </button>
                    </div>

                    <div class="text-center">
                        <p class="text-sm text-gray-600">
                            Already have an account? 
                            <a href="#" id="login-link" class="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in here
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
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const password_confirmation = document.getElementById('password_confirmation').value;
        const errorDiv = document.getElementById('register-error');

        try {
            showLoading();
            errorDiv.classList.add('hidden');
            
            const response = await api.register({ name, email, password, password_confirmation });
            
            setToken(response.token);
            setUser(response.user);
            
            showToast('Registration successful!', 'success');
            navigateTo('dashboard');
        } catch (error) {
            errorDiv.classList.remove('hidden');
            if (error.data?.errors) {
                const errors = Object.values(error.data.errors).flat();
                errorDiv.innerHTML = errors.map(err => `<p>${err}</p>`).join('');
            } else {
                errorDiv.textContent = error.data?.message || 'Registration failed';
            }
        } finally {
            hideLoading();
        }
    });

    // Handle login link
    document.getElementById('login-link').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('login');
    });
});
