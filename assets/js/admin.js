document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verify access immediately
    const user = await Auth.getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = '../logIn/';
        return;
    }

    // 2. Load Users
    loadUsers();
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
