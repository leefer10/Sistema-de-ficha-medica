# Guía: Subir proyecto a GitHub

## Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `Sistema-Hermanos-Salud` (o el que prefieras)
3. Descripción: `Sistema de gestión de fichas médicas con OCR/IA`
4. Selecciona: Public o Private
5. **NO** inicialices con README (lo haremos en local)
6. Click "Create repository"

## Paso 2: Inicializar Git localmente

Abre PowerShell/CMD en la carpeta del proyecto:

```powershell
cd "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud"

# Inicializar repositorio git
git init

# Agregar tu usuario de GitHub (cambiar con tus datos)
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# (Opcional) Para configurar globalmente en tu PC:
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## Paso 3: Agregar archivos al staging

```powershell
# Ver estado actual
git status

# Agregar todos los archivos (respeta .gitignore)
git add .

# Verificar qué se va a subir
git status
```

## Paso 4: Hacer commit inicial

```powershell
git commit -m "Initial commit: Backend FastAPI con OCR/Google Vision"
```

## Paso 5: Agregar remote y subir a GitHub

```powershell
# Reemplazar USER y REPO con tus valores
git remote add origin https://github.com/TU_USUARIO/Sistema-Hermanos-Salud.git

# Verificar que se agregó correctamente
git remote -v

# Subir al branch main
git branch -M main
git push -u origin main
```

## Paso 6: Verificar

- Ve a tu repositorio en GitHub
- Deberías ver todos los archivos (excepto los del .gitignore)
- **NO debería haber** archivos .json con credenciales

---

## Archivos que se ignorarán (no se suben):

✅ **Secretos seguros:**
- `*.json` (todas las credenciales)
- `.env` (variables de entorno locales)
- `venv/` (entorno virtual)
- `__pycache__/` (caché de Python)

✅ **Archivos que SÍ se suben:**
- `.env.example` (template sin valores reales)
- `requirements.txt`
- `Dockerfile`
- `*.py` (código)
- `RAILWAY_DEPLOYMENT.md`

---

## Troubleshooting

### "fatal: not a git repository"
```powershell
git init
```

### "Permission denied" en push
- Verificar que usaste HTTPS o SSH correctamente
- Si es SSH, asegurar que tienes SSH key configurada en GitHub

### Credenciales aparecen en GitHub
❌ **CRÍTICO** - Si subiste `.json` por error:
```powershell
# Eliminar del historio (local)
git rm --cached *.json
git commit -m "Remove sensitive files"
```
Luego regenerar credenciales en Google Cloud

---

## Siguiente: Conectar a Railway

Una vez en GitHub, en Railway:
1. New Project → Deploy from GitHub
2. Seleccionar tu repositorio
3. Autorizar a Railway
4. Configurar variables de entorno
5. Deploy automático 🚀
