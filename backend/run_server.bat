@echo off
cd /d "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
echo Starting backend server on port 8000...
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
