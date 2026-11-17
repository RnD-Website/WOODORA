/* ==========================================================================
   WOODORA — Page loader
   First visit (home): progress line → seven campaign images rise and fall in
   sequence → the last one expands full-bleed into the hero → hero type
   reveals char-by-char. Repeat visits / inner pages: a 24-column mosaic
   dissolves randomly. Timings follow the reference.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { ease, split, revertSplit } = WD.utils;

  function heroTimeline() {
    const title = document.getElementById('hero-title');
    const tags = document.getElementById('hero-tags');
    const text = document.getElementById('hero-text');
    const logo = document.getElementById('hero-logo');
    const button = document.getElementById('hero-button');
    if (!title) return gsap.timeline();

    split(title);
    const tl = gsap.timeline({ defaults: { duration: 1, opacity: 0, ease: 'power1.inOut' } });
    tl.from(title.querySelectorAll('.char'), {
      rotationY: -40,
      yPercent: -2,
      duration: 0.5,
      ease: ease.from,
      stagger: { amount: 0.5, from: 'random', ease: ease.from }
    })
      .from(tags, {}, '<0.5')
      .from(text, {}, '<');
    if (logo) tl.from(logo, {}, '<0.5');
    tl.from(button, { onComplete: () => revertSplit(title) }, '<');
    return tl;
  }

  function homeIntro(loader, done) {
    const progress = loader.querySelector('.loader_progressbar');
    const line = loader.querySelector('.loader_line');
    const images = Array.from(loader.querySelectorAll('.loader_image'));
    const firstPoint = window.innerWidth > 479 ? '70vh' : '54vh';

    gsap.set(progress, { opacity: 1 });
    gsap.set(images, { xPercent: -50, yPercent: -50, x: 0, y: 0, top: '50%', left: '50%' });
    // Build the hero reveal now: its from() tweens render immediately, so the
    // hero copy is hidden underneath the loader until it is played.
    const hero = heroTimeline();

    const main = gsap.timeline({ defaults: { ease: ease.custom } });
    main.to(line, { x: '0%', duration: 1 });

    images.slice(0, -1).forEach((im, i) => {
      const t = gsap.timeline();
      t.to(im, { height: firstPoint, duration: 0.5, ease: ease.to })
        .to(im, { y: '-10vh', duration: 0.5, ease: ease.from }, '<+0.4')
        .to(im, { y: '10vh', scale: 0, duration: 0.5, ease: ease.from }, '<+0.1');
      main.add(t, i === 0 ? '>' : '<+0.5');
    });

    const last = images[images.length - 1];
    const lastTl = gsap.timeline({ defaults: { ease: ease.custom } })
      .to(last, { height: firstPoint, duration: 1 })
      .to(progress, { opacity: 0, duration: 0.4 }, '<')
      .to(last, { width: '100vw', height: '135vh', duration: 1.5, delay: 0.1 })
      .to(loader, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => { loader.remove(); done(); }
      }, '<+1.2');
    main.add(lastTl, '<+0.5');

    main.add(hero, '>-0.3');
  }

  function mosaicIntro(loader, done) {
    loader.classList.remove('is-home');
    loader.querySelectorAll('.loader_progressbar, .loader_image').forEach((n) => n.remove());
    const bg = loader.querySelector('.loader_background') || loader.appendChild(Object.assign(document.createElement('div'), { className: 'loader_background' }));
    const columns = 24;
    const square = window.innerWidth / columns;
    const rows = Math.round(window.innerHeight / square) + 1;
    bg.innerHTML = '<div class="loader_background-item"></div>'.repeat(columns * rows);

    gsap.to(bg.children, {
      opacity: 0,
      duration: 0,
      delay: 0.4,
      ease: ease.to,
      stagger: { amount: 0.75, from: 'random', ease: ease.from },
      onComplete: () => { loader.remove(); done(); }
    });
    if (document.getElementById('hero-title')) heroTimeline().delay(0.3);
  }

  /**
   * @param {Function} done  called once the loader is gone
   */
  function run(done) {
    const loader = document.getElementById('loader');
    done = done || function () {};
    // No preloader on the page: just play the hero entrance (if any)
    if (!loader) { if (!WD.utils.mq.reduced()) heroTimeline(); done(); return; }

    const isHome = loader.dataset.loaderType === 'home-page';
    let visited = false;
    try { visited = sessionStorage.getItem('woodora-visited') === 'true'; } catch (e) { /* storage blocked */ }

    if (WD.utils.mq.reduced()) { loader.remove(); done(); return; }
    if (isHome && !visited) homeIntro(loader, done);
    else mosaicIntro(loader, done);

    try { sessionStorage.setItem('woodora-visited', 'true'); } catch (e) { /* noop */ }
  }

  WD.loader = { run };
})(window.WD = window.WD || {});
