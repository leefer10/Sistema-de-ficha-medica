# Fase 6: Frontend - Sistema de Medicamentos, Citas y Notificaciones

## Visión General

Implementar 5 vistas frontend con diseño moderno basado en las mockups proporcionadas:
1. **Dashboard Actualizado** - Resumen con widgets de métricas
2. **Alarmas de Medicamentos** - Gestión completa de medicamentos
3. **Programar Medicamentos** - Modal para crear/editar medicamentos
4. **Citas Médicas** - Gestión de citas programadas
5. **Programar Citas Médicas** - Modal para crear/editar citas

**Stack:** Next.js (App Router), React 18, TypeScript, Tailwind CSS, ShadcnUI

---

## 1. COMPONENTES REUTILIZABLES

### BaseCard Component
- Props: `title`, `icon`, `children`, `action`, `empty`
- Usado en: Dashboard, Medicamentos, Citas
- Features: Border, shadow, padding consistente

### Modal / Dialog Component
- Props: `isOpen`, `onClose`, `title`, `children`
- Usado en: Crear/Editar medicamentos y citas
- Features: Overlay, close button, animations

### NotificationBadge Component
- Props: `count`, `type` (medication, appointment)
- Usado en: Dashboard
- Features: Badge color por tipo

### TimeInput Component
- Props: `value`, `onChange`, `format` (HH:MM)
- Usado en: Programar medicamentos, Citas
- Features: Input time con validación

### ReminderSelector Component
- Props: `type` (medication | appointment), `onChange`, `value`
- Usado en: Crear medicamentos, Crear citas
- Features: Multi-select de horas/tiempos

---

## 2. PÁGINAS A CREAR

### 2.1 Dashboard Actualizado
**Ruta:** `/dashboard`
**Archivo:** `frontend/app/dashboard/page.tsx`

**Componentes internos:**
```
DashboardPage
  ├─ Header (Bienvenida + Logout)
  ├─ QuickMetricsRow
  │  ├─ MedicationCard (Medicamentos programados)
  │  ├─ AppointmentCard (Citas programadas)
  │  └─ FinishedMedicationCard (Medicamentos finalizados)
  ├─ PersonalSummarySection
  │  ├─ BloodTypeCard
  │  ├─ AgeCard
  │  ├─ AllergiesCard
  │  └─ AllergiesCard
  ├─ QuickActionsSection
  │  ├─ ActionButton x 6 (Agregar consulta, Gestionar citas, etc.)
  └─ UpdateHistorySection
     └─ HistoryItemList
```

**Endpoints a consumir:**
- GET `/health` - Verificar backend disponible
- GET `/users/personal-data` - Datos personales
- GET `/users/medications?filter=active` - Medicamentos activos
- GET `/users/medications?filter=finished` - Medicamentos finalizados
- GET `/users/appointments?filter=upcoming` - Próximas citas
- GET `/users/medical-history` - Historial médico
- GET `/users/notifications?limit=5` - Últimas notificaciones

**Datos a mostrar:**
- "-- medicamentos programados" (count)
- "-- citas programadas" (count)
- "-- medicamentos finalizados" (count)
- Tipo de sangre, edad, alergias (si existe)
- Últimas 3 actualizaciones médicas

**Features:**
- ✅ Responsive grid layout
- ✅ Cards con iconos y colores por sección
- ✅ Acceso rápido a funciones principales
- ✅ Empty states con CTA buttons

---

### 2.2 Alarmas de Medicamentos (List View)
**Ruta:** `/medicamentos/alarmas`
**Archivo:** `frontend/app/medicamentos/alarmas/page.tsx`

**Componentes internos:**
```
MedicationAlarmsPage
  ├─ Header
  │  ├─ Back button → Dashboard
  │  ├─ Title "Alarmas de Medicamentos"
  │  └─ "+ Nuevo Medicamento" button
  ├─ FormModal (Modal para crear/editar)
  │  └─ MedicationForm
  └─ MedicationListSection
     ├─ Section title "Medicamentos Activos (n)"
     ├─ Empty state (si no hay)
     └─ MedicationCardList
        └─ MedicationCard[] (expandable)
           ├─ Nombre medicamento
           ├─ Dosis
           ├─ Próximo horario de alarma
           ├─ Cantidad (consumida/prescrita)
           ├─ Acciones (Editar, Consumir, Eliminar)
           └─ Expandable reminders list
              └─ Reminder items con toggle on/off
```

**Endpoints a consumir:**
- GET `/users/medications?filter=active` - Medicamentos activos
- POST `/users/medications` - Crear medicamento
- PUT `/users/medications/{id}` - Editar medicamento
- DELETE `/users/medications/{id}` - Eliminar medicamento
- POST `/users/medications/{id}/consume` - Consumir dosis
- POST `/users/medications/{id}/reminders` - Crear recordatorio
- PUT `/users/medications/{id}/reminders/{rem_id}` - Editar recordatorio
- DELETE `/users/medications/{id}/reminders/{rem_id}` - Eliminar recordatorio
- GET `/users/medications/{id}/reminders` - Obtener recordatorios

**Features:**
- ✅ Crear nuevo medicamento (modal)
- ✅ Ver medicamentos activos
- ✅ Expandir para ver recordatorios
- ✅ Toggle on/off de recordatorios
- ✅ Marcar como consumido (botón)
- ✅ Editar medicamento
- ✅ Eliminar medicamento
- ✅ Validación de cantidad consumida
- ✅ Auto-finalizar cuando cantidad_consumida >= cantidad_prescrita

---

### 2.3 Programar Medicamento (Modal/Form)
**Componente:** `frontend/components/medicamentos/MedicationForm.tsx`
**Usado en:** Modal dentro de Alarmas page

**Estructura del Form:**
```
MedicationForm
  ├─ Input: Nombre del Medicamento *
  ├─ Input: Dosis *
  │  └─ Placeholder "Ej: 500mg, 1 tableta"
  ├─ Select: Frecuencia *
  │  └─ Options: Cada 4h, Cada 6h, Cada 8h, Cada 12h, 1 vez/día, 2 veces/día, etc.
  ├─ Input: Total de Dosis (cantidad prescrita) *
  │  └─ Validación: > 0
  │  └─ Helper: "Dejar vacío si es indefinido"
  ├─ DateInput: Fecha de Inicio *
  ├─ DateInput: Fecha de Finalización (opcional)
  ├─ TextArea: Instrucciones
  │  └─ Placeholder "Ej: Tomar con alimentos, evitar lácteos"
  ├─ Section: Programar Recordatorios
  │  ├─ Checkbox: "Deseo programar recordatorios"
  │  └─ Si checked:
  │     └─ TimeMultiSelect
  │        └─ Seleccionar múltiples horas (HH:MM)
  │        └─ Preview de horas seleccionadas
  │        └─ Toggle: Recordatorios habilitados por defecto
  └─ Actions
     ├─ [Programar Medicamento] button (full width)
     └─ [Cancelar] link
```

**Validaciones:**
- ✅ Nombre: requerido, max 200 chars
- ✅ Dosis: requerido, max 100 chars
- ✅ Frecuencia: requerido
- ✅ Total dosis: requerido, > 0
- ✅ Fecha inicio: requerida, validar formato YYYY-MM-DD
- ✅ Fecha finalización: opcional, >= fecha inicio
- ✅ Instrucciones: opcional, max 500 chars
- ✅ Reminders: validar horas HH:MM únicas

**Flujo:**
1. Usuario abre modal → form vacío
2. Rellena campos del medicamento
3. Selecciona frecuencia
4. (Opcional) Añade recordatorios con horas
5. Click "Programar Medicamento"
6. POST /users/medications + n × POST /users/medications/{id}/reminders
7. Toast éxito → modal cierra → lista actualiza

---

### 2.4 Citas Médicas (List View)
**Ruta:** `/citas/medicas`
**Archivo:** `frontend/app/citas/medicas/page.tsx`

**Componentes internos:**
```
MedicalAppointmentsPage
  ├─ Header
  │  ├─ Back button → Dashboard
  │  ├─ Title "Citas Médicas"
  │  └─ "+ Nueva Cita" button
  ├─ FormModal (Modal para crear/editar)
  │  └─ AppointmentForm
  └─ AppointmentListSection
     ├─ Section title "Próximas Citas (n)"
     ├─ Empty state (si no hay)
     └─ AppointmentCardList
        └─ AppointmentCard[] (expandable)
           ├─ Doctor name
           ├─ Especialidad
           ├─ Fecha y hora
           ├─ Ubicación
           ├─ Status badge (Programada/Completada/Cancelada)
           ├─ Acciones (Editar, Completar/Cancelar, Eliminar)
           └─ Expandable reminders section
              └─ Reminder items con toggle on/off
```

**Endpoints a consumir:**
- GET `/users/appointments?filter=upcoming` - Próximas citas
- POST `/users/appointments` - Crear cita
- PUT `/users/appointments/{id}` - Editar cita
- DELETE `/users/appointments/{id}` - Eliminar cita
- PATCH `/users/appointments/{id}/status` - Cambiar estado
- POST `/users/appointments/{id}/reminders` - Crear recordatorio
- PUT `/users/appointments/{id}/reminders/{rem_id}` - Editar recordatorio
- DELETE `/users/appointments/{id}/reminders/{rem_id}` - Eliminar recordatorio
- GET `/users/appointments/{id}/reminders` - Obtener recordatorios

**Features:**
- ✅ Crear nueva cita (modal)
- ✅ Ver citas próximas
- ✅ Expandir para ver recordatorios
- ✅ Toggle on/off de recordatorios
- ✅ Marcar como completada
- ✅ Cancelar cita
- ✅ Editar cita
- ✅ Eliminar cita
- ✅ Validación de fecha futura
- ✅ Bloquear edición si completada/cancelada

---

### 2.5 Programar Cita Médica (Modal/Form)
**Componente:** `frontend/components/citas/AppointmentForm.tsx`
**Usado en:** Modal dentro de Citas page

**Estructura del Form:**
```
AppointmentForm
  ├─ Input: Tipo de Consulta *
  │  └─ Placeholder "Ej: Chequeo General, Odontología"
  ├─ Input: Nombre del Doctor *
  │  └─ Placeholder "Dr. Juan Pérez"
  ├─ Input: Especialidad
  │  └─ Placeholder "Cardiología, Dermatología, etc."
  ├─ Input: Ubicación *
  │  └─ Placeholder "Hospital o clínica"
  ├─ DateInput: Fecha y Hora *
  │  ├─ Date picker (YYYY-MM-DD)
  │  └─ Time picker (HH:MM)
  ├─ Input: Teléfono
  │  └─ Placeholder "(XXX) XXX-XXXX"
  ├─ TextArea: Notas Adicionales
  │  └─ Placeholder "Motivo de consulta, preparación necesaria, etc."
  ├─ Section: Programar Recordatorios
  │  ├─ Checkbox: "Deseo recordatorios"
  │  └─ Si checked:
  │     └─ ReminderSelector
  │        └─ Seleccionar múltiples horas antes (24, 12, 2, 1 hora)
  │        └─ Checkboxes: 1 día antes, 12h antes, 2h antes, 1h antes, etc.
  │        └─ Toggle: Recordatorios habilitados por defecto
  └─ Actions
     ├─ [Programar Cita] button (full width)
     └─ [Cancelar] link
```

**Validaciones:**
- ✅ Tipo consulta: requerido, max 100 chars
- ✅ Nombre doctor: requerido, max 200 chars
- ✅ Especialidad: opcional, max 100 chars
- ✅ Ubicación: requerido, max 255 chars
- ✅ Fecha/hora: requerido, debe ser futuro
- ✅ Teléfono: opcional, validar formato
- ✅ Notas: opcional, max 500 chars
- ✅ Reminders: horas > 0

**Flujo:**
1. Usuario abre modal → form vacío
2. Rellena datos de la cita
3. Selecciona fecha y hora (validar futuro)
4. (Opcional) Añade recordatorios
5. Click "Programar Cita"
6. POST /users/appointments + n × POST /users/appointments/{id}/reminders
7. Toast éxito → modal cierra → lista actualiza

---

## 3. ESTRUCTURA DE CARPETAS

```
frontend/
├─ app/
│  ├─ layout.tsx
│  ├─ dashboard/
│  │  ├─ page.tsx          # Dashboard main
│  │  └─ components/
│  │     ├─ QuickMetrics.tsx
│  │     ├─ PersonalSummary.tsx
│  │     ├─ QuickActions.tsx
│  │     └─ UpdateHistory.tsx
│  ├─ medicamentos/
│  │  └─ alarmas/
│  │     ├─ page.tsx       # Medicamentos list
│  │     └─ components/
│  │        └─ MedicationList.tsx
│  └─ citas/
│     └─ medicas/
│        ├─ page.tsx       # Citas list
│        └─ components/
│           └─ AppointmentList.tsx
├─ components/
│  ├─ common/
│  │  ├─ BaseCard.tsx
│  │  ├─ Modal.tsx
│  │  ├─ TimeInput.tsx
│  │  └─ ReminderSelector.tsx
│  ├─ medicamentos/
│  │  ├─ MedicationForm.tsx
│  │  ├─ MedicationCard.tsx
│  │  └─ MedicationListItem.tsx
│  ├─ citas/
│  │  ├─ AppointmentForm.tsx
│  │  ├─ AppointmentCard.tsx
│  │  └─ AppointmentListItem.tsx
│  └─ notifications/
│     ├─ NotificationBadge.tsx
│     └─ NotificationCenter.tsx
├─ lib/
│  ├─ api/
│  │  ├─ medications.ts
│  │  ├─ appointments.ts
│  │  └─ notifications.ts
│  ├─ hooks/
│  │  ├─ useMedications.ts
│  │  ├─ useAppointments.ts
│  │  └─ useNotifications.ts
│  └─ types/
│     ├─ medication.ts
│     ├─ appointment.ts
│     └─ notification.ts
└─ styles/
   └─ globals.css
```

---

## 4. TIPOS TYPESCRIPT

### `lib/types/medication.ts`
```typescript
interface Medication {
  id: number
  nombre: string
  dosis: string
  frecuencia: string
  motivo?: string
  activo: boolean
  quantity_prescribed?: number
  quantity_consumed: number
  remaining_quantity: number
  is_finished: boolean
  created_at: string
  updated_at: string
}

interface MedicationReminder {
  id: number
  medication_id: number
  reminder_time: string  // HH:MM
  is_enabled: boolean
  created_at: string
}

interface CreateMedicationDTO {
  nombre: string
  dosis: string
  frecuencia: string
  motivo?: string
  quantity_prescribed?: number
  reminders?: { reminder_time: string; is_enabled: boolean }[]
}
```

### `lib/types/appointment.ts`
```typescript
interface Appointment {
  id: number
  doctor_name: string
  appointment_type: string
  appointment_date: string  // YYYY-MM-DD
  appointment_time: string  // HH:MM
  appointment_type?: string
  location: string
  notes?: string
  status: 'programada' | 'completada' | 'cancelada'
  created_at: string
  updated_at: string
}

interface AppointmentReminder {
  id: number
  appointment_id: number
  reminder_before_hours: number
  is_enabled: boolean
  created_at: string
}

interface CreateAppointmentDTO {
  doctor_name: string
  appointment_type: string
  appointment_date: string
  appointment_time: string
  location: string
  notes?: string
  reminders?: { reminder_before_hours: number; is_enabled: boolean }[]
}
```

### `lib/types/notification.ts`
```typescript
interface Notification {
  id: number
  user_id: number
  notification_type: 'medication_reminder' | 'appointment_reminder'
  message: string
  related_id?: number
  related_type?: 'medication' | 'appointment'
  delivery_method: 'in_app' | 'push' | 'email'
  sent_at: string
  created_at: string
  updated_at: string
}
```

---

## 5. API CLIENT FUNCTIONS

### `lib/api/medications.ts`
```typescript
export async function getMedications(filter?: 'active' | 'finished') {
  const params = filter ? `?filter=${filter}` : ''
  return fetch(`/api/users/medications${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())
}

export async function createMedication(data: CreateMedicationDTO) {
  return fetch('/api/users/medications', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(r => r.json())
}

export async function consumeMedication(medId: number, quantity: number) {
  return fetch(`/api/users/medications/${medId}/consume`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quantity_consumed: quantity })
  }).then(r => r.json())
}

export async function createReminder(medId: number, reminderTime: string) {
  return fetch(`/api/users/medications/${medId}/reminders`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reminder_time: reminderTime, is_enabled: true })
  }).then(r => r.json())
}
```

### `lib/api/appointments.ts`
Similar a medications.ts pero con endpoints `/api/users/appointments`

### `lib/api/notifications.ts`
```typescript
export async function getNotifications(limit: number = 50) {
  return fetch(`/api/users/notifications?limit=${limit}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())
}

export async function getUnreadCount() {
  return fetch('/api/users/notifications/unread-count', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(r => r.json())
}
```

---

## 6. CUSTOM HOOKS

### `lib/hooks/useMedications.ts`
```typescript
export function useMedications(filter?: 'active' | 'finished') {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMedications(filter)
      .then(setMedications)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [filter])

  return { medications, loading, error }
}
```

Similar para useAppointments y useNotifications

---

## 7. FLUJOS DE USUARIO

### Flujo: Crear Medicamento
```
Dashboard
  ↓ Click "Mis Medicamentos"
Medicamentos/Alarmas Page
  ↓ Click "+ Nuevo Medicamento"
MedicationForm Modal (vacío)
  ↓ Rellena: nombre, dosis, frecuencia, total dosis
  ↓ Añade reminders (opcionales): 08:00, 14:00, 20:00
  ↓ Click "Programar Medicamento"
Backend: POST /users/medications
         + POST /users/medications/{id}/reminders (3 veces)
         + GET /users/medications/{id}/reminders
  ↓ Toast success
  ↓ Modal cierra
  ↓ Lista actualiza con nuevo medicamento
Medicamentos/Alarmas Page (actualizada)
```

### Flujo: Consumir Medicamento
```
Medicamentos/Alarmas Page
  ↓ Ver medicamento (Ej: Aspirin 500mg, 5/21 consumidas)
  ↓ Click "Consumir" en medicamento
Confirm dialog: "Marcar 1 dosis como consumida?"
  ↓ Click "Confirmar"
Backend: POST /users/medications/{id}/consume
         → respuesta: { remaining: 16, is_finished: false }
  ↓ Toast "Dosis registrada"
  ↓ Card actualiza: ahora muestra 6/21
  ↓ Si quantity_consumed >= quantity_prescribed:
     → Status cambia a "Finalizado"
     → Card movedida a sección "Medicamentos Finalizados"
```

### Flujo: Crear Cita
```
Dashboard
  ↓ Click "Gestionar Citas"
Citas/Medicas Page
  ↓ Click "+ Nueva Cita"
AppointmentForm Modal (vacío)
  ↓ Rellena: doctor, especialidad, fecha, hora, ubicación
  ↓ Añade reminders (opcionales): 24h, 1h antes
  ↓ Click "Programar Cita"
Backend: POST /users/appointments
         + POST /users/appointments/{id}/reminders (2 veces)
         + GET /users/appointments/{id}/reminders
  ↓ Toast success
  ↓ Modal cierra
  ↓ Lista actualiza con nueva cita
Citas/Medicas Page (actualizada)
```

---

## 8. MANEJO DE ESTADO

### Opciones consideradas:
1. **useState + useContext** - Simple, suficiente para este caso
2. **Redux** - Over-engineering
3. **TanStack Query (React Query)** - Ideal para caché + sincronización

### Decisión: **TanStack Query + Context** (opcional por ahora)
- Por ahora: useState con efectos en custom hooks
- Futuro: migrar a TanStack Query cuando haya más endpoints

---

## 9. VALIDACIONES FRONTEND

### Medicamentos
- ✅ Nombre: requerido, 1-200 chars
- ✅ Dosis: requerido, 1-100 chars
- ✅ Frecuencia: requerido
- ✅ Total dosis: número > 0 si está definido
- ✅ Instrucciones: max 500 chars
- ✅ Recordatorios: HH:MM único, debe ser válido

### Citas
- ✅ Doctor: requerido, 1-200 chars
- ✅ Fecha: requerido, formato YYYY-MM-DD, debe ser futuro
- ✅ Hora: requerido, formato HH:MM
- ✅ Ubicación: requerido, 1-255 chars
- ✅ Teléfono: opcional, validar formato
- ✅ Recordatorios: horas > 0

---

## 10. INTEGRACIONES CON BACKEND

| Endpoint | Método | Frontend Usa | Responsabilidad |
|----------|--------|------|---|
| `/users/medications` | GET | useMedications + MedicationList | Listar medicamentos |
| `/users/medications` | POST | MedicationForm | Crear medicamento |
| `/users/medications/{id}` | PUT | MedicationForm | Editar medicamento |
| `/users/medications/{id}` | DELETE | MedicationCard actions | Eliminar medicamento |
| `/users/medications/{id}/consume` | POST | MedicationCard | Consumir dosis |
| `/users/medications/{id}/reminders` | GET | MedicationCard expand | Ver recordatorios |
| `/users/medications/{id}/reminders` | POST | MedicationForm | Crear recordatorio |
| `/users/medications/{id}/reminders/{rem_id}` | PUT | RemindersSection | Editar recordatorio |
| `/users/medications/{id}/reminders/{rem_id}` | DELETE | RemindersSection | Eliminar recordatorio |
| `/users/appointments` | GET | useAppointments + AppointmentList | Listar citas |
| `/users/appointments` | POST | AppointmentForm | Crear cita |
| `/users/appointments/{id}` | PUT | AppointmentForm | Editar cita |
| `/users/appointments/{id}` | DELETE | AppointmentCard actions | Eliminar cita |
| `/users/appointments/{id}/status` | PATCH | AppointmentCard | Cambiar estado |
| `/users/appointments/{id}/reminders` | GET | AppointmentCard expand | Ver recordatorios |
| `/users/appointments/{id}/reminders` | POST | AppointmentForm | Crear recordatorio |
| `/users/appointments/{id}/reminders/{rem_id}` | PUT | RemindersSection | Editar recordatorio |
| `/users/appointments/{id}/reminders/{rem_id}` | DELETE | RemindersSection | Eliminar recordatorio |
| `/users/notifications` | GET | Dashboard + NotificationCenter | Ver notificaciones |
| `/users/notifications/unread-count` | GET | Header badge | Contar no leídas |

---

## 11. CONSIDERACIONES DE DISEÑO

### Color Scheme (basado en mockups)
- **Primary:** Azul (#0066CC o similar)
- **Success:** Verde (#2ECC71)
- **Warning:** Naranja (#E67E22)
- **Error:** Rojo (#E74C3C)
- **Background:** Blanco + gris claro
- **Text:** Gris oscuro (#333)

### Spacing & Typography
- Seguir Tailwind defaults
- Max width: 1200px en desktop
- Mobile first approach
- Padding consistente: 16px, 24px, 32px

### Componentes de UI
- ShadcnUI buttons, inputs, dialogs
- Tailwind para layout y spacing
- Lucide icons para iconografía

### Loading States
- Skeleton loading para listas
- Spinner en buttons durante POST/PUT/DELETE
- Toast notifications para feedback

### Error Handling
- Toast de error con mensaje amigable
- Retry buttons cuando falla fetch
- Fallback empty states
- Validación en cliente ANTES de enviar

---

## 12. TESTING CONSIDERACIONES

Cada componente debería tener:
- ✅ Pruebas unitarias (Jest + React Testing Library)
- ✅ Testing de integración (formas + API)
- ✅ Testing de accesibilidad (a11y)

Pero por ahora: **focus en funcionalidad**, testing es opcional

---

## 13. ROADMAP DE IMPLEMENTACIÓN

**Fase 6.1:** Componentes Base
- BaseCard, Modal, TimeInput, ReminderSelector

**Fase 6.2:** Dashboard Actualizado
- Layout responsive con widgets
- Consumo de endpoints para métricas

**Fase 6.3:** Medicamentos
- MedicationForm, MedicationList, MedicationCard
- CRUD completo con reminders

**Fase 6.4:** Citas
- AppointmentForm, AppointmentList, AppointmentCard
- CRUD completo con reminders + status

**Fase 6.5:** Notificaciones (Optional)
- NotificationCenter en header
- Real-time updates si WebSocket disponible

---

## 14. TÉCNICAS AVANZADAS (Futuro)

1. **Real-time Notifications**
   - WebSocket para notificaciones en tiempo real
   - O polling cada 30 segundos

2. **Offline Support**
   - Service Worker para caché
   - Sync cuando regresa conexión

3. **PWA Features**
   - Web manifest para instalable
   - Push notifications nativas

4. **Performance**
   - Image optimization (Next.js Image)
   - Code splitting por ruta
   - Lazy loading de componentes

---

## ESTADO: LISTO PARA IMPLEMENTACIÓN

✅ Plan estructurado
✅ Componentes definidos
✅ Endpoints mapeados
✅ Flujos documentados
✅ Tipos TypeScript listos
✅ Validaciones especificadas

**Próximo paso:** Confirmar plan y comenzar Fase 6.1 (componentes base)
