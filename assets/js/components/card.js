/* ==========================================================================
   WOODORA — Product card + letter card
   Renders the reference's checkerboard "selected collection" grid
   (product · letter · product · letter / letter · product · …) and binds the
   three-strip wave hover.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { esc, ease, mq } = WD.utils;
  const { img, priceRange } = WD.data;

  function productCard(p) {
    const src = img(p.images[0], 900);
    const url = `product.html?id=${p.id}`;
    return `
    <div class="card_root" data-card>
      <div class="card_media">
      <a class="card_image-wrapper" href="${url}" aria-label="${esc(p.name)}">
        <img class="card_image" src="${src}" alt="${esc(p.name)}" loading="lazy">
        <img class="card_wave-image is-1" src="${src}" alt="" aria-hidden="true" loading="lazy">
        <img class="card_wave-image is-2" src="${src}" alt="" aria-hidden="true" loading="lazy">
        <img class="card_wave-image is-3" src="${src}" alt="" aria-hidden="true" loading="lazy">
        <div class="mosaic_root" animation="mosaic" number_of_columns="12"></div>
      </a>
      </div>
      <div class="card_meta">
        <h3 class="card_title"><a href="${url}">${esc(p.name)}</a></h3>
        <span class="card_category">${esc(p.category)}</span>
      </div>
      <div class="card_text">
        <span class="card_price">${priceRange(p)}</span>
        <button class="card_quick-add" type="button" data-quick-add="${p.id}">Add to cart</button>
      </div>
    </div>`;
  }

  function letterCard(letter) {
    return `
    <div class="card_root is-letter" aria-hidden="true">
      <div class="card_letter-wrapper"><div class="card_letter">(${esc(letter)})</div></div>
    </div>`;
  }

  /**
   * Interleave products and letter cells in the reference checkerboard.
   * Even rows: P L P L — odd rows: L P L P.
   */
  function checkerboard(products, columns) {
    columns = columns || 4;
    const cells = [];
    let i = 0;
    let row = 0;
    while (i < products.length) {
      for (let c = 0; c < columns && i < products.length; c += 2) {
        const p = products[i];
        if (row % 2 === 0) cells.push(productCard(p), letterCard(p.letter));
        else cells.push(letterCard(p.letter), productCard(p));
        i += 1;
      }
      row += 1;
    }
    return cells.join('');
  }

  /* Wave hover: three strips open from the centre in a staggered sweep */
  function bindHover(scope) {
    if (!mq.hover()) return;
    (scope || document).querySelectorAll('[data-card]').forEach((card) => {
      if (card.dataset.hoverBound) return;
      card.dataset.hoverBound = '1';
      const waves = card.querySelectorAll('.card_wave-image');
      const image = card.querySelector('.card_image');
      let tl = null;

      card.addEventListener('mouseenter', () => {
        if (tl) tl.kill();
        tl = gsap.timeline({ defaults: { ease: ease.custom } })
          .set(waves, { opacity: 1 })
          .fromTo(waves, { clipPath: 'inset(0% 50% 0% 50%)', scale: 1.12 }, {
            clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.9, stagger: 0.12
          })
          .to(image, { scale: 1.06, duration: 1.2 }, 0);
      });
      card.addEventListener('mouseleave', () => {
        if (tl) tl.kill();
        tl = gsap.timeline({ defaults: { ease: ease.custom } })
          .to(waves, { opacity: 0, duration: 0.45, stagger: { each: 0.06, from: 'end' } })
          .to(image, { scale: 1, duration: 0.8 }, 0)
          .set(waves, { clipPath: 'inset(0% 50% 0% 50%)', opacity: 1 });
      });
    });
  }

  WD.card = { productCard, letterCard, checkerboard, bindHover };
})(window.WD = window.WD || {});
