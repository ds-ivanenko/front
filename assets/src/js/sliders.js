var splide = new Splide( '.splide', {
    type   : 'loop',
    fixedWidth : '1280px',
    focus  : 'center',
    arrows : false,
    gap : '40px',
    pagination : false,
    breakpoints: {
        1279: {
            fixedWidth : '70%',
        },
    }
} );

splide.mount();