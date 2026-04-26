const checkbox = document.getElementById('theme-checkbox');
const root = document.documentElement;

// Проверка сохраненной темы при загрузке страницы
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    checkbox.checked = true;
}

// Изменение темы при клике
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

const burger = document.getElementById('burger');
const navList = document.querySelector('.header__list');
const overlay = document.getElementById('menuOverlay');

burger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', closeMenu);

// Закрыть при клике на пункт меню
navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

function toggleMenu() {
    const isOpen = navList.classList.toggle('open');
    burger.classList.toggle('active');
    overlay.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : ''; // блок скролла
}

function closeMenu() {
    navList.classList.remove('open');
    burger.classList.remove('active');
    overlay.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
