@echo off
setlocal enabledelayedexpansion
cd /d "c:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud"

REM Eliminar archivos de documentacion
for %%f in (
  "CAMBIOS_REALIZADOS.md"
  "COMPONENT_REFACTORING_COMPLETE.md"
  "DESIGN_SYSTEM_PHASE_6_SECTION_11.md"
  "DOCUMENTACION_FRONTEND_FASE_6.md"
  "ERROR_422_REGISTRATION.md"
  "FASE_6_1_START_GUIDE.md"
  "FIGMA_DESIGN_PROMPTS.md"
  "FRONTEND_PHASE_6_PLAN.md"
  "FRONTEND_PHASE_6_SUMMARY.md"
  "FRONTEND_RAILWAY_DEPLOYMENT.md"
  "GITHUB_SETUP.md"
  "INTEGRATION_PLAN.md"
  "MANUAL_TEST_ENDPOINT.md"
  "NEXT_JS_PAGES_PATTERN.md"
  "NEXT_STEPS.md"
  "NEXT_STEPS_ANALYSIS.md"
  "OCR_END_TO_END_TEST.md"
  "ONBOARDING_SETUP.md"
  "PAGES_REFERENCE.ts"
  "PHASE_1_2_SUMMARY.md"
  "PHASE_1_IMPLEMENTATION.md"
  "PHASE_3_IMPLEMENTATION_GUIDE.md"
  "PLAN_COMPLETED_STATUS.md"
  "QUICK_TEST_GUIDE.md"
  "RAILWAY_MULTI_SERVICE_DEPLOYMENT.md"
  "ROUTE_CONNECTION_COMPLETE.md"
  "SECTION_10_IMPLEMENTATION_COMPLETE.md"
  "TESTING_GUIDE_PHASE_1_2.md"
  "TESTING_PHASE_3_5.md"
  "VALIDATION_IMPROVEMENT.md"
  "1-create-directories.bat"
  "2-setup-complete.bat"
  "create_dirs.bat"
  "run-setup.cmd"
  "run-setup.ps1"
  "start_backend.bat"
  "start_backend_temp.bat"
  "Documentacion.docx"
) do (
  if exist %%f (
    del /Q %%f
    echo Eliminado: %%f
  )
)

REM Git operations
echo.
echo Actualizando Git...
git add -A
git status

echo.
echo Listo para hacer commit y push
echo Ejecuta: git commit -m "chore: clean up development files for public release"
echo Luego: git push origin main
pause
