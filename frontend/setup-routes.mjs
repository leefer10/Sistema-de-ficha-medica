const fs = require('fs');
const path = require('path');

// Ejecutar el setup automáticamente cuando se carga
const baseDir = path.join(__dirname, 'frontend', 'app');
const routes = [
  { name: 'register', component: 'RegisterPage' },
  { name: 'welcome', component: 'WelcomePage' },
  { name: 'personal-data', component: 'PersonalDataPage' },
  { name: 'method-selection', component: 'MethodSelectionPage' },
  { name: 'dashboard', component: 'DashboardPage' },
  { name: 'ocr-upload', component: 'OcrUploadPage' },
  { name: 'manual-form', component: 'ManualFormPage' },
  { name: 'success', component: 'SuccessPage' },
  { name: 'medical-history', component: 'MedicalHistoryPage' },
  { name: 'medical-record-detail', component: 'MedicalRecordDetailPage' },
  { name: 'generate-qr', component: 'GenerateQRPage' },
  { name: 'settings', component: 'SettingsPage' },
  { name: 'add-consultation', component: 'AddConsultationPage' },
  { name: 'edit-medical-record', component: 'EditMedicalRecordPage' },
];

function generatePageContent(componentName) {
  return `'use client';

import { useRouter } from 'next/navigation';
import { ${componentName} } from '@/components/${componentName}';

export default function Page() {
  const router = useRouter();
  
  const handleNavigate = (path: string) => {
    router.push(path);
  };
  
  return <${componentName} onNavigate={handleNavigate} />;
}
`;
}

console.log('Starting route creation...');

let created = 0;
routes.forEach((route) => {
  const routeDir = path.join(baseDir, route.name);
  const pageFile = path.join(routeDir, 'page.tsx');
  
  try {
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    if (!fs.existsSync(pageFile)) {
      const content = generatePageContent(route.component);
      fs.writeFileSync(pageFile, content, 'utf8');
      console.log(`✅ ${route.name}`);
      created++;
    }
  } catch (e) {
    console.error(`❌ ${route.name}: ${e.message}`);
  }
});

console.log(`\nComplete! Created ${created}/${routes.length} routes.`);
