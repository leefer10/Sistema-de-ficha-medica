'use client';

import { useRouter } from 'next/navigation';
import { SettingsPage } from '@/components/SettingsPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <SettingsPage onNavigate={handleNavigate} />;
}
