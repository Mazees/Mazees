"use client";

import { useState, FormEvent } from "react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

type Channel = "email" | "whatsapp" | "telegram";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!trimmedMessage) {
      setError("Please enter your message.");
      return;
    }

    if (channel === "email") {
      const subject = encodeURIComponent(`Message from ${trimmedName}`);
      const body = encodeURIComponent(
        `Hi Mada,\n\nName: ${trimmedName}\n\nMessage:\n${trimmedMessage}`
      );
      window.location.href = `mailto:madaadha21@gmail.com?subject=${subject}&body=${body}`;
    } else if (channel === "whatsapp") {
      const text = encodeURIComponent(
        `Halo Mada, nama saya ${trimmedName}.\n\n${trimmedMessage}`
      );
      window.open(`https://wa.me/6281234489008?text=${text}`, "_blank");
    } else if (channel === "telegram") {
      const text = encodeURIComponent(
        `Halo Mada, nama saya ${trimmedName}.\n\n${trimmedMessage}`
      );
      window.open(`https://t.me/+6281234489008?text=${text}`, "_blank");
    }

    setSubmitted(true);
  };

  const channelOptions: {
    id: Channel;
    name: string;
    target: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      target: "wa.me/6281234489008",
      icon: FaWhatsapp,
    },
    {
      id: "email",
      name: "Email",
      target: "madaadha21@gmail.com",
      icon: Mail,
    },
    {
      id: "telegram",
      name: "Telegram",
      target: "t.me/mazeesid",
      icon: FaTelegramPlane,
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6"
    >
      {/* Platform / Channel Selection */}
      <div className="space-y-3">
        <label className="text-xs font-mono font-semibold text-textSecondary uppercase tracking-wider block">
          Select Channel
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {channelOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = channel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setChannel(opt.id);
                  setSubmitted(false);
                }}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-textPrimary"
                    : "border-border bg-background/50 hover:bg-background text-textSecondary hover:text-textPrimary"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? "text-primary" : "text-textSecondary"
                    }`}
                  />
                  <span className="text-sm font-bold text-textPrimary">
                    {opt.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-xs font-mono font-semibold text-textSecondary uppercase tracking-wider block"
        >
          Your Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSubmitted(false);
          }}
          placeholder="e.g. Alex Pratama"
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/40 focus:border-primary focus:outline-none transition-colors"
          required
        />
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-xs font-mono font-semibold text-textSecondary uppercase tracking-wider block"
        >
          Your Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setSubmitted(false);
          }}
          placeholder="Describe your project, inquiry, or discussion topic..."
          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary/40 focus:border-primary focus:outline-none transition-colors resize-none"
          required
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white py-3.5 px-6 rounded-xl text-sm font-bold transition-all shadow-md shadow-primary/20 hover:scale-[1.01]"
      >
        <Send className="w-4 h-4" />
        <span>
          {channel === "email"
            ? "Send via Email"
            : channel === "whatsapp"
            ? "Send via WhatsApp"
            : "Open Telegram Chat"}
        </span>
      </button>
    </form>
  );
}
