import { getTechStacks } from '@/lib/supabase/techstack';
import TechStackManager from '@/components/dashboard/TechStackManager';

export default async function TechStackPage() {
  const techStacks = await getTechStacks();

  return (
    <div className="max-w-6xl mx-auto">
      <TechStackManager initialTechStacks={techStacks} />
    </div>
  );
}
