# Fase 6: Frontend - Resumen Ejecutivo

## Visión General
Implementar 5 vistas frontend integrando 21 endpoints del backend, con diseño responsivo basado en mockups.

**Stack:** Next.js 14+, React 18, TypeScript, Tailwind CSS, ShadcnUI

---

## 📊 5 VISTAS PRINCIPALES

### 1. Dashboard Actualizado
- **Ruta:** `/dashboard`
- **Componentes:** QuickMetrics (3 widgets), PersonalSummary (4 cards), QuickActions (6 botones), UpdateHistory
- **Endpoints:** 7 (health, personal-data, medications, appointments, medical-history, notifications)
- **Datos:** Conteos de medicamentos/citas, tipo de sangre, edad, alergias

### 2. Alarmas de Medicamentos  
- **Ruta:** `/medicamentos/alarmas`
- **Componentes:** MedicationList, MedicationCard (expandible), MedicationForm (modal)
- **Endpoints:** 9 (GET, POST, PUT, DELETE medicamentos + consume + reminders CRUD)
- **Features:** CRUD medicamentos, consumir dosis, manage reminders

### 3. Programar Medicamentos
- **Modal dentro de:** Alarmas page
- **Componentes:** MedicationForm (nombre, dosis, frecuencia, cantidad, recordatorios)
- **Validaciones:** 8 campos con validación completa
- **Recordatorios:** Multi-hora (08:00, 14:00, 20:00, custom)

### 4. Citas Médicas
- **Ruta:** `/citas/medicas`
- **Componentes:** AppointmentList, AppointmentCard (expandible), AppointmentForm (modal)
- **Endpoints:** 9 (GET, POST, PUT, DELETE citas + status + reminders CRUD)
- **Features:** CRUD citas, cambiar estado, manage reminders, validar fecha futura

### 5. Programar Citas Médicas
- **Modal dentro de:** Citas page
- **Componentes:** AppointmentForm (doctor, tipo, fecha, hora, ubicación, recordatorios)
- **Validaciones:** 8 campos con validación completa
- **Recordatorios:** Multi-horas (24h, 12h, 2h, 1h, custom)

---

## 🏗️ ARQUITECTURA DE COMPONENTES

```
App
├─ Layout (navbar, sidebar)
├─ Dashboard Page
│  ├─ QuickMetrics (3 cards con conteos)
│  ├─ PersonalSummary (tipo sangre, edad, alergias)
│  ├─ QuickActions (6 botones)
│  └─ UpdateHistory (últimas 3 actualizaciones)
├─ Medicamentos/Alarmas Page
│  ├─ MedicationForm Modal
│  └─ MedicationList
│     └─ MedicationCard[] (cada uno expandible)
├─ Citas/Medicas Page
│  ├─ AppointmentForm Modal
│  └─ AppointmentList
│     └─ AppointmentCard[] (cada uno expandible)
├─ Common Components
│  ├─ BaseCard (reutilizable)
│  ├─ Modal (reutilizable)
│  ├─ TimeInput (validación HH:MM)
│  ├─ ReminderSelector (multi-select)
│  └─ NotificationBadge (contador)
├─ API Clients (lib/api/)
│  ├─ medications.ts
│  ├─ appointments.ts
│  └─ notifications.ts
├─ Custom Hooks (lib/hooks/)
│  ├─ useMedications()
│  ├─ useAppointments()
│  └─ useNotifications()
└─ Types (lib/types/)
   ├─ medication.ts
   ├─ appointment.ts
   └─ notification.ts
```

---

## 📡 21 ENDPOINTS INTEGRADOS

### Medicamentos (9)
```
✅ GET    /users/medications                           → Listar todos
✅ POST   /users/medications                           → Crear
✅ PUT    /users/medications/{id}                      → Editar
✅ DELETE /users/medications/{id}                      → Eliminar
✅ POST   /users/medications/{id}/consume              → Consumir dosis
✅ GET    /users/medications/{id}/reminders            → Listar recordatorios
✅ POST   /users/medications/{id}/reminders            → Crear recordatorio
✅ PUT    /users/medications/{id}/reminders/{rem_id}   → Editar recordatorio
✅ DELETE /users/medications/{id}/reminders/{rem_id}   → Eliminar recordatorio
```

### Citas (9)
```
✅ GET    /users/appointments                          → Listar todos
✅ POST   /users/appointments                          → Crear
✅ PUT    /users/appointments/{id}                     → Editar
✅ DELETE /users/appointments/{id}                     → Eliminar
✅ PATCH  /users/appointments/{id}/status              → Cambiar estado
✅ GET    /users/appointments/{id}/reminders           → Listar recordatorios
✅ POST   /users/appointments/{id}/reminders           → Crear recordatorio
✅ PUT    /users/appointments/{id}/reminders/{rem_id}  → Editar recordatorio
✅ DELETE /users/appointments/{id}/reminders/{rem_id}  → Eliminar recordatorio
```

### Notificaciones (3)
```
✅ GET    /users/notifications                         → Listar notificaciones
✅ GET    /users/notifications/unread-count            → Contar no leídas
✅ GET    /users/notifications/recent                  → Últimas N horas
```

### Dashboard (Extras)
```
✅ GET    /health                                      → Check backend
✅ GET    /users/personal-data                         → Datos personales
✅ GET    /users/medical-history                       → Historial médico
```

**Total: 24 endpoints (pero algunos son GET/POST/PUT/DELETE del mismo recurso)**

---

## 🔄 FLUJOS DE USUARIO

### Flujo 1: Ver Dashboard
```
Usuario autenticado
  ↓ Visita /dashboard
  ↓ Dashboard carga 4 secciones en paralelo:
     • GET /users/personal-data (edad, sangre, alergias)
     • GET /users/medications?filter=active (contar)
     • GET /users/appointments?filter=upcoming (contar)
     • GET /users/notifications?limit=5 (ultimas)
  ↓ Renderiza 3 quick metric cards
  ↓ Renderiza personal summary
  ↓ Renderiza 6 quick action buttons
  ↓ Renderiza update history
```

### Flujo 2: Crear Medicamento
```
Usuario en /medicamentos/alarmas
  ↓ Click "+ Nuevo Medicamento"
  ↓ Modal abre con MedicationForm vacío
  ↓ Rellena: nombre, dosis, frecuencia, total dosis
  ↓ (Opcional) Agrega recordatorios 08:00, 14:00, 20:00
  ↓ Click "Programar Medicamento"
  ↓ Validaciones frontend pasan
  ↓ POST /users/medications
     ↓ Backend retorna medication con ID
     ↓ Para cada recordatorio:
        ↓ POST /users/medications/{id}/reminders
  ↓ Toast "Medicamento creado"
  ↓ Modal cierra
  ↓ GET /users/medications (lista actualiza)
  ↓ MedicationCard aparece en lista
```

### Flujo 3: Consumir Medicamento
```
Usuario en /medicamentos/alarmas
  ↓ Ve medicamento: "Aspirin (500mg) - 5/21 consumidas"
  ↓ Click botón "Consumir"
  ↓ Confirm dialog: "¿Marcar 1 dosis como consumida?"
  ↓ Click "Confirmar"
  ↓ POST /users/medications/{id}/consume
     ↓ Backend actualiza quantity_consumed += 1
     ↓ Si quantity_consumed >= quantity_prescribed:
        → is_finished = true
  ↓ Toast "Dosis registrada"
  ↓ Card actualiza: ahora muestra "6/21"
  ↓ (Si finished) Card se mueve a sección "Finalizados"
```

### Flujo 4: Crear Cita
```
Usuario en /citas/medicas
  ↓ Click "+ Nueva Cita"
  ↓ Modal abre con AppointmentForm vacío
  ↓ Rellena: doctor, especialidad, fecha, hora, ubicación
  ↓ (Opcional) Agrega recordatorios 24h, 1h antes
  ↓ Click "Programar Cita"
  ↓ Validaciones frontend pasan (fecha debe ser futura)
  ↓ POST /users/appointments
     ↓ Backend retorna appointment con ID
     ↓ Para cada recordatorio:
        ↓ POST /users/appointments/{id}/reminders
  ↓ Toast "Cita programada"
  ↓ Modal cierra
  ↓ GET /users/appointments (lista actualiza)
  ↓ AppointmentCard aparece en lista
```

### Flujo 5: Marcar Cita como Completada
```
Usuario en /citas/medicas
  ↓ Ve cita: "Dr. García - Consulta General - 2026-04-15 10:00"
  ↓ Status badge muestra "Programada"
  ↓ Click "Completar"
  ↓ Confirm dialog: "¿Marcar cita como completada?"
  ↓ Click "Confirmar"
  ↓ PATCH /users/appointments/{id}/status
     ↓ Body: { "status": "completada" }
  ↓ Toast "Cita completada"
  ↓ Card actualiza: badge cambia a "Completada" (verde)
  ↓ (Opcional) Card se mueve a sección "Históricas"
```

---

## ✅ VALIDACIONES FRONTEND

### Medicamentos (8 validaciones)
| Campo | Regla | Ejemplo |
|-------|-------|---------|
| Nombre | Requerido, 1-200 chars | "Aspirin 500mg" |
| Dosis | Requerido, 1-100 chars | "500mg cada 4h" |
| Frecuencia | Select requerido | "Cada 4 horas" |
| Total dosis | Número, > 0 | 30 |
| Fecha inicio | YYYY-MM-DD | "2024-12-25" |
| Fecha fin | ≥ fecha inicio | "2025-01-31" |
| Instrucciones | Opcional, max 500 | "Tomar con alimentos" |
| Reminders HH:MM | Único, válido | ["08:00", "14:00", "20:00"] |

### Citas (8 validaciones)
| Campo | Regla | Ejemplo |
|-------|-------|---------|
| Doctor | Requerido, 1-200 chars | "Dr. Juan Pérez" |
| Tipo | Requerido, 1-100 chars | "Chequeo General" |
| Especialidad | Opcional, 1-100 chars | "Cardiología" |
| Ubicación | Requerido, 1-255 chars | "Hospital Central" |
| Fecha | YYYY-MM-DD, futuro | "2026-04-15" |
| Hora | HH:MM | "10:00" |
| Teléfono | Opcional, formato | "(555) 123-4567" |
| Reminders | Horas > 0 | [24, 1] = "24h antes, 1h antes" |

---

## 🎨 DESIGN SYSTEM

### Colors (basado en mockups)
```
Primary:    #0066CC (Azul)
Success:    #2ECC71 (Verde)
Warning:    #E67E22 (Naranja)
Error:      #E74C3C (Rojo)
Background: #FFFFFF (Blanco)
Text:       #333333 (Gris oscuro)
Border:     #DDDDDD (Gris claro)
```

### Typography
```
H1: 32px bold (titulos)
H2: 24px bold (subtítulos)
Body: 16px regular (contenido)
Small: 14px regular (metadata)
Helper: 12px regular (helper text)
```

### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

### Components
```
Buttons: ShadcnUI + Tailwind
Inputs: ShadcnUI Input + custom TimeInput
Dialogs: ShadcnUI Dialog
Cards: Custom BaseCard
Icons: Lucide Icons
```

---

## 📈 ESTADÍSTICAS

| Métrica | Valor |
|---------|-------|
| Archivos a crear | 25+ |
| Componentes nuevos | 15 |
| Custom hooks | 3 |
| API clients | 3 |
| Tipos TypeScript | 3 |
| Páginas nuevas | 3 |
| Endpoints consumidos | 21 |
| Validaciones | 16+ |
| Líneas de código estimadas | 2000+ |
| Horas estimadas | 40-50 |

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Plan completado y documentado
2. ⏳ **Fase 6.1:** Componentes base (BaseCard, Modal, TimeInput, etc.)
3. ⏳ **Fase 6.2:** Dashboard con widgets
4. ⏳ **Fase 6.3:** CRUD Medicamentos
5. ⏳ **Fase 6.4:** CRUD Citas
6. ⏳ **Fase 6.5:** Notificaciones (opcional)

---

## 📚 REFERENCIAS

- Mockups proporcionadas: 5 vistas
- Backend endpoints: 24/24 implementados
- Validaciones: especificadas en plan
- Design system: Tailwind + ShadcnUI

---

**Estado:** 📋 Plan completado, listo para implementación
**Próximo:** Iniciar Fase 6.1 con componentes base
