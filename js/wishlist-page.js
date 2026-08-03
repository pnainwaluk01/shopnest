/* ==========================================================================
   Wishlist page: list saved products with remove and move-to-cart actions.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", renderWishlist);

function renderWishlist() {
  const root = document.querySelector("[data-wishlist-root]");
  const productIds = getWishlist();
  const products = productIds.map((id) => getProductById(id)).filter(Boolean);

  if (!products.length) {
    root.innerHTML = `
      <div class="empty-state">
        <svg class="icon"><use href="../assets/icons/heart.svg#icon"/></svg>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love by tapping the heart icon on any product.</p>
        <a href="products.html" class="btn btn-primary">Explore Products</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="wishlist-toolbar">
      <p>${products.length} item${products.length > 1 ? "s" : ""} saved</p>
      <button class="btn btn-outline btn-sm" data-clear-wishlist>Clear Wishlist</button>
    </div>
    <div class="product-grid" data-wishlist-grid></div>
  `;

  const grid = document.querySelector("[data-wishlist-grid]");
  products.forEach((product) => grid.appendChild(buildWishlistCard(product)));

  document.querySelector("[data-clear-wishlist]").addEventListener("click", () => {
    if (confirm("Remove all items from your wishlist?")) {
      saveWishlist([]);
      showToast("Wishlist cleared");
      renderWishlist();
    }
  });
}

function buildWishlistCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const outOfStock = product.stock === 0;

  card.innerHTML = `
    <a href="product-detail.html?id=${product.id}" class="product-card-media">
      <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
      ${product.discount > 0 ? `<div class="product-card-badges"><span class="badge badge-discount">${product.discount}% OFF</span></div>` : ""}
    </a>
    <button class="product-card-wishlist active" data-remove-wishlist="${product.id}" aria-label="Remove from wishlist">
      <svg class="icon"><use href="../assets/icons/heart-filled.svg#icon"/></svg>
    </button>
    <div class="product-card-body">
      <span class="product-card-cat">${getCategoryById(product.category)?.name || ""}</span>
      <a href="product-detail.html?id=${product.id}" class="product-card-name">${product.name}</a>
      <div class="product-card-rating">
        <span class="star-row">${starRatingMarkup(product.rating)}</span>
        <span>(${product.reviewCount})</span>
      </div>
      <div class="product-card-price">
        <span class="price-current">${formatCurrency(product.price)}</span>
        ${product.originalPrice > product.price ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>` : ""}
      </div>
      <div class="product-card-actions">
        ${
          outOfStock
            ? `<span class="product-card-stock-out">Out of stock</span>`
            : `<button class="btn btn-primary btn-sm btn-block" data-move-to-cart="${product.id}">Move to Cart</button>`
        }
      </div>
    </div>
  `;

  card.querySelector("[data-remove-wishlist]").addEventListener("click", (e) => {
    e.preventDefault();
    removeFromWishlist(product.id);
    showToast(`${product.name} removed from wishlist`);
    renderWishlist();
  });

  card.querySelector("[data-move-to-cart]")?.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart(product.id, 1);
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to cart`);
    renderWishlist();
  });

  return card;
}
