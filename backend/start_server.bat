@echo off
cd /d "c:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
set GOOGLE_APPLICATION_CREDENTIALS=sistema-salud-ficha-490600-68f541889983.json
call ..\.\.venv\Scripts\activate.bat
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
pause
