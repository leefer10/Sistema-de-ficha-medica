# 📋 Plan de Integración Completa: Backend + Frontend

## Estado: ✅ ANÁLISIS COMPLETADO

---

## 🎯 OBJETIVO

Conectar completamente los 13 routers del backend (50+ endpoints) con los 18 componentes del frontend.

**Estatus Actual:**
- ✅ Backend: 100% implementado
- ✅ Frontend UI: 100% diseñado  
- ⚠️ Integración: 4% (solo OCR)
- 📊 Tiempo estimado: 2-3 semanas

---

## 📊 BACKEND - ROUTERS DISPONIBLES

### 1. **AUTH** (/auth) - Autenticación
```
POST /register       → Crear nuevo usuario + auto-crear MedicalRecord
POST /login          → JWT token (sub: user_id, role: role)
```

### 2. **PERSONAL DATA** (/users/personal-data) - Datos Personales
```
POST /{user_id}      → Crear datos personales
GET /{user_id}       → Obtener datos personales
PUT /{user_id}       → Actualizar datos personales
```

### 3. **MEDICAL HISTORY** (/users/medical-history) - Historial Médico
```
POST /{user_id}      → Crear historial
GET /{user_id}       → Obtener historial
PUT /{user_id}       → Actualizar historial
```

### 4. **MEDICATIONS** (/users/medications) - Medicaciones
```
POST /{user_id}      → Crear medicación
GET /{user_id}       → Listar todas
GET /{user_id}/{id}  → Obtener una
PUT /{user_id}/{id}  → Actualizar
DELETE /{user_id}/{id} → Eliminar (204)
```

### 5. **VACCINES** (/users/vaccines) - Vacunas
```
POST /{user_id}
GET /{user_id}
GET /{user_id}/{id}
PUT /{user_id}/{id}
DELETE /{user_id}/{id}
```

### 6. **SURGERIES** (/users/surgeries) - Cirugías
```
POST /{user_id}
GET /{user_id}
GET /{user_id}/{id}
PUT /{user_id}/{id}
DELETE /{user_id}/{id}
```

### 7. **EMERGENCY CONTACTS** (/users/emergency-contacts) - Contactos
```
POST /{user_id}
GET /{user_id}
GET /{user_id}/{id}
PUT /{user_id}/{id}
DELETE /{user_id}/{id}
```

### 8. **HABITS** (/users/habits) - Hábitos
```
POST /{user_id}      → Crear hábitos
GET /{user_id}       → Obtener hábitos
PUT /{user_id}       → Actualizar hábitos
```

### 9. **QR** (Root) - Código QR
```
GET /my-qr           → (Auth required) Obtener QR del usuario
GET /emergency/{token} → (Public) Datos de emergencia por QR
```

### 10. **OCR** (/fichas) - Escaneo Médico
```
POST /scan           → ✅ Ya implementado
POST /save           → ✅ Ya implementado
```

### 11. **ME** (/users) - Mi Información
```
GET /me/medical      → (Auth) Resumen completo del usuario
```

### 12. **ADMIN** (/admin) - Administración
```
GET /users
GET /users/{id}
POST /managers
PUT /users/{id}/role
```

### 13. **MANAGER** (/manager) - Gestor Médico
```
GET /users/{id}/medical
```

---

## 🎨 FRONTEND - COMPONENTES A INTEGRAR

### Páginas Principales (18 total)

| # | Componente | Archivo | Conectar Con | Status |
|----|-----------|---------|--------------|--------|
| 1 | Login | LoginPage.tsx | POST /auth/login | ❌ |
| 2 | Register | RegisterPage.tsx | POST /auth/register | ❌ |
| 3 | Personal Data | PersonalDataPage.tsx | /users/personal-data/{uid} | ❌ |
| 4 | Dashboard | DashboardPage.tsx | GET /users/me/medical | ❌ |
| 5 | Medical History | MedicalHistoryPage.tsx | /users/medical-history/{uid} | ❌ |
| 6 | Add Consultation | AddConsultationPage.tsx | POST /users/{uid}/medical-history | ❌ |
| 7 | Medical Record Detail | MedicalRecordDetailPage.tsx | GET /users/{uid}/{resource} | ❌ |
| 8 | Edit Medical Record | EditMedicalRecordPage.tsx | PUT /users/{uid}/{resource} | ❌ |
| 9 | Manual Form | ManualFormPage.tsx | POST /users/{uid}/{medications/vaccines/surgeries} | ❌ |
| 10 | OCR Upload | OcrUploadPage.tsx | POST /fichas/scan, /fichas/save | ✅ |
| 11 | Generate QR | GenerateQRPage.tsx | GET /my-qr | ❌ |
| 12 | Method Selection | MethodSelectionPage.tsx | Navigation | - |
| 13 | Settings | SettingsPage.tsx | localStorage (read-only) | - |
| 14 | Success | SuccessPage.tsx | Static | - |
| 15 | Welcome | WelcomePage.tsx | Static | - |
| 16 | Landing | LandingPage.tsx | Static | - |
| 17 | Not Found | NotFound.tsx | Static | - |
| 18 | Root | Root.tsx | Router | - |

---

## 📋 PLAN EN 6 FASES (2-3 semanas)

### **PHASE 1: AUTHENTICATION (Días 1-3)** - CRÍTICA 🔴

**Objetivo:** Login/Register con JWT funcional

**Tareas:**
- [ ] Crear `api-client.ts` wrapper
  - Centralizar todas las llamadas fetch()
  - Agregar Authorization Bearer header
  - Manejar 401/403 errors
  - Centralizar error handling

- [ ] LoginPage.tsx
  - [ ] POST /auth/login
  - [ ] Extraer JWT del response
  - [ ] Guardar en localStorage.authToken
  - [ ] Extraer user_id del JWT {sub}
  - [ ] Guardar user_id en localStorage
  - [ ] Redirigir a dashboard
  - [ ] Mostrar errores

- [ ] RegisterPage.tsx
  - [ ] POST /auth/register
  - [ ] Auto-crear MedicalRecord (backend lo hace)
  - [ ] Guardar JWT
  - [ ] Redirigir a welcome

- [ ] Sistema de tokens
  - [ ] Almacenar JWT en localStorage.authToken
  - [ ] Incluir en Authorization header
  - [ ] Manejo básico de expiración
  - [ ] Botón de logout

**Archivos a Modificar:**
- `frontend/components/LoginPage.tsx`
- `frontend/components/RegisterPage.tsx`
- `frontend/api-client.ts` (NUEVO)

---

### **PHASE 2: USER PROFILE DATA (Días 4-6)** - ALTA 🟠

**Objetivo:** Datos personales y dashboard reales

**Tareas:**
- [ ] PersonalDataPage.tsx
  - [ ] POST /users/personal-data/{uid} (crear)
  - [ ] GET /users/personal-data/{uid} (pre-llenar formulario)
  - [ ] PUT /users/personal-data/{uid} (actualizar)

- [ ] DashboardPage.tsx
  - [ ] Reemplazar mock data
  - [ ] GET /users/me/medical (resumen completo)
  - [ ] Mostrar datos reales del usuario

**Archivos a Modificar:**
- `frontend/components/PersonalDataPage.tsx`
- `frontend/components/DashboardPage.tsx`

---

### **PHASE 3: MEDICAL RECORDS CRUD (Días 7-9)** - ALTA 🟠

**Objetivo:** Crear, leer, actualizar registros médicos

**Tareas:**
- [ ] MedicalHistoryPage.tsx
  - [ ] GET /users/{uid}/medical-history

- [ ] AddConsultationPage.tsx
  - [ ] POST /users/{uid}/medical-history

- [ ] EditMedicalRecordPage.tsx
  - [ ] PUT /users/{uid}/medical-history

**Archivos a Modificar:**
- `frontend/components/MedicalHistoryPage.tsx`
- `frontend/components/AddConsultationPage.tsx`
- `frontend/components/EditMedicalRecordPage.tsx`

---

### **PHASE 4: MEDICAL ITEMS CRUD (Días 10-12)** - MEDIA 🟡

**Objetivo:** Medicaciones, vacunas, cirugías, contactos, hábitos

**Tareas:**
- [ ] Medications
  - [ ] POST/GET/PUT/DELETE /users/{uid}/medications
  - [ ] ManualFormPage.tsx (crear)
  - [ ] MedicalRecordDetailPage.tsx (listar/editar/eliminar)

- [ ] Vaccines
  - [ ] POST/GET/PUT/DELETE /users/{uid}/vaccines

- [ ] Surgeries
  - [ ] POST/GET/PUT/DELETE /users/{uid}/surgeries

- [ ] Emergency Contacts
  - [ ] POST/GET/PUT/DELETE /users/{uid}/emergency-contacts

- [ ] Habits
  - [ ] POST/GET/PUT /users/{uid}/habits

**Archivos a Modificar:**
- `frontend/components/ManualFormPage.tsx`
- `frontend/components/MedicalRecordDetailPage.tsx`

---

### **PHASE 5: QR & EMERGENCY (Días 13-15)** - MEDIA 🟡

**Objetivo:** QR generation y emergency responder access

**Tareas:**
- [ ] GenerateQRPage.tsx
  - [ ] GET /my-qr (authenticated)
  - [ ] Decodificar base64 QR image
  - [ ] Mostrar QR code

**Archivos a Modificar:**
- `frontend/components/GenerateQRPage.tsx`

---

### **PHASE 6: POLISH & TESTING (Días 16-20)** - BAJA 🟢

**Objetivo:** Production-ready

**Tareas:**
- [ ] Loading states
  - [ ] Spinners durante API calls
  - [ ] Skeleton screens
  - [ ] Disable buttons durante submission

- [ ] Error handling
  - [ ] Error boundaries
  - [ ] Toast notifications
  - [ ] Validación de formularios

- [ ] Testing
  - [ ] Token refresh
  - [ ] Token expiration
  - [ ] Network failures
  - [ ] 401/403 errors
  - [ ] Server validation errors

- [ ] Performance
  - [ ] Lazy loading
  - [ ] Code splitting
  - [ ] Caching strategy

---

## 🔐 AUTENTICACIÓN - DETALLES

### JWT Token
```
Algorithm: HS256
Payload: {
  sub: "user_id_as_string",
  role: "user|manager|admin"
}
Ejemplo: {sub: "5", role: "user"}
```

### Token Management Flow
```
1. Usuario hace login → POST /auth/login
2. Backend retorna → {access_token: "eyJ0...", token_type: "bearer"}
3. Frontend guarda → localStorage.authToken = access_token
4. Frontend extrae → user_id = JWT.decode(token).sub
5. Frontend guarda → localStorage.userId = user_id
6. Cada request lleva → Authorization: Bearer {token}
7. Backend valida → get_current_user() dependency
```

### Roles & Permissions
```
user     → Acceso a datos propios solamente
manager  → Puede ver datos de otros usuarios
admin    → Gestión de usuarios, cambiar roles
```

---

## ⚠️ PROBLEMAS ACTUALES

### Seguridad ❌
- NO autenticación en endpoints (todos públicos)
- NO JWT storage (mock: isLoggedIn = "true")
- NO Authorization headers en requests
- NO token refresh
- NO logout

### Datos ❌
- TODO en localStorage (MOCK)
- NO sincronización con backend
- NO IDs de usuario reales
- NO validación del servidor

### Arquitectura ❌
- NO API wrapper (fetch() duplicado en componentes)
- NO error handling centralizado
- NO loading states
- NO state management
- NO caching

---

## 📊 INTEGRATION MAPPING - TABLA COMPLETA

| # | Frontend Component | Backend Endpoint | Method | Status | Phase |
|----|---|---|---|---|---|
| 1 | LoginPage | /auth/login | POST | ❌ | P1 |
| 2 | RegisterPage | /auth/register | POST | ❌ | P1 |
| 3 | PersonalDataPage | /users/personal-data/{uid} | POST | ❌ | P2 |
| 4 | PersonalDataPage | /users/personal-data/{uid} | GET | ❌ | P2 |
| 5 | PersonalDataPage | /users/personal-data/{uid} | PUT | ❌ | P2 |
| 6 | DashboardPage | /users/me/medical | GET | ❌ | P2 |
| 7 | MedicalHistoryPage | /users/{uid}/medical-history | GET | ❌ | P3 |
| 8 | AddConsultationPage | /users/{uid}/medical-history | POST | ❌ | P3 |
| 9 | EditMedicalRecordPage | /users/{uid}/medical-history | PUT | ❌ | P3 |
| 10 | ManualFormPage | /users/{uid}/medications | POST | ❌ | P4 |
| 11 | ManualFormPage | /users/{uid}/vaccines | POST | ❌ | P4 |
| 12 | ManualFormPage | /users/{uid}/surgeries | POST | ❌ | P4 |
| 13 | ManualFormPage | /users/{uid}/habits | POST | ❌ | P4 |
| 14 | ManualFormPage | /users/{uid}/emergency-contacts | POST | ❌ | P4 |
| 15 | MedicalRecordDetailPage | /users/{uid}/medications | GET | ❌ | P4 |
| 16 | MedicalRecordDetailPage | /users/{uid}/vaccines | GET | ❌ | P4 |
| 17 | MedicalRecordDetailPage | /users/{uid}/surgeries | GET | ❌ | P4 |
| 18 | MedicalRecordDetailPage | /users/{uid}/emergency-contacts | GET | ❌ | P4 |
| 19 | (Any) | /users/{uid}/{resource}/{id} | DELETE | ❌ | P4 |
| 20 | GenerateQRPage | /my-qr | GET | ❌ | P5 |
| 21 | OcrUploadPage | /fichas/scan | POST | ✅ | DONE |
| 22 | OcrUploadPage | /fichas/save | POST | ✅ | DONE |

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

1. **Crear api-client.ts** - Wrapper centralizado (Phase 1)
2. **Conectar LoginPage** - POST /auth/login (Phase 1)
3. **Conectar RegisterPage** - POST /auth/register (Phase 1)
4. **Pruebas** - Login + crear cuenta funcional

**¿Quieres que comencemos con Phase 1?**
