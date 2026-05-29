export type InitiateUploadInput = {
  assetId: string;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
};

export type InitiateUploadResult = {
  uploadUrl: string;
  storageKey: string;
  expiresAt: string;
};

export type StorageProvider = {
  initiateUpload(input: InitiateUploadInput): Promise<InitiateUploadResult>;
  deleteObject(storageKey: string): Promise<void>;
  toPublicUrl(storageKey: string): string;
};
