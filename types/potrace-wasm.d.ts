declare module 'potrace-wasm' {
  export function loadFromCanvas(canvas: HTMLCanvasElement | OffscreenCanvas | unknown): Promise<string>;
  const _default: { loadFromCanvas: typeof loadFromCanvas };
  export default _default;
}
