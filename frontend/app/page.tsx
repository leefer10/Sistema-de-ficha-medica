'use client';

import { useState } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Verificando...');

  // Verificar conexión con API al cargar
  useState(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
        if (response.ok) {
          setApiStatus('✅ API conectada');
        } else {
          setApiStatus('❌ API no responde correctamente');
        }
      } catch (error) {
        setApiStatus('❌ No se pudo conectar a la API');
      }
    };
    checkAPI();
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Hermanos Para su Salud
          </h1>
          <p className="text-gray-600 text-lg">
            Gestión de registros médicos con OCR
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Estado del Sistema</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600">Frontend</p>
              <p className="text-green-600 font-semibold">✅ En línea</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-600">API Backend</p>
              <p className={`font-semibold ${apiStatus.includes('✅') ? 'text-green-600' : 'text-orange-600'}`}>
                {apiStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Características</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="font-semibold text-gray-800">Escaneo OCR</h3>
                <p className="text-gray-600">Fotografía fichas médicas y extrae datos automáticamente</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">💾</div>
              <div>
                <h3 className="font-semibold text-gray-800">Almacenamiento</h3>
                <p className="text-gray-600">Guarda tus registros médicos de forma segura</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🆘</div>
              <div>
                <h3 className="font-semibold text-gray-800">Emergencia</h3>
                <p className="text-gray-600">Acceso rápido a datos de emergencia con QR</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="font-semibold text-gray-800">Privacidad</h3>
                <p className="text-gray-600">Tus datos están protegidos y bajo tu control</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
            Comenzar
          </button>
        </div>
      </div>
    </main>
  );
}
