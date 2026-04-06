'use client';

import { useRouter } from 'next/navigation';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <LandingPage onNavigate={handleNavigate} />;
}
