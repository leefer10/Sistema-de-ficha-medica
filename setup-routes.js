const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend', 'app');

// Routes to create
const routes = [
  {
    name: 'register',
    component: 'RegisterPage'
  },
  {
    name: 'welcome',
    component: 'WelcomePage'
  },
  {
    name: 'personal-data',
    component: 'PersonalDataPage'
  },
  {
    name: 'method-selection',
    component: 'MethodSelectionPage'
  },
  {
    name: 'dashboard',
    component: 'DashboardPage'
  },
  {
    name: 'ocr-upload',
    component: 'OcrUploadPage'
  },
  {
    name: 'manual-form',
    component: 'ManualFormPage'
  },
  {
    name: 'success',
    component: 'SuccessPage'
  },
  {
    name: 'medical-history',
    component: 'MedicalHistoryPage'
  },
  {
    name: 'medical-record-detail',
    component: 'MedicalRecordDetailPage'
  },
  {
    name: 'generate-qr',
    component: 'GenerateQRPage'
  },
  {
    name: 'settings',
    component: 'SettingsPage'
  },
  {
    name: 'add-consultation',
    component: 'AddConsultationPage'
  },
  {
    name: 'edit-medical-record',
    component: 'EditMedicalRecordPage'
  },
];

// Helper function to convert component name to export name
function getComponentName(component) {
  return component;
}

// Generate page content
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

// Create directories and files
routes.forEach((route) => {
  const routeDir = path.join(baseDir, route.name);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
    console.log(`✓ Created directory: ${route.name}`);
  }
  
  // Create page.tsx
  const pageFile = path.join(routeDir, 'page.tsx');
  if (!fs.existsSync(pageFile)) {
    const content = generatePageContent(route.component);
    fs.writeFileSync(pageFile, content);
    console.log(`✓ Created file: ${route.name}/page.tsx`);
  } else {
    console.log(`⚠ File already exists: ${route.name}/page.tsx`);
  }
});

console.log('\n✅ All routes created successfully!');
