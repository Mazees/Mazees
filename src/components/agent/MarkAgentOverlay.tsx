"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, RotateCcw } from "lucide-react";
import { ReActAgent } from "react-agent-js";
import { llmProviderAction } from "@/lib/actions/agent-actions";
import { clientAgentTools } from "@/lib/agent/client-tools";
import { MARK_SYSTEM_PROMPT } from "@/lib/agent/prompt";
import OrbVisualizer from "./OrbVisualizer";
import ResponseArea from "./ResponseArea";
import InputBar from "./InputBar";
import ProcessPanel, { AgentProcess } from "./ProcessPanel";
import { AgentStep, ChatMessage } from "@/lib/agent/types";

const SUGGESTED_PROMPTS = [
  "What AI projects has Mada built?",
  "What tech stacks does Mada specialize in?",
  "Show me Mada's commercial client work",
  "How can I contact Mada for hiring?",
];

export default function MarkAgentOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "thinking" | "speaking" | "error"
  >("idle");

  const [response, setResponse] = useState<string>(
    "Hello! I'm Mark, Mada's personal AI Assistant. Feel free to ask me anything about Mada's projects, tech stack, open-source repositories, or contact channels.",
  );
  const [responseType, setResponseType] = useState<"short" | "long">("short");
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [processes, setProcesses] = useState<AgentProcess[]>([]);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [activeTask, setActiveTask] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Inisialisasi ReActAgent pada client-side dengan useRef
  const agentRef = useRef<ReActAgent | null>(null);

  useEffect(() => {
    const initialHistory = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const wrappedLlmProvider = async (msgs: any[]) => {
      if (abortControllerRef.current?.signal.aborted) {
        throw new Error("ABORTED_BY_USER");
      }

      const abortPromise = new Promise<any>((_, reject) => {
        const signal = abortControllerRef.current?.signal;
        if (signal?.aborted) return reject(new Error("ABORTED_BY_USER"));
        signal?.addEventListener("abort", () => {
          reject(new Error("ABORTED_BY_USER"));
        });
      });

      return await Promise.race([llmProviderAction(msgs), abortPromise]);
    };

    agentRef.current = new ReActAgent(
      wrappedLlmProvider,
      clientAgentTools,
      MARK_SYSTEM_PROMPT,
      initialHistory,
    );
  }, [history]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-mark-chat", handleOpen);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-mark-chat", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim() || !agentRef.current) return;

    const processId = `proc-${Date.now()}`;
    setStatus("thinking");
    setActiveTask("Analyzing Query...");
    setSteps([]);
    setProcesses([]); // Jangan munculkan card placeholder sebelum tool dijalankan

    const updatedHistory: ChatMessage[] = [
      ...history,
      { role: "user", content: promptText },
    ];
    setHistory(updatedHistory);

    abortControllerRef.current = new AbortController();

    const localSteps: Array<{ task: string; query?: string }> = [];
    let localThought = "";
    let currentStepIndex = 0;

    try {
      const abortPromise = new Promise<any>((_, reject) => {
        const signal = abortControllerRef.current?.signal;
        if (signal?.aborted) return reject(new Error("ABORTED_BY_USER"));
        signal?.addEventListener("abort", () => {
          reject(new Error("ABORTED_BY_USER"));
        });
      });

      // Jalankan ReAct Loop langsung di Client dan dengarkan setiap status real-time
      const runPromise = agentRef.current.run(promptText, (stepData: any) => {
        if (abortControllerRef.current?.signal.aborted) return;

        // 1. Saat AI mengambil keputusan / thought
        if (stepData.status === "decision" && stepData.decision) {
          if (stepData.decision.thought) {
            localThought = stepData.decision.thought;
          }
          if (stepData.decision.action && stepData.decision.action.tool) {
            const toolName = stepData.decision.action.tool;
            const toolQuery =
              typeof stepData.decision.action.query === "object"
                ? JSON.stringify(stepData.decision.action.query)
                : String(stepData.decision.action.query || "");

            localSteps.push({ task: toolName, query: toolQuery });
            currentStepIndex = localSteps.length - 1;

            setProcesses([
              {
                id: processId,
                type: "planning",
                status: "active",
                data: {
                  steps: [...localSteps],
                  currentStep: currentStepIndex,
                  reasoning: localThought,
                },
              },
            ]);
          }
        }
        // 2. Saat Tool sedang aktif dieksekusi
        else if (stepData.status === "executing_tool") {
          const toolName = stepData.tool || "Tool";
          const toolQuery =
            typeof stepData.query === "object"
              ? JSON.stringify(stepData.query)
              : String(stepData.query || "");

          const existing = localSteps.find(
            (s) => s.task === toolName && s.query === toolQuery,
          );
          if (!existing) {
            localSteps.push({ task: toolName, query: toolQuery });
          }
          currentStepIndex = localSteps.length - 1;

          setProcesses([
            {
              id: processId,
              type: "planning",
              status: "active",
              data: {
                steps: [...localSteps],
                currentStep: currentStepIndex,
                reasoning: localThought,
              },
            },
          ]);
        }
        // 3. Saat Tool selesai dieksekusi (observation) -> beri centang
        else if (stepData.status === "observation") {
          currentStepIndex = localSteps.length;

          setProcesses([
            {
              id: processId,
              type: "planning",
              status: "active",
              data: {
                steps: [...localSteps],
                currentStep: currentStepIndex,
                reasoning: localThought,
              },
            },
          ]);
        }
      });

      const finalAnswer = await Promise.race([runPromise, abortPromise]);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // 4. Selesai! Ubah ProcessPanel status menjadi 'done'
      if (localSteps.length > 0) {
        setProcesses([
          {
            id: processId,
            type: "planning",
            status: "done",
            data: {
              steps: [...localSteps],
              currentStep: localSteps.length,
              reasoning: localThought || "ReAct agent loop selesai.",
            },
          },
        ]);
      } else {
        setProcesses([]);
      }

      const isLong =
        typeof finalAnswer === "string" &&
        (finalAnswer.length > 250 || finalAnswer.includes("\n\n"));

      setResponse(finalAnswer || "Jawaban telah diproses.");
      setResponseType(isLong ? "long" : "short");
      setStatus("speaking");

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: finalAnswer || "" },
      ]);

      setTimeout(() => {
        setStatus("idle");
      }, 1500);
    } catch (err: any) {
      if (
        err.message === "ABORTED_BY_USER" ||
        abortControllerRef.current?.signal.aborted
      ) {
        setResponse("Request was cancelled.");
        setStatus("idle");
        setProcesses([]);
        return;
      }
      console.error("[Client ReActAgent error]:", err);
      setResponse(
        "I encountered an issue processing your query. Please try again or reach out to Mada directly.",
      );
      setStatus("error");
      setProcesses((prev) =>
        prev.map((p) => (p.id === processId ? { ...p, status: "failed" } : p)),
      );
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus("idle");
    setProcesses([]);
  };

  const handleDismissProcess = (id: string) => {
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetChat = () => {
    if (agentRef.current) {
      agentRef.current.clearHistory();
    }
    setHistory([]);
    setSteps([]);
    setProcesses([]);
    setStatus("idle");
    setResponse(
      "Conversation reset. What would you like to explore about Mada or his projects?",
    );
    setResponseType("short");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      {/* Draggable Process Panel HUD Cards */}
      <ProcessPanel processes={processes} onDismiss={handleDismissProcess} />
      {/* Top Bar / HUD Navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <img
            src="/mark-icon.svg"
            alt="Mark"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-textPrimary tracking-tight flex items-center space-x-2">
              <span>Mark Agent</span>
            </h2>
            <p className="text-[11px] font-mono text-textSecondary">
              Mazees Interactive Companion
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-surface border border-border transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-surface border border-border transition-colors"
            title="Close Mark HUD (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Stage: 3D Orb + Response Area */}
      <div className="relative flex-1 w-full max-w-4xl flex flex-col items-center justify-center my-auto z-10 overflow-y-auto no-scrollbar py-6">
        {/* Central 3D Glass Tesseract Orb */}
        <div className="relative flex items-center justify-center mb-4">
          <OrbVisualizer status={status} />
        </div>

        {/* Dynamic Response HUD Area */}
        <ResponseArea
          text={response}
          type={responseType}
          isThinking={status === "thinking"}
          activeTask={activeTask}
        />

        {/* Suggested Quick Prompt Chips (When Idle) */}
        {status === "idle" && history.length === 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-xl px-4 animate-in fade-in zoom-in-95 duration-200">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSubmit(prompt)}
                className="px-3.5 py-1.5 rounded-full bg-surface/90 hover:bg-emerald-500/20 border border-border hover:border-emerald-500/40 text-textSecondary hover:text-emerald-400 text-xs font-medium transition-all shadow-sm flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Floating Input Bar */}
      <div className="w-full max-w-4xl flex justify-center pb-2 z-20">
        <InputBar
          onSubmit={handleSubmit}
          isLoading={status === "thinking"}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
