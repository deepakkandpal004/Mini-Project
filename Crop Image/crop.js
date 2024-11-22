let cropper;
        const image = document.getElementById('image');
        const fileInput = document.getElementById('fileInput');
        const uploadContainer = document.getElementById('uploadContainer');
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        const imageInfo = document.getElementById('imageInfo');
        const aspectControls = document.getElementById('aspectControls');

        // Upload handlers
        uploadContainer.addEventListener('click', () => fileInput.click());
        
        uploadContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadContainer.classList.add('dragover');
        });

        uploadContainer.addEventListener('dragleave', () => {
            uploadContainer.classList.remove('dragover');
        });

        uploadContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadContainer.classList.remove('dragover');
            handleFile(e.dataTransfer.files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            handleFile(e.target.files[0]);
        });

        function handleFile(file) {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    image.src = e.target.result;
                    image.classList.remove('hidden');
                    initCropper();
                };
                reader.readAsDataURL(file);
            }
        }

        function initCropper() {
            if (cropper) {
                cropper.destroy();
            }

            cropper = new Cropper(image, {
                viewMode: 2,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
            });
        }

        // Aspect ratio controls
        aspectControls.addEventListener('click', (e) => {
            if (e.target.classList.contains('aspect-ratio-btn')) {
                const buttons = aspectControls.getElementsByClassName('aspect-ratio-btn');
                Array.from(buttons).forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const ratio = e.target.dataset.ratio;
                let aspectRatio = NaN; // Free aspect ratio

                switch(ratio) {
                    case '1:1':
                        aspectRatio = 1;
                        break;
                    case '16:9':
                        aspectRatio = 16/9;
                        break;
                    case '4:3':
                        aspectRatio = 4/3;
                        break;
                    case '3:2':
                        aspectRatio = 3/2;
                        break;
                }

                cropper.setAspectRatio(aspectRatio);
            }
        });

        // Rotation and flip controls
        document.getElementById('rotateLeft').addEventListener('click', () => cropper.rotate(-90));
        document.getElementById('rotateRight').addEventListener('click', () => cropper.rotate(90));
        document.getElementById('flipH').addEventListener('click', () => cropper.scaleX(-cropper.getData().scaleX || -1));
        document.getElementById('flipV').addEventListener('click', () => cropper.scaleY(-cropper.getData().scaleY || -1));

        // Crop and preview
        document.getElementById('cropBtn').addEventListener('click', () => {
            const croppedCanvas = cropper.getCroppedCanvas();
            previewImage.src = croppedCanvas.toDataURL('image/png');
            previewContainer.classList.add('show');

            // Display image dimensions
            const dimensions = `${croppedCanvas.width} × ${croppedCanvas.height} pixels`;
            imageInfo.textContent = dimensions;
        });

        // Download cropped image
        document.getElementById('downloadBtn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'cropped-image.png';
            link.href = previewImage.src;
            link.click();
        });