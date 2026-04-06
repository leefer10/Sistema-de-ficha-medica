@echo off
echo.
echo ========================================
echo Ejecutando migracion de onboarding...
echo ========================================
echo.

cd /d "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"

python fix_onboarding.py

echo.
echo Presiona cualquier tecla para cerrar...
pause
