/* ==========================================================================
   WOODORA — Navigation menu
   Centered toggle → ten stacked bars drop in to build the panel → items
   rise from line masks. Hovering an item crossfades its image into the
   full-screen overlay behind the panel. Clicking the overlay closes it.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { ease, $, $$ } = WD.utils;
  let isOpen = false;

  /* Timings from the reference's Webflow actions "Menu [Show]" / "Menu [Hide]".
     Show: strips slide down in mirrored pairs from the edges inward
     (1&10 → 5&6, 100ms apart, 500ms each), then labels rise from 195%.
     Hide: labels drop out, then strips slide up from the centre outward. */
  const OUT_QUINT = 'power4.out';
  let showTl = null;
  let hideTl = null;
  let wrapper = null;

  function pairs(row) {
    const items = Array.from(row.querySelectorAll('.menu_background_item'));
    const n = items.length;
    return Array.from({ length: n / 2 }, (_, k) => [items[k], items[n - 1 - k]]);
  }

  function build() {
    wrapper = $('#js-menu-wrapper');
    const rows = $$('.menu_row', wrapper);
    const labels = $$('.menu_item_label', wrapper);
    const fades = $$('.menu_anim', wrapper);
    const overlay = $('#js-header-overlay');

    gsap.set($$('.menu_background_item', wrapper), { yPercent: -100 });
    gsap.set(labels, { yPercent: 195 });
    gsap.set(fades, { opacity: 0 });
    gsap.set(overlay, { opacity: 0 });

    showTl = () => {
      const t = gsap.timeline({ defaults: { ease: OUT_QUINT } });
      t.to(overlay, { opacity: 1, duration: 0.5 }, 0);
      rows.forEach((row) => pairs(row).forEach((pr, k) => t.to(pr, { yPercent: 0, duration: 0.5 }, k * 0.1)));
      t.to(labels, { yPercent: 0, duration: 0.6 }, 0.6)
       .to(fades, { opacity: 1, duration: 0.5 }, 0.6);
      return t;
    };
    hideTl = () => {
      const t = gsap.timeline({ defaults: { ease: OUT_QUINT } });
      t.to(labels, { yPercent: 195, duration: 0.6 }, 0)
       .to(fades, { opacity: 0, duration: 0.5 }, 0)
       .to(overlay, { opacity: 0, duration: 0.5 }, 0);
      rows.forEach((row) => {
        const p = pairs(row);
        p.reverse().forEach((pr, k) => t.to(pr, { yPercent: -100, duration: 0.5 }, 0.3 + k * 0.1));
      });
      return t;
    };
  }

  let running = null;

  function open() {
    if (isOpen) return;
    isOpen = true;
    WD.cart && WD.cart.close();
    document.body.classList.add('menu-is-open');
    $('#js-menu-toggle').setAttribute('aria-expanded', 'true');
    wrapper.setAttribute('aria-hidden', 'false');
    WD.scroll.lock();
    if (running) running.kill();
    running = showTl();
  }

  function close(cb) {
    if (!isOpen) { if (cb) cb(); return; }
    isOpen = false;
    $('#js-menu-toggle').setAttribute('aria-expanded', 'false');
    wrapper.setAttribute('aria-hidden', 'true');
    if (running) running.kill();
    running = hideTl();
    running.eventCallback('onComplete', () => {
      document.body.classList.remove('menu-is-open');
      $$('.header_overlay-bg-item').forEach((i) => i.classList.remove('is-active'));
      WD.scroll.unlock();
      if (cb) cb();
    });
  }

  function init() {
    if (!$('#js-menu-toggle')) return;
    build();

    $('#js-menu-toggle').addEventListener('click', () => (isOpen ? close() : open()));
    $('#js-header-overlay').addEventListener('click', () => close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const images = $$('.header_overlay-bg-item');
    $$('[data-menu-item]').forEach((item) => {
      const idx = item.dataset.menuItem;
      item.addEventListener('mouseenter', () => {
        images.forEach((im) => im.classList.toggle('is-active', im.dataset.menuImage === idx));
      });
      item.addEventListener('mouseleave', () => images.forEach((im) => im.classList.remove('is-active')));

      // Same-page anchors: close first, then glide to the section
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        const hashIndex = href.indexOf('#');
        const samePage = hashIndex > -1 && (href.startsWith('#') || window.location.pathname.endsWith(href.slice(0, hashIndex)) || (href.slice(0, hashIndex) === 'index.html' && document.body.dataset.page === 'home'));
        if (samePage) {
          const target = document.querySelector(href.slice(hashIndex));
          if (target) {
            e.preventDefault();
            close(() => WD.scroll.scrollTo(target));
          }
        }
      });
    });
  }

  WD.menu = { init, open, close };
})(window.WD = window.WD || {});
