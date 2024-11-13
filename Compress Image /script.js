document.addEventListener('DOMContentLoaded', function() {
  const compressBtn = document.getElementById('compress-btn');
  const downloadLink = document.getElementById('download-link');
  const imageUpload = document.getElementById('image-upload');
  const qualityButtons = document.querySelectorAll('.quality-btn');
  const qualityInput = document.getElementById('quality-input');

  let uploadedImage = null;
  let compressionQuality = 0.8; // Default quality

  // Handle preset quality buttons
  qualityButtons.forEach(button => {
      button.addEventListener('click', () => {
          compressionQuality = parseFloat(button.getAttribute('data-quality'));
      });
  });

  // Handle custom quality input
  qualityInput.addEventListener('change', () => {
      const inputQuality = parseInt(qualityInput.value, 10);
      if (inputQuality >= 1 && inputQuality <= 100) {
          compressionQuality = inputQuality / 100;
      } else {
          alert("Please enter a quality between 1 and 100.");
      }
  });

  // Load image when selected
  imageUpload.addEventListener('change', () => {
      const file = imageUpload.files[0];
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
              uploadedImage = new Image();
              uploadedImage.src = event.target.result;
          };
          reader.readAsDataURL(file);
      } else {
          alert("Please upload a valid image file.");
      }
  });

  // Compress and prepare image for download
  compressBtn.addEventListener('click', async () => {
      if (!uploadedImage || !uploadedImage.src) {
          alert('Please upload an image to compress.');
          return;
      }

      const compressedImageURL = await compressImage(uploadedImage, compressionQuality);

      // Set up download link for compressed image
      downloadLink.href = compressedImageURL;
      downloadLink.download = 'compressed_image.jpg';
      downloadLink.style.display = 'block';
  });

  // Function to compress image using Canvas API
  async function compressImage(image, quality) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, image.width, image.height);
      
      return canvas.toDataURL('image/jpeg', quality);
  }
});


  