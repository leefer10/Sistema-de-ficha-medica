'use client';

import { useRouter } from 'next/navigation';
import { PersonalDataPage } from '@/components/PersonalDataPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <PersonalDataPage onNavigate={handleNavigate} />;
}
