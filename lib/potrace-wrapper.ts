import { Point, ContourPath } from '@/types';
import { toBinaryBitmap, otsuThreshold } from './canvas-utils';

/**
 * Trace contours from ImageData and return SVG path commands.
 * Uses potrace-wasm as primary path, falls back to pure JS implementation.
 */
export async function traceImageData(imageData: ImageData): Promise<string> {
  try {
    return await traceWithPotrace(imageData);
  } catch (err) {
    console.warn('potrace-wasm failed, falling back to JS:', err);
    return traceWithJS(imageData);
  }
}

/**
 * Primary path: potrace-wasm vectorization.
 * Creates an OffscreenCanvas from ImageData, passes to potrace-wasm.
 */
async function traceWithPotrace(imageData: ImageData): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('potrace-wasm requires browser environment');
  }

  // Dynamic import to avoid SSR/Turbopack static analysis of potrace-wasm's `require('fs')`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const moduleName = 'potrace-wasm';
  const mod: any = await (new Function('m', 'return import(m)'))(moduleName);
  const loadFromCanvas: (c: unknown) => Promise<string> =
    mod.loadFromCanvas ?? mod.default?.loadFromCanvas;

  if (typeof loadFromCanvas !== 'function') {
    throw new Error('potrace-wasm: loadFromCanvas not found');
  }

  // potrace-wasm expects a canvas with getContext('2d') support
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2d context from OffscreenCanvas');
  ctx.putImageData(imageData, 0, 0);

  // loadFromCanvas returns a full SVG string
  const svg: string = await loadFromCanvas(canvas);
  if (!svg) return '';

  // Extract all path d attributes from the SVG
  return extractPathsFromSvg(svg);
}

/**
 * Extract path d-attribute values from an SVG string returned by potrace.
 */
function extractPathsFromSvg(svg: string): string {
  const paths: string[] = [];
  const regex = /\bd="([^"]+)"/g;
  let match;
  while ((match = regex.exec(svg)) !== null) {
    paths.push(match[1]);
  }
  return paths.join(' ');
}

/**
 * Fallback: pure JS contour tracing (Moore boundary + Douglas-Peucker + Catmull-Rom).
 */
function traceWithJS(imageData: ImageData): string {
  const threshold = otsuThreshold(imageData);
  const bitmap = toBinaryBitmap(imageData, threshold);
  const { width, height } = imageData;

  const contours = extractContours(bitmap, width, height);
  if (contours.length === 0) return '';

  const paths: string[] = [];
  for (const contour of contours) {
    const simplified = douglasPeucker(contour.points, 1.5);
    if (simplified.length < 3) continue;
    const pathStr = smoothContourToSvgPath(simplified);
    if (pathStr) paths.push(pathStr);
  }

  return paths.join(' ');
}

// --- Pure JS fallback implementation below ---

function extractContours(
  bitmap: Uint8Array,
  width: number,
  height: number
): ContourPath[] {
  const contours: ContourPath[] = [];
  const visited = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (bitmap[idx] === 1 && visited[idx] === 0) {
        const leftIsWhite = x === 0 || bitmap[y * width + (x - 1)] === 0;
        if (leftIsWhite) {
          const points = traceContour(bitmap, width, height, x, y, visited);
          if (points.length >= 3) {
            contours.push({ points, isHole: false });
          }
        }
      }
    }
  }

  return contours;
}

function traceContour(
  bitmap: Uint8Array,
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Uint8Array
): Point[] {
  const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy = [0, 1, 1, 1, 0, -1, -1, -1];

  const points: Point[] = [];
  let cx = startX;
  let cy = startY;
  let backtrackDir = 4;

  const maxSteps = width * height;
  let steps = 0;
  let firstVisit = true;

  do {
    points.push({ x: cx, y: cy });
    visited[cy * width + cx] = 1;

    const searchStart = (backtrackDir + 1) % 8;
    let found = false;

    for (let i = 0; i < 8; i++) {
      const dir = (searchStart + i) % 8;
      const nx = cx + dx[dir];
      const ny = cy + dy[dir];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && bitmap[ny * width + nx] === 1) {
        cx = nx;
        cy = ny;
        backtrackDir = (dir + 4) % 8;
        found = true;
        break;
      }
    }

    if (!found) break;

    steps++;
    if (steps > maxSteps) break;

    if (cx === startX && cy === startY) {
      if (firstVisit) {
        firstVisit = false;
      } else {
        break;
      }
    }
  } while (!(cx === startX && cy === startY && !firstVisit));

  return points;
}

function douglasPeucker(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2) return [...points];

  let maxDist = 0;
  let maxIdx = 0;
  const first = points[0];
  const last = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistance(points[i], first, last);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [first, last];
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
  }

  const t = Math.max(0, Math.min(1, ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lenSq));
  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;

  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}

function smoothContourToSvgPath(points: Point[]): string {
  const n = points.length;
  if (n < 3) return '';

  let d = `M ${points[0].x} ${points[0].y} `;

  if (n <= 3) {
    for (let i = 1; i < n; i++) {
      d += `L ${points[i].x} ${points[i].y} `;
    }
    d += 'Z';
    return d;
  }

  const tension = 6;

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const cp1x = p1.x + (p2.x - p0.x) / tension;
    const cp1y = p1.y + (p2.y - p0.y) / tension;
    const cp2x = p2.x - (p3.x - p1.x) / tension;
    const cp2y = p2.y - (p3.y - p1.y) / tension;

    d += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
  }

  d += 'Z';
  return d;
}

/**
 * Parse SVG path data string into path commands.
 */
export interface PathCommand {
  type: 'M' | 'L' | 'C' | 'Q' | 'Z';
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
}

export function parseSvgPath(d: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const regex = /([MLCQZ])\s*([-\d.,\s]*)/gi;
  let match;

  while ((match = regex.exec(d)) !== null) {
    const type = match[1].toUpperCase() as PathCommand['type'];
    const nums = match[2]
      .trim()
      .split(/[\s,]+/)
      .filter((s) => s.length > 0)
      .map(Number);

    switch (type) {
      case 'M':
      case 'L':
        if (nums.length >= 2) {
          commands.push({ type, x: nums[0], y: nums[1] });
        }
        break;
      case 'C':
        if (nums.length >= 6) {
          commands.push({
            type,
            x1: nums[0], y1: nums[1],
            x2: nums[2], y2: nums[3],
            x: nums[4], y: nums[5],
          });
        }
        break;
      case 'Q':
        if (nums.length >= 4) {
          commands.push({
            type,
            x1: nums[0], y1: nums[1],
            x: nums[2], y: nums[3],
          });
        }
        break;
      case 'Z':
        commands.push({ type: 'Z' });
        break;
    }
  }

  return commands;
}
