import { AIPreprocessResult, CharacterCropResult, LETTERS } from '@/types';
import { otsuThreshold, toBinaryBitmap, findBoundingBox } from './canvas-utils';

/**
 * Call the AI preprocessing API to analyze an uploaded handwriting image.
 * Returns character bounding boxes and quality scores.
 */
export async function aiPreprocess(
  imageBase64: string,
  timeoutMs: number = 15000
): Promise<AIPreprocessResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('/api/preprocess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as AIPreprocessResult;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Crop characters from an image using AI-provided bounding boxes.
 */
export function cropWithAICoordinates(
  imageData: ImageData,
  aiResult: AIPreprocessResult
): CharacterCropResult[] {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);

  return aiResult.characters.map((char) => {
    const { x, y, width, height } = char.bbox;
    const safeX = Math.max(0, Math.round(x));
    const safeY = Math.max(0, Math.round(y));
    const safeW = Math.min(imageData.width - safeX, Math.round(width));
    const safeH = Math.min(imageData.height - safeY, Math.round(height));

    const cellImageData = ctx.getImageData(safeX, safeY, safeW, safeH);

    return {
      letter: char.letter,
      imageData: cellImageData,
      qualityScore: char.quality_score,
      bbox: { x: safeX, y: safeY, width: safeW, height: safeH },
    };
  });
}

/**
 * Convert an image file to base64 string for API transmission.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Try AI preprocessing, fallback to grid-based cropping if it fails.
 */
export async function preprocessImage(
  file: File,
  imageData: ImageData
): Promise<{
  results: CharacterCropResult[];
  method: 'ai' | 'fallback';
}> {
  try {
    const base64 = await fileToBase64(file);
    const aiResult = await aiPreprocess(base64);

    if (aiResult.characters && aiResult.characters.length > 0) {
      const results = cropWithAICoordinates(imageData, aiResult);
      return { results, method: 'ai' };
    }

    throw new Error('AI returned no characters');
  } catch (error) {
    console.warn('AI preprocessing failed, using fallback:', error);
    // Dynamic import to avoid circular dependency
    const { cropByGrid } = await import('./image-processor');
    const results = cropByGrid(imageData);
    return { results, method: 'fallback' };
  }
}
