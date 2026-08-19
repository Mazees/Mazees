import Link from "next/link";
import { ArrowRight, GitFork } from "lucide-react";
import RepositoryCard from "./RepositoryCard";
import type { GitHubRepository } from "@/types/github";

export default function RepositoriesPreview({
  repos,
}: {
  repos: GitHubRepository[];
}) {
  // Sort by stargazers count then recent update to get top 6
  const topRepos = [...repos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    })
    .slice(0, 6);

  return (
    <section
      className="pb-24 pt-28 border-t border-border bg-surface/20"
      id="repositories-preview"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
              // 05 · Open Source
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
              My Open-Source Repositories
            </h2>
          </div>

          <Link
            href="/repositories"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-surface hover:bg-border border border-border text-sm font-semibold text-textPrimary hover:text-primary transition-all self-start md:self-auto group"
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
      </div>
    </section>
  );
}
