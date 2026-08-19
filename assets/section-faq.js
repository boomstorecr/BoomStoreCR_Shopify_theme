document.addEventListener('DOMContentLoaded', function () {
  initFAQ();
});

function initFAQ() {
  var faqSections = document.querySelectorAll('[data-section-type="faq"]');
  
  faqSections.forEach(function (section) {
    var buttons = section.querySelectorAll('[data-faq-button]');
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var isExpanded = button.getAttribute('aria-expanded') === 'true';
        var answerId = button.getAttribute('aria-controls');
        var answer = document.getElementById(answerId);
        
        if (!answer) return;
        
        if (isExpanded) {
          // Close this item
          closeItem(button, answer, prefersReducedMotion);
        } else {
          // Close all other items in this section
          buttons.forEach(function (otherButton) {
            if (otherButton !== button) {
              var otherAnswerId = otherButton.getAttribute('aria-controls');
              var otherAnswer = document.getElementById(otherAnswerId);
              if (otherButton.getAttribute('aria-expanded') === 'true' && otherAnswer) {
                closeItem(otherButton, otherAnswer, prefersReducedMotion);
              }
            }
          });
          
          // Open this item
          openItem(button, answer, prefersReducedMotion);
        }
      });
      
      button.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          var isExpanded = button.getAttribute('aria-expanded') === 'true';
          if (isExpanded) {
            var answerId = button.getAttribute('aria-controls');
            var answer = document.getElementById(answerId);
            if (answer) {
              closeItem(button, answer, prefersReducedMotion);
              button.focus();
            }
          }
        }
      });
    });
  });
}

function openItem(button, answer, prefersReducedMotion) {
  button.setAttribute('aria-expanded', 'true');
  
  if (prefersReducedMotion) {
    answer.removeAttribute('hidden');
    return;
  }
  
  // Measure natural height
  answer.style.height = 'auto';
  answer.removeAttribute('hidden');
  var height = answer.scrollHeight;
  answer.style.height = '0';
  
  // Force reflow
  answer.offsetHeight;
  
  // Animate to measured height
  answer.style.height = height + 'px';
  
  // Clean up after transition
  answer.addEventListener('transitionend', function cleanup() {
    answer.removeEventListener('transitionend', cleanup);
    answer.style.height = 'auto';
  });
}

function closeItem(button, answer, prefersReducedMotion) {
  button.setAttribute('aria-expanded', 'false');
  
  if (prefersReducedMotion) {
    answer.setAttribute('hidden', '');
    return;
  }
  
  // Set explicit height before animating
  var height = answer.scrollHeight;
  answer.style.height = height + 'px';
  
  // Force reflow
  answer.offsetHeight;
  
  // Animate to 0
  answer.style.height = '0';
  
  // Restore hidden after transition
  answer.addEventListener('transitionend', function cleanup() {
    answer.removeEventListener('transitionend', cleanup);
    answer.setAttribute('hidden', '');
    answer.style.height = '';
  });
}
