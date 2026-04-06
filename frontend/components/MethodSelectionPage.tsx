import { Heart, Camera, FileText, Sparkles, Clock } from "lucide-react";
import { useState } from "react";
import { ApiClient } from "@/api-client";

interface MethodSelectionPageProps {
  onNavigate?: (path: string) => void;
}

export function MethodSelectionPage({ onNavigate }: MethodSelectionPageProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleOCRSelect = async () => {
    setSubmitting(true);
    try {
      onNavigate?.("/ocr-upload");
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSelect = async () => {
    setSubmitting(true);
    try {
      onNavigate?.("/manual-form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-primary" />
            <span className="text-2xl font-semibold">Hermanos Para su Salud</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">¿Cómo quieres crear tu ficha médica?</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elige el método que prefieras para crear tu ficha médica personal. Podrás actualizarla en cualquier momento.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
              ✓
            </div>
            <div className="w-20 h-1 bg-accent"></div>
            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
              ✓
            </div>
            <div className="w-20 h-1 bg-accent"></div>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              3
            </div>
          </div>
          <div className="flex justify-between max-w-md mx-auto text-sm">
            <span className="text-accent font-medium">Bienvenida</span>
            <span className="text-accent font-medium">Datos Personales</span>
            <span className="text-primary font-medium">Ficha Médica</span>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full transition-all duration-300"></div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">Paso 3 de 3</p>
          </div>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Option A: OCR Scan */}
          <div 
            onClick={handleOCRSelect}
            className={`group bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-primary transition-all cursor-pointer hover:shadow-xl ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Escanear Ficha Impresa</h2>
              <p className="text-muted-foreground mb-6">
                Sube una foto de tu ficha médica y nosotros extraemos los datos automáticamente
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent">✓</span>
                  </div>
                  <span className="text-left">Escaneo automático con IA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent">✓</span>
                  </div>
                  <span className="text-left">Reconocimiento óptico de caracteres</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-accent">✓</span>
                  </div>
                  <span className="text-left">Revisa y corrige antes de guardar</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Recomendado si tienes una ficha</span>
              </div>

              <button 
                disabled={submitting}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold group-hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? "Procesando..." : "Seleccionar Imagen"}
              </button>

              <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Tiempo estimado: 2-3 min
              </p>
            </div>
          </div>

          {/* Option B: Manual Form */}
          <div 
            onClick={handleManualSelect}
            className={`group bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-accent transition-all cursor-pointer hover:shadow-xl ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Rellenar Manualmente</h2>
              <p className="text-muted-foreground mb-6">
                Completa los campos tú mismo en la pantalla con formularios guiados
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <span className="text-left">Formulario paso a paso</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <span className="text-left">Guarda borradores en cualquier momento</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary">✓</span>
                  </div>
                  <span className="text-left">Control total de tu información</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm mb-6">
                <FileText className="w-4 h-4" />
                <span>Perfecto para crear desde cero</span>
              </div>

              <button 
                disabled={submitting}
                className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold group-hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? "Procesando..." : "Rellenar Ahora"}
              </button>

              <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Tiempo estimado: 5-7 min
              </p>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            💡 No te preocupes, podrás editar y completar tu ficha en cualquier momento
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate?.("/personal-data")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver a Datos Personales
          </button>
        </div>
      </div>
    </div>
  );
}