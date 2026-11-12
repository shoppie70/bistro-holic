const chapters = document.querySelectorAll('[data-reveal]');

if (chapters.length && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const visibleEnough = 0.18;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < visibleEnough) continue;

      const chapter = entry.target;
      const photo = chapter.querySelector('img');
      observer.unobserve(chapter);

      const reveal = () => chapter.classList.replace('awaiting-reveal', 'is-revealed');
      if (!photo || photo.complete) {
        reveal();
      } else {
        // Begin the animation when the image can be shown, including cached loads.
        photo.decode().then(reveal, reveal);
      }
    }
  }, { threshold: visibleEnough });

  for (const chapter of chapters) {
    chapter.classList.add('awaiting-reveal');
    observer.observe(chapter);
  }
}

const mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenu) {
  mobileMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) mobileMenu.open = false;
  });

  mobileMenu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.open) {
      mobileMenu.open = false;
      mobileMenu.querySelector('summary').focus();
    }
  });
}
