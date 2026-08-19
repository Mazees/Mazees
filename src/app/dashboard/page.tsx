import Link from 'next/link';
import { getAllProjects } from '@/lib/supabase/projects';
import { getTechStacks } from '@/lib/supabase/techstack';
import { getGitHubRepositories } from '@/lib/github';
import {
  FolderKanban,
  Cpu,
  Star,
  Eye,
  Plus,
  ArrowUpRight,
  GitFork,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default async function DashboardPage() {
  const [projects, techStacks, githubRepos] = await Promise.all([
    getAllProjects(),
    getTechStacks(),
    getGitHubRepositories(),
  ]);

  const publishedCount = projects.filter((p) => p.is_published).length;
  const featuredCount = projects.filter((p) => p.is_featured).length;

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      subtitle: `${publishedCount} published, ${projects.length - publishedCount} draft`,
      icon: FolderKanban,
      color: 'text-primary',
      bgColor: 'bg-primary/10 border-primary/20',
    },
    {
      title: 'Featured Projects',
      value: featuredCount,
      subtitle: 'Highlighted on showcase',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      title: 'Tech Stack',
      value: techStacks.length,
      subtitle: 'Managed technologies',
      icon: Cpu,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'GitHub Repos',
      value: githubRepos.length,
      subtitle: 'Synced via GitHub API',
      icon: GitFork,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-border p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Control Center</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">
              Welcome back, Mada
            </h2>
            <p className="text-textSecondary text-sm max-w-xl">
              Manage your custom portfolio projects, demo links, tech stacks, and live showcase easily.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>
            <Link
              href="/dashboard/techstack"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-surface hover:bg-border border border-border text-textPrimary rounded-xl text-sm font-medium transition-all"
            >
              <Cpu className="w-4 h-4 text-primary" />
              <span>Manage Tech Stack</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-5 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4 hover:border-border/80 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-textSecondary uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-textPrimary tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-textSecondary mt-1">
                  {stat.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 rounded-2xl bg-surface border border-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-textPrimary">
                Recent Projects
              </h3>
              <p className="text-xs text-textSecondary mt-0.5">
                Custom showcase projects stored in Supabase
              </p>
            </div>
            <Link
              href="/dashboard/projects"
              className="text-xs text-primary hover:text-primary-light font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <FolderKanban className="w-8 h-8 text-textSecondary mx-auto mb-3 opacity-50" />
              <p className="text-sm text-textSecondary">
                No custom projects created yet.
              </p>
              <Link
                href="/dashboard/projects/new"
                className="mt-4 inline-flex items-center space-x-2 text-xs text-primary hover:underline font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create your first project</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-10 h-10 rounded-lg object-cover border border-border shrink-0 bg-background"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-textPrimary truncate">
                          {project.title}
                        </h4>
                        {project.is_featured && (
                          <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-medium shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {project.is_published ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] text-textSecondary">
                            <Clock className="w-3 h-3" />
                            <span>Draft</span>
                          </span>
                        )}
                        {project.tech_stacks && project.tech_stacks.length > 0 && (
                          <span className="text-[11px] text-textSecondary truncate">
                            · {project.tech_stacks.map((t) => t.name).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-background hover:bg-border text-textPrimary border border-border transition-colors shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack Breakdown */}
        <div className="rounded-2xl bg-surface border border-border p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-textPrimary">Tech Stack</h3>
                <p className="text-xs text-textSecondary mt-0.5">
                  Categorized skills
                </p>
              </div>
              <Link
                href="/dashboard/techstack"
                className="text-xs text-primary hover:text-primary-light font-medium"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-2">
              {['frontend', 'backend', 'ai', 'desktop', 'infrastructure'].map(
                (category) => {
                  const count = techStacks.filter(
                    (t) => t.category === category
                  ).length;
                  return (
                    <div
                      key={category}
                      className="p-3 rounded-xl bg-background/60 border border-border/60 flex items-center justify-between text-xs"
                    >
                      <span className="capitalize font-medium text-textPrimary">
                        {category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-textSecondary font-mono border border-border/50">
                        {count} items
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-surface hover:bg-background border border-border hover:border-primary text-textPrimary text-xs font-medium transition-all group"
            >
              <Eye className="w-4 h-4 text-primary" />
              <span>Preview Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
