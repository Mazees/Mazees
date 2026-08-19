export default function About() {
  const focuses = [
    {
      title: "AI Integration",
      desc: "Exploring LLMs, AI tools, and ways to integrate intelligent features into applications.",
    },
    {
      title: "Web Development",
      desc: "Building web applications and interfaces with React, Next.js, and modern web technologies.",
    },
    {
      title: "Agentic Systems",
      desc: "Experimenting with AI agents, tool usage, agentic workflows, and autonomous task execution.",
    },
    {
      title: "AI Applications",
      desc: "Exploring how AI can be applied to everyday problems and turned into useful applications.",
    },
    {
      title: "Developer Tools",
      desc: "Building small tools, utilities, and experiments to improve development workflows.",
    },
    {
      title: "Desktop Applications",
      desc: "Exploring cross-platform desktop applications with Electron and web technologies.",
    },
  ];

  return (
    <section className="pb-24 pt-28 border-t border-border/80" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-16 items-start">
          {/* Left Column: Background & Bio */}
          <div className="md:col-span-5 space-y-6">
            <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block">
              // 01 · Who I Am
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-textPrimary tracking-tight leading-tight">
              About Me & Core Focus
            </h2>
            <div className="space-y-4 text-textSecondary text-base md:text-lg leading-relaxed font-normal">
              <p>
                I&apos;m an Informatics student at UPN &ldquo;Veteran&rdquo;
                Jawa Timur who enjoys exploring and building things with
                technology. I&apos;m interested in web development, AI
                applications, and agentic systems, especially in finding ways to
                apply them to real-world problems and everyday life.
              </p>
              <p>
                I&apos;m still learning and experimenting, but I enjoy turning
                what I learn into projects and seeing where an idea can go.
              </p>
            </div>
          </div>

          {/* Right Column: Core Focus Areas */}
          <div className="md:col-span-7 space-y-6">
            <span className="text-xs font-mono font-bold text-textSecondary tracking-widest uppercase block">
              // Core Focus Areas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focuses.map((focus, index) => (
                <div
                  key={focus.title}
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all hover:translate-y-[-2px] shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-textPrimary font-bold text-base">
                        {focus.title}
                      </h4>
                      <span className="text-[11px] font-mono text-textSecondary/60 font-semibold">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="text-textSecondary text-xs leading-relaxed">
                      {focus.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
