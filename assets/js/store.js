/* =================================================
   store.js – localStorage-backed product + cart store
   (Pure JS, no frameworks)
================================================= */

const PRODUCTS_KEY = 'products';
const CART_KEY = 'cart';

const defaultProducts = [
  {
    id: '1',
    name: 'Premium Leather Wallet',
    description: 'Handcrafted genuine leather wallet with RFID protection. Features multiple card slots, a coin pocket, and bill compartment. Perfect for everyday use.',
    category: 'Accessories',
    variants: [
      { id: '1-1', name: 'Classic Brown', price: 2499, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800' },
      { id: '1-2', name: 'Midnight Black', price: 2499, image: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=800' },
      { id: '1-3', name: 'Tan Vintage', price: 2799, image: 'https://images.unsplash.com/photo-1611317046674-f686af177917?w=800' },
      { id: '1-4', name: 'Navy Blue', price: 2699, image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Pranil Polymers Watch Collection',
    description: 'Elegant timepieces with Swiss movement. Sapphire crystal glass, stainless steel case, and genuine leather strap. Water resistant up to 50 meters.',
    category: 'Watches',
    variants: [
      { id: '2-1', name: 'Silver Classic', price: 8999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
      { id: '2-2', name: 'Rose Gold', price: 9499, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800' },
      { id: '2-3', name: 'Matte Black', price: 9999, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800' },
      { id: '2-4', name: 'Gold Luxury', price: 12999, image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800' },
      { id: '2-5', name: 'Steel Sport', price: 7999, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800' },
    ],
    createdAt: new Date().toISOString(),
  },
];

/* ---------- Products ---------- */
function getProducts() {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

function updateProduct(id, updates) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

/* ---------- Cart ---------- */
function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, variantId) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId && item.variantId === variantId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, variantId, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId, variantId) {
  const cart = getCart().filter(item => !(item.productId === productId && item.variantId === variantId));
  saveCart(cart);
}

function updateCartQuantity(productId, variantId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId && item.variantId === variantId);
  if (item) {
    item.quantity = quantity;
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
    } else {
      saveCart(cart);
    }
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/* ---------- Helpers ---------- */
function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
}
