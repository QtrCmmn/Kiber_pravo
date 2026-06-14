const checkbox = document.getElementById('theme-checkbox');
if (checkbox) {
  const root = document.documentElement;
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    checkbox.checked = true;
  }
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}
