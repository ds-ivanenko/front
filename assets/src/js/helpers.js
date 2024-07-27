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

		const handler = (event) => {
			// Remove the event listeners
			window.removeEventListener('click', handler);
			window.removeEventListener('keypress', handler);
			window.removeEventListener('scroll', handler);
			window.removeEventListener('mousemove', handler);

			// Execute the function
			func(event);
		};

		// Add the event listeners
		window.addEventListener('click', handler, { once: true });
		window.addEventListener('keypress', handler, { once: true });
		window.addEventListener('scroll', handler, { once: true });
		window.addEventListener('mousemove', handler, { once: true });
	}

	// check if section in viewport
	inViewport(element) {
		if (Array.isArray(element)) {
			return element.some(el => this.inViewport(el));
		}

		const rect = element.getBoundingClientRect();

		return (
			rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
			rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
			rect.bottom > 0 &&
			rect.right > 0
		);
	}

	isEmailValid(email) {
		return String(email).toLowerCase().match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
	}

	isCartPage() {
		return document.body.classList.contains('woocommerce-cart');
	}

	isCheckoutPage() {
		return document.body.classList.contains('woocommerce-checkout');
	}

	setCookie(key, value, expiry) {
		let expires = new Date();
		expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
		document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
	}

	removeCookie(name) {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}
}

