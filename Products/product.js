document.addEventListener("DOMContentLoaded", async () => {
  // Inject header & footer
  await injectFragment("header", "assets/components/header.html");
  await injectFragment("footer", "assets/components/footer.html");
  highlightActiveNav();

  // Mobile menu toggle (header)
  const navToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector("nav ul");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }
});

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

function highlightActiveNav() {
  const links = document.querySelectorAll("nav a");
  const current = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((a) => {
    if (a.getAttribute("href").includes(current)) {
      a.classList.add("active");
    }
  });
}
