'use client';

import { useRouter } from 'next/navigation';
import { AddHabitsPage } from '@/components/AddHabitsPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddHabitsPage onNavigate={handleNavigate} />;
}
