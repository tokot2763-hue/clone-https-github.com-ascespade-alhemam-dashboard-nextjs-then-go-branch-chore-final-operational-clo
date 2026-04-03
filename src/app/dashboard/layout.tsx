import { getSession } from '@/platform/auth';
import { buildNavTree, type NavTree } from '@/platform/nav-engine';
import Sidebar from '@/ui/layouts/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  let navTree: NavTree = { sections: [] };
  
  try {
    session = await getSession();
    if (session) {
      navTree = await buildNavTree(session.user.id, session.user.role_code || 'guest');
    }
  } catch (error) {
    console.error('Dashboard layout error:', error);
  }

  return (
    <div className="flex min-h-screen bg-neutral-900">
      {session ? (
        <Sidebar 
          user={session.user} 
          navTree={navTree} 
        />
      ) : (
        <Sidebar 
          user={{ id: 'guest', email: 'guest@alhemam.sa', full_name: 'Guest', role_code: 'guest', role_name: 'Guest' }} 
          navTree={navTree} 
        />
      )}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
