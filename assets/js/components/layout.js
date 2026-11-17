/* ==========================================================================
   WOODORA — Shared layout partials
   Header, navigation menu, menu overlay, cart drawer, contact modal, toast
   and footer are rendered from one place so every page stays identical.
   ========================================================================== */
(function (WD) {
  'use strict';

  const { img, IMG, ROOMS } = WD.data;
  const BG_ITEMS = 10;

  /* Navigation model (labels from the brief) */
  const NAV = {
    home: { label: 'Home', href: 'index.html', image: IMG.heroLiving },
    collections: [
      { label: 'Collections', href: 'collection.html', image: IMG.bohoLiving },
      { label: 'Living Room', href: 'collection.html?room=living', image: ROOMS.living.image },
      { label: 'Bedroom', href: 'collection.html?room=bedroom', image: ROOMS.bedroom.image },
      { label: 'Dining', href: 'collection.html?room=dining', image: ROOMS.dining.image },
      { label: 'Storage', href: 'collection.html?room=storage', image: ROOMS.storage.image },
      { label: 'Lookbook', href: 'index.html#gallery', image: IMG.softLiving }
    ],
    contact: { label: 'Contact', href: 'index.html#contact', image: IMG.consoleLiving }
  };

  function header(current) {
    const all = [NAV.home, ...NAV.collections, NAV.contact];
    const bg = '<div class="menu_background">' + '<span class="menu_background_item"></span>'.repeat(BG_ITEMS) + '</div>';
    const item = (n, i) => `
      <a class="menu_row menu_item${current === n.href ? ' is-current' : ''}" href="${n.href}" data-menu-item="${i}">
        <span class="menu_item_text"><span class="menu_item_label" animation="staggered_link">${n.label}</span></span>
        ${bg}
      </a>`;
    const divider = `<div class="menu_row menu_divider"><span class="menu_divider_inner menu_anim"></span>${bg}</div>`;
    const spacer = `<div class="menu_row menu_spacer">${bg}</div>`;

    return `
    <header class="header_root" id="header">
      <div class="header_content">
        <a class="header_button header_brand" href="index.html" aria-label="WOODORA home">
          <span class="header_button_overlay"></span>
          <span class="header_button_text">WOODORA</span>
        </a>

        <div class="menu_root">
          <button class="menu_toggle" type="button" id="js-menu-toggle" aria-expanded="false" aria-controls="js-menu-wrapper">
            <span class="menu_toggle_overlay"></span>
            <span class="menu_toggle_icon" aria-hidden="true">
              <span class="menu_toggle_icon_line is-1"></span><span class="menu_toggle_icon_line is-2"></span>
              <span class="menu_toggle_icon_line is-3"></span><span class="menu_toggle_icon_line is-4"></span>
            </span>
            <span class="menu_toggle_caption"><span class="menu_toggle_caption_inner">
              <span class="menu_toggle_caption_text">Menu</span><span class="menu_toggle_caption_text">Close</span>
            </span></span>
          </button>
        </div>

        <button class="header_button is-inverted" type="button" data-cart-open aria-label="Open cart">
          <span class="header_button_overlay"></span>
          <span class="header_button_text">Cart<span class="header_button_count">(<span data-cart-count>0</span>)</span></span>
          <span class="header_button_icon is-left-margin"></span>
        </button>
      </div>
    </header>

    <div class="menu_wrapper" id="js-menu-wrapper" aria-hidden="true">
      <div class="menu_wrapper-inner" data-lenis-prevent>
        <nav class="menu_content" aria-label="Main">
          ${spacer}
          ${item(NAV.home, 0)}
          ${divider}
          <div class="menu_row menu_caption"><span class="menu_caption_text menu_anim">Collections</span>${bg}</div>
          ${NAV.collections.map((n, i) => item(n, i + 1)).join('')}
          ${divider}
          ${item(NAV.contact, 7)}
          ${spacer}
        </nav>
      </div>
    </div>

    <div class="header_overlay" id="js-header-overlay" aria-hidden="true">
      ${all.map((n, i) => `<img class="header_overlay-bg-item" data-menu-image="${i}" src="${img(n.image, 1800)}" alt="" loading="lazy">`).join('')}
    </div>`;
  }

  function cart() {
    return `
    <div class="cart_overlay" data-cart-close></div>
    <aside class="cart_root" id="js-cart" aria-label="Shopping cart" aria-hidden="true">
      <div class="cart_bg">${'<span></span>'.repeat(6)}</div>
      <div class="cart_header cart_anim">
        <h2 class="cart_title">Your cart</h2>
        <button class="cart_close" type="button" data-cart-close>Close</button>
      </div>
      <div class="cart_items cart_anim" data-cart-items data-lenis-prevent></div>
      <div class="cart_footer cart_anim">
        <div class="cart_row"><span>Subtotal</span><span data-cart-subtotal>$0</span></div>
        <div class="cart_row"><span>White-glove delivery</span><span data-cart-delivery>—</span></div>
        <div class="cart_row is-total"><span>Total</span><span data-cart-total>$0</span></div>
        <button class="button_primary is-light" type="button" data-checkout>
          <span class="button_primary_text">Proceed to checkout</span><span class="button_primary_arrow">→</span>
        </button>
      </div>
    </aside>`;
  }

  function modal() {
    return `
    <div class="modal_wrapper" id="js-contact-modal" aria-hidden="true" data-lenis-prevent>
      <div class="modal_root" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        <button class="modal_close" type="button" data-contact-close>Close</button>
        <h2 class="heading-style-h2 modal_title" id="contact-title">LET'S Talk</h2>
        <p class="modal_text">Have a space in mind? Tell us about it and a WOODORA consultant will be in touch within one business day.</p>
        <form class="contact_form" novalidate>
          <div class="form_grid">
            <label class="form_field"><span>Name</span><input class="form_input" name="name" required autocomplete="name"></label>
            <label class="form_field"><span>Email</span><input class="form_input" type="email" name="email" required autocomplete="email"></label>
            <div class="form_field is-full"><span>I'm interested in</span>
              <div class="form_chips">
                ${['Consultation', 'Custom furniture', 'Interior styling', 'Delivery'].map((t, i) => `
                  <label class="form_chip"><input type="checkbox" name="interest" value="${t}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}
              </div>
            </div>
            <label class="form_field is-full"><span>Message</span><textarea class="form_input" name="message" rows="4"></textarea></label>
          </div>
          <button class="button_primary is-dark" type="submit"><span class="button_primary_text">Send message</span><span class="button_primary_arrow">→</span></button>
        </form>
        <div class="form_success">
          <h3 class="heading-style-h2">Thank <span class="is-em">you</span></h3>
          <p class="modal_text" style="margin-top:1rem">Your message is on its way. We'll reply shortly.</p>
        </div>
      </div>
    </div>
    <div class="toast" role="status" aria-live="polite"><span class="marker"></span><span data-toast-text></span></div>`;
  }

  function footer() {
    const link = (text, href) => `<a class="footer_title is-link" href="${href}" animation="staggered_link">${text}</a>`;
    return `
    <footer class="footer_root" id="contact">
      <div class="footer_statement">
        <h2 class="heading-style-h1" animation="fade_in_text">LET'S CREATE a SPACE that FEELS like HOME.</h2>
        <div class="footer_statement-text">
          <p>Have a space in mind? Let's find the furniture that brings it to life.</p>
          <button class="button_primary is-dark" type="button" data-contact-open>
            <span class="button_primary_text">Contact us</span><span class="button_primary_arrow">→</span>
          </button>
        </div>
      </div>

      <div class="footer_content">
        <div class="footer_section">
          <button class="footer_title is-link" type="button" data-contact-open animation="staggered_link" style="text-align:left">contact us</button>
          <div class="footer_2-cols_root">
            <div class="footer_2-cols_text">WOODORA Showroom<br>00 Placeholder Street<br>City, Country 00000<br><br><a href="tel:+10000000000">+1 (000) 000-0000</a></div>
            <div class="footer_2-cols_text">Book a consultation and our team will help you plan dimensions, materials and delivery for your home.</div>
          </div>
        </div>
        <div class="footer_section">
          ${link('email', 'mailto:hello@woodora.com')}
          <div class="footer_2-cols_text"><a href="mailto:hello@woodora.com">hello@woodora.com</a></div>
        </div>
        <div class="footer_section">
          ${link('instagram', 'https://instagram.com/')}
          <div class="footer_links footer_2-cols_text">
            <a href="collection.html">Collections</a>
            <a href="index.html#about">About WOODORA</a>
          </div>
        </div>
        <div class="footer_section">
          ${link('pinterest', 'https://pinterest.com/')}
          <div class="footer_links footer_2-cols_text">
            <a href="#" data-legal="privacy">Privacy Policy</a>
            <a href="#" data-legal="terms">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>

      <div class="footer_bottom">
        <span>©${new Date().getFullYear()} WOODORA. All rights reserved</span>
        <span>Premium home furniture &amp; lifestyle</span>
      </div>
    </footer>`;
  }

  function render() {
    const current = document.body.dataset.page === 'home' ? 'index.html' : '';
    const mount = (name, html) => {
      const el = document.querySelector(`[data-layout="${name}"]`);
      if (el) el.outerHTML = html;
    };
    mount('header', header(current));
    mount('footer', footer());
    document.body.insertAdjacentHTML('beforeend', cart() + modal());
  }

  WD.layout = { render, NAV };
})(window.WD = window.WD || {});
