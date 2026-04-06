'use client';

import { useRouter } from 'next/navigation';
import { RegisterPage } from '@/components/RegisterPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <RegisterPage onNavigate={handleNavigate} />;
}
