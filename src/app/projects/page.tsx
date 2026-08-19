import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getPublishedProjects } from '@/lib/supabase/projects';
import Navbar from '@/components/Navbar';
import ProjectShowcase from '@/components/ProjectShowcase';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Projects — Mada Putra Adhadriyanto',
  description:
    'Explore custom software projects, AI agents, developer tools, and web applications built by Mada Putra Adhadriyanto.',
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

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
            <span className="text-textPrimary font-medium">Projects</span>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-8 md:p-12 mb-12">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-0" />
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Showcase Portfolio</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-textPrimary tracking-tight">
                All Projects
              </h1>
              <p className="text-textSecondary text-sm md:text-base leading-relaxed">
                A curated archive of production applications, AI agent systems, developer libraries, and web experiments created with modern engineering practices.
              </p>
            </div>
          </div>
        </div>

        <ProjectShowcase projects={projects} />
      </div>

      <Footer />
    </main>
  );
}
