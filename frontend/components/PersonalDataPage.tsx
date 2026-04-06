"use client";

import { useState, useEffect } from "react";
import { Heart, Calendar, User, Droplet, AlertCircle, Phone, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { ApiClient } from "@/api-client";

interface PersonalDataPageProps {
  onNavigate?: (path: string) => void;
}

export function PersonalDataPage({ onNavigate }: PersonalDataPageProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    bloodType: "",
    identityCard: "",
    phone: "",
    address: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  const userId = ApiClient.extractUserId();

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ApiClient.get<Record<string, any>>(`/users/personal-data/me`);
        if (response) {
          setFormData((prev) => ({
            ...prev,
            fullName: response.fullName || "",
            birthDate: response.birthDate || "",
            gender: response.gender || "",
            bloodType: response.bloodType || "",
            identityCard: response.identityCard || "",
            phone: response.phone || "",
            address: response.address || "",
            allergies: response.allergies || "",
            chronicConditions: response.chronicConditions || "",
            emergencyContact: response.emergencyContact || "",
            emergencyRelation: response.emergencyRelation || "",
            emergencyPhone: response.emergencyPhone || "",
          }));
        }
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
        setError(errorMessage);
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nombre completo es requerido";
    }
    if (!formData.bloodType) {
      newErrors.bloodType = "Tipo de sangre es requerido";
    }
    if (!formData.identityCard.trim()) {
      newErrors.identityCard = "Cédula es requerida";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Teléfono personal es requerido";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Teléfono debe tener 10 dígitos ecuatorianos";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Dirección es requerida";
    }
    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = "Contacto de emergencia es requerido";
    }
    if (!formData.emergencyRelation) {
      newErrors.emergencyRelation = "Relación es requerida";
    }
    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = "Teléfono de emergencia es requerido";
    } else if (!/^\d{10}$/.test(formData.emergencyPhone.replace(/\D/g, ""))) {
      newErrors.emergencyPhone = "Teléfono debe tener 10 dígitos ecuatorianos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!userId) {
      setError("Usuario no autenticado");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        bloodType: formData.bloodType,
        identityCard: formData.identityCard,
        phone: formData.phone,
        address: formData.address,
        allergies: formData.allergies,
        chronicConditions: formData.chronicConditions,
        emergencyContact: formData.emergencyContact,
        emergencyRelation: formData.emergencyRelation,
        emergencyPhone: formData.emergencyPhone,
      };

      await ApiClient.post(`/users/personal-data/me`, payload);

      // Save to localStorage for frontend use
      localStorage.setItem("personalData", JSON.stringify(payload));

      // Mark phase 1 as complete
      try {
        await ApiClient.completeOnboardingPhase(1);
      } catch (err) {
        console.warn("Error marking phase 1 complete:", err);
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigate?.("/welcome");
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar datos";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldStatus = (name: string) => {
    if (!touched[name]) return null;
    return errors[name] ? "error" : "success";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => onNavigate?.("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Editar Datos Personales</h1>
            <p className="text-muted-foreground">Actualiza tu información médica y de contacto</p>
          </div>
        </div>

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
              <p className="text-sm text-green-800">Datos guardados correctamente. Redirigiendo...</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center">
                  OK
                </div>
                <div className="w-20 h-1 bg-accent"></div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  2
                </div>
                <div className="w-20 h-1 bg-muted"></div>
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  3
                </div>
              </div>
              <div className="flex justify-between max-w-md mx-auto text-sm">
                <span className="text-accent font-medium">Bienvenida</span>
                <span className="text-primary font-medium">Datos Personales</span>
                <span className="text-muted-foreground">Ficha Médica</span>
              </div>
              <div className="mt-4">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-primary rounded-full transition-all duration-300"></div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">Paso 2 de 3</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre Completo */}
              <div className="md:col-span-2">
                <label className="block mb-2">Nombre completo <span className="text-destructive">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Juan Pérez García"
                    className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                      getFieldStatus("fullName") === "error" ? "border-destructive focus:ring-destructive" : 
                      getFieldStatus("fullName") === "success" ? "border-accent focus:ring-accent" : 
                      "focus:ring-primary"
                    }`}
                    required
                  />
                  {getFieldStatus("fullName") === "success" && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />}
                </div>
                {errors.fullName && touched.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
              </div>

              {/* Cédula */}
              <div>
                <label className="block mb-2">Cédula <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  value={formData.identityCard}
                  onChange={(e) => handleChange("identityCard", e.target.value)}
                  onBlur={() => handleBlur("identityCard")}
                  placeholder="1234567890"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    getFieldStatus("identityCard") === "error" ? "border-destructive focus:ring-destructive" : 
                    getFieldStatus("identityCard") === "success" ? "border-accent focus:ring-accent" : 
                    "focus:ring-primary"
                  }`}
                  required
                />
                {errors.identityCard && touched.identityCard && <p className="text-sm text-destructive mt-1">{errors.identityCard}</p>}
              </div>

              {/* Tipo de Sangre */}
              <div>
                <label className="block mb-2">Tipo de Sangre <span className="text-destructive">*</span></label>
                <select
                  value={formData.bloodType}
                  onChange={(e) => handleChange("bloodType", e.target.value)}
                  onBlur={() => handleBlur("bloodType")}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    getFieldStatus("bloodType") === "error" ? "border-destructive focus:ring-destructive" : 
                    getFieldStatus("bloodType") === "success" ? "border-accent focus:ring-accent" : 
                    "focus:ring-primary"
                  }`}
                  required
                >
                  <option value="">Selecciona tipo de sangre</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.bloodType && touched.bloodType && <p className="text-sm text-destructive mt-1">{errors.bloodType}</p>}
              </div>

              {/* Teléfono Personal */}
              <div>
                <label className="block mb-2">Teléfono Personal <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      handleChange("phone", value);
                    }}
                    onBlur={() => handleBlur("phone")}
                    placeholder="0987654321"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                      getFieldStatus("phone") === "error" ? "border-destructive focus:ring-destructive" : 
                      getFieldStatus("phone") === "success" ? "border-accent focus:ring-accent" : 
                      "focus:ring-primary"
                    }`}
                    required
                  />
                </div>
                {errors.phone && touched.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <label className="block mb-2">Dirección <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="Calle Principal 123, Apto 4B"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    getFieldStatus("address") === "error" ? "border-destructive focus:ring-destructive" : 
                    getFieldStatus("address") === "success" ? "border-accent focus:ring-accent" : 
                    "focus:ring-primary"
                  }`}
                  required
                />
                {errors.address && touched.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
              </div>

              {/* Alergias */}
              <div className="md:col-span-2">
                <label className="block mb-2">Alergias (opcional)</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  placeholder="Ej: Penicilina, Mariscos"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background focus:ring-primary"
                />
              </div>

              {/* Enfermedades Crónicas */}
              <div className="md:col-span-2">
                <label className="block mb-2">Enfermedades Crónicas (opcional)</label>
                <input
                  type="text"
                  value={formData.chronicConditions}
                  onChange={(e) => handleChange("chronicConditions", e.target.value)}
                  placeholder="Ej: Diabetes, Hipertensión"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background focus:ring-primary"
                />
              </div>

              {/* Contacto de Emergencia */}
              <div className="md:col-span-2 border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Contacto de Emergencia</h3>
              </div>

              {/* Nombre Contacto */}
              <div>
                <label className="block mb-2">Nombre <span className="text-destructive">*</span></label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  onBlur={() => handleBlur("emergencyContact")}
                  placeholder="María García"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    getFieldStatus("emergencyContact") === "error" ? "border-destructive focus:ring-destructive" : 
                    getFieldStatus("emergencyContact") === "success" ? "border-accent focus:ring-accent" : 
                    "focus:ring-primary"
                  }`}
                  required
                />
                {errors.emergencyContact && touched.emergencyContact && <p className="text-sm text-destructive mt-1">{errors.emergencyContact}</p>}
              </div>

              {/* Relación */}
              <div>
                <label className="block mb-2">Relación <span className="text-destructive">*</span></label>
                <select
                  value={formData.emergencyRelation}
                  onChange={(e) => handleChange("emergencyRelation", e.target.value)}
                  onBlur={() => handleBlur("emergencyRelation")}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    getFieldStatus("emergencyRelation") === "error" ? "border-destructive focus:ring-destructive" : 
                    getFieldStatus("emergencyRelation") === "success" ? "border-accent focus:ring-accent" : 
                    "focus:ring-primary"
                  }`}
                  required
                >
                  <option value="">Selecciona relación</option>
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                  <option value="Hermano">Hermano</option>
                  <option value="Hermana">Hermana</option>
                  <option value="Esposo">Esposo</option>
                  <option value="Esposa">Esposa</option>
                  <option value="Hijo">Hijo</option>
                  <option value="Hija">Hija</option>
                  <option value="Amigo">Amigo</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.emergencyRelation && touched.emergencyRelation && <p className="text-sm text-destructive mt-1">{errors.emergencyRelation}</p>}
              </div>

              {/* Teléfono Contacto */}
              <div className="md:col-span-2">
                <label className="block mb-2">Teléfono <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      handleChange("emergencyPhone", value);
                    }}
                    onBlur={() => handleBlur("emergencyPhone")}
                    placeholder="0987654321"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                      getFieldStatus("emergencyPhone") === "error" ? "border-destructive focus:ring-destructive" : 
                      getFieldStatus("emergencyPhone") === "success" ? "border-accent focus:ring-accent" : 
                      "focus:ring-primary"
                    }`}
                    required
                  />
                </div>
                {errors.emergencyPhone && touched.emergencyPhone && <p className="text-sm text-destructive mt-1">{errors.emergencyPhone}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => onNavigate?.("/welcome")} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Atrás
              </button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:bg-primary/50 disabled:cursor-not-allowed">
                {submitting ? "Guardando..." : "Siguiente"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}