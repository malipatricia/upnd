'use client';

import AppSidebar from '@/components/Layout/appSidebar';
import Header from '@/components/Layout/Header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin');
  }, [status, router]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return null;

  return <div className="bg-muted">
    <SidebarProvider>
      <AppSidebar />
      <main className=" sm:p-6 w-full">
        <div className="sm:grid sm:grid-cols-12 items-center bg-background p-2 rounded-lg">
          <div className="sm:col-span-11">
          <Header/></div>
          <div className="sm:col-span-1">
          <SidebarTrigger /></div></div>
        {children}
      </main>
    </SidebarProvider>
    </div>
}
