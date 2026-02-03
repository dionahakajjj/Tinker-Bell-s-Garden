let productsCache = [];
let newsCache = [];
let adminNavLinks = [];

<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", async () => {
  const user = await Auth.getCurrentUser();
  if (!user || user.role !== "admin") {
    window.location.href = "../logIn/";
    return;
  }

  setupAdminNav();
  setupProductForm();
  setupNewsForm();
  setupTableActions();

  loadUsers();
  loadProducts();
  loadNews();
=======
    // 2. Load Users
    loadUsers();
>>>>>>> cbd71d6ebb307c08dda4ac745bba9a9a3ef1d4ee
});

function setupAdminNav() {
  adminNavLinks = Array.from(
    document.querySelectorAll(".admin-nav a[data-section]")
  );

  adminNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) showSection(section);
    });
  });

  showSection("users");
}

function showSection(sectionKey) {
  const sections = document.querySelectorAll(".admin-section");
  sections.forEach((section) => {
    section.style.display =
      section.id === `section-${sectionKey}` ? "" : "none";
  });

  adminNavLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionKey);
  });
}

/* ===============================
   USERS
   =============================== */
async function loadUsers() {
  try {
    const response = await fetch("/api/admin/get_users.php", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.success) {
      renderUsers(data.users);
    } else {
      console.error("Failed to load users:", data.message);
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

function renderUsers(users) {
  const tbody = document.getElementById("user-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${user.id}</td>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td><span class="role-badge role-${user.role}">${user.role}</span></td>
      <td>${new Date(user.created_at).toLocaleDateString()}</td>
      <td class="actions">
        ${
          user.role !== "admin"
            ? `<button onclick="deleteUser(${user.id}, '${escapeHtml(
                user.name
              )}')">Delete</button>`
            : '<span style="color:#999">N/A</span>'
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteUser(id, name) {
  if (
    !confirm(
      `Are you sure you want to delete user "${name}"? This action cannot be undone.`
    )
  ) {
    return;
  }

  try {
    const response = await fetch("/api/admin/delete_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (data.success) {
      alert("User deleted successfully");
      loadUsers();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    alert("Network error: " + error.message);
  }
}

/* ===============================
   PRODUCTS
   =============================== */
function setupProductForm() {
  const form = document.getElementById("productForm");
  const cancelBtn = document.getElementById("productCancel");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const noteEl = document.getElementById("productFormNote");
    setFormNote(noteEl, "", "");

    const formData = new FormData(form);
    const id = (formData.get("id") || "").toString().trim();
    const endpoint = id ? "/api/products/update.php" : "/api/products/create.php";
    if (!id) formData.delete("id");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setFormNote(
          noteEl,
          id ? "Product updated successfully." : "Product created successfully.",
          "success"
        );
        resetProductForm();
        loadProducts();
      } else {
        setFormNote(noteEl, data.error || "Failed to save product.", "error");
      }
    } catch (error) {
      setFormNote(noteEl, "Network error while saving product.", "error");
      console.error("Product save failed:", error);
    }
  });

<<<<<<< HEAD
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      resetProductForm();
    });
  }
}

async function loadProducts() {
  try {
    const response = await fetch("/api/products/get_all.php", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.success) {
      renderProducts(data.products || []);
    } else {
      console.error("Failed to load products:", data.message);
    }
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function renderProducts(products) {
  productsCache = Array.isArray(products) ? products : [];
  const tbody = document.getElementById("product-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  productsCache.forEach((product) => {
    const tr = document.createElement("tr");
    const desc = truncate(product.description || "", 80);
    const priceNum = Number(product.price);
    const price = Number.isFinite(priceNum) ? priceNum.toFixed(2) : "";
    const imageLink = product.image
      ? `<a href="/${escapeHtml(product.image)}" target="_blank" rel="noopener">View</a>`
      : "-";
    const pdfLink = product.pdf_file
      ? `<a href="/${escapeHtml(product.pdf_file)}" target="_blank" rel="noopener">View</a>`
      : "-";
    const updated = formatDate(product.updated_at || product.created_at);

    tr.innerHTML = `
      <td>#${product.id}</td>
      <td>${escapeHtml(product.name || "")}</td>
      <td>${escapeHtml(desc)}</td>
      <td>${price}</td>
      <td>${imageLink}</td>
      <td>${pdfLink}</td>
      <td>${updated}</td>
      <td>
        <button class="btn-edit" data-action="edit-product" data-id="${product.id}">
          Edit
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function startProductEdit(product) {
  const form = document.getElementById("productForm");
  if (!form) return;

  form.querySelector('[name="id"]').value = product.id || "";
  form.querySelector('[name="name"]').value = product.name || "";
  form.querySelector('[name="price"]').value =
    product.price !== null && product.price !== undefined ? product.price : "";
  form.querySelector('[name="description"]').value =
    product.description || "";

  const titleEl = document.getElementById("productFormTitle");
  if (titleEl) titleEl.textContent = "Edit product";

  const noteEl = document.getElementById("productFormNote");
  setFormNote(noteEl, `Editing product #${product.id}`, "success");

  showSection("products");
}

function resetProductForm() {
  const form = document.getElementById("productForm");
  if (!form) return;
  form.reset();
  form.querySelector('[name="id"]').value = "";

  const titleEl = document.getElementById("productFormTitle");
  if (titleEl) titleEl.textContent = "Create product";

  const noteEl = document.getElementById("productFormNote");
  setFormNote(noteEl, "", "");
}

/* ===============================
   NEWS
   =============================== */
function setupNewsForm() {
  const form = document.getElementById("newsForm");
  const cancelBtn = document.getElementById("newsCancel");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const noteEl = document.getElementById("newsFormNote");
    setFormNote(noteEl, "", "");

    const formData = new FormData(form);
    const id = (formData.get("id") || "").toString().trim();
    const endpoint = id ? "/api/news/update.php" : "/api/news/create.php";
    if (!id) formData.delete("id");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setFormNote(
          noteEl,
          id ? "News updated successfully." : "News created successfully.",
          "success"
        );
        resetNewsForm();
        loadNews();
      } else {
        setFormNote(noteEl, data.error || "Failed to save news.", "error");
      }
    } catch (error) {
      setFormNote(noteEl, "Network error while saving news.", "error");
      console.error("News save failed:", error);
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      resetNewsForm();
    });
  }
}

async function loadNews() {
  try {
    const response = await fetch("/api/news/get_all.php", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.success) {
      renderNews(data.news || []);
    } else {
      console.error("Failed to load news:", data.message);
    }
  } catch (error) {
    console.error("Error loading news:", error);
  }
}

function renderNews(items) {
  newsCache = Array.isArray(items) ? items : [];
  const tbody = document.getElementById("news-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  newsCache.forEach((item) => {
    const tr = document.createElement("tr");
    const content = truncate(item.content || "", 90);
    const imageLink = item.image
      ? `<a href="/${escapeHtml(item.image)}" target="_blank" rel="noopener">View</a>`
      : "-";
    const pdfLink = item.pdf_file
      ? `<a href="/${escapeHtml(item.pdf_file)}" target="_blank" rel="noopener">View</a>`
      : "-";
    const updated = formatDate(item.updated_at || item.created_at);

    tr.innerHTML = `
      <td>#${item.id}</td>
      <td>${escapeHtml(item.title || "")}</td>
      <td>${escapeHtml(content)}</td>
      <td>${imageLink}</td>
      <td>${pdfLink}</td>
      <td>${updated}</td>
      <td>
        <button class="btn-edit" data-action="edit-news" data-id="${item.id}">
          Edit
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function startNewsEdit(item) {
  const form = document.getElementById("newsForm");
  if (!form) return;

  form.querySelector('[name="id"]').value = item.id || "";
  form.querySelector('[name="title"]').value = item.title || "";
  form.querySelector('[name="content"]').value = item.content || "";

  const titleEl = document.getElementById("newsFormTitle");
  if (titleEl) titleEl.textContent = "Edit news";

  const noteEl = document.getElementById("newsFormNote");
  setFormNote(noteEl, `Editing news #${item.id}`, "success");

  showSection("news");
}

function resetNewsForm() {
  const form = document.getElementById("newsForm");
  if (!form) return;
  form.reset();
  form.querySelector('[name="id"]').value = "";

  const titleEl = document.getElementById("newsFormTitle");
  if (titleEl) titleEl.textContent = "Create news";

  const noteEl = document.getElementById("newsFormNote");
  setFormNote(noteEl, "", "");
}

/* ===============================
   TABLE ACTIONS
   =============================== */
function setupTableActions() {
  const productsTable = document.getElementById("productsTable");
  if (productsTable) {
    productsTable.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="edit-product"]');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const product = productsCache.find((item) => Number(item.id) === id);
      if (product) startProductEdit(product);
    });
  }

  const newsTable = document.getElementById("newsTable");
  if (newsTable) {
    newsTable.addEventListener("click", (e) => {
      const btn = e.target.closest('[data-action="edit-news"]');
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const item = newsCache.find((entry) => Number(entry.id) === id);
      if (item) startNewsEdit(item);
    });
  }
}

/* ===============================
   HELPERS
   =============================== */
function truncate(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

function setFormNote(el, message, type) {
  if (!el) return;
  el.textContent = message || "";
  el.classList.remove("success", "error");
  if (type) el.classList.add(type);
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
=======
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
>>>>>>> cbd71d6ebb307c08dda4ac745bba9a9a3ef1d4ee
}
