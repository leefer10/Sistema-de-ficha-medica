"use client";

import { useState } from "react";
import { Heart, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ApiClient } from "@/api-client";

interface AddMedicationPageProps {
  onNavigate?: (path: string) => void;
}

export function AddMedicationPage({ onNavigate }: AddMedicationPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    dosis: "",
    frecuencia: "",
    motivo: "",
    activo: true,
  });

  const userId = ApiClient.extractUserId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre del medicamento es requerido");
      return false;
    }
    if (formData.nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (formData.nombre.trim().length > 200) {
      setError("El nombre no puede exceder 200 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    if (!userId) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        dosis: formData.dosis.trim() || null,
        frecuencia: formData.frecuencia.trim() || null,
        motivo: formData.motivo.trim() || null,
        activo: formData.activo,
      };

      await ApiClient.addMedication(userId, payload);
      
      // Mark phase 3 as complete on first medical item
      try {
        await ApiClient.completeOnboardingPhase(3);
      } catch (err) {
        console.warn("Error marking phase 3 complete:", err);
      }
      
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar medicamento";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate?.("/medical-history")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Agregar Medicamento</h1>
            <p className="text-muted-foreground">Registra un nuevo medicamento en tu ficha médica</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900">Éxito</h4>
              <p className="text-sm text-green-800">Medicamento guardado correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2 font-medium">
                Nombre del Medicamento <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Aspirina, Ibuprofeno"
                maxLength={200}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.nombre.length}/200</p>
            </div>

            {/* Dosis */}
            <div>
              <label className="block mb-2 font-medium">Dosis</label>
              <input
                type="text"
                name="dosis"
                value={formData.dosis}
                onChange={handleChange}
                placeholder="Ej: 500mg, 2 comprimidos"
                maxLength={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            {/* Frecuencia */}
            <div>
              <label className="block mb-2 font-medium">Frecuencia</label>
              <input
                type="text"
                name="frecuencia"
                value={formData.frecuencia}
                onChange={handleChange}
                placeholder="Ej: 2 veces al día, cada 8 horas"
                maxLength={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            {/* Motivo */}
            <div>
              <label className="block mb-2 font-medium">Motivo</label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                placeholder="¿Por qué se toma este medicamento?"
                maxLength={255}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                disabled={loading}
              />
            </div>

            {/* Activo */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input
                type="checkbox"
                name="activo"
                id="activo"
                checked={formData.activo}
                onChange={handleChange}
                disabled={loading}
                className="w-5 h-5 text-primary rounded"
              />
              <label htmlFor="activo" className="font-medium cursor-pointer">
                Medicamento activo
              </label>
              <p className="text-xs text-muted-foreground ml-auto">
                Desactiva si ya no lo tomas
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => onNavigate?.("/medical-history")}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Guardar Medicamento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
