const btn = document.getElementById('theme-toggle');
const body = document.body;

// Загрузка сохранённой темы
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
}

btn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});