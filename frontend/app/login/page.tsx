'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '@/components/LoginPage';

export default function Login() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <LoginPage onNavigate={handleNavigate} />;
}
