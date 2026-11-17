/* ==========================================================================
   WOODORA — Scroll reveals shared by all pages
   · fade_in_text   — chars turn in from rotationY −40° in random order
   · staggered_link — letters roll up on hover (desktop)
   · mosaic         — grid of squares vanishes in random order
   · header theme   — header switches to light type over dark sections
   ========================================================================== */
(function (WD) {
  'use strict';

  const { ease, split, revertSplit, playOnEnter, mq, $$ } = WD.utils;

  function fadeInText(scope) {
    $$('[animation*="fade_in_text"]', scope).forEach((el) => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = '1';
      split(el);
      gsap.set(el, { opacity: 1 });
      const keepSplit = (el.getAttribute('animation') || '').indexOf('staggered_link') > -1;
      const tl = gsap.timeline({ paused: true }).from(el.querySelectorAll('.char'), {
        rotationY: -40,
        yPercent: -2,
        opacity: 0,
        duration: 0.5,
        ease: ease.from,
        stagger: { amount: 0.5, from: 'random', ease: ease.from },
        onComplete: () => { if (!keepSplit) revertSplit(el); }
      });
      playOnEnter(el, tl, el.getAttribute('animation_offset') || 70);
    });
  }

  function staggeredLinks(scope) {
    if (!mq.hover()) return;
    $$('[animation*="staggered_link"]', scope).forEach((el) => {
      if (el.dataset.linkBound) return;
      el.dataset.linkBound = '1';
      split(el);
      const letters = el.querySelectorAll('.char');
      el.addEventListener('mouseenter', () => gsap.to(letters, {
        yPercent: -100, duration: 0.5, ease: ease.custom, stagger: { each: 0.03, from: 'start' }, overwrite: 'auto'
      }));
      el.addEventListener('mouseleave', () => gsap.to(letters, {
        yPercent: 0, duration: 0.4, ease: ease.custom, stagger: { each: 0.03, from: 'end' }, overwrite: 'auto'
      }));
    });
  }

  function mosaic(scope) {
    $$('[animation="mosaic"]', scope).forEach((el) => {
      if (el.dataset.mosaicBound) return;
      el.dataset.mosaicBound = '1';
      if (mq.reduced()) { el.remove(); return; }

      const columns = Number(el.getAttribute('number_of_columns')) || 20;
      const fill = () => {
        const w = el.clientWidth || el.parentElement.clientWidth;
        const h = el.clientHeight || el.parentElement.clientHeight;
        const rows = Math.ceil(h / (w / columns)) + 1;
        el.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        el.innerHTML = '<div class="mosaic_square"></div>'.repeat(columns * rows);
      };
      fill();

      const tl = gsap.timeline({ paused: true }).to(el.children, {
        opacity: 0,
        duration: 0,
        ease: ease.to,
        stagger: { amount: 0.75, from: 'random', ease: ease.from },
        onComplete: () => el.remove()
      });
      playOnEnter(el, tl, el.getAttribute('animation_offset') || 80);
    });
  }

  function headerTheme() {
    const header = document.getElementById('header');
    if (!header) return;
    $$('[data-header-theme="dark"]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40px',
        end: 'bottom 40px',
        onToggle: (self) => header.classList.toggle('is-on-dark', self.isActive)
      });
    });
  }

  function init(scope) {
    fadeInText(scope);
    staggeredLinks(scope);
    mosaic(scope);
  }

  WD.reveal = { init, fadeInText, staggeredLinks, mosaic, headerTheme };
})(window.WD = window.WD || {});
