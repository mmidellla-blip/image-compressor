declare module "omggif" {
  interface FrameInfo {
    x: number;
    y: number;
    width: number;
    height: number;
    delay: number;
    disposal: number;
    transparent_index: number;
  }
  class GifReader {
    width: number;
    height: number;
    constructor(buf: Uint8Array);
    numFrames(): number;
    frameInfo(frameNum: number): FrameInfo;
    decodeAndBlitFrameRGBA(frameNum: number, pixels: Uint8Array): void;
  }
  export { GifReader };
}

declare module "gifenc" {
  interface FrameOptions {
    palette: Uint8Array;
    delay?: number;
    repeat?: number;
    transparent?: boolean;
    transparentIndex?: number;
  }
  interface Encoder {
    writeFrame(index: Uint8Array, width: number, height: number, opts: FrameOptions): void;
    finish(): void;
    bytes(): Uint8Array;
  }
  export function GIFEncoder(): Encoder;
  export function quantize(rgba: Uint8ClampedArray | Uint8Array, maxColors: number): Uint8Array;
  export function applyPalette(rgba: Uint8ClampedArray | Uint8Array, palette: Uint8Array): Uint8Array;
}
