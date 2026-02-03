document.addEventListener("DOMContentLoaded", async () => {
  // Mobile menu toggle
  const navToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector("nav ul");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open");
    });
  }

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

  // Modal Logic
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeBtn = document.querySelector(".close-modal");

  if (modal) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".show-details");
      if (!btn) return;
      e.preventDefault();
      const title = btn.getAttribute("data-title");
      const desc = btn.getAttribute("data-desc");

      if (title && desc) {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modal.style.display = "block";
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  await loadDynamicFlowerProducts();
  await updateAuthNav();
});

async function updateAuthNav() {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  let user = null;
  try {
    const response = await fetch("/backend-db/current_user.php", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.user) {
        user = data.user;
      }
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }

  const authLinks = nav.querySelectorAll(
    'a[href*="logIn"], a[href*="login"], a[href*="register"], a[href*="signUp"]'
  );
  authLinks.forEach((link) => {
    const li = link.closest("li");
    if (li) li.style.display = user ? "none" : "";
  });

  const existingUser = nav.querySelector('li[data-auth-user="true"]');
  const existingLogout = nav.querySelector('li[data-auth-logout="true"]');

  if (user) {
    const displayName = user.name || user.email || "Account";

    if (existingUser) {
      existingUser.textContent = `Hi, ${displayName}`;
      existingUser.classList.add("nav-user");
    } else {
      const li = document.createElement("li");
      li.dataset.authUser = "true";
      li.className = "nav-user";
      li.textContent = `Hi, ${displayName}`;
      nav.appendChild(li);
    }

    if (!existingLogout) {
      const li = document.createElement("li");
      li.dataset.authLogout = "true";

      const logoutLink = document.createElement("a");
      logoutLink.href = "#";
      logoutLink.className = "nav-logout";
      logoutLink.textContent = "Logout";
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        await logoutUser();
      });

      li.appendChild(logoutLink);
      nav.appendChild(li);
    }
  } else {
    if (existingUser) existingUser.remove();
    if (existingLogout) existingLogout.remove();
  }
}

async function logoutUser() {
  try {
    await fetch("/backend-db/logout.php", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    window.location.href = "/logIn/index.html";
  }
}

async function loadDynamicFlowerProducts() {
  const grid = document.getElementById("dynamicProductsGrid");
  if (!grid) return;

  grid.innerHTML = '<div class="card"><p>Loading new products...</p></div>';

  const existingNames = new Set(
    Array.from(
      document.querySelectorAll("#staticProductsGrid h3")
    )
      .map((el) => el.textContent.trim().toLowerCase())
      .filter(Boolean)
  );

  try {
    const response = await fetch("/api/products/get_all.php");
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to load products.");
    }

    const items = Array.isArray(data.products) ? data.products : [];
    const newItems = items.filter((item) => {
      const name = (item.name || "").trim().toLowerCase();
      return name && !existingNames.has(name);
    });

    renderDynamicProducts(grid, newItems);
  } catch (error) {
    console.error("Dynamic products load failed:", error);
    grid.innerHTML = '<div class="card"><p>No new products available.</p></div>';
  }
}

function renderDynamicProducts(grid, products) {
  if (!products.length) {
    grid.innerHTML = '<div class="card"><p>No new products available.</p></div>';
    return;
  }

  grid.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card";

    const name = product.name || "Product";
    const desc = product.description || "";
    const shortDesc = truncate(desc, 110);
    const priceValue = Number(product.price);
    const price = Number.isFinite(priceValue)
      ? `EUR ${priceValue.toFixed(2)}`
      : "";

    let imageSrc = "assets/js/images/Emerald Bouquet.jpg";
    if (product.image) {
      imageSrc = product.image.startsWith("/")
        ? product.image
        : `/${product.image}`;
    }

    card.innerHTML = `
      <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(
      name
    )}" loading="lazy" />
      <h3>${escapeHtml(name)}</h3>
      <p>${escapeHtml(shortDesc)}</p>
      ${price ? `<span class="price">${escapeHtml(price)}</span>` : ""}
      <button class="pill secondary show-details" data-title="${escapeHtml(
        name
      )}" data-desc="${escapeHtml(desc)}">See details</button>
    `;

    grid.appendChild(card);
  });
}

function truncate(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
