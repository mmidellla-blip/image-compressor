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

export type PixelCropArea = { x: number; y: number; width: number; height: number };

/** react-easy-crop의 onCropComplete가 주는 croppedAreaPixels(원본 픽셀 좌표)로 자릅니다. */
export function cropAreaToCanvas(
  image: HTMLImageElement,
  area: PixelCropArea,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width));
  canvas.height = Math.max(1, Math.round(area.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas;
}

/**
 * react-easy-crop의 initialCroppedAreaPercentages 기본값을 계산합니다.
 * 중앙 정렬 기준으로, 상하를 잘라야 하는 경우 상단 여백을 조금 더 남겨
 * 얼굴 상단이 잘릴 위험을 줄입니다(얼굴 인식은 사용하지 않는 단순 휴리스틱).
 */
export function defaultCropPercentages(
  naturalW: number,
  naturalH: number,
  aspectW: number,
  aspectH: number,
): PixelCropArea {
  const targetAspect = aspectW / aspectH;
  const srcAspect = naturalW / naturalH;

  let sx: number;
  let sy: number;
  let sw: number;
  let sh: number;

  if (srcAspect > targetAspect) {
    sh = naturalH;
    sw = naturalH * targetAspect;
    sy = 0;
    sx = (naturalW - sw) / 2;
  } else {
    sw = naturalW;
    sh = naturalW / targetAspect;
    sx = 0;
    const centeredSy = (naturalH - sh) / 2;
    // 상단에서 덜 잘라내도록(60%만 제외) 여백을 위로 더 남깁니다.
    sy = centeredSy * 0.6;
  }

  return {
    x: (sx / naturalW) * 100,
    y: (sy / naturalH) * 100,
    width: (sw / naturalW) * 100,
    height: (sh / naturalH) * 100,
  };
}
