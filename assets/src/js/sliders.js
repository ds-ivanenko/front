var splide = new Splide( '.splide', {
    type   : 'loop',
    fixedWidth : '1280px',
    focus  : 'center',
    arrows : false,
    gap : '40px',
    pagination : false,
    breakpoints: {
        1279: {
            fixedWidth : '95%',
        },
        480: {
            pagination : true,
            classes: {
                pagination: 'splide__pagination header-class-pagination',
                page      : 'splide__pagination__page header-class-page',
            },
        },
    }
} );

splide.mount();