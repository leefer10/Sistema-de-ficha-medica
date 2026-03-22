# Deployment Profesional Multi-Servicio en Railway

## Arquitectura

```
┌──────────────────────────────────────────────┐
│         Railway Project (Un solo lugar)      │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │  Frontend    │    │  Backend API     │   │
│  │  Next.js     │───→│  FastAPI         │   │
│  │  :3000       │    │  :8000           │   │
│  └──────────────┘    └──────────────────┘   │
│         │                    │               │
│         └────────┬───────────┘               │
│                  │                           │
│          ┌───────▼────────┐                 │
│          │  PostgreSQL    │                 │
│          │  Base de Datos │                 │
│          └────────────────┘                 │
│                                              │
└──────────────────────────────────────────────┘
```

## Características Profesionales

✅ **Servicios Compartidos**
- Frontend y Backend en el mismo proyecto
- Base de datos centralizada
- Networking automático entre servicios
- Sin necesidad de CORS (mismo dominio)

✅ **Health Checks**
- Cada servicio tiene su propio health check
- Detección automática de fallos
- Reinicio automático si algo falla

✅ **Escalabilidad**
- Fácil agregar más servicios
- Control de recursos independiente
- Logs separados para cada servicio

✅ **Seguridad**
- Comunicación interna entre contenedores
- Sin exponer internamente puertos innecesarios
- Variables de entorno centralizadas

## Configuración en Railway

### Paso 1: Ir a tu proyecto existente
1. https://railway.app/dashboard
2. Abre el proyecto "Sistema de Hermanos Para su Salud"

### Paso 2: Agregar nuevo servicio (Frontend)
1. Click en **"+ New"**
2. **"Service"** → **"Deploy from GitHub"**
3. Selecciona el repositorio
4. En Settings:
   - **Name**: `frontend`
   - **Dockerfile**: `Dockerfile.frontend`
   - **Port**: `3000`

### Paso 3: Configurar Variables de Entorno (Frontend)
En el servicio frontend, agregar:
```
NEXT_PUBLIC_API_URL = http://backend:8000
NODE_ENV = production
```

### Paso 4: Configurar Variables de Entorno (Backend)
En el servicio backend, agregar:
```
DATABASE_URL = (Ya configurada)
GOOGLE_CREDENTIALS_JSON = (Ya configurada)
SECRET_KEY = (Ya configurada)
```

### Paso 5: Deploy
Railway detectará automáticamente:
- `docker-compose.yml`
- `Dockerfile.frontend`
- `Dockerfile` (backend)

Y hará deploy de todo juntos.

## Verificar que Funciona

1. Espera a que ambos servicios estén corriendo (green status)
2. Obtén la URL pública del frontend (Railway la genera)
3. Accede a la URL del frontend
4. Deberías ver:
   - ✅ Frontend: En línea
   - ✅ API Backend: Conectada

## Estructura de Archivos

```
.
├── backend/                          # Código del backend
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/                         # Código del frontend
│   ├── app/
│   ├── package.json
│   └── ...
├── Dockerfile                        # Backend
├── Dockerfile.frontend              # Frontend
├── docker-compose.yml               # Orquestación
├── railway.toml                     # Config Railway
└── ...
```

## Monitoreo

En Railway Dashboard puedes:
- Ver logs de cada servicio
- Monitorear uso de CPU/Memoria
- Reiniciar servicios individuales
- Escalar servicios independientemente

## Próximos Pasos

1. ✅ Crear nuevo servicio frontend en Railway
2. ✅ Configurar variables de entorno
3. ✅ Verificar que ambos servicios comunican
4. 🔄 Crear página de upload OCR
5. 🔄 Agregar autenticación
6. 🔄 Adaptación para móvil

## Comandos Útiles (Local)

```bash
# Construir y correr todo localmente
docker-compose up --build

# Correr solo backend
docker-compose up backend

# Correr solo frontend
docker-compose up frontend

# Ver logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Detener todo
docker-compose down
```

## Troubleshooting

### Frontend no conecta a backend
- Verificar que `NEXT_PUBLIC_API_URL` es `http://backend:8000` (no localhost)
- Verificar que `depends_on: backend` en docker-compose.yml
- Ver logs en Railway Dashboard

### Backend no conecta a database
- Verificar que `DATABASE_URL` está configurada
- Verificar que PostgreSQL plugin está agregado en Railway
- Reiniciar el servicio backend

### Puertos en conflicto (local)
- Cambiar puerto en docker-compose.yml: `"8001:8000"`
- O: `docker-compose down` y limpiar

## Soporte

Para problemas:
1. Revisar logs en Railway Dashboard
2. Verificar variables de entorno
3. Reiniciar servicios
4. Hacer push de cambios a GitHub