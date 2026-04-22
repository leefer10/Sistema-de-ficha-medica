@echo off
cd /d "c:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud"

echo Eliminando archivos de documentacion de fases...
del /Q CAMBIOS_REALIZADOS.md
del /Q COMPONENT_REFACTORING_COMPLETE.md
del /Q DESIGN_SYSTEM_PHASE_6_SECTION_11.md
del /Q DOCUMENTACION_FRONTEND_FASE_6.md
del /Q ERROR_422_REGISTRATION.md
del /Q FASE_6_1_START_GUIDE.md
del /Q FIGMA_DESIGN_PROMPTS.md
del /Q FRONTEND_PHASE_6_PLAN.md
del /Q FRONTEND_PHASE_6_SUMMARY.md
del /Q FRONTEND_RAILWAY_DEPLOYMENT.md
del /Q GITHUB_SETUP.md
del /Q INTEGRATION_PLAN.md
del /Q MANUAL_TEST_ENDPOINT.md
del /Q NEXT_JS_PAGES_PATTERN.md
del /Q NEXT_STEPS.md
del /Q NEXT_STEPS_ANALYSIS.md
del /Q OCR_END_TO_END_TEST.md
del /Q ONBOARDING_SETUP.md
del /Q PAGES_REFERENCE.ts
del /Q PHASE_1_2_SUMMARY.md
del /Q PHASE_1_IMPLEMENTATION.md
del /Q PHASE_3_IMPLEMENTATION_GUIDE.md
del /Q PLAN_COMPLETED_STATUS.md
del /Q QUICK_TEST_GUIDE.md
del /Q RAILWAY_MULTI_SERVICE_DEPLOYMENT.md
del /Q ROUTE_CONNECTION_COMPLETE.md
del /Q SECTION_10_IMPLEMENTATION_COMPLETE.md
del /Q TESTING_GUIDE_PHASE_1_2.md
del /Q TESTING_PHASE_3_5.md
del /Q VALIDATION_IMPROVEMENT.md

echo Eliminando scripts .bat locales...
del /Q 1-create-directories.bat
del /Q 2-setup-complete.bat
del /Q create_dirs.bat
del /Q run-setup.cmd
del /Q run-setup.ps1
del /Q start_backend.bat
del /Q start_backend_temp.bat

echo Eliminando documentos personales...
del /Q Documentacion.docx

echo.
echo Archivos eliminados localmente!
echo Ahora haz git add -A y git commit para actualizar GitHub
pause
