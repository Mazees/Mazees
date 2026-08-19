import { getAllProjects } from '@/lib/supabase/projects';
import ProjectListManager from '@/components/dashboard/ProjectListManager';

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="max-w-6xl mx-auto">
      <ProjectListManager initialProjects={projects} />
    </div>
  );
}
