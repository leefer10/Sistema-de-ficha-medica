@echo off
REM ============================================================
REM Crear todas las rutas de Next.js para el frontend
REM ============================================================

cd /d "%~dp0frontend\app"

REM Crear directorios
echo Creando directorios...
for %%D in (register welcome personal-data method-selection dashboard ocr-upload manual-form success medical-history medical-record-detail generate-qr settings add-consultation edit-medical-record) do (
    if not exist "%%D" (
        mkdir "%%D"
        echo ✓ Directorio creado: %%D
    ) else (
        echo ✗ Directorio ya existe: %%D
    )
)

echo.
echo ✅ Todos los directorios han sido creados!
echo.
echo Ejecuta ahora:
echo   node ../../../setup-routes.js
echo.
pause
