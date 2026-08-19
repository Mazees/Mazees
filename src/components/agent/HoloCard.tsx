"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HoloCardProps {
  children: React.ReactNode;
  title?: string;
  defaultExpanded?: boolean;
}

export default function HoloCard({
  children,
  title,
  defaultExpanded = false,
}: HoloCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > 180) {
        setIsOverflowing(true);
      }
    }
  }, [children]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-surface/70 backdrop-blur-md border border-border shadow-xl">
      {/* 4-Corner HUD Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500/60" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/60" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500/60" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500/60" />

      {/* Hologram Scan Lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(transparent,transparent_2px,#1fb854_3px,transparent_4px)] mix-blend-screen" />

      <div className="relative z-10 flex flex-col p-5">
        {title && (
          <h3 className="text-emerald-400 font-semibold text-xs mb-3 uppercase tracking-[0.2em] flex items-center space-x-2 font-mono">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(31,184,84,0.8)]" />
            <span>{title}</span>
          </h3>
        )}

        <div
          ref={contentRef}
          className={`transition-all duration-300 ease-in-out relative text-sm text-textPrimary leading-relaxed ${
            isExpanded
              ? "max-h-[50vh] overflow-y-auto pr-2"
              : "max-h-[160px] overflow-hidden"
          }`}
        >
          {children}
        </div>

        {isOverflowing && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center justify-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all bg-emerald-500/10 hover:bg-emerald-500/20 py-1.5 px-3 rounded-lg border border-emerald-500/20"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Ringkas Detail</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Baca Detail Sepenuhnya</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
