import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

import type { InitiateUploadInput, InitiateUploadResult, StorageProvider } from "./provider";
import { getR2Config } from "./r2-config";

const PRESIGNED_UPLOAD_TTL_SECONDS = 60 * 5;

export class R2StorageProvider implements StorageProvider {
  private readonly config = getR2Config();
  private readonly client = new S3Client({
    region: "auto",
    endpoint: this.config.endpoint,
    credentials: {
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
    },
  });

  async initiateUpload(input: InitiateUploadInput): Promise<InitiateUploadResult> {
    const storageKey = buildStorageKey(input.assetId, input.filename);
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: storageKey,
      ContentType: input.mimeType,
      ContentLength: input.fileSizeBytes,
    });
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: PRESIGNED_UPLOAD_TTL_SECONDS,
    });
    return {
      uploadUrl,
      storageKey,
      expiresAt: new Date(Date.now() + PRESIGNED_UPLOAD_TTL_SECONDS * 1000).toISOString(),
    };
  }

  async deleteObject(storageKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucket,
        Key: storageKey,
      }),
    );
  }

  toPublicUrl(storageKey: string): string {
    return `${this.config.publicBaseUrl}/${storageKey}`;
  }
}

function buildStorageKey(assetId: string, filename: string): string {
  const extension = extractExtension(filename);
  const today = new Date().toISOString().slice(0, 10);
  const nonce = randomUUID().slice(0, 8);
  return `uploads/${today}/${assetId}-${nonce}${extension}`;
}

function extractExtension(filename: string): string {
  const cleaned = filename.trim().toLowerCase();
  const lastDotIndex = cleaned.lastIndexOf(".");
  if (lastDotIndex < 0 || lastDotIndex === cleaned.length - 1) {
    return "";
  }
  const ext = cleaned.slice(lastDotIndex);
  return /^[a-z0-9.]+$/.test(ext.slice(1)) ? ext : "";
}
