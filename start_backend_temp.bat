@echo off
cd /d "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause
