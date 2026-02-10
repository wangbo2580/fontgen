import { Font, Glyph, Path } from 'opentype.js';
import { FontConfig, DEFAULT_FONT_CONFIG } from '@/types';
import { traceImageData, parseSvgPath } from './potrace-wrapper';
import { toBinaryBitmap, findBoundingBox, otsuThreshold } from './canvas-utils';

/**
 * Convert a single character ImageData to an opentype.js Glyph.
 */
export function imageDataToGlyph(
  imageData: ImageData,
  letter: string,
  unicode: number,
  config: FontConfig = DEFAULT_FONT_CONFIG
): Glyph {
  const path = new Path();
  const { unitsPerEm, ascender, descender } = config;

  // Trace the image to get SVG path
  const svgPathStr = traceImageData(imageData);

  if (!svgPathStr) {
    return new Glyph({
      name: letter,
      unicode,
      advanceWidth: Math.round(unitsPerEm * 0.5),
      path,
    });
  }

  // Get bounding box of the character in image space
  const threshold = otsuThreshold(imageData);
  const bitmap = toBinaryBitmap(imageData, threshold);
  const bbox = findBoundingBox(bitmap, imageData.width, imageData.height);

  if (!bbox) {
    return new Glyph({
      name: letter,
      unicode,
      advanceWidth: Math.round(unitsPerEm * 0.5),
      path,
    });
  }

  // Calculate scaling and positioning
  const sourceSize = Math.max(imageData.width, imageData.height, 1);
  const glyphHeight = ascender - descender;
  const scale = glyphHeight / sourceSize;

  // Parse SVG path and convert to opentype path
  const commands = parseSvgPath(svgPathStr);

  for (const cmd of commands) {
    switch (cmd.type) {
      case 'M':
        path.moveTo(
          transformX(cmd.x!, scale),
          transformY(cmd.y!, scale, ascender)
        );
        break;
      case 'L':
        path.lineTo(
          transformX(cmd.x!, scale),
          transformY(cmd.y!, scale, ascender)
        );
        break;
      case 'C':
        path.curveTo(
          transformX(cmd.x1!, scale),
          transformY(cmd.y1!, scale, ascender),
          transformX(cmd.x2!, scale),
          transformY(cmd.y2!, scale, ascender),
          transformX(cmd.x!, scale),
          transformY(cmd.y!, scale, ascender)
        );
        break;
      case 'Q':
        path.quadTo(
          transformX(cmd.x1!, scale),
          transformY(cmd.y1!, scale, ascender),
          transformX(cmd.x!, scale),
          transformY(cmd.y!, scale, ascender)
        );
        break;
      case 'Z':
        path.close();
        break;
    }
  }

  // Calculate advance width based on character width
  const charWidthInUnits = Math.round(bbox.w * scale);
  const advanceWidth = Math.max(
    Math.round(unitsPerEm * 0.3),
    Math.min(charWidthInUnits + Math.round(unitsPerEm * 0.1), unitsPerEm)
  );

  return new Glyph({
    name: letter,
    unicode,
    advanceWidth,
    path,
  });
}

function transformX(x: number, scale: number): number {
  return Math.round(x * scale);
}

function transformY(y: number, scale: number, ascender: number): number {
  return Math.round(ascender - y * scale);
}

/**
 * Create the .notdef glyph (required by OpenType spec).
 */
export function createNotdefGlyph(config: FontConfig = DEFAULT_FONT_CONFIG): Glyph {
  const path = new Path();
  const w = Math.round(config.unitsPerEm * 0.5);
  const h = config.ascender;
  const d = config.descender;

  path.moveTo(50, d + 50);
  path.lineTo(w - 50, d + 50);
  path.lineTo(w - 50, h - 50);
  path.lineTo(50, h - 50);
  path.close();

  path.moveTo(100, d + 100);
  path.lineTo(100, h - 100);
  path.lineTo(w - 100, h - 100);
  path.lineTo(w - 100, d + 100);
  path.close();

  return new Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: w,
    path,
  });
}

/**
 * Create a space glyph.
 */
export function createSpaceGlyph(config: FontConfig = DEFAULT_FONT_CONFIG): Glyph {
  return new Glyph({
    name: 'space',
    unicode: 32,
    advanceWidth: Math.round(config.unitsPerEm * 0.25),
    path: new Path(),
  });
}

/**
 * Create a complete Font from an array of glyphs.
 */
export function createFont(
  glyphs: Glyph[],
  config: FontConfig = DEFAULT_FONT_CONFIG
): Font {
  const notdef = createNotdefGlyph(config);
  const space = createSpaceGlyph(config);

  return new Font({
    familyName: config.familyName,
    styleName: config.styleName,
    unitsPerEm: config.unitsPerEm,
    ascender: config.ascender,
    descender: config.descender,
    glyphs: [notdef, space, ...glyphs],
  });
}

/**
 * Export font as ArrayBuffer for download.
 */
export function fontToArrayBuffer(font: Font): ArrayBuffer {
  return font.toArrayBuffer();
}
