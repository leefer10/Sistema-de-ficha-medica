"use client";

import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ApiClient, type Habits } from "@/api-client";

interface AddHabitsPageProps {
  onNavigate?: (path: string) => void;
}

export function AddHabitsPage({ onNavigate }: AddHabitsPageProps) {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [habits, setHabits] = useState<Habits | null>(null);
  const [formData, setFormData] = useState({
    fuma: false,
    consomealcohol: false,
    actividadfisica: "",
    dietaespecial: "",
    stres: "",
  });

  const userId = ApiClient.extractUserId();

  // Cargar hábitos existentes
  useEffect(() => {
    const loadHabits = async () => {
      if (!userId) {
        setInitialLoading(false);
        return;
      }

      try {
        const habitsData = await ApiClient.getHabits(userId) as Habits;
        setHabits(habitsData);
        if (habitsData) {
          setFormData({
            fuma: habitsData.fuma || false,
            consomealcohol: habitsData.consomealcohol || false,
            actividadfisica: habitsData.actividadfisica || "",
            dietaespecial: habitsData.dietaespecial || "",
            stres: habitsData.stres || "",
          });
        }
      } catch (err) {
        // Es normal si no existen hábitos aún
        console.log("Hábitos no encontrados, se crearán nuevos");
      } finally {
        setInitialLoading(false);
      }
    };

    loadHabits();
  }, [userId]);

  const handleCheckChange = (field: "fuma" | "consomealcohol") => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    // Los hábitos son opcionales, pero al menos uno debe ser completado
    if (
      !formData.fuma &&
      !formData.consomealcohol &&
      !formData.actividadfisica.trim() &&
      !formData.dietaespecial.trim() &&
      !formData.stres.trim()
    ) {
      setError("Completa al menos un campo de hábitos");
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
        fuma: formData.fuma,
        consomealcohol: formData.consomealcohol,
        actividadfisica: formData.actividadfisica.trim() || null,
        dietaespecial: formData.dietaespecial.trim() || null,
        stres: formData.stres.trim() || null,
      };

      if (habits?.id) {
        // Si ya existen hábitos, actualizar
        await ApiClient.updateHabits(userId, payload);
      } else {
        // Si no existen, crear
        await ApiClient.saveHabits(userId, payload);
      }

      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar hábitos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p>Cargando hábitos...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">{habits?.id ? "Editar" : "Registrar"} Hábitos de Vida</h1>
            <p className="text-muted-foreground">Información sobre tu estilo de vida y hábitos</p>
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
              <p className="text-sm text-green-800">Hábitos guardados correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hábitos Sí/No */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Hábitos Personales</h3>

              {/* Fumar */}
              <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id="fuma"
                  checked={formData.fuma}
                  onChange={() => handleCheckChange("fuma")}
                  disabled={loading}
                  className="w-5 h-5 text-primary rounded"
                />
                <label htmlFor="fuma" className="font-medium cursor-pointer flex-1">
                  ¿Fumas?
                </label>
              </div>

              {/* Alcohol */}
              <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id="consomealcohol"
                  checked={formData.consomealcohol}
                  onChange={() => handleCheckChange("consomealcohol")}
                  disabled={loading}
                  className="w-5 h-5 text-primary rounded"
                />
                <label htmlFor="consomealcohol" className="font-medium cursor-pointer flex-1">
                  ¿Consumes alcohol regularmente?
                </label>
              </div>
            </div>

            {/* Actividad Física */}
            <div>
              <label className="block mb-2 font-medium">Actividad Física</label>
              <input
                type="text"
                name="actividadfisica"
                value={formData.actividadfisica}
                onChange={handleTextChange}
                placeholder="Ej: Corro 3 veces a la semana, Yoga, Sedentario"
                maxLength={150}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.actividadfisica.length}/150</p>
            </div>

            {/* Dieta Especial */}
            <div>
              <label className="block mb-2 font-medium">Dieta Especial</label>
              <input
                type="text"
                name="dietaespecial"
                value={formData.dietaespecial}
                onChange={handleTextChange}
                placeholder="Ej: Vegetariano, Sin gluten, Hipocalórica"
                maxLength={150}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.dietaespecial.length}/150</p>
            </div>

            {/* Nivel de Estrés */}
            <div>
              <label className="block mb-2 font-medium">Nivel de Estrés / Hábitos de Sueño</label>
              <textarea
                name="stres"
                value={formData.stres}
                onChange={handleTextChange}
                placeholder="Ej: Estrés moderado, Duermo 7 horas, Insomnio ocasional"
                maxLength={200}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.stres.length}/200</p>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                ℹ️ Esta información es importante para que los profesionales de la salud entiendan tu estilo de vida.
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
                    Guardar Hábitos
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
