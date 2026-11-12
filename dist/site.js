const scene = document.querySelector('[data-dinner-scene]');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (scene && 'IntersectionObserver' in window && !reduceMotion.matches) {
  const top = scene.getBoundingClientRect().top;

  // Deep links and restored scroll positions should show the complete section.
  if (top > window.innerHeight * 0.88) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      scene.classList.add('is-revealed');
      observer.disconnect();
    }, { rootMargin: '0px 0px -13% 0px' });

    scene.classList.add('will-reveal');
    observer.observe(scene);
  }
}
