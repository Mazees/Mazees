"use client";

import { useState, useMemo } from "react";
import { Search, Filter, ArrowDownWideNarrow, GitFork } from "lucide-react";
import RepositoryCard from "./RepositoryCard";
import type { GitHubRepository } from "@/types/github";

export default function RepositoryExplorer({
  repos,
}: {
  repos: GitHubRepository[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Updated");

  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) langs.add(repo.language);
    });
    return ["All", ...Array.from(langs).sort()];
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    let result = repos;

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (repo) =>
          repo.name.toLowerCase().includes(q) ||
          (repo.description && repo.description.toLowerCase().includes(q)) ||
          (repo.topics &&
            repo.topics.some((t) => t.toLowerCase().includes(q))) ||
          (repo.language && repo.language.toLowerCase().includes(q)),
      );
    }

    // Filter by language
    if (selectedLanguage !== "All") {
      result = result.filter((repo) => repo.language === selectedLanguage);
    }

    // Sort
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "Recently Updated":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "Recently Created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "Most Stars":
          return b.stargazers_count - a.stargazers_count;
        case "Most Forks":
          return b.forks_count - a.forks_count;
        case "Alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  return (
    <section className="pb-24 pt-28 border-t border-border" id="repositories">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs text-primary mb-3">
            <GitFork className="w-3.5 h-3.5" />
            <span>Open Source</span>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary">
            Explore My Repository
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-textSecondary" />
            </div>
            <input
              type="text"
              placeholder="Search repositories by name, language, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative flex-shrink-0 min-w-[150px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-textSecondary" />
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full pl-9 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm text-textPrimary appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "All" ? "All Languages" : lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-shrink-0 min-w-[180px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <ArrowDownWideNarrow className="h-4 w-4 text-textSecondary" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-9 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm text-textPrimary appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                <option value="Recently Updated">Recently Updated</option>
                <option value="Recently Created">Recently Created</option>
                <option value="Most Stars">Most Stars</option>
                <option value="Most Forks">Most Forks</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6 text-xs text-textSecondary">
          <div>
            Showing {filteredAndSortedRepos.length} of {repos.length}{" "}
            repositories
          </div>
        </div>

        {filteredAndSortedRepos.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedRepos.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-2xl">
            <p className="text-sm text-textSecondary">
              No repositories found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("All");
              }}
              className="mt-3 text-xs text-primary hover:underline font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
