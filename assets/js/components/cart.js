/* ==========================================================================
   WOODORA — Cart (localStorage) + drawer
   Line items are keyed by product + finish + size. The drawer is built from
   six vertical bars that sweep in from the right, echoing the menu.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { ease, $, $$, esc } = WD.utils;
  const { getProduct, FINISHES, money, img } = WD.data;
  const KEY = 'woodora-cart';
  const FREE_DELIVERY = 2500;
  const DELIVERY_FEE = 180;

  let items = [];
  let tl = null;
  let isOpen = false;

  /* ---------------- State ---------------- */
  function load() {
    try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { items = []; }
    items = items.filter((i) => getProduct(i.id));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage blocked */ }
  }

  function unitPrice(item) {
    const p = getProduct(item.id);
    const base = p.finishes[item.finish] != null ? p.finishes[item.finish] : Object.values(p.finishes)[0];
    const add = p.sizes && item.size ? (p.sizes[item.size] || 0) : 0;
    return base + add;
  }

  function add(id, opts) {
    const p = getProduct(id);
    if (!p) return;
    const finish = (opts && opts.finish) || Object.keys(p.finishes)[0];
    const size = (opts && opts.size) || (p.sizes ? Object.keys(p.sizes)[0] : null);
    const qty = Math.max(1, (opts && opts.qty) || 1);
    const key = [id, finish, size].join('|');
    const existing = items.find((i) => i.key === key);
    if (existing) existing.qty += qty;
    else items.push({ key, id, finish, size, qty });
    save();
    render();
    WD.toast(`${p.name} added to cart`);
    bumpCount();
  }

  function setQty(key, qty) {
    const it = items.find((i) => i.key === key);
    if (!it) return;
    it.qty = qty;
    if (it.qty <= 0) items = items.filter((i) => i.key !== key);
    save();
    render();
  }

  const count = () => items.reduce((s, i) => s + i.qty, 0);
  const subtotal = () => items.reduce((s, i) => s + unitPrice(i) * i.qty, 0);

  /* ---------------- View ---------------- */
  function render() {
    $$('[data-cart-count]').forEach((n) => { n.textContent = count(); });
    const list = $('[data-cart-items]');
    if (!list) return;

    if (!items.length) {
      list.innerHTML = `<div class="cart_empty">Your cart is empty.<br><br><a href="collection.html" style="text-decoration:underline;text-underline-offset:3px">Explore the collections →</a></div>`;
    } else {
      list.innerHTML = items.map((i) => {
        const p = getProduct(i.id);
        const variant = [FINISHES[i.finish] ? FINISHES[i.finish].name : '', i.size].filter(Boolean).join(' · ');
        return `
        <div class="cart_item">
          <a href="product.html?id=${p.id}"><img class="cart_item_image" src="${img(p.images[0], 300)}" alt="${esc(p.name)}"></a>
          <div>
            <div class="cart_item_name">${esc(p.name)}</div>
            <div class="cart_item_variant">${esc(variant)}</div>
            <div class="cart_item_qty">
              <button type="button" data-qty="${i.key}" data-delta="-1" aria-label="Decrease">−</button>
              <span>${i.qty}</span>
              <button type="button" data-qty="${i.key}" data-delta="1" aria-label="Increase">+</button>
            </div>
          </div>
          <div class="cart_item_side">
            <span>${money(unitPrice(i) * i.qty)}</span>
            <button type="button" class="cart_item_remove" data-remove="${i.key}">Remove</button>
          </div>
        </div>`;
      }).join('');
    }

    const sub = subtotal();
    const delivery = !items.length ? 0 : sub >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
    $('[data-cart-subtotal]').textContent = money(sub);
    $('[data-cart-delivery]').textContent = !items.length ? '—' : delivery === 0 ? 'Complimentary' : money(delivery);
    $('[data-cart-total]').textContent = money(sub + delivery);
  }

  function bumpCount() {
    gsap.fromTo('[data-cart-count]', { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: ease.custom });
  }

  /* ---------------- Drawer ---------------- */
  function build() {
    const root = $('#js-cart');
    tl = gsap.timeline({ paused: true, defaults: { ease: ease.custom } })
      .to($$('.cart_bg span', root), { scaleX: 1, duration: 0.6, stagger: { each: 0.05, from: 'end' } })
      .to($$('.cart_anim', root), { opacity: 1, duration: 0.5, stagger: 0.06 }, '-=0.3');
  }

  function open() {
    if (isOpen) return;
    WD.menu && WD.menu.close();
    isOpen = true;
    document.body.classList.add('cart-is-open');
    $('#js-cart').setAttribute('aria-hidden', 'false');
    WD.scroll.lock();
    tl.timeScale(1).play();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    $('#js-cart').setAttribute('aria-hidden', 'true');
    tl.eventCallback('onReverseComplete', () => {
      document.body.classList.remove('cart-is-open');
      WD.scroll.unlock();
    });
    tl.timeScale(1.8).reverse();
  }

  function init() {
    load();
    build();
    render();

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-cart-open]')) { e.preventDefault(); open(); return; }
      if (t.closest('[data-cart-close]')) { close(); return; }

      const quick = t.closest('[data-quick-add]');
      if (quick) { e.preventDefault(); e.stopPropagation(); add(quick.dataset.quickAdd); return; }

      const q = t.closest('[data-qty]');
      if (q) {
        const it = items.find((i) => i.key === q.dataset.qty);
        if (it) setQty(it.key, it.qty + Number(q.dataset.delta));
        return;
      }
      const r = t.closest('[data-remove]');
      if (r) { setQty(r.dataset.remove, 0); return; }

      if (t.closest('[data-checkout]')) {
        if (!items.length) { WD.toast('Your cart is empty'); return; }
        WD.toast('Checkout is a placeholder in this build');
      }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  WD.cart = { init, add, open, close, count };
})(window.WD = window.WD || {});
