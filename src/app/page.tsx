import { getGitHubProfile, getGitHubRepositories } from "@/lib/github";
import { getPublishedProjects } from "@/lib/supabase/projects";
import { getTechStacks } from "@/lib/supabase/techstack";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ClientProjectsPreview from "@/components/ClientProjectsPreview";
import ProjectsPreview from "@/components/ProjectsPreview";
import RepositoriesPreview from "@/components/RepositoriesPreview";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import InteractiveTour from "@/components/InteractiveTour";

export const revalidate = 60;

export default async function Home() {
  const [profile, repos, projects, techStacks] = await Promise.all([
    getGitHubProfile(),
    getGitHubRepositories(),
    getPublishedProjects(),
    getTechStacks(),
  ]);

  return (
    <main className="min-h-screen bg-background font-sans text-textPrimary selection:bg-primary/30 selection:text-primary-light">
      <Navbar />
      <Hero avatarUrl={profile?.avatar_url} />
      <About />
      <ProjectsPreview projects={projects} />
      <ClientProjectsPreview projects={projects} />
      <TechStack techStacks={techStacks} />
      <RepositoriesPreview repos={repos} />
      <Contact />
      <Footer />
      <InteractiveTour />
    </main>
  );
}
