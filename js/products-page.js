/* ==========================================================================
   Product listing page: search, category/price/rating filters, sorting,
   pagination — all state synced to the URL query string.
   ========================================================================== */

const PAGE_SIZE = 12;

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryFilters();
  renderRatingFilters();
  restoreFiltersFromQuery();
  wireToolbar();
  wireFilterPanelToggle();
  renderResults();
});

function currentFilters() {
  return {
    q: getQueryParam("q") || "",
    categories: (getQueryParam("category") || "").split(",").filter(Boolean),
    minPrice: getQueryParam("minPrice") || "",
    maxPrice: getQueryParam("maxPrice") || "",
    rating: Number(getQueryParam("rating")) || 0,
    sort: getQueryParam("sort") || "relevance",
    page: Number(getQueryParam("page")) || 1,
  };
}

function renderCategoryFilters() {
  const wrap = document.querySelector("[data-category-filters]");
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map((cat) => {
    const count = PRODUCTS.filter((p) => p.category === cat.id).length;
    return `
    <label class="filter-checkbox">
      <input type="checkbox" value="${cat.id}" data-category-checkbox>
      ${cat.name} <span class="count">(${count})</span>
    </label>`;
  }).join("");
}

function renderRatingFilters() {
  const wrap = document.querySelector("[data-rating-filters]");
  if (!wrap) return;
  wrap.innerHTML = [4, 3, 2, 1]
    .map(
      (r) => `
    <label class="rating-filter-option">
      <input type="radio" name="rating" value="${r}" data-rating-radio>
      <span class="star-row">${starRatingMarkup(r)}</span> &amp; up
    </label>`
    )
    .join("");
}

function restoreFiltersFromQuery() {
  const f = currentFilters();
  document.querySelectorAll("[data-category-checkbox]").forEach((cb) => {
    cb.checked = f.categories.includes(cb.value);
  });
  document.querySelectorAll("[data-rating-radio]").forEach((r) => {
    r.checked = Number(r.value) === f.rating;
  });
  const minInput = document.querySelector("[data-price-min]");
  const maxInput = document.querySelector("[data-price-max]");
  if (minInput) minInput.value = f.minPrice;
  if (maxInput) maxInput.value = f.maxPrice;
  const sortSelect = document.querySelector("[data-sort-select]");
  if (sortSelect) sortSelect.value = f.sort;
}

function wireToolbar() {
  document.querySelector("[data-sort-select]")?.addEventListener("change", (e) => {
    setQueryParams({ sort: e.target.value, page: 1 });
    renderResults();
  });

  document.querySelector("[data-apply-filters]")?.addEventListener("click", () => {
    const categories = Array.from(document.querySelectorAll("[data-category-checkbox]:checked")).map((cb) => cb.value);
    const rating = document.querySelector("[data-rating-radio]:checked")?.value || "";
    const minPrice = document.querySelector("[data-price-min]")?.value || "";
    const maxPrice = document.querySelector("[data-price-max]")?.value || "";
    setQueryParams({
      category: categories.join(",") || null,
      rating: rating || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      page: 1,
    });
    renderResults();
    closeFilterPanel();
  });

  document.querySelectorAll("[data-clear-filters]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setQueryParams({ category: null, rating: null, minPrice: null, maxPrice: null, q: null, sort: null, page: null });
      document.querySelectorAll("[data-category-checkbox]").forEach((cb) => (cb.checked = false));
      document.querySelectorAll("[data-rating-radio]").forEach((r) => (r.checked = false));
      const minInput = document.querySelector("[data-price-min]");
      const maxInput = document.querySelector("[data-price-max]");
      if (minInput) minInput.value = "";
      if (maxInput) maxInput.value = "";
      renderResults();
    });
  });
}

function wireFilterPanelToggle() {
  const panel = document.querySelector("[data-filters-panel]");
  document.querySelector("[data-open-filters]")?.addEventListener("click", () => {
    panel?.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  document.querySelector("[data-close-filters]")?.addEventListener("click", closeFilterPanel);
}

function closeFilterPanel() {
  document.querySelector("[data-filters-panel]")?.classList.remove("open");
  document.body.style.overflow = "";
}

function getFilteredSortedProducts() {
  const f = currentFilters();
  let results = PRODUCTS.slice();

  if (f.q) {
    const q = f.q.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }
  if (f.categories.length) {
    results = results.filter((p) => f.categories.includes(p.category));
  }
  if (f.minPrice) results = results.filter((p) => p.price >= Number(f.minPrice));
  if (f.maxPrice) results = results.filter((p) => p.price <= Number(f.maxPrice));
  if (f.rating) results = results.filter((p) => p.rating >= f.rating);

  switch (f.sort) {
    case "price-asc": results.sort((a, b) => a.price - b.price); break;
    case "price-desc": results.sort((a, b) => b.price - a.price); break;
    case "rating": results.sort((a, b) => b.rating - a.rating); break;
    case "newest": results.sort((a, b) => b.id - a.id); break;
    case "name": results.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break;
  }
  return results;
}

function renderResults() {
  const f = currentFilters();
  const results = getFilteredSortedProducts();
  const grid = document.querySelector("[data-product-grid]");
  const emptyState = document.querySelector("[data-empty-state]");
  const countEl = document.querySelector("[data-results-count]");
  if (!grid) return;

  grid.innerHTML = "";

  if (!results.length) {
    emptyState.hidden = false;
    grid.hidden = true;
    countEl.textContent = "0 results";
    document.querySelector("[data-pagination]").innerHTML = "";
    return;
  }

  emptyState.hidden = true;
  grid.hidden = false;

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, f.page), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = results.slice(start, start + PAGE_SIZE);

  countEl.textContent = `Showing ${start + 1}-${start + pageItems.length} of ${results.length} results${f.q ? ` for "${f.q}"` : ""}`;

  pageItems.forEach((product) => grid.appendChild(createProductCard(product)));
  updateHeaderBadges();
  renderPagination(page, totalPages);
}

function renderPagination(page, totalPages) {
  const wrap = document.querySelector("[data-pagination]");
  if (!wrap) return;
  if (totalPages <= 1) {
    wrap.innerHTML = "";
    return;
  }
  let html = `<button data-page="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Previous page">&larr;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button data-page="${i}" class="${i === page ? "active" : ""}">${i}</button>`;
  }
  html += `<button data-page="${page + 1}" ${page === totalPages ? "disabled" : ""} aria-label="Next page">&rarr;</button>`;
  wrap.innerHTML = html;

  wrap.querySelectorAll("button[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setQueryParams({ page: btn.dataset.page });
      renderResults();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}
