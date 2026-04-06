# 🧪 Phase 1 & 2 Testing Guide

## Quick Start: 3 Pasos

### 1️⃣ Inicia el Backend
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### 2️⃣ Inicia el Frontend  
Abre otra terminal y ejecuta:

```bash
cd frontend
npm run dev
```

Deberías ver:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

### 3️⃣ Test Automático
Abre una TERCERA terminal y ejecuta:

```bash
cd backend
python
```

Luego dentro de Python:
```python
from pathlib import Path
import sys
sys.path.insert(0, str(Path.cwd()))

# Ya está - ahora ve a http://localhost:3000
```

---

## Manual Testing Flow

### 🔐 Phase 1: Authentication

#### Test A: Register
1. Navega a http://localhost:3000/register
2. Llena el formulario:
   - **Nombre Completo**: `Juan Pérez`
   - **Email**: `testuser@example.com`
   - **Contraseña**: `Password123`
   - **Confirmar Contraseña**: `Password123`
   - ✅ Acepta términos y condiciones
3. Click "Crear Cuenta"

**Esperado:**
- ✅ Se crea el usuario
- ✅ Se redirige a /welcome
- ✅ localStorage tiene `authToken` y `userId`

**Verificar en Console:**
```javascript
localStorage.getItem('authToken')  // Debe mostrar un JWT token
localStorage.getItem('userId')    // Debe mostrar un número
```

#### Test B: Login
1. Navega a http://localhost:3000/login
2. Ingresa credenciales:
   - **Email**: `testuser@example.com`
   - **Contraseña**: `Password123`
3. Click "Iniciar Sesión"

**Esperado:**
- ✅ Se autentica el usuario
- ✅ Se redirige a /dashboard
- ✅ localStorage contiene token válido

---

### 📊 Phase 2: User Profile & Medical Data

#### Test C: Dashboard Load
1. Deberías estar en http://localhost:3000/dashboard
2. Espera a que carguen los datos (máx 3 segundos)

**Esperado:**
- ✅ Loading spinner desaparece
- ✅ Muestra nombre del usuario: "Bienvenido, Juan"
- ✅ Estadísticas: 0 Medicamentos, 0 Vacunas, 0 Cirugías
- ✅ Resumen médico (vacío al inicio)
- ✅ Botones de acciones funcionan

**Verificar en Console:**
```javascript
// Abre DevTools (F12)
// Ve a Console tab
// Expande las Network requests
// Deberías ver: GET /users/me/medical (200)
//              GET /users/personal-data/1 (404 es normal si no existe)
```

#### Test D: Edit Personal Data
1. Click "Editar Mis Datos"
2. Llenar formulario:
   - **Teléfono**: `+1-809-555-1234`
   - **Ciudad**: `Santo Domingo`
   - **Dirección**: `Calle Principal 123`
   - **País**: `República Dominicana`
   - **Tipo de Sangre**: `O+`
   - **Alergias**: `Penicilina`
3. Click "Guardar Cambios"

**Esperado:**
- ✅ Loading spinner mientras guarda
- ✅ Alert verde "Datos guardados correctamente"
- ✅ Redirige a /dashboard después de 1.5 segundos
- ✅ Los datos se guardan en BD

**Verificar en Console (Network tab):**
```
PUT /users/personal-data/1 (200/201)
PUT /users/medical-history/1 (200/201)
```

#### Test E: Dashboard Actualizado
1. Después de guardar, vuelves a /dashboard
2. Refresca la página (F5)

**Esperado:**
- ✅ Los datos se cargan nuevamente desde BD
- ✅ Tipo de sangre muestra: "O+"
- ✅ Alergias muestra: "Penicilina"
- ✅ Contacto muestra: "+1-809-555-1234"

---

## 🐛 Troubleshooting

### "Cannot connect to http://localhost:8000"
- ✅ Verifica que el backend está corriendo
- ✅ Verifica que el puerto 8000 está disponible
- ✅ Try: `netstat -an | find ":8000"`

### "Error al iniciar sesión"
- ✅ Verifica credenciales (email y contraseña)
- ✅ Abre http://localhost:8000/docs para ver API docs
- ✅ Intenta registrarse de nuevo

### "Datos no se cargan en dashboard"
- ✅ Abre DevTools (F12)
- ✅ Ve a Network tab
- ✅ Mira si `/users/me/medical` tiene error
- ✅ Verifica que el token es válido en localStorage

### "Error 404 en /users/personal-data"
- ✅ Esto es NORMAL la primera vez
- ✅ El sistema crea automáticamente usando POST
- ✅ Si guardaste datos, deberían aparecer

---

## ✅ Checklist de Prueba

| Feature | Test | Esperado | Status |
|---------|------|----------|--------|
| **Phase 1** |
| Register | Crear cuenta nueva | ✅ Redirige /welcome | ❓ |
| Login | Iniciar sesión | ✅ Redirige /dashboard + token | ❓ |
| Logout | Click logout | ✅ Limpia token, redirige /login | ❓ |
| **Phase 2** |
| Load Dashboard | Abrir /dashboard | ✅ Carga datos médicos | ❓ |
| Personal Data | Editar datos | ✅ Guarda en BD | ❓ |
| Medical History | Ver alergias | ✅ Muestra datos guardados | ❓ |
| Error Handling | Sin conexión | ✅ Muestra error | ❓ |

---

## 📝 API Endpoints Testeados

### Authentication
```
POST /auth/register       → Crear usuario
POST /auth/login          → Obtener JWT token
```

### Medical Data (Phase 2)
```
GET  /users/me/medical              → Resumen médico del usuario
GET  /users/personal-data/{uid}     → Obtener datos personales
POST /users/personal-data/{uid}     → Crear datos personales
PUT  /users/personal-data/{uid}     → Actualizar datos personales
GET  /users/medical-history/{uid}   → Obtener historial médico
POST /users/medical-history/{uid}   → Crear historial médico
PUT  /users/medical-history/{uid}   → Actualizar historial médico
```

---

## 💾 Datos de Prueba

```
Email:    testuser@example.com
Password: Password123
```

Para crear múltiples usuarios, usa diferentes emails:
- testuser1@example.com
- testuser2@example.com
- testuser3@example.com

---

## 🎯 Resultado Esperado

Después de completar todos los tests:

✅ **Phase 1**: 
- Puedes registrarte y loguearte
- JWT token se guarda y se envía en headers
- 401 errors redirigen a login

✅ **Phase 2**:
- Dashboard carga datos del backend
- Puedes editar datos personales
- Los cambios se guardan en BD
- Al recargar la página, los datos persisten

---

¡Si todo funciona, estamos listos para Phase 3! 🚀
