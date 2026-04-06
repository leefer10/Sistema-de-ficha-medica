'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { EditMedicationPage } from '@/components/EditMedicationPage';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const medicationId = searchParams.get('id') || '';
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <EditMedicationPage medicationId={medicationId} onNavigate={handleNavigate} />;
}
