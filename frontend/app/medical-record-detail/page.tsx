'use client';

import { useRouter } from 'next/navigation';
import { MedicalRecordDetailPage } from '@/components/MedicalRecordDetailPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <MedicalRecordDetailPage onNavigate={handleNavigate} />;
}
