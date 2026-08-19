import { createClient } from '@/lib/supabase/server';
import DashboardClientLayout from '@/components/dashboard/DashboardClientLayout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardClientLayout userEmail={user?.email}>
      {children}
    </DashboardClientLayout>
  );
}
