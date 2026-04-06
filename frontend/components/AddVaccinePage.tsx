"use client";

import { useState } from "react";
import { Heart, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ApiClient } from "@/api-client";

interface AddVaccinePageProps {
  onNavigate?: (path: string) => void;
}

export function AddVaccinePage({ onNavigate }: AddVaccinePageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: new Date().toISOString().split('T')[0],
    lote: "",
    lugar: "",
  });

  const userId = ApiClient.extractUserId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre de la vacuna es requerido");
      return false;
    }
    if (formData.nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (formData.nombre.trim().length > 100) {
      setError("El nombre no puede exceder 100 caracteres");
      return false;
    }
    if (!formData.fecha) {
      setError("La fecha de la vacuna es requerida");
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
        fecha: formData.fecha,
        lote: formData.lote.trim() || null,
        lugar: formData.lugar.trim() || null,
      };

      await ApiClient.addVaccine(userId, payload);
      
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
      const errorMessage = err instanceof Error ? err.message : "Error al guardar vacuna";
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
            <h1 className="text-3xl font-bold">Agregar Vacuna</h1>
            <p className="text-muted-foreground">Registra una nueva vacuna en tu ficha médica</p>
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
              <p className="text-sm text-green-800">Vacuna guardada correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2 font-medium">
                Nombre de la Vacuna <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: COVID-19, Influenza, Hepatitis B"
                maxLength={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.nombre.length}/100</p>
            </div>

            {/* Fecha */}
            <div>
              <label className="block mb-2 font-medium">
                Fecha de Aplicación <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
                required
              />
            </div>

            {/* Lote */}
            <div>
              <label className="block mb-2 font-medium">Número de Lote</label>
              <input
                type="text"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                placeholder="Ej: ABC123456"
                maxLength={50}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            {/* Lugar */}
            <div>
              <label className="block mb-2 font-medium">Lugar de Aplicación</label>
              <input
                type="text"
                name="lugar"
                value={formData.lugar}
                onChange={handleChange}
                placeholder="Ej: Centro de Salud, Hospital Central"
                maxLength={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
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
                    Guardar Vacuna
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
