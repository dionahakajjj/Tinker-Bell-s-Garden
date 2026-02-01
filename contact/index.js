document.addEventListener("DOMContentLoaded", () => {
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
        // Submit to API
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("message", message);

        fetch("/api/contact/submit.php", {
          method: "POST",
          body: formData
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert(data.message || "Thank you! Your message was sent successfully.");
              contactForm.reset();
            } else {
              alert(data.error || "Failed to send message. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Contact form submission failed", err);
            alert("Could not reach the server. Please try again later.");
          });
      }
    });
  }
});

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function showError(input, message) {
  const errorSpan = input.parentElement.querySelector(".error");
  if (errorSpan) {
    errorSpan.textContent = message;
    input.style.borderColor = "#c44d1c";
  }
}

function clearErrors(form) {
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.style.borderColor = "";
    const errorSpan = input.parentElement.querySelector(".error");
    if (errorSpan) {
      errorSpan.textContent = "";
    }
  });
}
