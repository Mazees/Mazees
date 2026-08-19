'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Star, Plus, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MultipleImageUploaderProps {
  images: string[];
  coverImage?: string | null;
  onImagesChange: (images: string[]) => void;
  onCoverChange: (coverUrl: string | null) => void;
}

export default function MultipleImageUploader({
  images = [],
  coverImage,
  onImagesChange,
  onCoverChange,
}: MultipleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If no cover is explicitly set but images exist, default cover to first image
  const effectiveCover = coverImage || (images.length > 0 ? images[0] : null);

  async function handleFiles(files: FileList | File[]) {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setError('Only image files (PNG, JPG, WebP) are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be under 10MB');
        return;
      }
      validFiles.push(file);
    }

    setError(null);
    setUploading(true);
    setUploadProgress(`Uploading 0 / ${validFiles.length}...`);

    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(`Uploading image ${i + 1} of ${validFiles.length}...`);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      const newImagesList = [...images, ...uploadedUrls];
      onImagesChange(newImagesList);

      // If no cover was set before, set the first new uploaded image as cover
      if (!effectiveCover && uploadedUrls.length > 0) {
        onCoverChange(uploadedUrls[0]);
      }
    } catch (err: unknown) {
      console.error('Error uploading images:', err);
      setError((err as Error).message || 'Failed to upload images to Supabase Storage');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  function handleRemove(urlToRemove: string) {
    const nextImages = images.filter((img) => img !== urlToRemove);
    onImagesChange(nextImages);

    // If removing the cover image, set the new first image as cover (or null)
    if (effectiveCover === urlToRemove) {
      onCoverChange(nextImages.length > 0 ? nextImages[0] : null);
    }
  }

  function handleSetCover(url: string) {
    onCoverChange(url);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden Multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
      />

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40 bg-background/50 hover:bg-background'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-2 py-2">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
            <span className="text-xs font-medium text-textPrimary">
              {uploadProgress || 'Uploading to Supabase Storage...'}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-textPrimary">
              Click to select multiple screenshots or drag and drop
            </div>
            <div className="text-[11px] text-textSecondary">
              PNG, JPG, WebP (You can upload multiple images at once)
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center space-x-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <span>•</span>
          <span>{error}</span>
        </p>
      )}

      {/* Uploaded Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-textSecondary px-1">
            <span>
              Uploaded Images (<strong className="text-primary">{images.length}</strong>)
            </span>
            <span className="text-[11px] italic">
              Click ★ to set as main Cover Image
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => {
              const isCover = effectiveCover === imgUrl;
              return (
                <div
                  key={imgUrl + index}
                  className={`relative rounded-xl overflow-hidden aspect-video group bg-surface border-2 transition-all shadow-sm ${
                    isCover
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold flex items-center space-x-1 shadow-md">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      <span>COVER</span>
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(imgUrl);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-dark text-white text-[11px] font-medium flex items-center space-x-1 transition-all shadow"
                        title="Set as Cover Image"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set Cover</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(imgUrl);
                      }}
                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow"
                      title="Delete Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add More Tile */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-border hover:border-primary/40 aspect-video flex flex-col items-center justify-center text-textSecondary hover:text-primary hover:bg-surface/50 transition-all"
            >
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-[11px] font-medium">Add More</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
