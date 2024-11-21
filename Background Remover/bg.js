const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('download-btn');

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    removeBackground();
    downloadBtn.classList.remove('hidden');
  };
});

function removeBackground() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Threshold for white background (adjust as needed)
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // Set alpha to 0 (transparent)
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'background-removed.png';
  link.href = canvas.toDataURL();
  link.click();
});
