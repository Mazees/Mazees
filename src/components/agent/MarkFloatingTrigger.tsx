"use client";

import React from "react";
import { Bot } from "lucide-react";

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
        className="w-13 h-13 p-3.5 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/35 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer rounded-full"
        title="Open Mark AI Copilot"
        aria-label="Open Mark AI Copilot"
      >
        <Bot className="w-6 h-6 text-white stroke-[2.2]" />
      </button>
    </div>
  );
}
