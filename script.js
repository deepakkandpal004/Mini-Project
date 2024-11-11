document.addEventListener('DOMContentLoaded', function() {
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const downloadLink = document.getElementById('download-link');
    const imageUpload = document.getElementById('image-upload');
    const cropImageUpload = document.getElementById('crop-image-upload');
    const cropCanvas = document.getElementById('crop-canvas');
    const cropBtn = document.getElementById('crop-btn');
    const cropDownloadLink = document.getElementById('crop-download-link');
    
    let img = null;
    let startX = 0;
    let startY = 0;
    let isDrawing = false;
    let cropWidth = 0;
    let cropHeight = 0;

    // Update quality value display on slider change
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = qualitySlider.value + '%';
    });

    // Compress Image Functionality
    compressBtn.addEventListener('click', function() {
        if (imageUpload.files && imageUpload.files[0]) {
            const file = imageUpload.files[0];
            const quality = qualitySlider.value / 100;

            // Create an image element to load the uploaded file
            img = new Image();
            const reader = new FileReader();

            reader.onload = function(event) {
                img.src = event.target.result;
            };

            reader.readAsDataURL(file);

            img.onload = function() {
                // Create a canvas to compress the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const width = img.width;
                const height = img.height;

                // Set the canvas dimensions to match the image
                canvas.width = width;
                canvas.height = height;

                // Draw the image on the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Create the compressed image with the specified quality
                const compressedImage = canvas.toDataURL('image/jpeg', quality);

                // Set the compressed image for download
                const a = document.createElement('a');
                a.href = compressedImage;
                a.download = 'compressed_image.jpg';
                a.style.display = 'block';
                a.textContent = 'Download Compressed Image';

                // Show the download link
                downloadLink.style.display = 'block';
                downloadLink.innerHTML = '';  // Clear any existing content
                downloadLink.appendChild(a);
            };
        } else {
            alert('Please upload an image to compress.');
        }
    });

    // Crop Image Functionality
    cropImageUpload.addEventListener('change', function() {
        if (cropImageUpload.files && cropImageUpload.files[0]) {
            const file = cropImageUpload.files[0];
            const reader = new FileReader();

            reader.onload = function(event) {
                img = new Image();
                img.src = event.target.result;

                img.onload = function() {
                    // Set canvas size and draw the image
                    cropCanvas.width = img.width;
                    cropCanvas.height = img.height;

                    const ctx = cropCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Show crop controls
                    document.querySelector('.crop-controls').style.display = 'block';
                };
            };

            reader.readAsDataURL(file);
        }
    });

    // Mouse events for selecting the crop area
    cropCanvas.addEventListener('mousedown', function(e) {
        const rect = cropCanvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        isDrawing = true;
    });

    cropCanvas.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            const rect = cropCanvas.getBoundingClientRect();
            cropWidth = e.clientX - rect.left - startX;
            cropHeight = e.clientY - rect.top - startY;

            const ctx = cropCanvas.getContext('2d');
            ctx.clearRect(0, 0, cropCanvas.width, cropCanvas.height); // Clear canvas

            // Redraw image
            ctx.drawImage(img, 0, 0);

            // Draw the crop area (rectangle)
            ctx.beginPath();
            ctx.rect(startX, startY, cropWidth, cropHeight);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    });

    cropCanvas.addEventListener('mouseup', function(e) {
        if (isDrawing) {
            isDrawing = false;
            cropImage();
        }
    });

    // Crop the image based on the selected area
    function cropImage() {
        const ctx = cropCanvas.getContext('2d');
        const imageData = ctx.getImageData(startX, startY, cropWidth, cropHeight);

        // Create a new canvas for the cropped image
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');

        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        // Put the cropped image data onto the new canvas
        croppedCtx.putImageData(imageData, 0, 0);

        // Create the cropped image for download
        const croppedImage = croppedCanvas.toDataURL('image/jpeg');

        // Set the cropped image for download
        const a = document.createElement('a');
        a.href = croppedImage;
        a.download = 'cropped_image.jpg';
        a.style.display = 'block';
        a.textContent = 'Download Cropped Image';

        // Show the download link
        cropDownloadLink.style.display = 'block';
        cropDownloadLink.innerHTML = '';  // Clear any existing content
        cropDownloadLink.appendChild(a);
    }
});
