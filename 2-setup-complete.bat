@echo off
REM ============================================================
REM Setup Completo - Crear directorios + generar páginas
REM ============================================================

setlocal enabledelayedexpansion

echo.
echo ============================================
echo  Next.js Frontend Setup Completo
echo ============================================
echo.

cd /d "%~dp0"

REM Paso 1: Crear directorios
echo [1/3] Creando directorios...
cd "frontend\app"
for %%D in (register welcome personal-data method-selection dashboard ocr-upload manual-form success medical-history medical-record-detail generate-qr settings add-consultation edit-medical-record) do (
    if not exist "%%D" (
        mkdir "%%D"
    )
)
cd "..\..\"

echo [2/3] Ejecutando Node.js para generar páginas...
node setup-routes.js

echo.
echo [3/3] Verificación...
cd "frontend"
if exist "app\register\page.tsx" (
    echo ✅ ¡Éxito! Las rutas han sido creadas.
) else (
    echo ❌ Error: No se pudieron crear las rutas.
    cd ".."
    pause
    exit /b 1
)

cd ".."

echo.
echo ============================================
echo  ✅ Setup Completado!
echo ============================================
echo.
echo 📝 Próximos pasos:
echo.
echo   1. Abre VS Code:
echo      code frontend
echo.
echo   2. En la terminal de VS Code:
echo      npm run build
echo.
echo   3. Prueba en desarrollo:
echo      npm run dev
echo.
echo   4. Abre: http://localhost:3000
echo.
echo   5. Haz commit:
echo      git add .
echo      git commit -m "Add Next.js routes"
echo.
echo ============================================
echo.

pause
