/**
 * scroll-restoration.js — восстановление позиции скролла.
 * Сохраняет при клике на ссылки pages/*, восстанавливает при возврате.
 * Использует pageshow, чтобы ловить и обычную загрузку, и bfcache (кнопка «Назад»).
 */
(function () {
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="pages/"]');
        if (link) {
            sessionStorage.setItem('indexScrollPos', window.scrollY);
        }
    });

    window.addEventListener('pageshow', function () {
        var saved = sessionStorage.getItem('indexScrollPos');
        if (saved !== null) {
            sessionStorage.removeItem('indexScrollPos');
            window.scrollTo(0, parseInt(saved, 10));
        }
    });
})();
