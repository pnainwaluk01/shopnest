# ShopNest

A fully responsive e-commerce storefront built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no backend. Product data, cart, and wishlist all run client-side.

## Features

- **Home page** — hero banners, featured products, and category shortcuts (`index.html`)
- **Product listing** — browsable/searchable catalog with filtering across 8 categories (`pages/products.html`)
- **Product detail** — full product info, specs, and image gallery (`pages/product-detail.html`)
- **Cart & checkout** — add/update/remove items and a checkout flow (`pages/cart.html`, `pages/checkout.html`)
- **Wishlist** — save products for later (`pages/wishlist.html`)
- **Auth pages** — login, register, and forgot-password screens (`pages/login.html`, `pages/register.html`, `pages/forgot-password.html`)
- Cart and wishlist state persist locally via `localStorage`
- All product photos and icons are downloaded and stored locally under `images/` and `assets/icons/` — nothing is fetched from an external URL at runtime (see [CREDITS.md](CREDITS.md) for sourcing/licenses)

## Categories

Electronics, Fashion, Home & Kitchen, Beauty & Personal Care, Sports & Outdoors, Books & Stationery, Toys & Games, Grocery & Gourmet.

## Project Structure

```
index.html              Home page
pages/                  Products, product detail, cart, checkout, wishlist, auth pages
css/                    Per-page stylesheets (style.css is shared/global)
js/                     Per-page scripts + shared nav/footer/utils
js/data/products.js     Mock product & category catalog (single source of truth)
assets/icons/           SVG icon sprites
images/                 Product photos and banner images
CREDITS.md              Attribution for all images and icons
```

## Running Locally

This is a static site with no dependencies or build step. Serve the folder with any static file server, for example:

```bash
npx serve .
```

or in Python:

```bash
python -m http.server
```

Then open the printed local URL in your browser. Opening `index.html` directly via `file://` also works for browsing, though relative fetches on some pages behave more reliably when served over HTTP.
