import { Heart, CheckCircle, FileText, QrCode, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ApiClient } from "@/api-client";

interface SuccessPageProps {
  onNavigate?: (path: string) => void;
}

export function SuccessPage({ onNavigate }: SuccessPageProps) {
  const userName = localStorage.getItem("userFullName") || "Usuario";

  useEffect(() => {
    // Marcar fase 3 como completada cuando se llega a esta página
    const completePhase3 = async () => {
      try {
        await ApiClient.completeOnboardingPhase(3);
      } catch (error) {
        console.error("Error completing phase 3:", error);
      }
    };
    completePhase3();
  }, []);

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

        {/* Success Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/20 rounded-full mb-6">
              <CheckCircle className="w-14 h-14 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              ¡Ficha Médica Creada Exitosamente! 🎉
            </h1>
            <p className="text-xl text-muted-foreground">
              Excelente trabajo, {userName.split(' ')[0]}. Tu perfil médico está completo, seguro y listo para usar.
            </p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary mb-1">✓</p>
              <p className="text-sm text-muted-foreground">Ficha Creada</p>
            </div>
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Perfil Completo</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <QrCode className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600 mb-1">QR</p>
              <p className="text-sm text-muted-foreground">Disponible</p>
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">¿Qué sigue?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <p className="font-semibold">Explora tu Dashboard</p>
                  <p className="text-sm text-muted-foreground">
                    Accede a tu información médica y gestiona tus fichas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <p className="font-semibold">Genera tu código QR</p>
                  <p className="text-sm text-muted-foreground">
                    Crea un QR para acceso rápido en emergencias
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <p className="font-semibold">Mantén tu información actualizada</p>
                  <p className="text-sm text-muted-foreground">
                    Agrega nuevas consultas, medicamentos o cambios médicos
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={() => onNavigate?.("/dashboard")}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Ir a mi Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate?.("/generate-qr")}
              className="w-full flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              <QrCode className="w-5 h-5" />
              Generar Mi Código QR
            </button>
          </motion.div>

          {/* Celebration Message */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="mt-8 p-4 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg text-center"
          >
            <p className="text-sm">
              🎊 <span className="font-semibold">¡Felicitaciones!</span> Has completado tu perfil médico. 
              Ahora tu información de salud está organizada y segura.
            </p>
          </motion.div>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="text-accent">🔒</span>
            Tus datos están encriptados y protegidos
          </p>
        </motion.div>
      </div>
    </div>
  );
}