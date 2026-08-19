'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
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

      onChange(urlData.publicUrl);
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      setError((err as Error).message || 'Failed to upload image to Supabase Storage');
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border group bg-background aspect-video max-h-64 flex items-center justify-center">
          <img
            src={value}
            alt="Project Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-surface/90 hover:bg-surface text-xs font-medium text-textPrimary border border-border transition-all"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition-all"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 bg-background/50 hover:bg-background'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs text-textSecondary">
                Uploading to Supabase Storage...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-textPrimary">
                Click to upload or drag and drop
              </div>
              <div className="text-[11px] text-textSecondary">
                PNG, JPG, WebP up to 5MB (16:9 recommended)
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1 flex items-center space-x-1">
          <span>•</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
