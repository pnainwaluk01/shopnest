/* ==========================================================================
   Product & category mock data for the storefront.
   No backend — this file is the single source of truth for the catalog.
   ========================================================================== */

const CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "icon-smartphone" },
  { id: "fashion", name: "Fashion", icon: "icon-shirt" },
  { id: "home-kitchen", name: "Home & Kitchen", icon: "icon-house" },
  { id: "beauty", name: "Beauty & Personal Care", icon: "icon-sparkles" },
  { id: "sports", name: "Sports & Outdoors", icon: "icon-dumbbell" },
  { id: "books-stationery", name: "Books & Stationery", icon: "icon-book-open" },
  { id: "toys-games", name: "Toys & Games", icon: "icon-gamepad" },
  { id: "grocery", name: "Grocery & Gourmet", icon: "icon-shopping-basket" },
];

/* Base catalog data. `id`, `slug`, `images`, `discount` and `reviews` are
   derived below so each entry only needs to describe what's unique. */
const RAW_PRODUCTS = [
  // Electronics
  { name: "Wireless Bluetooth Headphones", category: "electronics", price: 2499, originalPrice: 3499, rating: 4.5, reviewCount: 312, stock: 24, featured: true,
    description: "Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.",
    specs: { "Battery Life": "30 hours", "Connectivity": "Bluetooth 5.2", "Noise Cancellation": "Active (ANC)", "Weight": "250g", "Warranty": "1 year" } },
  { name: "Smart Fitness Watch", category: "electronics", price: 3299, originalPrice: 4999, rating: 4.3, reviewCount: 587, stock: 40, featured: true,
    description: "Track heart rate, sleep, and 20+ workout modes with a vibrant AMOLED display and up to 7 days of battery life.",
    specs: { "Display": "1.4\" AMOLED", "Battery Life": "7 days", "Water Resistance": "5 ATM", "Compatibility": "Android & iOS", "Warranty": "1 year" } },
  { name: "4K Ultra HD Action Camera", category: "electronics", price: 5999, originalPrice: 7999, rating: 4.2, reviewCount: 154, stock: 15,
    description: "Capture stunning 4K/60fps footage with built-in stabilization, waterproof housing up to 30m, and Wi-Fi transfer.",
    specs: { "Video Resolution": "4K @ 60fps", "Waterproof": "30m (with case)", "Storage": "microSD up to 256GB", "Battery": "1200mAh", "Warranty": "1 year" } },
  { name: "Portable Bluetooth Speaker", category: "electronics", price: 1799, originalPrice: 2299, rating: 4.6, reviewCount: 421, stock: 60, featured: true,
    description: "Compact speaker with rich 360° sound, IPX7 waterproofing, and 12 hours of playtime — perfect for outdoor adventures.",
    specs: { "Output Power": "20W", "Battery Life": "12 hours", "Waterproof Rating": "IPX7", "Connectivity": "Bluetooth 5.0", "Warranty": "6 months" } },
  { name: "Wireless Fast Charging Pad", category: "electronics", price: 899, originalPrice: 1299, rating: 4.1, reviewCount: 98, stock: 75,
    description: "15W fast wireless charging pad compatible with all Qi-enabled smartphones, with LED charge indicator.",
    specs: { "Output": "15W Max", "Input": "USB-C", "Compatibility": "Qi-enabled devices", "Warranty": "6 months" } },
  { name: "Noise Cancelling Wireless Earbuds", category: "electronics", price: 3999, originalPrice: 5499, rating: 4.4, reviewCount: 266, stock: 33,
    description: "True wireless earbuds with hybrid ANC, touch controls, and a compact charging case delivering 24 extra hours of playback.",
    specs: { "Battery Life": "6h + 18h (case)", "Noise Cancellation": "Hybrid ANC", "Connectivity": "Bluetooth 5.3", "Water Resistance": "IPX4", "Warranty": "1 year" } },

  // Fashion
  { name: "Men's Slim Fit Denim Jacket", category: "fashion", price: 1999, originalPrice: 2999, rating: 4.2, reviewCount: 143, stock: 50, featured: true,
    description: "Classic slim-fit denim jacket crafted from durable cotton twill, perfect for layering in any season.",
    specs: { "Material": "100% Cotton Denim", "Fit": "Slim", "Care": "Machine wash cold", "Available Sizes": "S - XXL" } },
  { name: "Women's Floral Summer Dress", category: "fashion", price: 1499, originalPrice: 2199, rating: 4.5, reviewCount: 210, stock: 45,
    description: "Lightweight breathable fabric with a flattering A-line silhouette and vibrant floral print, ideal for warm days.",
    specs: { "Material": "Rayon blend", "Fit": "A-line", "Care": "Hand wash recommended", "Available Sizes": "XS - XL" } },
  { name: "Classic Leather Wallet", category: "fashion", price: 899, originalPrice: 1299, rating: 4.6, reviewCount: 378, stock: 90, featured: true,
    description: "Genuine leather bi-fold wallet with RFID-blocking lining, 8 card slots, and a slim profile.",
    specs: { "Material": "Genuine Leather", "Card Slots": "8", "RFID Protection": "Yes", "Dimensions": "11 x 9 cm" } },
  { name: "Unisex Canvas Sneakers", category: "fashion", price: 1699, originalPrice: 2399, rating: 4.3, reviewCount: 289, stock: 65,
    description: "Everyday low-top canvas sneakers with a cushioned insole and rubber outsole for all-day comfort.",
    specs: { "Material": "Canvas upper, rubber sole", "Closure": "Lace-up", "Available Sizes": "UK 5 - 11" } },
  { name: "Women's Quilted Handbag", category: "fashion", price: 2299, originalPrice: 3299, rating: 4.4, reviewCount: 132, stock: 28,
    description: "Elegant quilted handbag with gold-tone hardware, adjustable strap, and spacious interior compartments.",
    specs: { "Material": "Vegan leather", "Strap": "Adjustable & detachable", "Dimensions": "28 x 20 x 10 cm" } },
  { name: "Men's Formal Cotton Shirt", category: "fashion", price: 1299, originalPrice: 1799, rating: 4.1, reviewCount: 176, stock: 70,
    description: "Wrinkle-resistant formal shirt tailored for a smart fit, suitable for office and formal occasions.",
    specs: { "Material": "100% Cotton", "Fit": "Regular", "Collar": "Spread", "Available Sizes": "S - XXL" } },

  // Home & Kitchen
  { name: "Stainless Steel Cookware Set (5-Piece)", category: "home-kitchen", price: 3499, originalPrice: 4999, rating: 4.5, reviewCount: 201, stock: 22, featured: true,
    description: "Durable induction-compatible cookware set with tri-ply construction for even heat distribution.",
    specs: { "Material": "Tri-ply Stainless Steel", "Pieces": "5", "Induction Compatible": "Yes", "Dishwasher Safe": "Yes" } },
  { name: "Electric Kettle 1.7L", category: "home-kitchen", price: 1199, originalPrice: 1699, rating: 4.4, reviewCount: 342, stock: 55,
    description: "Rapid-boil electric kettle with auto shut-off, boil-dry protection, and a 360° swivel base.",
    specs: { "Capacity": "1.7 Litres", "Power": "1500W", "Auto Shut-off": "Yes", "Material": "BPA-free plastic & steel" } },
  { name: "Non-Stick Frying Pan 28cm", category: "home-kitchen", price: 799, originalPrice: 1099, rating: 4.2, reviewCount: 165, stock: 80,
    description: "Scratch-resistant non-stick frying pan with an ergonomic handle, compatible with all stovetops including induction.",
    specs: { "Diameter": "28 cm", "Coating": "3-layer non-stick", "Induction Compatible": "Yes" } },
  { name: "Memory Foam Pillow (Set of 2)", category: "home-kitchen", price: 1099, originalPrice: 1599, rating: 4.6, reviewCount: 289, stock: 60, featured: true,
    description: "Ergonomic memory foam pillows that contour to your neck and shoulders for improved sleep posture.",
    specs: { "Material": "Memory foam with cooling gel", "Set Size": "2 pillows", "Cover": "Removable, washable" } },
  { name: "LED Adjustable Desk Lamp", category: "home-kitchen", price: 999, originalPrice: 1399, rating: 4.3, reviewCount: 118, stock: 47,
    description: "Eye-care LED desk lamp with 5 brightness levels, 3 color modes, and a USB charging port.",
    specs: { "Brightness Levels": "5", "Color Modes": "3 (warm/neutral/cool)", "USB Port": "Yes", "Power": "8W" } },
  { name: "Ceramic Dinner Set (18-Piece)", category: "home-kitchen", price: 2799, originalPrice: 3999, rating: 4.4, reviewCount: 97, stock: 19,
    description: "Elegant ceramic dinnerware set for 6, microwave and dishwasher safe with a chip-resistant glaze.",
    specs: { "Pieces": "18", "Service For": "6 people", "Material": "Glazed ceramic", "Microwave Safe": "Yes" } },

  // Beauty & Personal Care
  { name: "Vitamin C Brightening Face Serum", category: "beauty", price: 699, originalPrice: 999, rating: 4.5, reviewCount: 456, stock: 100, featured: true,
    description: "Lightweight serum with 10% Vitamin C to brighten skin tone, fade dark spots, and boost radiance.",
    specs: { "Volume": "30ml", "Key Ingredient": "10% Vitamin C", "Skin Type": "All skin types", "Cruelty-Free": "Yes" } },
  { name: "Professional Ionic Hair Dryer", category: "beauty", price: 1899, originalPrice: 2599, rating: 4.3, reviewCount: 187, stock: 38,
    description: "Fast-drying ionic hair dryer that reduces frizz and static with 3 heat and 2 speed settings.",
    specs: { "Power": "2000W", "Technology": "Ionic", "Settings": "3 heat / 2 speed", "Attachments": "Diffuser & concentrator" } },
  { name: "Rechargeable Electric Toothbrush", category: "beauty", price: 1299, originalPrice: 1899, rating: 4.4, reviewCount: 233, stock: 52,
    description: "Sonic electric toothbrush with 5 cleaning modes, a 2-minute smart timer, and 3 weeks of battery life.",
    specs: { "Modes": "5", "Battery Life": "3 weeks", "Water Resistance": "IPX7", "Included": "2 brush heads" } },
  { name: "Herbal Nourishing Shampoo 400ml", category: "beauty", price: 449, originalPrice: 599, rating: 4.2, reviewCount: 312, stock: 120,
    description: "Sulfate-free herbal shampoo enriched with argan oil for smooth, nourished, frizz-free hair.",
    specs: { "Volume": "400ml", "Key Ingredient": "Argan Oil", "Sulfate-Free": "Yes", "Hair Type": "All hair types" } },
  { name: "Professional Makeup Brush Set (12-Piece)", category: "beauty", price: 899, originalPrice: 1299, rating: 4.5, reviewCount: 198, stock: 44,
    description: "Soft synthetic bristle brush set covering face, eyes, and lips, complete with a travel-friendly pouch.",
    specs: { "Pieces": "12", "Bristles": "Synthetic, cruelty-free", "Includes": "Travel pouch" } },

  // Sports & Outdoors
  { name: "Premium Non-Slip Yoga Mat", category: "sports", price: 799, originalPrice: 1199, rating: 4.6, reviewCount: 267, stock: 85, featured: true,
    description: "Extra-thick 6mm yoga mat with a non-slip textured surface, lightweight and easy to carry.",
    specs: { "Thickness": "6mm", "Material": "TPE (eco-friendly)", "Dimensions": "183 x 61 cm", "Includes": "Carry strap" } },
  { name: "Adjustable Dumbbell Set (2x10kg)", category: "sports", price: 2999, originalPrice: 3999, rating: 4.4, reviewCount: 143, stock: 20,
    description: "Space-saving adjustable dumbbells with quick-lock weight plates, ideal for home strength training.",
    specs: { "Weight Range": "2.5kg - 10kg each", "Material": "Cast iron with rubber coating", "Quantity": "Pair" } },
  { name: "Waterproof Camping Tent (4-Person)", category: "sports", price: 4499, originalPrice: 5999, rating: 4.3, reviewCount: 89, stock: 14,
    description: "Spacious 4-person tent with a waterproof rainfly, quick-pitch poles, and mesh windows for ventilation.",
    specs: { "Capacity": "4 persons", "Waterproof Rating": "3000mm", "Setup Time": "~5 minutes", "Weight": "3.8kg" } },
  { name: "Aerodynamic Cycling Helmet", category: "sports", price: 1599, originalPrice: 2199, rating: 4.2, reviewCount: 112, stock: 36,
    description: "Lightweight, well-ventilated cycling helmet with an adjustable fit dial and rear LED safety light mount.",
    specs: { "Weight": "260g", "Vents": "18", "Adjustable Fit": "Yes", "Certification": "CE certified" } },
  { name: "Men's Running Shoes", category: "sports", price: 2199, originalPrice: 2999, rating: 4.5, reviewCount: 356, stock: 58, featured: true,
    description: "Breathable knit running shoes with responsive cushioning designed for daily training and long runs.",
    specs: { "Upper": "Engineered knit mesh", "Sole": "EVA cushioned", "Available Sizes": "UK 6 - 12" } },

  // Books & Stationery
  { name: "Modern Classics Novel Box Set (5 Books)", category: "books-stationery", price: 1499, originalPrice: 1999, rating: 4.7, reviewCount: 145, stock: 30, featured: true,
    description: "A curated collection of five award-winning modern classic novels in a beautifully designed box set.",
    specs: { "Books Included": "5", "Format": "Paperback", "Language": "English" } },
  { name: "Genuine Leather Journal Notebook", category: "books-stationery", price: 599, originalPrice: 899, rating: 4.6, reviewCount: 210, stock: 75,
    description: "Handcrafted leather-bound journal with 200 lined pages, a ribbon bookmark, and elastic closure.",
    specs: { "Pages": "200", "Paper Type": "Lined, 100gsm", "Cover": "Genuine leather" } },
  { name: "Premium Fountain Pen", category: "books-stationery", price: 799, originalPrice: 1199, rating: 4.4, reviewCount: 88, stock: 42,
    description: "Smooth-writing fountain pen with a stainless steel nib and comfortable metal grip, includes ink converter.",
    specs: { "Nib": "Stainless Steel, Fine", "Body": "Brushed metal", "Includes": "Ink converter" } },
  { name: "Multi-Compartment Desk Organizer", category: "books-stationery", price: 649, originalPrice: 899, rating: 4.2, reviewCount: 76, stock: 40,
    description: "Mesh metal desk organizer with multiple compartments to keep pens, files, and stationery neatly arranged.",
    specs: { "Material": "Mesh metal", "Compartments": "6", "Dimensions": "25 x 15 x 15 cm" } },
  { name: "Hardcover Sketchbook A4", category: "books-stationery", price: 449, originalPrice: 649, rating: 4.5, reviewCount: 132, stock: 68,
    description: "Thick 150gsm acid-free paper sketchbook, perfect for pencil, ink, and light watercolor work.",
    specs: { "Pages": "120", "Paper Weight": "150gsm", "Size": "A4", "Binding": "Hardcover" } },

  // Toys & Games
  { name: "Creative Building Blocks Set (500pcs)", category: "toys-games", price: 1299, originalPrice: 1799, rating: 4.6, reviewCount: 264, stock: 48, featured: true,
    description: "Compatible building block set that sparks creativity, includes storage box and idea booklet.",
    specs: { "Pieces": "500", "Age Range": "6+", "Material": "Non-toxic ABS plastic" } },
  { name: "High-Speed Remote Control Car", category: "toys-games", price: 1899, originalPrice: 2599, rating: 4.3, reviewCount: 176, stock: 32,
    description: "Off-road RC car with rechargeable battery, reaching speeds up to 20km/h on any terrain.",
    specs: { "Speed": "Up to 20km/h", "Battery": "Rechargeable Li-ion", "Control Range": "50m", "Age Range": "8+" } },
  { name: "Classic Family Board Game", category: "toys-games", price: 899, originalPrice: 1299, rating: 4.5, reviewCount: 198, stock: 55,
    description: "The timeless strategy board game for the whole family, 2-6 players, average playtime 60 minutes.",
    specs: { "Players": "2-6", "Playtime": "~60 minutes", "Age Range": "8+" } },
  { name: "Soft Plush Teddy Bear (Large)", category: "toys-games", price: 699, originalPrice: 999, rating: 4.7, reviewCount: 321, stock: 90,
    description: "Extra-soft, huggable plush teddy bear made with hypoallergenic filling, a lovely gift for all ages.",
    specs: { "Height": "60 cm", "Material": "Hypoallergenic plush", "Age Range": "All ages" } },
  { name: "1000-Piece Jigsaw Puzzle", category: "toys-games", price: 549, originalPrice: 799, rating: 4.4, reviewCount: 109, stock: 62,
    description: "Beautifully illustrated 1000-piece jigsaw puzzle, a relaxing challenge for puzzle enthusiasts.",
    specs: { "Pieces": "1000", "Finished Size": "70 x 50 cm", "Age Range": "12+" } },

  // Grocery & Gourmet
  { name: "Organic Green Tea (100 Bags)", category: "grocery", price: 349, originalPrice: 499, rating: 4.5, reviewCount: 245, stock: 150, featured: true,
    description: "Antioxidant-rich organic green tea bags sourced from high-altitude gardens, smooth and refreshing.",
    specs: { "Quantity": "100 tea bags", "Type": "Organic Green Tea", "Caffeine": "Low" } },
  { name: "Assorted Premium Dry Nuts Pack (1kg)", category: "grocery", price: 899, originalPrice: 1199, rating: 4.6, reviewCount: 187, stock: 95,
    description: "A wholesome mix of almonds, cashews, walnuts, and pistachios — freshly packed and preservative-free.",
    specs: { "Net Weight": "1kg", "Contents": "Almonds, cashews, walnuts, pistachios", "Preservatives": "None" } },
  { name: "Cold-Pressed Extra Virgin Olive Oil (1L)", category: "grocery", price: 799, originalPrice: 1099, rating: 4.4, reviewCount: 156, stock: 70,
    description: "First cold-pressed extra virgin olive oil with rich flavor, ideal for cooking and dressings.",
    specs: { "Volume": "1 Litre", "Extraction": "Cold-pressed", "Acidity": "< 0.5%" } },
  { name: "Belgian Dark Chocolate Gift Box (24pcs)", category: "grocery", price: 649, originalPrice: 899, rating: 4.7, reviewCount: 203, stock: 58,
    description: "Assorted Belgian dark chocolate truffles in an elegant gift box, perfect for any occasion.",
    specs: { "Pieces": "24", "Cocoa Content": "55-70%", "Shelf Life": "9 months" } },
  { name: "Raw Organic Forest Honey (500g)", category: "grocery", price: 449, originalPrice: 649, rating: 4.6, reviewCount: 231, stock: 110,
    description: "Unprocessed raw honey harvested from wild forest flora, rich in natural enzymes and flavor.",
    specs: { "Net Weight": "500g", "Type": "Raw, unprocessed", "Additives": "None" } },
];

const REVIEW_POOL = [
  { name: "Aarav Mehta", comment: "Exceeded my expectations, great build quality for the price." },
  { name: "Priya Sharma", comment: "Works exactly as described. Fast delivery too!" },
  { name: "Rohan Verma", comment: "Good value for money, would recommend to friends." },
  { name: "Sneha Iyer", comment: "Decent product but packaging could be better." },
  { name: "Karan Malhotra", comment: "Absolutely love it, using it every day now." },
  { name: "Ananya Gupta", comment: "Quality is top-notch, exactly what I needed." },
  { name: "Vikram Singh", comment: "Solid purchase, no complaints so far." },
  { name: "Isha Kapoor", comment: "A bit pricey but the quality justifies it." },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* Real downloaded product photos live in images/products/{category}/{slug}[-2].jpg
   (see CREDITS.md for sources/licenses). Populated per-slug below; any product not
   yet listed here falls back to a generated placeholder so nothing ever 404s. */
const PRODUCT_IMAGE_FILES = {
  // electronics
  "wireless-bluetooth-headphones": 1,
  "smart-fitness-watch": 1,
  "4k-ultra-hd-action-camera": 1,
  "portable-bluetooth-speaker": 1,
  "wireless-fast-charging-pad": 1,
  "noise-cancelling-wireless-earbuds": 1,
  // grocery
  "organic-green-tea-100-bags": 1,
  "assorted-premium-dry-nuts-pack-1kg": 1,
  "cold-pressed-extra-virgin-olive-oil-1l": 1,
  "belgian-dark-chocolate-gift-box-24pcs": 1,
  "raw-organic-forest-honey-500g": 1,
  // sports
  "premium-non-slip-yoga-mat": 1,
  "adjustable-dumbbell-set-2x10kg": 1,
  "waterproof-camping-tent-4-person": 1,
  "aerodynamic-cycling-helmet": 1,
  "men-s-running-shoes": 1,
  // toys-games
  "creative-building-blocks-set-500pcs": 1,
  "high-speed-remote-control-car": 1,
  "classic-family-board-game": 1,
  "soft-plush-teddy-bear-large": 1,
  "1000-piece-jigsaw-puzzle": 1,
  // home-kitchen
  "stainless-steel-cookware-set-5-piece": 1,
  "electric-kettle-1-7l": 1,
  "non-stick-frying-pan-28cm": 1,
  "memory-foam-pillow-set-of-2": 1,
  "led-adjustable-desk-lamp": 1,
  "ceramic-dinner-set-18-piece": 1,
  // books-stationery
  "modern-classics-novel-box-set-5-books": 1,
  "genuine-leather-journal-notebook": 1,
  "premium-fountain-pen": 1,
  "multi-compartment-desk-organizer": 1,
  "hardcover-sketchbook-a4": 1,
  // beauty
  "vitamin-c-brightening-face-serum": 1,
  "professional-ionic-hair-dryer": 1,
  "rechargeable-electric-toothbrush": 1,
  "herbal-nourishing-shampoo-400ml": 1,
  "professional-makeup-brush-set-12-piece": 1,
  // fashion
  "men-s-slim-fit-denim-jacket": 1,
  "women-s-floral-summer-dress": 1,
  "classic-leather-wallet": 1,
  "unisex-canvas-sneakers": 1,
  "women-s-quilted-handbag": 1,
  "men-s-formal-cotton-shirt": 1,
};

/* Resolves the correct relative prefix for the current page depth (root vs /pages/). */
function assetsRootPrefix() {
  return (typeof document !== "undefined" && document.body?.dataset?.assetsRoot) || "";
}

function getProductImages(product, id) {
  const count = PRODUCT_IMAGE_FILES[product.slug];
  if (!count) {
    return [0, 1, 2].map((n) => generatePlaceholderImage(product.name, product.category, id * 3 + n));
  }
  const base = `${assetsRootPrefix()}images/products/${product.category}/${product.slug}`;
  return count === 1 ? [`${base}.jpg`] : [`${base}.jpg`, `${base}-2.jpg`];
}

function buildReviews(product, index) {
  const count = 2 + (index % 3);
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const reviewer = REVIEW_POOL[(index + i) % REVIEW_POOL.length];
    const starOffset = i === 0 ? 0 : (i % 2 === 0 ? -1 : 0);
    reviews.push({
      name: reviewer.name,
      rating: Math.max(3, Math.min(5, Math.round(product.rating) + starOffset)),
      comment: reviewer.comment,
      date: `2026-0${(1 + (index + i) % 7)}-${10 + ((index + i) % 18)}`,
    });
  }
  return reviews;
}

const PRODUCTS = RAW_PRODUCTS.map((p, index) => {
  const id = index + 1;
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  return {
    id,
    slug: slugify(p.name),
    ...p,
    discount,
    images: getProductImages({ slug: slugify(p.name), category: p.category, name: p.name }, id),
    reviews: buildReviews(p, index),
  };
});

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function getRelatedProducts(product, limit = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

function getFeaturedProducts(limit = 8) {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}
