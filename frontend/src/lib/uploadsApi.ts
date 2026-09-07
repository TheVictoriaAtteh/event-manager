import { apiFetch } from './apiClient';

export interface UploadImageResponse {
  url: string;
}

/**
 * Uploads an image file to the backend, which stores it in Supabase Storage
 * and returns a permanent public URL. The Supabase service-role key is never
 * exposed to the browser.
 *
 * @param file - The image File object selected by the user.
 * @returns A promise resolving to an object containing the permanent image URL.
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // apiFetch's formData option lets the browser set the correct multipart
  // Content-Type boundary automatically, and injects the Bearer token.
  return apiFetch<UploadImageResponse>('/uploads/image', {
    method: 'POST',
    formData,
  });
}
