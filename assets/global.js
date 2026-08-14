document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initQuickAdd();
  initProductThumbnails();
});

function initMobileNav() {
  var toggle = document.querySelector('[data-mobile-nav-toggle]');
  var nav = document.getElementById('MobileNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    nav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });
}

function initQuickAdd() {
  document.querySelectorAll('[data-quick-add-button]').forEach(function (button) {
    button.addEventListener('click', function () {
      var variantId = button.getAttribute('data-variant-id');
      if (!variantId) return;

      button.disabled = true;
      var originalText = button.textContent;
      button.textContent = '...';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Add to cart failed');
          return response.json();
        })
        .then(function () {
          return fetch('/cart.js');
        })
        .then(function (response) { return response.json(); })
        .then(function (cart) {
          document.querySelectorAll('[data-cart-count]').forEach(function (el) {
            el.textContent = cart.item_count;
          });
          button.textContent = originalText;
          button.disabled = false;
        })
        .catch(function () {
          button.textContent = originalText;
          button.disabled = false;
        });
    });
  });
}

function initProductThumbnails() {
  document.querySelectorAll('[data-thumbnail]').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var mainImage = document.getElementById('ProductMainImage');
      var url = thumb.getAttribute('data-media-url');
      if (mainImage && url) mainImage.src = url;
    });
  });
}
