const Auth = {
<<<<<<< HEAD
  getCurrentUser: async () => {
    try {
      const response = await fetch("/backend-db/current_user.php", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) return null;
=======
    login: async (email, password) => {
        try {
            // POST to the server-side login endpoint used in this project
            const response = await fetch('/backend-db/login.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ email, password })
            });

            // Try to parse JSON; if server returned HTML (error page), surface it in console
            let data;
            const ct = response.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Login endpoint returned non-JSON response:\n', text);
                return { success: false, message: 'Login failed: server returned an error (see console).' };
            }
>>>>>>> cbd71d6ebb307c08dda4ac745bba9a9a3ef1d4ee

      const data = await response.json();
      if (data && data.success && data.user) return data.user;
    } catch (error) {
      console.error("Current user check failed:", error);
    }
    return null;
  },

  login: async (email, password) => {
    try {
      // POST to the server-side login endpoint used in this project
      const response = await fetch("/backend-db/login.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email, password }),
      });

      // Try to parse JSON; if server returned HTML (error page), surface it in console
      let data;
      const ct = response.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Login endpoint returned non-JSON response:\n", text);
        return {
          success: false,
          message: "Login failed: server returned an error (see console).",
        };
      }

      if (data.success) {
        // Determine redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "../admin/index.html";
        } else {
          window.location.href = "../flowers/";
        }
      } else {
        return {
          success: false,
          message: data.message || data.error || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      // It's likely a JSON parse error if the server returned HTML (e.g. fatal error)
      return {
        success: false,
        message:
          "Login failed. Check console for details. (Likely DB connection error)",
      };
    }
  },

  logout: async () => {
    try {
      await fetch("/backend-db/logout.php", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/logIn/index.html";
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = loginForm.querySelector('input[name="email"]');
      const passwordInput = loginForm.querySelector('input[name="password"]');
      const errorSpan = loginForm.querySelector(".error"); // Assuming global error or reuse specific field errors

      // Reset errors
      document
        .querySelectorAll(".error")
        .forEach((el) => (el.textContent = ""));

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
          const pwdError = passwordInput.parentElement.querySelector(".error");
          if (pwdError) pwdError.textContent = result.message;
          else alert(result.message);
        }
      }
    });
  }
});
