declare module 'opentype.js' {
  export class Path {
    commands: PathCommand[];
    constructor();
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    curveTo(
      x1: number, y1: number,
      x2: number, y2: number,
      x: number, y: number
    ): void;
    quadTo(
      x1: number, y1: number,
      x: number, y: number
    ): void;
    close(): void;
    toPathData(decimalPlaces?: number): string;
    toSVG(decimalPlaces?: number): string;
  }

  export interface PathCommand {
    type: string;
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
  }

  export class Glyph {
    name: string;
    unicode: number;
    unicodes: number[];
    advanceWidth: number;
    path: Path;
    constructor(options: {
      name: string;
      unicode: number;
      advanceWidth: number;
      path: Path;
    });
  }

  export class BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  export class Font {
    familyName: string;
    styleName: string;
    unitsPerEm: number;
    ascender: number;
    descender: number;
    glyphs: GlyphSet;

    constructor(options: {
      familyName: string;
      styleName: string;
      unitsPerEm: number;
      ascender: number;
      descender: number;
      glyphs: Glyph[];
    });

    toArrayBuffer(): ArrayBuffer;
    download(fileName?: string): void;
    getPath(text: string, x: number, y: number, fontSize: number): Path;
    charToGlyph(char: string): Glyph;
    stringToGlyphs(s: string): Glyph[];
  }

  export interface GlyphSet {
    length: number;
    get(index: number): Glyph;
  }

  export function parse(buffer: ArrayBuffer | Buffer, opt?: object): Font;
  export function load(url: string, callback?: (err: Error | null, font?: Font) => void): void;
  export function loadSync(url: string): Font;

  const opentype: {
    Font: typeof Font;
    Glyph: typeof Glyph;
    Path: typeof Path;
    BoundingBox: typeof BoundingBox;
    parse: typeof parse;
    load: typeof load;
    loadSync: typeof loadSync;
  };

  export default opentype;
}
