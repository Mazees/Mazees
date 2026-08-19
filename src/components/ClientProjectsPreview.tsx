import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/types/project";

export default function ClientProjectsPreview({
  projects,
}: {
  projects: Project[];
}) {
  const clientProjects = projects
    .filter((p) => p.project_type === "client")
    .slice(0, 6);

  return (
    <section
      className="pb-24 pt-28 border-t border-border"
      id="client-projects"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" data-aos="fade-up">
          <div>
            <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
              // 03 · Commercial Work
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
              My Client Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface hover:bg-border border border-border text-sm font-semibold text-textPrimary hover:text-primary transition-all self-start md:self-auto group"
          >
            <span>View All Client Work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {clientProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientProjects.map((project, index) => (
              <div
                key={project.id}
                data-aos="fade-up"
                data-aos-delay={80 + (index % 3) * 60}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="p-12 text-center bg-surface/30 border border-dashed border-border rounded-2xl"
            data-aos="fade-up"
          >
            <h3 className="text-sm font-bold text-textPrimary mb-1">
              No Client Projects Published Yet
            </h3>
            <p className="text-xs text-textSecondary mb-4 font-mono">
              // Manage via dashboard
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all shadow-md shadow-primary/20"
            >
              <span>Add Client Project</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
