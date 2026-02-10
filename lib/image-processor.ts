import { CharacterCropResult, LETTERS } from '@/types';
import { otsuThreshold, toBinaryBitmap, findBoundingBox } from './canvas-utils';

/**
 * Fallback image processor for when AI preprocessing is unavailable.
 * Uses fixed grid coordinates to crop characters from the template.
 */
export function cropByGrid(
  imageData: ImageData,
  cols: number = 5,
  rows: number = 6
): CharacterCropResult[] {
  const { width, height } = imageData;
  const cellW = Math.floor(width / cols);
  const cellH = Math.floor(height / rows);
  const results: CharacterCropResult[] = [];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);

  for (let i = 0; i < LETTERS.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = col * cellW;
    const y = row * cellH;

    // Add padding to avoid edge artifacts
    const pad = Math.round(cellW * 0.05);
    const cropX = x + pad;
    const cropY = y + pad;
    const cropW = cellW - pad * 2;
    const cropH = cellH - pad * 2;

    const cellImageData = ctx.getImageData(cropX, cropY, cropW, cropH);

    // Evaluate quality based on black pixel ratio
    const threshold = otsuThreshold(cellImageData);
    const bitmap = toBinaryBitmap(cellImageData, threshold);
    const bbox = findBoundingBox(bitmap, cropW, cropH);
    const blackPixels = bitmap.reduce((sum, val) => sum + val, 0);
    const totalPixels = cropW * cropH;
    const fillRatio = blackPixels / totalPixels;

    // Quality heuristic: good characters have 5-40% fill ratio
    let qualityScore = 0;
    if (bbox && fillRatio > 0.02 && fillRatio < 0.5) {
      qualityScore = Math.min(100, Math.round(fillRatio * 300));
      // Bonus for reasonable bounding box (not too small, not too large)
      const bboxRatio = (bbox.w * bbox.h) / (cropW * cropH);
      if (bboxRatio > 0.05 && bboxRatio < 0.8) {
        qualityScore = Math.min(100, qualityScore + 20);
      }
    }

    results.push({
      letter: LETTERS[i],
      imageData: cellImageData,
      qualityScore,
      bbox: { x: cropX, y: cropY, width: cropW, height: cropH },
    });
  }

  return results;
}

/**
 * Process an uploaded image: clean, enhance, and prepare for character cropping.
 */
export function preprocessUploadedImage(imageData: ImageData): ImageData {
  const { width, height, data } = imageData;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const newData = ctx.createImageData(width, height);

  // Compute global Otsu threshold
  const threshold = otsuThreshold(imageData);

  // Apply adaptive thresholding for better results with uneven lighting
  const blockSize = 15;
  const halfBlock = Math.floor(blockSize / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

      // Local mean for adaptive threshold
      let sum = 0;
      let count = 0;
      for (let dy = -halfBlock; dy <= halfBlock; dy++) {
        for (let dx = -halfBlock; dx <= halfBlock; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
            const ni = (ny * width + nx) * 4;
            sum += 0.299 * data[ni] + 0.587 * data[ni + 1] + 0.114 * data[ni + 2];
            count++;
          }
        }
      }

      const localMean = sum / count;
      // Use combination of global and local threshold
      const combinedThreshold = (threshold + localMean) / 2 - 10;
      const val = gray < combinedThreshold ? 0 : 255;

      newData.data[i] = val;
      newData.data[i + 1] = val;
      newData.data[i + 2] = val;
      newData.data[i + 3] = 255;
    }
  }

  return newData;
}

/**
 * Load an image file into an ImageData object.
 */
export function loadImageFile(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, img.width, img.height));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
