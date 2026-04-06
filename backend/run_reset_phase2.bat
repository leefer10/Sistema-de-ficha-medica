@echo off
cd /d "%~dp0"
echo Resetting Phase 2 status for all users...
python reset_phase2.py
pause
