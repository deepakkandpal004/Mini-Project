const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('file-input');
        const fileSelect = document.getElementById('file-select');
        const preview = document.getElementById('preview');
        const toPngBtn = document.getElementById('to-png');
        const toWebpBtn = document.getElementById('to-webp');
        const downloadBtn = document.getElementById('download');

        let currentImage = null;

        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('drag-over'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('drag-over'), false);
        });

        dropzone.addEventListener('drop', handleDrop, false);
        fileSelect.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFiles);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files } });
        }

        function handleFiles(e) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
                currentImage = event.target.result;
            }
            reader.readAsDataURL(file);
        }

        // Conversion functions
        function convertImage(format) {
            if (!currentImage) return;

            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const dataUrl = canvas.toDataURL(`image/${format}`);
                preview.src = dataUrl;
                currentImage = dataUrl;
            }
            img.src = currentImage;
        }

        // Download function
        function downloadImage() {
            if (!currentImage) return;

            const link = document.createElement('a');
            link.download = `converted_image.${getFileExtension()}`;
            link.href = currentImage;
            link.click();
        }

        function getFileExtension() {
            const format = currentImage.split(';')[0].split('/')[1];
            return format === 'jpeg' ? 'jpg' : format;
        }

        // Event Listeners
        toPngBtn.addEventListener('click', () => convertImage('png'));
        toWebpBtn.addEventListener('click', () => convertImage('webp'));
        downloadBtn.addEventListener('click', downloadImage);