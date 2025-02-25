'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login');
    }
  }, [session, loading, router]);

  // 認証またはプロファイル読み込み中はローディング表示
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
} 