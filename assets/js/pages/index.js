/* index.js – Home page logic */

document.addEventListener('DOMContentLoaded', () => {
  renderFeatures();
  renderFeaturedProducts();
});

const features = [
  { icon: 'sparkles', title: 'Premium Quality', description: 'Handcrafted with the finest materials for lasting elegance.' },
  { icon: 'shield', title: 'Authentic Products', description: '100% genuine products with warranty and authenticity certificate.' },
  { icon: 'truck', title: 'Fast Delivery', description: 'Quick and secure delivery to your doorstep nationwide.' },
];

function renderFeatures() {
  const container = document.getElementById('features');
  if (!container) return;
  container.innerHTML = features.map((f, i) => `
    <div class="flex items-start gap-4 p-5 rounded-xl bg-card card-shadow animate-fade-in" style="animation-delay: ${i * 100}ms">
      <div class="p-2.5 rounded-lg bg-accent/10">${icons[f.icon]}</div>
      <div>
        <h3 class="font-semibold text-foreground">${f.title}</h3>
        <p class="text-sm text-muted-foreground mt-1">${f.description}</p>
      </div>
    </div>
  `).join('');
}

function renderFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  const products = getProducts().slice(0, 3);
  grid.innerHTML = products.map((p, i) => `
    <div class="animate-fade-in" style="animation-delay: ${i * 100}ms">
      ${renderProductCard(p)}
    </div>
  `).join('');
}
