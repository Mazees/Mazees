"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Star,
  ExternalLink,
  FolderKanban,
  CheckCircle2,
  Clock,
  Loader2,
  Globe,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { Project } from "@/types/project";
import {
  deleteProjectAction,
  toggleProjectPublishedAction,
  toggleProjectFeaturedAction,
} from "@/lib/actions/projects";

export default function ProjectListManager({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft" | "featured"
  >("all");
  const [deleteConfirmProject, setDeleteConfirmProject] =
    useState<Project | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleTogglePublished(project: Project) {
    setLoadingId(project.id);
    const nextState = !project.is_published;
    const res = await toggleProjectPublishedAction(project.id, nextState);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_published: nextState } : p,
        ),
      );
    } else {
      alert(res.error || "Failed to toggle status");
    }
    setLoadingId(null);
  }

  async function handleToggleFeatured(project: Project) {
    setLoadingId(project.id);
    const nextState = !project.is_featured;
    const res = await toggleProjectFeaturedAction(project.id, nextState);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, is_featured: nextState } : p,
        ),
      );
    } else {
      alert(res.error || "Failed to toggle featured");
    }
    setLoadingId(null);
  }

  async function handleDelete(project: Project) {
    setLoadingId(project.id);
    const res = await deleteProjectAction(
      project.id,
      project.image_url,
      project.images
    );
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setDeleteConfirmProject(null);
    } else {
      alert(res.error || "Failed to delete project");
    }
    setLoadingId(null);
  }

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(search.toLowerCase()));

    if (filterStatus === "published") return matchesSearch && p.is_published;
    if (filterStatus === "draft") return matchesSearch && !p.is_published;
    if (filterStatus === "featured") return matchesSearch && p.is_featured;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">
            Showcase Projects
          </h2>
          <p className="text-xs text-textSecondary mt-1">
            Manage your custom projects with cover images, demo links, and tech
            stacks
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-textSecondary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: "all", label: `All (${projects.length})` },
            {
              key: "published",
              label: `Published (${projects.filter((p) => p.is_published).length})`,
            },
            {
              key: "draft",
              label: `Draft (${projects.filter((p) => !p.is_published).length})`,
            },
            {
              key: "featured",
              label: `Featured (${projects.filter((p) => p.is_featured).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === tab.key
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border text-textSecondary border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl">
          <FolderKanban className="w-10 h-10 text-textSecondary mx-auto mb-3 opacity-40" />
          <p className="text-sm text-textSecondary">
            No projects found matching your criteria.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-4 inline-flex items-center space-x-2 text-xs text-primary hover:underline font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create new project</span>
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg">
          <div className="divide-y divide-border">
            {filtered.map((project) => {
              const isWorking = loadingId === project.id;
              return (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-background/40 transition-colors"
                >
                  <div className="flex items-start sm:items-center space-x-4 min-w-0 flex-1">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-16 h-16 sm:w-20 sm:h-14 rounded-xl object-cover border border-border shrink-0 bg-background"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-14 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <FolderKanban className="w-6 h-6 opacity-80" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-textPrimary truncate">
                          {project.title}
                        </h3>
                        {project.is_featured && (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-medium flex items-center space-x-1">
                            <Star className="w-2.5 h-2.5 fill-yellow-400" />
                            <span>Featured</span>
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-textSecondary">
                          /{project.slug}
                        </span>
                      </div>

                      {project.description && (
                        <p className="text-xs text-textSecondary line-clamp-1">
                          {project.description}
                        </p>
                      )}

                      {/* Tech stack tags */}
                      {project.tech_stacks &&
                        project.tech_stacks.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {project.tech_stacks.map((t) => (
                              <span
                                key={t.id}
                                className="px-2 py-0.5 rounded-md bg-background text-[10px] text-textSecondary border border-border/80"
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Actions & Toggles */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border/50 shrink-0">
                    <div className="flex items-center space-x-2">
                      {/* Featured button */}
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        disabled={isWorking}
                        className={`p-2 rounded-xl text-xs border transition-all ${
                          project.is_featured
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-background text-textSecondary border-border hover:text-textPrimary"
                        }`}
                        title={
                          project.is_featured
                            ? "Remove from featured"
                            : "Mark as featured"
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            project.is_featured ? "fill-yellow-400" : ""
                          }`}
                        />
                      </button>

                      {/* Published button */}
                      <button
                        onClick={() => handleTogglePublished(project)}
                        disabled={isWorking}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-all ${
                          project.is_published
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-background text-textSecondary border-border"
                        }`}
                      >
                        {project.is_published ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-background hover:bg-border text-textSecondary hover:text-primary border border-border transition-colors"
                          title="View Live Demo"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}

                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-background hover:bg-border text-textSecondary hover:text-primary border border-border transition-colors"
                          title="View Repository"
                        >
                          <FaGithub className="w-4 h-4" />
                        </a>
                      )}

                      <Link
                        href={`/dashboard/projects/${project.id}/edit`}
                        className="p-2 rounded-xl bg-background hover:bg-border text-textSecondary hover:text-textPrimary border border-border transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setDeleteConfirmProject(project)}
                        className="p-2 rounded-xl bg-background hover:bg-red-500/10 text-textSecondary hover:text-red-400 border border-border transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-textPrimary">
              Delete Project: {deleteConfirmProject.title}?
            </h3>
            <p className="text-xs text-textSecondary leading-relaxed">
              Are you sure you want to delete this project? This will also
              remove its cover image from Supabase Storage and remove all tech
              stack links. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                className="px-4 py-2 rounded-xl text-xs text-textSecondary hover:bg-background transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmProject)}
                disabled={loadingId === deleteConfirmProject.id}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition-all flex items-center space-x-2"
              >
                {loadingId === deleteConfirmProject.id && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
