'use client';

import { useRouter } from 'next/navigation';
import { AddSurgeryPage } from '@/components/AddSurgeryPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddSurgeryPage onNavigate={handleNavigate} />;
}
