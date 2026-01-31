const Auth = {
    login: async (email, password) => {
        try {
            const response = await fetch('../api/auth/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Determine redirect based on role
                if (data.user.role === 'admin') {
                    window.location.href = '../admin/index.html';
                } else {
                    window.location.href = '../flowers/';
                }
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            // It's likely a JSON parse error if the server returned HTML (e.g. fatal error)
            return { success: false, message: 'Login failed. Check console for details. (Likely DB connection error)' };
        }
    },

    logout: async () => {
        // Implement logout logic if needed, or just redirect
        // For now, simple redirect as session destruction should happen on server
        // ideally we would hit a logout endpoint

        // Temporary client-side "logout" (clearing any local storage if we used it)
        window.location.href = '../logIn/index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = loginForm.querySelector('input[name="email"]');
            const passwordInput = loginForm.querySelector('input[name="password"]');
            const errorSpan = loginForm.querySelector('.error'); // Assuming global error or reuse specific field errors

            // Reset errors
            document.querySelectorAll('.error').forEach(el => el.textContent = '');

            const email = emailInput.value;
            const password = passwordInput.value;

            const result = await Auth.login(email, password);

            if (result && !result.success) {
                // Show error message
                // If we have a general error container, use it. 
                // For now, let's alert or find a place to put it.
                // The HTML has .error spans next to inputs, but the API returns a general error.
                // We'll put it in the password error span for visibility
                if (errorSpan) {
                    errorSpan.textContent = result.message;
                } else {
                    // Fallback if structure is different
                    const pwdError = passwordInput.parentElement.querySelector('.error');
                    if (pwdError) pwdError.textContent = result.message;
                    else alert(result.message);
                }
            }
        });
    }
});
