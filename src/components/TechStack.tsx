import type { TechStack as TechStackType } from '@/types/techstack';
import TechIcon from '@/components/TechIcon';

const CATEGORY_TITLES: Record<string, string> = {
  frontend: 'Frontend & UI',
  backend: 'Backend & APIs',
  ai: 'AI & Agentic Systems',
  desktop: 'Desktop & Native',
  infrastructure: 'Infrastructure & Cloud',
  other: 'Other Tools & Libraries',
};

const CATEGORY_ORDER = ['frontend', 'backend', 'ai', 'desktop', 'infrastructure', 'other'];

export default function TechStack({ techStacks }: { techStacks: TechStackType[] }) {
  const groupedCategories = CATEGORY_ORDER.map((catKey) => {
    const items = techStacks.filter((t) => t.category === catKey);
    return {
      key: catKey,
      title: CATEGORY_TITLES[catKey] || catKey,
      skills: items.sort((a, b) => a.order_index - b.order_index),
    };
  }).filter((group) => group.skills.length > 0);

  return (
    <section className="py-24 border-t border-border bg-surface/10" id="skills">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs text-primary mb-3">
            <span>Stack & Tools</span>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary">Tech Stack</h2>
          <p className="text-textSecondary mt-2 text-sm max-w-xl">
            Technologies, frameworks, and tools I work with to build scalable software and AI-driven applications.
          </p>
        </div>

        {groupedCategories.length === 0 ? (
          <div className="p-8 text-center bg-surface border border-border rounded-xl text-textSecondary text-sm">
            No tech stack items loaded yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {groupedCategories.map((category) => (
              <div
                key={category.key}
                className="p-6 bg-surface border border-border rounded-xl hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-textPrimary">
                    {category.title}
                  </h3>
                  <span className="text-xs text-textSecondary font-mono px-2 py-0.5 bg-background rounded-md border border-border">
                    {category.skills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-background border border-border text-textSecondary text-xs rounded-lg hover:border-primary/50 hover:text-primary transition-all cursor-default"
                    >
                      <TechIcon
                        name={skill.name}
                        icon={skill.icon}
                        iconUrl={skill.icon_url}
                        color={skill.color}
                        className="w-3.5 h-3.5"
                      />
                      <span>{skill.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
