document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors(registerForm);

      const name = registerForm.name.value.trim();
      const email = registerForm.email.value.trim();
      const password = registerForm.password.value.trim();
      const confirm = registerForm.confirm.value.trim();

      let valid = true;

      if (name.length < 2) {
        showError(registerForm.name, "Name must be at least 2 characters");
        valid = false;
      }

      if (!isEmail(email)) {
        showError(registerForm.email, "Invalid email");
        valid = false;
      }

      if (password.length < 6) {
        showError(
          registerForm.password,
          "Password must be at least 6 characters"
        );
        valid = false;
      }

      if (password !== confirm) {
        showError(registerForm.confirm, "Passwords do not match");
        valid = false;
      }

      if (valid) {
        // POST to the PHP endpoint that lives in backend-db
        fetch("/backend-db/register.php", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ name, email, password, confirm })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              alert(data.error);
            } else {
              alert("Signup successful ✅");
              registerForm.reset();
              // redirect to login so the user can sign in
              window.location.href = "/login/";
            }
          })
          .catch((err) => {
            console.error("Register request failed", err);
            alert("Could not reach the server. Make sure PHP is running and the endpoint is available.");
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
  form
    .querySelectorAll("[aria-invalid]")
    .forEach((el) => el.removeAttribute("aria-invalid"));
}
