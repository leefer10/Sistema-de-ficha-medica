/**
 * API Client - Wrapper centralizado para todas las llamadas al backend
 * Maneja:
 * - Base URL del API
 * - Authorization headers con JWT
 * - Error handling
 * - Token management
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiError {
  detail?: string;
  message?: string;
}

export class ApiClient {
  /**
   * Obtiene los headers necesarios para cada request
   * Incluye automáticamente el JWT token si existe
   */
  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Maneja respuestas del servidor
   * Si es 401, limpia token y redirige a login
   * Si hay error, lanza excepción
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    // 401 Unauthorized - Token expirado o inválido
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
      throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.");
    }

    // 403 Forbidden - Sin permisos
    if (response.status === 403) {
      throw new Error("No tienes permiso para acceder a esto.");
    }

    // 404 Not Found
    if (response.status === 404) {
      throw new Error("Recurso no encontrado.");
    }

    // Respuestas sin contenido (204, 201, etc.)
    if (response.status === 204) {
      return null as T;
    }

    // Intentar parsear JSON
    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error(`Error al procesar respuesta del servidor`);
    }

    // Si la respuesta no fue exitosa
    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `Error HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  }

  /**
   * GET request
   */
  static async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST request
   */
  static async post<T>(endpoint: string, body: any): Promise<T> {
    try {
      let finalBody: any;
      let headers = this.getHeaders();
      
      // Si es URLSearchParams, enviar como form-data
      if (body instanceof URLSearchParams) {
        finalBody = body.toString();
        headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else {
        finalBody = JSON.stringify(body);
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: finalBody,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT request
   */
  static async put<T>(endpoint: string, body: any): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE request
   */
  static async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST para file uploads (FormData)
   * Importante: NO incluir Content-Type, browser lo hace automáticamente
   */
  static async postFile<T>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const headers: HeadersInit = {};
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extrae user_id del JWT almacenado
   * El JWT tiene formato: header.payload.signature
   * El payload contiene: {sub: "user_id", role: "user"}
   */
  static extractUserId(): number | null {
    const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return parseInt(payload.sub, 10);
    } catch (error) {
      console.error("Error extrayendo user_id del JWT:", error);
      return null;
    }
  }

  /**
   * Logout - limpia token y redirige a login
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem("authToken");
  }

  // ==================== ONBOARDING ====================
  static async getOnboardingStatus(): Promise<OnboardingStatus> {
    return this.get<OnboardingStatus>(`/users/me/onboarding`);
  }

  static async completeOnboardingPhase(phaseNumber: number): Promise<OnboardingStatus> {
    return this.post<OnboardingStatus>(`/users/me/onboarding/phase/${phaseNumber}/complete`, {});
  }

  static async resetOnboardingPhase(phaseNumber: number): Promise<OnboardingStatus> {
    return this.post<OnboardingStatus>(`/users/me/onboarding/phase/${phaseNumber}/reset`, {});
  }

  // ==================== QR ====================
  static async getMyQR(userId: number) {
    return this.get(`/my-qr`);
  }

  // ==================== MEDICATIONS ====================
  static async addMedication(userId: number, data: any) {
    return this.post(`/users/medications/${userId}`, data);
  }

  static async getMedications(userId: number) {
    return this.get(`/users/medications/${userId}`);
  }

  static async updateMedication(userId: number, medId: number, data: any) {
    return this.put(`/users/medications/${userId}/${medId}`, data);
  }

  static async deleteMedication(userId: number, medId: number) {
    return this.delete(`/users/medications/${userId}/${medId}`);
  }

  // ==================== VACCINES ====================
  static async addVaccine(userId: number, data: any) {
    return this.post(`/users/vaccines/${userId}`, data);
  }

  static async getVaccines(userId: number) {
    return this.get(`/users/vaccines/${userId}`);
  }

  static async updateVaccine(userId: number, vacId: number, data: any) {
    return this.put(`/users/vaccines/${userId}/${vacId}`, data);
  }

  static async deleteVaccine(userId: number, vacId: number) {
    return this.delete(`/users/vaccines/${userId}/${vacId}`);
  }

  // ==================== SURGERIES ====================
  static async addSurgery(userId: number, data: any) {
    return this.post(`/users/surgeries/${userId}`, data);
  }

  static async getSurgeries(userId: number) {
    return this.get(`/users/surgeries/${userId}`);
  }

  static async updateSurgery(userId: number, surgId: number, data: any) {
    return this.put(`/users/surgeries/${userId}/${surgId}`, data);
  }

  static async deleteSurgery(userId: number, surgId: number) {
    return this.delete(`/users/surgeries/${userId}/${surgId}`);
  }

  // ==================== EMERGENCY CONTACTS ====================
  static async addEmergencyContact(userId: number, data: any) {
    return this.post(`/users/emergency-contacts/${userId}`, data);
  }

  static async getEmergencyContacts(userId: number) {
    return this.get(`/users/emergency-contacts/${userId}`);
  }

  static async updateEmergencyContact(userId: number, contactId: number, data: any) {
    return this.put(`/users/emergency-contacts/${userId}/${contactId}`, data);
  }

  static async deleteEmergencyContact(userId: number, contactId: number) {
    return this.delete(`/users/emergency-contacts/${userId}/${contactId}`);
  }

  // ==================== HABITS ====================
  static async getHabits(userId: number) {
    return this.get(`/users/habits/${userId}`);
  }

  static async saveHabits(userId: number, data: any) {
    // Try PUT first (update), if 404 then POST (create)
    try {
      return await this.put(`/users/habits/${userId}`, data);
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        return await this.post(`/users/habits/${userId}`, data);
      }
      throw err;
    }
  }

  static async updateHabits(userId: number, data: any) {
    return this.put(`/users/habits/${userId}`, data);
  }
}

// Tipos de respuesta común
export interface OnboardingStatus {
  phase_1_complete: boolean;
  phase_2_complete: boolean;
  phase_3_complete: boolean;
  all_complete: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  role: string;
  created_at: string;
}

// ==================== MEDICAL ITEMS ====================

export interface Medication {
  id: number;
  nombre: string;
  dosis?: string;
  frecuencia?: string;
  motivo?: string;
  activo: boolean;
  medical_record_id: number;
  created_at: string;
  updated_at: string;
}

export interface Vaccine {
  id: number;
  nombre: string;
  fecha_aplicacion?: string;
  numero_dosis?: number;
  lote?: string;
  observaciones?: string;
  medical_record_id: number;
  created_at: string;
  updated_at: string;
}

export interface Surgery {
  id: number;
  nombre_procedimiento: string;
  fecha?: string;
  motivo?: string;
  hospital?: string;
  complicaciones?: string;
  medical_record_id: number;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: number;
  nombre: string;
  telefono: string;
  relacion: string;
  medical_record_id: number;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: number;
  fuma: boolean;
  consume_alcohol: "nunca" | "ocasional" | "frecuente";
  nivel_ejercicio: "sedentario" | "leve" | "moderado" | "intenso";
  tipo_dieta?: string;
  consume_drogas: boolean;
  observaciones?: string;
  medical_record_id: number;
  created_at: string;
  updated_at: string;
}
