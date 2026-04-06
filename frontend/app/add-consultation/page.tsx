'use client';

import { useRouter } from 'next/navigation';
import { AddConsultationPage } from '@/components/AddConsultationPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddConsultationPage onNavigate={handleNavigate} />;
}
