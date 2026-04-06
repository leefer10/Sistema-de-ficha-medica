'use client';

import { useRouter } from 'next/navigation';
import { ManualFormPage } from '@/components/ManualFormPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <ManualFormPage onNavigate={handleNavigate} />;
}
