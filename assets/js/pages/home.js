/* ==========================================================================
   WOODORA — Home page
   Renders data-driven sections, then wires the section-specific motion:
   hero parallax · scroll-scrubbed image strips · collection curtain ·
   statement parallax · sticky zoom gallery · services marquee + slider.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { ease, mq, $, $$, esc, playOnEnter } = WD.utils;
  const D = WD.data;

  /* ------------------------------------------------------------------------
     Render
     ------------------------------------------------------------------------ */
  function renderCollections() {
    const root = $('#js-collections');
    if (!root) return;
    const cells = D.COLLECTIONS.map((c) => `
      <a class="benefit_root" href="collection.html?c=${c.slug}">
        <img class="benefit_image" src="${D.img(c.image, 900)}" alt="" loading="lazy">
        <div class="benefit_content">
          <div class="benefit_letter">(${c.letter})</div>
          <h3 class="benefit_title">${esc(c.title)}</h3>
          <div class="benefit_description">
            <div>${esc(c.description)}</div>
            <span class="benefit_link">Explore collection <span>→</span></span>
          </div>
        </div>
      </a>`).join('');
    const cta = `
      <a class="benefit_root is-cta" href="collection.html">
        <div class="benefit_content">
          <div class="benefit_letter">(—)</div>
          <h3 class="benefit_title">All collections</h3>
          <div class="benefit_description">
            <div>Seven collections, one language of natural materials and quiet form. Browse every piece in one place.</div>
            <span class="benefit_link" style="opacity:1;transform:none">View all <span>→</span></span>
          </div>
        </div>
      </a>`;
    root.innerHTML = cells + cta;
  }

  function renderSelected() {
    const root = $('#js-selected');
    if (!root) return;
    root.innerHTML = WD.card.checkerboard(D.SELECTED.map(D.getProduct));
  }

  function renderGallery() {
    const grid = $('#js-gallery-grid');
    if (!grid) return;
    // image index → quarter (mirrors the reference distribution)
    const quarters = { 1: [2, 8], 2: [3, 6, 7], 3: [1, 5, 9], 4: [4, 10] };
    grid.innerHTML = [1, 2, 3, 4].map((q) => `
      <div class="gallery_quarter is-${q}">
        ${quarters[q].map((n) => `<img class="gallery_image is-${n}" data-order="${n}" src="${D.img(D.GALLERY[n - 1], 1200)}" alt="WOODORA lookbook image ${n}" loading="lazy">`).join('')}
      </div>`).join('');
  }

  function renderServices() {
    const list = $('#js-services-list');
    const wrapper = $('#js-services-swiper .swiper-wrapper');
    if (!list) return;
    const COPIES = 8;
    list.innerHTML = D.SERVICES.map((s, i) => {
      const unit = (visible) => `
        <div class="fancy-list_text-wrapper${visible ? ' is-visible' : ''}">
          <div class="fancy-list_text is-arrow">→</div>
          <div class="fancy-list_text">${esc(s.title)}</div>
        </div>`;
      const copies = Array.from({ length: COPIES }, (_, k) => unit(k === COPIES - 1)).join('');
      return `
      <div class="fancy-list_item" js="fancy-item" data-index="${i}" tabindex="0">
        <div class="fancy-list_fill"></div>
        <span class="fancy-list_index">(${String(i + 1).padStart(2, '0')})</span>
        <div class="fancy-list_track">${copies}</div>
      </div>`;
    }).join('');
    if (wrapper) {
      wrapper.innerHTML = D.SERVICES.map((s) => `
        <div class="swiper-slide"><img src="${D.img(s.image, 800)}" alt="${esc(s.title)}" loading="lazy"></div>`).join('');
    }
  }

  function renderLoaderImages() {
    const loader = $('#loader');
    if (!loader) return;
    const set = [D.IMG.warmBedroom, D.IMG.consoleLiving, D.IMG.oakDining, D.IMG.sculptChair, D.IMG.linenBedroom, D.IMG.floatCabinet, D.IMG.heroLiving];
    loader.insertAdjacentHTML('beforeend', set.map((id, i) =>
      `<div class="loader_image is-${i + 1}${i === set.length - 1 ? ' is-last' : ''}" style="background-image:url('${D.img(id, i === set.length - 1 ? 2200 : 1000)}')"></div>`).join(''));
  }

  function render() {
    renderLoaderImages();
    renderCollections();
    renderSelected();
    renderGallery();
    renderServices();
  }

  /* ------------------------------------------------------------------------
     Motion
     ------------------------------------------------------------------------ */
  function heroParallax() {
    const bg = $('.hero_background');
    if (!bg) return;
    gsap.to(bg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.section_hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* Each editorial image gets two clones that travel through the frame as
     you scroll, creating the reference's continuous "film strip" effect. */
  function imageStrips() {
    if (!mq.desktop()) return;
    $$('[animation="image_slider"]').forEach((image) => {
      const inner = image.closest('.introduce_image-inner');
      const cls = image.getAttribute('class');
      const src = image.getAttribute('src');
      image.insertAdjacentHTML('beforebegin',
        `<img class="${cls} is-start is-animated" src="${src}" alt="" aria-hidden="true">` +
        `<img class="${cls} is-end is-animated" src="${src}" alt="" aria-hidden="true">`);
      const start = inner.querySelector('.is-start');
      const end = inner.querySelector('.is-end');
      gsap.set(start, { top: '-80%' });
      gsap.set(end, { top: '20%' });
      gsap.timeline({
        defaults: { ease: ease.from },
        scrollTrigger: { trigger: inner, start: 'top bottom-=5%', end: '+=200%', scrub: true }
      }).fromTo(inner.querySelectorAll('.is-animated'), { yPercent: 100 }, { yPercent: -100 });
    });
  }

  /* Two ivory figures part vertically to unveil the collection grid */
  function collectionsCurtain() {
    const bg = $('#js-benefits-bg');
    if (!bg) return;
    const tl = gsap.timeline({ paused: true, defaults: { duration: 1.5, ease: ease.to } })
      .to('#js-benefit-bg-figure-1', { yPercent: -100 })
      .to('#js-benefit-bg-figure-2', { yPercent: 100, onComplete: () => bg.remove() }, '<');
    playOnEnter('#js-benefits', tl, 55);
  }

  function statementParallax() {
    const bg = $('.sample_background');
    if (!bg) return;
    gsap.fromTo(bg, { yPercent: -8, scale: 1.15 }, {
      yPercent: 8,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.sample_root', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* Sticky zoom gallery — the reference's Webflow keyframes ("Gallery Items
     [Movement @Desktop]"), reproduced 1:1. Positions are % of the gallery's
     scroll progress (top enters viewport → bottom leaves). Every segment eases
     with sine.in, as in the original. Each image fades/sharpens in, zooms to
     2× and then flies off diagonally, revealing the layer underneath. */
  const GALLERY_KEYS = {
    1:  { scale: [[13, 1], [34, 2]], move: [[13, 0, 0], [34, -150, 200]] },
    2:  { scale: [[13, 0.75], [30, 2]], opacity: [[13, 0.75], [20, 1]], blur: [[15, 4], [20, 0]], move: [[15, 0, 0], [36, -150, -200]] },
    3:  { scale: [[18, 0.5], [32, 2]], opacity: [[15, 0.5], [24, 1]], blur: [[15, 10], [24, 0]], move: [[18, 0, 0], [38, 150, -200]] },
    4:  { scale: [[18, 0.5], [34, 2]], opacity: [[15, 0.1], [24, 1]], blur: [[15, 10], [24, 0]], move: [[18, 0, 0], [40, 150, 200]] },
    5:  { scale: [[20, 0.25], [52, 2]], opacity: [[16, 0], [21, 0.1], [36, 1]], blur: [[16, 10], [21, 10], [36, 0]], move: [[20, 0, 0], [58, -150, 170]] },
    6:  { scale: [[24, 0.25], [52, 2]], opacity: [[16, 0], [25, 0.1], [36, 1]], blur: [[16, 10], [25, 10], [36, 0]], move: [[24, 0, 0], [58, 150, -200]] },
    7:  { scale: [[30, 0.15], [88, 1.5]], opacity: [[18, 0], [34, 0.1], [60, 1]], blur: [[18, 10], [34, 10], [60, 0]], move: [[30, 0, 0], [91, 60, -40]] },
    8:  { scale: [[20, 0.25], [80, 1.5]], opacity: [[18, 0], [22, 0.1], [48, 1]], blur: [[18, 10], [22, 10], [48, 0]], move: [[20, 0, 0], [83, -60, -40]] },
    9:  { scale: [[30, 0.15], [88, 1.5]], opacity: [[18, 0], [30, 0.1], [60, 1]], blur: [[18, 10], [30, 10], [60, 0]], move: [[30, 0, 0], [94, -60, 40]] },
    10: { scale: [[22, 0.2], [80, 1.5]], opacity: [[18, 0], [52, 1]], blur: [[18, 10], [52, 0]], move: [[22, 0, 0], [86, 60, 40]] }
  };

  function galleryZoom() {
    const root = $('.gallery_root');
    if (!root) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true }
    });
    const seg = (el, from, to, vars) => {
      tl.to(el, Object.assign({ duration: (to - from) / 100, ease: 'sine.in' }, vars), from / 100);
    };

    $$('.gallery_image', root).forEach((im) => {
      const k = GALLERY_KEYS[im.dataset.order];
      if (!k) return;
      // first keyframe values hold until their keyframe is reached
      gsap.set(im, {
        scale: k.scale[0][1],
        xPercent: k.move[0][1],
        yPercent: k.move[0][2],
        opacity: k.opacity ? k.opacity[0][1] : 1,
        filter: k.blur ? `blur(${k.blur[0][1]}px)` : 'blur(0px)'
      });
      for (let i = 1; i < k.scale.length; i++) seg(im, k.scale[i - 1][0], k.scale[i][0], { scale: k.scale[i][1] });
      for (let i = 1; i < k.move.length; i++) seg(im, k.move[i - 1][0], k.move[i][0], { xPercent: k.move[i][1], yPercent: k.move[i][2] });
      if (k.opacity) for (let i = 1; i < k.opacity.length; i++) seg(im, k.opacity[i - 1][0], k.opacity[i][0], { opacity: k.opacity[i][1] });
      if (k.blur) for (let i = 1; i < k.blur.length; i++) seg(im, k.blur[i - 1][0], k.blur[i][0], { filter: `blur(${k.blur[i][1]}px)` });
    });
    tl.to({}, { duration: 0 }, 1); // timeline spans the full 0–100% range
  }

  function servicesList() {
    const content = $('.services_content');
    const list = $('#js-services-list');
    const slider = $('#js-services-slider');
    if (!list) return;

    let swiper = null;
    if (mq.desktop() && typeof Swiper !== 'undefined') {
      swiper = new Swiper('#js-services-swiper', {
        speed: 1500,
        slidesPerView: 1,
        spaceBetween: 0,
        allowTouchMove: false,
        effect: 'creative',
        creativeEffect: {
          limitProgress: 100,
          prev: { translate: [0, '-100%', 0] },
          next: { translate: [0, '100%', 0] }
        }
      });

      // Cursor-following slider
      const setPosition = (e) => {
        const r = content.getBoundingClientRect();
        slider.style.setProperty('--services-slider--left', (e.clientX - r.left - slider.offsetWidth / 2) + 'px');
        slider.style.setProperty('--services-slider--top', (e.clientY - r.top - slider.offsetHeight / 2) + 'px');
      };
      content.addEventListener('pointermove', setPosition);

      // First-hover mosaic dissolve over the slider
      const mosaic = $('#js-services-mosaic');
      const cols = 12;
      const rows = Math.ceil(slider.offsetHeight / (slider.offsetWidth / cols)) + 1;
      mosaic.innerHTML = '<div class="services_mosaic-item"></div>'.repeat(cols * rows);
      let mosaicDone = false;
      content.addEventListener('pointerenter', (e) => {
        setPosition(e);
        content.classList.add('is-hovered');
        if (mosaicDone) return;
        mosaicDone = true;
        setTimeout(() => gsap.to(mosaic.children, {
          opacity: 0, duration: 0, ease: ease.to,
          stagger: { amount: 0.5, from: 'random', ease: ease.from },
          onComplete: () => mosaic.remove()
        }), 250);
      });
      content.addEventListener('pointerleave', () => content.classList.remove('is-hovered'));
    }

    // Row marquee
    $$('.fancy-list_item', list).forEach((row) => {
      const track = row.querySelector('.fancy-list_track');
      const unit = row.querySelector('.fancy-list_text-wrapper');
      let loop = null;

      const enter = () => {
        row.classList.add('is-active');
        if (swiper) swiper.slideTo(Number(row.dataset.index));
        if (!mq.desktop()) return;
        const w = unit.offsetWidth;
        if (loop) loop.kill();
        gsap.set(track, { x: 0 });
        loop = gsap.to(track, { x: w, duration: 2.4, ease: 'none', repeat: -1 });
      };
      const leave = () => {
        row.classList.remove('is-active');
        if (loop) { loop.kill(); loop = null; }
        gsap.to(track, { x: 0, duration: 0.6, ease: ease.custom });
      };
      row.addEventListener('mouseenter', enter);
      row.addEventListener('mouseleave', leave);
      row.addEventListener('focus', enter);
      row.addEventListener('blur', leave);
      row.addEventListener('click', () => WD.contact.open());
      row.addEventListener('keydown', (e) => { if (e.key === 'Enter') WD.contact.open(); });
    });
  }

  /* The story sentence runs from block 1 straight into block 2, so block 2
     starts exactly where block 1's paragraph ends (desktop composition). */
  function alignIntro() {
    const t1 = $('.introduce_title.is-1');
    const c2 = $('.introduce_content.is-2');
    if (!t1 || !c2) return;
    const set = () => {
      c2.style.paddingTop = mq.desktop() ? t1.offsetHeight + 'px' : '';
      ScrollTrigger.refresh();
    };
    set();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(set);
    let w = window.innerWidth;
    window.addEventListener('resize', () => { if (window.innerWidth !== w) { w = window.innerWidth; set(); } });
  }

  function init() {
    alignIntro();
    heroParallax();
    imageStrips();
    collectionsCurtain();
    statementParallax();
    galleryZoom();
    servicesList();
  }

  WD.home = { render, init };
})(window.WD = window.WD || {});
