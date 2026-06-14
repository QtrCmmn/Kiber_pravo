const burger = document.getElementById('burger');
const navList = document.querySelector('.header__list');
const overlay = document.getElementById('menuOverlay');

if (burger && navList && overlay) {
  burger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function toggleMenu() {
    const isOpen = navList.classList.toggle('open');
    burger.classList.toggle('active');
    overlay.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navList.classList.remove('open');
    burger.classList.remove('active');
    overlay.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
