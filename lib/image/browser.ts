/**
 * 브라우저 Canvas/Image 기반 이미지 처리 헬퍼.
 * 파일은 서버로 보내지 않고 클라이언트 메모리에서만 다룹니다.
 */

/** 선택한 이미지 파일을 HTMLImageElement로 로드합니다. */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러올 수 없습니다. 지원 형식인지 확인해 주세요."));
    };
    img.src = url;
  });
}

/** 이미지를 캔버스에 그린 뒤 지정 MIME으로 Blob을 만듭니다. */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("이 형식으로 내보낼 수 없습니다."));
      },
      mime,
      quality,
    );
  });
}

/** 원본 비율을 유지한 채 긴 변 기준으로 리사이즈한 캔버스를 반환합니다. */
export function resizeImageToCanvas(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
): HTMLCanvasElement {
  let { width, height } = img;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("브라우저가 Canvas를 지원하지 않습니다.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

/** 정확한 가로·세로(픽셀)로 스트레치/축소합니다. 비율 유지가 아닐 수 있습니다. */
export function stretchImageToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("브라우저가 Canvas를 지원하지 않습니다.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
