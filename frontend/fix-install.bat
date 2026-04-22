@echo off
cd /d "%~dp0"
echo Instalando dependencias con legacy peer deps...
npm install --legacy-peer-deps
echo.
echo Instalación completada!
pause
