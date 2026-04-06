'use client';

import { useRouter } from 'next/navigation';
import { MedicalHistoryPage } from '@/components/MedicalHistoryPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <MedicalHistoryPage onNavigate={handleNavigate} />;
}
