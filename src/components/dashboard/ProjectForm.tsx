'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Globe, Sparkles } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import TechStackSelector from './TechStackSelector';
import MarkdownEditor from './MarkdownEditor';
import type { Project, ProjectInsert } from '@/types/project';
import type { TechStack } from '@/types/techstack';
import { createProjectAction, updateProjectAction } from '@/lib/actions/projects';

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

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [longDescription, setLongDescription] = useState(
    initialData?.long_description || ''
  );

  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image_url || null
  );
  const [demoUrl, setDemoUrl] = useState(initialData?.demo_url || '');
  const [repoUrl, setRepoUrl] = useState(initialData?.repo_url || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.is_published : true
  );
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 0);

  const [selectedTechStackIds, setSelectedTechStackIds] = useState<string[]>(
    initialData?.tech_stacks?.map((t) => t.id) || []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto generate slug from title if user hasn't typed a custom slug
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing || !slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: ProjectInsert = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      long_description: longDescription.trim() || null,
      image_url: imageUrl,
      demo_url: demoUrl.trim() || null,
      repo_url: repoUrl.trim() || null,
      is_featured: isFeatured,
      is_published: isPublished,
      order_index: Number(orderIndex) || 0,
    };

    if (isEditing && initialData) {
      const res = await updateProjectAction(
        initialData.id,
        payload,
        selectedTechStackIds,
        initialData.image_url
      );
      if (res.success) {
        router.push('/dashboard/projects');
        router.refresh();
      } else {
        setError(res.error || 'Failed to update project');
        setLoading(false);
      }
    } else {
      const res = await createProjectAction(payload, selectedTechStackIds);
      if (res.success) {
        router.push('/dashboard/projects');
        router.refresh();
      } else {
        setError(res.error || 'Failed to create project');
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
              {isEditing ? `Edit: ${initialData?.title}` : 'Create New Project'}
            </h2>
            <p className="text-xs text-textSecondary">
              {isEditing
                ? 'Update project details, links, and media'
                : 'Add a new showcase project to your portfolio'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                placeholder="e.g. MARK Agent Ecosystem"
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
                placeholder="e.g. mark-agent-ecosystem"
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
                placeholder="A concise summary of what this project does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                Cover Image
              </label>
              <ImageUploader value={imageUrl} onChange={setImageUrl} />
            </div>

            {/* Markdown Full Description with Visual Toolbar */}
            <div>
              <label className="block text-xs font-medium text-textSecondary mb-2 uppercase tracking-wider">
                Full Description (Markdown Supported)
              </label>
              <MarkdownEditor
                value={longDescription}
                onChange={setLongDescription}
                placeholder="Write detailed documentation, architecture diagrams, key features, and code samples..."
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
                  Live Demo URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-textSecondary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://myproject.com"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                  Repository URL
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
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar settings (Right 1 col) */}
        <div className="space-y-6">
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

            <div>
              <label className="block text-xs font-medium text-textSecondary mb-1.5 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-background border border-border rounded-xl text-xs text-textPrimary focus:outline-none focus:border-primary transition-all"
              />
              <span className="text-[10px] text-textSecondary mt-1 block">
                Lower numbers appear first
              </span>
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
              <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
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
