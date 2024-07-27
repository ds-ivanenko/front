(function($) {
	'use strict';

	class Checkout {
		constructor() {
			this.elements = {
				backButtonWrap: $('.wc-checkout-back'),
				backButton: $('[data-step-back]'),
				shippingForm: $('.shipping-info-wrap'),
				billingForm: $('#billing-info'),
				confirmShippingPlaceholder: $('.confirm-shipping-placeholder'),
				confirmAddressPlaceholder: $('.confirm-address-placeholder'),
				confirmPaymentPlaceholder: $('.confirm-payment-placeholder'),
			};

			this.steps = [...document.querySelectorAll('[data-step]')]
				.map(step => step.getAttribute('data-step'));

			this.installListeners();
			this.toggleShippingForm();
			this.toggleBillingForm();
			this.updateConfirm();
		}

		installListeners() {
			const self = this;

			$(document.body).on('update_checkout', function() {
				$('.shipping-methods').block({
					message: null,
					overlayCSS: {
						background: '#fafafa',
						opacity: 0.6
					}
				});
			});

			$(document.body).on('updated_checkout', function() {
				$('.shipping-methods').unblock();
				self.toggleShippingForm();
				self.toggleBillingForm();
			});

			$('[data-step-to]').on('click', async function() {
				const to = $(this).attr('data-step-to');
				const from = $(this).attr('data-step-from');

				$(this).addClass('working');

				await self.changeStep(to, from);

				$(this).removeClass('working');
			});

			// remove invalid message on input change
			$(document).on('input change', '.validate-required input', function() {
				const fieldRow = $(this).closest('.form-row');

				if ($(this).val() !== '') {
					fieldRow.find('.invalid-message').remove();
				}
			});

			this.elements.backButton.on('click', async function() {
				const to = self.steps[self.steps.indexOf(self.currentStep) - 1];
				const from = self.currentStep;

				await self.changeStep(to, from);
			});

			$('[name="ship_to_different_address"]').on('change', function() {
				self.toggleBillingForm();
			});

			$(document.body).on( 'stripeError', async function() {
				await self.changeStep('payment', false, false);
			});

			$(document).on('click', '.show-login', function(e) {
				e.preventDefault();
				Helpers.removeCookie('customer-email');
				location.reload();
			});
		}

		async changeStep(to, from = null, scroll = true) {
			if (!to) return;

			try {
				if (from != null) {
					await this.validateStep(from, to);
					await this.actionStep(from, to);
				}

				$('.wc-checkout-step').removeClass('is-active');
				$(`.wc-checkout-step[data-step="${to}"]`).addClass('is-active');

				this.currentStep = to;

				this.togglePageTitle();

				if (scroll) {
					this.scrollIntoView();
				}

				$('.wc-checkout').attr('data-current-step', to);
			} catch (err) {
				// console.error(err);
			}
		}


		scrollIntoView() {
			const scrollTop = $('.main-content-section').offset().top - $('.site-header__wrap').height();

			$('html, body').animate({
				scrollTop
			}, 400);
		}

		async actionStep(from, to) {
			if (from === 'login' && to === 'shipping') {
				const data = {};
				const fields = ['billing_first_name', 'billing_last_name', 'billing_phone'];

				fields.forEach(field => {
					data[field] = document.querySelector(`.woocommerce-form-user [name="${field}"]`).value;
				});

				await this.updateUserData(data);

				// update shipping fields
				$('[name="shipping_first_name"]').val(data['billing_first_name']);
				$('[name="shipping_last_name"]').val(data['billing_last_name']);

				// update billing fields
				$('[name="billing_first_name"]').val(data['billing_first_name']);
				$('[name="billing_last_name"]').val(data['billing_last_name']);
			}

			if (from === 'shipping' && to === 'payment') {
				const data = {};

				if (this.shippingFormActive) {
					$('#shipping-info input').each(function() {
						data[this.name] = this.value;
					});
				}

				$('#billing-info input:not(:disabled)').each(function() {
					data[this.name] = this.value;
				});

				await this.updateUserData(data);
				this.updateConfirm();
			}

			if (from === 'payment' && to === 'confirm') {
				this.updateConfirm();
			}
		}

		async validateStep(from, to) {
			let valid = true;

			if (from === 'login' && to === 'shipping') {
				this.validateLoginStep();
			}

			if (from === 'shipping' && to === 'payment') {
				this.validateShippingStep();
			}

			if (from === 'payment' && to === 'confirm') {
				// validate payment fields
			}

			return valid;
		}

		async updateUserData(data) {
			const formData = new FormData();

			formData.append('action', 'update_checkout_user_data');

			Object.keys(data).forEach(name => {
				formData.append(name, data[name]);
			});

			await fetch(wcSettings.ajax_url, {
				method: 'POST',
				body: formData,
			});
		}

		validateLoginStep() {
			this.validateFields($('.woocommerce-form-user .validate-required input'));
		}

		validateShippingStep() {
			if (this.shippingFormActive) {
				this.validateFields($('#shipping-info .validate-required input'));
			}

			this.validateFields($('#billing-info .validate-required input:not(:disabled)'));
		}

		validateFields(fields) {
			let isValidFields = true;
			const requiredText = 'Povinné pole';

			fields.each( function() {
				const fieldRow = $(this).closest('.form-row');
				fieldRow.find('.invalid-message').remove();

				if ( !$(this).prop('disabled') && $(this).val() === '') {
					isValidFields = false;

					fieldRow.addClass('woocommerce-invalid woocommerce-invalid-required-field')
						.find('.woocommerce-input-wrapper')
						.append(`<span class="invalid-message">${requiredText}</span>`);
				}
			} );

			if (!isValidFields) {
				throw new Error('Invalid fields');
			}
		}

		updateConfirm() {
			// update shipping method
			const currentMethod = $('input[name^="shipping_method"]:checked');
			const methodName = currentMethod.closest('li').find('.shipment-method-title').text();
			const methodPrice = currentMethod.closest('li').find('.price-label').text();

			this.elements.confirmShippingPlaceholder.text(`${methodName}: ${methodPrice}`);

			if (this.shippingFormActive) {
				const address = this.getAddressFormatted();
				this.elements.confirmAddressPlaceholder.text(address);
				this.elements.confirmAddressPlaceholder.closest('.confirm-list-item').show();
			} else {
				this.elements.confirmAddressPlaceholder.closest('.confirm-list-item').hide();
			}

			// update payment method
			const paymentMethod = $('input[name="payment_method"]:checked').closest('li').find('label[for^="payment_method_"]').text();
			this.elements.confirmPaymentPlaceholder.text(paymentMethod);
		}

		getAddressFormatted() {
			const data = {};
			const fields = ['address_1', 'city', 'postcode'];

			fields.forEach(field => {
				data[field] = document.querySelector(`#shipping-info [name="shipping_${field}"]`)?.value;
			});

			return `${data.city} ${data.postcode} ${data.address_1}`;
		}

		toggleShippingForm() {
			const shippingMethodsToHide = [
				"zasilkovna>z-points",
				"napostu",
				"napobocce>9",
				"ppl>pickup_point",
				"local_pickup:2"
			];

			const currentMethod = $('input[name^="shipping_method"]:checked').val();
			const hide = shippingMethodsToHide.includes(currentMethod);

			this.elements.shippingForm.toggle(!hide);
			// this.elements.shippingForm.find('input, select').prop('disabled', hide);

			this.shippingFormActive = !hide;
		}

		toggleBillingForm() {
			const isActive = $('[name="ship_to_different_address"]').is(':checked');

			this.elements.billingForm.toggle(isActive);
			this.elements.billingForm.find('input, select').prop('disabled', !isActive);
		}

		togglePageTitle() {
			$('.page-title').toggle(this.currentStep !== 'confirm');
		}
	}

	new Checkout();
})(jQuery);