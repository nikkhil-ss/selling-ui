/* products.js – Products page logic */

let selectedCategory = null;
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryFilters();
  renderProducts();

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderProducts();
    });
  }
});

function renderCategoryFilters() {
  const container = document.getElementById('category-filters');
  if (!container) return;
  const products = getProducts();
  const categories = [...new Set(products.map(p => p.category))];
  if (categories.length <= 1) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = `
    <button data-category="" class="filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground">All</button>
    ${categories.map(cat => `<button data-category="${cat}" class="filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80">${cat}</button>`).join('')}
  `;

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.dataset.category || null;
      container.querySelectorAll('.filter-btn').forEach(b => {
        const isActive = (b.dataset.category || null) === selectedCategory;
        b.className = `filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`;
      });
      renderProducts();
    });
  });
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const noProducts = document.getElementById('no-products');
  if (!grid) return;
  const products = getProducts();
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.description.toLowerCase().includes(searchQuery);
    const matchesCat = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (noProducts) noProducts.classList.remove('hidden');
    return;
  }
  if (noProducts) noProducts.classList.add('hidden');
  grid.innerHTML = filtered.map((p, i) => `<div class="animate-fade-in" style="animation-delay:${i * 50}ms">${renderProductCard(p)}</div>`).join('');
}
