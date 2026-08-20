"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, FolderKanban } from "lucide-react";
import ProjectCard from "./ProjectCard";
import type { Project, ProjectType } from "@/types/project";

type FilterType = "all" | "client" | "personal" | "opensource";

export default function ProjectShowcase({
  projects,
  isDedicatedPage = false,
}: {
  projects: Project[];
  isDedicatedPage?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState("All");
  const [selectedType, setSelectedType] = useState<FilterType>("all");

  useEffect(() => {
    const handleMarkFilter = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      if (customEvent.detail?.query) {
        const q = customEvent.detail.query.toLowerCase();
        if (q === "client" || q === "personal" || q === "opensource" || q === "all") {
          setSelectedType(q as FilterType);
        } else {
          setSearchQuery(customEvent.detail.query);
        }
      }
    };
    window.addEventListener("mark-filter-projects", handleMarkFilter);
    return () => {
      window.removeEventListener("mark-filter-projects", handleMarkFilter);
    };
  }, []);

  // Extract all unique tech stack names present across projects
  const availableTechs = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.tech_stacks?.forEach((t) => {
        if (t.name) techSet.add(t.name);
      });
    });
    return ["All", ...Array.from(techSet).sort()];
  }, [projects]);

  // Count items per project type
  const typeCounts = useMemo(() => {
    return {
      all: projects.length,
      client: projects.filter((p) => p.project_type === "client").length,
      personal: projects.filter(
        (p) => !p.project_type || p.project_type === "personal",
      ).length,
      opensource: projects.filter((p) => p.project_type === "opensource")
        .length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const list = projects.filter((project) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(q) ||
        (project.description &&
          project.description.toLowerCase().includes(q)) ||
        project.tech_stacks?.some((t) => t.name.toLowerCase().includes(q));

      const matchesTech =
        selectedTech === "All" ||
        project.tech_stacks?.some((t) => t.name === selectedTech);

      const matchesType =
        selectedType === "all" ||
        (selectedType === "client" && project.project_type === "client") ||
        (selectedType === "opensource" &&
          project.project_type === "opensource") ||
        (selectedType === "personal" &&
          (!project.project_type || project.project_type === "personal"));

      return matchesSearch && matchesTech && matchesType;
    });

    // Ensure featured projects are displayed first
    return list.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (a.order_index ?? 0) - (b.order_index ?? 0);
    });
  }, [projects, searchQuery, selectedTech, selectedType]);

  return (
    <section
      className={`${isDedicatedPage ? "pt-2 pb-16" : "pb-24 pt-28 border-t border-border"}`}
      id="projects"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10" data-aos="fade-up">
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
            // Portfolio Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
            Featured Projects & Case Studies
          </h2>
        </div>

        {/* Project Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-border/80 pb-4" data-aos="fade-up" data-aos-delay="50">
          {[
            { id: "all", label: "All Projects", count: typeCounts.all },
            { id: "client", label: "Client Work", count: typeCounts.client },
            {
              id: "personal",
              label: "Personal & AI Lab",
              count: typeCounts.personal,
            },
            {
              id: "opensource",
              label: "Open Source",
              count: typeCounts.opensource,
            },
          ].map((tab) => {
            if (tab.id !== "all" && tab.count === 0) return null;
            const isActive = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as FilterType)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-surface hover:bg-surface/80 border border-border text-textSecondary hover:text-textPrimary"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                    isActive
                      ? "bg-black/20 text-white"
                      : "bg-background text-textSecondary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls: Search and Tech Stack */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10" data-aos="fade-up" data-aos-delay="100">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-textSecondary" />
            </div>
            <input
              type="text"
              placeholder="Search projects by name, description, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
            />
          </div>

          {availableTechs.length > 1 && (
            <div className="relative shrink-0 min-w-[180px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-textSecondary" />
              </div>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="block w-full pl-10 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm text-textPrimary appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer font-medium"
              >
                {availableTechs.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech === "All" ? "All Tech Stacks" : tech}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                data-aos="fade-up"
                data-aos-delay={80 + (index % 3) * 60}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-2xl">
            <FolderKanban className="w-10 h-10 text-textSecondary mx-auto mb-3 opacity-40" />
            <p className="text-sm text-textSecondary">
              {projects.length === 0
                ? "No projects in showcase yet."
                : "No projects found matching your search or filters."}
            </p>
            {searchQuery || selectedTech !== "All" || selectedType !== "all" ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTech("All");
                  setSelectedType("all");
                }}
                className="mt-3 text-xs text-primary hover:underline font-semibold"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
