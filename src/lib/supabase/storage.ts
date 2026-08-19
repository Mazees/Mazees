import { createClient } from './server';

/**
 * Upload a file to a Supabase Storage bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Failed to upload file:', error);
    throw new Error(error.message);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

/**
 * Delete a file from a Supabase Storage bucket.
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Failed to delete file:', error);
    throw new Error(error.message);
  }
  return true;
}

/**
 * Extract the file path from a Supabase public URL for a given bucket.
 */
export function extractPathFromUrl(url: string, bucket: string): string | null {
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.substring(idx + marker.length);
  } catch {
    return null;
  }
}
