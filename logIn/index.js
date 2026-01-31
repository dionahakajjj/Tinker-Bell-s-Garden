document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      let valid = true;

      if (!isEmail(email)) {
        showError(loginForm.email, "Enter a valid email");
        valid = false;
      }

      if (password.length < 6) {
        showError(loginForm.password, "Password must be at least 6 characters");
        valid = false;
      }

      if (valid) {
        // Send credentials to PHP login endpoint
        fetch("/backend-db/login.php", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email, password })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              // show generic message or specific one from backend
              alert(data.error || "Login failed");
            } else {
              // success — backend created session cookie
              window.location.href = "/";
            }
          })
          .catch((err) => {
            console.error("Login request failed", err);
            alert("Could not reach the server. Make sure PHP is running and login endpoint is available.");
          });

      }
    });
  }
});

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function showError(input, message) {
  const error = input.closest("label")?.querySelector(".error");
  if (error) {
    error.textContent = message;
  }
  input.setAttribute("aria-invalid", "true");
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach((err) => (err.textContent = ""));
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
}
