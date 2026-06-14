window.onload = function() {
    let preloader = document.getElementById('loader_body');
    preloader.classList.add('hide-preloader');
    setInterval(function() {
    preloader.classList.add('preloader-hidden');
    }, 990);
}
