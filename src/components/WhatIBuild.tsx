import { BrainCircuit, Globe, Server, TerminalSquare, MonitorSmartphone, Settings } from "lucide-react";

const areas = [
  {
    title: "AI Applications & Automation",
    description: "LLM-powered applications, AI assistants, and agentic systems.",
    icon: <BrainCircuit className="w-6 h-6" />
  },
  {
    title: "Web Applications",
    description: "Modern web applications using React, Next.js, and Tailwind.",
    icon: <Globe className="w-6 h-6" />
  },
  {
    title: "Desktop Applications",
    description: "Cross-platform desktop applications using Electron and React.",
    icon: <MonitorSmartphone className="w-6 h-6" />
  },
];

export default function WhatIBuild() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-textPrimary">What I Build</h2>
          <p className="text-textSecondary mt-2">Areas of expertise and software categories.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div key={area.title} className="p-6 bg-surface border border-border rounded-xl hover:bg-surface/80 transition-colors group">
              <div className="w-12 h-12 bg-background border border-border rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                {area.icon}
              </div>
              <h3 className="text-lg font-bold text-textPrimary mb-3">{area.title}</h3>
              <p className="text-textSecondary text-sm leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
