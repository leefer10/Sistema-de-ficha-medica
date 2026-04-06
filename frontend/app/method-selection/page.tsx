'use client';

import { useRouter } from 'next/navigation';
import { MethodSelectionPage } from '@/components/MethodSelectionPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <MethodSelectionPage onNavigate={handleNavigate} />;
}
