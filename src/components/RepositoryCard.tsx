import { Star, GitFork, ArrowUpRight, FolderGit2 } from 'lucide-react';
import type { GitHubRepository } from '@/types/github';

export default function RepositoryCard({ repo }: { repo: GitHubRepository }) {
  return (
    <div className="group bg-surface border border-border hover:border-primary/50 rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-background rounded-lg border border-border group-hover:border-primary/30 transition-colors">
            <FolderGit2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-base font-bold text-textPrimary group-hover:text-primary transition-colors line-clamp-1">
            {repo.name}
            {repo.fork && (
              <span className="ml-2 text-[10px] font-normal px-2 py-0.5 rounded-full bg-border text-textSecondary">
                Fork
              </span>
            )}
          </h3>
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-textSecondary hover:text-primary transition-colors p-1"
          aria-label={`View ${repo.name} on GitHub`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <p className="text-textSecondary text-xs leading-relaxed flex-grow mb-6 line-clamp-3">
        {repo.description || 'No description provided.'}
      </p>

      <div className="mt-auto space-y-4">
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="text-[10px] px-2 py-0.5 bg-background border border-border rounded-md text-textSecondary"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-textSecondary">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-textSecondary pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            {repo.language && (
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/80" />
                <span>{repo.language}</span>
              </div>
            )}
            {repo.stargazers_count > 0 && (
              <div className="flex items-center space-x-1 hover:text-primary transition-colors">
                <Star className="w-3.5 h-3.5" />
                <span>{repo.stargazers_count}</span>
              </div>
            )}
            {repo.forks_count > 0 && (
              <div className="flex items-center space-x-1 hover:text-primary transition-colors">
                <GitFork className="w-3.5 h-3.5" />
                <span>{repo.forks_count}</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-textSecondary">
            {new Date(repo.updated_at).toLocaleDateString(undefined, {
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
