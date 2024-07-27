class AddToCart {
	constructor() {
		this.popup = document.querySelector(".add-to-cart-popup");
		this.popupContentSuccess = this.popup.querySelector(".add-to-cart-popup__content--success");
		this.popupContentError = this.popup.querySelector(".add-to-cart-popup__content--error");

		this.popup.querySelectorAll('[data-popup-close]').forEach(el => {
			el.addEventListener('click', () => this.closePopup());
		});

		document.addEventListener('click', ev => {
			if (ev.target.classList.contains('add_to_cart_button')) {
				ev.preventDefault();

				const productId = ev.target.dataset.product_id;
				const quantity = 1;

				this.addToCart(productId, quantity, ev.target);
			}
		});

		if (this.isProductPage()) {
			document.querySelector(['form.cart']).addEventListener('submit', ev => {
				ev.preventDefault();

				const productId = ev.target.querySelector('[name="add-to-cart"]').value;
				const quantity = ev.target.querySelector('[name="quantity"]').value;

				this.addToCart(productId, quantity, ev.target.querySelector('.single_add_to_cart_button'));
			});
		}
	}

	isCartPage() {
		return document.body.classList.contains('woocommerce-cart');
	}

	isProductPage() {
		return document.body.classList.contains('single-product');
	}

	addToCart(productId, quantity, button) {

		button.classList.add("working");

		const data = {
			action: "add_product_to_cart",
			product_id: productId,
			quantity: quantity
		};

		jQuery.post(wcSettings['ajax_url'], data, response => {

			// Trigger fragments refresh
			if (response['fragments']) {
				jQuery( document.body ).trigger( 'added_to_cart', [
					response['fragments'],
					response['cart_hash'],
					jQuery(button)
				]);
			}

			button.classList.remove("working");

			if ( ! this.isCartPage() ) {
				this.openPopup();
			}

			if (response['get_wc_notices'].length === 0) {
				this.popupContentSuccess.classList.add("is-active");
			} else {
				this.popupContentError.classList.add("is-active");
			}
		});
	}

	resetPopup() {
		this.popup.querySelectorAll(".add-to-cart-popup__content").forEach(el => {
			el.classList.remove("is-active");
		});
	}

	openPopup() {
		this.resetPopup();

		this.popup.classList.add("is-active");
	}

	closePopup() {
		this.popup.classList.remove("is-active");
	}
}

new AddToCart();