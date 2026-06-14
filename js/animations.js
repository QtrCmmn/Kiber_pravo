const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Плавающие пузырьки в герое ── */
const hero = document.querySelector('.hero_main');
if (hero && !noMotion) {
  hero.style.position = 'relative';
  hero.style.overflow = 'hidden';
  const count = window.innerWidth < 600 ? 5 : 9;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = 5 + Math.random() * 12;
    p.style.cssText =
      'width:' + size + 'px;' +
      'height:' + size + 'px;' +
      'left:' + (6 + Math.random() * 88) + '%;' +
      'bottom:' + (2 + Math.random() * 38) + '%;' +
      'animation-duration:' + (3.5 + Math.random() * 5) + 's;' +
      'animation-delay:' + (Math.random() * 5) + 's;';
    hero.appendChild(p);
  }
}

/* ── Bounce на section-eyebrow при скролле ── */
if (!noMotion) {
  const ebObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !e.target._popped) {
        e.target._popped = true;
        e.target.classList.add('animate__animated', 'animate__bounceIn');
        e.target.style.setProperty('--animate-duration', '0.5s');
        ebObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.9 });
  document.querySelectorAll('.section-eyebrow').forEach(function(el) {
    ebObs.observe(el);
  });
}

/* ── Плавное появление снизу для роадмапа ── */
const rmItems = document.querySelectorAll('[data-rm-delay]');
if (rmItems.length && !noMotion) {
  rmItems.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px)';
    el.style.transition = 'none';
  });

  const rmObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !e.target._revealed) {
        e.target._revealed = true;
        const delay = parseFloat(e.target.dataset.rmDelay || 0) * 1000;
        setTimeout(function() {
          e.target.style.transition =
            'opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), ' +
            'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)';
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, delay);
        rmObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  rmItems.forEach(function(el) { rmObs.observe(el); });
}
