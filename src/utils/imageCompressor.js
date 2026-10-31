/**
 * Utility to compress and resize images client-side before uploading.
 * Reduces 5MB-15MB smartphone photos down to ~150KB-400KB,
 * preventing 413 (Content Too Large) errors and speeding up uploads by 10x.
 */

export async function compressImage(
  file,
  {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    maxSizeToSkip = 400 * 1024, // Images smaller than 400KB aren't re-compressed unless oversized
  } = {}
) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }

  // Skip SVGs and animated GIFs
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      // If already small in filesize and reasonable in dimensions, keep original
      if (
        file.size <= maxSizeToSkip &&
        originalWidth <= maxWidth &&
        originalHeight <= maxHeight
      ) {
        resolve(file);
        return;
      }

      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) {
        resolve(file);
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Determine output format: WebP preserves alpha and provides exceptional compression.
      // If original was PNG, prefer WebP. If JPEG, use JPEG or WebP.
      const isPng = file.type === 'image/png';
      const outputMime = isPng ? 'image/webp' : 'image/jpeg';
      const newExtension = isPng ? '.webp' : '.jpg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If compression somehow produced a larger file, keep original
          if (blob.size >= file.size && originalWidth <= maxWidth && originalHeight <= maxHeight) {
            resolve(file);
            return;
          }

          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const compressedFile = new File([blob], `${baseName}${newExtension}`, {
            type: outputMime,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        outputMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}
