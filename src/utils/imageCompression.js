/**
 * Compresses an image file using HTML5 Canvas.
 * @param {File} file - The original image file.
 * @param {Object} options - Compression options.
 * @param {number} options.maxWidth - Max width of the output image.
 * @param {number} options.maxHeight - Max height of the output image.
 * @param {number} options.quality - Compression quality (0 to 1).
 * @returns {Promise<File|Blob>} - The compressed image file.
 */
export async function compressImage(file, { maxWidth = 1280, maxHeight = 720, quality = 0.7 } = {}) {
  // If it's not an image or it's small, skip compression
  if (!file.type.startsWith('image/') || file.size < 500 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression failed'));
              return;
            }
            // Return as a new File object if possible, otherwise blob
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
