"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Globe, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import MultipleImageUploader from "./MultipleImageUploader";
import TechStackSelector from "./TechStackSelector";
import MarkdownEditor from "./MarkdownEditor";
import type { Project, ProjectInsert, ProjectType } from "@/types/project";
import type { TechStack } from "@/types/techstack";
import {
  createProjectAction,
  updateProjectAction,
} from "@/lib/actions/projects";

interface ProjectFormProps {
  initialData?: Project | null;
  availableTechStacks: TechStack[];
}

export default function ProjectForm({
  initialData,
  availableTechStacks,
}: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [longDescription, setLongDescription] = useState(
    initialData?.long_description || "",
  );

  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images
      : initialData?.image_url
        ? [initialData.image_url]
        : [],
  );

  const [projectType, setProjectType] = useState<ProjectType>(
    initialData?.project_type || "personal",
  );

  const [demoUrl, setDemoUrl] = useState(initialData?.demo_url || "");
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || "");
  const [isFeatured, setIsFeatured] = useState(
    initialData?.is_featured || false,
  );
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.is_published : true,
  );
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 0);

  const [selectedTechStackIds, setSelectedTechStackIds] = useState<string[]>(
    initialData?.tech_stacks?.map((t) => t.id) || [],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto generate slug from title if user hasn't typed a custom slug
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing || !slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required");
      return;
    }

    setLoading(true);
    setError(null);

    const cover = imageUrl || (images.length > 0 ? images[0] : null);

    const payload: ProjectInsert = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      long_description: longDescription.trim() || null,
      image_url: cover,
      images: images,
      demo_url: demoUrl.trim() || null,
      repo_url: repoUrl.trim() || null,
      project_type: projectType,
      is_featured: isFeatured,
      is_published: isPublished,
      order_index: Number(orderIndex) || 0,
    };

    if (isEditing && initialData) {
      const res = await updateProjectAction(
        initialData.id,
        payload,
        selectedTechStackIds,
        initialData.image_url,
      );
      if (res.success) {
        router.push("/dashboard/projects");
        router.refresh();
      } else {
        setError(res.error || "Failed to update project");
        setLoading(false);
      }
    } else {
      const res = await createProjectAction(payload, selectedTechStackIds);
      if (res.success) {
        router.push("/dashboard/projects");
        router.refresh();
      } else {
        setError(res.error || "Failed to create project");
        setLoading(false);
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-xl bg-surface border border-border text-textSecondary hover:text-textPrimary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-textPrimary">
              {isEditing ? `Edit: ${initialData?.title}` : "Create New Project"}
            </h2>
            <p className="text-xs text-textSecondary">
              {isEditing
                ? "Update project details, screenshots gallery, and classification"
                : "Add a new showcase project to your portfolio"}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
            <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
              Project Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Enterprise Logistics AI Platform"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. enterprise-logistics-ai"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-mono text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                Short Description
              </label>
              <textarea
                rows={3}
                placeholder="A concise summary of what this project does and the problem it solved..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Multiple Images Uploader */}
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                Project Screenshots & Gallery
              </label>
              <MultipleImageUploader
                images={images}
                coverImage={imageUrl}
                onImagesChange={setImages}
                onCoverChange={setImageUrl}
              />
            </div>

            {/* Markdown Full Description with Visual Toolbar */}
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-2 uppercase tracking-wider">
                Full Description / Case Study (Markdown Supported)
              </label>
              <MarkdownEditor
                value={longDescription}
                onChange={setLongDescription}
                placeholder="Write detailed case study, client challenge, architecture, features, and key results..."
                rows={9}
              />
            </div>
          </div>

          {/* Links */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
              Project Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                  Project Link / URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-textSecondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://client-domain.com"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <span className="text-[10px] text-textSecondary mt-1 block">
                  Public URL for live application, platform, or project
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                  Repository URL (Optional)
                </label>
                <div className="relative">
                  <FaGithub className="w-4 h-4 text-textSecondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://github.com/Mazees/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <span className="text-[10px] text-textSecondary mt-1 block">
                  Leave empty if private / protected by client NDA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings (Right 1 col) */}
        <div className="space-y-6">
          {/* Project Type Classification */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
              Project Type
            </h3>
            <div className="space-y-2">
              {[
                {
                  id: "client",
                  label: "Client Work",
                  desc: "Commercial / Client Project",
                },
                {
                  id: "personal",
                  label: "Personal & AI Lab",
                  desc: "AI Experiments & Personal Projects",
                },
                {
                  id: "opensource",
                  label: "Open Source",
                  desc: "Public Open-Source Tool",
                },
              ].map((type) => (
                <div
                  key={type.id}
                  onClick={() => setProjectType(type.id as ProjectType)}
                  className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    projectType === type.id
                      ? "bg-primary/10 border-primary text-textPrimary ring-1 ring-primary/30"
                      : "bg-background border-border hover:border-border/80 text-textSecondary"
                  }`}
                >
                  <input
                    type="radio"
                    name="project_type"
                    value={type.id}
                    checked={projectType === type.id}
                    onChange={() => setProjectType(type.id as ProjectType)}
                    className="mt-0.5 accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold block text-textPrimary">
                      {type.label}
                    </span>
                    <span className="text-[11px] text-textSecondary block">
                      {type.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publishing & Visibility */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
              Publishing
            </h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <span className="text-xs font-semibold text-textPrimary block">
                  Published
                </span>
                <span className="text-[11px] text-textSecondary block">
                  Visible on live portfolio
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <span className="text-xs font-semibold text-textPrimary block">
                  Featured
                </span>
                <span className="text-[11px] text-textSecondary block">
                  Highlight at top of showcase
                </span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Tech Stack Picker */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-semibold text-textPrimary uppercase tracking-wider">
              Tech Stack
            </h3>
            <TechStackSelector
              availableTechStacks={availableTechStacks}
              selectedIds={selectedTechStackIds}
              onChange={setSelectedTechStackIds}
            />
          </div>

          {/* Action Buttons */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Publish Project"}</span>
            </button>

            <Link
              href="/dashboard/projects"
              className="w-full py-2.5 px-4 bg-background hover:bg-border text-textSecondary hover:text-textPrimary text-xs font-medium rounded-xl border border-border transition-all text-center block"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
