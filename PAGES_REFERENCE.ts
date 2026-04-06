// NEXT.JS PAGES TO CREATE - Copy these to their respective app/ subdirectories
// First, create the directories using: create_dirs.bat (already created)

// ============================================================
// 1. /app/register/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { RegisterPage } from '@/components/RegisterPage';

export default function Register() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <RegisterPage onNavigate={handleNavigate} />;
}

// ============================================================
// 2. /app/welcome/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { WelcomePage } from '@/components/WelcomePage';

export default function Welcome() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <WelcomePage onNavigate={handleNavigate} />;
}

// ============================================================
// 3. /app/personal-data/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { PersonalDataPage } from '@/components/PersonalDataPage';

export default function PersonalData() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <PersonalDataPage onNavigate={handleNavigate} />;
}

// ============================================================
// 4. /app/method-selection/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { MethodSelectionPage } from '@/components/MethodSelectionPage';

export default function MethodSelection() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <MethodSelectionPage onNavigate={handleNavigate} />;
}

// ============================================================
// 5. /app/dashboard/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { DashboardPage } from '@/components/DashboardPage';

export default function Dashboard() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <DashboardPage onNavigate={handleNavigate} />;
}

// ============================================================
// 6. /app/ocr-upload/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { OcrUploadPage } from '@/components/OcrUploadPage';

export default function OcrUpload() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <OcrUploadPage onNavigate={handleNavigate} />;
}

// ============================================================
// 7. /app/manual-form/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { ManualFormPage } from '@/components/ManualFormPage';

export default function ManualForm() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <ManualFormPage onNavigate={handleNavigate} />;
}

// ============================================================
// 8. /app/success/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { SuccessPage } from '@/components/SuccessPage';

export default function Success() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <SuccessPage onNavigate={handleNavigate} />;
}

// ============================================================
// 9. /app/medical-history/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { MedicalHistoryPage } from '@/components/MedicalHistoryPage';

export default function MedicalHistory() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <MedicalHistoryPage onNavigate={handleNavigate} />;
}

// ============================================================
// 10. /app/medical-record-detail/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { MedicalRecordDetailPage } from '@/components/MedicalRecordDetailPage';

export default function MedicalRecordDetail() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <MedicalRecordDetailPage onNavigate={handleNavigate} />;
}

// ============================================================
// 11. /app/generate-qr/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { GenerateQRPage } from '@/components/GenerateQRPage';

export default function GenerateQR() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <GenerateQRPage onNavigate={handleNavigate} />;
}

// ============================================================
// 12. /app/settings/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { SettingsPage } from '@/components/SettingsPage';

export default function Settings() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <SettingsPage onNavigate={handleNavigate} />;
}

// ============================================================
// 13. /app/add-consultation/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { AddConsultationPage } from '@/components/AddConsultationPage';

export default function AddConsultation() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <AddConsultationPage onNavigate={handleNavigate} />;
}

// ============================================================
// 14. /app/edit-medical-record/page.tsx
// ============================================================
'use client';

import { useRouter } from 'next/navigation';
import { EditMedicalRecordPage } from '@/components/EditMedicalRecordPage';

export default function EditMedicalRecord() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <EditMedicalRecordPage onNavigate={handleNavigate} />;
}
