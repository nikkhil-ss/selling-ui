/* cart.js – Cart page logic */

let cartItems = [];

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

function loadCart() {
  const cart = getCart();
  const products = getProducts();
  cartItems = [];
  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    const variant = product?.variants.find(v => v.id === item.variantId);
    if (product && variant) {
      cartItems.push({ ...item, product, variant });
    }
  });
  renderCart();
}

function renderCart() {
  const emptyEl = document.getElementById('empty-cart');
  const containerEl = document.getElementById('cart-container');
  const itemsEl = document.getElementById('cart-items');
  const summaryEl = document.getElementById('cart-summary');

  if (cartItems.length === 0) {
    emptyEl.classList.remove('hidden');
    containerEl.classList.add('hidden');
    return;
  }
  emptyEl.classList.add('hidden');
  containerEl.classList.remove('hidden');

  itemsEl.innerHTML = cartItems.map(item => `
    <div class="flex gap-4 p-4 bg-card rounded-xl card-shadow animate-fade-in" data-pid="${item.productId}" data-vid="${item.variantId}">
      <a href="./product.html?id=${item.productId}" class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
        <img src="${item.variant.image}" alt="${item.product.name}" class="w-full h-full object-cover"/>
      </a>
      <div class="flex-1 min-w-0">
        <a href="./product.html?id=${item.productId}" class="font-semibold hover:text-primary transition-colors line-clamp-1">${item.product.name}</a>
        <p class="text-sm text-muted-foreground">${item.variant.name}</p>
        <p class="font-semibold text-primary mt-1">${formatPrice(item.variant.price)}</p>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-2">
            <button class="qty-btn p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" data-delta="-1">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span class="w-8 text-center font-medium">${item.quantity}</span>
            <button class="qty-btn p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors" data-delta="1">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <button class="remove-btn p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach events
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('[data-pid]');
      handleQty(card.dataset.pid, card.dataset.vid, parseInt(this.dataset.delta, 10));
    });
  });
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('[data-pid]');
      handleRemove(card.dataset.pid, card.dataset.vid);
    });
  });

  const subtotal = cartItems.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  summaryEl.innerHTML = `
    <div class="bg-card rounded-xl p-6 card-shadow sticky top-20">
      <h2 class="font-semibold text-lg mb-4">Order Summary</h2>
      <div class="space-y-3 text-sm">
        <div class="flex justify-between"><span class="text-muted-foreground">Subtotal (${cartItems.length} items)</span><span class="font-medium">${formatPrice(subtotal)}</span></div>
        <div class="flex justify-between"><span class="text-muted-foreground">Shipping</span><span class="text-primary font-medium">${shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
      </div>
      <div class="border-t my-4"></div>
      <div class="flex justify-between text-lg font-semibold"><span>Total</span><span class="text-primary">${formatPrice(subtotal + shipping)}</span></div>
      <button id="enquiry-btn" class="btn btn-primary btn-lg w-full mt-6 gap-2">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        Send Enquiry via WhatsApp
      </button>
      <p class="text-xs text-muted-foreground text-center mt-3">You'll be redirected to WhatsApp to complete your order</p>
    </div>
  `;
  document.getElementById('enquiry-btn')?.addEventListener('click', handleEnquiry);
}

function handleQty(pid, vid, delta) {
  const item = cartItems.find(i => i.productId === pid && i.variantId === vid);
  if (!item) return;
  const newQty = item.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(pid, vid);
  } else {
    updateCartQuantity(pid, vid, newQty);
  }
  loadCart();
  updateCartBadge();
}

function handleRemove(pid, vid) {
  removeFromCart(pid, vid);
  loadCart();
  updateCartBadge();
  showToast('Removed from cart', 'success');
}

function handleEnquiry() {
  const items = cartItems.map(i => `• ${i.product.name} - ${i.variant.name} (Qty: ${i.quantity}) - ${formatPrice(i.variant.price * i.quantity)}`).join('\n');
  const subtotal = cartItems.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
  const msg = encodeURIComponent(`Hi! I'd like to enquire about these products:\n\n${items}\n\n*Total: ${formatPrice(subtotal)}*\n\nPlease share the availability and further details.`);
  window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
}
