/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/src/js/assets.js":
/*!*********************************!*\
  !*** ./assets/src/js/assets.js ***!
  \*********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
window.assets = {
  splide: {
    js: `http://recipes.lvh.me/assets/dist/vendor/splide/splide.min.js`,
    css: `http://recipes.lvh.me/assets/dist/vendor/splide/splide.min.css`
  }
};

/***/ }),

/***/ "./assets/src/js/header.js":
/*!*********************************!*\
  !*** ./assets/src/js/header.js ***!
  \*********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/*
class MobileMenu {
	constructor() {
		const headerEl = document.querySelector('.site-header');
		this.elements = {
			header: headerEl,
			menu: headerEl.querySelector('.site-header__mobile-menu'),
			menuButton: headerEl.querySelector('.site-header__menu-button button'),
			nav: headerEl.querySelector('.site-header__mobile-nav .menu'),
			actionsBlock: headerEl.querySelector('.site-header__mobile-actions'),
			socialsBlock: headerEl.querySelector('.site-header__mobile-socials'),
		};
		this.currentDepth = 0;

		this.setupEventListeners();
		this.addBackButtonsToSubmenus();
	}

	setupEventListeners() {
		const {menuButton, nav} = this.elements;

		menuButton.addEventListener('click', this.toggleMenuVisibility);

		const menuItemsWithChildren = nav.querySelectorAll('.menu-item-has-children > a');

		menuItemsWithChildren.forEach((item) => {
			item.addEventListener('click', this.handleMenuItemClick);
		});
	}

	handleMenuItemClick = (event) => {
		event.preventDefault();

		const submenu = event.target.closest('.menu-item-has-children').querySelector('.sub-menu');
		submenu.classList.add('is-active');

		this.currentDepth++;
		this.updateMenuPosition();
		this.toggleActionAndSocialBlocksVisibility();
	}

	addBackButtonsToSubmenus() {
		const {nav} = this.elements;
		const backButtonTemplate = `
		  <li class="menu-item menu-item-back">
			<a href="#">
			  <svg class="icon icon-arrow">
				<use xlink:href="#menu-arrow"></use>
			  </svg>
			  <span>Back</span>
			</a>
		  </li>
		`;

		const submenus = nav.querySelectorAll('.sub-menu');

		submenus.forEach(submenu => {
			submenu.insertAdjacentHTML('afterbegin', backButtonTemplate);

			const backLink = submenu.querySelector('.menu-item-back a');

			backLink.addEventListener('click', this.handleBackButtonClick);
		});
	}

	handleBackButtonClick = (event) => {
		event.preventDefault();

		const submenu = event.target.closest('.menu-item-has-children').querySelector('.sub-menu');

		submenu.classList.remove('is-active');

		this.currentDepth--;
		this.updateMenuPosition();
		this.toggleActionAndSocialBlocksVisibility();
	}

	updateMenuPosition() {
		const {nav} = this.elements;

		nav.style.transform = `translateX(${this.currentDepth * -100}%)`;

		const activeSubmenu = nav.querySelector('.sub-menu.is-active');

		nav.style.height = this.currentDepth > 0 ? `${activeSubmenu.offsetHeight}px` : 'auto';
	}

	toggleActionAndSocialBlocksVisibility() {
		const {actionsBlock, socialsBlock} = this.elements;
		const visibilityClass = this.currentDepth > 0 ? 'add' : 'remove';

		actionsBlock.classList[visibilityClass]('is-hidden');
		socialsBlock.classList[visibilityClass]('is-hidden');
	}

	toggleMenuVisibility = () => {
		if (this.isMenuActive()) {
			this.hideMenu();
		} else {
			this.showMenu();
		}
	}

	showMenu() {
		this.resetMenu();

		const {menu, menuButton, header} = this.elements;

		menu.classList.add('is-active');
		menuButton.classList.add('is-active');
		header.classList.add('mobile-menu-active');
	}

	hideMenu() {
		const {menu, menuButton, header} = this.elements;

		menu.classList.remove('is-active');
		menuButton.classList.remove('is-active');
		header.classList.remove('mobile-menu-active');
	}

	resetMenu() {
		this.currentDepth = 0;

		const {nav} = this.elements;
		const activeSubmenus = nav.querySelectorAll('.sub-menu.is-active');

		activeSubmenus.forEach(submenu => submenu.classList.remove('is-active'));

		this.updateMenuPosition();
		this.toggleActionAndSocialBlocksVisibility();
	}

	isMenuActive() {
		return this.elements.menu.classList.contains('is-active');
	}
}

class Announcement {
	constructor() {
		this.announcementEl = document.querySelector('.site-header__announcement');

		this.installListeners();
		this.updateHeight();
	}

	installListeners() {
		window.addEventListener('resize', Helpers.debounce(() => {
			this.updateHeight();
		}, 100));
	}

	updateHeight() {
		const height = this.announcementEl != null ? this.announcementEl.offsetHeight : 0;

		document.documentElement.style.setProperty('--announcement-height', height + 'px');
	}
}

window.Header = new class {
	constructor() {
		this.init();
	}

	init() {
		//new Announcement();
		new MobileMenu();
	}
}

*/

/***/ }),

/***/ "./assets/src/js/helpers.js":
/*!**********************************!*\
  !*** ./assets/src/js/helpers.js ***!
  \**********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
window.Helpers = new class {
  constructor() {
    this.loadedScripts = new Map();
  }
  throttle(func, delay) {
    let lastCallTime = 0;
    return function (...args) {
      const currentTime = new Date().getTime();
      if (currentTime - lastCallTime >= delay) {
        func.apply(this, args);
        lastCallTime = currentTime;
      }
    };
  }
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  loadScript(url) {
    if (this.loadedScripts.has(url)) {
      return this.loadedScripts.get(url);
    }
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Script load error for ${url}`));
      document.head.appendChild(script);
    });
    this.loadedScripts.set(url, promise);
    return promise;
  }
  loadStyle(url) {
    // check if stylesheet is already loaded
    const styles = document.querySelectorAll('link');
    const isLoaded = Array.from(styles).some(style => style.href === url);
    if (isLoaded) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error(`Style load error for ${url}`));
      document.head.appendChild(link);
    });
  }
  postponeExecution(func, force = false) {
    if (force) {
      func();
      return;
    }
    const handler = event => {
      // Remove the event listeners
      window.removeEventListener('click', handler);
      window.removeEventListener('keypress', handler);
      window.removeEventListener('scroll', handler);
      window.removeEventListener('mousemove', handler);

      // Execute the function
      func(event);
    };

    // Add the event listeners
    window.addEventListener('click', handler, {
      once: true
    });
    window.addEventListener('keypress', handler, {
      once: true
    });
    window.addEventListener('scroll', handler, {
      once: true
    });
    window.addEventListener('mousemove', handler, {
      once: true
    });
  }

  // check if section in viewport
  inViewport(element) {
    if (Array.isArray(element)) {
      return element.some(el => this.inViewport(el));
    }
    const rect = element.getBoundingClientRect();
    return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.bottom > 0 && rect.right > 0;
  }
  isEmailValid(email) {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }
  isCartPage() {
    return document.body.classList.contains('woocommerce-cart');
  }
  isCheckoutPage() {
    return document.body.classList.contains('woocommerce-checkout');
  }
  setCookie(key, value, expiry) {
    let expires = new Date();
    expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
    document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
  }
  removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}();

/***/ }),

/***/ "./assets/src/js/sliders.js":
/*!**********************************!*\
  !*** ./assets/src/js/sliders.js ***!
  \**********************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var splide = new Splide('.splide', {
  type: 'loop',
  fixedWidth: '1320px',
  focus: 'center',
  arrows: false,
  gap: '40px',
  pagination: false
});
splide.mount();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*******************************!*\
  !*** ./assets/src/js/main.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers.js */ "./assets/src/js/helpers.js");
/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./header.js */ "./assets/src/js/header.js");
/* harmony import */ var _assets_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets.js */ "./assets/src/js/assets.js");
/* harmony import */ var _sliders_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sliders.js */ "./assets/src/js/sliders.js");




/******/ })()
;
//# sourceMappingURL=main.js.map