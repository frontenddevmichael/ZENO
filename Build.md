# Zeno — Build Guide
## Every component, every file, in exact order.

---

> This guide picks up exactly where the Setup Guide left off.
> Every step tells you what files to create, what that file needs to do,
> and what to check in the browser to know it worked.
> No code is written for you — but nothing is left vague.

---

## The Build Order

```
1.  Formatters and utilities
2.  Navbar
3.  Footer
4.  Cart Store
5.  UI Store
6.  Cart Drawer
7.  WhatsApp Button
8.  Homepage — Hero
9.  Homepage — Product Card
10. Homepage — Featured Products
11. Homepage — Category Strip
12. Homepage — Promo Banner
13. Shop Page — Layout
14. Shop Page — Filter Sidebar
15. Shop Page — Product Grid + Sort
16. Product Detail Page — Image Gallery
17. Product Detail Page — Info Panel
18. Product Detail Page — Delivery Estimator
19. Product Detail Page — Tabs
20. Cart Page
21. Checkout — Shipping Form
22. Checkout — Payment Methods
23. Checkout — Review + Message Builder
24. Order Confirmation Page
25. Login Page
26. Signup Page
27. 404 Page
28. States pass
29. Mobile pass
30. Performance pass
```

Work through these in order. Do not jump ahead.

---

## Before You Touch Any Component

### Create your utility files first

These are small helper files. Every component will use at least one of them. Build them before anything visual so they're ready when you need them.

---

### Build 1 — `src/lib/formatters.js`

This file contains functions that format data for display. Every place in the UI that shows a price, a date, or an order number uses one of these functions.

**Functions this file needs:**

`formatPrice(amountInKobo)`
Takes a number stored in kobo (smallest unit — ₦1 = 100 kobo, so ₦45,000 = 4,500,000 kobo). Returns a formatted string like `₦45,000`.
Uses the ₦ symbol — not the word "NGN".
Uses comma separators for thousands.

`generateOrderNumber()`
Returns a string in the format `ZN-XXXX` where XXXX is a random 4-digit number.
Example output: `ZN-3847`

**Verify:**
Open your browser console. Import these functions temporarily and call them with test values. `formatPrice(4500000)` should return `₦45,000`. `generateOrderNumber()` should return something like `ZN-2931`.

---

### Build 2 — `src/lib/queries.js`

This file contains all your Supabase query functions. Nothing else in the project queries Supabase directly — everything goes through this file.

**Functions this file needs:**

`getFeaturedProducts()`
Fetches products where `is_featured` is true and `stock` is greater than 0.
Orders by `created_at` descending (newest first).
Limits to 8 results.

`getProductBySlug(slug)`
Fetches a single product where the slug matches.
Returns the product object or null if not found.

`getProducts(filters)`
Fetches products with optional filters: category, minimum price, maximum price, sort order.
Filters are all optional — if none are passed, returns all in-stock products.
Price filters convert from Naira (what the URL stores) to kobo (what the database stores) — multiply by 100.

`createOrder(orderData)`
Inserts a new row into the orders table.
Returns the created order.

**Verify:**
In your browser console, temporarily call `getFeaturedProducts()` and confirm you get back your test product from Supabase. Check the data shape — you'll need to know what fields are on each product object when you build the cards.

---

### Build 3 — `src/lib/nigerianStates.js`

A simple file that exports one array — the list of all Nigerian states for the checkout form dropdown.

The full list:
Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno, Cross River, Delta, Ebonyi, Edo, Ekiti, Enugu, FCT - Abuja, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina, Kebbi, Kogi, Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau, Rivers, Sokoto, Taraba, Yobe, Zamfara.

No logic needed. Just the exported array.

---

### Build 4 — `src/lib/deliveryRates.js`

An object mapping Nigerian state names to delivery information. Each entry has two things: a delivery time estimate as a string, and a delivery cost as a number in kobo.

At minimum, include: Lagos, Abuja, Ibadan, Port Harcourt, Kano, Enugu, Benin City.
Include a `default` key for any state not in the list.

---

## Global Layout Components

---

### Build 5 — Navbar

**Files to create:**
- `src/components/layout/Navbar.jsx`
- `src/components/layout/Navbar.module.css`

**What it needs to do:**

Structure — three sections in a horizontal line:
- Left: the Zeno wordmark. Clicking it goes to `/`.
- Center: three navigation links — Shop (`/shop`), About (`/about`), Contact (`/contact`). These are `<Link>` components from React Router, not `<a>` tags.
- Right: search icon button, cart icon button with item count badge, account icon button.

Scroll behaviour — when the page is at the very top, the navbar background is transparent. After the user scrolls 80px down, the background becomes white (with slight blur if you want). This needs a scroll event listener in a `useEffect`. Clean up the listener when the component unmounts.

Cart badge — reads the item count from the cart store (which you'll build next). When count is 0, the badge is hidden. When count is 1 or more, the badge shows the number.

Cart icon click — opens the cart drawer. Calls `openCart` from the cart store.

Search icon click — opens the search overlay. Calls `openSearch` from the UI store.

Position — `position: fixed`, full width, top of screen. Uses `--z-navbar` token for z-index. Uses `--height-navbar` token for height.

**After the navbar is in place:**
Every page you build after this needs `padding-top: var(--height-navbar)` on its outermost element, otherwise content hides underneath the navbar. Don't forget this — you will forget this — come back to this line when something looks wrong.

**Verify:**
- Wordmark visible, clicking it navigates to `/`
- On the homepage (which has a tall section), scroll down — navbar should change appearance at 80px
- Open DevTools → Network → reload — confirm no font errors, confirm navbar is `position: fixed`
- Resize to 390px — on mobile the center nav links will look wrong but that's fine, mobile styles come in the mobile pass at the end

---

### Build 6 — Footer

**Files to create:**
- `src/components/layout/Footer.jsx`
- `src/components/layout/Footer.module.css`

**What it needs to do:**

Four columns:
- Column 1: Zeno wordmark + tagline ("Technology, precisely.")
- Column 2: Navigation links (Shop, About, Contact, FAQ)
- Column 3: Support links (WhatsApp, Email, Returns Policy)
- Column 4: Payment logos (Paystack, Mastercard, Visa, Bank Transfer icons)

Bottom bar: a single line with copyright text.

Keep it minimal. This component should take under an hour. Don't over-engineer it.

**Verify:**
- Appears at the bottom of the page
- Links are actual `<Link>` or `<a>` elements, not plain text
- Payment logos are visible (use text placeholders if you don't have the actual SVGs yet — add real logos later)

---

### Build 7 — Cart Store

**File to create:**
- `src/store/cartStore.js`

**What it needs to hold:**
- `items` — array of cart item objects. Each item has: id, name, price (in kobo), image URL, slug, quantity.
- `isOpen` — boolean, whether the cart drawer is open or closed.

**What it needs to do:**
- `addItem(item)` — if the item is already in the cart (match by id), increment its quantity. If it's new, add it with quantity 1. After adding, set `isOpen` to true so the drawer opens.
- `removeItem(id)` — remove the item with that id from the array.
- `updateQuantity(id, qty)` — if qty is 0 or less, remove the item. Otherwise update its quantity.
- `clearCart()` — empty the items array.
- `openCart()` — set `isOpen` to true.
- `closeCart()` — set `isOpen` to false.
- `itemCount()` — returns the total number of items (sum of all quantities, not number of unique products).
- `total()` — returns the total price in kobo (sum of price × quantity for each item).

**Persistence:**
Use Zustand's `persist` middleware. Set the storage key to `'zeno-cart'`. This writes the cart to localStorage so it survives page refresh.

**Verify:**
Open your browser DevTools → Application → Local Storage. Add an item to the cart (you'll need to call the store function manually from the console for now). Refresh the page. The item should still be in localStorage under the key `zeno-cart`.

---

### Build 8 — UI Store

**File to create:**
- `src/store/uiStore.js`

**What it needs to hold:**
- `searchOpen` — boolean, whether the search overlay is open.

**What it needs to do:**
- `openSearch()` — set `searchOpen` to true.
- `closeSearch()` — set `searchOpen` to false.

That's it. Small and simple.

---

### Build 9 — Cart Drawer

**Files to create:**
- `src/components/layout/CartDrawer.jsx`
- `src/components/layout/CartDrawer.module.css`

**What it needs to do:**

This component is always in the DOM. It just moves on and off screen.

Two parts:
1. A dark overlay that covers the whole page behind the drawer.
2. The drawer panel itself — slides in from the right.

When `isOpen` is false in the cart store:
- Overlay has `opacity: 0` and `pointer-events: none` (so it doesn't block clicks)
- Drawer panel is `transform: translateX(100%)` (off-screen right)

When `isOpen` is true:
- Overlay has `opacity: 1` and `pointer-events: auto`
- Drawer panel is `transform: translateX(0)` (visible)

Clicking the overlay calls `closeCart()` from the cart store.
Pressing Escape calls `closeCart()` — add a keydown event listener in a `useEffect`.

Inside the drawer:
- Header: "Your cart" text + an X close button
- Item list: loops through `items` from the cart store. For each item shows: thumbnail image, product name, price, and quantity controls (minus button, number display, plus button). Minus at quantity 1 removes the item.
- Footer: subtotal using `formatPrice(total())` + a button "View cart" that navigates to `/cart` and closes the drawer.

Empty state: when `items` is empty, show a minimal message and a link to `/shop`.

**Verify:**
- Open the cart drawer by clicking the cart icon in the navbar
- Drawer slides in from the right, dark overlay appears
- Click the overlay — drawer closes
- Press Escape — drawer closes
- Drawer is empty with an appropriate message

---

### Build 10 — Search Overlay

**Files to create:**
- `src/components/layout/SearchOverlay.jsx`
- `src/components/layout/SearchOverlay.module.css`

**What it needs to do:**

When `searchOpen` is true in the UI store — show a full-screen overlay with:
- Large text input, auto-focused as soon as the overlay opens (`autoFocus` prop or `ref.focus()` in a `useEffect`)
- Results appearing below the input as the user types
- Each result shows product name, price, and category

Search logic:
- Don't query Supabase on every single keystroke — add a 300ms delay (debounce). After the user stops typing for 300ms, then query.
- Query the products table where the name contains the search term (Supabase's `.ilike()` method handles this).
- Show a loading indicator while fetching.
- Show "No results" if nothing matches.

Closing:
- Pressing Escape closes the overlay (calls `closeSearch()`)
- Clicking outside the search input area closes it

**Verify:**
- Click the search icon → overlay appears, input is focused immediately
- Type a product name that exists in your database → results appear after a short delay
- Press Escape → overlay closes
- Results are clickable and navigate to the product detail page

---

### Build 11 — WhatsApp Button

**Files to create:**
- `src/components/ui/WhatsAppButton.jsx`
- `src/components/ui/WhatsAppButton.module.css`

**What it needs to do:**

A fixed circular button, bottom-right corner. Always visible on every page.
Clicking it opens `https://wa.me/YOURNUMBER` in a new tab.
The number comes from `import.meta.env.VITE_WHATSAPP_NUMBER`.

Style: 48px × 48px circle. WhatsApp green (`#25D366`) background — this is one of the only hardcoded colour values allowed in the project because it's a brand colour. White icon inside.

**Add it to `App.jsx`** — it renders outside the Routes block so it appears on every page.

**Verify:**
- Button visible bottom-right on every page
- Clicking it opens WhatsApp (app on mobile, web.whatsapp.com on desktop)

---

## Homepage

### Build 12 — Hero Section

**Files to create:**
- `src/components/home/Hero.jsx`
- `src/components/home/Hero.module.css`

**What it needs to do:**

Full-width section, minimum 90vh tall.

Left column (55% width):
- A large headline — use `--text-display` size. Keep it short: 2–4 words maximum. Hardcode it for now — "Technology, precisely." or similar.
- One subheading line in `--text-body-lg` size. Secondary colour.
- One primary button: "Shop now" — links to `/shop`.

Right column (45% width):
- A product image area. For now use a placeholder `<div>` with `background: var(--color-bg-subtle)`. You'll swap in a real product image once you have them.
- The image area should be square (aspect-ratio: 1), rounded corners.

Both columns sit side by side using CSS Grid or Flexbox.

The whole section has generous padding top and bottom — use `--space-32`.

**Add it to `src/pages/HomePage.jsx`.**

**Verify:**
- Visit `http://localhost:5173`
- Section is tall, takes most of the viewport
- Headline is large and dominant
- Button is visible and clicking it goes to `/shop`
- Layout doesn't break when you resize the browser window horizontally

---

### Build 13 — Product Card Component

**Files to create:**
- `src/components/product/ProductCard.jsx`
- `src/components/product/ProductCard.module.css`

Build this before Featured Products because Featured Products uses it.

**What it receives as props:**
- `id` — product id
- `name` — product name
- `price` — price in kobo
- `image` — image URL
- `slug` — for the link to the product detail page
- `badge` — optional, one of: `'new'`, `'sale'`, `'low-stock'`
- `inStock` — boolean

**What it needs to show:**
- Image area: square-ish container (aspect-ratio 4/3), background `var(--color-bg-subtle)`, image inside with `object-fit: contain` and padding.
- Product name below the image.
- Price below the name — uses `font-family: var(--font-mono)` and the `formatPrice` function from your formatters file.
- Badge in the top-left corner of the image — only shown if the `badge` prop has a value.

**Hover behaviour:**
- The card lifts slightly — `transform: translateY(-4px)`, slightly darker border.
- A slim dark bar slides up from the bottom of the image area: "Add to cart". This bar is `position: absolute` inside the image container, hidden (`transform: translateY(100%)`) at rest, visible on hover.

**Out of stock:**
- When `inStock` is false: image gets `filter: grayscale(60%)`, the quick-add bar text changes to "Notify me".

**Clicking the card:**
The whole card should navigate to `/shop/[slug]`. Use `useNavigate` from React Router in an `onClick`, or wrap the card in a `<Link>`.

**Clicking "Add to cart":**
Calls `addItem()` from the cart store. Passes the product's id, name, price, image, and slug. Stop the click event from bubbling up to the card's navigation handler (use `e.stopPropagation()`).

**Verify:**
- Temporarily drop `<ProductCard>` into your homepage with hardcoded props
- Image area renders correctly
- Hover — card lifts, quick-add bar slides up
- Clicking the card navigates to `/shop/iphone-15-pro` (404 for now, that's fine)
- Clicking "Add to cart" opens the cart drawer and shows the item inside it
- Cart icon badge in the navbar updates to show count 1

---

### Build 14 — Featured Products Section

**Files to create:**
- `src/components/home/FeaturedProducts.jsx`
- `src/components/home/FeaturedProducts.module.css`

**What it needs to do:**

Fetch featured products from Supabase using `getFeaturedProducts()` from your queries file.
Display them in a 4-column grid using `<ProductCard>` for each one.
Show a section heading — something like "Selected." — left-aligned.
A "View all" link right-aligned that goes to `/shop`.

**Loading state:**
While fetching, show 8 skeleton cards in the same 4-column grid layout. Each skeleton card mirrors the shape of a real product card — a rectangle for the image area, two shorter rectangles for the name and price lines.

**Skeleton component:**
Before building this, create your Skeleton base component.

Files to create:
- `src/components/ui/Skeleton.jsx`
- `src/components/ui/Skeleton.module.css`

It's a grey rectangle with a pulsing animation. Takes optional `width` and `height` props. Default is full width. Use it anywhere you need a loading placeholder.

**Add Featured Products to `src/pages/HomePage.jsx`.**

**Verify:**
- When the page loads, skeleton cards appear briefly then real products appear
- Products display in a 4-column grid
- Each card shows name and price correctly
- Clicking a product navigates to its slug URL
- "View all" link goes to `/shop`

---

### Build 15 — Category Strip

**Files to create:**
- `src/components/home/CategoryStrip.jsx`
- `src/components/home/CategoryStrip.module.css`

**What it needs to do:**

Three large cards side by side.
Categories: Phones, Laptops, Audio. (Or whatever your real categories are.)

Each card:
- Full-bleed background image (use a solid colour placeholder for now if you don't have category images)
- Category name text overlaid at the bottom-left, white text
- A dark overlay on the image so the text is readable
- Clicking navigates to `/shop?category=phones` (or laptops, or audio)

Hover:
- Image scales up slightly (`transform: scale(1.04)` on the image, with `overflow: hidden` on the card so it doesn't overflow)
- Overlay gets slightly darker

**Add to `src/pages/HomePage.jsx`.**

**Verify:**
- Three cards visible side by side
- Hovering scales the image
- Clicking "Phones" goes to `/shop?category=phones`

---

### Build 16 — Promo Banner

**Files to create:**
- `src/components/home/PromoBanner.jsx`
- `src/components/home/PromoBanner.module.css`

**What it needs to do:**

One line of text centered on a `var(--color-bg-subtle)` background.
Something like: "Free delivery on orders above ₦50,000 within Lagos."
No buttons. No images. Just text.

Padding top and bottom: `var(--space-6)`.

**Add to `src/pages/HomePage.jsx`.**

**Verify:**
- Single text line, centered, subtle background
- Whole homepage now has: Hero → Featured Products → Category Strip → Promo Banner

---

## Shop Page

### Build 17 — Custom Hooks

Before building the shop page, create the data-fetching hooks it depends on.

**Files to create:**
- `src/hooks/useProducts.js`
- `src/hooks/useProduct.js`

`useProducts(filters)` — takes an object with optional category, min, max, sort. Calls `getProducts(filters)` from your queries file. Returns `{ products, loading, error }`. Re-fetches whenever the filter values change.

`useProduct(slug)` — takes a slug string. Calls `getProductBySlug(slug)`. Returns `{ product, loading }`.

Both hooks manage their own loading and error state internally using `useState`. They fetch data in a `useEffect`.

**Verify:**
Test each hook temporarily by calling it in a component and logging the result. Confirm `useProducts({})` returns all your products. Confirm `useProduct('iphone-15-pro')` returns the right product.

---

### Build 18 — Shop Page Layout

**Files to create:**
- `src/pages/ShopPage.jsx`
- `src/pages/ShopPage.module.css`

**What it needs to do:**

Two-column layout:
- Left: `var(--width-sidebar)` (280px) fixed-width filter sidebar
- Right: flexible width product grid area

The page reads its filter state from the URL query parameters using `useSearchParams` from React Router. Not from component state — from the URL.

At this stage just set up the layout shell. The filter sidebar and grid are separate components built next.

**Verify:**
- Visiting `/shop` shows the two-column layout
- Left column is narrow (sidebar), right column fills the rest
- No content yet, just the layout structure

---

### Build 19 — Filter Sidebar

**Files to create:**
- `src/components/product/FilterSidebar.jsx`
- `src/components/product/FilterSidebar.module.css`

**What it needs to do:**

Three filter groups:

**Category** — checkboxes: Phones, Laptops, Audio, Accessories.
Checking one sets `?category=phones` in the URL via `setSearchParams`.
Only one category can be active at a time (radio behaviour with checkbox style).

**Price range** — two number inputs: minimum and maximum.
Update the URL when the user leaves the input field (`onBlur`), not on every keystroke.
Labels show: "Min ₦" and "Max ₦".

**Brand** — checkboxes. For now hardcode 3–4 brand names you actually sell. Later these can be dynamic.

**Clear all filters** — a text link that resets all URL params. Only visible when at least one filter is active.

**Active filter pills:**
Above the product grid (not inside the sidebar), show the currently active filters as small dismissible pills. Each has an X button that removes just that filter. Build this inside the ShopPage component, not inside the sidebar.

**Verify:**
- Checking "Phones" updates the URL to `/shop?category=phones`
- Entering min/max prices updates the URL on blur
- The URL changes are the filter — confirm by manually typing `/shop?category=laptops` and seeing the laptop checkbox appear checked
- Clear all removes all query params

---

### Build 20 — Product Grid and Sort Bar

**Files to create:**
- `src/components/product/ProductGrid.jsx`
- `src/components/product/ProductGrid.module.css`

**What it needs to do:**

Uses the `useProducts` hook, passing in the current filter values from `useSearchParams`.

Sort bar — a `<select>` dropdown at the top right of the grid:
- Newest (default)
- Price: low to high
- Price: high to low

Changing the sort updates `?sort=price-asc` in the URL.

Grid: 3 columns, uses `<ProductCard>` for each product.

**States:**
- Loading — show 6 skeleton cards in the 3-column grid
- Results — show product cards
- Empty — when filters return no results: centered message, "Clear filters" link

**Verify:**
- `/shop` shows all products in 3 columns
- `/shop?category=phones` shows only phones
- Sort dropdown changes the order of results
- Triggering the empty state (filter for something that doesn't exist) shows the empty message, not a broken grid

---

## Product Detail Page

### Build 21 — Image Gallery

**Files to create:**
- `src/components/product/ProductGallery.jsx`
- `src/components/product/ProductGallery.module.css`

**What it receives as props:**
- `images` — array of image URLs

**What it needs to do:**

Main image — large, square container. Currently selected image displayed inside with `object-fit: contain` and padding. Background `var(--color-bg-subtle)`.

Thumbnails — a row of 4 small squares below the main image. Clicking one swaps the main image. The active thumbnail has a slightly darker border.

Hover zoom — when hovering the main image, the image scales up slightly inside the container. Use `overflow: hidden` on the container and `transform: scale(1.08)` on the image with a smooth transition. No lightbox, no new window — just CSS scale.

**Verify:**
Temporarily pass an array of image URLs as props. Click thumbnails — main image swaps. Hover main image — zooms.

---

### Build 22 — Product Info Panel

**Files to create:**
- `src/components/product/ProductInfo.jsx`
- `src/components/product/ProductInfo.module.css`

**What it receives as props:**
- The full product object from Supabase

**What it needs to show, in this order:**
1. Product name — `--text-h2` size
2. Price — `font-family: var(--font-mono)`, `--text-h3` size, uses `formatPrice()`
3. Short description — `--text-body`, secondary colour, max 3 sentences
4. Spec pills — small horizontal pills showing 3–4 key specs pulled from `product.specs`. Example: "128GB", "8GB RAM", "6.7″". Each pill has a light background and rounded corners.
5. Quantity selector — a minus button, a number showing the current quantity (starts at 1, minimum 1), a plus button. Local state — doesn't go in the global store until "Add to cart" is clicked.
6. Add to Cart button — full width, primary style. Calls `addItem()` from cart store with the product data and selected quantity. Opens the cart drawer.
7. Delivery Estimator — (built next, dropped in here)
8. WhatsApp enquiry link — text link that opens WhatsApp with a pre-filled message like "Hi, I'm interested in the iPhone 15 Pro"

**The sticky behaviour:**
This panel must be sticky. When the user scrolls down through the image gallery and the product tabs, this panel stays in view. Use `position: sticky` with `top` set to navbar height plus some breathing room. The panel also needs `align-self: start` on the grid to make sticky work correctly.

**Verify:**
- Scroll down on a product page — the info panel stays fixed on the right while the left side scrolls
- Add to cart adds the item to the cart store and opens the drawer
- Quantity selector goes down to 1 minimum, increasing quantity correctly adds multiple of same item

---

### Build 23 — Delivery Estimator

**Files to create:**
- `src/components/product/DeliveryEstimator.jsx`
- `src/components/product/DeliveryEstimator.module.css`

**What it needs to do:**

A small section inside the product info panel.

A text input: placeholder "Enter your state".
A "Check" button next to it.

When the button is clicked:
- Look up the entered state in your `deliveryRates.js` file (case-insensitive match)
- If found: show "X business days · ₦X,XXX delivery" inline below the input
- If not found: use the `default` rate from your delivery rates file

No API call. No loading state. Instant lookup from the local object.

**Verify:**
- Type "Lagos" and click Check — shows Lagos delivery time and cost
- Type "Zamfara" — shows the default rate
- Type gibberish — shows the default rate

---

### Build 24 — Product Detail Page Assembly

**Files to create:**
- `src/pages/ProductDetailPage.jsx`
- `src/pages/ProductDetailPage.module.css`

**What it needs to do:**

Reads the `:slug` from the URL using `useParams`.
Calls `useProduct(slug)` to fetch the product.

**Loading state:** skeleton placeholders for both the gallery and info panel areas.

**Not found state:** if `useProduct` returns null, redirect to `/404` using `useNavigate`.

**Layout:** Two columns side by side.
- Left column 55%: `<ProductGallery images={product.images} />`
- Right column 45%: `<ProductInfo product={product} />`

**Product Tabs** — below the two-column layout:
Three tabs: Description, Specifications, Reviews.

Tab state is local to this component. Clicking a tab shows that tab's content.

- Description: the full `product.description` text in readable paragraphs
- Specifications: a two-column table, alternating row background. Left column is the spec name, right column is the value. Data comes from `product.specs` — loop through the keys and values of that object.
- Reviews: for now, a placeholder section — "Reviews coming soon." You'll add real reviews later.

**Verify:**
- Navigate to `/shop/iphone-15-pro` (or whatever slug your test product has)
- Product name, price, and description display correctly
- Gallery images show (even if it's just one image for now)
- Sticky panel stays in view while scrolling
- Clicking each tab shows different content
- Typing a state in the delivery estimator returns a result

---

## Cart Page

### Build 25 — Cart Page

**Files to create:**
- `src/pages/CartPage.jsx`
- `src/pages/CartPage.module.css`

**What it needs to do:**

Two-column layout: item list on the left, order summary card on the right.

**Item list:**
Each row shows: product thumbnail (80×80px), product name, price, quantity controls (same minus/number/plus as the product page), and a "Remove" text link.

Changing quantity here updates the cart store directly.
Clicking Remove calls `removeItem(id)` from the cart store.

**Order summary card:**
Sticky. Shows: subtotal using `formatPrice(total())`, a delivery note ("Calculated at checkout"), a grand total line, and a full-width primary button "Proceed to checkout" that navigates to `/checkout`.

**Empty state:**
When `items.length === 0`: do not show the two-column layout. Show a centered message — a heading ("Your cart is empty"), one line of copy, and a button back to `/shop`.

**Verify:**
- Add a product from the homepage or product page
- Navigate to `/cart`
- Item appears in the list with correct name and price
- Change quantity — total updates immediately
- Remove an item — row disappears
- Remove all items — empty state appears
- "Proceed to checkout" navigates to `/checkout`

---

## Checkout Pages

### Build 26 — Checkout Page Shell and Progress Indicator

**Files to create:**
- `src/pages/CheckoutPage.jsx`
- `src/pages/CheckoutPage.module.css`

**What it needs to do:**

Manages which step is active using local `useState`. Three possible values: 1, 2, or 3.
Stores the shipping data when step 1 completes.
Stores the payment method when step 2 completes.

**Progress indicator** at the top: three steps shown in a horizontal line. Step 1 "Shipping", Step 2 "Payment", Step 3 "Review". The current step is visually distinct from the others. Completed steps are marked as done.

**Two-column layout** below the progress indicator:
- Left: the active step's form content (changes with each step)
- Right: sticky order summary (always visible, never changes)

**Order summary component** (right column):
A card showing every item in the cart with quantity and price. Total at the bottom. This component reads directly from the cart store.

Build the shell and progress indicator now. The step content components come next.

**Verify:**
- Visiting `/checkout` shows the progress indicator and the two-column layout
- Right column shows your cart items (add something to cart first if needed)

---

### Build 27 — Shipping Form (Step 1)

**Files to create:**
- `src/components/checkout/ShippingForm.jsx`
- `src/components/checkout/ShippingForm.module.css`

**What it needs to do:**

A form with these fields using your `<Input>` component:
- Full name (required)
- Phone number (required) — label it prominently as the main contact method
- Email address (required)
- Delivery address (required) — street and area
- City (required)
- State (required) — a `<select>` dropdown using your nigerianStates array
- Closest landmark (optional) — smaller label note: "Helps with delivery"

When the user clicks "Continue to Payment":
- Validate all required fields — show an error message below any empty required field
- Validate phone number — Nigerian format (starts 07, 08, or 09, exactly 11 digits)
- Validate email — contains @ and a domain
- If validation passes, call the `onNext` prop function passing the form data
- The parent (CheckoutPage) stores this data and advances to step 2

**Verify:**
- Clicking Continue with empty fields shows validation errors
- Filling all fields correctly and clicking Continue advances to step 2 (progress indicator updates)
- Going back to step 1 (if you add a back button) keeps the form values filled in

---

### Build 28 — Payment Methods (Step 2)

**Files to create:**
- `src/components/checkout/PaymentMethods.jsx`
- `src/components/checkout/PaymentMethods.module.css`

**What it needs to do:**

Three full-width selectable tiles:

**Bank Transfer** — "Pay to our bank account. Details provided after order confirmation."

**USSD** — "Transfer via USSD code from any bank. Details provided after order confirmation."

**Pay on Delivery** — "Pay cash when your order arrives. Available in select areas."

Each tile is a large card. Clicking one selects it (visually highlighted, slightly darker border or accent left border). Only one can be selected at a time.

A "Continue to Review" button below the tiles.
Clicking it with no tile selected shows an error message: "Please select a payment method."
With a tile selected, calls `onNext` with the selected payment method and advances to step 3.

**Verify:**
- Three tiles visible
- Clicking one highlights it, deselects the others
- Clicking Continue with nothing selected shows an error
- Selecting one and clicking Continue advances to step 3

---

### Build 29 — Review Step and WhatsApp Message Builder (Step 3)

**Files to create:**
- `src/components/checkout/ReviewStep.jsx`
- `src/components/checkout/ReviewStep.module.css`
- `src/lib/messageBuilder.js`

**Message builder — `src/lib/messageBuilder.js`:**

A function that takes:
- `orderNumber` — the generated ZN-XXXX string
- `shipping` — the form data from step 1
- `items` — the cart items array
- `total` — total in kobo
- `paymentMethod` — selected payment method string

Returns a single string formatted as a readable WhatsApp message.

The message structure:
```
New Order — [ORDER NUMBER]

CUSTOMER
Name: [name]
Phone: [phone]
Address: [address], [city], [state]

ORDER
• [product name] x[qty] — [price]
• [product name] x[qty] — [price]

SUBTOTAL: [subtotal]
DELIVERY: To be confirmed
TOTAL: [total]

PAYMENT: [method]

Please confirm this order.
```

Keep product names short if they're long — truncate to 30 characters with "..." if needed. This keeps the URL manageable.

After building the message string, URL-encode it using `encodeURIComponent()` before constructing the wa.me URL.

**Review step component:**

Shows a read-only summary:
- Delivery address (from shipping data)
- Every cart item with quantity and price
- Selected payment method
- Total

One button: "Place Order on WhatsApp"

When clicked:
1. Generate an order number using `generateOrderNumber()`
2. Save the order to Supabase using `createOrder()` — status should be `'pending_whatsapp'`
3. Build the WhatsApp message using your message builder function
4. Construct the wa.me URL: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
5. Open the URL using `window.open(url, '_blank')`
6. Call `clearCart()` from the cart store
7. Navigate to `/order/[order-id]` (the id returned from Supabase)

**Verify:**
- Review step shows all the correct details from the previous steps
- Clicking "Place Order on WhatsApp" opens WhatsApp (or WhatsApp Web on desktop)
- The message in WhatsApp is pre-filled and readable
- The cart is cleared after clicking
- You're redirected to the order confirmation page

---

### Build 30 — Order Confirmation Page

**Files to create:**
- `src/pages/OrderConfirmPage.jsx`
- `src/pages/OrderConfirmPage.module.css`

**What it needs to do:**

Reads the order id from the URL using `useParams`.
Fetches the order from Supabase.

Shows:
- A subtle success indicator (a checkmark or a simple visual, nothing flashy)
- The order number large and visible — `ZN-XXXX`
- **In bold or large text:** "Your order is only confirmed once you send the WhatsApp message."
- A summary of what was ordered (items and total)
- The delivery address
- What happens next: "We'll confirm your order within [X] hours and arrange delivery."
- A "Continue shopping" link back to `/shop`

**Verify:**
- After completing the checkout flow, you land here automatically
- Order number is clearly visible
- The WhatsApp send reminder is prominent — not a small footnote
- "Continue shopping" goes back to the shop

---

## Auth Pages

### Build 31 — Login Page

**Files to create:**
- `src/pages/LoginPage.jsx`
- `src/pages/LoginPage.module.css`

**What it needs to do:**

Simple, centered form. Email input, password input, submit button.

Calls Supabase's `signInWithPassword` method on submit.

**States:**
- Default — form ready to fill
- Loading — button shows spinner, inputs disabled
- Error — wrong credentials, no account found, or network error — show a clear message below the form
- Success — redirect to homepage or wherever the user was trying to go

A link below the form: "Don't have an account? Sign up" → goes to `/signup`.

**Verify:**
- Submitting with wrong credentials shows a clear error
- Submitting with correct credentials redirects to the homepage
- Supabase creates a session (check DevTools → Application → Local Storage for Supabase session data)

---

### Build 32 — Signup Page

**Files to create:**
- `src/pages/SignupPage.jsx`
- `src/pages/SignupPage.module.css`

**What it needs to do:**

Centered form. Full name input, email input, password input, confirm password input, submit button.

Validate before submitting:
- Password is at least 8 characters
- Password and confirm password match

Calls Supabase's `signUp` method on submit.

**States:** same as login — default, loading, error, success.

A link below the form: "Already have an account? Sign in" → goes to `/login`.

**Verify:**
- Mismatched passwords show an error before submitting
- Successful signup redirects to homepage
- New user appears in Supabase → Authentication → Users

---

### Build 33 — 404 Page

**Files to create:**
- `src/pages/NotFoundPage.jsx`
- `src/pages/NotFoundPage.module.css`

**What it needs to do:**

Clean, minimal. A headline, one line of copy, a link back to the homepage.

No giant graphics. No animations. Just a useful, calm message.

This page handles the `*` route in React Router — any URL that doesn't match a real route.

**Verify:**
- Visit any nonsense URL like `/this-does-not-exist`
- See the 404 page
- Clicking the home link works

---

## The Three Passes

### Pass 1 — States and Edge Cases

Go back through every page. For each one, intentionally trigger these situations and make sure they look intentional:

**Loading** — disconnect your internet briefly and reload. Do you see skeleton screens or blank white areas?

**Empty** — remove all items from your cart and visit `/cart`. Does the empty state show? Visit `/shop?category=doesnotexist`. Does the empty grid show?

**Error** — what happens if Supabase goes down momentarily? Add a temporary error throw to one of your query functions and check that something visible tells the user what happened.

**Form validation** — on every form (search, shipping, login, signup), submit without filling anything in. Every required field should show an error message near the field itself, not a generic alert at the top.

---

### Pass 2 — Mobile

Set your browser DevTools to iPhone SE size (375px wide) and go through every page.

Check for:
- Navbar center links should be hidden. Bottom tab bar should appear.
- Filter sidebar should not appear. A "Filters" button should open a bottom sheet.
- Product grids should be 1 column.
- Cart drawer should be nearly full width.
- Checkout form fields should be large and comfortable to tap.
- WhatsApp button should be above the bottom tab bar, not overlapping it.
- No horizontal scroll on any page.
- No text overflowing its container.
- Buttons and tappable areas should be at least 44px tall.

---

### Pass 3 — Performance

Run `npm run build` and look at the output file sizes.

Then run `npm run preview` to test the production build locally.

Check:
- Every `<img>` below the fold has `loading="lazy"`
- The hero image has `loading="eager"` (it's above the fold, load it immediately)
- No library imported in a file that doesn't use it
- Open DevTools → Network → reload — check how many requests are made and how long the page takes to become interactive on a simulated Slow 3G connection

---

## After All Passes — Deploy

Follow the deployment steps in the Setup Guide. Then run through the entire purchase flow on the live site on a real mobile phone:

Add a product → Cart → Checkout → Fill form → Select payment method → Place order → WhatsApp opens with pre-filled message → Send → Check Supabase for the order record.

If that flow completes end to end — Zeno is live.

---

*Zeno Build Guide v1.0*