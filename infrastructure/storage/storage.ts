export interface StoredObjectRef {
  readonly bucket: string;
  readonly path: string;
}

/**
 * Minimal contract for whatever backs SourceAsset file storage. No
 * implementation exists yet — it arrives with the real addSourceAsset
 * command, once Source/SourceAsset are implemented.
 */
export interface StorageProvider {
  upload(params: {
    bucket: string;
    path: string;
    data: Blob | Buffer;
    contentType?: string;
  }): Promise<StoredObjectRef>;
  getSignedUrl(ref: StoredObjectRef, expiresInSeconds?: number): Promise<string>;
  remove(ref: StoredObjectRef): Promise<void>;
}
