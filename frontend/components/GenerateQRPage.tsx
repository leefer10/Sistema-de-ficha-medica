"use client";

import { Heart, Download, Share2, Printer, QrCode as QrCodeIcon, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ApiClient } from "@/api-client";

interface GenerateQRPageProps {
  onNavigate?: (path: string) => void;
}

export function GenerateQRPage({ onNavigate }: GenerateQRPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrImageBase64, setQrImageBase64] = useState<string | null>(null);

  const userId = ApiClient.extractUserId();

  // Cargar QR del backend
  useEffect(() => {
    const loadQR = async () => {
      if (!userId) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ApiClient.getMyQR(userId);
        
        // El backend retorna: { qr_image_base64: "base64_encoded_string", qr_token: "...", url: "..." }
        if (response && response.qr_image_base64) {
          setQrImageBase64(response.qr_image_base64);
        } else if (response && response.qr_image) {
          // Fallback para compatibilidad
          setQrImageBase64(response.qr_image);
        } else {
          setError("No se pudo obtener el código QR");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar el código QR";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadQR();
  }, [userId]);

  const handleDownload = () => {
    if (!qrImageBase64) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qrImageBase64}`;
    link.download = "codigo-qr-medico.png";
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mi Código QR Médico",
        text: "Accede a mi información médica de emergencia",
        url: window.location.href,
      });
    } else {
      alert("Función de compartir no disponible en este navegador");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p>Generando tu código QR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Hermanos Para su Salud</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <QrCodeIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Tu Código QR de Emergencia</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Este código QR permite al personal médico acceder rápidamente a tu información vital en caso de emergencia
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* QR Code Display */}
        {qrImageBase64 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex justify-center mb-8">
              <div className="p-8 bg-white border-4 border-primary/20 rounded-2xl">
                <img
                  src={`data:image/png;base64,${qrImageBase64}`}
                  alt="Código QR de Emergencia"
                  className="w-80 h-80"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Descargar
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Compartir
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Cómo usar tu código QR</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Descarga o imprime el código</h3>
                <p className="text-muted-foreground">
                  Utiliza los botones arriba para descargar el código QR en tu teléfono o imprimirlo
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Llévalo siempre contigo</h3>
                <p className="text-muted-foreground">
                  Coloca el código QR en un lugar visible como tu billetera, llavero o funda del móvil
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">En caso de emergencia</h3>
                <p className="text-muted-foreground">
                  El personal médico puede escanear el código para acceder instantáneamente a tu historial médico, 
                  alergias, medicamentos y contacto de emergencia
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Mantén tu información actualizada</h3>
                <p className="text-muted-foreground">
                  El código QR siempre mostrará tu información más reciente. Tu código nunca expira y se actualiza automáticamente
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Nota Importante sobre Seguridad
            </h3>
            <p className="text-sm text-muted-foreground">
              Este código QR está vinculado a tu cuenta y solo muestra información de emergencia esencial (contactos de emergencia, 
              alergias, medicamentos críticos). Tu información completa está protegida y solo tú puedes acceder a ella desde tu cuenta.
              El acceso de emergencia es seguro y rasteable.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          header, button, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .container {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
