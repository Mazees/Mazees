'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, FolderKanban } from 'lucide-react';
import ProjectCard from './ProjectCard';
import type { Project } from '@/types/project';

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');

  // Extract all unique tech stack names present across projects
  const availableTechs = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.tech_stacks?.forEach((t) => {
        if (t.name) techSet.add(t.name);
      });
    });
    return ['All', ...Array.from(techSet).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        project.title.toLowerCase().includes(q) ||
        (project.description && project.description.toLowerCase().includes(q)) ||
        project.tech_stacks?.some((t) => t.name.toLowerCase().includes(q));

      const matchesTech =
        selectedTech === 'All' ||
        project.tech_stacks?.some((t) => t.name === selectedTech);

      return matchesSearch && matchesTech;
    });
  }, [projects, searchQuery, selectedTech]);

  return (
    <section className="py-24 border-t border-border" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-border bg-surface/50 text-xs text-primary mb-3">
            <span>Portfolio Showcase</span>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary">Featured Projects</h2>
          <p className="text-textSecondary mt-2 text-sm max-w-xl">
            Selected software products, AI agents, and web applications built with full-stack technologies.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
                className="block w-full pl-10 pr-8 py-2.5 bg-surface border border-border rounded-xl text-sm text-textPrimary appearance-none focus:outline-none focus:border-primary transition-all cursor-pointer"
              >
                {availableTechs.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech === 'All' ? 'All Tech Stacks' : tech}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-2xl">
            <FolderKanban className="w-10 h-10 text-textSecondary mx-auto mb-3 opacity-40" />
            <p className="text-sm text-textSecondary">
              {projects.length === 0
                ? 'No projects in showcase yet.'
                : 'No projects found matching your search or filters.'}
            </p>
            {searchQuery || selectedTech !== 'All' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTech('All');
                }}
                className="mt-3 text-xs text-primary hover:underline font-medium"
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
