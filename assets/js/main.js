/* ==========================================================================
   WOODORA — Application bootstrap
   Order matters: layout → page markup → smooth scroll → UI modules →
   loader → reveals → page motion → refresh once images settle.
   ========================================================================== */
(function (WD) {
  'use strict';

  const page = document.body.dataset.page;
  const pages = { home: WD.home, product: WD.product, collection: WD.collection };
  const current = pages[page];

  // 1. Markup
  WD.layout.render();
  if (current && current.render) current.render();

  // 2. Scroll engine + global UI
  WD.scroll.init();
  WD.menu.init();
  WD.cart.init();
  WD.contact.init();

  // 3. Motion
  const start = () => {
    WD.reveal.init(document);
    WD.reveal.headerTheme();
    WD.card.bindHover(document);
    if (current && current.init) current.init();
    ScrollTrigger.refresh();
  };

  // Section motion is wired immediately (so the hero is ready under the
  // loader); reveals that depend on viewport position start right away too.
  start();
  WD.loader.run(() => ScrollTrigger.refresh());

  // 4. Re-measure once all images have loaded (heights affect triggers)
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // Re-measure on width changes only (ignore mobile URL-bar height changes)
  let lastWidth = window.innerWidth;
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  });
})(window.WD = window.WD || {});
