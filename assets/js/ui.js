/* =================================================
   ui.js – Shared UI helpers (nav, toast, etc.)
   (Pure JS, no frameworks)
================================================= */

/* --------- Icons (SVG strings) --------- */
const icons = {
  home: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  package: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.5 4.21"/><path d="M21 8l-9.5-5.5L2 8l9.5 5.5L21 8z"/><path d="M2 8v8l9.5 5.5L21 16V8"/></svg>`,
  info: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  message: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  settings: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2"/><path d="M12 19v2"/><path d="M3 12h2"/><path d="M19 12h2"/><path d="M5.6 5.6l1.4 1.4"/><path d="M17 17l1.4 1.4"/><path d="M18.4 5.6L17 7"/><path d="M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="3"/></svg>`,
  sparkles: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5-5-2.5 5-2.5 2.5-5z"/></svg>`,
  shield: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  truck: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  arrowRight: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`,
  arrowLeft: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`,
  check: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  plus: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  minus: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  edit: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-10 10H7v-4L17 3z"/></svg>`,
  x: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  search: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  shoppingBag: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  messageCircle: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  cart: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"/><circle cx="20" cy="20" r="1"/><path d="M2 2h3l3.6 7.59a2 2 0 0 0 1.7 1.17h7.9a2 2 0 0 0 1.94-1.5l1.3-5.16H6"/></svg>`,
  zoomIn: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  zoomOut: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`,
  lock: `<svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  imagePlus: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/><line x1="16" y1="5" x2="16" y2="11"/><line x1="13" y1="8" x2="19" y2="8"/></svg>`,
};

/* --------- Navigation Items --------- */
const navItems = [
  { path: 'index.html', label: 'Home', icon: 'home' },
  { path: 'products.html', label: 'Products', icon: 'package' },
  { path: 'about.html', label: 'About', icon: 'info' },
  { path: 'contact.html', label: 'Contact', icon: 'message' },
];

function getCurrentPage() {
  const path = window.location.pathname;
  const fileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return fileName;
}

function renderNav() {
  const currentPage = getCurrentPage();
  const desktopNav = document.getElementById('desktop-nav');
  const mobileNav = document.getElementById('mobile-nav');
  const bottomNav = document.getElementById('bottom-nav');

  if (desktopNav) {
    desktopNav.innerHTML = navItems.map(item => {
      const isActive = currentPage === item.path;
      return `<a href="./${item.path}" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}">${item.label}</a>`;
    }).join('');
  }

  if (mobileNav) {
    mobileNav.innerHTML = navItems.map(item => {
      const isActive = currentPage === item.path;
      return `<a href="./${item.path}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}">${icons[item.icon]}${item.label}</a>`;
    }).join('') + `<a href="./admin.html" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">${icons.settings}Admin</a>`;
  }

  if (bottomNav) {
    bottomNav.innerHTML = navItems.map(item => {
      const isActive = currentPage === item.path;
      return `<a href="./${item.path}" class="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}">${icons[item.icon]}<span class="text-xs font-medium">${item.label}</span></a>`;
    }).join('');
  }
}

function updateCartBadge() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (count > 0) {
    cartCount.textContent = count;
    cartCount.classList.remove('hidden');
    cartCount.classList.add('flex');
  } else {
    cartCount.classList.add('hidden');
    cartCount.classList.remove('flex');
  }
}

/* --------- Mobile menu toggle --------- */
function setupMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isHidden = menu.classList.contains('hidden');
      if (isHidden) {
        menu.classList.remove('hidden');
        toggle.innerHTML = icons.x;
      } else {
        menu.classList.add('hidden');
        toggle.innerHTML = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      }
    });
  }
}

/* --------- Toast --------- */
function getOrCreateToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = 'success') {
  const container = getOrCreateToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* --------- Product Card Renderer --------- */
function renderProductCard(product) {
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const maxPrice = Math.max(...product.variants.map(v => v.price));
  const priceStr = minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  return `
    <a href="./product.html?id=${product.id}" class="group block bg-card rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300">
      <div class="aspect-square overflow-hidden bg-secondary">
        <img src="${product.variants[0]?.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
      </div>
      <div class="p-4">
        <span class="text-xs font-medium text-accent uppercase tracking-wide">${product.category}</span>
        <h3 class="font-semibold mt-1 text-foreground group-hover:text-primary transition-colors line-clamp-1">${product.name}</h3>
        <p class="text-sm text-muted-foreground mt-1 line-clamp-2">${product.description}</p>
        <div class="mt-3 flex items-center justify-between">
          <span class="font-semibold text-primary">${priceStr}</span>
          <span class="text-xs text-muted-foreground">${product.variants.length} variants</span>
        </div>
      </div>
    </a>
  `;
}

/* --------- Init --------- */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  updateCartBadge();
  setupMobileMenu();
});
