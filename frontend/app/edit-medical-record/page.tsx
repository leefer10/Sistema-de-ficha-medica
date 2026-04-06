'use client';

import { useRouter } from 'next/navigation';
import { EditMedicalRecordPage } from '@/components/EditMedicalRecordPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <EditMedicalRecordPage onNavigate={handleNavigate} />;
}
