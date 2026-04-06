import { Heart, Download, Share2, Edit, ArrowLeft, User, Droplet, Phone, AlertCircle, Pill, Syringe, Scissors, Activity, Home, Calendar, Image as ImageIcon, FileImage } from "lucide-react";

interface MedicalRecordDetailPageProps {
  onNavigate?: (path: string) => void;
}

export function MedicalRecordDetailPage({ onNavigate }: MedicalRecordDetailPageProps) {
  // Cargar datos del usuario desde localStorage
  const userName = localStorage.getItem("userFullName") || "No especificado";
  const userEmail = localStorage.getItem("userEmail") || "No especificado";
  
  // Datos personales
  const birthDate = localStorage.getItem("userBirthDate") || "";
  const age = birthDate 
    ? new Date().getFullYear() - new Date(birthDate).getFullYear()
    : "No especificado";
  const gender = localStorage.getItem("userGender") || "No especificado";
  const bloodType = localStorage.getItem("userBloodType") || "No especificado";
  const identityCard = localStorage.getItem("userIdentityCard") || "No especificado";
  const address = localStorage.getItem("userAddress") || "No especificado"; // Si no existe, mostrar como no especificado

  // Información médica
  const allergies = localStorage.getItem("userAllergies") || "Ninguna registrada";
  const chronicConditions = localStorage.getItem("userChronicConditions") || "Ninguna registrada";
  const previousDiseases = localStorage.getItem("userPreviousDiseases") || "Ninguna registrada";
  const familyHistory = localStorage.getItem("userFamilyHistory") || "No especificado";
  const occupation = localStorage.getItem("userOccupation") || "No especificado";
  const habits = localStorage.getItem("userHabits") || "No especificado"; // Nuevo campo para hábitos

  // Seguro médico
  const insuranceProvider = localStorage.getItem("userInsuranceProvider") || "No especificado";
  const insuranceNumber = localStorage.getItem("userInsuranceNumber") || "No especificado";

  // Contacto de emergencia
  const emergencyContact = localStorage.getItem("userEmergencyContact") || "No configurado";
  const emergencyPhone = localStorage.getItem("userEmergencyPhone") || "No configurado";
  const emergencyRelation = localStorage.getItem("userEmergencyRelation") || "No especificado";

  // Medicamentos, vacunas, cirugías
  const medications = JSON.parse(localStorage.getItem("userMedications") || "[]");
  const vaccines = JSON.parse(localStorage.getItem("userVaccines") || "[]");
  const surgeries = JSON.parse(localStorage.getItem("userSurgeries") || "[]");

  // Cargar consultas y extraer medicamentos prescritos
  const consultations = JSON.parse(localStorage.getItem("medicalConsultations") || "[]");
  const consultationMedications = consultations
    .filter((c: any) => c.medications && c.medications.length > 0)
    .flatMap((c: any) => 
      c.medications.map((med: any) => ({
        ...med,
        consultationTitle: c.title,
        consultationDate: c.date,
        doctor: c.doctor
      }))
    );

  // Extraer imágenes de recetas de las consultas
  const prescriptionImages = consultations
    .filter((c: any) => c.prescriptionImages && c.prescriptionImages.length > 0)
    .flatMap((c: any) =>
      c.prescriptionImages.map((img: string, idx: number) => ({
        image: img,
        consultationTitle: c.title,
        consultationDate: c.date,
        imageNumber: idx + 1
      }))
    );

  const handleDownloadPDF = () => {
    alert("Descargando ficha médica en PDF...");
  };

  const handleShare = () => {
    alert("Compartiendo ficha médica...");
  };

  const currentDate = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-semibold">Hermanos Para su Salud</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button onClick={() => onNavigate?.("/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Volver al Dashboard
        </button>

        {/* Header with Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ficha Médica Completa</h1>
              <p className="text-muted-foreground">Información médica actualizada al {currentDate}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Descargar PDF</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Compartir</span>
              </button>
              <button onClick={() => onNavigate?.("/edit-medical-record")} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  <Edit className="w-5 h-5" />
                  <span className="hidden sm:inline">Editar</span>
                </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Información Personal */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-primary text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-6 h-6" />
                Información Personal
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nombre Completo</p>
                  <p className="font-semibold text-lg">{userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cédula de Identidad</p>
                  <p className="font-semibold text-lg">{identityCard}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Edad</p>
                  <p className="font-semibold text-lg">{age} años</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de Nacimiento</p>
                  <p className="font-semibold text-lg">
                    {birthDate ? new Date(birthDate).toLocaleDateString('es-ES') : "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Género</p>
                  <p className="font-semibold text-lg">{gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ocupación</p>
                  <p className="font-semibold text-lg">{occupation}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Dirección</p>
                  <p className="font-semibold text-lg">{address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Correo Electrónico</p>
                  <p className="font-semibold text-lg">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información Médica Vital */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-destructive text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Droplet className="w-6 h-6" />
                Información Médica Vital
              </h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Tipo de Sangre</p>
                  <p className="font-bold text-2xl text-destructive">{bloodType}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Alergias</p>
                  <p className="font-semibold text-lg text-orange-700">{allergies}</p>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm text-muted-foreground mb-1">Condiciones Médicas Crónicas</p>
                  <p className="font-semibold text-lg">{chronicConditions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Seguro Médico */}
          {(insuranceProvider !== "No especificado" || insuranceNumber !== "No especificado") && (
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Seguro Médico
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Proveedor</p>
                    <p className="font-semibold text-lg">{insuranceProvider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Número de Póliza</p>
                    <p className="font-semibold text-lg">{insuranceNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medicación Actual */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-blue-500 text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Pill className="w-6 h-6" />
                Medicación Actual
              </h2>
            </div>
            <div className="p-6">
              {medications.length > 0 ? (
                <div className="space-y-3">
                  {medications.map((med: any) => (
                    <div key={med.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Medicamento</p>
                          <p className="font-semibold text-lg">{med.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dosis</p>
                          <p className="font-semibold">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Frecuencia</p>
                          <p className="font-semibold">{med.frequency}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No hay medicamentos registrados</p>
              )}
            </div>
          </div>

          {/* Medicamentos Prescritos en Consultas */}
          {consultationMedications.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
              <div className="bg-teal-600 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Pill className="w-6 h-6" />
                  Medicamentos Prescritos en Consultas
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {consultationMedications.map((med: any, index: number) => (
                    <div key={index} className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Medicamento</p>
                          <p className="font-semibold text-lg">{med.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dosis</p>
                          <p className="font-semibold">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Frecuencia</p>
                          <p className="font-semibold">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Prescrito por</p>
                          <p className="font-semibold text-sm">{med.doctor}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-teal-300">
                        <p className="text-xs text-muted-foreground">
                          Consulta: {med.consultationTitle} • {new Date(med.consultationDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Estos medicamentos fueron prescritos durante consultas médicas específicas. 
                      Consulta con tu médico antes de suspender o modificar cualquier tratamiento.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recetas Médicas */}
          {prescriptionImages.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
              <div className="bg-cyan-600 text-white p-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileImage className="w-6 h-6" />
                  Recetas Médicas Digitalizadas
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {prescriptionImages.map((item: any, index: number) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 cursor-pointer hover:border-cyan-500 transition-colors">
                        <img
                          src={item.image}
                          alt={`Receta ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium text-foreground truncate" title={item.consultationTitle}>
                          {item.consultationTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.consultationDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <ImageIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Total de {prescriptionImages.length} {prescriptionImages.length === 1 ? 'receta digitalizada' : 'recetas digitalizadas'}. 
                      Haz clic en cualquier imagen para ver los detalles completos.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Antecedentes Patológicos Familiares */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-purple-600 text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Antecedentes Patológicos Familiares
              </h2>
            </div>
            <div className="p-6">
              <p className="text-foreground leading-relaxed whitespace-pre-line">{familyHistory}</p>
            </div>
          </div>

          {/* Antecedentes Patológicos Personales */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Antecedentes Patológicos Personales
              </h2>
            </div>
            <div className="p-6">
              <p className="text-foreground leading-relaxed whitespace-pre-line">{previousDiseases}</p>
            </div>
          </div>

          {/* Antecedentes Patológicos Quirúrgicos */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-purple-500 text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Scissors className="w-6 h-6" />
                Antecedentes Patológicos Quirúrgicos
              </h2>
            </div>
            <div className="p-6">
              {surgeries.length > 0 ? (
                <div className="space-y-3">
                  {surgeries.map((surg: any) => (
                    <div key={surg.id} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Cirugía</p>
                          <p className="font-semibold text-lg">{surg.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha</p>
                          <p className="font-semibold">{new Date(surg.date).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Notas</p>
                          <p className="font-semibold">{surg.notes || "Sin notas adicionales"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No hay cirugías registradas</p>
              )}
            </div>
          </div>

          {/* Hábitos */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-green-600 text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Hábitos
              </h2>
            </div>
            <div className="p-6">
              <p className="text-foreground leading-relaxed whitespace-pre-line">{habits}</p>
              {habits === "No especificado" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Incluye información sobre: consumo de tabaco, alcohol, ejercicio físico, dieta, etc.
                </p>
              )}
            </div>
          </div>

          {/* Vacunas */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-green-500 text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Syringe className="w-6 h-6" />
                Vacunas
              </h2>
            </div>
            <div className="p-6">
              {vaccines.length > 0 ? (
                <div className="space-y-3">
                  {vaccines.map((vac: any) => (
                    <div key={vac.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Vacuna</p>
                          <p className="font-semibold text-lg">{vac.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha</p>
                          <p className="font-semibold">{new Date(vac.date).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Dosis</p>
                          <p className="font-semibold">{vac.dose}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No hay vacunas registradas</p>
              )}
            </div>
          </div>

          {/* Contacto de Emergencia */}
          <div className="bg-white rounded-xl shadow-md border overflow-hidden">
            <div className="bg-destructive text-white p-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Phone className="w-6 h-6" />
                Llamar en Caso de Emergencia
              </h2>
            </div>
            <div className="p-6 bg-red-50">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-white border-2 border-destructive rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Nombre del Contacto</p>
                  <p className="font-bold text-lg text-destructive">{emergencyContact}</p>
                </div>
                <div className="p-4 bg-white border-2 border-destructive rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                  <p className="font-bold text-xl text-destructive">{emergencyPhone}</p>
                </div>
                <div className="p-4 bg-white border-2 border-destructive rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Parentesco</p>
                  <p className="font-bold text-lg text-destructive">{emergencyRelation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con fecha */}
          <div className="bg-white rounded-xl shadow-md border p-4 text-center text-sm text-muted-foreground">
            <p>
              Ficha médica generada el {currentDate} • 
              Sistema de Hermanos Para su Salud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}