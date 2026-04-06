'use client';

import { useRouter } from 'next/navigation';
import { OcrUploadPage } from '@/components/OcrUploadPage';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <OcrUploadPage onNavigate={handleNavigate} />;
}
