/* ==========================================================================
   Home page: hero slider, category grid, featured products, scroll reveal.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initHeroSlider();
  renderCategoryGrid();
  renderFeaturedProducts();
  initScrollReveal();
});

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dotsWrap = document.querySelector("[data-hero-dots]");
  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll("button");

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    restart();
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  }

  document.querySelector("[data-hero-prev]")?.addEventListener("click", () => goTo(current - 1));
  document.querySelector("[data-hero-next]")?.addEventListener("click", () => goTo(current + 1));

  restart();
}

function renderCategoryGrid() {
  const grid = document.querySelector("[data-category-grid]");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(
    (cat) => `
    <a href="pages/products.html?category=${cat.id}" class="category-card">
      <span class="category-card-icon"><svg class="icon"><use href="${iconHref(cat.icon)}"/></svg></span>
      <span>${cat.name}</span>
    </a>`
  ).join("");
}

function renderFeaturedProducts() {
  const grid = document.querySelector("[data-featured-grid]");
  if (!grid) return;
  getFeaturedProducts(8).forEach((product) => {
    grid.appendChild(createProductCard(product, "pages/"));
  });
  updateHeaderBadges();
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}
