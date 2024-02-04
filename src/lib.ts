export function toDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.readAsDataURL(blob);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.imageSmoothingEnabled = true;

  // Canvas全体を透明に設定
  croppedCtx.clearRect(0, 0, pixelCrop.width, pixelCrop.height);

  // 円形のクリップを設定
  croppedCtx.beginPath();
  croppedCtx.arc(
    pixelCrop.width / 2,
    pixelCrop.height / 2,
    Math.min(pixelCrop.width, pixelCrop.height) / 2,
    0,
    2 * Math.PI
  );
  croppedCtx.clip();

  // 画像を描画
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // 線の描画
  croppedCtx.lineWidth = 10;
  croppedCtx.strokeStyle = "red";
  croppedCtx.beginPath();
  croppedCtx.arc(
    pixelCrop.width / 2,
    pixelCrop.height / 2,
    Math.min(pixelCrop.width, pixelCrop.height) / 2,
    0,
    2 * Math.PI
  );
  croppedCtx.stroke();

  binarizeImage(croppedCanvas, {
    threshold: 128,
    color: { r: 239, g: 69, b: 74 },
  });

  // As a blob
  return new Promise<Blob>((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      file ? resolve(file) : reject("blob error");
    }, "image/png");
  });
}

export async function getRotatedImage(imageSrc: string, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const orientationChanged =
    rotation === 90 ||
    rotation === -90 ||
    rotation === 270 ||
    rotation === -270;
  if (orientationChanged) {
    canvas.width = image.height;
    canvas.height = image.width;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      file && resolve(URL.createObjectURL(file));
    }, "image/png");
  });
}

type BinarizeImageOptions = {
  threshold: number;
  color: { r: number; g: number; b: number };
};

export function binarizeImage(
  canvas: HTMLCanvasElement,
  { threshold, color }: BinarizeImageOptions
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);

  // binarization
  for (let i = 0; i < src.data.length; i += 4) {
    const r = src.data[i];
    const g = src.data[i + 1];
    const b = src.data[i + 2];
    const y = ~~(0.299 * r + 0.587 * g + 0.114 * b);
    const v = y < threshold ? 0 : 255;
    dst.data[i] = v + color.r;
    dst.data[i + 1] = v + color.g;
    dst.data[i + 2] = v + color.b;
    dst.data[i + 3] = src.data[i + 3];
  }

  ctx.putImageData(dst, 0, 0);
}
