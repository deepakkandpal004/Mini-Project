const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const maxWidthInput = document.getElementById('maxWidth');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalInfo = document.getElementById('originalInfo');
const compressedInfo = document.getElementById('compressedInfo');
const previewArea = document.getElementById('previewArea');
const downloadBtn = document.getElementById('downloadBtn');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');

let originalImage = null;

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (originalImage) {
        compressImage();
    }
});

maxWidthInput.addEventListener('change', () => {
    if (originalImage) {
        compressImage();
    }
});

function handleFiles(files) {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.onload = () => {
                displayOriginalImage(file);
                compressImage();
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function displayOriginalImage(file) {
    originalPreview.src = URL.createObjectURL(file);
    originalInfo.textContent = `Size: ${formatBytes(file.size)} | ${originalImage.width}x${originalImage.height}px`;
    previewArea.style.display = 'grid';
}

function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxWidth = parseInt(maxWidthInput.value);
    const quality = parseInt(qualitySlider.value) / 100;

    // Calculate new dimensions
    let width = originalImage.width;
    let height = originalImage.height;

    if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    // Show progress
    progress.style.display = 'block';
    progressBar.style.width = '50%';

    // Draw and compress
    ctx.drawImage(originalImage, 0, 0, width, height);
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        compressedPreview.src = url;
        compressedInfo.textContent = `Size: ${formatBytes(blob.size)} | ${width}x${height}px`;
        
        // Update progress
        progressBar.style.width = '100%';
        setTimeout(() => {
            progress.style.display = 'none';
            progressBar.style.width = '0%';
        }, 500);

        downloadBtn.disabled = false;
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = 'compressed_image.jpg';
            link.click();
        };
    }, 'image/jpeg', quality);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}