document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify access immediately
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = '../logIn/';
        return;
    }

    // 2. Load Users
    loadUsers();
    
    // Set up section navigation
    setupSectionNavigation();
});

async function loadUsers() {
    try {
        const response = await fetch('../api/admin/get_users.php');
        const data = await response.json();

        if (data.success) {
            renderUsers(data.users);
        } else {
            console.error('Failed to load users:', data.message);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('user-table-body');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${user.id}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td class="actions">
                ${user.role !== 'admin' ?
                `<button onclick="deleteUser(${user.id}, '${escapeHtml(user.name)}')">Delete</button>` :
                '<span style="color:#999">N/A</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteUser(id, name) {
    if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
        return;
    }

    try {
        const response = await fetch('../api/admin/delete_user.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        const data = await response.json();

        if (data.success) {
            alert('User deleted successfully');
            loadUsers(); // Reload list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Section Navigation
function setupSectionNavigation() {
    const links = document.querySelectorAll('.sidebar a[data-section]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active link
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.sidebar a[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Load data for the section
    switch(sectionName) {
        case 'users':
            loadUsers();
            break;
        case 'contacts':
            loadContactSubmissions();
            break;
        case 'news':
            loadNews();
            break;
        case 'products':
            loadProducts();
            break;
    }
}

// Contact Submissions
async function loadContactSubmissions() {
    try {
        const response = await fetch('../api/admin/get_contact_submissions.php');
        const data = await response.json();

        if (data.success) {
            renderContactSubmissions(data.submissions);
        } else {
            console.error('Failed to load contact submissions:', data.message);
        }
    } catch (error) {
        console.error('Error loading contact submissions:', error);
    }
}

function renderContactSubmissions(submissions) {
    const tbody = document.getElementById('contact-table-body');
    tbody.innerHTML = '';

    if (submissions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No contact submissions yet</td></tr>';
        return;
    }

    submissions.forEach(submission => {
        const tr = document.createElement('tr');
        const messagePreview = submission.message.length > 100 
            ? escapeHtml(submission.message.substring(0, 100)) + '...' 
            : escapeHtml(submission.message);
        tr.innerHTML = `
            <td>#${submission.id}</td>
            <td>${escapeHtml(submission.name)}</td>
            <td>${escapeHtml(submission.email)}</td>
            <td>${messagePreview}</td>
            <td>${new Date(submission.created_at).toLocaleString()}</td>
            <td><span class="read-badge read-${submission.read ? 'true' : 'false'}">${submission.read ? 'Read' : 'Unread'}</span></td>
            <td class="actions">
                <button onclick="toggleContactRead(${submission.id}, ${submission.read ? 0 : 1})">
                    ${submission.read ? 'Mark Unread' : 'Mark Read'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function toggleContactRead(id, read) {
    try {
        const response = await fetch('../api/admin/mark_contact_read.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, read })
        });

        const data = await response.json();

        if (data.success) {
            loadContactSubmissions();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

// News Management
async function loadNews() {
    try {
        const response = await fetch('../api/news/get_all.php');
        const data = await response.json();

        if (data.success) {
            renderNews(data.news);
        } else {
            console.error('Failed to load news:', data.message);
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

function renderNews(news) {
    const tbody = document.getElementById('news-table-body');
    tbody.innerHTML = '';

    if (news.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">No news articles yet</td></tr>';
        return;
    }

    news.forEach(item => {
        const tr = document.createElement('tr');
        const contentPreview = item.content.length > 50 
            ? escapeHtml(item.content.substring(0, 50)) + '...' 
            : escapeHtml(item.content);
        tr.innerHTML = `
            <td>#${item.id}</td>
            <td>${escapeHtml(item.title)}</td>
            <td>${contentPreview}</td>
            <td>${item.image ? `<img src="../${item.image}" style="max-width: 50px; height: auto;" />` : 'No image'}</td>
            <td>${item.pdf_file ? `<a href="../${item.pdf_file}" target="_blank">View PDF</a>` : 'No PDF'}</td>
            <td>${escapeHtml(item.created_by_name || 'Unknown')} (${escapeHtml(item.created_by_email || '')})</td>
            <td>${item.updated_by_name ? escapeHtml(item.updated_by_name) + ' (' + escapeHtml(item.updated_by_email) + ')' : 'Never'}</td>
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td class="actions">
                <button onclick="editNews(${item.id})">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Products Management
async function loadProducts() {
    try {
        const response = await fetch('../api/products/get_all.php');
        const data = await response.json();

        if (data.success) {
            renderProducts(data.products);
        } else {
            console.error('Failed to load products:', data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts(products) {
    const tbody = document.getElementById('product-table-body');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 2rem;">No products yet</td></tr>';
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        const descPreview = product.description.length > 50 
            ? escapeHtml(product.description.substring(0, 50)) + '...' 
            : escapeHtml(product.description);
        tr.innerHTML = `
            <td>#${product.id}</td>
            <td>${escapeHtml(product.name)}</td>
            <td>${descPreview}</td>
            <td>${product.price ? '€' + parseFloat(product.price).toFixed(2) : 'N/A'}</td>
            <td>${product.image ? `<img src="../${product.image}" style="max-width: 50px; height: auto;" />` : 'No image'}</td>
            <td>${product.pdf_file ? `<a href="../${product.pdf_file}" target="_blank">View PDF</a>` : 'No PDF'}</td>
            <td>${escapeHtml(product.created_by_name || 'Unknown')} (${escapeHtml(product.created_by_email || '')})</td>
            <td>${product.updated_by_name ? escapeHtml(product.updated_by_name) + ' (' + escapeHtml(product.updated_by_email) + ')' : 'Never'}</td>
            <td>${new Date(product.created_at).toLocaleDateString()}</td>
            <td class="actions">
                <button onclick="editProduct(${product.id})">Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Form modals (placeholder functions - can be expanded)
function showNewsForm() {
    alert('News creation form - to be implemented with file upload support');
}

function showProductForm() {
    alert('Product creation form - to be implemented with file upload support');
}

function editNews(id) {
    alert('Edit news #' + id + ' - to be implemented');
}

function editProduct(id) {
    alert('Edit product #' + id + ' - to be implemented');
}
