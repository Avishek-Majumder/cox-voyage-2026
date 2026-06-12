import { GalleryItem } from '../types/gallery';

/**
 * Normalizes and returns the absolute API URL if VITE_GALLERY_API_BASE_URL is defined,
 * otherwise returns the relative path.
 */
function getApiUrl(endpoint: string): string {
  const baseUrl = import.meta.env.VITE_GALLERY_API_BASE_URL || '';
  const cleanBase = baseUrl.trim().replace(/\/+$/, '');
  const cleanEndpoint = endpoint.trim().replace(/^\/+/, '');
  return cleanBase ? `${cleanBase}/${cleanEndpoint}` : `/${cleanEndpoint}`;
}

/**
 * Checks the configuration status of the Trip Gallery backend.
 */
export async function checkBackendStatus(): Promise<{ configured: boolean; provider: string }> {
  try {
    const res = await fetch(getApiUrl('/api/gallery/status'));
    if (!res.ok) {
      return { configured: false, provider: 'none' };
    }
    return await res.json();
  } catch (err) {
    return { configured: false, provider: 'none' };
  }
}

/**
 * List gallery items from the central organizer Google Drive.
 */
export async function listGalleryItems(): Promise<GalleryItem[]> {
  const res = await fetch(getApiUrl('/api/gallery/list'));
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = errData.error || `HTTP ${res.status}: Failed to get gallery list from server.`;
    throw new Error(message);
  }
  return await res.json();
}

/**
 * Upload a single gallery file to the organizer Google Drive folder via the backend upload endpoint.
 */
export async function uploadGalleryFile(file: File, user: any): Promise<GalleryItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedByUid', user?.uid || 'anonymous');
  formData.append('uploadedByName', user?.displayName || 'Cox Voyage Member');
  formData.append('uploadedByEmail', user?.email || '');

  const res = await fetch(getApiUrl('/api/gallery/upload'), {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData.error || `HTTP ${res.status}: Upload failed.`;
    throw new Error(msg);
  }

  return await res.json();
}

/**
 * Uploads multiple files by delegating to uploadGalleryFile.
 */
export async function uploadGalleryFiles(files: File[], user: any): Promise<GalleryItem[]> {
  const uploadPromises = files.map(file => uploadGalleryFile(file, user));
  return await Promise.all(uploadPromises);
}

/**
 * Deletes/trashes a file in the organizer's Google Drive via the backend.
 */
export async function deleteGalleryItem(fileId: string): Promise<{ success: boolean; fileId: string }> {
  const res = await fetch(getApiUrl(`/api/gallery/${fileId}`), {
    method: 'DELETE',
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = errData.error || `HTTP ${res.status}: Delete failed.`;
    throw new Error(message);
  }

  return await res.json();
}

/**
 * Returns the download URL or triggers immediate stream download for a file.
 */
export function downloadGalleryItem(fileId: string): string {
  return getApiUrl(`/api/gallery/download/${fileId}`);
}

