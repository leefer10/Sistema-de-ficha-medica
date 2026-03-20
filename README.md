# Sistema de Hermanos Para su Salud

Sistema integral de gestión de fichas médicas con OCR/IA para automatizar la captura de datos médicos.

## 📋 Descripción

Aplicación para digitalizar y procesar fichas médicas usando:
- **Backend:** FastAPI + PostgreSQL
- **OCR:** Google Cloud Vision API
- **Autenticación:** JWT
- **QR:** Generación de códigos QR para pacientes

## 🏗️ Estructura del Proyecto

```
.
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── models/            # Modelos SQLAlchemy
│   │   ├── schemas/           # Esquemas Pydantic
│   │   ├── routers/           # Rutas de API
│   │   ├── services/          # Lógica de negocio (OCR, etc)
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt       # Dependencias Python
│   ├── Dockerfile            # Imagen Docker para producción
│   ├── .env.example          # Variables de entorno (template)
│   └── RAILWAY_DEPLOYMENT.md # Guía deployment
├── .venv/                     # Entorno virtual Python
├── .gitignore                # Archivos ignorados en Git
├── Documentacion.docx        # Documentación del proyecto
└── GITHUB_SETUP.md           # Guía para subir a GitHub
```

## 🚀 Quick Start

### Requisitos
- Python 3.11+
- PostgreSQL
- Credenciales de Google Cloud Vision API

### Instalación Local

```bash
# 1. Clonar repositorio
git clone https://github.com/TU_USUARIO/Sistema-Hermanos-Salud.git
cd Sistema-Hermanos-Salud

# 2. Crear entorno virtual
python -m venv .venv

# 3. Activar entorno virtual (Windows)
.venv\Scripts\activate

# 4. Instalar dependencias
cd backend
pip install -r requirements.txt

# 5. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL y GOOGLE_CREDENTIALS_JSON

# 6. Ejecutar migraciones (si aplica)
python migrate_*.py

# 7. Iniciar servidor
python -m uvicorn app.main:app --reload
```

Servidor disponible en: http://localhost:8000
Docs interactivos: http://localhost:8000/docs

## 🔑 Variables de Entorno

Ver `.env.example` en la carpeta `backend/`

**Críticas para producción:**
- `DATABASE_URL` - Conexión PostgreSQL
- `GOOGLE_CREDENTIALS_JSON` - JSON de Google Service Account
- `SECRET_KEY` - Clave para JWT

## 📡 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Login

### Usuarios
- `GET /users/me` - Obtener perfil actual
- `GET /users/{id}` - Obtener usuario

### OCR/Fichas Médicas
- `POST /fichas/scan` - Procesar imagen de ficha médica
- `POST /fichas/` - Guardar ficha procesada
- `GET /fichas/{id}` - Obtener ficha

### QR
- `POST /qr/generate` - Generar código QR

## 🐳 Deployment con Docker

```bash
cd backend
docker build -t sistema-salud:latest .
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e GOOGLE_CREDENTIALS_JSON='{...}' \
  sistema-salud:latest
```

## ☁️ Deployment en Railway

Ver guía completa en: `backend/RAILWAY_DEPLOYMENT.md`

Pasos resumidos:
1. Subir a GitHub
2. Conectar repositorio en Railway.app
3. Agregar variables de entorno
4. Agregar PostgreSQL plugin
5. Deploy automático

## 🧪 Testing

```bash
# Con pytest (si está configurado)
pytest

# Con curl
curl -X POST http://localhost:8000/fichas/scan \
  -F "file=@imagen_ficha.jpg"
```

## 📝 Features Implementados

- ✅ Autenticación con JWT
- ✅ CRUD de usuarios y fichas médicas
- ✅ OCR con Google Cloud Vision
- ✅ Procesamiento de campos médicos (ocupación, alergias, vacunas, etc)
- ✅ Generación de QR
- ✅ Roles de usuario (Patient, Manager, Admin)
- ✅ Endpoints para móvil

## 🔐 Seguridad

- ✅ Contraseñas con hash (bcrypt)
- ✅ CORS configurado
- ✅ JWT para autenticación
- ✅ Credenciales nunca en repositorio (.gitignore)
- ✅ Variables sensibles en .env

## 📞 Soporte

Para preguntas o reportar bugs, crear issue en GitHub.

## 📄 Licencia

Proyecto sin fines de lucro para sistemas de salud comunitarios.

---

**Última actualización:** 2026-03-20
**Stack:** Python 3.11, FastAPI, PostgreSQL, Google Cloud Vision
