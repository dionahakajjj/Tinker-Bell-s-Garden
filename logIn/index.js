document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(loginForm);

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      let valid = true;

      // Validimi i email
      if (!isEmail(email)) {
        showError(loginForm.email, "Enter a valid email");
        valid = false;
      }

      // Validimi i password
      if (password.length < 6) {
        showError(loginForm.password, "Password must be at least 6 characters");
        valid = false;
      }

      if (valid) {
        alert("Login demo successful ✅ (plug backend later)");
        loginForm.reset();
      }
    });
  }
});

// Funksion ndihmës për validimin e email
function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

// Funksion për shfaqjen e gabimeve
function showError(input, message) {
  const error = input.closest("label")?.querySelector(".error");
  if (error) {
    error.textContent = message;
  }
  input.setAttribute("aria-invalid", "true");
}

// Funksion për pastrimin e gabimeve
function clearErrors(form) {
  form.querySelectorAll(".error").forEach((err) => (err.textContent = ""));
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
}
