import Link from 'next/link';
import { ArrowRight, GitFork } from 'lucide-react';
import RepositoryCard from './RepositoryCard';
import type { GitHubRepository } from '@/types/github';

export default function RepositoriesPreview({ repos }: { repos: GitHubRepository[] }) {
  // Sort by stargazers count then recent update to get top 6
  const topRepos = [...repos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    })
    .slice(0, 6);

  return (
    <section className="py-24 border-t border-border bg-surface/20" id="repositories-preview">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs text-primary mb-3">
              <GitFork className="w-3.5 h-3.5" />
              <span>Open Source</span>
            </div>
            <h2 className="text-3xl font-bold text-textPrimary">Recent Repositories</h2>
            <p className="text-textSecondary mt-2 text-sm max-w-xl">
              Public open-source codebases and experiments fetched live from GitHub.
            </p>
          </div>

          <Link
            href="/repositories"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-border border border-border text-sm font-medium text-textPrimary hover:text-primary transition-all self-start md:self-auto group"
          >
            <span>Explore All Repositories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {topRepos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRepos.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-dashed border-border rounded-2xl">
            <p className="text-sm text-textSecondary">
              No repositories available right now.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/repositories"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-surface hover:bg-border border border-border text-textPrimary hover:text-primary text-sm font-medium transition-all"
          >
            <span>View All {repos.length} Repositories with Filters & Search</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
