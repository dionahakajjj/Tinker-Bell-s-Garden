document.addEventListener("DOMContentLoaded", async () => {
  // Inject HEADER & FOOTER
  await injectFragment("header", "assets/components/header.html");
  await injectFragment("footer", "assets/components/footer.html");

  // CONTACT FORM VALIDATION
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      clearErrors(contactForm);

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      let valid = true;

      if (name.length < 2) {
        showError(contactForm.name, "Please enter your name (min 2 characters)");
        valid = false;
      }

      if (!isEmail(email)) {
        showError(contactForm.email, "Invalid email address");
        valid = false;
      }

      if (message.length < 10) {
        showError(
          contactForm.message,
          "Message must be at least 10 characters"
        );
        valid = false;
      }

      if (valid) {
        alert("Thank you! Your message was sent.");
        contactForm.reset();
      }
    });
  }
});

/* ===== HELPER FUNCTIONS ===== */

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function showError(input, message) {
  const error = input.closest("label").querySelector(".error");
  error.textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach((err) => {
    err.textContent = "";
  });
  form.querySelectorAll("[aria-invalid]").forEach((el) => {
    el.removeAttribute("aria-invalid");
  });
}

async function injectFragment(selector, path) {
  const host = document.querySelector(selector);
  if (!host) return;

  try {
    const res = await fetch(path);
    if (!res.ok) return;
    host.outerHTML = await res.text();
  } catch (err) {
    console.error("Fragment load failed", err);
  }
}
