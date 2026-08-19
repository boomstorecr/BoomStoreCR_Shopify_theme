document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initQuickAdd();
  initProductThumbnails();
  initProductDetails();
  initProductDescriptions();
  initProductPurchase();
  initProductShare();
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
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

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

function initProductDetails() {
  document.querySelectorAll('[data-product-details]').forEach(function (details) {
    details.querySelectorAll('[data-gallery-thumbnail]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var mediaId = thumb.getAttribute('data-media-id');
        details.querySelectorAll('[data-gallery-media]').forEach(function (media) {
          media.classList.toggle('is-hidden', media.getAttribute('data-media-id') !== mediaId);
        });
        details.querySelectorAll('[data-gallery-thumbnail]').forEach(function (otherThumb) {
          otherThumb.setAttribute('aria-current', otherThumb === thumb ? 'true' : 'false');
        });
      });
    });

  });
}

function initProductDescriptions() {
  document.querySelectorAll('[data-description-wrap]').forEach(function (wrap) {
    var description = wrap.querySelector('[data-description]');
    var descriptionToggle = wrap.querySelector('[data-description-toggle]');
    if (!description || !descriptionToggle) return;

    description.classList.add('is-js-collapsed');
    if (description.scrollHeight <= description.clientHeight + 1) {
      description.classList.remove('is-js-collapsed');
      descriptionToggle.hidden = true;
    }
    descriptionToggle.addEventListener('click', function () {
      var isExpanded = descriptionToggle.getAttribute('aria-expanded') === 'true';
      description.classList.toggle('is-expanded', !isExpanded);
      descriptionToggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      descriptionToggle.textContent = isExpanded ? descriptionToggle.getAttribute('data-show-more') : descriptionToggle.getAttribute('data-show-less');
    });
  });
}

function initProductPurchase() {
  document.querySelectorAll('[data-product-purchase]').forEach(function (purchase) {
    var form = purchase.querySelector('[data-product-form]');
    var variantData = purchase.querySelector('[data-product-variants]');
    if (!form || !variantData) return;

    var variants;
    try { variants = JSON.parse(variantData.textContent); } catch (error) { return; }
    var optionSelects = Array.from(form.querySelectorAll('[data-option-index]'));
    var idInput = form.querySelector('[data-product-form-id]');
    var addButton = form.querySelector('[data-product-add-to-cart]');
    var addLabel = form.querySelector('[data-add-to-cart-label]');
    var price = purchase.querySelector('[data-product-price]');
    var stockStatus = purchase.querySelector('[data-stock-status]');
    var stockCount = purchase.querySelector('[data-stock-count]');
    var quantityInput = form.querySelector('[data-quantity-input]');
    var translations = {
      add: purchase.getAttribute('data-add-text') || 'Add to cart',
      soldOut: purchase.getAttribute('data-sold-out-text') || 'Sold out',
      available: purchase.getAttribute('data-available-text') || 'Available',
      unavailable: purchase.getAttribute('data-unavailable-text') || 'Unavailable',
      inventory: purchase.getAttribute('data-inventory-text') || 'COUNT_PLACEHOLDER available',
      salePrice: purchase.getAttribute('data-sale-price-text') || 'Sale price',
      regularPrice: purchase.getAttribute('data-regular-price-text') || 'Regular price',
      sale: purchase.getAttribute('data-sale-text') || 'Sale'
    };

    function formatPrice(amount) {
      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') return window.Shopify.formatMoney(amount, purchase.getAttribute('data-money-format'));
      return (Number(amount) / 100).toFixed(2);
    }

    function renderPrice(variant) {
      var isOnSale = Number(variant.compare_at_price) > Number(variant.price);
      price.innerHTML = isOnSale
        ? '<div class="price price--on-sale"><span class="visually-hidden">' + translations.salePrice + '</span><span class="price__sale">' + formatPrice(variant.price) + '</span><span class="visually-hidden">' + translations.regularPrice + '</span><span class="price__compare">' + formatPrice(variant.compare_at_price) + '</span><span class="price__badge">' + translations.sale + '</span></div>'
        : '<div class="price"><span class="price__regular">' + formatPrice(variant.price) + '</span></div>';
    }

    function updateVariant() {
      var selectedOptions = optionSelects.map(function (select) { return select.value; });
      var variant = variants.find(function (candidate) {
        return candidate.options && candidate.options.every(function (option, index) { return option === selectedOptions[index]; });
      });
      if (!variant) {
        idInput.value = '';
        idInput.dispatchEvent(new Event('change', { bubbles: true }));
        addButton.disabled = true;
        addLabel.textContent = translations.unavailable;
        stockStatus.textContent = translations.unavailable;
        stockCount.textContent = '';
        return;
      }
      idInput.value = variant.id;
      idInput.dispatchEvent(new Event('change', { bubbles: true }));
      renderPrice(variant);
      addButton.disabled = !variant.available;
      addLabel.textContent = variant.available ? translations.add : translations.soldOut;
      stockStatus.textContent = variant.available ? translations.available : translations.soldOut;
      stockCount.textContent = variant.available && variant.inventory_management && variant.inventory_quantity > 0 ? translations.inventory.replace('COUNT_PLACEHOLDER', variant.inventory_quantity) : '';
    }

    optionSelects.forEach(function (select) { select.addEventListener('change', updateVariant); });
    [
      [form.querySelector('[data-quantity-decrease]'), -1],
      [form.querySelector('[data-quantity-increase]'), 1]
    ].forEach(function (control) {
      if (control[0]) control[0].addEventListener('click', function () {
        quantityInput.value = Math.max(1, (parseInt(quantityInput.value, 10) || 1) + control[1]);
      });
    });
    function normalizeQuantity() {
      var value = Number(quantityInput.value);
      quantityInput.value = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
    }

    quantityInput.addEventListener('change', normalizeQuantity);
    form.addEventListener('submit', normalizeQuantity);
    updateVariant();
  });
}

function initProductShare() {
  document.querySelectorAll('[data-share-product]').forEach(function (shareButton) {
    shareButton.addEventListener('click', function () {
      var productUrl = shareButton.getAttribute('data-product-url');
      var productTitle = shareButton.getAttribute('data-product-title');

      if (navigator.share) {
        navigator.share({
          title: productTitle,
          url: productUrl
        }).catch(function () {
          // User cancelled or share failed, fallback to copy
          copyToClipboard(productUrl, shareButton);
        });
      } else {
        copyToClipboard(productUrl, shareButton);
      }
    });
  });

  function copyToClipboard(text, button) {
    var tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
      document.execCommand('copy');
      var originalText = button.textContent;
      button.textContent = button.getAttribute('data-copied-text') || 'Copied!';
      setTimeout(function () {
        button.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(tempInput);
  }
}
