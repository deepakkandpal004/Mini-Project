document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file-input');
    const image = document.getElementById('image');
    const cropBtn = document.getElementById('crop-btn');
    const downloadLink = document.getElementById('download-link');
    const canvas = document.getElementById('canvas');
    let cropper;

    // Load image and initialize cropper
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                image.src = e.target.result;
                image.style.display = 'block';
                cropBtn.style.display = 'inline-block';

                // Destroy previous cropper instance if it exists
                if (cropper) cropper.destroy();

                // Wait for image to load, then initialize cropper
                image.onload = () => {
                    cropper = new Cropper(image, {
                        aspectRatio: 1, // Adjust aspect ratio as needed
                        viewMode: 1,
                        autoCropArea: 1,
                    });
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file.");
        }
    });

    // Crop and download image
    cropBtn.addEventListener('click', () => {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            downloadLink.href = croppedCanvas.toDataURL('image/jpeg');
            downloadLink.download = 'cropped_image.jpg';
            downloadLink.style.display = 'block';
        } else {
            alert("Please select an image to crop.");
        }
    });
});
