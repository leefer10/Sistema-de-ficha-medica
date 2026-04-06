"use client";

import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { ApiClient, type Medication } from "@/api-client";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface EditMedicationPageProps {
  medicationId: string;
  onNavigate?: (path: string) => void;
}

export function EditMedicationPage({ medicationId, onNavigate }: EditMedicationPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medication, setMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    dosis: "",
    frecuencia: "",
    motivo: "",
    activo: true,
  });

  const userId = ApiClient.extractUserId();

  // Load medication data
  useEffect(() => {
    const loadMedication = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        // Get all medications and find the one we need
        const medications = await ApiClient.getMedications(userId) as Medication[];
        const med = medications.find((m) => m.id === parseInt(medicationId));

        if (!med) {
          setError("Medicamento no encontrado");
          return;
        }

        setMedication(med);
        setFormData({
          nombre: med.nombre,
          dosis: med.dosis || "",
          frecuencia: med.frecuencia || "",
          motivo: med.motivo || "",
          activo: med.activo,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar medicamento";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMedication();
  }, [medicationId, userId]);

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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm() || !userId || !medication) return;

    setSaving(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        dosis: formData.dosis.trim() || null,
        frecuencia: formData.frecuencia.trim() || null,
        motivo: formData.motivo.trim() || null,
        activo: formData.activo,
      };

      await ApiClient.updateMedication(userId, medication.id, payload);
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar medicamento";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !medication) return;

    setDeleting(true);

    try {
      await ApiClient.deleteMedication(userId, medication.id);
      setShowDeleteModal(false);
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar medicamento";
      setError(errorMessage);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p>Cargando medicamento...</p>
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
            disabled={saving || deleting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Editar Medicamento</h1>
            <p className="text-muted-foreground">Actualiza la información del medicamento</p>
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
              <p className="text-sm text-green-800">Medicamento actualizado correctamente. Redirigiendo...</p>
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={saving || deleting}
                className="px-6 py-3 border border-destructive text-destructive rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>

              <button
                type="submit"
                disabled={saving || deleting}
                className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Eliminar Medicamento"
        message="¿Estás seguro de que deseas eliminar este medicamento? Esta acción no se puede deshacer."
        itemName={medication?.nombre}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
