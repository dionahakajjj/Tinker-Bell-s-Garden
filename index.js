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
  const modalPrice = document.getElementById("modalPrice");
  const modalImage = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-modal");

  if (modal) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".show-details");
      if (!btn) return;
      e.preventDefault();
      const title = btn.getAttribute("data-title");
      const desc = btn.getAttribute("data-desc");
      const price = btn.getAttribute("data-price") || btn.closest(".card")?.querySelector(".price")?.textContent || "";
      const image = btn.closest(".card")?.querySelector("img")?.src || "";
      const productId = btn.getAttribute("data-product-id");
      const productType = btn.getAttribute("data-product-type") || "static";

      if (title && desc) {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        if (modalPrice) modalPrice.textContent = price;
        if (modalImage) modalImage.src = image;
        modal.setAttribute("data-product-id", productId || "");
        modal.setAttribute("data-product-type", productType);
        modal.setAttribute("data-product-name", title);
        modal.setAttribute("data-product-price", price);
        modal.setAttribute("data-product-image", image);
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

    // Modal Add to Cart button
    const modalAddToCartBtn = document.getElementById("modalAddToCart");
    if (modalAddToCartBtn) {
      modalAddToCartBtn.addEventListener("click", () => {
        const productId = modal.getAttribute("data-product-id");
        const productType = modal.getAttribute("data-product-type") || "static";
        const productName = modal.getAttribute("data-product-name");
        const productPrice = modal.getAttribute("data-product-price");
        const productImage = modal.getAttribute("data-product-image");
        const productDesc = modalDesc?.textContent || "";

        const product = {
          id: productId || null,
          name: productName,
          price: productPrice,
          image: productImage,
          description: productDesc,
          type: productType
        };

        Cart.addItem(product);
        
        // Show feedback
        const originalText = modalAddToCartBtn.textContent;
        modalAddToCartBtn.textContent = "Added to Cart!";
        modalAddToCartBtn.style.background = "#2f9e77";
        setTimeout(() => {
          modalAddToCartBtn.textContent = originalText;
          modalAddToCartBtn.style.background = "";
        }, 1500);
      });
    }
  }

  await loadDynamicFlowerProducts();
  await updateAuthNav();
  initCartButtons();
  addCartIconToHeader();
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
      <div class="card-buttons">
        <button class="pill secondary show-details" 
          data-title="${escapeHtml(name)}" 
          data-desc="${escapeHtml(desc)}"
          data-price="${escapeHtml(price)}"
          data-product-id="${product.id || ''}"
          data-product-type="dynamic">See details</button>
        <button class="pill add-to-cart-btn" 
          data-name="${escapeHtml(name)}"
          data-price="${escapeHtml(price)}"
          data-image="${escapeHtml(imageSrc)}"
          data-description="${escapeHtml(desc)}"
          data-product-id="${product.id || ''}"
          data-product-type="dynamic">Add to Cart</button>
      </div>
    `;

    grid.appendChild(card);
  });
  
  // Attach cart event listeners
  attachCartListeners();
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

// Cart functionality
function initCartButtons() {
  attachCartListeners();
  addCartButtonsToStaticProducts();
}

function attachCartListeners() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
  });
}

function addCartButtonsToStaticProducts() {
  document.querySelectorAll('.card').forEach(card => {
    // Skip if already has cart button
    if (card.querySelector('.add-to-cart-btn')) return;
    
    const nameEl = card.querySelector('h3');
    const priceEl = card.querySelector('.price');
    const imageEl = card.querySelector('img');
    const detailsBtn = card.querySelector('.show-details');
    
    if (nameEl && priceEl) {
      const name = nameEl.textContent.trim();
      const price = priceEl.textContent.trim();
      const image = imageEl?.src || imageEl?.getAttribute('src') || '';
      const desc = detailsBtn?.getAttribute('data-desc') || '';
      
      // Create buttons container if it doesn't exist
      let buttonsContainer = card.querySelector('.card-buttons');
      if (!buttonsContainer) {
        buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'card-buttons';
        if (detailsBtn) {
          detailsBtn.parentNode.insertBefore(buttonsContainer, detailsBtn);
          buttonsContainer.appendChild(detailsBtn);
        } else {
          card.appendChild(buttonsContainer);
        }
      }
      
      // Add cart button
      const cartBtn = document.createElement('button');
      cartBtn.className = 'pill add-to-cart-btn';
      cartBtn.textContent = 'Add to Cart';
      cartBtn.setAttribute('data-name', name);
      cartBtn.setAttribute('data-price', price);
      cartBtn.setAttribute('data-image', image);
      cartBtn.setAttribute('data-description', desc);
      cartBtn.setAttribute('data-product-type', 'static');
      cartBtn.addEventListener('click', handleAddToCart);
      
      buttonsContainer.appendChild(cartBtn);
    }
  });
}

function handleAddToCart(e) {
  const btn = e.target;
  const product = {
    id: btn.getAttribute('data-product-id') || null,
    name: btn.getAttribute('data-name'),
    price: btn.getAttribute('data-price'),
    image: btn.getAttribute('data-image'),
    description: btn.getAttribute('data-description') || '',
    type: btn.getAttribute('data-product-type') || 'static'
  };
  
  Cart.addItem(product);
  
  // Show feedback
  const originalText = btn.textContent;
  btn.textContent = 'Added!';
  btn.style.background = '#2f9e77';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1000);
}

function addCartIconToHeader() {
  const nav = document.querySelector('header nav');
  if (!nav) return;
  
  // Check if cart icon already exists
  if (nav.querySelector('.cart-link')) return;
  
  const cartLi = document.createElement('li');
  cartLi.className = 'cart-link';
  
  const cartLink = document.createElement('a');
  // Calculate relative path to cart based on current location
  const currentPath = window.location.pathname;
  let cartPath = 'cart/index.html';
  
  // If we're in a subdirectory (like flowers/, aboutUs/, etc.), go up one level
  if (currentPath.includes('/flowers/') || currentPath.includes('/aboutUs/') || 
      currentPath.includes('/contact/') || currentPath.includes('/logIn/') || 
      currentPath.includes('/login/') || currentPath.includes('/signUp/') || 
      currentPath.includes('/register/') || currentPath.includes('/cart/')) {
    cartPath = '../cart/index.html';
  }
  
  cartLink.href = cartPath;
  cartLink.className = 'cart-icon-link';
  cartLink.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 8.99 21.1 8.99 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H16.55C17.3 13 17.96 12.59 18.3 11.97L21.88 5.48C22.25 4.82 21.77 4 21 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 18.99 21.1 18.99 20 18.1 18 17 18Z" fill="currentColor"/>
    </svg>
    <span id="cart-badge" class="cart-badge" style="display: none;">0</span>
  `;
  
  cartLi.appendChild(cartLink);
  nav.appendChild(cartLi);
  
  // Initialize cart badge
  Cart.updateCartBadge();
}
