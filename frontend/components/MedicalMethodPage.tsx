"use client";

import { useState } from "react";
import { Scan, FileText, CheckCircle } from "lucide-react";
import { ApiClient } from "@/api-client";

interface MedicalMethodPageProps {
  onNavigate?: (path: string) => void;
}

export function MedicalMethodPage({ onNavigate }: MedicalMethodPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<"ocr" | "manual" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedMethod) return;

    setSubmitting(true);
    try {
      // Mark phase 2 as complete
      await ApiClient.completeOnboardingPhase(2);

      // Navigate based on selected method
      if (selectedMethod === "ocr") {
        onNavigate?.("/ocr-scan");
      } else {
        onNavigate?.("/welcome");
      }
    } catch (error) {
      console.error("Error completing phase 2:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Elige tu método de registro
          </h1>
          <p className="text-xl text-muted-foreground">
            Puedes escanear documentos o llenar manualmente tu ficha médica
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Method Options */}
          <div className="space-y-6 mb-8">
            {/* OCR Method */}
            <div
              onClick={() => setSelectedMethod("ocr")}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "ocr"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Scan className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Escaneo Automático (OCR)</h3>
                  <p className="text-muted-foreground">
                    Carga una imagen de tu documento médico y nuestro sistema extraerá automáticamente
                    los datos usando tecnología de reconocimiento óptico de caracteres.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>✓ Más rápido</li>
                    <li>✓ Menos errores</li>
                    <li>✓ Ideal para documentos médicos claros</li>
                  </ul>
                </div>
                {selectedMethod === "ocr" && (
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-2" />
                )}
              </div>
            </div>

            {/* Manual Method */}
            <div
              onClick={() => setSelectedMethod("manual")}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === "manual"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Llenado Manual</h3>
                  <p className="text-muted-foreground">
                    Completa manualmente tu ficha médica respondiendo preguntas sobre tu salud,
                    antecedentes médicos y medicamentos.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li>✓ Más control</li>
                    <li>✓ Sin dependencia de documentos</li>
                    <li>✓ Completa la información que desees</li>
                  </ul>
                </div>
                {selectedMethod === "manual" && (
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate?.("/welcome")}
              disabled={submitting}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
            >
              Atrás
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedMethod || submitting}
              className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Continuar →"}
            </button>
          </div>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Puedes cambiar este método en cualquier momento desde la configuración de tu perfil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
