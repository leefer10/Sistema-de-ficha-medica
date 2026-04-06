"use client";

import { Heart, ArrowLeft, Plus, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ApiClient, type Medication, type Vaccine, type Surgery, type EmergencyContact, type Habit } from "@/api-client";
import { MedicalItemCard } from "./MedicalItemCard";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface MedicalHistoryPageProps {
  onNavigate?: (path: string) => void;
}

export function MedicalHistoryPage({ onNavigate }: MedicalHistoryPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [habits, setHabits] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState("medications");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const userId = ApiClient.extractUserId();

  // Load all medical items
  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [medsData, vacsData, surgsData, contactsData, habitsData] = await Promise.all([
          ApiClient.getMedications(userId),
          ApiClient.getVaccines(userId),
          ApiClient.getSurgeries(userId),
          ApiClient.getEmergencyContacts(userId),
          ApiClient.getHabits(userId),
        ]);

        setMedications((medsData as Medication[]) || []);
        setVaccines((vacsData as Vaccine[]) || []);
        setSurgeries((surgsData as Surgery[]) || []);
        setEmergencyContacts((contactsData as EmergencyContact[]) || []);
        setHabits((habitsData as Habit) || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos médicos";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleDeleteClick = (type: string, id: number, name: string) => {
    setDeleteTarget({ type, id, name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !userId) return;

    setDeleting(true);

    try {
      if (deleteTarget.type === "medication") {
        await ApiClient.deleteMedication(userId, deleteTarget.id);
        setMedications((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      } else if (deleteTarget.type === "vaccine") {
        await ApiClient.deleteVaccine(userId, deleteTarget.id);
        setVaccines((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      } else if (deleteTarget.type === "surgery") {
        await ApiClient.deleteSurgery(userId, deleteTarget.id);
        setSurgeries((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      } else if (deleteTarget.type === "contact") {
        await ApiClient.deleteEmergencyContact(userId, deleteTarget.id);
        setEmergencyContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);
      setSuccessMessage(`${deleteTarget.name} eliminado correctamente`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar";
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
          <p>Cargando historial médico...</p>
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

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back Button */}
        <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-md p-6 border mb-6">
          <h1 className="text-3xl font-bold mb-2">Historial Médico</h1>
          <p className="text-muted-foreground">Administra tus medicamentos, vacunas, cirugías y contactos de emergencia</p>
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

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-1 border mb-6 flex gap-2 overflow-x-auto">
          {[
            { id: "medications", label: "Medicamentos", count: medications.length },
            { id: "vaccines", label: "Vacunas", count: vaccines.length },
            { id: "surgeries", label: "Cirugías", count: surgeries.length },
            { id: "contacts", label: "Contactos Emergencia", count: emergencyContacts.length },
            { id: "habits", label: "Hábitos", count: habits ? 1 : 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg transition-colors font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Medications Tab */}
          {activeTab === "medications" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Medicamentos</h2>
                <button
                  onClick={() => onNavigate?.("/add-medication")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Medicamento
                </button>
              </div>

              {medications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 border text-center">
                  <p className="text-muted-foreground mb-4">No hay medicamentos registrados</p>
                  <button
                    onClick={() => onNavigate?.("/add-medication")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar el primero
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {medications.map((med) => (
                    <MedicalItemCard
                      key={med.id}
                      title={med.nombre}
                      badge={med.activo ? "Activo" : "Inactivo"}
                      badgeColor={med.activo ? "green" : "gray"}
                      details={[
                        { label: "Dosis", value: med.dosis || null },
                        { label: "Frecuencia", value: med.frecuencia || null },
                        { label: "Motivo", value: med.motivo || null },
                      ]}
                      onEdit={() => onNavigate?.(`/edit-medication?id=${med.id}`)}
                      onDelete={() => handleDeleteClick("medication", med.id, med.nombre)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vaccines Tab */}
          {activeTab === "vaccines" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Vacunas</h2>
                <button
                  onClick={() => onNavigate?.("/add-vaccine")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Vacuna
                </button>
              </div>

              {vaccines.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 border text-center">
                  <p className="text-muted-foreground mb-4">No hay vacunas registradas</p>
                  <button
                    onClick={() => onNavigate?.("/add-vaccine")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar la primera
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {vaccines.map((vac) => (
                    <MedicalItemCard
                      key={vac.id}
                      title={vac.nombre}
                      badge={new Date(vac.fecha_aplicacion || "").toLocaleDateString("es-ES")}
                      badgeColor="blue"
                      details={[
                        { label: "Fecha", value: new Date(vac.fecha_aplicacion || "").toLocaleDateString("es-ES") },
                        { label: "Lote", value: vac.lote || "" },
                        { label: "Dosis", value: vac.numero_dosis?.toString() || "" },
                      ]}
                      onEdit={() => onNavigate?.(`/edit-vaccine?id=${vac.id}`)}
                      onDelete={() => handleDeleteClick("vaccine", vac.id, vac.nombre)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Surgeries Tab */}
          {activeTab === "surgeries" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Cirugías</h2>
                <button
                  onClick={() => onNavigate?.("/add-surgery")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Cirugía
                </button>
              </div>

              {surgeries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 border text-center">
                  <p className="text-muted-foreground mb-4">No hay cirugías registradas</p>
                  <button
                    onClick={() => onNavigate?.("/add-surgery")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar la primera
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {surgeries.map((surg) => (
                    <MedicalItemCard
                      key={surg.id}
                      title={surg.nombre_procedimiento}
                      badge={new Date(surg.fecha || "").toLocaleDateString("es-ES")}
                      badgeColor="orange"
                      details={[
                        { label: "Fecha", value: new Date(surg.fecha || "").toLocaleDateString("es-ES") },
                        { label: "Hospital", value: surg.hospital || "" },
                        { label: "Motivo", value: surg.motivo || "" },
                      ]}
                      onEdit={() => onNavigate?.(`/edit-surgery?id=${surg.id}`)}
                      onDelete={() => handleDeleteClick("surgery", surg.id, surg.nombre_procedimiento)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === "contacts" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Contactos de Emergencia</h2>
                <button
                  onClick={() => onNavigate?.("/add-emergency-contact")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Contacto
                </button>
              </div>

              {emergencyContacts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 border text-center">
                  <p className="text-muted-foreground mb-4">No hay contactos de emergencia registrados</p>
                  <button
                    onClick={() => onNavigate?.("/add-emergency-contact")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar el primero
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {emergencyContacts.map((contact) => (
                    <MedicalItemCard
                      key={contact.id}
                      title={contact.nombre}
                      badge={contact.relacion}
                      badgeColor="red"
                      details={[
                        { label: "Relación", value: contact.relacion },
                        { label: "Teléfono", value: contact.telefono },
                      ]}
                      onEdit={() => onNavigate?.(`/edit-emergency-contact?id=${contact.id}`)}
                      onDelete={() => handleDeleteClick("contact", contact.id, contact.nombre)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Habits Tab */}
          {activeTab === "habits" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Hábitos de Vida</h2>
                <button
                  onClick={() => onNavigate?.("/add-habits")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  {habits ? "Editar" : "Agregar"} Hábitos
                </button>
              </div>

              {!habits ? (
                <div className="bg-white rounded-xl shadow-md p-12 border text-center">
                  <p className="text-muted-foreground mb-4">No hay hábitos registrados</p>
                  <button
                    onClick={() => onNavigate?.("/add-habits")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                    Registrar hábitos
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 border">
                  <div className="space-y-4">
                    {habits.fuma !== undefined && (
                      <div className="flex items-center justify-between pb-4 border-b">
                        <span className="font-medium">¿Fumas?</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          habits.fuma
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {habits.fuma ? "Sí" : "No"}
                        </span>
                      </div>
                    )}

                    {habits.consume_alcohol !== undefined && (
                      <div className="flex items-center justify-between pb-4 border-b">
                        <span className="font-medium">Consumo de Alcohol:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          habits.consume_alcohol === "frecuente"
                            ? "bg-red-100 text-red-800"
                            : habits.consume_alcohol === "ocasional"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {habits.consume_alcohol}
                        </span>
                      </div>
                    )}

                    {habits.nivel_ejercicio && (
                      <div className="pb-4 border-b">
                        <span className="font-medium">Nivel de Ejercicio:</span>
                        <p className="text-gray-700 mt-1">{habits.nivel_ejercicio}</p>
                      </div>
                    )}

                    {habits.tipo_dieta && (
                      <div className="pb-4 border-b">
                        <span className="font-medium">Tipo de Dieta:</span>
                        <p className="text-gray-700 mt-1">{habits.tipo_dieta}</p>
                      </div>
                    )}

                    {habits.observaciones && (
                      <div className="pb-4">
                        <span className="font-medium">Observaciones:</span>
                        <p className="text-gray-700 mt-1">{habits.observaciones}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <button
                      onClick={() => onNavigate?.("/add-habits")}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                      Editar Hábitos
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        title="Eliminar Registro"
        message="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
        itemName={deleteTarget?.name}
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
