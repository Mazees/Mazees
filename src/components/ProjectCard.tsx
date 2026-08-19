import Link from "next/link";
import {
  Globe,
  ArrowUpRight,
  FolderKanban,
  Star,
  ExternalLink,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/types/project";
import TechIcon from "@/components/TechIcon";

export default function ProjectCard({ project }: { project: Project }) {
  const detailUrl = `/projects/${project.slug}`;

  return (
    <div className="group bg-surface border border-border hover:border-primary/50 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 relative">
      {/* Cover Image as Link */}
      <Link
        href={detailUrl}
        className="relative aspect-video w-full bg-background border-b border-border overflow-hidden block"
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface to-background text-textSecondary">
            <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-primary mb-2">
              <FolderKanban className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-textSecondary/60">
              {project.title}
            </span>
          </div>
        )}

        {/* Project Type Badge */}
        {project.project_type === "client" && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-primary/40 text-primary-light text-[11px] font-semibold flex items-center space-x-1 shadow-lg z-10">
            <span>Client Work</span>
          </div>
        )}
        {project.project_type === "opensource" && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-border text-textPrimary text-[11px] font-semibold flex items-center space-x-1 shadow-lg z-10">
            <span>Open Source</span>
          </div>
        )}

        {project.is_featured && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-yellow-500/30 text-yellow-400 text-[11px] font-medium flex items-center space-x-1 shadow-lg z-10">
            <Star className="w-3 h-3 fill-yellow-400" />
            <span>Featured</span>
          </div>
        )}

        {project.images && project.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono flex items-center space-x-1 shadow z-10">
            <span>+{project.images.length} photos</span>
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-4 py-2 rounded-xl bg-background/90 backdrop-blur-md border border-border text-xs font-medium text-textPrimary flex items-center space-x-2 shadow-lg">
            <span>View Project</span>
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title Link */}
        <Link href={detailUrl} className="block group/title mb-2">
          <h3 className="text-lg font-bold text-textPrimary group-hover/title:text-primary transition-colors line-clamp-1 flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 text-primary transition-opacity shrink-0 ml-2" />
          </h3>
        </Link>

        <p className="text-textSecondary text-xs leading-relaxed flex-grow line-clamp-3 mb-4">
          {project.description || "No description provided."}
        </p>

        {/* Tech Stack Badges */}
        {project.tech_stacks && project.tech_stacks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stacks.slice(0, 4).map((tech) => (
              <span
                key={tech.id}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-background border border-border text-[11px] text-textSecondary"
              >
                <TechIcon
                  name={tech.name}
                  icon={tech.icon}
                  iconUrl={tech.icon_url}
                  color={tech.color}
                  className="w-3 h-3"
                />
                <span>{tech.name}</span>
              </span>
            ))}
            {project.tech_stacks.length > 4 && (
              <span className="px-2 py-1 rounded-lg bg-background border border-border text-[11px] text-textSecondary">
                +{project.tech_stacks.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-medium text-primary hover:text-primary-light transition-colors py-1.5 px-3 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20"
                title="Open Link"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-medium text-textSecondary hover:text-textPrimary transition-colors py-1.5 px-3 rounded-lg bg-background hover:bg-border border border-border"
                title="Source Code"
              >
                <FaGithub className="w-4 h-4" />
                <span>Source</span>
              </a>
            )}
          </div>

          <Link
            href={detailUrl}
            className="text-xs text-textSecondary hover:text-primary transition-colors flex items-center space-x-2 font-medium ml-auto"
          >
            <span>Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
