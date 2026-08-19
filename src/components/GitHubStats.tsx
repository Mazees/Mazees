import { FolderGit2, Users, UserPlus, Star } from "lucide-react";
import type { GitHubProfile, GitHubRepository } from "@/lib/github";

export default function GitHubStats({ profile, repos }: { profile: GitHubProfile | null, repos: GitHubRepository[] }) {
  if (!profile) return null;

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  const stats = [
    { label: "Public Repos", value: profile.public_repos, icon: <FolderGit2 className="w-5 h-5 text-primary" /> },
    { label: "Total Stars", value: totalStars, icon: <Star className="w-5 h-5 text-primary" /> },
    { label: "Followers", value: profile.followers, icon: <Users className="w-5 h-5 text-primary" /> },
    { label: "Following", value: profile.following, icon: <UserPlus className="w-5 h-5 text-primary" /> },
  ];

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-xl font-bold text-textPrimary mb-8">GitHub Activity</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface border border-border p-6 rounded-xl flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-textSecondary text-sm font-medium">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-textPrimary">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
