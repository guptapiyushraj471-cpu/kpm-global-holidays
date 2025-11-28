// hero-slider.js

(function () {
  // Section ke andar se hi elements lo, taaki clash na ho
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide-item');
  const nextBtn = slider.querySelector('.hero-next');
  const prevBtn = slider.querySelector('.hero-prev');

  // Agar kuch bhi missing ho toh script quietly exit
  if (!slides.length || !nextBtn || !prevBtn) return;

  let index = 0;

  // Agar HTML me pehle se kisi slide pe .active h, usko starting index bana do
  slides.forEach((slide, i) => {
    if (slide.classList.contains('active')) index = i;
  });

  function showSlide(i) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === i);
    });
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  // 3 second ka autoplay
  let autoTimer = setInterval(nextSlide, 3000);

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 3000);
  }

  // Buttons par click
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAuto();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAuto();
  });

  // Pehli slide dikhado
  showSlide(index);
})();
