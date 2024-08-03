document.querySelectorAll('.checkbox-item input').forEach(input => {
    console.log('input');
    input.addEventListener('change', function() {
        const blockItem = this.closest('.directions__block-item');
        if (blockItem) {
            if (this.checked) {
                blockItem.classList.add('checked');
            } else {
                blockItem.classList.remove('checked');
            }
        }
    });
});
