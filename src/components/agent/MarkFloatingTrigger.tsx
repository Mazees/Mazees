"use client";

import React from "react";
import { Bot, Sparkles } from "lucide-react";

export default function MarkFloatingTrigger() {
  const handleOpen = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-mark-chat"));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface/90 border border-border hover:border-emerald-500/50 text-textPrimary shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
        title="Ask Mark AI Agent"
      >
        <img
          src="/mark-icon.svg"
          alt="Mark"
          className="size-7 object-contain"
        />

        <div className="text-left">
          <span className="text-xs font-semibold block leading-tight text-textPrimary group-hover:text-emerald-400 transition-colors">
            Ask Mark
          </span>
          <span className="text-[10px] font-mono text-emerald-400/80 block">
            AI Assistant
          </span>
        </div>
      </button>
    </div>
  );
}
