'use client';

import { useRouter } from 'next/navigation';
import { AddEmergencyContactPage } from '@/components/AddEmergencyContactPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddEmergencyContactPage onNavigate={handleNavigate} />;
}
