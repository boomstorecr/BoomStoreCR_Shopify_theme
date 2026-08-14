document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
});

function initCarousel(carousel) {
  var track = carousel.querySelector('[data-carousel-track]');
  var section = carousel.closest('[data-section-id]');
  if (!track || !section) return;

  var prevButton = section.querySelector('[data-carousel-prev]');
  var nextButton = section.querySelector('[data-carousel-next]');
  if (!prevButton || !nextButton) return;

  function scrollByAmount(direction) {
    var slide = track.querySelector('.carousel__slide');
    var amount = slide ? slide.getBoundingClientRect().width + 20 : 260;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  prevButton.addEventListener('click', function () { scrollByAmount(-1); });
  nextButton.addEventListener('click', function () { scrollByAmount(1); });
}
