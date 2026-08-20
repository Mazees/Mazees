"use client";

import React, { useState, useEffect, useRef } from "react";

interface DraggableHoloCardProps {
  children: React.ReactNode;
  title: React.ReactNode;
  id?: string;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
  isVisible?: boolean;
}

export default function DraggableHoloCard({
  children,
  title,
  id,
  defaultPosition = { x: 40, y: 80 },
  onClose,
  isVisible = true,
}: DraggableHoloCardProps) {
  const [pos, setPos] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [animState, setAnimState] = useState(isVisible ? "entering" : "hidden");
  const dragRef = useRef({ offsetX: 0, offsetY: 0 });

  useEffect(() => {
    if (isVisible) {
      setAnimState("entering");
      const timer = setTimeout(() => setAnimState("visible"), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimState("exiting");
      const timer = setTimeout(() => setAnimState("hidden"), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      let newX = e.clientX - dragRef.current.offsetX;
      let newY = e.clientY - dragRef.current.offsetY;

      if (typeof window !== "undefined") {
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 50;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }

      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
    };
  };

  if (animState === "hidden") return null;

  const dragClass = isDragging
    ? "scale-[1.02] rotate-1 shadow-2xl z-50 cursor-grabbing"
    : "shadow-lg z-40";

  return (
    <div
      className={`fixed ${dragClass} transition-transform duration-75 select-none pointer-events-auto`}
      style={{ left: pos.x, top: pos.y, width: "fit-content" }}
    >
      <div className="relative overflow-hidden rounded-none bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] shadow-[0_0_24px_rgba(31,184,84,0.12)]">
        {/* Animated Border Flow (Top & Bottom) */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1fb854] to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1fb854] to-transparent opacity-80 rotate-180" />

        {/* HUD Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30 pointer-events-none" />

        {/* Header / Drag Handle */}
        <div
          className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-md cursor-grab active:cursor-grabbing border-b border-white/5 select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#1fb854] rounded-full animate-pulse shadow-[0_0_8px_#1fb854]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1fb854] opacity-90">
              {title}
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-white/50 hover:text-red-400 transition-colors p-1 -mr-2 rounded-none hover:bg-white/10"
              title="Close Card"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
