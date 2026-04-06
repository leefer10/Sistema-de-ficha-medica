"use client";

import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { ApiClient, type Surgery } from "@/api-client";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface EditSurgeryPageProps {
  surgeryId: string;
  onNavigate?: (path: string) => void;
}

export function EditSurgeryPage({ surgeryId, onNavigate }: EditSurgeryPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surgery, setSurgery] = useState<Surgery | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    cirujano: "",
    hospital: "",
  });

  const userId = ApiClient.extractUserId();

  // Cargar datos de la cirugía
  useEffect(() => {
    const loadSurgery = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        // Obtener todas las cirugías y buscar la que necesitamos
        const surgeries = await ApiClient.getSurgeries(userId) as Surgery[];
        const surg = surgeries.find((s) => s.id === parseInt(surgeryId));

        if (!surg) {
          setError("Cirugía no encontrada");
          return;
        }

        setSurgery(surg);
        setFormData({
          nombre: surg.nombre,
          fecha: surg.fecha,
          cirujano: surg.cirujano || "",
          hospital: surg.hospital || "",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar cirugía";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadSurgery();
  }, [surgeryId, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre de la cirugía es requerido");
      return false;
    }
    if (formData.nombre.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    if (!formData.fecha) {
      setError("La fecha de la cirugía es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm() || !userId || !surgery) return;

    setSaving(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        fecha: formData.fecha,
        cirujano: formData.cirujano.trim() || null,
        hospital: formData.hospital.trim() || null,
      };

      await ApiClient.updateSurgery(userId, surgery.id, payload);
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar cirugía";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !surgery) return;

    setDeleting(true);

    try {
      await ApiClient.deleteSurgery(userId, surgery.id);
      setShowDeleteModal(false);
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar cirugía";
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
          <p>Cargando cirugía...</p>
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
            <h1 className="text-3xl font-bold">Editar Cirugía</h1>
            <p className="text-muted-foreground">Actualiza la información de la cirugía</p>
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
              <p className="text-sm text-green-800">Cirugía actualizada correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block mb-2 font-medium">
                Nombre de la Cirugía <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Apendicitis, Herniotomía, Artroscopia"
                maxLength={150}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={saving || deleting}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.nombre.length}/150</p>
            </div>

            {/* Fecha */}
            <div>
              <label className="block mb-2 font-medium">
                Fecha de la Cirugía <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={saving || deleting}
                required
              />
            </div>

            {/* Cirujano */}
            <div>
              <label className="block mb-2 font-medium">Cirujano</label>
              <input
                type="text"
                name="cirujano"
                value={formData.cirujano}
                onChange={handleChange}
                placeholder="Nombre del cirujano responsable"
                maxLength={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={saving || deleting}
              />
            </div>

            {/* Hospital */}
            <div>
              <label className="block mb-2 font-medium">Hospital/Clínica</label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                placeholder="Ej: Hospital Central, Clínica San Rafael"
                maxLength={100}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={saving || deleting}
              />
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
        title="Eliminar Cirugía"
        message="¿Estás seguro de que deseas eliminar esta cirugía? Esta acción no se puede deshacer."
        itemName={surgery?.nombre}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
