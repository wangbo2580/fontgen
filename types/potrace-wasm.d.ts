declare module 'potrace-wasm' {
  export function loadFromCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): Promise<string>;
}
