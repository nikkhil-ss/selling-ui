/* admin.js – Admin page logic */

const ADMIN_PASSWORD = 'admin123';
let products = [];
let editingProductId = null;
let variants = [];

document.addEventListener('DOMContentLoaded', () => {
  const auth = sessionStorage.getItem('admin_auth');
  if (auth === 'true') {
    showAdminPanel();
  }
  setupLoginForm();
  setupAdminEvents();
});

function setupLoginForm() {
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('password-input').value;
    const errEl = document.getElementById('password-error');
    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      errEl.classList.add('hidden');
      showAdminPanel();
    } else {
      errEl.textContent = 'Incorrect password';
      errEl.classList.remove('hidden');
    }
  });
}

function showAdminPanel() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
  loadProducts();
}

function setupAdminEvents() {
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('admin_auth');
    location.reload();
  });
  document.getElementById('add-product-btn')?.addEventListener('click', openAddForm);
  document.getElementById('add-first-btn')?.addEventListener('click', openAddForm);
  document.getElementById('close-form-btn')?.addEventListener('click', closeForm);
  document.getElementById('cancel-form-btn')?.addEventListener('click', closeForm);
  document.getElementById('add-variant-btn')?.addEventListener('click', addVariant);
  document.getElementById('product-form')?.addEventListener('submit', handleFormSubmit);
}

function loadProducts() {
  products = getProducts();
  renderProductList();
}

function renderProductList() {
  const listEl = document.getElementById('products-list');
  const noEl = document.getElementById('no-products');
  const countEl = document.getElementById('product-count');
  countEl.textContent = `${products.length} products`;

  if (products.length === 0) {
    listEl.innerHTML = '';
    noEl.classList.remove('hidden');
    return;
  }
  noEl.classList.add('hidden');
  listEl.innerHTML = products.map(p => `
    <div class="flex items-center gap-4 p-4 bg-card rounded-xl card-shadow" data-id="${p.id}">
      <div class="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        <img src="${p.variants[0]?.image}" alt="${p.name}" class="w-full h-full object-cover"/>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold line-clamp-1">${p.name}</h3>
        <p class="text-sm text-muted-foreground">${p.category}</p>
        <p class="text-sm text-muted-foreground">${p.variants.length} variants</p>
      </div>
      <div class="flex gap-2">
        <button class="edit-btn p-2 rounded-lg hover:bg-secondary transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3l4 4-10 10H7v-4L17 3z"/></svg>
        </button>
        <button class="delete-btn p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.closest('[data-id]').dataset.id;
      openEditForm(id);
    });
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.closest('[data-id]').dataset.id;
      if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(id);
        loadProducts();
        showToast('Product deleted', 'success');
      }
    });
  });
}

function openAddForm() {
  editingProductId = null;
  document.getElementById('form-title').textContent = 'Add Product';
  document.getElementById('pf-name').value = '';
  document.getElementById('pf-category').value = '';
  document.getElementById('pf-desc').value = '';
  variants = [{ id: Date.now().toString(), name: '', price: '', image: '' }];
  renderVariantsForm();
  showFormSection();
}

function openEditForm(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingProductId = id;
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('pf-name').value = p.name;
  document.getElementById('pf-category').value = p.category;
  document.getElementById('pf-desc').value = p.description;
  variants = p.variants.map(v => ({ id: v.id, name: v.name, price: v.price.toString(), image: v.image }));
  renderVariantsForm();
  showFormSection();
}

function closeForm() {
  showListSection();
}

function showFormSection() {
  document.getElementById('products-list-section').classList.add('hidden');
  document.getElementById('product-form-section').classList.remove('hidden');
}
function showListSection() {
  document.getElementById('product-form-section').classList.add('hidden');
  document.getElementById('products-list-section').classList.remove('hidden');
}

function addVariant() {
  variants.push({ id: Date.now().toString(), name: '', price: '', image: '' });
  renderVariantsForm();
}

function removeVariant(vid) {
  if (variants.length <= 1) return;
  variants = variants.filter(v => v.id !== vid);
  renderVariantsForm();
}

function renderVariantsForm() {
  const container = document.getElementById('variants-container');
  container.innerHTML = variants.map((v, idx) => `
    <div class="p-4 border rounded-lg space-y-4 variant-block" data-vid="${v.id}">
      <div class="flex items-center justify-between">
        <span class="font-medium text-sm">Variant ${idx + 1}</span>
        ${variants.length > 1 ? `<button type="button" class="remove-variant-btn text-destructive hover:bg-destructive/10 p-1 rounded"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>` : ''}
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-2">Name *</label><input type="text" class="input var-name" value="${v.name}" placeholder="e.g., Classic Brown"/></div>
        <div><label class="block text-sm font-medium mb-2">Price (₹) *</label><input type="number" class="input var-price" value="${v.price}" placeholder="e.g., 2499"/></div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Image *</label>
        <input type="file" accept="image/*" class="hidden var-file"/>
        ${v.image ? `
          <div class="relative inline-block">
            <img src="${v.image}" alt="Preview" class="w-24 h-24 object-cover rounded-lg"/>
            <button type="button" class="clear-img-btn absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ` : `
          <button type="button" class="upload-btn flex items-center gap-2 px-4 py-3 border border-dashed rounded-lg hover:bg-secondary transition-colors text-sm text-muted-foreground">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/><line x1="16" y1="5" x2="16" y2="11"/><line x1="13" y1="8" x2="19" y2="8"/></svg>
            Upload Image
          </button>
        `}
      </div>
    </div>
  `).join('');

  // Attach events per variant
  container.querySelectorAll('.variant-block').forEach((block) => {
    const vid = block.dataset.vid;
    const nameInput = block.querySelector('.var-name');
    const priceInput = block.querySelector('.var-price');
    const fileInput = block.querySelector('.var-file');

    nameInput?.addEventListener('input', () => {
      const v = variants.find(x => x.id === vid);
      if (v) v.name = nameInput.value;
    });
    priceInput?.addEventListener('input', () => {
      const v = variants.find(x => x.id === vid);
      if (v) v.price = priceInput.value;
    });
    block.querySelector('.upload-btn')?.addEventListener('click', () => fileInput.click());
    fileInput?.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const v = variants.find(x => x.id === vid);
          if (v) v.image = reader.result;
          renderVariantsForm();
        };
        reader.readAsDataURL(file);
      }
    });
    block.querySelector('.clear-img-btn')?.addEventListener('click', () => {
      const v = variants.find(x => x.id === vid);
      if (v) v.image = '';
      renderVariantsForm();
    });
    block.querySelector('.remove-variant-btn')?.addEventListener('click', () => removeVariant(vid));
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('pf-name').value.trim();
  const category = document.getElementById('pf-category').value.trim();
  const description = document.getElementById('pf-desc').value.trim();

  if (!name || !category || !description) {
    showToast('Please fill all required fields', 'error');
    return;
  }
  const validVariants = variants.filter(v => v.name && v.price && v.image);
  if (validVariants.length === 0) {
    showToast('Please add at least one complete variant', 'error');
    return;
  }

  const productVariants = validVariants.map(v => ({
    id: v.id,
    name: v.name,
    price: parseFloat(v.price),
    image: v.image,
  }));

  if (editingProductId) {
    updateProduct(editingProductId, { name, description, category, variants: productVariants });
    showToast('Product updated successfully', 'success');
  } else {
    addProduct({ name, description, category, variants: productVariants });
    showToast('Product added successfully', 'success');
  }
  closeForm();
  loadProducts();
}

