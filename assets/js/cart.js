// Cart Management System using localStorage
const Cart = {
  // Get all items from cart
  getItems() {
    try {
      const items = localStorage.getItem('cart');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  },

  // Add item to cart
  addItem(product) {
    const items = this.getItems();
    const existingItem = items.find(item => item.id === product.id && item.type === product.type);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        id: product.id || this.generateId(product),
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || '',
        quantity: 1,
        type: product.type || 'static' // 'static' or 'dynamic'
      });
    }
    
    this.saveItems(items);
    this.updateCartBadge();
    return items;
  },

  // Remove item from cart
  removeItem(itemId, type) {
    const items = this.getItems();
    const filtered = items.filter(item => !(item.id === itemId && item.type === type));
    this.saveItems(filtered);
    this.updateCartBadge();
    return filtered;
  },

  // Update item quantity
  updateQuantity(itemId, type, quantity) {
    if (quantity <= 0) {
      return this.removeItem(itemId, type);
    }
    
    const items = this.getItems();
    const item = items.find(i => i.id === itemId && i.type === type);
    if (item) {
      item.quantity = quantity;
      this.saveItems(items);
      this.updateCartBadge();
    }
    return items;
  },

  // Clear entire cart
  clear() {
    localStorage.removeItem('cart');
    this.updateCartBadge();
  },

  // Get total items count
  getTotalItems() {
    const items = this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total price
  getTotalPrice() {
    const items = this.getItems();
    return items.reduce((total, item) => {
      const price = this.parsePrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  },

  // Parse price string to number
  parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    // Remove EUR, €, and other non-numeric chars except decimal point
    const cleaned = priceStr.toString().replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  },

  // Save items to localStorage
  saveItems(items) {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  // Generate ID for static products
  generateId(product) {
    return `static_${product.name.toLowerCase().replace(/\s+/g, '_')}`;
  },

  // Update cart badge in header
  updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = this.getTotalItems();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'block' : 'none';
    }
  },

  // Initialize cart badge on page load
  init() {
    this.updateCartBadge();
  }
};

// Initialize cart when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Cart.init());
} else {
  Cart.init();
}
