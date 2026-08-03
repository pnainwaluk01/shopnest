/* ==========================================================================
   Product detail page: gallery, info panel, quantity stepper, tabs
   (description/specs/reviews), related products.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const product = getProductById(getQueryParam("id"));
  const root = document.querySelector("[data-product-detail-root]");

  if (!product) {
    root.innerHTML = `
      <div class="empty-state">
        <svg class="icon"><use href="../assets/icons/search.svg#icon"/></svg>
        <h3>Product not found</h3>
        <p>The product you're looking for doesn't exist or may have been removed.</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — ShopNest`;
  document.querySelector("[data-breadcrumb-name]").textContent = product.name;
  root.innerHTML = buildDetailMarkup(product);

  initGallery(product);
  initQtyStepper(product);
  initActions(product);
  initTabs();
  renderRelated(product);
});

function buildDetailMarkup(product) {
  const outOfStock = product.stock === 0;
  return `
    <div class="pd-layout">
      <div class="pd-gallery">
        <div class="pd-gallery-main"><img src="${product.images[0]}" alt="${product.name}" data-gallery-main></div>
        ${
          product.images.length > 1
            ? `<div class="pd-gallery-thumbs" data-gallery-thumbs>
          ${product.images
            .map((img, i) => `<button class="pd-thumb ${i === 0 ? "active" : ""}" data-thumb="${i}"><img src="${img}" alt="${product.name} view ${i + 1}"></button>`)
            .join("")}
        </div>`
            : ""
        }
      </div>
      <div class="pd-info">
        <span class="product-card-cat">${getCategoryById(product.category)?.name || ""}</span>
        <h1>${product.name}</h1>
        <div class="pd-rating-row">
          <span class="star-row">${starRatingMarkup(product.rating)}</span>
          <a href="#reviews" data-tab-link="reviews">${product.rating.toFixed(1)} (${product.reviewCount} reviews)</a>
        </div>
        <div class="pd-price-row">
          <span class="price-current">${formatCurrency(product.price)}</span>
          ${product.originalPrice > product.price ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span><span class="price-discount">${product.discount}% off</span>` : ""}
        </div>
        <p class="pd-stock ${outOfStock ? "out" : "in"}">${outOfStock ? "Out of Stock" : `In Stock (${product.stock} available)`}</p>
        <p class="pd-desc">${product.description}</p>

        ${
          outOfStock
            ? ""
            : `<div class="pd-qty-row">
          <div class="qty-stepper">
            <button type="button" data-qty-decrease aria-label="Decrease quantity"><svg class="icon"><use href="../assets/icons/minus.svg#icon"/></svg></button>
            <input type="text" value="1" data-qty-input readonly>
            <button type="button" data-qty-increase aria-label="Increase quantity"><svg class="icon"><use href="../assets/icons/plus.svg#icon"/></svg></button>
          </div>
          <span class="form-hint">Max ${product.stock} per order</span>
        </div>`
        }

        <div class="pd-action-row">
          <button class="btn btn-primary btn-lg" data-add-to-cart ${outOfStock ? "disabled" : ""}>
            <svg class="icon"><use href="../assets/icons/cart.svg#icon"/></svg> Add to Cart
          </button>
          <button class="btn btn-outline btn-lg" data-toggle-wishlist>
            <svg class="icon"><use href="${iconHref(isInWishlist(product.id) ? "icon-heart-filled" : "icon-heart")}"/></svg>
            ${isInWishlist(product.id) ? "Wishlisted" : "Add to Wishlist"}
          </button>
        </div>

        <div class="pd-trust-mini">
          <div><svg class="icon"><use href="../assets/icons/truck.svg#icon"/></svg> Free shipping over ₹999</div>
          <div><svg class="icon"><use href="../assets/icons/return.svg#icon"/></svg> 7-day easy returns</div>
          <div><svg class="icon"><use href="../assets/icons/shield.svg#icon"/></svg> Secure payment</div>
        </div>
      </div>
    </div>

    <div class="pd-tabs">
      <div class="pd-tab-nav">
        <button class="active" data-tab="description">Description</button>
        <button data-tab="specifications">Specifications</button>
        <button data-tab="reviews" id="reviews">Reviews (${product.reviews.length})</button>
      </div>
      <div class="pd-tab-panel active" data-tab-panel="description">
        <p>${product.description}</p>
      </div>
      <div class="pd-tab-panel" data-tab-panel="specifications">
        <table class="spec-table">
          ${Object.entries(product.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
        </table>
      </div>
      <div class="pd-tab-panel" data-tab-panel="reviews">
        ${product.reviews
          .map(
            (r) => `
          <div class="review-card">
            <div class="review-head">
              <strong>${r.name}</strong>
              <span class="star-row">${starRatingMarkup(r.rating)}</span>
              <span class="review-date">${r.date}</span>
            </div>
            <p class="review-comment">${r.comment}</p>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function initGallery(product) {
  const main = document.querySelector("[data-gallery-main]");
  document.querySelectorAll("[data-thumb]").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      document.querySelectorAll("[data-thumb]").forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      main.src = product.images[Number(thumb.dataset.thumb)];
    });
  });
}

function initQtyStepper(product) {
  const input = document.querySelector("[data-qty-input]");
  if (!input) return;
  const dec = document.querySelector("[data-qty-decrease]");
  const inc = document.querySelector("[data-qty-increase]");

  const clamp = (v) => Math.max(1, Math.min(product.stock, v));
  dec.addEventListener("click", () => (input.value = clamp(Number(input.value) - 1)));
  inc.addEventListener("click", () => (input.value = clamp(Number(input.value) + 1)));
}

function initActions(product) {
  document.querySelector("[data-add-to-cart]")?.addEventListener("click", () => {
    const qty = Number(document.querySelector("[data-qty-input]")?.value || 1);
    addToCart(product.id, qty);
    showToast(`${product.name} added to cart`);
  });

  document.querySelector("[data-toggle-wishlist]")?.addEventListener("click", (e) => {
    const nowActive = toggleWishlist(product.id);
    const btn = e.currentTarget;
    btn.querySelector("use").setAttribute("href", iconHref(nowActive ? "icon-heart-filled" : "icon-heart"));
    btn.lastChild.textContent = nowActive ? " Wishlisted" : " Add to Wishlist";
    showToast(nowActive ? "Added to wishlist" : "Removed from wishlist");
  });
}

function initTabs() {
  const buttons = document.querySelectorAll("[data-tab]");
  const activate = (tab) => {
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    document.querySelectorAll("[data-tab-panel]").forEach((p) => p.classList.toggle("active", p.dataset.tabPanel === tab));
  };
  buttons.forEach((btn) => btn.addEventListener("click", () => activate(btn.dataset.tab)));
  document.querySelector('[data-tab-link="reviews"]')?.addEventListener("click", (e) => {
    e.preventDefault();
    activate("reviews");
    document.querySelector('[data-tab-panel="reviews"]').scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderRelated(product) {
  const related = getRelatedProducts(product, 4);
  if (!related.length) return;
  const section = document.querySelector("[data-related-section]");
  const grid = document.querySelector("[data-related-grid]");
  section.hidden = false;
  related.forEach((p) => grid.appendChild(createProductCard(p)));
  updateHeaderBadges();
}
