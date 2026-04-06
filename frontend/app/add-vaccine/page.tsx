'use client';

import { useRouter } from 'next/navigation';
import { AddVaccinePage } from '@/components/AddVaccinePage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddVaccinePage onNavigate={handleNavigate} />;
}
