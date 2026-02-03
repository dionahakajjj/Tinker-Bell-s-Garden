document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  
  // Clear cart button
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your cart?')) {
        Cart.clear();
        renderCart();
      }
    });
  }

  // Checkout button (fake)
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('This is a demo. Checkout functionality is not implemented.');
    });
  }
});

function renderCart() {
  const items = Cart.getItems();
  const itemsList = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const badgeHeader = document.getElementById('cart-badge');

  // Update header badge
  if (badgeHeader) {
    const count = Cart.getTotalItems();
    badgeHeader.textContent = count;
    badgeHeader.style.display = count > 0 ? 'flex' : 'none';
  }
  
  // Also update any other cart badges on the page
  Cart.updateCartBadge();

  if (items.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';
  if (checkoutBtn) checkoutBtn.disabled = false;

  // Render items
  if (itemsList) {
    itemsList.innerHTML = items.map(item => {
      const price = Cart.parsePrice(item.price);
      const imageSrc = item.image || '../assets/js/images/Emerald Bouquet.jpg';
      
      return `
        <div class="cart-item" data-id="${item.id}" data-type="${item.type}">
          <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(item.name)}" class="cart-item-image" />
          <div class="cart-item-details">
            <h3>${escapeHtml(item.name)}</h3>
            ${item.description ? `<p>${escapeHtml(item.description.substring(0, 100))}${item.description.length > 100 ? '...' : ''}</p>` : ''}
            <div class="cart-item-price">${formatPrice(price)}</div>
            <div class="cart-item-controls">
              <div class="quantity-controls">
                <button onclick="updateQuantity('${item.id}', '${item.type}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', '${item.type}', ${item.quantity + 1})">+</button>
              </div>
              <button class="remove-item-btn" onclick="removeItem('${item.id}', '${item.type}')">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Update totals
  const subtotal = Cart.getTotalPrice();
  const total = subtotal; // No shipping for now
  
  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(subtotal);
  }
  if (totalEl) {
    totalEl.textContent = formatPrice(total);
  }
}

function updateQuantity(id, type, quantity) {
  Cart.updateQuantity(id, type, quantity);
  renderCart();
}

function removeItem(id, type) {
  if (confirm('Remove this item from cart?')) {
    Cart.removeItem(id, type);
    renderCart();
  }
}

function formatPrice(price) {
  return `€${price.toFixed(2)}`;
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
