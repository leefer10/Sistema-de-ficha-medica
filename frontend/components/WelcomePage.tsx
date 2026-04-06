'use client';

import { Heart, CheckCircle, FileText, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { ApiClient, OnboardingStatus } from "@/api-client";

interface WelcomePageProps {
  onNavigate?: (path: string) => void;
}

export function WelcomePage({ onNavigate }: WelcomePageProps) {
  const userName = typeof window !== 'undefined' ? localStorage.getItem("userFullName") || "Usuario" : "Usuario";
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      try {
        setLoading(true);
        const status = await ApiClient.getOnboardingStatus();
        
        // Auto-reset phase 2 if it's marked complete but user only selected method
        // (this happens when user comes back without actually filling data)
        if (status.phase_2_complete && !status.phase_3_complete) {
          // Check if there's actually medical data saved
          const medicalRecord = localStorage.getItem("medicalRecord");
          if (!medicalRecord || medicalRecord === "{}") {
            // Reset phase 2 automatically
            console.log("Auto-resetting phase 2: user selected method but didn't fill data");
            await ApiClient.resetOnboardingPhase(2);
            // Fetch updated status
            const updatedStatus = await ApiClient.getOnboardingStatus();
            setOnboarding(updatedStatus);
          } else {
            setOnboarding(status);
          }
        } else {
          setOnboarding(status);
        }
        
        // If all phases complete, redirect to dashboard
        if (status.all_complete) {
          setTimeout(() => {
            onNavigate?.('/dashboard');
          }, 500);
        }
      } catch (error) {
        console.error("Error fetching onboarding status:", error);
        // Initialize with default empty status
        setOnboarding({
          phase_1_complete: false,
          phase_2_complete: false,
          phase_3_complete: false,
          all_complete: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingStatus();
  }, [onNavigate, refreshKey]);

  // Refresh status when page becomes visible (user returns to this page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const getPhaseIcon = (isComplete: boolean) => {
    if (isComplete) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return null;
  };

  const getPhaseNumberStyle = (isComplete: boolean, isNext: boolean) => {
    if (isComplete) {
      return "bg-green-500 text-white";
    }
    if (isNext) {
      return "bg-primary text-white";
    }
    return "bg-gray-300 text-white";
  };

  const calculateProgress = () => {
    if (!onboarding) return 0;
    let count = 0;
    if (onboarding.phase_1_complete) count++;
    if (onboarding.phase_2_complete) count++;
    if (onboarding.phase_3_complete) count++;
    return (count / 3) * 100;
  };

  const getProgressText = () => {
    if (!onboarding) return "Paso 1 de 3";
    let count = 0;
    if (onboarding.phase_1_complete) count++;
    if (onboarding.phase_2_complete) count++;
    if (onboarding.phase_3_complete) count++;
    return `Paso ${count + 1} de 3`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-12 h-12 text-primary" />
            <span className="text-2xl font-semibold">Hermanos Para su Salud</span>
          </div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-12 h-12 text-primary" />
            <span className="text-2xl font-semibold">Hermanos Para su Salud</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              ¡Bienvenido, {userName.split(' ')[0]}! 🎉
            </h1>
            <p className="text-xl text-muted-foreground">
              Vamos a crear tu perfil médico en 3 pasos simples
            </p>
          </div>

          {/* Steps Preview */}
          <div className="space-y-4 mb-8">
            {/* Phase 1 */}
            <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
              onboarding?.phase_1_complete 
                ? 'bg-green-50 border-green-200' 
                : 'bg-primary/5 border-primary/10'
            }`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                getPhaseNumberStyle(onboarding?.phase_1_complete || false, !onboarding?.phase_1_complete)
              }`}>
                {onboarding?.phase_1_complete ? '✓' : '1'}
              </div>
              <div>
                <h3 className="font-semibold mb-1">Datos Personales</h3>
                <p className="text-sm text-muted-foreground">
                  Información básica y contacto de emergencia
                </p>
              </div>
              {getPhaseIcon(onboarding?.phase_1_complete || false)}
              {!onboarding?.phase_1_complete && (
                <button
                  onClick={() => onNavigate?.('/personal-data')}
                  className="ml-auto text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Ir →
                </button>
              )}
            </div>

            {/* Phase 2 */}
            <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
              onboarding?.phase_2_complete 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                getPhaseNumberStyle(onboarding?.phase_2_complete || false, (onboarding?.phase_1_complete || false) && !(onboarding?.phase_2_complete || false))
              }`}>
                {onboarding?.phase_2_complete ? '✓' : '2'}
              </div>
              <div>
                <h3 className="font-semibold mb-1">Método de Ficha Médica</h3>
                <p className="text-sm text-muted-foreground">
                  Elige entre escaneo automático o llenado manual
                </p>
              </div>
              {getPhaseIcon(onboarding?.phase_2_complete || false)}
              {onboarding?.phase_1_complete && !onboarding?.phase_2_complete && (
                <button
                  onClick={() => onNavigate?.('/method-selection')}
                  className="ml-auto text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Ir →
                </button>
              )}
            </div>

            {/* Phase 3 */}
            <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
              onboarding?.phase_3_complete 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                getPhaseNumberStyle(onboarding?.phase_3_complete || false, (onboarding?.phase_1_complete || false) && (onboarding?.phase_2_complete || false) && !(onboarding?.phase_3_complete || false))
              }`}>
                {onboarding?.phase_3_complete ? '✓' : '3'}
              </div>
              <div>
                <h3 className="font-semibold mb-1">Tu Primera Ficha Médica</h3>
                <p className="text-sm text-muted-foreground">
                  Completa tu información médica y listo
                </p>
              </div>
              {getPhaseIcon(onboarding?.phase_3_complete || false)}
              {onboarding?.phase_1_complete && onboarding?.phase_2_complete && !onboarding?.phase_3_complete && (
                <button
                  onClick={() => onNavigate?.('/edit-medical-record')}
                  className="ml-auto text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Ir →
                </button>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progreso</span>
              <span className="text-sm font-medium text-primary">{getProgressText()}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">
              ⏱️ Tiempo estimado: <span className="font-semibold text-foreground">5-7 minutos</span>
            </p>
          </div>

          {/* Action Button - Only show when all phases are incomplete */}
          {!onboarding?.phase_1_complete && (
            <button
              onClick={() => onNavigate?.('/personal-data')}
              className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold"
            >
              Comenzar →
            </button>
          )}

          {/* Completion Message */}
          {onboarding?.all_complete && (
            <div className="text-center py-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold">
                ✓ ¡Onboarding completado! Redirigiendo al dashboard...
              </p>
            </div>
          )}

          {/* Information Message */}
          {!onboarding?.all_complete && (
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Completa todos los pasos para acceder al dashboard
              </p>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="text-accent">🔒</span>
            Tus datos están protegidos y encriptados
          </p>
        </div>
      </div>
    </div>
  );
}
