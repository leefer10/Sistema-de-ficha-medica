# Sistema de Hermanos Para su Salud

Sistema integral de gestión de fichas médicas con OCR/IA para automatizar la captura de datos médicos.

## Descripción

Aplicación para digitalizar y procesar fichas médicas usando:

### Instalación Local

Servidor backend: http://localhost:8000
Frontend: http://localhost:3000

### OCR/Fichas Médicas
- `POST /fichas/scan` - Procesar imagen de ficha médica
- `GET /health` - Health check

## Seguridad

- Contraseñas con hash (bcrypt)
- JWT para autenticación
- Credenciales nunca en repositorio (.gitignore)

**Stack:** Python 3.11, FastAPI, PostgreSQL, Google Cloud Vision, Next.js 14, React 18
