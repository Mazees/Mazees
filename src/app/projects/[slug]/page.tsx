import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Globe,
  ExternalLink,
  Star,
  FolderKanban,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { getProjectBySlug, getPublishedProjects } from '@/lib/supabase/projects';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TechIcon from '@/components/TechIcon';
import ProjectCard from '@/components/ProjectCard';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found — Mada Putra Adhadriyanto',
    };
  }

  return {
    title: `${project.title} — Mada Putra Adhadriyanto`,
    description:
      project.description ||
      `Learn more about ${project.title}, built by Mada Putra Adhadriyanto.`,
  };
}

export const revalidate = 60;

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getPublishedProjects();
  const otherProjects = allProjects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background font-sans text-textPrimary flex flex-col justify-between">
      <Navbar />

      <div className="pt-32 pb-24 flex-1">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs text-textSecondary mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-primary transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-textPrimary font-medium truncate">
              {project.title}
            </span>
          </div>

          {/* Header */}
          <div className="space-y-6 mb-10">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center space-x-1.5 text-xs text-textSecondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg bg-surface border border-border"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </Link>

              {project.is_featured && (
                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs font-medium flex items-center space-x-1.5">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  <span>Featured Project</span>
                </span>
              )}

              <span className="text-xs text-textSecondary flex items-center space-x-1.5 ml-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-textPrimary tracking-tight">
              {project.title}
            </h1>

            {project.description && (
              <p className="text-base md:text-lg text-textSecondary leading-relaxed">
                {project.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                  <Globe className="w-4 h-4" />
                  <span>Open Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-border text-textPrimary text-sm font-medium rounded-xl border border-border transition-all"
                >
                  <FaGithub className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-surface mb-14 shadow-2xl">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-surface to-background text-textSecondary">
                <FolderKanban className="w-16 h-16 text-primary mb-3 opacity-60" />
                <span className="text-sm font-mono text-textSecondary">
                  {project.title}
                </span>
              </div>
            )}
          </div>

          {/* Tech Stack Breakdown */}
          {project.tech_stacks && project.tech_stacks.length > 0 && (
            <div className="p-8 rounded-3xl bg-surface border border-border mb-12 space-y-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-textPrimary">
                    Technologies & Architecture
                  </h2>
                  <p className="text-xs text-textSecondary">
                    Tools, frameworks, and libraries used to build this project
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {project.tech_stacks.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-3.5 rounded-xl bg-background border border-border flex items-center space-x-3 hover:border-primary/40 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                      style={{
                        backgroundColor: tech.color
                          ? `${tech.color}20`
                          : 'rgba(249, 115, 22, 0.1)',
                        color: tech.color || '#F97316',
                      }}
                    >
                      <TechIcon
                        name={tech.name}
                        icon={tech.icon}
                        iconUrl={tech.icon_url}
                        color={tech.color}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-textPrimary block truncate">
                        {tech.name}
                      </span>
                      <span className="text-[10px] text-textSecondary uppercase tracking-wider block">
                        {tech.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description with MarkdownRenderer */}
          {project.long_description && (
            <div className="p-8 md:p-10 rounded-3xl bg-surface border border-border mb-16 space-y-6">
              <h2 className="text-xl font-bold text-textPrimary border-b border-border pb-4">
                Project Overview & Implementation
              </h2>
              <MarkdownRenderer content={project.long_description} />
            </div>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <div className="pt-12 border-t border-border space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-textPrimary">
                    Explore More Projects
                  </h3>
                  <p className="text-xs text-textSecondary mt-1">
                    Other software applications and tools
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  View All Projects
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {otherProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
