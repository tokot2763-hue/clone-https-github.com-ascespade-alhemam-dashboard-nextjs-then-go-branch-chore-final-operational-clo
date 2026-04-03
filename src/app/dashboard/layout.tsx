import { redirect } from 'next/navigation';
import { getSession } from '@/platform/auth';
import Sidebar from '@/ui/layouts/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-neutral-900">
      <Sidebar user={session.user} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
