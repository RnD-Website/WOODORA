/* ==========================================================================
   WOODORA — Lenis 1.0.25 smooth scrolling, synced with GSAP ScrollTrigger
   Desktop only (>991px), matching the reference. Touch devices keep native
   momentum scrolling for the most natural feel.
   ========================================================================== */
(function (WD) {
  'use strict';

  let lenis = null;

  function init() {
    if (!WD.utils.mq.desktop() || WD.utils.mq.reduced() || typeof Lenis === 'undefined') return null;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false
    });

    // One clock for everything: Lenis is driven by the GSAP ticker so scroll
    // position and ScrollTrigger updates always land on the same frame.
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Smooth in-page anchor links
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      scrollTo(target);
    });

    return lenis;
  }

  function scrollTo(target, opts) {
    if (lenis) lenis.scrollTo(target, Object.assign({ offset: 0, duration: 1.6 }, opts || {}));
    else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /** Lock / unlock page scroll (menu, cart, modal). */
  let lockCount = 0;
  function lock() {
    lockCount += 1;
    if (lockCount > 1) return;
    const sw = WD.utils.scrollbarWidth();
    if (lenis) lenis.stop();
    document.body.classList.add('overflow-hidden');
    if (sw > 0) {
      document.body.style.paddingRight = sw + 'px';
      const header = document.querySelector('.header_root');
      if (header) header.style.paddingRight = `calc(var(--gutter) + ${sw}px)`;
    }
  }
  function unlock() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount > 0) return;
    if (lenis) lenis.start();
    document.body.classList.remove('overflow-hidden');
    document.body.style.paddingRight = '';
    const header = document.querySelector('.header_root');
    if (header) header.style.paddingRight = '';
  }

  WD.scroll = { init, scrollTo, lock, unlock, get lenis() { return lenis; } };
})(window.WD = window.WD || {});
