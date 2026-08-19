"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Square, Sparkles, Terminal, X } from "lucide-react";

const SLASH_COMMANDS = [
  {
    name: "projects",
    description: "Browse featured projects, case studies, and live links",
  },
  {
    name: "client",
    description: "View commercial client work and applications",
  },
  {
    name: "skills",
    description: "Explore tech stacks, frameworks, and proficiencies",
  },
  {
    name: "about",
    description: "Read Mada's education, background, and AI exploration",
  },
  {
    name: "contact",
    description: "Get direct contact via WhatsApp, Telegram, or Email",
  },
];

interface InputBarProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export default function InputBar({
  onSubmit,
  isLoading,
  onStop,
}: InputBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (val.startsWith("/")) {
      const query = val.slice(1).toLowerCase();
      const matches = SLASH_COMMANDS.filter((cmd) =>
        cmd.name.toLowerCase().includes(query)
      );
      setFilteredCommands(matches);
      setShowSlashMenu(matches.length > 0);
      setSelectedIndex(0);
    } else {
      setShowSlashMenu(false);
    }
  };

  const selectCommand = (commandName: string) => {
    let resolvedPrompt = "";
    switch (commandName) {
      case "projects":
        resolvedPrompt = "Show me Mada's featured projects and case studies.";
        break;
      case "client":
        resolvedPrompt = "What commercial client projects has Mada developed?";
        break;
      case "skills":
        resolvedPrompt = "What technologies and tech stack does Mada specialize in?";
        break;
      case "about":
        resolvedPrompt = "Tell me about Mada's background, education, and AI focus.";
        break;
      case "contact":
        resolvedPrompt = "How can I contact Mada for collaboration or hiring?";
        break;
      default:
        resolvedPrompt = `/${commandName}`;
    }

    setInputText("");
    setShowSlashMenu(false);
    onSubmit(resolvedPrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSlashMenu && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        selectCommand(filteredCommands[selectedIndex].name);
        return;
      }
      if (e.key === "Escape") {
        setShowSlashMenu(false);
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    if (!inputText.trim() || isLoading) return;
    const promptToSend = inputText.trim();
    setInputText("");
    setShowSlashMenu(false);
    onSubmit(promptToSend);
  };

  return (
    <div className="w-full max-w-2xl px-4 relative">
      {/* Slash Commands Autocomplete Menu */}
      {showSlashMenu && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-surface/95 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 text-[10px] font-mono font-bold text-textSecondary uppercase tracking-wider border-b border-border/80 flex items-center space-x-1.5">
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>Slash Commands</span>
          </div>
          <div className="max-h-52 overflow-y-auto p-1.5 space-y-1">
            {filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.name}
                type="button"
                onClick={() => selectCommand(cmd.name)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between group ${
                  idx === selectedIndex
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "hover:bg-background/80 text-textPrimary"
                }`}
              >
                <div>
                  <span className="font-mono text-xs font-bold block">
                    /{cmd.name}
                  </span>
                  <span className="text-[11px] text-textSecondary line-clamp-1">
                    {cmd.description}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-textSecondary/50 uppercase tracking-widest opacity-0 group-hover:opacity-100">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Glass Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="relative flex items-center bg-surface/90 backdrop-blur-2xl border border-border rounded-2xl p-2 pr-3 shadow-2xl focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
      >
        <div className="pl-3 pr-2 text-textSecondary">
          <Terminal className="w-4 h-4 text-emerald-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isLoading
              ? "Mark is reasoning and fetching data..."
              : "Ask Mark anything or type '/' for commands..."
          }
          className="flex-1 bg-transparent border-none outline-none text-textPrimary placeholder:text-textSecondary/50 text-xs sm:text-sm px-2 py-2"
        />

        <div className="flex items-center space-x-2 shrink-0">
          {isLoading && onStop && (
            <button
              type="button"
              onClick={onStop}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
              title="Abort request"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black disabled:opacity-40 disabled:hover:bg-emerald-500 transition-all shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95"
            title="Send message"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
