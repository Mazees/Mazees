const areas = [
  {
    tag: "AI & ML",
    title: "AI Applications & Automation",
    description:
      "LLM-powered applications, AI assistants, agentic workflows, and automated reasoning pipelines.",
  },
  {
    tag: "Full-Stack",
    title: "Web Applications & Platforms",
    description:
      "Modern, high-performance web applications using React, Next.js, TypeScript, and modern backend architectures.",
  },
  {
    tag: "Software",
    title: "Developer & Desktop Tools",
    description:
      "Cross-platform desktop software, CLI utilities, and developer productivity tools.",
  },
];

export default function WhatIBuild() {
  return (
    <section className="pb-24 pt-28 border-t border-border/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
            // Core Domains
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
            What I Build
          </h2>
          <p className="text-textSecondary mt-2.5 text-base md:text-lg max-w-xl font-normal leading-relaxed">
            Areas of engineering expertise, AI systems, and software categories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {areas.map((area, index) => (
            <div
              key={area.title}
              className="p-8 bg-surface border border-border rounded-2xl hover:border-primary/50 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                    {area.tag}
                  </span>
                  <span className="text-xs font-mono text-textSecondary font-bold">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-textPrimary group-hover:text-primary transition-colors">
                  {area.title}
                </h3>
                <p className="text-textSecondary text-sm leading-relaxed">
                  {area.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
