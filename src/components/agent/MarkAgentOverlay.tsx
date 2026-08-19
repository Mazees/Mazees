"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, RotateCcw } from "lucide-react";
import OrbVisualizer from "./OrbVisualizer";
import ResponseArea from "./ResponseArea";
import InputBar from "./InputBar";
import ProcessPanel, { AgentProcess } from "./ProcessPanel";
import { AgentStep, ChatMessage } from "@/lib/agent/engine";

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
    if (!promptText.trim()) return;

    const processId = `proc-${Date.now()}`;
    setStatus("thinking");
    setActiveTask("Analyzing Query...");
    setSteps([]);

    // Initialize active planning process
    setProcesses([
      {
        id: processId,
        type: "planning",
        status: "active",
        data: {
          steps: [{ task: "Memproses Query", query: promptText }],
          currentStep: 0,
          reasoning:
            "Menjalankan ReAct agent loop untuk menentukan tools yang dibutuhkan...",
        },
      },
    ]);

    const updatedHistory: ChatMessage[] = [
      ...history,
      { role: "user", content: promptText },
    ];
    setHistory(updatedHistory);

    // Abort previous in-flight requests if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          history: updatedHistory,
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.text);
        setResponseType(data.type || "short");
        setSteps(data.steps || []);
        setStatus("speaking");

        const rawSteps: AgentStep[] = data.steps || [];
        const toolCalls = rawSteps.filter((s) => s.type === "tool_call");
        const thoughtSteps = rawSteps.filter((s) => s.type === "thought");

        // Real steps: directly list the tools executed by the agent
        const realToolSteps =
          toolCalls.length > 0
            ? toolCalls.map((t) => ({
                task: t.name || "Tool",
                query:
                  typeof t.input === "object"
                    ? JSON.stringify(t.input)
                    : String(t.input || ""),
              }))
            : [
                {
                  task: "Direct Response (No Tools Needed)",
                  query: promptText,
                },
              ];

        const combinedReasoning =
          thoughtSteps
            .map((t) => t.text)
            .filter(Boolean)
            .join("\n\n") || "ReAct agent loop selesai.";

        setProcesses([
          {
            id: processId,
            type: "planning",
            status: "done",
            data: {
              steps: realToolSteps,
              currentStep: realToolSteps.length,
              reasoning: combinedReasoning,
            },
          },
        ]);

        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);

        setTimeout(() => {
          setStatus("idle");
        }, 1500);
      } else {
        setResponse(
          data.text ||
            "I encountered an error retrieving data. Please try another query or contact Mada directly.",
        );
        setResponseType("short");
        setStatus("error");
        setProcesses((prev) =>
          prev.map((p) =>
            p.id === processId ? { ...p, status: "failed" } : p,
          ),
        );
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setResponse("Request was cancelled.");
        setStatus("idle");
        setProcesses([]);
        return;
      }
      setResponse(
        "Connection error while contacting Mark engine. Please try again in a moment.",
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
