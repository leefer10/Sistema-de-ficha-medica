@echo off
cd /d "c:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\frontend"
echo Removing .next directory...
rmdir /s /q .next 2>nul || echo .next not found
echo Removing tsconfig.tsbuildinfo...
del /f /q tsconfig.tsbuildinfo 2>nul || echo tsconfig.tsbuildinfo not found
echo.
echo Running npm run build...
echo.
npm run build 2>&1
