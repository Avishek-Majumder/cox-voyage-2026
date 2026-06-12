export type GalleryMediaType = "image" | "video";

export type GalleryItem = {
  id: string; // Firestore document ID or Drive file ID
  driveFileId: string;
  name: string;
  originalName: string;
  type: GalleryMediaType;
  mimeType: string;
  size: number;
  thumbnailUrl?: string;
  previewUrl?: string;
  downloadUrl?: string;
  webViewLink?: string;
  createdTime: string;
  modifiedTime?: string;
  uploadedByUid: string;
  uploadedByName: string;
  uploadedByEmail: string;
};
