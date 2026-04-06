import { useState, useEffect } from "react";
import { Heart, Save, FileText, Plus, Trash2, Calendar } from "lucide-react";
import { ApiClient } from "@/api-client";

interface ManualFormPageProps {
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

interface PersonalDataType {
  fullName: string;
  phone: string;
  bloodType: string;
  address: string;
  allergies: string;
  cedula: string;
  ciudad: string;
}

export function ManualFormPage({ onNavigate }: ManualFormPageProps) {
  const initialPersonalData: PersonalDataType = {
    fullName: "",
    phone: "",
    bloodType: "",
    address: "",
    allergies: "",
    cedula: "",
    ciudad: "",
  };

  const [personalData, setPersonalData] = useState<PersonalDataType>(initialPersonalData);

  const [isEditingPersonalData, setIsEditingPersonalData] = useState(false);
  const [isEditingAllergies, setIsEditingAllergies] = useState(false);
  const [editedPersonalData, setEditedPersonalData] = useState<PersonalDataType>(initialPersonalData);
  
  const [activeSection, setActiveSection] = useState(1);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [formData, setFormData] = useState({
    occupation: "",
    industry: "",
    otherIndustry: "",
    insuranceProvider: "",
    previousDiseases: "",
    familyHistory: "",
  });

  const [medications, setMedications] = useState<Medication[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);

  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "" });
  const [newVaccine, setNewVaccine] = useState({ name: "", date: "", dose: "" });
  const [newSurgery, setNewSurgery] = useState({ name: "", date: "", notes: "" });

  // Load personal data from server on mount
  useEffect(() => {
    const loadPersonalData = async () => {
      try {
        const response = (await ApiClient.get(`/users/personal-data/me`)) as Record<string, any>;
        console.log("DEBUG: Received personal data from server:", response);
        const newData = {
          fullName: response?.fullName || "",
          phone: response?.phone || "",
          bloodType: response?.bloodType || "",
          address: response?.address || "",
          allergies: response?.allergies || "",
          cedula: response?.identityCard || "",
          ciudad: response?.ciudad || "",
        };
        setPersonalData(newData);
        setEditedPersonalData(newData);
        console.log("DEBUG: bloodType set to:", response?.bloodType);
      } catch (error) {
        console.warn("Error loading personal data:", error);
        const rawPersonalData = JSON.parse(localStorage.getItem("personalData") || "{}") as Record<string, any>;
        const newData = {
          fullName: rawPersonalData?.fullName || rawPersonalData?.nombre || "",
          phone: rawPersonalData?.phone || rawPersonalData?.telefono || "",
          bloodType: rawPersonalData?.bloodType || rawPersonalData?.tipo_sangre || "",
          address: rawPersonalData?.address || rawPersonalData?.direccion || "",
          allergies: rawPersonalData?.allergies || rawPersonalData?.alergias || "",
          cedula: rawPersonalData?.identityCard || "",
          ciudad: rawPersonalData?.ciudad || "",
        };
        setPersonalData(newData);
        setEditedPersonalData(newData);
      }
    };
    loadPersonalData();
  }, []);

  const sections = [
    { id: 1, name: "Información Personal", icon: FileText },
    { id: 2, name: "Antecedentes Médicos", icon: FileText },
    { id: 3, name: "Medicamentos", icon: FileText },
    { id: 4, name: "Vacunas", icon: FileText },
    { id: 5, name: "Cirugías", icon: FileText },
  ];

  const getProgressPercentage = () => {
    let completed = 0;
    const total = 5;
    
    if (formData.occupation && formData.industry) completed++;
    if (formData.previousDiseases || formData.familyHistory) completed++;
    if (medications.length > 0) completed++;
    if (vaccines.length > 0) completed++;
    if (surgeries.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const addMedication = () => {
    if (newMed.name && newMed.dosage && newMed.frequency) {
      setMedications([...medications, { ...newMed, id: Date.now().toString() }]);
      setNewMed({ name: "", dosage: "", frequency: "" });
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const addVaccine = () => {
    if (newVaccine.name && newVaccine.date) {
      setVaccines([...vaccines, { ...newVaccine, id: Date.now().toString() }]);
      setNewVaccine({ name: "", date: "", dose: "" });
    }
  };

  const removeVaccine = (id: string) => {
    setVaccines(vaccines.filter(v => v.id !== id));
  };

  const addSurgery = () => {
    if (newSurgery.name && newSurgery.date) {
      setSurgeries([...surgeries, { ...newSurgery, id: Date.now().toString() }]);
      setNewSurgery({ name: "", date: "", notes: "" });
    }
  };

  const removeSurgery = (id: string) => {
    setSurgeries(surgeries.filter(s => s.id !== id));
  };

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      medications,
      vaccines,
      surgeries,
    };
    localStorage.setItem("medicalRecordDraft", JSON.stringify(draftData));
    alert("✓ Borrador guardado exitosamente");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const completeData = {
      ...formData,
      // Si se seleccionó "otro" en industria, usar el valor personalizado
      industry: formData.industry === "other" ? formData.otherIndustry : formData.industry,
      medications,
      vaccines,
      surgeries,
      // Incluir datos personales editados
      personalData: editedPersonalData,
    };
    
    try {
      // Guardar en localStorage
      localStorage.setItem("medicalRecord", JSON.stringify(completeData));
      // También guardar datos personales actualizados
      localStorage.setItem("personalData", JSON.stringify(editedPersonalData));
      
      // Marcar fase 2 como completada
      await ApiClient.completeOnboardingPhase(2);
      
      // Navegar a success (que marcará fase 3 como completa)
      onNavigate?.("/success");
    } catch (error) {
      console.error("Error saving medical record:", error);
      alert("Error al guardar la ficha médica");
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
          <h1 className="text-3xl font-bold mb-2">Ficha Médica Manual</h1>
          <p className="text-muted-foreground">
            Completa tu información médica sección por sección
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Progreso del Formulario</span>
            <span className="text-primary font-bold">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getProgressPercentage() === 100 ? "¡Formulario completo! 🎉" : "Completa todas las secciones para alcanzar el 100%"}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
              <h3 className="font-semibold mb-4 px-2">Secciones</h3>
              <div className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeSection === section.id
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{section.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-8">
              <form onSubmit={handleSubmit}>
                {/* Section 1: Personal Info */}
                {activeSection === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                       <h2 className="text-2xl font-semibold">Información Personal</h2>
                       <button
                         type="button"
                         onClick={() => setIsEditingPersonalData(!isEditingPersonalData)}
                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                           isEditingPersonalData
                             ? "bg-green-500 text-white hover:bg-green-600"
                             : "bg-blue-500 text-white hover:bg-blue-600"
                         }`}
                       >
                         {isEditingPersonalData ? "Cancelar" : "Editar"}
                       </button>
                     </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div>
                        <label className="block mb-2">Nombre completo</label>
                        <input
                          type="text"
                          value={editedPersonalData.fullName}
                          onChange={(e) => setEditedPersonalData({ ...editedPersonalData, fullName: e.target.value })}
                          disabled={!isEditingPersonalData}
                          className={`w-full px-4 py-3 border rounded-lg ${isEditingPersonalData ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50"}`}
                        />
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block mb-2">Teléfono</label>
                        <input
                          type="text"
                          value={editedPersonalData.phone}
                          onChange={(e) => setEditedPersonalData({ ...editedPersonalData, phone: e.target.value })}
                          disabled={!isEditingPersonalData}
                          className={`w-full px-4 py-3 border rounded-lg ${isEditingPersonalData ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50"}`}
                        />
                      </div>

                      {/* Cédula */}
                      <div>
                        <label className="block mb-2">Cédula</label>
                        <input
                          type="text"
                          value={editedPersonalData.cedula}
                          onChange={(e) => setEditedPersonalData({ ...editedPersonalData, cedula: e.target.value })}
                          disabled={!isEditingPersonalData}
                          className={`w-full px-4 py-3 border rounded-lg ${isEditingPersonalData ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50"}`}
                        />
                      </div>

                      {/* Tipo de sangre */}
                      <div>
                        <label className="block mb-2">Tipo de sangre</label>
                        <select
                          value={editedPersonalData.bloodType}
                          onChange={(e) => setEditedPersonalData({ ...editedPersonalData, bloodType: e.target.value })}
                          disabled={!isEditingPersonalData}
                          className={`w-full px-4 py-3 border rounded-lg ${isEditingPersonalData ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50"}`}
                        >
                          <option value="">Seleccionar tipo de sangre</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      {/* Dirección */}
                      <div>
                        <label className="block mb-2">Dirección</label>
                        <input
                          type="text"
                          value={editedPersonalData.address}
                          onChange={(e) => setEditedPersonalData({ ...editedPersonalData, address: e.target.value })}
                          disabled={!isEditingPersonalData}
                          className={`w-full px-4 py-3 border rounded-lg ${isEditingPersonalData ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50"}`}
                        />
                      </div>

                      {/* Ciudad */}
                      <div>
                        <label className="block mb-2">Ciudad</label>
                        <input
                          type="text"
                          value={editedPersonalData.ciudad}
                          onChange={(e) => setEditedPersonalData({ ...editedPersonalData, ciudad: e.target.value })}
                          disabled={!isEditingPersonalData}
                          className={`w-full px-4 py-3 border rounded-lg ${isEditingPersonalData ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50"}`}
                        />
                      </div>

                      {/* Ocupación actual */}
                      <div>
                        <label className="block mb-2">Ocupación actual</label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          placeholder="Ej: Ingeniero, Profesor..."
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                      </div>

                      {/* Industria */}
                      <div>
                        <label className="block mb-2">Industria</label>
                        <select
                          value={formData.industry}
                          onChange={(e) => {
                            setFormData({ ...formData, industry: e.target.value });
                            setShowOtherIndustry(e.target.value === "other");
                          }}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        >
                          <option value="">Seleccionar...</option>
                          <option value="technology">Tecnología</option>
                          <option value="healthcare">Salud</option>
                          <option value="education">Educación</option>
                          <option value="finance">Finanzas</option>
                          <option value="construction">Construcción</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>
                      
                      {showOtherIndustry && (
                        <div>
                          <label className="block mb-2">Especifica tu industria</label>
                          <input
                            type="text"
                            value={formData.otherIndustry}
                            onChange={(e) => setFormData({ ...formData, otherIndustry: e.target.value })}
                            placeholder="Ej: Agricultura, Manufactura..."
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                          />
                        </div>
                      )}

                      {/* Proveedor de seguro */}
                      <div>
                        <label className="block mb-2">Proveedor de seguro</label>
                        <input
                          type="text"
                          value={formData.insuranceProvider}
                          onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                          placeholder="Ej: Seguro Nacional"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 2: Medical History */}
                {activeSection === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Antecedentes Médicos</h2>
                    
                    <div>
                      <label className="block mb-2">Enfermedades previas</label>
                      <textarea
                        value={formData.previousDiseases}
                        onChange={(e) => setFormData({ ...formData, previousDiseases: e.target.value })}
                        placeholder="Describe enfermedades que hayas tenido anteriormente..."
                        rows={4}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background resize-none"
                      />
                    </div>

                    <div>
                      <label className="block mb-2">Historial familiar</label>
                      <textarea
                        value={formData.familyHistory}
                        onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                        placeholder="Enfermedades hereditarias o condiciones familiares relevantes..."
                        rows={4}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background resize-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block">Alergias conocidas</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditingAllergies) {
                              setIsEditingAllergies(false);
                            } else {
                              setEditedPersonalData({ ...editedPersonalData, allergies: personalData?.allergies || "" });
                              setIsEditingAllergies(true);
                            }
                          }}
                          className="text-sm px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          {isEditingAllergies ? "Cancelar" : "Editar"}
                        </button>
                      </div>
                      <textarea
                        value={isEditingAllergies ? (editedPersonalData?.allergies || "") : (personalData?.allergies || "")}
                        onChange={(e) => {
                          if (isEditingAllergies) {
                            setEditedPersonalData({ ...editedPersonalData, allergies: e.target.value });
                          }
                        }}
                        disabled={!isEditingAllergies}
                        rows={2}
                        className={`w-full px-4 py-3 border rounded-lg resize-none ${isEditingAllergies ? "bg-white border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-50 text-muted-foreground"}`}
                      />
                    </div>
                  </div>
                )}

                {/* Section 3: Medications */}
                {activeSection === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Medicamentos Actuales</h2>
                    
                    {/* Medication List */}
                    {medications.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {medications.map((med) => (
                          <div key={med.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
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
                              type="button"
                              onClick={() => removeMedication(med.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Medication */}
                    <div className="p-6 border-2 border-dashed rounded-lg">
                      <h3 className="font-semibold mb-4">Agregar Medicamento</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          value={newMed.name}
                          onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                          placeholder="Nombre del medicamento"
                          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                        <input
                          type="text"
                          value={newMed.dosage}
                          onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                          placeholder="Dosis (ej: 100mg)"
                          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                        <input
                          type="text"
                          value={newMed.frequency}
                          onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                          placeholder="Frecuencia (ej: 1 vez al día)"
                          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                      </div>
                      <button
                        type="button"
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
                {activeSection === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Vacunas</h2>
                    
                    {/* Vaccine List */}
                    {vaccines.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {vaccines.map((vaccine) => (
                          <div key={vaccine.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex-1 grid md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Vacuna</p>
                                <p className="font-semibold">{vaccine.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Fecha</p>
                                <p className="font-semibold">{vaccine.date}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Dosis</p>
                                <p className="font-semibold">{vaccine.dose || "N/A"}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVaccine(vaccine.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Vaccine */}
                    <div className="p-6 border-2 border-dashed rounded-lg">
                      <h3 className="font-semibold mb-4">Agregar Vacuna</h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          value={newVaccine.name}
                          onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
                          placeholder="Nombre de la vacuna"
                          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="date"
                            value={newVaccine.date}
                            onChange={(e) => setNewVaccine({ ...newVaccine, date: e.target.value })}
                            className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                          />
                        </div>
                        <input
                          type="text"
                          value={newVaccine.dose}
                          onChange={(e) => setNewVaccine({ ...newVaccine, dose: e.target.value })}
                          placeholder="Dosis (ej: 1ra dosis)"
                          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                        />
                      </div>
                      <button
                        type="button"
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
                {activeSection === 5 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Cirugías Previas</h2>
                    
                    {/* Surgery List */}
                    {surgeries.length > 0 && (
                      <div className="space-y-3 mb-6">
                        {surgeries.map((surgery) => (
                          <div key={surgery.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex-1">
                              <div className="grid md:grid-cols-2 gap-4 mb-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Cirugía</p>
                                  <p className="font-semibold">{surgery.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Fecha</p>
                                  <p className="font-semibold">{surgery.date}</p>
                                </div>
                              </div>
                              {surgery.notes && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Notas</p>
                                  <p className="text-sm">{surgery.notes}</p>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSurgery(surgery.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Surgery */}
                    <div className="p-6 border-2 border-dashed rounded-lg">
                      <h3 className="font-semibold mb-4">Agregar Cirugía</h3>
                      <div className="space-y-4 mb-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={newSurgery.name}
                            onChange={(e) => setNewSurgery({ ...newSurgery, name: e.target.value })}
                            placeholder="Nombre de la cirugía"
                            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                          />
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="date"
                              value={newSurgery.date}
                              onChange={(e) => setNewSurgery({ ...newSurgery, date: e.target.value })}
                              className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                            />
                          </div>
                        </div>
                        <textarea
                          value={newSurgery.notes}
                          onChange={(e) => setNewSurgery({ ...newSurgery, notes: e.target.value })}
                          placeholder="Notas adicionales (opcional)"
                          rows={3}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background resize-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSurgery}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        Agregar Cirugía
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  {activeSection > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveSection(activeSection - 1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ← Anterior
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Guardar Borrador
                  </button>

                  {activeSection < sections.length ? (
                    <button
                      type="button"
                      onClick={() => setActiveSection(activeSection + 1)}
                      className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-semibold"
                    >
                      Guardar Ficha Completa
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}