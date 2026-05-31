const MAX_LOGO_SIZE_BYTES = 120_000;
const LOGO_SIZE = 256;
const LOGO_QUALITY_STEPS = [0.82, 0.72, 0.62, 0.52];

function dataUrlByteLength(dataUrl: string) {
  const base64 = dataUrl.split(",", 2)[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Лого зураг уншигдсангүй."));
    };
    image.src = objectUrl;
  });
}

export async function fileToCompactLogoDataUrl(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Зөвхөн зураг файл сонгоно уу.");
  }

  const image = await loadImage(file);
  const scale = Math.min(1, LOGO_SIZE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Лого зураг боловсруулах боломжгүй байна.");
  }

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  for (const quality of LOGO_QUALITY_STEPS) {
    const dataUrl = canvas.toDataURL("image/webp", quality);
    if (dataUrlByteLength(dataUrl) <= MAX_LOGO_SIZE_BYTES) {
      return dataUrl;
    }
  }

  throw new Error("Лого зураг хэт том байна. Жижиг хэмжээтэй зураг сонгоно уу.");
}
