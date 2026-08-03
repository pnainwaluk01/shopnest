/* ==========================================================================
   Shared utilities: localStorage access, formatting, toasts, placeholder
   images, and small DOM helpers used across every page.
   ========================================================================== */

const STORAGE_KEYS = {
  cart: "ecomm_cart",
  wishlist: "ecomm_wishlist",
  session: "ecomm_session",
  lastOrder: "ecomm_last_order",
};

/* ---------- generic storage helpers ---------- */

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- cart ---------- */

function getCart() {
  return readStorage(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
  writeStorage(STORAGE_KEYS.cart, cart);
  updateHeaderBadges();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty });
  }
  saveCart(cart);
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  item.qty = qty;
  saveCart(cart.filter((i) => i.qty > 0));
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => i.productId !== productId));
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartDetails() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { product, qty: item.qty, subtotal: product.price * item.qty };
    })
    .filter(Boolean);
}

/* ---------- wishlist ---------- */

function getWishlist() {
  return readStorage(STORAGE_KEYS.wishlist, []);
}

function saveWishlist(list) {
  writeStorage(STORAGE_KEYS.wishlist, list);
  updateHeaderBadges();
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

function toggleWishlist(productId) {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(productId);
  }
  saveWishlist(list);
  return list.includes(productId);
}

function removeFromWishlist(productId) {
  saveWishlist(getWishlist().filter((id) => id !== productId));
}

/* ---------- mock session ---------- */

function getSession() {
  return readStorage(STORAGE_KEYS.session, null);
}

function saveSession(session) {
  writeStorage(STORAGE_KEYS.session, session);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

/* ---------- formatting ---------- */

function formatCurrency(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function starRatingMarkup(rating) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      html += `<svg class="icon star-full"><use href="${iconHref("icon-star")}"/></svg>`;
    } else if (i === full && hasHalf) {
      html += `<svg class="icon star-half"><use href="${iconHref("icon-star")}"/></svg>`;
    } else {
      html += `<svg class="icon star-empty"><use href="${iconHref("icon-star-outline")}"/></svg>`;
    }
  }
  return html;
}

/* Resolves an icon id (e.g. "icon-star") to its standalone SVG file's href,
   relative to the current page depth (root vs /pages/). Each icon lives in
   its own file at assets/icons/<name>.svg with a single <symbol id="icon">. */
function iconHref(iconId) {
  const root = document.body.dataset.assetsRoot || "";
  const name = iconId.replace(/^icon-/, "");
  return `${root}assets/icons/${name}.svg#icon`;
}

/* ---------- SVG placeholder image generator ---------- */

const PLACEHOLDER_PALETTE = [
  ["#eef2ff", "#4338ca"], ["#fef3c7", "#b45309"], ["#dcfce7", "#15803d"],
  ["#fee2e2", "#b91c1c"], ["#e0f2fe", "#0369a1"], ["#fae8ff", "#a21caf"],
  ["#fff7ed", "#c2410c"], ["#ecfeff", "#0e7490"],
];

function generatePlaceholderImage(name, category, seed) {
  const colors = PLACEHOLDER_PALETTE[seed % PLACEHOLDER_PALETTE.length];
  const [bg, fg] = colors;
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const label = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
    <rect width="480" height="480" fill="${bg}"/>
    <circle cx="240" cy="200" r="90" fill="${fg}" opacity="0.15"/>
    <text x="240" y="225" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="700" fill="${fg}" text-anchor="middle">${initials}</text>
    <text x="240" y="340" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="${fg}" text-anchor="middle" opacity="0.85">${label}</text>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

/* ---------- toast notifications ---------- */

function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ---------- analytics ---------- */

/* Fires a GA4 custom event. Safe to call even if gtag hasn't loaded yet
   (e.g. blocked by an ad blocker) since gtag() itself just no-ops via the
   dataLayer queue, but we guard anyway for pages where the tag is missing. */
function trackEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
}

/* Delegated click tracking: any element with data-ga-event="name" fires that
   GA4 event automatically, so banners/links don't need individual listeners. */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-ga-event]");
  if (el) trackEvent(el.dataset.gaEvent);
});

/* ---------- misc helpers ---------- */

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setQueryParams(params) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.replaceState({}, "", url);
}

/* ---------- shared product card renderer ---------- */

/* Builds a product-card element used on Home, Products, Wishlist, and the
   related-products row on Product Detail. `linkPrefix` lets pages nested at
   different depths (root vs /pages/) point at product-detail.html correctly. */
function createProductCard(product, linkPrefix = "") {
  const card = document.createElement("article");
  card.className = "product-card";
  const wishlisted = isInWishlist(product.id);
  const outOfStock = product.stock === 0;

  card.innerHTML = `
    <a href="${linkPrefix}product-detail.html?id=${product.id}" class="product-card-media">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      <div class="product-card-badges">
        ${product.discount > 0 ? `<span class="badge badge-discount">${product.discount}% OFF</span>` : ""}
        ${product.featured ? `<span class="badge badge-featured">Featured</span>` : ""}
      </div>
    </a>
    <button class="product-card-wishlist ${wishlisted ? "active" : ""}" data-wishlist-toggle="${product.id}" aria-label="Toggle wishlist">
      <svg class="icon"><use href="${iconHref(wishlisted ? "icon-heart-filled" : "icon-heart")}"/></svg>
    </button>
    <div class="product-card-body">
      <span class="product-card-cat">${getCategoryById(product.category)?.name || ""}</span>
      <a href="${linkPrefix}product-detail.html?id=${product.id}" class="product-card-name">${product.name}</a>
      <div class="product-card-rating">
        <span class="star-row">${starRatingMarkup(product.rating)}</span>
        <span>(${product.reviewCount})</span>
      </div>
      <div class="product-card-price">
        <span class="price-current">${formatCurrency(product.price)}</span>
        ${product.originalPrice > product.price ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>` : ""}
      </div>
      <div class="product-card-actions">
        ${outOfStock
          ? `<span class="product-card-stock-out">Out of stock</span>`
          : `<button class="btn btn-primary btn-sm btn-block" data-quick-add="${product.id}">Add to Cart</button>`}
      </div>
    </div>
  `;

  card.querySelector("[data-wishlist-toggle]").addEventListener("click", (e) => {
    e.preventDefault();
    const nowActive = toggleWishlist(product.id);
    e.currentTarget.classList.toggle("active", nowActive);
    e.currentTarget.querySelector("use").setAttribute("href", iconHref(nowActive ? "icon-heart-filled" : "icon-heart"));
    showToast(nowActive ? "Added to wishlist" : "Removed from wishlist");
    trackEvent(nowActive ? "sn_add_to_wishlist" : "sn_remove_from_wishlist", { item_id: product.id, item_name: product.name });
  });

  const quickAdd = card.querySelector("[data-quick-add]");
  quickAdd?.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
    showToast(`${product.name} added to cart`);
    trackEvent("sn_add_to_cart", { item_id: product.id, item_name: product.name, price: product.price, quantity: 1 });
  });

  return card;
}

/* Updates cart/wishlist badge counts in the shared navbar (called on any
   storage mutation, and once on page load from nav.js). */
function updateHeaderBadges() {
  const cartBadge = document.querySelector("[data-cart-badge]");
  const wishlistBadge = document.querySelector("[data-wishlist-badge]");
  if (cartBadge) {
    const count = getCartCount();
    cartBadge.textContent = count;
    cartBadge.classList.toggle("badge-hidden", count === 0);
  }
  if (wishlistBadge) {
    const count = getWishlist().length;
    wishlistBadge.textContent = count;
    wishlistBadge.classList.toggle("badge-hidden", count === 0);
  }
}
