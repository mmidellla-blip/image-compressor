/**
 * 증명사진 등 고정 비율로 중앙 크롭할 때 사용합니다.
 * aspect = 가로:세로 (예: 증명사진 35×45mm → 7:9).
 */
export function cropCenterToAspect(
  img: HTMLImageElement,
  aspectW: number,
  aspectH: number,
): HTMLCanvasElement {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const targetAspect = aspectW / aspectH;
  const srcAspect = iw / ih;

  let sx: number;
  let sy: number;
  let sw: number;
  let sh: number;

  if (srcAspect > targetAspect) {
    sh = ih;
    sw = ih * targetAspect;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = iw / targetAspect;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sw);
  canvas.height = Math.round(sh);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas;
}
