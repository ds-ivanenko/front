(function ($) {

	"use strict";

	$(function ($) {

		let isUserExist = false;

		const ajaxUrl = themeSettings.ajax_url;
		const redirectAfterLogin = $('[name="redirect"]').val();
		const $userEmail = $('[name="username"]');
		const $formSubmit = $('[type="submit"]');
		const $loginForm = $('form.login');
		const $notices = $('.wc-form__notices');
		const isCheckout = Helpers.isCheckoutPage();

		$userEmail.on('input change', function () {
			$formSubmit.prop('disabled', !Helpers.isEmailValid($(this).val()));
		}).trigger('change');

		$loginForm.on('submit', function (e) {

			if (isUserExist) {
				$("form.login").submit();
				return;
			}

			e.preventDefault();

			$.ajax({
				method: 'POST',
				url: ajaxUrl,
				data: {
					action: 'check_user_exists',
					email: $userEmail.val(),
					checkout: isCheckout
				},
				beforeSend: function () {
					$formSubmit.addClass('working');
					$notices.text('');
				},
				success: function (res) {
					const {user_exists, has_subscription, redirect} = res;

					if ((isCheckout && user_exists && has_subscription) || (!isCheckout && user_exists)) {
						$(".wc-form__password").slideDown();
						isUserExist = true;
					} else {
						if (isCheckout) {
							Helpers.setCookie('customer-email', $userEmail.val(), 1);
						} else {
							window.localStorage.setItem('register_email', $userEmail.val());
						}

						$(location).prop('href', redirect ? redirect : redirectAfterLogin);
					}
				},
				error: function (e) {
					$notices.text(e.statusText);
				},
				complete: function () {
					$formSubmit.removeClass('working');
				}
			});
		});
	});

})(jQuery);
