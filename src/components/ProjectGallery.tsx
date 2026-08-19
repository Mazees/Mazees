'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  FolderKanban,
  ImageIcon,
} from 'lucide-react';

interface ProjectGalleryProps {
  title: string;
  coverImage?: string | null;
  images?: string[] | null;
}

export default function ProjectGallery({
  title,
  coverImage,
  images = [],
}: ProjectGalleryProps) {
  // Combine cover and images into a unique ordered list
  const allImages: string[] = [];
  if (coverImage) allImages.push(coverImage);
  if (images && images.length > 0) {
    images.forEach((img) => {
      if (img && !allImages.includes(img)) {
        allImages.push(img);
      }
    });
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-video rounded-3xl border border-border bg-surface flex flex-col items-center justify-center text-textSecondary mb-14 shadow-xl">
        <FolderKanban className="w-16 h-16 text-primary mb-3 opacity-60" />
        <span className="text-sm font-mono text-textSecondary">{title}</span>
      </div>
    );
  }

  const currentImage = allImages[currentIndex] || allImages[0];

  function prevImage() {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }

  function nextImage() {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="space-y-4 mb-14">
      {/* Main Large Viewport */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-surface shadow-2xl group aspect-video">
        <img
          src={currentImage}
          alt={`${title} - screenshot ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Counter Badge */}
        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-border text-white text-xs font-mono font-medium flex items-center space-x-1 shadow-lg z-10">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            <span>
              {currentIndex + 1} / {allImages.length}
            </span>
          </div>
        )}

        {/* Expand / Lightbox Button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 left-4 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-border text-white hover:text-primary hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 z-10"
          title="View Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-border text-white hover:text-primary transition-all opacity-0 group-hover:opacity-100 z-10"
              title="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl bg-black/60 hover:bg-black/90 backdrop-blur-md border border-border text-white hover:text-primary transition-all opacity-0 group-hover:opacity-100 z-10"
              title="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto px-1 py-1 pb-2 scrollbar-none">
          {allImages.map((imgUrl, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={imgUrl + index}
                onClick={() => setCurrentIndex(index)}
                className={`relative rounded-xl overflow-hidden aspect-video w-24 sm:w-32 shrink-0 border-2 transition-all ${
                  isActive
                    ? 'border-primary ring-2 ring-primary/30 scale-[1.02]'
                    : 'border-border opacity-60 hover:opacity-100 hover:border-border/80'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="flex items-center justify-between z-10">
            <div className="text-white text-sm font-semibold">
              {title} <span className="text-textSecondary text-xs">({currentIndex + 1} of {allImages.length})</span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-xl bg-surface border border-border text-white hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={title}
              className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-surface/80 hover:bg-surface border border-border text-white hover:text-primary transition-all shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-surface/80 hover:bg-surface border border-border text-white hover:text-primary transition-all shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div
              className="w-full overflow-x-auto py-2 z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex w-max min-w-full justify-center gap-2 px-4">
                {allImages.map((imgUrl, index) => (
                  <button
                    key={imgUrl + index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-lg overflow-hidden aspect-video w-16 shrink-0 border-2 transition-all ${
                      index === currentIndex
                        ? 'border-primary ring-2 ring-primary/40 scale-105'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
