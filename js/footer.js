/* ==========================================================================
   Shared footer behaviour: newsletter form validation + dynamic year.
   Included on every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type=email]");
      const value = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showToast("Please enter a valid email address.", "error");
        input.focus();
        return;
      }
      showToast("Subscribed! Thanks for joining our newsletter.");
      form.reset();
    });
  });
});
