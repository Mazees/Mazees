import type { Metadata } from 'next';
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

      <div className="pt-28 pb-16 flex-1">
        <ProjectShowcase projects={projects} isDedicatedPage />
      </div>

      <Footer />
    </main>
  );
}
