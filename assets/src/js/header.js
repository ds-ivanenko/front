document.addEventListener('DOMContentLoaded', function() {
    var menuButton = document.querySelector('.menu__button');
    var mobileMenu = document.querySelector('.mobile-menu');
    var body = document.querySelector('body');

    menuButton.addEventListener('click', function() {
        menuButton.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('lock');
    });
});