document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-image-slider]').forEach(initImageSlider);
});

function initImageSlider(slider) {
  var track = slider.querySelector('[data-image-slider-track]');
  var slides = slider.querySelectorAll('[data-image-slider-slide]');
  var dots = slider.querySelectorAll('[data-image-slider-dot]');
  var previousButton = slider.querySelector('[data-image-slider-prev]');
  var nextButton = slider.querySelector('[data-image-slider-next]');
  var currentIndex = 0;
  var timer;

  if (!track || slides.length < 2) return;

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    dots.forEach(function (dot, dotIndex) {
      var active = dotIndex === currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function restartAutoplay() {
    window.clearInterval(timer);
    if (slider.dataset.autoplay !== 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setInterval(function () { goToSlide(currentIndex + 1); }, Number(slider.dataset.autoplaySpeed) || 5000);
  }

  if (previousButton) previousButton.addEventListener('click', function () { goToSlide(currentIndex - 1); restartAutoplay(); });
  if (nextButton) nextButton.addEventListener('click', function () { goToSlide(currentIndex + 1); restartAutoplay(); });
  dots.forEach(function (dot) { dot.addEventListener('click', function () { goToSlide(Number(dot.dataset.imageSliderDot)); restartAutoplay(); }); });
  slider.addEventListener('mouseenter', function () { window.clearInterval(timer); });
  slider.addEventListener('mouseleave', restartAutoplay);
  slider.addEventListener('focusin', function () { window.clearInterval(timer); });
  slider.addEventListener('focusout', restartAutoplay);
  goToSlide(0);
  restartAutoplay();
}