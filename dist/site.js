(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const scene = document.querySelector('.hero-scene');
  let frame = null;
  let observer;

  function updateScene() {
    frame = null;
    if (!scene || reducedMotion.matches) return;
    const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, scene.offsetTop + scene.offsetHeight * .6)));
    scene.style.setProperty('--hero-scale', String(1.055 - progress * .035));
  }
  function requestSceneUpdate() {
    if (frame === null) frame = requestAnimationFrame(updateScene);
  }
  function revealContent() {
    observer?.disconnect();
    document.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
    root.classList.toggle('motion-ready', !reducedMotion.matches);
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px 35px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => {
      // Initial viewport content never waits for a scroll event.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('reveal-pending');
      observer.observe(el);
    });
  }
  revealContent();
  requestSceneUpdate();
  window.addEventListener('scroll', requestSceneUpdate, { passive: true });
  window.addEventListener('resize', requestSceneUpdate, { passive: true });
  reducedMotion.addEventListener('change', () => {
    revealContent();
    if (reducedMotion.matches && scene) {
      scene.style.removeProperty('--hero-scale');
    } else requestSceneUpdate();
  });

  const dialog = document.querySelector('#site-menu');
  const trigger = document.querySelector('.menu-toggle');
  if (dialog && trigger) {
    trigger.addEventListener('click', () => {
      dialog.showModal();
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    });
    dialog.querySelector('.menu-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      document.body.classList.remove('menu-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus({ preventScroll: true });
    });
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
  }

  // Keep the current section visible in keyboard and screen reader navigation.
  const currentPath = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav a, .site-menu nav a').forEach(link => {
    const destination = new URL(link.href);
    if (destination.hash) return;
    const path = destination.pathname.replace(/\/$/, '') || '/';
    if (path === currentPath) link.setAttribute('aria-current', 'page');
  });
})();
