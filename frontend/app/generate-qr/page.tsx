'use client';

import { useRouter } from 'next/navigation';
import { GenerateQRPage } from '@/components/GenerateQRPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <GenerateQRPage onNavigate={handleNavigate} />;
}
