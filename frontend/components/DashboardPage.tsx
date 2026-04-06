"use client";

import { useEffect, useState } from "react";
import { 
  Heart, 
  FileText, 
  Edit, 
  QrCode, 
  Settings, 
  Calendar,
  Droplet,
  AlertCircle,
  TrendingUp,
  LogOut,
  User,
  Plus,
  Loader2,
  Eye
} from "lucide-react";
import { ApiClient } from "@/api-client";

interface DashboardPageProps {
  onNavigate?: (path: string) => void;
}

interface MedicalSummary {
  usuario: {
    nombre: string;
    apellido: string;
  };
  antecedentes: string[];
  medicaciones: string[];
  vacunas: string[];
  cirugias: string[];
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Usuario");
  const [medicalData, setMedicalData] = useState<MedicalSummary>({
    usuario: { nombre: "", apellido: "" },
    antecedentes: [],
    medicaciones: [],
    vacunas: [],
    cirugias: []
  });
  const [personalData, setPersonalData] = useState<any>(null);

  useEffect(() => {
    // Obtener nombre del usuario de localStorage (solo en cliente)
    const name = localStorage.getItem("userFullName") || "Usuario";
    setUserName(name);
  }, []);

  // Verificar que el onboarding esté completo
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const status = await ApiClient.getOnboardingStatus();
        if (!status.all_complete) {
          // Si no completó onboarding, redirigir a welcome
          onNavigate?.('/welcome');
          return;
        }
      } catch (error) {
        console.warn("Error checking onboarding status:", error);
        // Si hay error, permitir acceso pero avisar
      }
    };

    checkOnboarding();
  }, [onNavigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch medical summary con mejor manejo de errores
        try {
          const medical = await ApiClient.get<MedicalSummary>("/users/me/medical");
          if (medical) {
            setMedicalData(medical);
          }
        } catch (medErr) {
          console.warn("Error fetching medical data:", medErr);
          // Usar datos por defecto si falla
          setMedicalData({
            usuario: { nombre: "", apellido: "" },
            antecedentes: [],
            medicaciones: [],
            vacunas: [],
            cirugias: []
          });
        }

        // Try to fetch personal data
        const userId = ApiClient.extractUserId();
        if (userId) {
          try {
            const personal = await ApiClient.get<any>(`/users/personal-data/${userId}`);
            setPersonalData(personal);
          } catch (err) {
            // Personal data might not exist yet, which is fine
            console.log("No personal data yet");
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
        console.error("Dashboard error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { 
      label: "Medicamentos", 
      value: medicalData?.medicaciones?.length || 0, 
      icon: AlertCircle, 
      color: "text-orange-500" 
    },
    { 
      label: "Vacunas", 
      value: medicalData?.vacunas?.length || 0, 
      icon: Calendar, 
      color: "text-accent" 
    },
    { 
      label: "Cirugías", 
      value: medicalData?.cirugias?.length || 0, 
      icon: FileText, 
      color: "text-primary" 
    },
  ];

  const handleLogout = () => {
    ApiClient.logout();
    onNavigate?.("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Hermanos Para su Salud</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate?.("/settings")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenido, {medicalData?.usuario?.nombre?.split(' ')[0] || userName.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Aquí está el resumen de tu información médica
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Cargando datos médicos...</span>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Summary Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Resumen Médico</h2>
                  <div className="space-y-4">
                    {/* Blood Type */}
                    {personalData?.tipo_sangre && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Droplet className="w-5 h-5 text-destructive" />
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                          <p className="font-semibold">{personalData.tipo_sangre}</p>
                        </div>
                      </div>
                    )}

                    {/* Allergies */}
                    {medicalData?.antecedentes && medicalData.antecedentes.length > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Antecedentes</p>
                          <p className="font-semibold text-sm">
                            {medicalData.antecedentes.join(", ")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {medicalData?.medicaciones?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Medicamentos</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {medicalData?.vacunas?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Vacunas</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">
                          {medicalData?.cirugias?.length || 0}
                        </p>
                        <p className="text-xs text-gray-600">Cirugías</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Items */}
                {medicalData?.medicaciones && medicalData.medicaciones.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-6 border">
                    <h2 className="text-xl font-semibold mb-4">Medicamentos Actuales</h2>
                    <div className="space-y-2">
                      {medicalData.medicaciones.map((med, idx) => (
                        <div key={idx} className="p-3 border rounded-lg flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{med}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Full History Button */}
                <button 
                  onClick={() => onNavigate?.("/medical-history")} 
                  className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-muted-foreground hover:bg-gray-50 transition-colors"
                >
                  Ver historial completo
                </button>
              </div>

             </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border">
              <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => onNavigate?.("/view-personal-data")} className="flex items-center justify-center gap-2 p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Ver Ficha</span>
                  </button>
                  <button onClick={() => onNavigate?.("/edit-medical-record")} className="flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
                    <Edit className="w-4 h-4" />
                    <span>Editar Ficha Médica</span>
                  </button>
                </div>
                <button onClick={() => onNavigate?.("/add-consultation")} className="w-full flex items-center gap-3 p-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-md">
                  <Plus className="w-5 h-5" />
                  <span>Agregar Consulta</span>
                </button>
                <button onClick={() => onNavigate?.("/medical-record-detail")} className="w-full flex items-center gap-3 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span>Ver Ficha Médica Completa</span>
                </button>
                <button onClick={() => onNavigate?.("/generate-qr")} className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <QrCode className="w-5 h-5 text-primary" />
                  <span>Generar QR</span>
                </button>
                <button onClick={() => onNavigate?.("/settings")} className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Configuración</span>
                </button>
              </div>
            </div>

            {/* Emergency Info */}
            {personalData?.telefono && (
              <div className="bg-gradient-to-br from-destructive/10 to-orange-50 rounded-xl shadow-md p-6 border border-destructive/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  Información de Contacto
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-semibold">{personalData.telefono}</p>
                  {personalData.direccion && (
                    <>
                      <p className="text-sm text-muted-foreground mt-3">Dirección</p>
                      <p className="font-semibold text-sm">{personalData.direccion}</p>
                    </>
                  )}
                  {personalData.ciudad && (
                    <>
                      <p className="text-sm text-muted-foreground mt-3">Ciudad</p>
                      <p className="font-semibold">{personalData.ciudad}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          </>
        )}
      </div>
    </div>
  );
}