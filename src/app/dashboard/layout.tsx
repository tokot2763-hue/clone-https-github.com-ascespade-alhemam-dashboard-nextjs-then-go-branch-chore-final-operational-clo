import { getSession } from '@/platform/auth';
import Sidebar from '@/ui/layouts/Sidebar';
import { cookies } from 'next/headers';

interface NavPage {
  id: string;
  name: string;
  path: string;
  icon: string | null;
  sort_order: number;
}

interface NavSection {
  id: string;
  name: string;
  code: string;
  icon: string | null;
  sort_order: number;
  pages: NavPage[];
}

interface NavTree {
  sections: NavSection[];
}

async function getNavTree(locale: string = 'ar'): Promise<NavTree> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clone-https-github-com-ascespade-alhemam-dashboard-nextjs-6221.d.kiloapps.io';
  
  try {
    const response = await fetch(`${baseUrl}/api/v1/nav?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('nav API error:', response.status);
      return { sections: [] };
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('nav fetch error:', error);
    return { sections: [] };
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('alhemam_locale')?.value || 'ar';
  const session = await getSession();
  const navTree = session ? await getNavTree(locale) : { sections: [] };

  return (
    <div className="flex min-h-screen dark:bg-neutral-900 bg-gray-50">
      {session ? (
        <Sidebar 
          user={session.user} 
          navTree={navTree} 
        />
      ) : (
        <Sidebar 
          user={{ id: 'guest', email: 'guest@alhemam.sa', full_name: 'زائر', role_code: 'guest', role_name: 'زائر' }} 
          navTree={navTree} 
        />
      )}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}