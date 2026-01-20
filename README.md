https://nikkhil-ss.github.io/selling-ui/

# Pranil Polymers – Premium E-commerce Store

A mobile-friendly, vanilla HTML/CSS/JavaScript e-commerce storefront with product management, cart, and WhatsApp enquiry flow.

## Features

- 🛍️ **Product catalog** – filterable by category, searchable
- 📦 **Product detail** – variant selection, zoomable images
- 🛒 **Shopping cart** – quantity controls, order summary
- 💬 **WhatsApp enquiry** – one-tap message from product or cart
- 🔐 **Admin panel** – add/edit/delete products with image uploads (demo password: `admin123`)
- 📱 **Mobile-first design** – responsive layout with bottom navigation

## Quick Start

No build step required – just open `index.html` in a browser.

### Option 1: File Explorer
Double-click `index.html` (or any other `.html` file) in the project folder.

### Option 2: VS Code Live Server
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Right-click `index.html` → **Open with Live Server**.

### Option 3: Python HTTP Server
```bash
cd my-product-portal
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## Folder Structure

```
my-product-portal/
├── index.html         # Home page
├── products.html      # Product listing
├── product.html       # Product detail (query param ?id=)
├── cart.html          # Shopping cart
├── about.html         # About page
├── contact.html       # Contact page
├── admin.html         # Admin panel (password protected)
├── 404.html           # Not found page
├── assets/
│   ├── css/
│   │   └── styles.css # All styles (CSS variables, utilities)
│   └── js/
│       ├── store.js   # localStorage product & cart helpers
│       ├── ui.js      # Shared nav, toast, product card
│       └── pages/     # Page-specific scripts
│           ├── index.js
│           ├── products.js
│           ├── product.js
│           ├── cart.js
│           └── admin.js
└── README.md
```

## Data Persistence

Products and cart data are stored in **localStorage**. Default demo products load automatically on first visit.

## Customization

| Item | File | Notes |
|------|------|-------|
| Colors & fonts | `assets/css/styles.css` | CSS custom properties in `:root` |
| WhatsApp number | `product.js`, `cart.js`, `contact.html` | Search for `919876543210` |
| Admin password | `assets/js/pages/admin.js` | `ADMIN_PASSWORD` constant (demo only!) |
| Default products | `assets/js/store.js` | `defaultProducts` array |

## Browser Support

Tested in modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses ES6 syntax—no transpilation included.

---

Made with ❤️ by Pranil Polymers
