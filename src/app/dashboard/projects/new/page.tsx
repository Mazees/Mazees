import { getTechStacks } from '@/lib/supabase/techstack';
import ProjectForm from '@/components/dashboard/ProjectForm';

export default async function NewProjectPage() {
  const techStacks = await getTechStacks();

  return (
    <div className="max-w-5xl mx-auto">
      <ProjectForm availableTechStacks={techStacks} />
    </div>
  );
}
