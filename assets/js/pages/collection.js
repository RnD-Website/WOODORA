/* ==========================================================================
   WOODORA — Collection listing page
   ?c=<collection-slug>  ·  ?room=<living|bedroom|dining|storage>  ·  (none = all)
   ========================================================================== */
(function (WD) {
  'use strict';

  const { $, esc, params } = WD.utils;
  const D = WD.data;

  function resolve() {
    const p = params();
    const c = D.getCollection(p.get('c'));
    const room = D.ROOMS[p.get('room')];
    if (c) {
      return {
        key: 'c=' + c.slug, letter: c.letter, title: c.title, description: c.description, image: c.image,
        products: D.PRODUCTS.filter((x) => x.collections.includes(c.slug))
      };
    }
    if (room) {
      return {
        key: 'room=' + room.slug, letter: room.title[0], title: room.title,
        description: `Furniture for the ${room.title.toLowerCase()} — natural materials, refined craftsmanship and everyday comfort.`,
        image: room.image, products: D.PRODUCTS.filter((x) => x.room === room.slug)
      };
    }
    return {
      key: '', letter: 'W', title: 'All Collections',
      description: 'Every WOODORA piece across seven collections. Designed to work together, made to last.',
      image: D.IMG.gridLiving, products: D.PRODUCTS.slice()
    };
  }

  function titleMarkup(title) {
    const words = title.split(' ');
    return words.map((w, i) => (i === words.length - 1 ? `<span class="is-em">${esc(w)}</span>` : esc(w))).join(' ');
  }

  function render() {
    const v = resolve();
    document.title = `${v.title} — WOODORA`;

    $('#js-collection-hero').innerHTML = `
      <div class="collection-hero_top">
        <nav class="breadcrumb"><a href="index.html">Home</a><span>/</span><span>Collections</span></nav>
        <span>(${String(v.products.length).padStart(2, '0')}) Pieces</span>
      </div>
      <div class="collection-hero_grid">
        <h1 class="heading-style-h1" animation="fade_in_text" animation_offset="100">
          <span class="collection-hero_letter">(${esc(v.letter)})</span> ${titleMarkup(v.title)}
        </h1>
        <p class="collection-hero_text">${esc(v.description)}</p>
      </div>
      <div class="collection-hero_media">
        <img src="${D.img(v.image, 2000)}" alt="${esc(v.title)}" data-parallax>
        <div class="mosaic_root" animation="mosaic" number_of_columns="20" animation_offset="100"></div>
      </div>`;

    const chip = (label, key) => `<a href="collection.html${key ? '?' + key : ''}" class="${v.key === key ? 'is-active' : ''}">${label}</a>`;
    $('#js-collection-filter').innerHTML =
      chip('All', '') +
      D.COLLECTIONS.map((c) => chip(`(${c.letter}) ${esc(c.title)}`, 'c=' + c.slug)).join('') +
      Object.values(D.ROOMS).map((r) => chip(esc(r.title), 'room=' + r.slug)).join('');

    $('#js-collection-grid').innerHTML = v.products.length
      ? `<div class="cards_group">${WD.card.checkerboard(v.products)}</div>`
      : `<div class="collection-empty">No pieces in this collection yet.</div>`;
  }

  function init() {
    const im = document.querySelector('[data-parallax]');
    if (im) {
      gsap.fromTo(im, { yPercent: -10 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  }

  WD.collection = { render, init };
})(window.WD = window.WD || {});
