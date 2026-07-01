/** 투명 배경 이미지를 흰색(#FFFFFF) 배경 위에 지정 크기로 합성합니다. */
export function compositeOnWhite(
  transparentImage: CanvasImageSource,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("브라우저가 Canvas를 지원하지 않습니다.");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(transparentImage, 0, 0, width, height);
  return canvas;
}
