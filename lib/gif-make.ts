// GIF creation utility: images → animated GIF via gifenc

export interface MakeOptions {
  delay: number;    // ms per frame
  colors: number;   // 32-256
  scale: number;    // 0.25-1.0, based on first frame dimensions
  loop: number;     // 0 = infinite
}

export interface MakeResult {
  blob: Blob;
  width: number;
  height: number;
  frames: number;
}

export async function makeGif(
  files: File[],
  opts: MakeOptions,
  onProgress: (pct: number) => void
): Promise<MakeResult> {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");

  // load all images
  const imgs: HTMLImageElement[] = await Promise.all(
    files.map((f) => {
      const url = URL.createObjectURL(f);
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`이미지 로드 실패: ${f.name}`)); };
        img.src = url;
      });
    })
  );

  // output dimensions based on first image × scale
  const w = Math.max(1, Math.round(imgs[0].naturalWidth * opts.scale));
  const h = Math.max(1, Math.round(imgs[0].naturalHeight * opts.scale));

  // canvas for drawing each frame
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const encoder = GIFEncoder();
  // delay in gifenc is in ms; GIF spec centiseconds — gifenc converts internally
  const delayMs = Math.max(20, opts.delay);

  for (let i = 0; i < imgs.length; i++) {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(imgs[i], 0, 0, w, h);
    const pixels = ctx.getImageData(0, 0, w, h).data;

    const palette = quantize(new Uint8Array(pixels), Math.min(opts.colors, 256));
    const index = applyPalette(new Uint8Array(pixels), palette);

    encoder.writeFrame(index, w, h, {
      palette,
      delay: delayMs,
      repeat: opts.loop,
    });

    onProgress(Math.round(((i + 1) / imgs.length) * 100));
  }

  encoder.finish();
  const bytes = encoder.bytes();
  const blob = new Blob([new Uint8Array(bytes)], { type: "image/gif" });
  return { blob, width: w, height: h, frames: imgs.length };
}
