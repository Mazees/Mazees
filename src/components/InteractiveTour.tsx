"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronRight, ChevronLeft, X } from "lucide-react";

export interface TourStep {
  targetId: string;
  stepNumber: string;
  category: string;
  title: string;
  dialogue: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "home",
    stepNumber: "01",
    category: "// 00 · Welcome",
    title: "Workspace Initialization",
    dialogue:
      "Welcome to Mada's digital workspace. I'm Mark, his AI companion. Mada explores web development, LLMs, and autonomous agent systems. Let me walk you through his work and experiments.",
  },
  {
    targetId: "about",
    stepNumber: "02",
    category: "// 01 · Who I Am",
    title: "About Me & Core Focus",
    dialogue:
      "Here is where ideas turn into software. Mada focuses heavily on web development, agentic workflows, and practical AI applications designed for real-world utility.",
  },
  {
    targetId: "projects-preview",
    stepNumber: "03",
    category: "// 02 · Highlights & AI Lab",
    title: "My Featured Projects",
    dialogue:
      "This is Mada's core showcase — highlighting his most ambitious builds, autonomous agent tools, and full-stack software built from scratch.",
  },
  {
    targetId: "client-projects",
    stepNumber: "04",
    category: "// 03 · Commercial Work",
    title: "My Client Projects",
    dialogue:
      "Production systems built for real clients. From web platforms to custom business logic, engineered with high performance and strict security standards.",
  },
  {
    targetId: "skills",
    stepNumber: "05",
    category: "// 04 · Stack & Tools",
    title: "My Tech Stack & Tools",
    dialogue:
      "The foundational stack and ecosystem Mada leverages daily, spanning React, Next.js, Node.js, Python, Supabase, and modern LLM frameworks.",
  },
  {
    targetId: "repositories-preview",
    stepNumber: "06",
    category: "// 05 · Open Source",
    title: "My Open-Source Repositories",
    dialogue:
      "Transparency in code. This section syncs live with Mada's GitHub profile, displaying public repositories and daily commit consistency on the heatmap.",
  },
  {
    targetId: "contact",
    stepNumber: "07",
    category: "// 06 · Connect",
    title: "Let's Build Together",
    dialogue:
      "That completes our tour. If you have an exciting project, an idea, or an engineering role, feel free to connect with Mada directly.",
  },
];

export default function InteractiveTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Unified reactive scroll handler
  useEffect(() => {
    if (!isOpen) return;

    const currentStep = TOUR_STEPS[currentStepIndex];
    if (!currentStep) return;

    if (currentStep.targetId === "home" || currentStepIndex === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentStepIndex, isOpen]);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, []);

  const endTour = useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < TOUR_STEPS.length - 1) {
        return prev + 1;
      }
      endTour();
      return prev;
    });
  }, [endTour]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  // Listen for global custom event to trigger tour
  useEffect(() => {
    const handleStartTour = () => startTour();
    window.addEventListener("start-mark-tour", handleStartTour);
    return () => window.removeEventListener("start-mark-tour", handleStartTour);
  }, [startTour]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") endTour();
      if (e.key === "ArrowRight" || e.key === "Enter") nextStep();
      if (e.key === "ArrowLeft") prevStep();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextStep, prevStep, endTour]);

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-50 pointer-events-auto"
        >
          <div className="rounded-2xl bg-surface border border-border p-6 space-y-4">
            {/* Top Bar: Identity & Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-textSecondary font-mono text-[11px]">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-textPrimary">MARK</span>
                  <span className="text-border">|</span>
                  <span>AI Guide</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs text-textSecondary">
                  <span className="text-textPrimary font-semibold">
                    {currentStep.stepNumber}
                  </span>
                  <span className="text-textSecondary/50">
                    {" "}
                    / 0{TOUR_STEPS.length}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={endTour}
                  className="p-1 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-white/5 transition-colors"
                  aria-label="Close tour"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                  {currentStep.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-textPrimary tracking-tight">
                {currentStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-textSecondary leading-relaxed pt-1 font-normal">
                {currentStep.dialogue}
              </p>
            </div>

            {/* Segmented Progress Bar */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {TOUR_STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentStepIndex(i)}
                  aria-label={`Go to stop ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentStepIndex
                      ? "bg-primary"
                      : i < currentStepIndex
                        ? "bg-white/30"
                        : "bg-white/10 hover:bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentStepIndex === 0
                      ? "opacity-20 cursor-not-allowed text-textSecondary"
                      : "text-textSecondary hover:text-textPrimary bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="hidden sm:inline-block font-mono text-[10px] text-textSecondary/40">
                  Esc to exit
                </span>
              </div>

              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all hover:scale-[1.02]"
              >
                <span>
                  {currentStepIndex === TOUR_STEPS.length - 1
                    ? "Complete Tour"
                    : "Next Stop"}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
