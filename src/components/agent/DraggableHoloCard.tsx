"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

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
  defaultPosition = { x: 40, y: 100 },
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
        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - 60;
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));
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
    ? "scale-[1.02] shadow-2xl z-50 cursor-grabbing"
    : "shadow-xl z-40";

  return (
    <div
      className={`fixed ${dragClass} transition-transform duration-75 select-none pointer-events-auto`}
      style={{ left: pos.x, top: pos.y, width: "fit-content" }}
    >
      <div className="relative overflow-hidden rounded-xl bg-surface/90 backdrop-blur-xl border border-border shadow-2xl">
        {/* Animated Top/Bottom Glow Lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent" />

        {/* 4-Corner HUD Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500/70 pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500/70 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500/70 pointer-events-none" />

        {/* Header / Drag Handle */}
        <div
          className="flex items-center justify-between px-4 py-2.5 bg-surface/80 cursor-grab active:cursor-grabbing border-b border-border"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(31,184,84,0.8)]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              {title}
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-textSecondary hover:text-red-400 transition-colors p-1 rounded-md hover:bg-white/5 ml-2"
              title="Dismiss Card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">{children}</div>
      </div>
    </div>
  );
}
