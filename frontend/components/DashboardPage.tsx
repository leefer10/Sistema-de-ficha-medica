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
    const name = localStorage.getItem("userFullName") || "Usuario";
    setUserName(name);
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const status = await ApiClient.getOnboardingStatus();
        if (!status.all_complete) {
          onNavigate?.('/welcome');
          return;
        }
      } catch (error) {
        console.warn("Error checking onboarding status:", error);
      }
    };
    checkOnboarding();
  }, [onNavigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const medical = await ApiClient.get<MedicalSummary>("/users/me/medical");
          if (medical) {
            setMedicalData(medical);
          }
        } catch (medErr) {
          console.warn("Error fetching medical data:", medErr);
          setMedicalData({
            usuario: { nombre: "", apellido: "" },
            antecedentes: [],
            medicaciones: [],
            vacunas: [],
            cirugias: []
          });
        }

        const userId = ApiClient.extractUserId();
        if (userId) {
          try {
            const personal = await ApiClient.get<any>(`/users/personal-data/${userId}`);
            setPersonalData(personal);
          } catch (err) {
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
      label: "Fichas Médicas", 
      value: 3, 
      icon: FileText, 
      color: "text-primary" 
    },
    { 
      label: "Consultas este año", 
      value: 12, 
      icon: Calendar, 
      color: "text-accent" 
    },
    { 
      label: "Medicamentos", 
      value: medicalData?.medicaciones?.length || 0, 
      icon: AlertCircle, 
      color: "text-orange-500" 
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

            {/* Main Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Content - 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Resumen Personal */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Resumen Personal</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Droplet className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo de Sangre</p>
                        <p className="font-semibold">{personalData?.tipo_sangre || "No especificado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Alergias</p>
                        <p className="font-semibold text-sm">
                          {medicalData?.antecedentes && medicalData.antecedentes.length > 0 
                            ? medicalData.antecedentes.join(", ")
                            : "Ninguna registrada"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historial de Actualizaciones */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Historial de Actualizaciones</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Consulta General</p>
                        <p className="text-xs text-muted-foreground">Consulta</p>
                      </div>
                      <p className="text-xs text-muted-foreground">2026-03-20</p>
                    </div>
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Análisis de Sangre</p>
                        <p className="text-xs text-muted-foreground">Laboratorio</p>
                      </div>
                      <p className="text-xs text-muted-foreground">2026-03-15</p>
                    </div>
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Vacuna COVID-19</p>
                        <p className="text-xs text-muted-foreground">Vacuna</p>
                      </div>
                      <p className="text-xs text-muted-foreground">2026-03-10</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate?.("/medical-history")} 
                    className="w-full py-3 text-center text-muted-foreground hover:bg-gray-50 transition-colors mt-4 text-sm"
                  >
                    Ver historial completo
                  </button>
                </div>
              </div>

              {/* Right Sidebar - 1 column */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6 border">
                  <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
                  <div className="space-y-3">
                    <button onClick={() => onNavigate?.("/add-consultation")} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-md font-semibold text-base">
                      <Plus className="w-6 h-6" />
                      <span>Agregar Consulta</span>
                    </button>
                    <button onClick={() => onNavigate?.("/edit-medical-record")} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md font-semibold text-base">
                      <Edit className="w-6 h-6" />
                      <span>Editar Mi Ficha</span>
                    </button>
                    <button onClick={() => onNavigate?.("/medical-record-detail")} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span>Ver Mi Ficha Completa</span>
                    </button>
                    <button onClick={() => onNavigate?.("/generate-qr")} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                      <QrCode className="w-5 h-5 text-blue-600" />
                      <span>Generar QR</span>
                    </button>
                    <button onClick={() => onNavigate?.("/settings")} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span>Configuración</span>
                    </button>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-md p-6 border border-red-200">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Contacto de Emergencia
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-semibold">{personalData?.nombre_emergencia || "No configurado"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-semibold">{personalData?.telefono_emergencia || "No configurado"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
