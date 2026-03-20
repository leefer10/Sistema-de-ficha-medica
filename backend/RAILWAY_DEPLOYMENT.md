# Guía de Deployment en Railway

## Pasos para desplegar en Railway

### 1. Preparar credenciales de Google Cloud
```bash
# Copiar el contenido del archivo JSON de credenciales
cat backend/sistema-salud-ficha-490600-68f541889983.json
```

### 2. Crear proyecto en Railway
- Ir a https://railway.app
- Click en "Create New Project"
- Seleccionar "Deploy from GitHub" o usar CLI

### 3. Configurar variables de entorno en Railway

En la consola de Railway, agregar las siguientes variables:

```
DATABASE_URL=postgresql://[usuario]:[contraseña]@[host]:[puerto]/[base_datos]
GOOGLE_CREDENTIALS_JSON={"type": "service_account", "project_id": "...", ...}
SECRET_KEY=tu-clave-secreta-muy-larga-y-segura
ENVIRONMENT=production
DEBUG=false
```

### 4. Para GOOGLE_CREDENTIALS_JSON:
- Copiar TODO el contenido del archivo `sistema-salud-ficha-490600-68f541889983.json` (sin saltos de línea)
- Pegarlo en la variable `GOOGLE_CREDENTIALS_JSON`

### 5. Configurar base de datos PostgreSQL
- Railway automaticamente ofrece PostgreSQL
- Copiar la `DATABASE_URL` que genera y usarla en las variables de entorno

### 6. Deploy
```bash
# Si usas CLI de Railway:
railway up
```

## Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `GOOGLE_CREDENTIALS_JSON` | JSON completo de Google Service Account | `{"type": "service_account", ...}` |
| `SECRET_KEY` | Clave para JWT | `abc123def456...` |
| `ENVIRONMENT` | Entorno (production/development) | `production` |
| `DEBUG` | Modo debug | `false` |

## Verificar que funciona

Después del deploy:
1. Ir a la URL de Railway asignada
2. Acceder a `/docs` para ver Swagger
3. Probar endpoint POST `/fichas/scan` con una imagen

## Solucionar problemas

### Las credenciales no funcionan
- Verificar que `GOOGLE_CREDENTIALS_JSON` sea el JSON **completo** sin espacios extra
- Asegurar que el archivo `.json` está en formato válido

### Base de datos no conecta
- Verificar que `DATABASE_URL` es correcta
- En Railway, ir a PostgreSQL plugin → "Variables" para ver la URL

### Puerto no expuesto
- Railway automáticamente detecta el Dockerfile y expone el puerto 8000
- Si no funciona, verificar que el `Dockerfile` tiene `EXPOSE 8000`

## Documentación útil
- https://docs.railway.app/deploy/deployments
- https://docs.railway.app/databases/postgresql
