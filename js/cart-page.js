/* ==========================================================================
   Shopping cart page: render line items, update quantities, remove items,
   apply promo codes, compute order summary totals.
   ========================================================================== */

const SHIPPING_FLAT = 99;
const FREE_SHIPPING_THRESHOLD = 999;
const TAX_RATE = 0.05;
const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10, label: "10% off" },
  FLAT50: { type: "flat", value: 50, label: "₹50 off" },
};

let appliedPromo = null;

document.addEventListener("DOMContentLoaded", () => {
  const savedCode = readStorage("ecomm_promo_code", null);
  if (savedCode && PROMO_CODES[savedCode]) appliedPromo = PROMO_CODES[savedCode];
  renderCart();
});

function renderCart() {
  const root = document.querySelector("[data-cart-root]");
  const items = getCartDetails();

  if (!items.length) {
    root.innerHTML = `
      <div class="empty-state">
        <svg class="icon"><use href="../assets/icons/cart.svg#icon"/></svg>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet. Start exploring our products.</p>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items" data-cart-items></div>
      <aside class="order-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span data-sum-subtotal></span></div>
        <div class="summary-row"><span>Shipping</span><span data-sum-shipping></span></div>
        <div class="summary-row"><span>Tax (5%)</span><span data-sum-tax></span></div>
        <div class="summary-row" data-promo-row hidden><span>Promo Discount</span><span data-sum-discount></span></div>
        <div class="promo-row">
          <input type="text" placeholder="Promo code (try SAVE10)" data-promo-input>
          <button class="btn btn-outline btn-sm" data-apply-promo>Apply</button>
        </div>
        <p class="promo-feedback" data-promo-feedback></p>
        <div class="summary-row total"><span>Total</span><span data-sum-total></span></div>
        <a href="checkout.html" class="btn btn-primary btn-block btn-lg" data-checkout-btn>Proceed to Checkout</a>
      </aside>
    </div>`;

  renderCartItems(items);
  updateSummary();
  wirePromo();

  if (appliedPromo) {
    const savedCode = readStorage("ecomm_promo_code", "");
    const input = document.querySelector("[data-promo-input]");
    const feedback = document.querySelector("[data-promo-feedback]");
    if (input) input.value = savedCode;
    if (feedback) {
      feedback.textContent = `Promo applied: ${appliedPromo.label}`;
      feedback.className = "promo-feedback success";
    }
  }
}

function renderCartItems(items) {
  const wrap = document.querySelector("[data-cart-items]");
  wrap.innerHTML = items
    .map(
      ({ product, qty, subtotal }) => `
    <div class="cart-item" data-cart-item="${product.id}">
      <a href="product-detail.html?id=${product.id}" class="cart-item-media"><img src="${product.images[0]}" alt="${product.name}"></a>
      <div class="cart-item-info">
        <span class="cart-item-cat">${getCategoryById(product.category)?.name || ""}</span>
        <a href="product-detail.html?id=${product.id}">${product.name}</a>
        <p class="cart-item-price">${formatCurrency(product.price)} each</p>
      </div>
      <div class="cart-item-qty">
        <div class="qty-stepper">
          <button type="button" data-qty-decrease="${product.id}" aria-label="Decrease quantity"><svg class="icon"><use href="../assets/icons/minus.svg#icon"/></svg></button>
          <input type="text" value="${qty}" readonly data-qty-value="${product.id}">
          <button type="button" data-qty-increase="${product.id}" aria-label="Increase quantity" ${qty >= product.stock ? "disabled" : ""}><svg class="icon"><use href="../assets/icons/plus.svg#icon"/></svg></button>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-subtotal">${formatCurrency(subtotal)}</span>
        <button class="btn-icon cart-item-remove" data-remove-item="${product.id}" aria-label="Remove item">
          <svg class="icon"><use href="../assets/icons/trash.svg#icon"/></svg>
        </button>
      </div>
    </div>`
    )
    .join("");

  wrap.querySelectorAll("[data-qty-increase]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.qtyIncrease), 1));
  });
  wrap.querySelectorAll("[data-qty-decrease]").forEach((btn) => {
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.qtyDecrease), -1));
  });
  wrap.querySelectorAll("[data-remove-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = getProductById(Number(btn.dataset.removeItem));
      removeFromCart(Number(btn.dataset.removeItem));
      showToast(`${product?.name || "Item"} removed from cart`);
      renderCart();
    });
  });
}

function changeQty(productId, delta) {
  const product = getProductById(productId);
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item || !product) return;
  const newQty = Math.max(1, Math.min(product.stock, item.qty + delta));
  updateCartQty(productId, newQty);
  renderCart();
}

function computeTotals() {
  const items = getCartDetails();
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === "percent" ? subtotal * (appliedPromo.value / 100) : appliedPromo.value;
  }
  const total = Math.max(0, subtotal + shipping + tax - discount);
  return { subtotal, shipping, tax, discount, total };
}

function updateSummary() {
  const { subtotal, shipping, tax, discount, total } = computeTotals();
  document.querySelector("[data-sum-subtotal]").textContent = formatCurrency(subtotal);
  document.querySelector("[data-sum-shipping]").textContent = shipping === 0 ? "Free" : formatCurrency(shipping);
  document.querySelector("[data-sum-tax]").textContent = formatCurrency(tax);
  document.querySelector("[data-sum-total]").textContent = formatCurrency(total);
  const promoRow = document.querySelector("[data-promo-row]");
  if (discount > 0) {
    promoRow.hidden = false;
    document.querySelector("[data-sum-discount]").textContent = `-${formatCurrency(discount)}`;
  } else {
    promoRow.hidden = true;
  }
}

function wirePromo() {
  document.querySelector("[data-apply-promo]")?.addEventListener("click", () => {
    const input = document.querySelector("[data-promo-input]");
    const code = input.value.trim().toUpperCase();
    const feedback = document.querySelector("[data-promo-feedback]");
    if (!code) return;
    if (PROMO_CODES[code]) {
      appliedPromo = PROMO_CODES[code];
      writeStorage("ecomm_promo_code", code);
      feedback.textContent = `Promo applied: ${appliedPromo.label}`;
      feedback.className = "promo-feedback success";
      updateSummary();
    } else {
      appliedPromo = null;
      localStorage.removeItem("ecomm_promo_code");
      feedback.textContent = "Invalid promo code.";
      feedback.className = "promo-feedback error";
      updateSummary();
    }
  });
}
