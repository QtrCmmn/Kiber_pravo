const bar = document.querySelector('.footer-progress__bar');
if (bar) {
  const target = parseInt(bar.dataset.progress, 10);
  let animated = false;

  const animate = () => {
    if (animated) return;
    animated = true;
    let start = null;
    const duration = 1400;
    const ease = t => 1 - Math.pow(1 - t, 4);
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      bar.style.width = (ease(p) * target) + '%';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    entries => { if (entries[0].isIntersecting) animate(); },
    { threshold: 0.3 }
  );
  observer.observe(bar.closest('.footer-progress'));
}
