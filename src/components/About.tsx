import { Terminal, Database, BrainCircuit, Blocks } from "lucide-react";

export default function About() {
  const focuses = [
    { name: "AI Integration", icon: <BrainCircuit className="w-5 h-5" /> },
    { name: "Web Development", icon: <Terminal className="w-5 h-5" /> },
    { name: "Agentic Systems", icon: <Blocks className="w-5 h-5" /> },
    { name: "APIs & Middleware", icon: <Database className="w-5 h-5" /> },
  ];

  return (
    <section className="py-24 border-t border-border" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-textPrimary">Building Ideas Into Software</h2>
            <div className="space-y-4 text-textSecondary leading-relaxed">
              <p>
                I am an Informatics student at UPN "Veteran" Jawa Timur with a deep interest in practical software development, AI integration, agentic systems, LLM-powered applications, automation, and clean functional UI/UX.
              </p>
              <p>
                My focus is on bridging the gap between artificial intelligence and practical web development, building tools that are not only functional but also intuitive and developer-friendly. I enjoy experimenting with new technologies and pushing the boundaries of what AI agents can do.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-textPrimary">Current Focus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focuses.map((focus) => (
                <div key={focus.name} className="flex items-center space-x-3 p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors">
                  <div className="text-primary">{focus.icon}</div>
                  <span className="text-textPrimary font-medium">{focus.name}</span>
                </div>
              ))}
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors">
                <div className="text-primary"><Terminal className="w-5 h-5" /></div>
                <span className="text-textPrimary font-medium">Developer Tools</span>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors">
                <div className="text-primary"><Blocks className="w-5 h-5" /></div>
                <span className="text-textPrimary font-medium">Desktop Applications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
