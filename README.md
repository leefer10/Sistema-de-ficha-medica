# Sistema de Hermanos Para su Salud

Sistema integral de gestión de fichas médicas con OCR/IA para automatizar la captura de datos médicos.

## 📋 Descripción

Aplicación para digitalizar y procesar fichas médicas usando:
- **Backend:** FastAPI + PostgreSQL
- **OCR:** Google Cloud Vision API
- **Autenticación:** JWT
- **QR:** Generación de códigos QR para pacientes
- **Frontend:** Next.js 14

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
├── frontend/                  # App Next.js
│   ├── app/
│   ├── package.json
│   └── tsconfig.json
├── .venv/                     # Entorno virtual Python
├── .gitignore                # Archivos ignorados en Git
├── Documentacion.docx        # Documentación del proyecto
└── GITHUB_SETUP.md           # Guía para subir a GitHub
```

## 🚀 Quick Start

### Requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL
- Credenciales de Google Cloud Vision API

### Instalación Local

```bash
# Backend
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

Servidor backend: http://localhost:8000
Frontend: http://localhost:3000

## 📡 Endpoints Principales

### OCR/Fichas Médicas
- `POST /fichas/scan` - Procesar imagen de ficha médica
- `GET /health` - Health check

## ☁️ Deployment

**Backend**: Railway.app
**Frontend**: Vercel

## 🔐 Seguridad

- ✅ Contraseñas con hash (bcrypt)
- ✅ JWT para autenticación
- ✅ Credenciales nunca en repositorio (.gitignore)

---

**Última actualización:** 2026-03-22
**Stack:** Python 3.11, FastAPI, PostgreSQL, Google Cloud Vision, Next.js 14