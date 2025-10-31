'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/PublicPortal/LandingPage';
import { useSession } from 'next-auth/react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return null;
  }

  return <LandingPage />;
}
