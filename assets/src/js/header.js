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