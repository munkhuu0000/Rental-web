const MAX_LOGO_URL_LENGTH = 160_000;
const DATA_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp);base64,/i;
const REMOTE_IMAGE_PATTERN = /^https?:\/\//i;

export function normalizeLogoUrl(logoUrl: string | null | undefined) {
  if (!logoUrl) {
    return null;
  }

  if (logoUrl.length > MAX_LOGO_URL_LENGTH) {
    throw new Error("Company logo image is too large. Please upload a smaller logo.");
  }

  if (!DATA_IMAGE_PATTERN.test(logoUrl) && !REMOTE_IMAGE_PATTERN.test(logoUrl)) {
    throw new Error("Company logo must be an image URL or a compact image data URL.");
  }

  return logoUrl;
}
