import { Point } from '@/types';

/**
 * Convert ImageData to a binary bitmap (1 = black, 0 = white)
 */
export function toBinaryBitmap(
  imageData: ImageData,
  threshold: number = 128
): Uint8Array {
  const { data, width, height } = imageData;
  const bitmap = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    // Convert to grayscale, consider alpha
    const gray = (0.299 * r + 0.587 * g + 0.114 * b) * (a / 255);
    bitmap[i] = gray < threshold ? 1 : 0;
  }

  return bitmap;
}

/**
 * Calculate Otsu's threshold for automatic binarization
 */
export function otsuThreshold(imageData: ImageData): number {
  const { data } = imageData;
  const histogram = new Array(256).fill(0);
  const total = data.length / 4;

  for (let i = 0; i < total; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    histogram[gray]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * histogram[i];

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let bestThreshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      bestThreshold = t;
    }
  }

  return bestThreshold;
}

/**
 * Find the bounding box of black pixels in a binary bitmap
 */
export function findBoundingBox(
  bitmap: Uint8Array,
  width: number,
  height: number
): { x: number; y: number; w: number; h: number } | null {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (bitmap[y * width + x] === 1) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!found) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * Create an off-screen canvas from ImageData
 */
export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Extract ImageData from a canvas element
 */
export function getCanvasImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Create a clean binary ImageData (pure black on white)
 */
export function cleanBinaryImage(imageData: ImageData): ImageData {
  const threshold = otsuThreshold(imageData);
  const { width, height } = imageData;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const newImageData = ctx.createImageData(width, height);

  for (let i = 0; i < width * height; i++) {
    const r = imageData.data[i * 4];
    const g = imageData.data[i * 4 + 1];
    const b = imageData.data[i * 4 + 2];
    const a = imageData.data[i * 4 + 3];
    const gray = (0.299 * r + 0.587 * g + 0.114 * b) * (a / 255);
    const val = gray < threshold ? 0 : 255;
    newImageData.data[i * 4] = val;
    newImageData.data[i * 4 + 1] = val;
    newImageData.data[i * 4 + 2] = val;
    newImageData.data[i * 4 + 3] = 255;
  }

  return newImageData;
}

/**
 * Crop ImageData to its bounding box with padding
 */
export function cropToContent(
  imageData: ImageData,
  padding: number = 5
): ImageData | null {
  const bitmap = toBinaryBitmap(imageData);
  const bbox = findBoundingBox(bitmap, imageData.width, imageData.height);
  if (!bbox) return null;

  const x = Math.max(0, bbox.x - padding);
  const y = Math.max(0, bbox.y - padding);
  const right = Math.min(imageData.width, bbox.x + bbox.w + padding);
  const bottom = Math.min(imageData.height, bbox.y + bbox.h + padding);
  const w = right - x;
  const h = bottom - y;

  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);

  return ctx.getImageData(x, y, w, h);
}

/**
 * Scale ImageData to target size while maintaining aspect ratio
 */
export function scaleImageData(
  imageData: ImageData,
  targetSize: number
): ImageData {
  const { width, height } = imageData;
  const scale = targetSize / Math.max(width, height);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);

  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext('2d')!;
  srcCtx.putImageData(imageData, 0, 0);

  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = targetSize;
  dstCanvas.height = targetSize;
  const dstCtx = dstCanvas.getContext('2d')!;

  // Center the scaled image
  dstCtx.fillStyle = '#FFFFFF';
  dstCtx.fillRect(0, 0, targetSize, targetSize);
  const offsetX = Math.round((targetSize - newWidth) / 2);
  const offsetY = Math.round((targetSize - newHeight) / 2);
  dstCtx.drawImage(srcCanvas, offsetX, offsetY, newWidth, newHeight);

  return dstCtx.getImageData(0, 0, targetSize, targetSize);
}
