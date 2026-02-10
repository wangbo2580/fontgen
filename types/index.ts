export type InputMode = 'upload' | 'canvas';

export interface GlyphData {
  letter: string;
  unicode: number;
  imageData: ImageData | null;
  source: InputMode;
  svgPath?: string;
}

export interface FontConfig {
  familyName: string;
  styleName: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
}

export interface StrokeSettings {
  width: number;
  color: string;
}

export interface CharacterCropResult {
  letter: string;
  imageData: ImageData;
  qualityScore: number;
  bbox: { x: number; y: number; width: number; height: number };
}

export interface AIPreprocessResult {
  characters: {
    letter: string;
    bbox: { x: number; y: number; width: number; height: number };
    quality_score: number;
  }[];
  issues: string[];
}

export interface Point {
  x: number;
  y: number;
}

export interface ContourPath {
  points: Point[];
  isHole: boolean;
}

// --- Pricing / Plan types ---
export type PlanTier = 'free' | 'basic' | 'pro' | 'business';

export interface PlanInfo {
  tier: PlanTier;
  label: string;
  price: number; // USD, 0 for free
  charCount: number;
  formats: string[];
  commercialLicense: boolean;
  features: string[];
}

// --- Character groups ---
export type CharGroupKey = 'uppercase' | 'lowercase' | 'digits' | 'punctuation';

export interface CharGroup {
  key: CharGroupKey;
  label: string;
  chars: string[];
}

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const DIGIT_CHARS = '0123456789'.split('');
const PUNCTUATION_CHARS = '!@#$%&*()-_=+[]{}|;:\'",./<>?'.split('');

export const CHARACTER_GROUPS: CharGroup[] = [
  { key: 'uppercase', label: 'A-Z', chars: UPPERCASE_CHARS },
  { key: 'lowercase', label: 'a-z', chars: LOWERCASE_CHARS },
  { key: 'digits', label: '0-9', chars: DIGIT_CHARS },
  { key: 'punctuation', label: '!@#', chars: PUNCTUATION_CHARS },
];

// Flat lists for convenience
export const LETTERS_UPPER = UPPERCASE_CHARS;
export const LETTERS_LOWER = LOWERCASE_CHARS;
export const DIGITS = DIGIT_CHARS;
export const PUNCTUATION = PUNCTUATION_CHARS;

/** All characters available in each plan tier */
export const PLAN_CHARACTERS: Record<PlanTier, string[]> = {
  free: [...UPPERCASE_CHARS],
  basic: [...UPPERCASE_CHARS, ...LOWERCASE_CHARS, ...DIGIT_CHARS],
  pro: [...UPPERCASE_CHARS, ...LOWERCASE_CHARS, ...DIGIT_CHARS, ...PUNCTUATION_CHARS],
  business: [...UPPERCASE_CHARS, ...LOWERCASE_CHARS, ...DIGIT_CHARS, ...PUNCTUATION_CHARS],
};

/** All supported characters (union) */
export const ALL_CHARACTERS = PLAN_CHARACTERS.business;

/** Legacy alias (used by many existing files) */
export const LETTERS = UPPERCASE_CHARS;

export const PLAN_DATA: Record<PlanTier, PlanInfo> = {
  free: {
    tier: 'free',
    label: 'Free',
    price: 0,
    charCount: 26,
    formats: ['Preview only'],
    commercialLicense: false,
    features: [
      'A-Z uppercase (26 chars)',
      'Live preview in browser',
      'Preview only (no download)',
    ],
  },
  basic: {
    tier: 'basic',
    label: 'Basic',
    price: 9.99,
    charCount: 62,
    formats: ['.OTF'],
    commercialLicense: false,
    features: [
      'A-Z + a-z + 0-9 (62 chars)',
      '.OTF font download',
      'Personal use license',
    ],
  },
  pro: {
    tier: 'pro',
    label: 'Pro',
    price: 19.99,
    charCount: 90,
    formats: ['.OTF', '.TTF'],
    commercialLicense: false,
    features: [
      'Full character set (90+ chars)',
      '.OTF + .TTF download',
      'Personal use license',
    ],
  },
  business: {
    tier: 'business',
    label: 'Business',
    price: 39.99,
    charCount: 90,
    formats: ['.OTF', '.TTF', '.WOFF2'],
    commercialLicense: true,
    features: [
      'Full character set (90+ chars)',
      '.OTF + .TTF + .WOFF2 download',
      'Commercial use license',
      'Priority support',
    ],
  },
};

export const DEFAULT_FONT_CONFIG: FontConfig = {
  familyName: 'MyHandwriting',
  styleName: 'Regular',
  unitsPerEm: 1000,
  ascender: 800,
  descender: -200,
};

export const CANVAS_SIZE = 200;
export const GRID_COLS = 5;
