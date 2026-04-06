"use client";

import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { ApiClient, type Vaccine } from "@/api-client";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface EditVaccinePageProps {
  vaccineId: string;
  onNavigate?: (path: string) => void;
}

export function EditVaccinePage({ vaccineId, onNavigate }: EditVaccinePageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vaccine, setVaccine] = useState<Vaccine | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    fecha: "",
    lote: "",
    lugar: "",
  });

  const userId = ApiClient.extractUserId();

  // Cargar datos de la vacuna
  useEffect(() => {
    const loadVaccine = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        // Obtener todas las vacunas y buscar la que necesitamos
        const vaccines = await ApiClient.getVaccines(userId) as Vaccine[];
        const vac = vaccines.find((v) => v.id === parseInt(vaccineId));

        if (!vac) {
          setError("Vacuna no encontrada");
          return;
        }

        setVaccine(vac);
        setFormData({
          nombre: vac.nombre,
          fecha: vac.fecha,
          lote: vac.lote || "",
          lugar: vac.lugar || "",
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar vacuna";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadVaccine();
  }, [vaccineId, userId]);

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
    if (!formData.fecha) {
      setError("La fecha de la vacuna es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm() || !userId || !vaccine) return;

    setSaving(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        fecha: formData.fecha,
        lote: formData.lote.trim() || null,
        lugar: formData.lugar.trim() || null,
      };

      await ApiClient.updateVaccine(userId, vaccine.id, payload);
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar vacuna";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !vaccine) return;

    setDeleting(true);

    try {
      await ApiClient.deleteVaccine(userId, vaccine.id);
      setShowDeleteModal(false);
      setSuccess(true);

      setTimeout(() => {
        onNavigate?.("/medical-history");
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar vacuna";
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
          <p>Cargando vacuna...</p>
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
            <h1 className="text-3xl font-bold">Editar Vacuna</h1>
            <p className="text-muted-foreground">Actualiza la información de la vacuna</p>
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
              <p className="text-sm text-green-800">Vacuna actualizada correctamente. Redirigiendo...</p>
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
                disabled={saving || deleting}
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
        title="Eliminar Vacuna"
        message="¿Estás seguro de que deseas eliminar esta vacuna? Esta acción no se puede deshacer."
        itemName={vaccine?.nombre}
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
