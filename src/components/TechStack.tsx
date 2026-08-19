import type { TechStack as TechStackType } from "@/types/techstack";
import TechIcon from "@/components/TechIcon";

const CATEGORY_TITLES: Record<string, string> = {
  frontend: "Frontend & UI",
  backend: "Backend & APIs",
  ai: "AI & Agentic Systems",
  desktop: "Desktop & Native",
  infrastructure: "Infrastructure & Cloud",
  other: "Other Tools & Libraries",
};

const CATEGORY_ORDER = [
  "frontend",
  "backend",
  "ai",
  "desktop",
  "infrastructure",
  "other",
];

export default function TechStack({
  techStacks,
}: {
  techStacks: TechStackType[];
}) {
  const groupedCategories = CATEGORY_ORDER.map((catKey) => {
    const items = techStacks.filter((t) => t.category === catKey);
    return {
      key: catKey,
      title: CATEGORY_TITLES[catKey] || catKey,
      skills: items.sort((a, b) => a.order_index - b.order_index),
    };
  }).filter((group) => group.skills.length > 0);

  return (
    <section
      className="pb-24 pt-28 border-t border-border bg-surface/10"
      id="skills"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12" data-aos="fade-up">
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
            // 04 · Stack & Tools
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
            My Tech Stack & Tools
          </h2>
        </div>

        {groupedCategories.length === 0 ? (
          <div className="p-8 text-center bg-surface border border-border rounded-xl text-textSecondary text-sm" data-aos="fade-up">
            No tech stack items loaded yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {groupedCategories.map((category, index) => (
              <div
                key={category.key}
                data-aos="fade-up"
                data-aos-delay={80 + (index % 2) * 80}
                className="p-6 bg-surface border border-border rounded-xl hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-textPrimary">
                    {category.title}
                  </h3>
                  <span className="text-xs text-textSecondary font-mono px-2 py-1 bg-background rounded-md border border-border">
                    {category.skills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-background border border-border text-textSecondary text-xs rounded-lg hover:border-primary/50 hover:text-primary transition-all cursor-default"
                    >
                      <TechIcon
                        name={skill.name}
                        icon={skill.icon}
                        iconUrl={skill.icon_url}
                        color={skill.color}
                        className="w-4 h-4"
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
