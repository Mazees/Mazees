"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";
import { AgentStep } from "@/lib/agent/engine";

interface ThoughtNeuralFlowProps {
  steps?: AgentStep[];
  isThinking?: boolean;
}

export default function ThoughtNeuralFlow({
  steps = [],
  isThinking = false,
}: ThoughtNeuralFlowProps) {
  if (!isThinking && steps.length === 0) return null;

  // Derive active display plan steps
  const displaySteps =
    steps.length > 0
      ? steps.map((s) => (s.name ? s.name.replace(/_/g, " ") : s.type))
      : ["Analyze Query", "Query Knowledge", "Synthesize Answer"];

  const currentStep = Math.max(0, steps.length - 1);
  const isDone = !isThinking;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center transition-all duration-500 ease-out">
      <style>{`
        @keyframes neuron-spin {
          0% { transform: rotateX(45deg) rotateY(0deg) rotateZ(45deg); }
          100% { transform: rotateX(45deg) rotateY(360deg) rotateZ(45deg); }
        }
      `}</style>

      {/* Nodes around the Orb */}
      {displaySteps.map((stepText, idx) => {
        const isCompleted = idx < currentStep || isDone;
        const isActive = idx === currentStep && !isDone;
        const isPending = idx > currentStep && !isDone;

        const totalNodes = displaySteps.length;
        const span = totalNodes > 3 ? 180 : 140;
        const startAngle = -90 - span / 2;
        const stepAngle = totalNodes > 1 ? span / (totalNodes - 1) : 0;

        const angleDeg = startAngle + idx * stepAngle;
        const angleRad = (angleDeg * Math.PI) / 180;

        const baseRadius = totalNodes > 3 ? 160 : 140;
        const radius =
          totalNodes > 3 ? baseRadius + (idx % 2 === 0 ? 0 : 30) : baseRadius;

        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        let glassClass =
          "from-white/10 to-white/5 border-white/20 text-textSecondary";
        if (isCompleted)
          glassClass =
            "from-primary/40 to-primary/10 border-primary/50 text-primary shadow-[inset_0_0_10px_rgba(249,115,22,0.2)]";
        if (isActive)
          glassClass =
            "from-primary-light/50 to-primary/20 border-primary-light/70 text-primary-light shadow-[inset_0_0_15px_rgba(249,115,22,0.4)] animate-pulse scale-110";

        const distance = radius;
        const nodeClearance = 16;
        const orbClearance = 55;

        const dirX = -x / distance;
        const dirY = -y / distance;

        const startX = 150 + dirX * nodeClearance;
        const startY = 150 + dirY * nodeClearance;

        const endX = 150 + dirX * (distance - orbClearance);
        const endY = 150 + dirY * (distance - orbClearance);

        return (
          <div
            key={idx}
            className="absolute flex flex-col items-center"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: `${idx * 80}ms`,
            }}
          >
            {/* Draw SVG line connecting to center (Orb) */}
            <svg
              className="absolute w-[300px] h-[300px] pointer-events-none overflow-visible"
              style={{ top: -150, left: -150 }}
            >
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="currentColor"
                className={
                  isCompleted
                    ? "text-primary/50"
                    : isActive
                    ? "text-primary opacity-80"
                    : "text-white/20"
                }
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>

            {/* The Node (3D Neuron) */}
            <div className="relative w-8 h-8 z-10 [perspective:1000px]">
              <div
                className="w-full h-full relative"
                style={{
                  transformStyle: "preserve-3d",
                  animation: isActive
                    ? "neuron-spin 3s linear infinite"
                    : "neuron-spin 8s linear infinite",
                }}
              >
                {["front", "back", "right", "left", "top", "bottom"].map(
                  (face) => {
                    let transform = "";
                    if (face === "front") transform = "translateZ(16px)";
                    if (face === "back")
                      transform = "rotateY(180deg) translateZ(16px)";
                    if (face === "right")
                      transform = "rotateY(90deg) translateZ(16px)";
                    if (face === "left")
                      transform = "rotateY(-90deg) translateZ(16px)";
                    if (face === "top")
                      transform = "rotateX(90deg) translateZ(16px)";
                    if (face === "bottom")
                      transform = "rotateX(-90deg) translateZ(16px)";

                    return (
                      <div
                        key={face}
                        className={`absolute inset-0 m-auto w-full h-full rounded-[4px] border backdrop-blur-sm bg-gradient-to-br flex items-center justify-center transition-all duration-500 ease-in-out ${glassClass}`}
                        style={{ transform }}
                      >
                        {face === "front" && (
                          <div className="relative w-4 h-4 flex items-center justify-center">
                            <div
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                                isCompleted
                                  ? "opacity-100 scale-100 rotate-0"
                                  : "opacity-0 scale-50 -rotate-90"
                              }`}
                            >
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            <div
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                                isActive
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-50"
                              }`}
                            >
                              <Loader2 className="w-3 h-3 animate-spin text-primary-light" />
                            </div>
                            <div
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                                isPending
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-50"
                              }`}
                            >
                              <span className="text-[10px] font-mono">
                                {idx + 1}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
