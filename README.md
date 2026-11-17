# WOODORA — Premium Furniture Website

A recreation of the CODE Furniture (code-furniture.com) layout, motion and scroll system, rebranded as **WOODORA**, a premium contemporary furniture brand, with working e-commerce interactions.

## Run it

You don't need a build step. Open `index.html` in a browser.
For the most accurate results (fonts, storage, CDN caching), serve the folder locally:

```bash
npx serve .          # or: python -m http.server 8080
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: all 9 sections from the reference, in the original order |
| `collection.html` | Collection listing. `?c=warm-living` · `?room=bedroom` · no params = all |
| `product.html` | Product detail. `?id=sculptural-oak-coffee-table` |

## Folder structure

```
WOODORA/
├── index.html · collection.html · product.html
└── assets/
    ├── css/
    │   ├── base.css          tokens (palette, type scale), reset, typography, mosaic
    │   ├── components.css    loader, header, menu, cards, cart drawer, modal, footer
    │   ├── home.css          hero → story → collections → products → statement → gallery → services
    │   └── pages.css         collection + product pages
    ├── img/favicon.svg
    └── js/
        ├── data/catalog.js           products, collections, rooms, services, all image IDs
        ├── core/utils.js             easing (reference curves), text splitter, helpers
        ├── core/smooth-scroll.js     Lenis 1.0.25 ⇄ GSAP ScrollTrigger sync, scroll lock
        ├── components/layout.js      shared header / menu / cart / modal / footer markup
        ├── components/loader.js      first-visit image loader + repeat-visit mosaic
        ├── components/menu.js        menu open/close timeline, overlay imagery
        ├── components/cart.js        localStorage cart + drawer
        ├── components/contact.js     contact modal + toasts
        ├── components/card.js        product/letter cards, checkerboard grid, wave hover
        ├── animations/reveal.js      char fade-in, staggered links, mosaic reveals, header theme
        ├── pages/home.js             home rendering + section motion
        ├── pages/product.js          variants, pricing, gallery, accordion
        ├── pages/collection.js       filtering + listing
        └── main.js                   boot order
```

## Motion system (matched to the reference)

- **Loader:** a progress line, then 7 images that rise and fall, with the last one growing full-bleed into the hero. The hero title then reveals with chars turning in from `rotationY: -40°` in random order. Repeat visits use a 24-column mosaic that dissolves instead.
- **Mosaic reveals:** grids of charcoal squares vanish in random order (`stagger.amount: .75`, `from: random`) when an element reaches 80% of the viewport.
- **Text reveals:** `[animation="fade_in_text"]` triggers at `top 70%`, with a 0.5s `sine.in` random stagger.
- **Editorial images:** two cloned images travel through each frame, scrubbed over 200% of scroll.
- **Collections:** two ivory panels part vertically, taking 1.5s with `sine.out`.
- **Gallery:** a sticky frame where 10 images grow out from the centre in sequence as you scroll.
- **Services:** hovering a row starts its marquee. A cursor-following Swiper (creative vertical effect, 1500ms) shows the matching image and dissolves its own mosaic on first hover.
- **Menu:** 10 stacked bars build the panel and the items rise from line masks. Hovering an item crossfades its image into the full-screen overlay.
- **Breakpoint behaviour:** desktop (≥992px) gets Lenis, the services slider and the image strips. Touch devices keep native scrolling.

## Stack

GSAP 3.12.2 (+ ScrollTrigger, CustomEase) · Lenis 1.0.25 · Swiper 9.4.1. All are loaded from the cdnjs and jsDelivr CDNs. The fonts are Manrope (Google Fonts).

The reference's Webflow runtime, jQuery and Modernizr are left out on purpose. Their jobs (DOM ready, WebP detection, interactions) are handled by the vanilla JS above, so no extra weight is loaded. If you want a bundled build, every file is an independent IIFE on `window.WD`, so Webpack/Vite can concatenate them in the `main.js` order.

## Customising

- **Colors / type:** edit `:root` in `assets/css/base.css`.
- **Products, prices, collections, images:** edit `assets/js/data/catalog.js`. The images are Unsplash IDs; replace them with your own campaign photography by changing the IDs or the `img()` helper.
- **Contact details:** the placeholders are in `components/layout.js` → `footer()`.
- **Checkout:** `[data-checkout]` in `cart.js` is a placeholder. Connect it to Shopify, Stripe or another provider there.
