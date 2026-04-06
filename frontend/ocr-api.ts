/**
 * API Service para OCR
 * Maneja todas las llamadas al backend para OCR
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface OcrScanResponse {
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

export interface MedicationItem {
  nombre: string;
  dosis?: string;
  frecuencia?: string;
  motivo?: string;
}

export interface VaccineItem {
  nombre: string;
  fecha_aplicacion?: string;
  numero_dosis?: number;
  lote?: string;
}

export interface SurgeryItem {
  nombre_procedimiento: string;
  fecha?: string;
  motivo?: string;
}

export interface OcrSaveRequest {
  user_id: number;
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  telefono?: string;
  ocupacion?: string;
  alergias?: string;
  antecedentes_patologicos_personales?: string;
  antecedentes_familiares?: string;
  medicaciones: MedicationItem[];
  vacunas: VaccineItem[];
  antecedentes_quirurgicos: SurgeryItem[];
  contacto_emergencia?: {
    nombre?: string;
    telefono?: string;
    relacion?: string;
  };
}

export interface OcrSaveResponse {
  success: boolean;
  message: string;
  medical_record_id?: number;
  user_id: number;
}

/**
 * Escanea una ficha médica usando OCR
 */
export async function scanMedicalRecord(file: File): Promise<OcrScanResponse> {
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

/**
 * Guarda los datos del OCR confirmados en la base de datos
 */
export async function saveMedicalData(request: OcrSaveRequest): Promise<OcrSaveResponse> {
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

/**
 * Parsea medicaciones de un string (ej: "Ibuprofeno 400mg, Metformina 500mg")
 */
export function parseMedications(medicationStr: string): MedicationItem[] {
  if (!medicationStr) return [];

  return medicationStr
    .split(",")
    .map((med) => {
      const trimmed = med.trim();
      // Intentar extraer dosis del formato "Nombre Dosis"
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

/**
 * Parsea vacunas de un string (ej: "COVID-19 (3 dosis), Influenza (2025)")
 */
export function parseVaccines(vaccineStr: string): VaccineItem[] {
  if (!vaccineStr) return [];

  return vaccineStr
    .split(",")
    .map((vac) => {
      const trimmed = vac.trim();
      // Intentar extraer dosis o año
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

/**
 * Parsea cirugías de un string (ej: "Apendicectomía (Marzo 2020), Extirpación de lunar")
 */
export function parseSurgeries(surgeryStr: string): SurgeryItem[] {
  if (!surgeryStr) return [];

  return surgeryStr
    .split(",")
    .map((surg) => {
      const trimmed = surg.trim();
      // Intentar extraer fecha
      const dateMatch = trimmed.match(/\(([^)]+)\)$/);

      return {
        nombre_procedimiento: trimmed.replace(/\s*\([^)]*\)$/, "").trim(),
        fecha: dateMatch ? dateMatch[1] : undefined,
        motivo: undefined,
      };
    })
    .filter((surg) => surg.nombre_procedimiento);
}
