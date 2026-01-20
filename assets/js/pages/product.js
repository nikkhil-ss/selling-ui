/* product.js – Product detail page */

let product = null;
let selectedVariant = null;

// Zoom state
let scale = 1;
let position = { x: 0, y: 0 };
let isDragging = false;
let startPos = { x: 0, y: 0 };
let lastPos = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const products = getProducts();
  product = products.find(p => p.id === id);

  if (!product) {
    document.getElementById('product-not-found').classList.remove('hidden');
    return;
  }
  selectedVariant = product.variants[0];
  renderProductContent();
  setupZoom();
});

document.getElementById('back-btn')?.addEventListener('click', () => {
  if (document.referrer) {
    history.back();
  } else {
    window.location.href = './products.html';
  }
});

function renderProductContent() {
  const content = document.getElementById('product-content');
  if (!content || !product) return;
  content.innerHTML = `
    <!-- Images -->
    <div class="space-y-4">
      <div id="main-image-container" class="relative cursor-zoom-in overflow-hidden rounded-xl aspect-square bg-secondary">
        <img id="main-image" src="${selectedVariant.image}" alt="${product.name} - ${selectedVariant.name}" class="w-full h-full object-cover"/>
        <div class="absolute bottom-2 right-2 bg-foreground/80 text-background rounded-full p-1.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-2">
        ${product.variants.map(v => `
          <button data-vid="${v.id}" class="variant-thumb aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedVariant.id === v.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'}">
            <img src="${v.image}" alt="${v.name}" class="w-full h-full object-cover"/>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Info -->
    <div class="space-y-6">
      <div>
        <span class="text-sm font-medium text-accent uppercase tracking-wide">${product.category}</span>
        <h1 class="text-2xl md:text-3xl font-bold mt-1">${product.name}</h1>
        <p id="variant-price" class="text-2xl font-bold text-primary mt-2">${formatPrice(selectedVariant.price)}</p>
      </div>
      <p class="text-muted-foreground leading-relaxed">${product.description}</p>

      <div>
        <h3 class="font-semibold mb-3">Select Variant</h3>
        <div class="flex flex-wrap gap-2" id="variant-buttons">
          ${product.variants.map(v => `
            <button data-vid="${v.id}" class="variant-btn px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${selectedVariant.id === v.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}">
              ${selectedVariant.id === v.id ? '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              ${v.name}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-4">
        <button id="add-to-cart-btn" class="btn btn-primary btn-lg flex-1 gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/><path d="M2 2h3l3.6 7.59a2 2 0 0 0 1.7 1.17h7.9a2 2 0 0 0 1.94-1.5l1.3-5.16H6"/></svg>
          Add to Cart
        </button>
        <button id="enquiry-btn" class="btn btn-outline btn-lg flex-1 gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Send Enquiry
        </button>
      </div>

      <div class="border-t pt-6 space-y-3 text-sm">
        <div class="flex items-center gap-2"><svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Free shipping on orders above ₹2,000</span></div>
        <div class="flex items-center gap-2"><svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>7-day easy returns</span></div>
        <div class="flex items-center gap-2"><svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span>Authenticity guaranteed</span></div>
      </div>
    </div>
  `;

  // Attach events
  document.querySelectorAll('.variant-thumb').forEach(btn => {
    btn.addEventListener('click', () => selectVariant(btn.dataset.vid));
  });
  document.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => selectVariant(btn.dataset.vid));
  });
  document.getElementById('add-to-cart-btn')?.addEventListener('click', handleAddToCart);
  document.getElementById('enquiry-btn')?.addEventListener('click', handleEnquiry);
  document.getElementById('main-image-container')?.addEventListener('click', openOverlay);
}

function selectVariant(vid) {
  selectedVariant = product.variants.find(v => v.id === vid);
  if (!selectedVariant) return;
  document.getElementById('main-image').src = selectedVariant.image;
  document.getElementById('variant-price').textContent = formatPrice(selectedVariant.price);
  // update thumb selection
  document.querySelectorAll('.variant-thumb').forEach(btn => {
    const isActive = btn.dataset.vid === vid;
    btn.className = `variant-thumb aspect-square rounded-lg overflow-hidden border-2 transition-all ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'}`;
  });
  // update variant buttons
  document.querySelectorAll('.variant-btn').forEach(btn => {
    const isActive = btn.dataset.vid === vid;
    const v = product.variants.find(x => x.id === btn.dataset.vid);
    btn.className = `variant-btn px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${isActive ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`;
    btn.innerHTML = (isActive ? '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' : '') + v.name;
  });
}

function handleAddToCart() {
  if (!selectedVariant) return;
  addToCart(product.id, selectedVariant.id);
  updateCartBadge();
  showToast(`Added to cart: ${product.name} - ${selectedVariant.name}`, 'success');
}

function handleEnquiry() {
  if (!selectedVariant) return;
  const msg = encodeURIComponent(`Hi! I'm interested in:\n\n*${product.name}*\nVariant: ${selectedVariant.name}\nPrice: ${formatPrice(selectedVariant.price)}\n\nPlease share more details.`);
  window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
}

/* ========== Zoom overlay ========== */
function openOverlay() {
  scale = 1;
  position = { x: 0, y: 0 };
  updateOverlayImage();
  document.getElementById('image-overlay').classList.remove('hidden');
}

function closeOverlay() {
  document.getElementById('image-overlay').classList.add('hidden');
}

function updateOverlayImage() {
  const viewer = document.getElementById('image-viewer');
  viewer.innerHTML = `<img id="overlay-img" src="${selectedVariant.image}" alt="" class="max-w-full max-h-full object-contain transition-transform duration-200" style="transform: scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px);" draggable="false"/>`;
  document.getElementById('zoom-level').textContent = Math.round(scale * 100) + '%';
  document.getElementById('zoom-out-btn').disabled = scale <= 1;
  document.getElementById('zoom-in-btn').disabled = scale >= 4;
  const img = document.getElementById('overlay-img');
  img.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
  attachViewerEvents();
}

function attachViewerEvents() {
  const viewer = document.getElementById('image-viewer');
  const img = document.getElementById('overlay-img');
  viewer.onmousedown = (e) => startDrag(e.clientX, e.clientY);
  viewer.onmousemove = (e) => moveDrag(e.clientX, e.clientY);
  viewer.onmouseup = endDrag;
  viewer.onmouseleave = endDrag;
  viewer.ontouchstart = (e) => { if (e.touches.length === 1 && scale > 1) startDrag(e.touches[0].clientX, e.touches[0].clientY); };
  viewer.ontouchmove = (e) => { if (e.touches.length === 1 && scale > 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY); };
  viewer.ontouchend = endDrag;
  viewer.ondblclick = () => {
    if (scale === 1) { scale = 2; } else { scale = 1; position = { x: 0, y: 0 }; }
    updateOverlayImage();
  };
}

function startDrag(x, y) {
  if (scale <= 1) return;
  isDragging = true;
  startPos = { x, y };
  lastPos = { ...position };
}
function moveDrag(x, y) {
  if (!isDragging || scale <= 1) return;
  position = { x: lastPos.x + (x - startPos.x), y: lastPos.y + (y - startPos.y) };
  document.getElementById('overlay-img').style.transform = `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`;
}
function endDrag() { isDragging = false; }

function setupZoom() {
  document.getElementById('close-overlay-btn')?.addEventListener('click', closeOverlay);
  document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
    scale = Math.min(scale + 0.5, 4);
    updateOverlayImage();
  });
  document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
    scale = Math.max(scale - 0.5, 1);
    if (scale === 1) position = { x: 0, y: 0 };
    updateOverlayImage();
  });
}
