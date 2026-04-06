import { Heart, Scan, Database, QrCode, Shield, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onNavigate?: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Hermanos Para su Salud</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="hover:text-primary transition-colors">Características</a>
            <a href="#benefits" className="hover:text-primary transition-colors">Beneficios</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate?.('/login')}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => onNavigate?.('/register')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Registrarse
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Tu historia médica, <span className="text-primary">siempre contigo</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Sistema gratuito y sin fines de lucro para gestionar tus fichas médicas de forma segura. 
                Accede a tu información médica en emergencias con un simple escaneo QR.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent">✓</span>
                  </div>
                  <span>100% Gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent">✓</span>
                  </div>
                  <span>Datos Seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent">✓</span>
                  </div>
                  <span>Acceso Rápido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent">✓</span>
                  </div>
                  <span>Sin Fines de Lucro</span>
                </div>
              </div>
              <button 
                onClick={() => onNavigate?.('/register')}
                className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758574437870-f83c160efd82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhbHRoY2FyZSUyMHRlYW13b3JrfGVufDF8fHx8MTc3NDI4Mjg1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical healthcare teamwork"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Características Principales</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tecnología moderna al servicio de tu salud y bienestar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Scan className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Escaneo OCR</h3>
              <p className="text-muted-foreground">
                Digitaliza tus fichas médicas con reconocimiento óptico de caracteres
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Almacenamiento Seguro</h3>
              <p className="text-muted-foreground">
                Tus registros médicos protegidos con los más altos estándares de seguridad
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Acceso con QR</h3>
              <p className="text-muted-foreground">
                Acceso inmediato a tu historial médico en situaciones de emergencia
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacidad Total</h3>
              <p className="text-muted-foreground">
                Tú tienes el control absoluto sobre quién puede ver tu información
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1633488781325-d36e6818d0c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwYXRpZW50JTIwY2FyZXxlbnwxfHx8fDE3NzQzMDI0MzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Doctor patient care"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">¿Por qué usar nuestro sistema?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Organización completa</h3>
                    <p className="text-muted-foreground">
                      Mantén todos tus registros médicos organizados en un solo lugar accesible desde cualquier dispositivo
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Emergencias cubiertas</h3>
                    <p className="text-muted-foreground">
                      En situaciones críticas, el personal médico puede acceder rápidamente a tu información vital
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Actualización continua</h3>
                    <p className="text-muted-foreground">
                      Mantén tu historial actualizado con cada consulta médica, medicamento o vacuna
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Compromiso social</h3>
                    <p className="text-muted-foreground">
                      Sistema sin fines de lucro creado para mejorar el acceso a la salud en nuestra comunidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comienza a cuidar tu salud hoy
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Regístrate gratis y ten tu historia médica siempre a mano
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => onNavigate?.('/register')}
              className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-50 transition-colors"
            >
              Crear Cuenta Gratis
            </button>
            <button 
              onClick={() => onNavigate?.('/login')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6" />
                <span className="font-semibold">Hermanos Para su Salud</span>
              </div>
              <p className="text-white/70">
                Sistema sin fines de lucro para la gestión de fichas médicas
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Acerca de</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Nuestra Misión</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Equipo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-white/70">
                <li>Email: info@hermanos-salud.org</li>
                <li>Tel: +1 (555) 123-4567</li>
                <li>Horario: Lun-Vie 9AM-6PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/70">
            <p>© 2026 Sistema de Hermanos Para su Salud. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
