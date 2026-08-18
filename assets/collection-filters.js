document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-collection-filters]');
  if (!root) return;

  var form = root.querySelector('[data-collection-filter-form]');
  var panel = root.querySelector('[data-filter-panel]');
  var backdrop = root.querySelector('.collection-filters__backdrop');
  var openButton = root.querySelector('[data-filter-open]');
  var closeButtons = root.querySelectorAll('[data-filter-close]');
  var lastFocusedElement;
  var isMobile = window.matchMedia('(max-width: 749px)');
  var focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function isVisible(element) {
    return !element.hidden && element.offsetParent !== null;
  }

  function setDrawer(open) {
    if (!panel || !openButton) return;
    panel.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-visible', open);
    openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
    } else {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
    }
    document.body.classList.toggle('collection-filters-open', open);
    if (open) panel.querySelector('button, a, input, select')?.focus();
    else if (lastFocusedElement) lastFocusedElement.focus();
  }

  if (panel) panel.setAttribute('aria-hidden', isMobile.matches ? 'true' : 'false');

  openButton?.addEventListener('click', function () {
    lastFocusedElement = document.activeElement;
    setDrawer(true);
  });
  closeButtons.forEach(function (button) { button.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (event) {
    if (!panel?.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      setDrawer(false);
      return;
    }
    if (event.key !== 'Tab') return;
    var focusableElements = Array.from(panel.querySelectorAll(focusableSelector)).filter(isVisible);
    if (!focusableElements.length) return;
    var firstElement = focusableElements[0];
    var lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  root.querySelectorAll('[data-filter-toggle]').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var controlled = document.getElementById(toggle.getAttribute('aria-controls'));
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (controlled) controlled.hidden = expanded;
    });
  });

  root.querySelector('[data-sort-select]')?.addEventListener('change', function (event) {
    var url = new URL(window.location.href);
    url.searchParams.set('sort_by', event.target.value);
    url.searchParams.delete('page');
    window.location.assign(url.toString());
  });

  form?.addEventListener('submit', function () { setDrawer(false); });
});
