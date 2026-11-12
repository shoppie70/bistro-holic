const chapters = document.querySelectorAll('[data-reveal]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  for (const chapter of chapters) {
    // Preserve fully visible images when returning to a scroll position or opening a fragment.
    if (chapter.getBoundingClientRect().top <= window.innerHeight * 0.9) continue;
    chapter.classList.add('will-reveal');
    observer.observe(chapter);
  }
}
