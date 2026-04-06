"use client";

import { useState } from "react";
import { Heart, Mail, Lock, Eye, EyeOff, User, Loader2, AlertCircle } from "lucide-react";
import { ApiClient, type RegisterResponse } from "@/api-client";

interface RegisterPageProps {
  onNavigate?: (path: string) => void;
}

interface FieldErrors {
  [key: string]: string[];
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validaciones locales
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!formData.acceptTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }
    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Parsear nombre completo
      const [nombre, apellido] = formData.fullName.split(" ");

      // Llamar al backend para registrarse
      const response = await ApiClient.post<RegisterResponse>("/auth/register", {
        email: formData.email,
        password: formData.password,
        nombre: nombre || formData.fullName,
        apellido: apellido || "",
      });

      // Guardar información del usuario
      localStorage.setItem("userFullName", formData.fullName);
      localStorage.setItem("userId", response.id.toString());

      // Redirigir a welcome
      onNavigate?.("/welcome");
    } catch (err) {
      // Parsear errores del backend (formato FastAPI 422)
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        // Intentar parsear como JSON si contiene errores de validación
        try {
          if (errorMessage.includes("detail")) {
            const errorData = JSON.parse(errorMessage.replace("Error: ", ""));
            
            if (Array.isArray(errorData.detail)) {
              // Errores de validación Pydantic
              const newFieldErrors: FieldErrors = {};
              let generalErrors: string[] = [];
              
              errorData.detail.forEach((err: any) => {
                if (err.loc && err.loc.length > 1) {
                  const fieldName = err.loc[1]; // El campo está en loc[1]
                  const message = err.msg;
                  
                  if (!newFieldErrors[fieldName]) {
                    newFieldErrors[fieldName] = [];
                  }
                  newFieldErrors[fieldName].push(message);
                } else {
                  generalErrors.push(err.msg || String(err));
                }
              });
              
              setFieldErrors(newFieldErrors);
              if (generalErrors.length > 0) {
                setError(generalErrors.join(". "));
              }
              setLoading(false);
              return;
            }
          }
        } catch (parseErr) {
          // Si no se puede parsear, mostrar el error como está
        }
        
        setError(errorMessage);
      } else {
        setError("Error al crear la cuenta");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate?.('/')}
            className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <Heart className="w-10 h-10 text-primary" />
            <span className="text-2xl font-semibold">Hermanos Para su Salud</span>
          </button>
          <h1 className="text-3xl font-bold mb-2">Crear cuenta</h1>
          <p className="text-muted-foreground">Únete y comienza a gestionar tu salud</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block mb-2">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Juan Pérez"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    fieldErrors.nombre 
                      ? "border-red-500 focus:ring-red-500" 
                      : "focus:ring-primary"
                  }`}
                  required
                />
              </div>
              {fieldErrors.nombre && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.nombre.join(", ")}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    fieldErrors.email 
                      ? "border-red-500 focus:ring-red-500" 
                      : "focus:ring-primary"
                  }`}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.email.join(", ")}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-input-background ${
                    fieldErrors.password 
                      ? "border-red-500 focus:ring-red-500" 
                      : "focus:ring-primary"
                  }`}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Mínimo 8 caracteres, con mayúscula, minúscula y número</p>
              {fieldErrors.password && (
                <div className="mt-2 space-y-1">
                  {fieldErrors.password.map((err, idx) => (
                    <p key={idx} className="text-sm text-red-600">- {err}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Acepto los{" "}
                <a href="#" className="text-primary hover:underline">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a href="#" className="text-primary hover:underline">
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button 
                onClick={() => onNavigate?.('/login')}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => onNavigate?.('/')}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}