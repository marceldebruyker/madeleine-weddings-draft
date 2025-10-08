const sliders = document.querySelectorAll<HTMLElement>('[data-hero-slider]');

sliders.forEach((sliderRoot) => {
  const scroller = sliderRoot.querySelector<HTMLElement>('[data-hero-scroller]');
  const indicator = sliderRoot.querySelector<HTMLElement>('[data-hero-indicator]');
  const progress = sliderRoot.querySelector<HTMLElement>('[data-hero-progress]');
  const prevBtn = sliderRoot.querySelector<HTMLButtonElement>('[data-prev]');
  const nextBtn = sliderRoot.querySelector<HTMLButtonElement>('[data-next]');

  if (!scroller || !indicator || !progress) return;

  const slides = Array.from(scroller.children) as HTMLElement[];
  let index = 0;
  const maxIndex = Math.max(0, slides.length - 1);

  const updateIndicator = () => {
    indicator.textContent = `${index + 1} / ${slides.length}`;
    const percentage = maxIndex === 0 ? 100 : (index / maxIndex) * 100;
    progress.style.width = `${Number.isFinite(percentage) ? percentage : 0}%`;
  };

  const setActiveSlide = (nextIndex: number, behavior: ScrollBehavior = 'smooth') => {
    index = Math.min(Math.max(0, nextIndex), maxIndex);
    scroller.scrollTo({ left: index * scroller.clientWidth, behavior });
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
    });
    updateIndicator();
  };

  prevBtn?.addEventListener('click', () => setActiveSlide(index - 1));
  nextBtn?.addEventListener('click', () => setActiveSlide(index + 1));

  const handleScroll = () => {
    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (Number.isFinite(nextIndex) && nextIndex !== index) {
      index = nextIndex;
      updateIndicator();
    }
  };

  scroller.addEventListener('scroll', handleScroll, { passive: true });

  window.addEventListener('resize', () => setActiveSlide(index, 'auto'));

  scroller.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveSlide(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveSlide(index + 1);
    }
  });

  slides[0]?.setAttribute('aria-hidden', 'false');
  updateIndicator();
});
