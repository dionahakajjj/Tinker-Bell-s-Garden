document.addEventListener("DOMContentLoaded", async () => {
  // Inject header & footer (shared components)
  await injectFragment("header", "assets/components/header.html");
  await injectFragment("footer", "assets/components/footer.html");

  // Highlight active nav link (Home)
  highlightActiveNav();

  // Mobile menu toggle
  const navToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector("nav ul");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }

  // 🔁 Home slider
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    let current = 0;
    slides[current].classList.add("active");

    setInterval(() => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 4200);
  }
});

/* =====================
   HELPERS (Home)
===================== */

// Load header/footer
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

// Mark active navbar link
function highlightActiveNav() {
  const links = document.querySelectorAll("nav a");
  const current = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}
