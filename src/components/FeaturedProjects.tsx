import ProjectCard from './ProjectCard';
import type { Project } from '@/types/project';
import { Star } from 'lucide-react';

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 border-t border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-xs text-yellow-400 mb-3">
            <Star className="w-3 h-3 fill-yellow-400" />
            <span>Spotlight</span>
          </div>
          <h2 className="text-3xl font-bold text-textPrimary">Featured Highlights</h2>
          <p className="text-textSecondary mt-2 text-sm max-w-xl">
            Selected spotlight projects showcasing AI architecture and full-stack engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-yellow-500/10 to-primary-dark/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative h-full bg-background rounded-2xl">
                <ProjectCard project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
