/* ==========================================================================
   Checkout page: shipping + payment forms with client-side validation,
   live order summary, mock order placement & confirmation screen.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const items = getCartDetails();
  const root = document.querySelector("[data-checkout-root]");

  if (!items.length) {
    root.innerHTML = `
      <div class="empty-state">
        <svg class="icon"><use href="../assets/icons/cart.svg#icon"/></svg>
        <h3>Your cart is empty</h3>
        <p>Add some products to your cart before proceeding to checkout.</p>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>`;
    return;
  }

  renderCheckoutForm(items);

  const totals = computeCheckoutTotals(items);
  trackEvent("sn_begin_checkout", { value: totals.total, items: items.length });
});

function computeCheckoutTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = subtotal * 0.05;
  const promoCode = readStorage("ecomm_promo_code", null);
  const promos = { SAVE10: { type: "percent", value: 10 }, FLAT50: { type: "flat", value: 50 } };
  const promo = promoCode && promos[promoCode] ? promos[promoCode] : null;
  const discount = promo ? (promo.type === "percent" ? subtotal * (promo.value / 100) : promo.value) : 0;
  const total = Math.max(0, subtotal + shipping + tax - discount);
  return { subtotal, shipping, tax, discount, total };
}

function renderCheckoutForm(items) {
  const root = document.querySelector("[data-checkout-root]");
  const totals = computeCheckoutTotals(items);
  const session = getSession();

  root.innerHTML = `
    <div class="checkout-layout">
      <div>
        <form novalidate id="checkout-form">
          <div class="checkout-card">
            <h3><span class="step-num">1</span> Shipping Details</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="full-name">Full Name</label>
                <input class="form-control" id="full-name" name="fullName" value="${session?.name || ""}" placeholder="Jordan Lee">
                <p class="form-error">Please enter your full name.</p>
              </div>
              <div class="form-group">
                <label for="email">Email Address</label>
                <input class="form-control" id="email" name="email" value="${session?.email || ""}" placeholder="you@example.com">
                <p class="form-error">Please enter a valid email address.</p>
              </div>
            </div>
            <div class="form-group">
              <label for="address">Street Address</label>
              <input class="form-control" id="address" name="address" placeholder="123 Market Street, Apt 4B">
              <p class="form-error">Please enter your street address.</p>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input class="form-control" id="city" name="city" placeholder="Mumbai">
                <p class="form-error">Please enter your city.</p>
              </div>
              <div class="form-group">
                <label for="state">State</label>
                <input class="form-control" id="state" name="state" placeholder="Maharashtra">
                <p class="form-error">Please enter your state.</p>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="zip">PIN / ZIP Code</label>
                <input class="form-control" id="zip" name="zip" placeholder="400001">
                <p class="form-error">Please enter a valid postal code.</p>
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input class="form-control" id="phone" name="phone" placeholder="9876543210">
                <p class="form-error">Please enter a valid 10-digit phone number.</p>
              </div>
            </div>
          </div>

          <div class="checkout-card">
            <h3><span class="step-num">2</span> Payment Method</h3>
            <div class="payment-methods">
              <label class="payment-method active" data-payment-option="card">
                <input type="radio" name="paymentMethod" value="card" checked> Credit / Debit Card
              </label>
              <label class="payment-method" data-payment-option="cod">
                <input type="radio" name="paymentMethod" value="cod"> Cash on Delivery
              </label>
            </div>

            <div class="card-fields show" data-card-fields>
              <div class="form-group">
                <label for="card-name">Name on Card</label>
                <input class="form-control" id="card-name" name="cardName" placeholder="Jordan Lee">
                <p class="form-error">Please enter the name on your card.</p>
              </div>
              <div class="form-group">
                <label for="card-number">Card Number</label>
                <input class="form-control" id="card-number" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                <p class="form-error">Please enter a valid 16-digit card number.</p>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="card-expiry">Expiry (MM/YY)</label>
                  <input class="form-control" id="card-expiry" name="cardExpiry" placeholder="08/29" maxlength="5">
                  <p class="form-error">Please enter a valid future expiry date.</p>
                </div>
                <div class="form-group">
                  <label for="card-cvv">CVV</label>
                  <input class="form-control" id="card-cvv" name="cardCvv" placeholder="123" maxlength="4">
                  <p class="form-error">Please enter a valid CVV.</p>
                </div>
              </div>
            </div>
            <p class="form-hint" data-cod-hint hidden>Pay with cash when your order is delivered.</p>
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-block" data-place-order>Place Order</button>
        </form>
      </div>

      <aside class="checkout-summary">
        <h3>Order Summary</h3>
        ${items
          .map(
            (i) => `
          <div class="summary-item">
            <img src="${i.product.images[0]}" alt="${i.product.name}">
            <div>
              <p class="summary-item-name">${i.product.name}</p>
              <p class="summary-item-qty">Qty: ${i.qty}</p>
            </div>
            <span class="summary-item-price">${formatCurrency(i.subtotal)}</span>
          </div>`
          )
          .join("")}
        <hr class="summary-divider">
        <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(totals.subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${totals.shipping === 0 ? "Free" : formatCurrency(totals.shipping)}</span></div>
        <div class="summary-row"><span>Tax (5%)</span><span>${formatCurrency(totals.tax)}</span></div>
        ${totals.discount > 0 ? `<div class="summary-row"><span>Promo Discount</span><span>-${formatCurrency(totals.discount)}</span></div>` : ""}
        <div class="summary-row total"><span>Total</span><span>${formatCurrency(totals.total)}</span></div>
      </aside>
    </div>`;

  wirePaymentToggle();
  wireCardNumberFormatting();
  wireCheckoutSubmit(items, totals);
}

function wirePaymentToggle() {
  const options = document.querySelectorAll("[data-payment-option]");
  const cardFields = document.querySelector("[data-card-fields]");
  const codHint = document.querySelector("[data-cod-hint]");
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      opt.querySelector("input").checked = true;
      const isCard = opt.dataset.paymentOption === "card";
      cardFields.classList.toggle("show", isCard);
      codHint.hidden = isCard;
    });
  });
}

function wireCardNumberFormatting() {
  const input = document.getElementById("card-number");
  input?.addEventListener("input", () => {
    input.value = input.value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  });
  const expiry = document.getElementById("card-expiry");
  expiry?.addEventListener("input", () => {
    let v = expiry.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    expiry.value = v;
  });
  const cvv = document.getElementById("card-cvv");
  cvv?.addEventListener("input", () => {
    cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
  });
}

function setFieldError(input, hasError) {
  input.classList.toggle("invalid", hasError);
  const error = input.parentElement.querySelector(".form-error");
  if (error) error.classList.toggle("show", hasError);
}

function validateCheckoutForm(form) {
  let valid = true;
  const check = (input, isValid) => {
    setFieldError(input, !isValid);
    if (!isValid) valid = false;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const zipRegex = /^\d{5,6}$/;

  check(form.fullName, form.fullName.value.trim().length >= 2);
  check(form.email, emailRegex.test(form.email.value.trim()));
  check(form.address, form.address.value.trim().length >= 5);
  check(form.city, form.city.value.trim().length >= 2);
  check(form.state, form.state.value.trim().length >= 2);
  check(form.zip, zipRegex.test(form.zip.value.trim()));
  check(form.phone, phoneRegex.test(form.phone.value.trim()));

  const paymentMethod = form.paymentMethod.value;
  if (paymentMethod === "card") {
    const digits = form.cardNumber.value.replace(/\s/g, "");
    check(form.cardName, form.cardName.value.trim().length >= 2);
    check(form.cardNumber, digits.length === 16 && luhnCheck(digits));
    check(form.cardExpiry, isValidFutureExpiry(form.cardExpiry.value));
    check(form.cardCvv, /^\d{3,4}$/.test(form.cardCvv.value.trim()));
  }

  return valid;
}

function luhnCheck(number) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isValidFutureExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month, 0);
  return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
}

function wireCheckoutSubmit(items, totals) {
  const form = document.getElementById("checkout-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCheckoutForm(form)) {
      form.querySelector(".invalid")?.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    const order = {
      orderNumber: "SN" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      items: items.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price, image: i.product.images[0] })),
      totals,
      shipping: {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        address: form.address.value.trim(),
        city: form.city.value.trim(),
        state: form.state.value.trim(),
        zip: form.zip.value.trim(),
        phone: form.phone.value.trim(),
      },
      paymentMethod: form.paymentMethod.value,
    };

    writeStorage(STORAGE_KEYS.lastOrder, order);
    clearCart();
    localStorage.removeItem("ecomm_promo_code");
    trackEvent("sn_purchase", { transaction_id: order.orderNumber, value: order.totals.total, items: order.items.length, payment_method: order.paymentMethod });
    renderConfirmation(order);
  });
}

function renderConfirmation(order) {
  const root = document.querySelector("[data-checkout-root]");
  root.innerHTML = `
    <div class="order-confirmation fade-in">
      <div class="confirmation-icon"><svg class="icon"><use href="../assets/icons/check.svg#icon"/></svg></div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you, ${order.shipping.fullName.split(" ")[0]}. Your order has been confirmed.</p>
      <p>Order Number: <span class="order-number">${order.orderNumber}</span></p>
      <div class="confirmation-details">
        ${order.items
          .map(
            (i) => `
          <div class="summary-item">
            <img src="${i.image}" alt="${i.name}">
            <div>
              <p class="summary-item-name">${i.name}</p>
              <p class="summary-item-qty">Qty: ${i.qty}</p>
            </div>
            <span class="summary-item-price">${formatCurrency(i.price * i.qty)}</span>
          </div>`
          )
          .join("")}
        <hr class="summary-divider">
        <div class="summary-row total"><span>Total Paid</span><span>${formatCurrency(order.totals.total)}</span></div>
        <p class="form-hint" style="margin-top:10px;">Payment: ${order.paymentMethod === "cod" ? "Cash on Delivery" : "Card"} &middot; Shipping to ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}</p>
      </div>
      <div class="confirmation-actions">
        <a href="../index.html" class="btn btn-outline">Back to Home</a>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    </div>`;
  updateHeaderBadges();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
