export const UPLOAD_LIMITS_BY_MIME: Readonly<Record<string, number>> = {
  "image/jpeg": 10 * 1024 * 1024,
  "image/png": 10 * 1024 * 1024,
  "image/webp": 10 * 1024 * 1024,
  "image/gif": 10 * 1024 * 1024,
  "application/pdf": 50 * 1024 * 1024,
};

export function isAllowedUploadMimeType(mimeType: string): boolean {
  return mimeType in UPLOAD_LIMITS_BY_MIME;
}

export function isAllowedUploadSize(mimeType: string, fileSizeBytes: number): boolean {
  const maxBytes = UPLOAD_LIMITS_BY_MIME[mimeType];
  if (!maxBytes) {
    return false;
  }
  return fileSizeBytes > 0 && fileSizeBytes <= maxBytes;
}
