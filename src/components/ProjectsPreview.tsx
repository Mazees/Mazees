import Link from "next/link";
import { ArrowRight, FolderKanban, Sparkles } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/types/project";

export default function ProjectsPreview({ projects }: { projects: Project[] }) {
  const displayProjects = projects.filter((p) => p.is_featured).slice(0, 6);

  return (
    <section
      className="pb-24 pt-28 border-t border-border"
      id="projects-preview"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
              // 02 · Highlights & AI Lab
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
              My Featured Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface hover:bg-border border border-border text-sm font-semibold text-textPrimary hover:text-primary transition-all self-start md:self-auto group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl">
            <FolderKanban className="w-10 h-10 text-textSecondary mx-auto mb-3 opacity-40" />
            <p className="text-sm text-textSecondary">
              No projects showcased yet.
            </p>
          </div>
        )}

        {projects.length > 6 && (
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-all shadow-lg shadow-primary/20"
            >
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
