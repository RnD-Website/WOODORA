/* ==========================================================================
   WOODORA — Core utilities
   Easing, breakpoints, text splitting and scroll-trigger helpers shared by
   every module. Motion constants mirror the reference timing.
   ========================================================================== */
(function (WD) {
  'use strict';

  gsap.registerPlugin(ScrollTrigger, CustomEase);

  /* Reference easing set */
  const ease = {
    from: 'sine.in',
    to: 'sine.out',
    custom: CustomEase.create('wdCustom', 'M0,0 C0.168,0 0.216,0.515 0.32,0.734 0.454,1.017 0.743,1 1,1'),
    customInvert: CustomEase.create('wdCustomInvert', 'M1,1 C0.832,1 0.784,0.485 0.68,0.266 0.546,-0.017 0.257,0 0,0')
  };

  const mq = {
    desktop: () => window.matchMedia('(min-width: 992px)').matches,
    hover: () => window.matchMedia('(hover: hover) and (min-width: 1025px)').matches,
    reduced: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /**
   * Split an element's text into .word and .char spans while preserving any
   * inline markup (e.g. <span class="is-em">). Reversible via revertSplit().
   */
  function split(el) {
    if (!el || el.dataset.splitDone) return el;
    el.dataset.splitOriginal = el.innerHTML;
    el.dataset.splitDone = '1';

    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const word = document.createElement('span');
            word.className = 'word';
            Array.from(part).forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'char';
              c.textContent = ch;
              word.appendChild(c);
            });
            frag.appendChild(word);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    return el;
  }

  function revertSplit(el) {
    if (!el || !el.dataset.splitDone) return;
    el.innerHTML = el.dataset.splitOriginal;
    delete el.dataset.splitDone;
    delete el.dataset.splitOriginal;
  }

  /** Play a paused timeline once its trigger crosses `topOffset`% of the viewport. */
  function playOnEnter(trigger, timeline, topOffset) {
    return ScrollTrigger.create({
      trigger,
      start: 'top ' + (topOffset || 70) + '%',
      once: true,
      onEnter: () => timeline.play()
    });
  }

  function scrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  /** Escape HTML for any text interpolated into templates. */
  function esc(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function params() { return new URLSearchParams(window.location.search); }

  WD.utils = { ease, mq, $, $$, split, revertSplit, playOnEnter, scrollbarWidth, esc, params };
})(window.WD = window.WD || {});
