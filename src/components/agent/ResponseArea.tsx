"use client";

import React from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import HoloCard from "./HoloCard";

interface ResponseAreaProps {
  text: string;
  type?: "short" | "long";
  isThinking?: boolean;
  activeTask?: string;
}

export default function ResponseArea({
  text,
  type = "short",
  isThinking = false,
  activeTask,
}: ResponseAreaProps) {
  if (isThinking) {
    return (
      <div className="w-full max-w-2xl px-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        <div className="relative p-6 w-full bg-surface/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl flex flex-col items-center justify-center gap-4">
          {/* 4-Corner HUD Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500/60" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/60" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500/60" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500/60" />

          {/* Orbital Rotating Ring Spinner */}
          <div className="relative w-12 h-12 flex items-center justify-center text-emerald-400">
            <svg
              viewBox="0 0 50 50"
              className="w-full h-full animate-[spin_3s_linear_infinite]"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="30 15"
                className="opacity-50"
              />
              <circle
                cx="25"
                cy="25"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="20 10"
                className="opacity-80 animate-[spin_2s_linear_infinite_reverse]"
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
              {activeTask || "Processing Request..."}
            </div>

            {/* Neural Audio Equalizer Equalizer Bar */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-emerald-500 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
              <span className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse delay-100" />
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!text) return null;

  if (type === "long") {
    let tldr = "";
    let restText = text;

    const firstNewlineMatch = text.match(/\n\n/);
    if (firstNewlineMatch && firstNewlineMatch.index) {
      tldr = text.substring(0, firstNewlineMatch.index).trim();
      restText = text.substring(firstNewlineMatch.index).trim();
    } else {
      const firstPeriod = text.indexOf(". ");
      if (firstPeriod !== -1 && firstPeriod < 200) {
        tldr = text.substring(0, firstPeriod + 1).trim();
        restText = text.substring(firstPeriod + 1).trim();
      } else {
        tldr = text.substring(0, 160) + "...";
        restText = text;
      }
    }

    return (
      <div className="w-full max-w-2xl px-4 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* TL;DR Summary Box */}
        {tldr && (
          <div className="relative p-5 w-full bg-surface/80 backdrop-blur-md border border-border shadow-xl rounded-xl">
            {/* 4-Corner HUD Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500/60" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/60" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500/60" />

            <div className="text-sm font-sans leading-relaxed text-textPrimary">
              <MarkdownRenderer content={tldr} variant="emerald" />
            </div>
          </div>
        )}

        {/* Expandable Detail HoloCard */}
        <HoloCard title="Detail Informasi" defaultExpanded={false}>
          <MarkdownRenderer content={restText || text} variant="emerald" />
        </HoloCard>
      </div>
    );
  }

  // Short type
  return (
    <div className="w-full max-w-2xl px-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
      <div className="relative p-5 sm:p-6 w-full bg-surface/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl">
        {/* 4-Corner HUD Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500/60" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500/60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500/60" />

        <div className="text-sm sm:text-base font-sans leading-relaxed text-textPrimary">
          <MarkdownRenderer content={text} variant="emerald" />
        </div>
      </div>
    </div>
  );
}
