import { Font, Glyph } from 'opentype.js';
import { GlyphData, FontConfig, DEFAULT_FONT_CONFIG, ALL_CHARACTERS, LETTERS } from '@/types';
import { imageDataToGlyph, createFont, fontToArrayBuffer } from './opentype-wrapper';
import { cleanBinaryImage, cropToContent, scaleImageData } from './canvas-utils';

/**
 * Main font generation pipeline.
 * Takes an array of GlyphData (from canvas or image upload) and produces a font ArrayBuffer.
 */
export async function generateFont(
  glyphDataArray: GlyphData[],
  config: FontConfig = DEFAULT_FONT_CONFIG
): Promise<{ font: Font; buffer: ArrayBuffer }> {
  const glyphs: Glyph[] = [];

  for (const glyphData of glyphDataArray) {
    if (!glyphData.imageData) continue;

    try {
      // 1. Clean the image (binarize)
      const cleaned = cleanBinaryImage(glyphData.imageData);

      // 2. Crop to content
      const cropped = cropToContent(cleaned, 3);
      if (!cropped) continue;

      // 3. Scale to standard size for consistent results
      const scaled = scaleImageData(cropped, 200);

      // 4. Convert to glyph
      const glyph = imageDataToGlyph(
        scaled,
        glyphData.letter,
        glyphData.unicode,
        config
      );

      glyphs.push(glyph);
    } catch (err) {
      console.warn(`Failed to process glyph for ${glyphData.letter}:`, err);
    }
  }

  // Create the font
  const font = createFont(glyphs, config);
  const buffer = fontToArrayBuffer(font);

  return { font, buffer };
}

/**
 * Create a GlyphData array from Canvas ImageData map.
 * Used by the Canvas writing mode. Supports full character set.
 */
export function createGlyphDataFromCanvas(
  canvasDataMap: Map<string, ImageData>
): GlyphData[] {
  return ALL_CHARACTERS.map((letter) => ({
    letter,
    unicode: letter.charCodeAt(0),
    imageData: canvasDataMap.get(letter) || null,
    source: 'canvas' as const,
  }));
}

/**
 * Create a GlyphData array from cropped character images.
 * Used by the Image Upload mode.
 */
export function createGlyphDataFromUpload(
  croppedImages: (ImageData | null)[]
): GlyphData[] {
  return LETTERS.map((letter, index) => ({
    letter,
    unicode: letter.charCodeAt(0),
    imageData: croppedImages[index] || null,
    source: 'upload' as const,
  }));
}

/**
 * Create a Blob URL for font preview via @font-face.
 */
export function createFontPreviewUrl(buffer: ArrayBuffer): string {
  const blob = new Blob([buffer], { type: 'font/otf' });
  return URL.createObjectURL(blob);
}

/**
 * Trigger font file download.
 */
export function downloadFontFile(
  buffer: ArrayBuffer,
  filename: string = 'MyHandwriting.otf'
): void {
  const blob = new Blob([buffer], { type: 'font/otf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
