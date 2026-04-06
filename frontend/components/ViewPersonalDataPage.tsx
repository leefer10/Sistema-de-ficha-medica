"use client";

import { useState, useEffect } from "react";
import { Heart, Calendar, User, Droplet, AlertCircle, Phone, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { ApiClient } from "@/api-client";

interface ViewPersonalDataPageProps {
  onNavigate?: (path: string) => void;
}

interface PersonalData {
  id: number;
  user_id: number;
  fecha_nacimiento?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

export function ViewPersonalDataPage({ onNavigate }: ViewPersonalDataPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);

  const userId = ApiClient.extractUserId();

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (!userId) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await ApiClient.get<PersonalData>(`/users/personal-data/${userId}`);
      
      if (response) {
        setPersonalData(response);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar datos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, value: string | null | undefined, icon: React.ReactNode) => {
    const displayValue = value || "No especificado";
    return (
      <div className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-0">
        <div className="flex-shrink-0 text-primary mt-1">{icon}</div>
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-base text-gray-900 mt-1">{displayValue}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Ficha Médica</h1>
            <p className="text-gray-600 mt-2">Visualiza tu información personal y médica</p>
          </div>
          <button
            onClick={() => onNavigate?.("/dashboard")}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="Volver"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Error</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : personalData ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Información Personal</h2>
                  <p className="text-white/80 text-sm mt-1">ID: {personalData.user_id}</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="space-y-2">
                {renderField("Fecha de Nacimiento", personalData.fecha_nacimiento, <Calendar className="w-5 h-5" />)}
                {renderField("Teléfono", personalData.telefono, <Phone className="w-5 h-5" />)}
                {renderField("Dirección", personalData.direccion, <MapPin className="w-5 h-5" />)}
                {renderField("Ciudad", personalData.ciudad, <MapPin className="w-5 h-5" />)}
                {renderField("País", personalData.pais, <Heart className="w-5 h-5" />)}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Sin datos</h3>
                <p className="text-yellow-700 mt-1">No se encontraron datos personales. Completa tu ficha para continuar.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => onNavigate?.("/personal-data")}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Editar Ficha
          </button>
          <button
            onClick={() => onNavigate?.("/dashboard")}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
