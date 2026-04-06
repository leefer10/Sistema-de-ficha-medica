'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { EditVaccinePage } from '@/components/EditVaccinePage';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vaccineId = searchParams.get('id') || '';
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <EditVaccinePage vaccineId={vaccineId} onNavigate={handleNavigate} />;
}
