import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/supabase/projects';
import { getTechStacks } from '@/lib/supabase/techstack';
import ProjectForm from '@/components/dashboard/ProjectForm';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, techStacks] = await Promise.all([
    getProjectById(id),
    getTechStacks(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <ProjectForm initialData={project} availableTechStacks={techStacks} />
    </div>
  );
}
