"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ListTree, Check, ChevronRight, Zap } from "lucide-react";
import DraggableHoloCard from "./DraggableHoloCard";

export interface AgentProcess {
  id: string;
  type: "planning" | "plugin-execution" | "tool";
  status: "active" | "done" | "failed" | "paused";
  data: {
    steps?: Array<{ task: string; query?: string } | string>;
    currentStep?: number;
    reasoning?: string;
    action?: string;
    query?: string;
    result?: string;
  };
  isExiting?: boolean;
}

interface ProcessPanelProps {
  processes: AgentProcess[];
  onDismiss: (id: string) => void;
}

export default function ProcessPanel({
  processes,
  onDismiss,
}: ProcessPanelProps) {
  const [renderedProcesses, setRenderedProcesses] = useState<AgentProcess[]>([]);

  useEffect(() => {
    setRenderedProcesses((prev) => {
      let next = prev.map((rp) => {
        const updated = processes.find((p) => p.id === rp.id);
        if (updated) return { ...updated, isExiting: false };
        if (!rp.isExiting) return { ...rp, isExiting: true };
        return rp;
      });

      processes.forEach((p) => {
        if (!prev.find((rp) => rp.id === p.id)) {
          next.push({ ...p, isExiting: false });
        }
      });

      return next;
    });
  }, [processes]);

  useEffect(() => {
    const hasExiting = renderedProcesses.some((p) => p.isExiting);
    if (hasExiting) {
      const timer = setTimeout(() => {
        setRenderedProcesses((prev) => prev.filter((p) => !p.isExiting));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [renderedProcesses]);

  // Auto-dismiss logic for 'done' status
  useEffect(() => {
    processes.forEach((proc) => {
      if (proc.status === "done") {
        const timeout = 4000;
        const timer = setTimeout(() => {
          onDismiss(proc.id);
        }, timeout);
        return () => clearTimeout(timer);
      }
    });
  }, [processes, onDismiss]);

  if (!renderedProcesses || renderedProcesses.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {renderedProcesses.map((proc, index) => {
        const cascadeY = index * 40;
        const cascadeX = index * 20;

        if (proc.type === "planning") {
          const { steps, currentStep = 0, reasoning } = proc.data;
          const isDone = proc.status === "done";
          const isFailed = proc.status === "failed";

          return (
            <div className="pointer-events-auto" key={proc.id}>
              <DraggableHoloCard
                id={proc.id}
                title={
                  isDone ? (
                    <span className="flex items-center space-x-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Task Completed</span>
                    </span>
                  ) : isFailed ? (
                    <span className="flex items-center space-x-1.5 text-red-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Task Failed</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 text-emerald-400">
                      <ListTree className="w-3.5 h-3.5" />
                      <span>Executing Plan</span>
                    </span>
                  )
                }
                defaultPosition={{ x: 30 + cascadeX, y: 80 + cascadeY }}
                onClose={() => onDismiss(proc.id)}
                isVisible={!proc.isExiting}
              >
                <div className="w-[300px] sm:w-[320px] flex flex-col gap-2">
                  {reasoning && (
                    <details className="group">
                      <summary className="text-[10px] cursor-pointer select-none flex items-center space-x-1.5 text-textSecondary hover:text-emerald-400 transition-colors uppercase tracking-wider font-mono mb-2">
                        <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                        <span>Proses Pemikiran</span>
                      </summary>
                      <div className="text-[11px] text-textSecondary border-l border-emerald-500/30 pl-2 mb-2 font-mono whitespace-pre-wrap leading-relaxed">
                        {reasoning}
                      </div>
                    </details>
                  )}

                  {steps &&
                    steps.map((step, idx) => {
                      const isStepCompleted = idx < currentStep || isDone;
                      const isStepActive = idx === currentStep && !isDone;

                      const stepTitle =
                        typeof step === "object" ? step.task : step;
                      const stepQuery =
                        typeof step === "object" ? step.query : undefined;

                      return (
                        <div
                          key={idx}
                          className={`flex items-start text-[11px] font-mono transition-all space-x-2 ${
                            isStepCompleted
                              ? "text-emerald-400 font-bold"
                              : isStepActive
                              ? "text-white animate-pulse"
                              : "text-textSecondary/50"
                          }`}
                        >
                          <span className="w-4 shrink-0">
                            {isStepCompleted ? (
                              <Check className="w-3.5 h-3.5 inline text-emerald-400" />
                            ) : (
                              `${idx + 1}.`
                            )}
                          </span>

                          <div className="flex-1">
                            {stepQuery ? (
                              <details className="group/step outline-none">
                                <summary className="cursor-pointer select-none flex items-center hover:opacity-80 outline-none list-none">
                                  <ChevronRight className="w-2.5 h-2.5 group-open/step:rotate-90 transition-transform mr-1 text-emerald-400" />
                                  <span>{stepTitle}</span>
                                </summary>
                                <div className="mt-1 pl-2 text-[10px] border-l border-emerald-500/30 font-sans bg-background/60 p-1.5 rounded text-textSecondary">
                                  {stepQuery}
                                </div>
                              </details>
                            ) : (
                              <span>
                                {stepTitle}
                                {isStepActive ? "..." : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </DraggableHoloCard>
            </div>
          );
        }

        if (proc.type === "plugin-execution" || proc.type === "tool") {
          return (
            <div className="pointer-events-auto" key={proc.id}>
              <DraggableHoloCard
                id={proc.id}
                title={
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Tool: {proc.data.action}</span>
                  </span>
                }
                defaultPosition={{ x: 30 + cascadeX, y: 80 + cascadeY }}
                onClose={() => onDismiss(proc.id)}
                isVisible={!proc.isExiting}
              >
                <div className="w-[300px] sm:w-[320px] text-xs font-mono text-textPrimary">
                  <div className="mb-2 text-textSecondary text-[11px]">
                    Mengeksekusi Tool:{" "}
                    <span className="text-emerald-400 font-semibold font-mono">
                      {proc.data.action}
                    </span>
                  </div>

                  {proc.data.query && (
                    <div className="mb-2 p-2 bg-black/40 border border-emerald-500/20 rounded-md text-[11px] text-textSecondary">
                      <span className="text-emerald-400/90 font-semibold">Query: </span>
                      <span className="text-white font-mono">{proc.data.query}</span>
                    </div>
                  )}

                  {proc.data.result && (
                    <div className="p-2.5 bg-emerald-950/40 text-emerald-300 border border-emerald-500/20 rounded-lg text-[10px] max-h-48 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed">
                      {proc.data.result}
                    </div>
                  )}
                </div>
              </DraggableHoloCard>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
