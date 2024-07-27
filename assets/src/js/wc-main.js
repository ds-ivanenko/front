(function($) {
	const MIN_QUANTITY = 1;

	function updateCart() {
		$('[name="update_cart"]').trigger("click");
	}

	const updateCartDebounced = Helpers.debounce(updateCart, 500);

	$(document).on("click", ".plus, .minus", function() {
		let $quantityContainer = $(this).closest(".quantity-wrap");
		let $input = $quantityContainer.find(".qty");
		let currentValue = parseFloat($input.val());
		let max = parseFloat($input.attr("max"));
		let min = parseFloat($input.attr("min")) || MIN_QUANTITY;
		let nextVal;

		if ($(this).hasClass("plus")) {
			nextVal = isNaN(max) ? currentValue + 1 : Math.min(currentValue + 1, max);
		} else {
			nextVal = Math.max(currentValue - 1, min);
		}

		$input.val(nextVal).trigger("change");

		if (Helpers.isCartPage() && currentValue !== nextVal) {
			updateCartDebounced();
		}
	});

	$(document).on("submit", '.woocommerce-form', function() {
		$(this).find('[type="submit"]').addClass('working');
	});
})(jQuery);