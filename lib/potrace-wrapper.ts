import { Point, ContourPath } from '@/types';
import { toBinaryBitmap, otsuThreshold } from './canvas-utils';

/**
 * Trace contours from ImageData and return SVG path commands.
 * Pure JavaScript implementation using marching squares contour extraction.
 */
export function traceImageData(imageData: ImageData): string {
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

/**
 * Extract contours from a binary bitmap using boundary following.
 * All coordinates are in the original image coordinate space.
 */
function extractContours(
  bitmap: Uint8Array,
  width: number,
  height: number
): ContourPath[] {
  const contours: ContourPath[] = [];
  // Track which pixels have been claimed as contour start points
  const visited = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      // Look for outer contour: black pixel with white (or border) to its left
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

/**
 * Trace a single contour using Moore neighborhood boundary tracing.
 * All coordinates stay within [0, width) x [0, height).
 */
function traceContour(
  bitmap: Uint8Array,
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Uint8Array
): Point[] {
  // 8-directional neighbors: right, down-right, down, down-left, left, up-left, up, up-right
  const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy = [0, 1, 1, 1, 0, -1, -1, -1];

  const points: Point[] = [];
  let cx = startX;
  let cy = startY;
  // Start searching from the left direction (index 4)
  let backtrackDir = 4;

  const maxSteps = width * height;
  let steps = 0;
  let firstVisit = true;

  do {
    points.push({ x: cx, y: cy });
    visited[cy * width + cx] = 1;

    // Search clockwise starting from (backtrackDir + 1) % 8
    const searchStart = (backtrackDir + 1) % 8;
    let found = false;

    for (let i = 0; i < 8; i++) {
      const dir = (searchStart + i) % 8;
      const nx = cx + dx[dir];
      const ny = cy + dy[dir];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height && bitmap[ny * width + nx] === 1) {
        // Move to this neighbor
        cx = nx;
        cy = ny;
        // Backtrack direction is opposite of the direction we came from
        backtrackDir = (dir + 4) % 8;
        found = true;
        break;
      }
    }

    if (!found) break;

    steps++;
    if (steps > maxSteps) break;

    // Check if we've returned to start
    if (cx === startX && cy === startY) {
      if (firstVisit) {
        firstVisit = false;
        // Continue to verify it's a closed loop, not just touching start
      } else {
        break;
      }
    }
  } while (!(cx === startX && cy === startY && !firstVisit));

  return points;
}

/**
 * Douglas-Peucker line simplification algorithm.
 * Reduces the number of points while preserving shape.
 */
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

/**
 * Convert simplified contour points to SVG path with smooth cubic Bezier curves.
 * Uses Catmull-Rom to Cubic Bezier conversion correctly:
 * For each segment between p[i] and p[i+1], generate one cubic Bezier curve.
 */
function smoothContourToSvgPath(points: Point[]): string {
  const n = points.length;
  if (n < 3) return '';

  let d = `M ${points[0].x} ${points[0].y} `;

  if (n <= 3) {
    // Too few points for smooth curves, use line segments
    for (let i = 1; i < n; i++) {
      d += `L ${points[i].x} ${points[i].y} `;
    }
    d += 'Z';
    return d;
  }

  // Generate one cubic Bezier curve per segment (from points[i] to points[i+1])
  // Using Catmull-Rom spline through 4 consecutive points
  const tension = 6; // Higher = tighter curves

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    // Catmull-Rom to Cubic Bezier control points for the segment p1 -> p2
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
  // Match command letter followed by optional numeric arguments
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
