import type { Metadata } from 'next';
import Link from 'next/link';
import { GitFork, Star, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { getGitHubRepositories, getGitHubProfile } from '@/lib/github';
import Navbar from '@/components/Navbar';
import RepositoryExplorer from '@/components/RepositoryExplorer';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Repositories — Mada Putra Adhadriyanto',
  description:
    'Browse all open source repositories, experiments, and libraries maintained by @Mazees on GitHub.',
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

      <div className="pt-32 pb-16 flex-1">
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="flex items-center space-x-2 text-xs text-textSecondary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-textPrimary font-medium">Repositories</span>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-8 md:p-12 mb-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                  <GitFork className="w-3.5 h-3.5" />
                  <span>GitHub Ecosystem</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-textPrimary tracking-tight">
                  GitHub Repositories
                </h1>
                <p className="text-textSecondary text-sm md:text-base leading-relaxed">
                  Direct sync with <span className="text-primary font-mono font-medium">@Mazees</span> GitHub profile. Search and filter through all {repos.length} open-source repositories.
                </p>
              </div>

              <a
                href="https://github.com/Mazees"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-all shadow-lg shadow-primary/20 shrink-0 self-start md:self-auto"
              >
                <FaGithub className="w-4 h-4" />
                <span>Visit GitHub Profile</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border">
              <span className="text-[11px] uppercase tracking-wider text-textSecondary block">
                Total Repos
              </span>
              <span className="text-2xl font-bold text-textPrimary mt-1 block">
                {repos.length}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border">
              <span className="text-[11px] uppercase tracking-wider text-textSecondary block">
                Total Stars
              </span>
              <span className="text-2xl font-bold text-yellow-400 mt-1 flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>{totalStars}</span>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border">
              <span className="text-[11px] uppercase tracking-wider text-textSecondary block">
                Total Forks
              </span>
              <span className="text-2xl font-bold text-textPrimary mt-1 block">
                {totalForks}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border">
              <span className="text-[11px] uppercase tracking-wider text-textSecondary block">
                Followers
              </span>
              <span className="text-2xl font-bold text-primary mt-1 block">
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
