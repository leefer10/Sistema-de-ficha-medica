'use client';

import { useRouter } from 'next/navigation';
import { WelcomePage } from '@/components/WelcomePage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <WelcomePage onNavigate={handleNavigate} />;
}
