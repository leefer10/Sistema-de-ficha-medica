"use client";

import { useState, useEffect } from "react";
import { Heart, Save, ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { ApiClient } from "@/api-client";

interface EditMedicalRecordPageProps {
  onNavigate?: (path: string) => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface Vaccine {
  id: string;
  name: string;
  date: string;
  dose: string;
}

interface Surgery {
  id: string;
  name: string;
  date: string;
  notes: string;
}

export function EditMedicalRecordPage({ onNavigate }: EditMedicalRecordPageProps) {

  // Load existing data from API/localStorage
  const [formData, setFormData] = useState({
    occupation: "",
    industry: "Tecnología",
    insuranceProvider: "",
    insuranceNumber: "",
    previousDiseases: "",
    familyHistory: "",
    allergies: "",
    chronicConditions: "",
    habits: "",
  });

  const [medications, setMedications] = useState<Medication[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);

  // New item forms
  const [newMedication, setNewMedication] = useState({ name: "", dosage: "", frequency: "" });
  const [newVaccine, setNewVaccine] = useState({ name: "", date: "", dose: "" });
  const [newSurgery, setNewSurgery] = useState({ name: "", date: "", notes: "" });

  const [activeSection, setActiveSection] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    const loadMedicalData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiClient.get<Record<string, any>>(`/users/me/medical`);
        if (response) {
          // Populate form data from API response
          setFormData({
            occupation: response?.personal_data?.ocupacion || "",
            industry: response?.personal_data?.industry || "Tecnología",
            insuranceProvider: response?.personal_data?.proveedor_seguro || "",
            insuranceNumber: response?.personal_data?.numero_seguro || "",
            previousDiseases: response?.medical_history?.enfermedades_previas || "",
            familyHistory: response?.medical_history?.historial_familiar || "",
            allergies: response?.medical_history?.alergias || "",
            chronicConditions: response?.medical_history?.condiciones_cronicas || "",
            habits: response?.habits || "",
          });

          // Populate lists
          if (response?.medications) setMedications(response.medications);
          if (response?.vaccines) setVaccines(response.vaccines);
          if (response?.surgeries) setSurgeries(response.surgeries);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading medical data:", err);
        // Fall back to localStorage if API fails
        if (typeof window !== 'undefined') {
          setFormData({
            occupation: localStorage.getItem("userOccupation") || "",
            industry: localStorage.getItem("userIndustry") || "Tecnología",
            insuranceProvider: localStorage.getItem("userInsuranceProvider") || "",
            insuranceNumber: localStorage.getItem("userInsuranceNumber") || "",
            previousDiseases: localStorage.getItem("userPreviousDiseases") || "",
            familyHistory: localStorage.getItem("userFamilyHistory") || "",
            allergies: localStorage.getItem("userAllergies") || "",
            chronicConditions: localStorage.getItem("userChronicConditions") || "",
            habits: localStorage.getItem("userHabits") || "",
          });

          const savedMedications = localStorage.getItem("userMedications");
          const savedVaccines = localStorage.getItem("userVaccines");
          const savedSurgeries = localStorage.getItem("userSurgeries");

          if (savedMedications) setMedications(JSON.parse(savedMedications));
          if (savedVaccines) setVaccines(JSON.parse(savedVaccines));
          if (savedSurgeries) setSurgeries(JSON.parse(savedSurgeries));
        }
        setIsLoading(false);
      }
    };
    loadMedicalData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Medication handlers
  const addMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const medication: Medication = {
        id: Date.now().toString(),
        ...newMedication,
      };
      setMedications([...medications, medication]);
      setNewMedication({ name: "", dosage: "", frequency: "" });
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  // Vaccine handlers
  const addVaccine = () => {
    if (newVaccine.name && newVaccine.date && newVaccine.dose) {
      const vaccine: Vaccine = {
        id: Date.now().toString(),
        ...newVaccine,
      };
      setVaccines([...vaccines, vaccine]);
      setNewVaccine({ name: "", date: "", dose: "" });
    }
  };

  const removeVaccine = (id: string) => {
    setVaccines(vaccines.filter((v) => v.id !== id));
  };

  // Surgery handlers
  const addSurgery = () => {
    if (newSurgery.name && newSurgery.date) {
      const surgery: Surgery = {
        id: Date.now().toString(),
        ...newSurgery,
      };
      setSurgeries([...surgeries, surgery]);
      setNewSurgery({ name: "", date: "", notes: "" });
    }
  };

  const removeSurgery = (id: string) => {
    setSurgeries(surgeries.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);

    // Save all data to localStorage
    localStorage.setItem("userOccupation", formData.occupation);
    localStorage.setItem("userIndustry", formData.industry);
    localStorage.setItem("userInsuranceProvider", formData.insuranceProvider);
    localStorage.setItem("userInsuranceNumber", formData.insuranceNumber);
    localStorage.setItem("userPreviousDiseases", formData.previousDiseases);
    localStorage.setItem("userFamilyHistory", formData.familyHistory);
    localStorage.setItem("userAllergies", formData.allergies);
    localStorage.setItem("userChronicConditions", formData.chronicConditions);
    localStorage.setItem("userHabits", formData.habits);
    localStorage.setItem("userMedications", JSON.stringify(medications));
    localStorage.setItem("userVaccines", JSON.stringify(vaccines));
    localStorage.setItem("userSurgeries", JSON.stringify(surgeries));

    setTimeout(() => {
      setIsSaving(false);
      onNavigate?.("/dashboard");
    }, 800);
  };

  const sections = [
    { id: "personal", label: "Información Personal", icon: "👤" },
    { id: "medical", label: "Antecedentes Médicos", icon: "🩺" },
    { id: "medications", label: "Medicamentos", icon: "💊" },
    { id: "vaccines", label: "Vacunas", icon: "💉" },
    { id: "surgeries", label: "Cirugías Previas", icon: "⚕️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate?.("/dashboard")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                <span className="text-xl font-semibold">Editar Mi Ficha Médica</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando datos médicos...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
              <h3 className="font-semibold mb-3">Secciones</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-8">
              {/* Section 1: Personal Information */}
              {activeSection === "personal" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Información Personal 👤</h2>
                    <p className="text-muted-foreground">
                      Actualiza tu información laboral y de seguro médico
                    </p>
                    <p className="text-sm text-green-700 mt-2 bg-green-50 p-2 rounded">
                      ✓ Los campos con fondo verde contienen información previamente guardada que puedes editar
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ocupación Actual
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => handleInputChange("occupation", e.target.value)}
                          placeholder="Ej: Ingeniero de Software"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.occupation ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.occupation && (
                          <span className="absolute right-3 top-2.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Industria</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Tecnología">Tecnología</option>
                        <option value="Salud">Salud</option>
                        <option value="Educación">Educación</option>
                        <option value="Finanzas">Finanzas</option>
                        <option value="Construcción">Construcción</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Proveedor de Seguro
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.insuranceProvider}
                          onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                          placeholder="Ej: Seguro Nacional"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.insuranceProvider ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.insuranceProvider && (
                          <span className="absolute right-3 top-2.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Número de Póliza
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.insuranceNumber}
                          onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                          placeholder="Ej: POL-123456"
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.insuranceNumber ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.insuranceNumber && (
                          <span className="absolute right-3 top-2.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Medical Background */}
              {activeSection === "medical" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Antecedentes Médicos 🩺</h2>
                    <p className="text-muted-foreground">
                      Mantén tu historial médico actualizado
                    </p>
                    <p className="text-sm text-green-700 mt-2 bg-green-50 p-2 rounded">
                      ✓ Los campos con fondo verde contienen información previamente guardada que puedes editar
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Alergias Conocidas
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.allergies}
                          onChange={(e) => handleInputChange("allergies", e.target.value)}
                          placeholder="Lista tus alergias separadas por comas"
                          rows={3}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.allergies ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.allergies && (
                          <span className="absolute right-3 top-3.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Condiciones Médicas Crónicas
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.chronicConditions}
                          onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                          placeholder="Ej: Diabetes tipo 2, Hipertensión"
                          rows={3}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.chronicConditions ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.chronicConditions && (
                          <span className="absolute right-3 top-3.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Enfermedades Previas
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.previousDiseases}
                          onChange={(e) => handleInputChange("previousDiseases", e.target.value)}
                          placeholder="Describe enfermedades o condiciones pasadas"
                          rows={4}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.previousDiseases ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.previousDiseases && (
                          <span className="absolute right-3 top-3.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Historial Familiar
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.familyHistory}
                          onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                          placeholder="Condiciones médicas hereditarias en tu familia"
                          rows={4}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.familyHistory ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.familyHistory && (
                          <span className="absolute right-3 top-3.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Hábitos
                      </label>
                      <div className="relative">
                        <textarea
                          value={formData.habits}
                          onChange={(e) => handleInputChange("habits", e.target.value)}
                          placeholder="Ej: Ejercicio regular (3x semana), No fuma, Consumo de alcohol ocasional, Dieta balanceada"
                          rows={4}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            formData.habits ? "border-green-400 bg-green-50" : ""
                          }`}
                        />
                        {formData.habits && (
                          <span className="absolute right-3 top-3.5 text-green-600 text-lg">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Incluye información sobre: actividad física, tabaco, alcohol, dieta, sueño, etc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Medications */}
              {activeSection === "medications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Medicamentos Actuales 💊</h2>
                    <p className="text-muted-foreground">
                      Gestiona tu lista de medicamentos activos
                    </p>
                    {medications.length > 0 && (
                      <p className="text-sm text-blue-700 mt-2 bg-blue-50 p-2 rounded">
                        ✓ Tienes {medications.length} medicamento{medications.length !== 1 ? "s" : ""} guardado{medications.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Existing medications */}
                  {medications.length > 0 && (
                    <div className="space-y-3">
                      {medications.map((med) => (
                        <div
                          key={med.id}
                          className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Medicamento</p>
                              <p className="font-semibold">{med.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Dosis</p>
                              <p className="font-semibold">{med.dosage}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Frecuencia</p>
                              <p className="font-semibold">{med.frequency}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeMedication(med.id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new medication */}
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="font-semibold mb-4">Agregar Medicamento</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        value={newMedication.name}
                        onChange={(e) =>
                          setNewMedication({ ...newMedication, name: e.target.value })
                        }
                        placeholder="Nombre del medicamento"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={newMedication.dosage}
                        onChange={(e) =>
                          setNewMedication({ ...newMedication, dosage: e.target.value })
                        }
                        placeholder="Dosis (ej: 100mg)"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={newMedication.frequency}
                        onChange={(e) =>
                          setNewMedication({ ...newMedication, frequency: e.target.value })
                        }
                        placeholder="Frecuencia (ej: 2 veces al día)"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      onClick={addMedication}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Medicamento
                    </button>
                  </div>
                </div>
              )}

              {/* Section 4: Vaccines */}
              {activeSection === "vaccines" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Vacunas 💉</h2>
                    <p className="text-muted-foreground">
                      Mantén tu registro de vacunación actualizado
                    </p>
                    {vaccines.length > 0 && (
                      <p className="text-sm text-green-700 mt-2 bg-green-50 p-2 rounded">
                        ✓ Tienes {vaccines.length} vacuna{vaccines.length !== 1 ? "s" : ""} guardada{vaccines.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Existing vaccines */}
                  {vaccines.length > 0 && (
                    <div className="space-y-3">
                      {vaccines.map((vac) => (
                        <div
                          key={vac.id}
                          className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Vacuna</p>
                              <p className="font-semibold">{vac.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Fecha</p>
                              <p className="font-semibold">{vac.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Dosis</p>
                              <p className="font-semibold">{vac.dose}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeVaccine(vac.id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new vaccine */}
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="font-semibold mb-4">Agregar Vacuna</h3>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <input
                        type="text"
                        value={newVaccine.name}
                        onChange={(e) =>
                          setNewVaccine({ ...newVaccine, name: e.target.value })
                        }
                        placeholder="Nombre de la vacuna"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="date"
                        value={newVaccine.date}
                        onChange={(e) =>
                          setNewVaccine({ ...newVaccine, date: e.target.value })
                        }
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={newVaccine.dose}
                        onChange={(e) =>
                          setNewVaccine({ ...newVaccine, dose: e.target.value })
                        }
                        placeholder="Dosis (ej: 1ra dosis)"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <button
                      onClick={addVaccine}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Vacuna
                    </button>
                  </div>
                </div>
              )}

              {/* Section 5: Surgeries */}
              {activeSection === "surgeries" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Cirugías Previas ⚕️</h2>
                    <p className="text-muted-foreground">
                      Registra tus procedimientos quirúrgicos
                    </p>
                    {surgeries.length > 0 && (
                      <p className="text-sm text-purple-700 mt-2 bg-purple-50 p-2 rounded">
                        ✓ Tienes {surgeries.length} cirugía{surgeries.length !== 1 ? "s" : ""} guardada{surgeries.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Existing surgeries */}
                  {surgeries.length > 0 && (
                    <div className="space-y-3">
                      {surgeries.map((surg) => (
                        <div
                          key={surg.id}
                          className="flex items-start justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg"
                        >
                          <div className="flex-1 grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Cirugía</p>
                              <p className="font-semibold">{surg.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Fecha</p>
                              <p className="font-semibold">{surg.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Notas</p>
                              <p className="font-semibold">{surg.notes || "N/A"}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSurgery(surg.id)}
                            className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new surgery */}
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="font-semibold mb-4">Agregar Cirugía</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={newSurgery.name}
                        onChange={(e) =>
                          setNewSurgery({ ...newSurgery, name: e.target.value })
                        }
                        placeholder="Nombre de la cirugía"
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="date"
                        value={newSurgery.date}
                        onChange={(e) =>
                          setNewSurgery({ ...newSurgery, date: e.target.value })
                        }
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <textarea
                      value={newSurgery.notes}
                      onChange={(e) =>
                        setNewSurgery({ ...newSurgery, notes: e.target.value })
                      }
                      placeholder="Notas adicionales (opcional)"
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                    />
                    <button
                      onClick={addSurgery}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Cirugía
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button - Bottom of Form */}
        <div className="flex justify-center gap-4 mt-12 mb-8">
          <button
            onClick={() => onNavigate?.("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
        </div>
      )}
    </div>
  );
}