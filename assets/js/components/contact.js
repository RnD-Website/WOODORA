/* ==========================================================================
   WOODORA — Contact modal + toast notifications
   ========================================================================== */
(function (WD) {
  'use strict';

  const { $ } = WD.utils;
  let toastTimer = null;

  WD.toast = function (text) {
    const el = $('.toast');
    if (!el) return;
    el.querySelector('[data-toast-text]').textContent = text;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2600);
  };

  function open() {
    WD.menu && WD.menu.close();
    WD.cart && WD.cart.close();
    const modal = $('#js-contact-modal');
    modal.querySelector('.modal_root').classList.remove('is-sent');
    document.body.classList.add('modal-is-open');
    modal.setAttribute('aria-hidden', 'false');
    WD.scroll.lock();
    setTimeout(() => { const f = modal.querySelector('input'); if (f) f.focus({ preventScroll: true }); }, 400);
  }

  function close() {
    if (!document.body.classList.contains('modal-is-open')) return;
    document.body.classList.remove('modal-is-open');
    $('#js-contact-modal').setAttribute('aria-hidden', 'true');
    WD.scroll.unlock();
  }

  function init() {
    const modal = $('#js-contact-modal');
    if (!modal) return;

    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-contact-open]')) { e.preventDefault(); open(); }
      else if (e.target.closest('[data-contact-close]') || e.target === modal) close();
      else if (e.target.closest('[data-legal]')) {
        e.preventDefault();
        WD.toast(e.target.closest('[data-legal]').dataset.legal === 'privacy' ? 'Privacy Policy — placeholder page' : 'Terms & Conditions — placeholder page');
      }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    modal.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
        WD.toast('Please add your name and a valid email');
        return;
      }
      modal.querySelector('.modal_root').classList.add('is-sent');
      form.reset();
    });
  }

  WD.contact = { init, open, close };
})(window.WD = window.WD || {});
