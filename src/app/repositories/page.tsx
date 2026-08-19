import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { getGitHubRepositories, getGitHubProfile } from '@/lib/github';
import Navbar from '@/components/Navbar';
import GitHubContributionGraph from '@/components/GitHubContributionGraph';
import RepositoryExplorer from '@/components/RepositoryExplorer';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Repositories — Mada Putra Adhadriyanto',
  description:
    'Browse all open source repositories, contribution heatmap, and developer libraries maintained by @Mazees on GitHub.',
};

export const revalidate = 3600;

export default async function RepositoriesPage() {
  const [repos, profile] = await Promise.all([
    getGitHubRepositories(),
    getGitHubProfile(),
  ]);

  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);

  return (
    <main className="min-h-screen bg-background font-sans text-textPrimary flex flex-col justify-between">
      <Navbar />

      <div className="pt-28 pb-16 flex-1">
        <div className="max-w-7xl mx-auto px-6 mb-10 space-y-6">
          {/* GitHub Contributions in the Last Year */}
          <div data-aos="fade-up">
            <GitHubContributionGraph username="Mazees" />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" data-aos="fade-up" data-aos-delay="100">
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-textSecondary block">
                Public Repos
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-textPrimary mt-1.5 block">
                {repos.length}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-textSecondary block">
                Total Stars
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mt-1.5 flex items-center space-x-1.5">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span>{totalStars}</span>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-textSecondary block">
                Total Forks
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-textPrimary mt-1.5 block">
                {totalForks}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-textSecondary block">
                Followers
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-primary mt-1.5 block">
                {profile?.followers || 0}
              </span>
            </div>
          </div>
        </div>

        <RepositoryExplorer repos={repos} />
      </div>

      <Footer />
    </main>
  );
}
