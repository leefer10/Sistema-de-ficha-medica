import { useState, useEffect } from "react";
import { Heart, Save, ArrowLeft, Calendar, User, Building, FileText, AlertCircle, X, Plus, Trash2, Pill, Upload, Image as ImageIcon } from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface ConsultationForm {
  type: "consulta" | "laboratorio" | "vacuna" | "cirugía" | "emergencia" | "chequeo";
  title: string;
  date: string;
  doctor: string;
  facility: string;
  summary: string;
  status: "completado" | "pendiente" | "cancelado";
  // Campos específicos según tipo
  diagnosis?: string;
  treatment?: string;
  testResults?: string;
  vaccineName?: string;
  vaccineDose?: string;
  surgeryType?: string;
  complications?: string;
  recommendations?: string;
  medications?: Medication[];
  prescriptionImages?: string[]; // Array de imágenes en base64
}

interface AddConsultationPageProps {
  onNavigate?: (path: string) => void;
}

export function AddConsultationPage({ onNavigate }: AddConsultationPageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showWarning, setShowWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [prescriptionImages, setPrescriptionImages] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: ""
  });

  const [formData, setFormData] = useState<ConsultationForm>({
    type: "consulta",
    title: "",
    date: new Date().toISOString().split('T')[0],
    doctor: "",
    facility: "",
    summary: "",
    status: "completado",
    diagnosis: "",
    treatment: "",
    testResults: "",
    vaccineName: "",
    vaccineDose: "",
    surgeryType: "",
    complications: "",
    recommendations: "",
    medications: [],
    prescriptionImages: []
  });

  // Check if user has dismissed the warning before
  useEffect(() => {
    const dismissed = localStorage.getItem("dismissConsultationWarning");
    if (!dismissed) {
      setShowWarning(true);
    }
    
    // Load draft if exists
    const draft = localStorage.getItem("consultationDraft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        if (parsedDraft.medications) {
          setMedications(parsedDraft.medications);
        }
        if (parsedDraft.prescriptionImages) {
          setPrescriptionImages(parsedDraft.prescriptionImages);
        }
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);

  // Auto-save draft every time form changes
  useEffect(() => {
    const draftData = { ...formData, medications, prescriptionImages };
    localStorage.setItem("consultationDraft", JSON.stringify(draftData));
  }, [formData, medications, prescriptionImages]);

  const handleCloseWarning = () => {
    if (dontShowAgain) {
      localStorage.setItem("dismissConsultationWarning", "true");
    }
    setShowWarning(false);
  };

  const handleAddMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()) {
      alert("Por favor completa todos los campos del medicamento");
      return;
    }
    
    setMedications([...medications, newMedication]);
    setNewMedication({ name: "", dosage: "", frequency: "" });
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: keyof ConsultationForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPrescriptionImages([...prescriptionImages, reader.result as string]);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setPrescriptionImages(prescriptionImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.date) newErrors.date = "La fecha es obligatoria";
    if (!formData.doctor.trim()) newErrors.doctor = "El profesional es obligatorio";
    if (!formData.facility.trim()) newErrors.facility = "La institución es obligatoria";
    if (!formData.summary.trim()) newErrors.summary = "El resumen es obligatorio";

    // Validaciones específicas por tipo
    if (formData.type === "consulta" && !formData.diagnosis?.trim()) {
      newErrors.diagnosis = "El diagnóstico es obligatorio para consultas";
    }
    if (formData.type === "vacuna" && !formData.vaccineName?.trim()) {
      newErrors.vaccineName = "El nombre de la vacuna es obligatorio";
    }
    if (formData.type === "laboratorio" && !formData.testResults?.trim()) {
      newErrors.testResults = "Los resultados son obligatorios";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    // Load existing consultations
    const existingConsultations = JSON.parse(localStorage.getItem("medicalConsultations") || "[]");

    // Create new consultation with medications and prescription images
    const newConsultation = {
      id: Date.now().toString(),
      ...formData,
      medications: medications, // Include medications
      prescriptionImages: prescriptionImages, // Include prescription images
      createdAt: new Date().toISOString(),
    };

    // Add to array
    existingConsultations.unshift(newConsultation); // Add to beginning

    // Save to localStorage
    localStorage.setItem("medicalConsultations", JSON.stringify(existingConsultations));

    // Remove draft
    localStorage.removeItem("consultationDraft");

    setTimeout(() => {
      setIsSaving(false);
      onNavigate?.("/medical-history");
    }, 800);
  };

  const getTypeConfig = (type: string) => {
    return consultationTypes.find((t) => t.value === type) || consultationTypes[0];
  };

  const currentType = getTypeConfig(formData.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseWarning}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">⚠️ Aviso Importante</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  La información que registres en esta consulta <strong>NO PODRÁ SER EDITADA</strong> una vez guardada. 
                  Sin embargo, <strong>se guardará automáticamente una copia de respaldo</strong> mientras escribes, 
                  para que no pierdas tu progreso si cierras la página accidentalmente.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Revisa cuidadosamente toda la información antes de presionar "Guardar Consulta".
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="mt-0.5"
                />
                <span>No volver a mostrar este mensaje</span>
              </label>
              
              <button
                onClick={handleCloseWarning}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Entendido, Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Hermanos Para su Salud</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-md p-6 border mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-lg bg-${currentType.color}-100 flex items-center justify-center text-2xl`}>
              {currentType.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Registrar Nueva Consulta</h1>
              <p className="text-muted-foreground">
                Agrega información sobre tu visita médica o procedimiento
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <label className="block text-sm font-medium mb-3">
              Tipo de Consulta <span className="text-destructive">*</span>
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {consultationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange("type", type.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-sm">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-xl font-semibold mb-4">Información Básica</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Título de la Consulta <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ej: Consulta General Anual"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.title ? "border-destructive" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.date ? "border-destructive" : ""
                    }`}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="completado">Completado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Profesional de Salud <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.doctor}
                    onChange={(e) => handleInputChange("doctor", e.target.value)}
                    placeholder="Ej: Dr. María González"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.doctor ? "border-destructive" : ""
                    }`}
                  />
                  {errors.doctor && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.doctor}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Institución/Centro <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.facility}
                    onChange={(e) => handleInputChange("facility", e.target.value)}
                    placeholder="Ej: Hospital Central"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.facility ? "border-destructive" : ""
                    }`}
                  />
                  {errors.facility && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.facility}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Resumen General <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Describe brevemente el motivo y resultado de la consulta"
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.summary ? "border-destructive" : ""
                  }`}
                />
                {errors.summary && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.summary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Specific Fields by Type */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <h2 className="text-xl font-semibold mb-4">
              Detalles Específicos - {currentType.label}
            </h2>

            {/* Consulta General */}
            {formData.type === "consulta" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Diagnóstico <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.diagnosis || ""}
                    onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                    placeholder="Diagnóstico realizado por el médico"
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.diagnosis ? "border-destructive" : ""
                    }`}
                  />
                  {errors.diagnosis && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.diagnosis}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tratamiento Indicado
                  </label>
                  <textarea
                    value={formData.treatment || ""}
                    onChange={(e) => handleInputChange("treatment", e.target.value)}
                    placeholder="Tratamiento o medicamentos prescritos"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Laboratorio */}
            {formData.type === "laboratorio" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resultados del Análisis <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.testResults || ""}
                    onChange={(e) => handleInputChange("testResults", e.target.value)}
                    placeholder="Detalla los resultados obtenidos del laboratorio"
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.testResults ? "border-destructive" : ""
                    }`}
                  />
                  {errors.testResults && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.testResults}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Vacuna */}
            {formData.type === "vacuna" && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre de la Vacuna <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.vaccineName || ""}
                      onChange={(e) => handleInputChange("vaccineName", e.target.value)}
                      placeholder="Ej: COVID-19 Pfizer"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.vaccineName ? "border-destructive" : ""
                      }`}
                    />
                    {errors.vaccineName && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.vaccineName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dosis
                    </label>
                    <input
                      type="text"
                      value={formData.vaccineDose || ""}
                      onChange={(e) => handleInputChange("vaccineDose", e.target.value)}
                      placeholder="Ej: 1ra dosis, Refuerzo"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cirugía */}
            {formData.type === "cirugía" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Procedimiento
                  </label>
                  <input
                    type="text"
                    value={formData.surgeryType || ""}
                    onChange={(e) => handleInputChange("surgeryType", e.target.value)}
                    placeholder="Ej: Apendicectomía laparoscópica"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Complicaciones (si hubo)
                  </label>
                  <textarea
                    value={formData.complications || ""}
                    onChange={(e) => handleInputChange("complications", e.target.value)}
                    placeholder="Describe si hubo alguna complicación"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Emergencia y Chequeo - campos comunes */}
            {(formData.type === "emergencia" || formData.type === "chequeo") && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recomendaciones
                  </label>
                  <textarea
                    value={formData.recommendations || ""}
                    onChange={(e) => handleInputChange("recommendations", e.target.value)}
                    placeholder="Recomendaciones dadas por el profesional de salud"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Medications */}
            {formData.type === "consulta" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-2">Medicamentos Prescritos</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre del Medicamento
                    </label>
                    <input
                      type="text"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      placeholder="Ej: Paracetamol"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dosis
                    </label>
                    <input
                      type="text"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                      placeholder="Ej: 500 mg"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Frecuencia
                    </label>
                    <input
                      type="text"
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                      placeholder="Ej: Cada 8 horas"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Medicamento
                </button>
                {medications.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Lista de Medicamentos</h4>
                    <ul className="space-y-2">
                      {medications.map((med, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Pill className="w-5 h-5" />
                            <span className="font-medium">{med.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{med.dosage}</span>
                            <span className="text-sm">({med.frequency})</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMedication(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Prescription Images */}
            {formData.type === "consulta" && (
              <div className="space-y-4 mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Fotos de Recetas Médicas
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sube fotografías de tus recetas médicas para mantener un respaldo digital
                </p>
                
                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="prescription-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors cursor-pointer w-full md:w-auto"
                  >
                    <Upload className="w-5 h-5" />
                    Subir Foto de Receta
                  </label>
                </div>

                {/* Image Preview Grid */}
                {prescriptionImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Recetas Subidas ({prescriptionImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {prescriptionImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50">
                            <img
                              src={image}
                              alt={`Receta ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
                            title="Eliminar imagen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            Receta {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Las imágenes se guardan de forma segura en tu navegador. Asegúrate de que las fotos sean legibles y contengan toda la información de la receta.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-md p-6 border">
            <div className="flex flex-wrap gap-4 justify-end">
              <button
                type="button"
                onClick={() => onNavigate?.("/dashboard")}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSaving ? "Guardando..." : "Guardar Consulta"}
              </button>
            </div>
          </div>
        </form>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <span className="text-primary mt-0.5">💡</span>
            <span>
              Toda la información que registres aquí será guardada de forma segura y podrás 
              consultarla en tu historial médico completo. Los campos marcados con * son obligatorios.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const consultationTypes = [
  { value: "consulta", label: "Consulta Médica", icon: "🩺", color: "blue" },
  { value: "laboratorio", label: "Análisis de Laboratorio", icon: "🧪", color: "purple" },
  { value: "vacuna", label: "Vacuna", icon: "💉", color: "green" },
  { value: "cirugía", label: "Cirugía/Procedimiento", icon: "⚕️", color: "red" },
  { value: "emergencia", label: "Consulta de Emergencia", icon: "🚑", color: "orange" },
  { value: "chequeo", label: "Chequeo General", icon: "📋", color: "teal" },
];