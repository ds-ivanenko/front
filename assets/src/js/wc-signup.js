(function($){

	const userEmail = localStorage.getItem( 'register_email' );

	if (userEmail) {
		$('[name="email"]').val(userEmail);
		localStorage.removeItem( 'register_email');
	}

	class ProfilePictureUploader {
		constructor() {
			this.container = document.querySelector('.profile-picture-upload');
			this.uploadButton = this.container.querySelector('.upload-button');
			this.inputEl = this.container.querySelector('[type="file"]');
			this.previewEl = this.container.querySelector('.preview');
			this.formField = document.querySelector('[name="profile_picture"]');

			this.bindEvents();
		}

		bindEvents() {
			this.uploadButton.addEventListener('click', ev => {
				ev.preventDefault();
				this.inputEl.click();
			});

			this.uploadButton.addEventListener('dragover', ev => {
				ev.preventDefault();
				this.uploadButton.classList.add('hover');
			});

			this.uploadButton.addEventListener('dragleave', ev => {
				ev.preventDefault();
				this.uploadButton.classList.remove('hover');
			});

			this.uploadButton.addEventListener('drop', ev => {
				ev.preventDefault();
				this.uploadButton.classList.remove('hover');
				this.inputEl.files = ev.dataTransfer.files;
				this.inputEl.dispatchEvent(new Event('change'));
			});

			this.inputEl.addEventListener('change', ev => {
				this.clearMessage();

				const target = ev.target

				if (target.files && target.files[0]) {
					const maxAllowedSize = 5 * 1024 * 1024;

					if (target.files[0].size > maxAllowedSize) {
						this.showMessage('error', 'The file is too big. Maximum size is 5MB.');
						target.value = '';
						return;
					}

					this.uploadFile();
				}
			});

			this.container.querySelectorAll('[data-remove-file]').forEach(el => {
				el.addEventListener('click', ev => {
					ev.preventDefault();
					this.removeFile();
				});
			});
		}

		showMessage(type, text) {
			this.container.querySelector('.message').classList.add(type);
			this.container.querySelector('.message').textContent = text;
		}

		clearMessage() {
			// remove all classes
			this.container.querySelector('.message').classList.remove('success', 'error');
			this.container.querySelector('.message').textContent = '';
		}

		uploadFile() {
			const file = this.inputEl.files[0];
			const formData = new FormData();

			formData.append('file', file);
			formData.append('action', 'handle_dropped_media');

			this.container.classList.add('is-uploading');
			this.uploadButton.disabled = true;

			fetch(dropParam.upload, {
				method: 'POST',
				body: formData,
			})
				.then(response => response.json())
				.then(data => {

					const {status} = data;

					if (status === 'error') {
						throw new Error(data.message);
					}

					const {file_name, file_url} = data;

					this.fileName = file_name;

					this.renderPreview(file_url);
					this.formField.value = file_name;
				})
				.catch(error => {
					console.error(error);
					this.showMessage('error', error.message);
				}).finally(() => {
				this.container.classList.remove('is-uploading');
			});
		}

		removeFile() {
			const formData = new FormData();

			formData.append('file_name', this.fileName);
			formData.append('action', 'remove_dropped_media');

			this.container.classList.add('is-removing');

			fetch(dropParam.upload, {
				method: 'POST',
				body: formData,
			})
				.then(response => response.json())
				.then(data => {
					const {status} = data;

					if (status === 'error') {
						throw new Error(data.message);
					}

					this.container.classList.remove('has-preview');
					this.previewEl.innerHTML = '';
					this.formField.value = '';
				})
				.catch(error => {
					console.error(error);
					this.showMessage('error', error.message);
				}).finally(() => {
				this.container.classList.remove('is-removing');
				this.uploadButton.disabled = false;
			});
		}

		renderPreview(file_url) {
			this.previewEl.innerHTML = `<img src="${file_url}" alt="Profile picture">`;
			this.container.classList.add('has-preview');
		}
	}

	new ProfilePictureUploader();
})(jQuery);