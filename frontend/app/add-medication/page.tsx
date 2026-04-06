'use client';

import { useRouter } from 'next/navigation';
import { AddMedicationPage } from '@/components/AddMedicationPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddMedicationPage onNavigate={handleNavigate} />;
}
