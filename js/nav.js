/* ==========================================================================
   Shared navbar behaviour: mobile hamburger menu, sticky shadow on scroll,
   search redirect, cart/wishlist badge counts, login-state display.
   Included on every page, after utils.js and js/data/products.js.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNav();
  initNavSearch();
  initAccountLink();
  updateHeaderBadges();
  markActiveNavLink();
});

function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 4);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileNav() {
  const hamburger = document.querySelector("[data-hamburger]");
  const mobileNav = document.querySelector(".mobile-nav");
  const overlay = document.querySelector(".mobile-nav-overlay");
  const closeBtn = document.querySelector("[data-mobile-close]");
  if (!hamburger || !mobileNav || !overlay) return;

  const open = () => {
    mobileNav.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    mobileNav.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", open);
  overlay.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

function initNavSearch() {
  document.querySelectorAll("[data-nav-search-form]").forEach((form) => {
    const input = form.querySelector("input");
    const q = getQueryParam("q");
    if (q && input) input.value = q;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      const base = document.body.dataset.assetsRoot === "../" ? "products.html" : "pages/products.html";
      window.location.href = `${base}?q=${encodeURIComponent(value)}`;
    });
  });
}

function initAccountLink() {
  const session = getSession();
  document.querySelectorAll("[data-account-link]").forEach((el) => {
    if (session) {
      el.textContent = session.name.split(" ")[0];
      el.href = "javascript:void(0)";
      el.onclick = (e) => {
        e.preventDefault();
        if (confirm("Log out of your account?")) {
          clearSession();
          showToast("You have been logged out.");
          setTimeout(() => window.location.reload(), 600);
        }
      };
    }
  });
  document.querySelectorAll("[data-mobile-account-link]").forEach((el) => {
    if (session) {
      el.textContent = `Hi, ${session.name.split(" ")[0]} (Logout)`;
      el.onclick = (e) => {
        e.preventDefault();
        clearSession();
        showToast("You have been logged out.");
        setTimeout(() => window.location.reload(), 600);
      };
    }
  });
}

/* Highlights the current page's link in the desktop + mobile nav menus. */
function markActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a, .mobile-nav-body a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("javascript")) return;
    const page = href.split("/").pop().split("?")[0];
    if (page === current || (current === "" && page === "index.html")) {
      a.classList.add("active");
    }
  });
}
