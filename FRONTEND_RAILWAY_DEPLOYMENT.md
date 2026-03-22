# Deployment del Frontend en Railway

## Opción 1: Dos Proyectos Separados en Railway (Recomendado)

### Backend (Ya existe)
- URL: https://sistema-de-ficha-medica-production.up.railway.app
- Puerto: 8000
- Dockerfile: `Dockerfile` (en raíz)

### Frontend (Nuevo proyecto)
- Puerto: 3000
- Dockerfile: `Dockerfile.frontend` (en raíz)

## Pasos para Crear el Proyecto Frontend en Railway

### 1. En Railway Dashboard
```
New Project → Deploy from GitHub → Selecciona tu repositorio
```

### 2. Configurar el Nuevo Proyecto
- **Name**: `Sistema Ficha Médica Frontend`
- **Root Directory**: (dejar vacío, Railway usará Dockerfile.frontend)
- **Dockerfile**: Apunta a `Dockerfile.frontend`

### 3. Variables de Entorno
Agregar en Railway Dashboard (del proyecto frontend):
```
NEXT_PUBLIC_API_URL = https://sistema-de-ficha-medica-production.up.railway.app
NODE_ENV = production
```

### 4. Port
Railway debería detectar automáticamente el puerto 3000, pero si no:
- Ir a **Settings** → **Port** → `3000`

### 5. Deploy
Hacer push a GitHub:
```bash
git add .
git commit -m "Add frontend Dockerfile for Railway"
git push
```

Railway debería detectar automáticamente el cambio y hacer deploy.

## Verificar que Funciona

1. Esperar a que Railway termine el deploy (2-3 minutos)
2. Ir a la URL del frontend (Railway te dará la URL)
3. Debería ver la página con:
   - ✅ Frontend: En línea
   - ✅ API Backend: Conectada

## Troubleshooting

### Error "Cannot find Dockerfile.frontend"
- Asegurate de que está en la raíz del repositorio (mismo nivel que el `Dockerfile` del backend)
- En Railway Settings, configura `Dockerfile` como `Dockerfile.frontend`

### Error de puerto
- Railway automáticamente asigna puertos, pero puedes configurarlo manualmente
- Settings → Port → `3000`

### Error CORS
- Frontend y Backend ahora están en Railway, debería funcionar sin CORS
- Si aún hay problemas, verificar que NEXT_PUBLIC_API_URL sea correcto

### Frontend conecta pero API no responde
- Verificar que la URL en NEXT_PUBLIC_API_URL es correcta
- Verificar que el backend está corriendo en Railway
- Verificar logs en Railway Dashboard

## Arquitectura Final

```
┌─────────────────────────────────┐
│     Railway Containers          │
├─────────────────────────────────┤
│                                 │
│  Frontend (Next.js)             │
│  - Puerto: 3000                 │
│  - Dockerfile.frontend          │
│                                 │
│  Backend (FastAPI)              │
│  - Puerto: 8000                 │
│  - Dockerfile                   │
│                                 │
│  PostgreSQL (add-on)            │
│  - Database                     │
│                                 │
└─────────────────────────────────┘
        ↓ (Solo internet)
    GitHub (código)
```

## Próximos Pasos

1. Push `Dockerfile.frontend` a GitHub
2. Crear nuevo proyecto en Railway
3. Configurar variables de entorno
4. Verificar que ambos proyectos están corriendo
5. Hacer commit final y push