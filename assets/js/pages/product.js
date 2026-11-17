/* ==========================================================================
   WOODORA — Product detail page
   Swiper image stage + thumbnails, finish/size variants with live pricing,
   quantity, add to cart, animated accordion and related products.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { $, $$, esc, ease, params } = WD.utils;
  const D = WD.data;

  let product = null;
  const state = { finish: null, size: null, qty: 1 };

  function price() {
    const base = product.finishes[state.finish];
    const add = product.sizes ? product.sizes[state.size] || 0 : 0;
    return base + add;
  }

  function related() {
    const pool = D.PRODUCTS.filter((p) => p.id !== product.id);
    const scored = pool.map((p) => ({ p, s: p.collections.filter((c) => product.collections.includes(c)).length + (p.room === product.room ? 1 : 0) }));
    return scored.sort((a, b) => b.s - a.s).slice(0, 2).map((x) => x.p);
  }

  function render() {
    product = D.getProduct(params().get('id')) || D.getProduct(D.SELECTED[0]);
    document.title = `${product.name} — WOODORA`;
    state.finish = Object.keys(product.finishes)[0];
    state.size = product.sizes ? Object.keys(product.sizes)[0] : null;
    const col = D.getCollection(product.collections[0]);
    const room = D.ROOMS[product.room];

    const finishes = Object.keys(product.finishes).map((k) => `
      <button type="button" class="variant_option${k === state.finish ? ' is-active' : ''}" data-finish="${k}">
        <span class="swatch" style="background:${D.FINISHES[k].swatch}"></span>${D.FINISHES[k].name}
      </button>`).join('');
    const sizes = product.sizes ? `
      <div class="variant_group">
        <div class="variant_label"><span>Size</span><span data-size-label>${esc(state.size)}</span></div>
        <div class="variant_options">${Object.keys(product.sizes).map((s) => `
          <button type="button" class="variant_option${s === state.size ? ' is-active' : ''}" data-size="${esc(s)}">${esc(s)}</button>`).join('')}
        </div>
      </div>` : '';

    $('#js-product').innerHTML = `
      <div class="product_gallery">
        <div class="product_thumbs">
          ${product.images.map((id, i) => `<button type="button" class="product_thumb${i === 0 ? ' is-active' : ''}" data-thumb="${i}" aria-label="Image ${i + 1}"><img src="${D.img(id, 200)}" alt=""></button>`).join('')}
        </div>
        <div class="product_stage">
          <div class="swiper" id="js-product-swiper"><div class="swiper-wrapper">
            ${product.images.map((id) => `<div class="swiper-slide"><img src="${D.img(id, 1600)}" alt="${esc(product.name)}"></div>`).join('')}
          </div></div>
          <div class="mosaic_root" animation="mosaic" number_of_columns="16" animation_offset="95"></div>
          <div class="product_stage-nav">
            <button type="button" data-stage="prev">← Prev</button>
            <span data-stage-count>(01/0${product.images.length})</span>
            <button type="button" data-stage="next">Next →</button>
          </div>
        </div>
      </div>

      <div class="product_info">
        <div class="product_info-top">
          <nav class="breadcrumb"><a href="collection.html">Collections</a><span>/</span><a href="collection.html?room=${room.slug}">${room.title}</a></nav>
          <span class="text-oak">(${esc(col.letter)}) ${esc(col.title)}</span>
        </div>
        <div>
          <h1 class="product_title" animation="fade_in_text" animation_offset="100">${esc(product.name)}</h1>
          <div class="product_price" style="margin-top:1rem" data-price>${D.money(price())}</div>
        </div>
        <p class="product_description">${esc(product.description)}</p>
        <div class="variant_group">
          <div class="variant_label"><span>Finish</span><span data-finish-label>${D.FINISHES[state.finish].name}</span></div>
          <div class="variant_options">${finishes}</div>
        </div>
        ${sizes}
        <div class="product_actions">
          <div class="qty_root">
            <button type="button" data-qty-step="-1" aria-label="Decrease quantity">−</button>
            <span data-qty-value>1</span>
            <button type="button" data-qty-step="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="button_primary is-dark" type="button" data-add-to-cart>
            <span class="button_primary_text">Add to cart</span><span class="button_primary_arrow">→</span>
          </button>
        </div>
        <div class="product_details">
          ${accordion('Dimensions', `<dl><dt>Size</dt><dd>${esc(product.dimensions)}</dd><dt>Category</dt><dd>${esc(product.category)}</dd></dl>`, true)}
          ${accordion('Materials & care', `<dl><dt>Materials</dt><dd>${esc(product.materials)}</dd><dt>Care</dt><dd>Wipe with a soft, dry cloth. Re-oil wooden surfaces once a year.</dd></dl>`)}
          ${accordion('Delivery & installation', `<dl><dt>Lead time</dt><dd>${esc(product.leadTime)}</dd><dt>Delivery</dt><dd>White-glove delivery and installation, complimentary over $2,500.</dd></dl>`)}
        </div>
      </div>`;

    const rel = related();
    $('#js-related').innerHTML = WD.card.checkerboard(rel);
  }

  function accordion(title, body, open) {
    return `
      <div class="accordion_item${open ? ' is-open' : ''}">
        <button type="button" class="accordion_trigger" aria-expanded="${open ? 'true' : 'false'}"><span>${title}</span><span class="accordion_icon">+</span></button>
        <div class="accordion_panel" style="${open ? 'height:auto' : ''}"><div class="accordion_panel-inner">${body}</div></div>
      </div>`;
  }

  function bind() {
    const root = $('#js-product');
    let swiper = null;
    const count = $('[data-stage-count]');
    const thumbs = $$('[data-thumb]');
    const sync = (i) => {
      thumbs.forEach((t, k) => t.classList.toggle('is-active', k === i));
      count.textContent = `(0${i + 1}/0${product.images.length})`;
    };

    if (typeof Swiper !== 'undefined') {
      swiper = new Swiper('#js-product-swiper', {
        speed: 1100,
        effect: 'creative',
        grabCursor: true,
        creativeEffect: {
          prev: { translate: ['-20%', 0, -1], opacity: 0.6 },
          next: { translate: ['100%', 0, 0] }
        },
        on: { slideChange: (s) => sync(s.activeIndex) }
      });
    }

    root.addEventListener('click', (e) => {
      const t = e.target;
      const thumb = t.closest('[data-thumb]');
      if (thumb && swiper) swiper.slideTo(Number(thumb.dataset.thumb));
      const nav = t.closest('[data-stage]');
      if (nav && swiper) nav.dataset.stage === 'next' ? swiper.slideNext() : swiper.slidePrev();

      const f = t.closest('[data-finish]');
      if (f) {
        state.finish = f.dataset.finish;
        $$('[data-finish]').forEach((b) => b.classList.toggle('is-active', b === f));
        $('[data-finish-label]').textContent = D.FINISHES[state.finish].name;
        updatePrice();
      }
      const s = t.closest('[data-size]');
      if (s) {
        state.size = s.dataset.size;
        $$('[data-size]').forEach((b) => b.classList.toggle('is-active', b === s));
        $('[data-size-label]').textContent = state.size;
        updatePrice();
      }
      const q = t.closest('[data-qty-step]');
      if (q) {
        state.qty = Math.max(1, Math.min(10, state.qty + Number(q.dataset.qtyStep)));
        $('[data-qty-value]').textContent = state.qty;
      }
      const add = t.closest('[data-add-to-cart]');
      if (add) {
        WD.cart.add(product.id, { finish: state.finish, size: state.size, qty: state.qty });
        add.classList.add('is-added');
        add.querySelector('.button_primary_text').textContent = 'Added to cart';
        setTimeout(() => {
          add.classList.remove('is-added');
          add.querySelector('.button_primary_text').textContent = 'Add to cart';
        }, 1800);
      }
      const trig = t.closest('.accordion_trigger');
      if (trig) toggleAccordion(trig.parentElement);
    });
  }

  function updatePrice() {
    const el = $('[data-price]');
    gsap.fromTo(el, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: ease.custom });
    el.textContent = D.money(price());
  }

  function toggleAccordion(item) {
    const panel = item.querySelector('.accordion_panel');
    const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open);
    item.querySelector('.accordion_trigger').setAttribute('aria-expanded', String(open));
    gsap.to(panel, { height: open ? 'auto' : 0, duration: 0.7, ease: ease.custom, onComplete: () => ScrollTrigger.refresh() });
  }

  function init() { bind(); }

  WD.product = { render, init };
})(window.WD = window.WD || {});
