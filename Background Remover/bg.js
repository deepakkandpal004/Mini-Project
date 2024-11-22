const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const removeBtn = document.getElementById('removeBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const loading = document.getElementById('loading');
        const toleranceInput = document.getElementById('tolerance');
        const toleranceValue = document.getElementById('toleranceValue');

        let originalCanvas, processedCanvas;
        let originalImage = null;

        // Initialize Fabric.js canvases
        originalCanvas = new fabric.Canvas('originalCanvas', {
            selection: false,
            devicePixelRatio: 2
        });

        processedCanvas = new fabric.Canvas('processedCanvas', {
            selection: false,
            devicePixelRatio: 2
        });

        // Drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImage(file);
            }
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleImage(file);
            }
        });

        toleranceInput.addEventListener('input', (e) => {
            toleranceValue.textContent = e.target.value;
        });

        function handleImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    resetCanvases();
                    const scale = Math.min(500 / img.width, 500 / img.height);
                    originalCanvas.setDimensions({
                        width: img.width * scale,
                        height: img.height * scale
                    });
                    processedCanvas.setDimensions({
                        width: img.width * scale,
                        height: img.height * scale
                    });

                    const fabricImage = new fabric.Image(img, {
                        scaleX: scale,
                        scaleY: scale
                    });
                    originalCanvas.add(fabricImage);
                    originalCanvas.renderAll();
                    removeBtn.disabled = false;
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function resetCanvases() {
            originalCanvas.clear();
            processedCanvas.clear();
            downloadBtn.disabled = true;
        }

        removeBtn.addEventListener('click', async () => {
            if (!originalImage) return;

            loading.classList.add('active');
            removeBtn.disabled = true;

            // Simulate background removal processing
            setTimeout(() => {
                const tolerance = parseInt(toleranceInput.value);
                removeBackground(originalImage, tolerance);
                loading.classList.remove('active');
                removeBtn.disabled = false;
                downloadBtn.disabled = false;
            }, 1000);
        });

        function removeBackground(img, tolerance) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            tempCtx.drawImage(img, 0, 0);

            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const pixels = imageData.data;

            // Get background color (assuming top-left pixel is background)
            const bgColor = {
                r: pixels[0],
                g: pixels[1],
                b: pixels[2]
            };

            // Remove background
            for (let i = 0; i < pixels.length; i += 4) {
                const difference = Math.sqrt(
                    Math.pow(pixels[i] - bgColor.r, 2) +
                    Math.pow(pixels[i + 1] - bgColor.g, 2) +
                    Math.pow(pixels[i + 2] - bgColor.b, 2)
                );

                if (difference < tolerance) {
                    pixels[i + 3] = 0; // Set alpha to 0 (transparent)
                }
            }

            tempCtx.putImageData(imageData, 0, 0);

            // Display processed image
            fabric.Image.fromURL(tempCanvas.toDataURL(), (fabricImage) => {
                const scale = Math.min(500 / img.width, 500 / img.height);
                fabricImage.scale(scale);
                processedCanvas.clear();
                processedCanvas.add(fabricImage);
                processedCanvas.renderAll();
            });
        }

        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'background-removed.png';
            link.href = processedCanvas.toDataURL({
                format: 'png',
                quality: 1
            });
            link.click();
        });