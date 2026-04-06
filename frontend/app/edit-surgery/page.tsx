'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { EditSurgeryPage } from '@/components/EditSurgeryPage';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const surgeryId = searchParams.get('id') || '';
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <EditSurgeryPage surgeryId={surgeryId} onNavigate={handleNavigate} />;
}
