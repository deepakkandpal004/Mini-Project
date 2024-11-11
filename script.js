document.addEventListener('DOMContentLoaded', function() {
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');
    const compressBtn = document.getElementById('compress-btn');
    const downloadLink = document.getElementById('download-link');
    const imageUpload = document.getElementById('image-upload');

    // Update the displayed quality value as the user moves the slider
    qualitySlider.addEventListener('input', function() {
        qualityValue.textContent = qualitySlider.value + '%';
    });

    compressBtn.addEventListener('click', function() {
        if (imageUpload.files && imageUpload.files[0]) {
            const file = imageUpload.files[0];
            const quality = qualitySlider.value / 100; // Quality is a value between 0 and 1

            // Create an image element to load the uploaded file
            const img = new Image();
            const reader = new FileReader();

            reader.onload = function(e) {
                img.src = e.target.result;
            };

            img.onload = function() {
                // Create a canvas element to compress the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set the canvas size to the image's size
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, img.width, img.height);

                // Compress the image by adjusting the quality
                const compressedDataUrl = canvas.toDataURL(file.type, quality);

                // Create a downloadable link for the compressed image
                const downloadButton = downloadLink.querySelector('button');
                downloadButton.onclick = function() {
                    const a = document.createElement('a');
                    a.href = compressedDataUrl;
                    a.download = 'compressed-image.jpg'; // Set the file name for download
                    a.click();
                };

                // Display the download link
                downloadLink.style.display = 'inline-block';
            };

            reader.readAsDataURL(file);
        } 
        else {
            alert('Please select an image to compress.');
        }
    });
});
