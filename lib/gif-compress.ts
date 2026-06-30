// GIF compression utility: omggif (decode) + gifenc (re-encode)
// Type declarations are in types/gif-modules.d.ts

// ── types ─────────────────────────────────────────────────────────────────
export interface CompressOptions {
  colors: number;   // 8-256
  scale: number;    // 0.25-1.0
  frameKeep: number; // keep every Nth frame (1=all, 2=every other, ...)
}

export interface CompressResult {
  blob: Blob;
  frameCount: number;
  width: number;
  height: number;
}

// ── main compress function ─────────────────────────────────────────────────
export async function compressGif(
  file: File,
  opts: CompressOptions,
  onProgress: (pct: number) => void
): Promise<CompressResult> {
  const { GifReader } = await import("omggif");
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  const buffer = await file.arrayBuffer();
  const reader = new GifReader(new Uint8Array(buffer));
  const { width, height } = reader;
  const numFrames = reader.numFrames();
  const newW = Math.max(1, Math.round(width * opts.scale));
  const newH = Math.max(1, Math.round(height * opts.scale));

  // compositing buffer (full GIF dimensions)
  const frameRgba = new Uint8Array(width * height * 4);

  // source canvas for scaling
  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext("2d")!;

  // destination canvas (may be scaled)
  const dstCanvas = document.createElement("canvas");
  dstCanvas.width = newW;
  dstCanvas.height = newH;
  const dstCtx = dstCanvas.getContext("2d")!;

  const encoder = GIFEncoder();
  let writtenFrames = 0;

  for (let i = 0; i < numFrames; i++) {
    const info = reader.frameInfo(i);

    // handle disposal of previous frame before blitting
    if (i > 0) {
      const prev = reader.frameInfo(i - 1);
      if (prev.disposal === 2) {
        // restore to background — clear the region
        for (let y = prev.y; y < prev.y + prev.height; y++) {
          for (let x = prev.x; x < prev.x + prev.width; x++) {
            const off = (y * width + x) * 4;
            frameRgba[off] = frameRgba[off + 1] = frameRgba[off + 2] = frameRgba[off + 3] = 0;
          }
        }
      }
    }

    reader.decodeAndBlitFrameRGBA(i, frameRgba);

    // skip frames according to frameKeep ratio
    if (i % opts.frameKeep !== 0 && i !== 0) {
      onProgress(Math.round(((i + 1) / numFrames) * 100));
      continue;
    }

    // get pixel data at target scale
    let pixels: Uint8ClampedArray;
    if (opts.scale !== 1) {
      const imgData = new ImageData(new Uint8ClampedArray(frameRgba), width, height);
      srcCtx.putImageData(imgData, 0, 0);
      dstCtx.clearRect(0, 0, newW, newH);
      dstCtx.drawImage(srcCanvas, 0, 0, newW, newH);
      pixels = dstCtx.getImageData(0, 0, newW, newH).data;
    } else {
      pixels = new Uint8ClampedArray(frameRgba);
    }

    const palette = quantize(pixels, Math.min(opts.colors, 256));
    const index = applyPalette(pixels, palette);

    // delay: sum skipped frames to keep timing correct
    const effectiveDelay = info.delay * opts.frameKeep * 10; // centiseconds × keep × 10 → ms

    encoder.writeFrame(index, newW, newH, {
      palette,
      delay: effectiveDelay,
      repeat: 0,
    });

    writtenFrames++;
    onProgress(Math.round(((i + 1) / numFrames) * 100));
  }

  encoder.finish();
  const bytes = encoder.bytes();
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
  return { blob, frameCount: writtenFrames, width: newW, height: newH };
}
