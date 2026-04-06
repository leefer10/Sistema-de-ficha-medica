import { useState } from "react";
import { Heart, Upload, Camera, ImageIcon, Loader2, CheckCircle, Edit2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { ApiClient } from "@/api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
interface OcrScanResponse {
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  telefono?: string;
  ocupacion?: string;
  alergias?: string;
  antecedentes_patologicos_personales?: string;
  antecedentes_familiares?: string;
  medicacion?: string;
  vacunas?: string;
  antecedentes_quirurgicos?: string;
  contacto_emergencia?: {
    nombre?: string;
    telefono?: string;
    relacion?: string;
  };
  texto_crudo?: string;
  advertencia?: string;
}

interface MedicationItem {
  nombre: string;
  dosis?: string;
  frecuencia?: string;
  motivo?: string;
}

interface VaccineItem {
  nombre: string;
  fecha_aplicacion?: string;
  numero_dosis?: number;
  lote?: string;
}

interface SurgeryItem {
  nombre_procedimiento: string;
  fecha?: string;
  motivo?: string;
}

interface ExtractedData {
  // Datos personales
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  telefono?: string;
  ocupacion?: string;
  alergias?: string;
  antecedentes_patologicos_personales?: string;
  antecedentes_familiares?: string;
  contacto_emergencia?: {
    nombre?: string;
    telefono?: string;
    relacion?: string;
  };
  texto_crudo?: string;
  advertencia?: string;
  // Datos parseados
  medicaciones: MedicationItem[];
  vacunas: VaccineItem[];
  antecedentes_quirurgicos: SurgeryItem[];
}

interface OcrUploadPageProps {
  onNavigate?: (path: string) => void;
}

// API Functions
async function scanMedicalRecord(file: File): Promise<OcrScanResponse> {
  const formData = new FormData();
  formData.append("imagen", file);

  const response = await fetch(`${API_URL}/fichas/scan`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al procesar la imagen");
  }

  return response.json();
}

async function saveMedicalData(request: any): Promise<any> {
  const response = await fetch(`${API_URL}/fichas/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Error al guardar los datos");
  }

  return response.json();
}

function parseMedications(medicationStr: string): MedicationItem[] {
  if (!medicationStr) return [];

  return medicationStr
    .split(",")
    .map((med) => {
      const trimmed = med.trim();
      const match = trimmed.match(/^([^0-9]+?)\s*([0-9]{1,4}\s*(?:mg|ml|g|iu|%)?)?(.*)$/i);

      return {
        nombre: match?.[1]?.trim() || trimmed,
        dosis: match?.[2]?.trim(),
        frecuencia: undefined,
        motivo: undefined,
      };
    })
    .filter((med) => med.nombre);
}

function parseVaccines(vaccineStr: string): VaccineItem[] {
  if (!vaccineStr) return [];

  return vaccineStr
    .split(",")
    .map((vac) => {
      const trimmed = vac.trim();
      const dosisMatch = trimmed.match(/\((\d+)\s*dosis\)/i);
      const yearMatch = trimmed.match(/\((\d{4})\)/);

      return {
        nombre: trimmed
          .replace(/\s*\(\d+\s*dosis\)/i, "")
          .replace(/\s*\(\d{4}\)/, "")
          .trim(),
        numero_dosis: dosisMatch ? parseInt(dosisMatch[1]) : undefined,
        fecha_aplicacion: undefined,
        lote: undefined,
      };
    })
    .filter((vac) => vac.nombre);
}

function parseSurgeries(surgeryStr: string): SurgeryItem[] {
  if (!surgeryStr) return [];

  return surgeryStr
    .split(",")
    .map((surg) => {
      const trimmed = surg.trim();
      const dateMatch = trimmed.match(/\(([^)]+)\)$/);

      return {
        nombre_procedimiento: trimmed.replace(/\s*\([^)]*\)$/, "").trim(),
        fecha: dateMatch ? dateMatch[1] : undefined,
        motivo: undefined,
      };
    })
    .filter((surg) => surg.nombre_procedimiento);
}

export function OcrUploadPage({ onNavigate }: OcrUploadPageProps) {
  const [step, setStep] = useState<"upload" | "preview" | "processing" | "review" | "saving">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setStep("preview");
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setStep("preview");
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!uploadedFile) return;

    setStep("processing");
    setError(null);

    try {
      // Llamar al backend para escanear
      const scanResult = await scanMedicalRecord(uploadedFile);

      // Parsear datos de string a arrays
      const parsed: ExtractedData = {
        ...scanResult,
        medicaciones: parseMedications(scanResult.medicacion || ""),
        vacunas: parseVaccines(scanResult.vacunas || ""),
        antecedentes_quirurgicos: parseSurgeries(scanResult.antecedentes_quirurgicos || ""),
      };

      // Obtener user_id del localStorage o session
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
      }

      setExtractedData(parsed);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la imagen. Intenta con una foto más clara.");
      setStep("preview");
    }
  };

  const handleEditField = (field: string, newValue: string) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        [field]: newValue,
      });
      setEditingField(null);
    }
  };

  const handleAddMedication = () => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        medicaciones: [
          ...extractedData.medicaciones,
          { nombre: "", dosis: "", frecuencia: "", motivo: "" },
        ],
      });
    }
  };

  const handleRemoveMedication = (index: number) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        medicaciones: extractedData.medicaciones.filter((_, i) => i !== index),
      });
    }
  };

  const handleUpdateMedication = (index: number, field: keyof MedicationItem, value: string) => {
    if (extractedData) {
      const updated = [...extractedData.medicaciones];
      updated[index] = { ...updated[index], [field]: value };
      setExtractedData({ ...extractedData, medicaciones: updated });
    }
  };

  const handleSave = async () => {
    if (!extractedData || !userId) {
      setError("Información incompleta. Por favor, intenta de nuevo.");
      return;
    }

    setStep("saving");
    setError(null);

    try {
      const saveRequest = {
        user_id: userId,
        nombre: extractedData.nombre,
        apellido: extractedData.apellido,
        fecha_nacimiento: extractedData.fecha_nacimiento,
        direccion: extractedData.direccion,
        telefono: extractedData.telefono,
        ocupacion: extractedData.ocupacion,
        alergias: extractedData.alergias,
        antecedentes_patologicos_personales: extractedData.antecedentes_patologicos_personales,
        antecedentes_familiares: extractedData.antecedentes_familiares,
        medicaciones: extractedData.medicaciones,
        vacunas: extractedData.vacunas,
        antecedentes_quirurgicos: extractedData.antecedentes_quirurgicos,
        contacto_emergencia: extractedData.contacto_emergencia,
      };

      const result = await saveMedicalData(saveRequest);

      if (result.success) {
        // Marcar fase 2 como completada después de guardar exitosamente
        await ApiClient.completeOnboardingPhase(2);
        
        // Guardar en localStorage para referencia
        localStorage.setItem("medicalRecord", JSON.stringify(extractedData));
        localStorage.setItem("medicalRecordId", result.medical_record_id?.toString() || "");
        onNavigate?.("/success");
      } else {
        setError(result.message || "Error al guardar los datos");
        setStep("review");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los datos");
      setStep("review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-primary" />
            <span className="text-2xl font-semibold">Hermanos Para su Salud</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {step === "upload" && "Escanea tu Ficha Médica"}
            {step === "preview" && "Vista Previa"}
            {step === "processing" && "Procesando..."}
            {step === "review" && "Revisión de Datos Escaneados"}
            {step === "saving" && "Guardando..."}
          </h1>
          <p className="text-muted-foreground">
            {step === "upload" && "Digitaliza tu ficha médica usando OCR"}
            {step === "preview" && "Verifica tu imagen antes de procesarla"}
            {step === "processing" && "Extrayendo información de tu documento"}
            {step === "review" && "Revisa y corrige los datos extraídos"}
            {step === "saving" && "Guardando tu información médica"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Step */}
        {step === "upload" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            >
              <input
                type="file"
                id="file-upload"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </h3>
                <p className="text-muted-foreground mb-6">
                  Formatos aceptados: JPG, PNG, WEBP (Máx. 10MB)
                </p>
              </label>

              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="flex items-center justify-center gap-2 py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Tomar Foto con Cámara
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  className="flex items-center justify-center gap-2 py-3 px-6 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                  Seleccionar de Galería
                </button>
              </div>
            </div>

            {/* Manual Option */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-2">¿Prefieres ingresar los datos manualmente?</p>
              <button onClick={() => onNavigate?.("/manual-form")} className="text-primary hover:underline font-medium">
                Rellenar manualmente en su lugar
              </button>
            </div>
          </div>
        )}

        {/* Preview Step */}
        {step === "preview" && preview && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="rounded-xl overflow-hidden border mb-6">
              {uploadedFile?.type === "application/pdf" ? (
                <div className="bg-gray-100 p-12 text-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Vista previa de PDF: {uploadedFile.name}</p>
                </div>
              ) : (
                <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleProcess}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Escanear Documento
              </button>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setPreview("");
                  setStep("upload");
                  setError(null);
                }}
                className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cambiar Imagen
              </button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === "processing" && (
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold mb-3">Procesando tu ficha médica...</h3>
              <p className="text-muted-foreground mb-6">
                Estamos extrayendo la información de tu documento con Google Cloud Vision
              </p>
              <div className="max-w-md mx-auto">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "75%" }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Analizando imagen...</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === "review" && extractedData && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Revisa los datos extraidos</h2>
              </div>

              {/* Datos Personales */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-primary">👤</span> Datos Personales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["nombre", "apellido", "fecha_nacimiento", "telefono", "direccion", "ocupacion"].map((field) => (
                      <div key={field} className="p-4 border rounded-lg">
                        <label className="text-sm font-semibold text-muted-foreground capitalize">
                          {field.replace(/_/g, " ")}
                        </label>
                        {editingField === field ? (
                          <input
                            type="text"
                            value={extractedData[field as keyof typeof extractedData] as string || ""}
                            onChange={(e) => handleEditField(field, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        ) : (
                          <p className="mt-2 text-foreground font-medium">
                            {extractedData[field as keyof typeof extractedData] as string || "—"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historial Médico */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-primary">⚕️</span> Historial Médico
                  </h3>
                  <div className="space-y-4">
                    {["alergias", "antecedentes_patologicos_personales", "antecedentes_familiares"].map((field) => (
                      <div key={field} className="p-4 border rounded-lg">
                        <label className="text-sm font-semibold text-muted-foreground capitalize">
                          {field.replace(/_/g, " ")}
                        </label>
                        {editingField === field ? (
                          <textarea
                            value={(extractedData[field as keyof ExtractedData] as string) || ""}
                            onChange={(e) => handleEditField(field, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            rows={3}
                          />
                        ) : (
                          <p className="mt-2 text-foreground">{(extractedData[field as keyof ExtractedData] as string) || "—"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medicaciones */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-primary">💊</span> Medicaciones
                  </h3>
                  <div className="space-y-3">
                    {extractedData.medicaciones.map((med, idx) => (
                      <div key={idx} className="p-4 border rounded-lg flex gap-3 items-start">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Nombre"
                            value={med.nombre}
                            onChange={(e) => handleUpdateMedication(idx, "nombre", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Dosis"
                            value={med.dosis || ""}
                            onChange={(e) => handleUpdateMedication(idx, "dosis", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="Frecuencia"
                            value={med.frecuencia || ""}
                            onChange={(e) => handleUpdateMedication(idx, "frecuencia", e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveMedication(idx)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddMedication}
                      className="w-full py-2 border border-dashed rounded-lg text-primary hover:bg-primary/5 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar medicación
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning for low quality */}
              {extractedData.advertencia && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-1">Advertencia</h4>
                      <p className="text-sm text-orange-800">{extractedData.advertencia}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    setStep("upload");
                    setPreview("");
                    setUploadedFile(null);
                    setExtractedData(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Escanear otra imagen
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Guardar Ficha Médica
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saving Step */}
        {step === "saving" && (
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
              <h3 className="text-2xl font-semibold mb-3">Guardando tu información...</h3>
              <p className="text-muted-foreground">Por favor espera mientras guardamos tus datos en la base de datos</p>
            </div>
          </div>
        )}

        {/* Back/Skip Options */}
        {(step === "upload" || step === "preview") && (
          <div className="mt-6 flex justify-between text-sm">
            <button
              onClick={() => onNavigate?.("/method-selection")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Volver a Métodos
            </button>
            <button
              onClick={() => onNavigate?.("/dashboard")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Omitir por ahora →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

