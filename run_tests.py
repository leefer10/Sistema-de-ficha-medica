import subprocess
import sys
import time
import os

print("=" * 80)
print("INICIANDO BACKEND PARA PRUEBAS...")
print("=" * 80)

# Change to backend directory
backend_dir = r"C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
os.chdir(backend_dir)

# Start backend in a new process
print(f"\n📍 Directorio: {os.getcwd()}")
print("⏳ Iniciando servidor uvicorn en puerto 8000...\n")

# Run the backend server
try:
    # Start backend in detached mode (doesn't block)
    subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
        creationflags=subprocess.CREATE_NEW_CONSOLE if sys.platform == "win32" else 0
    )
    
    print("✅ Backend iniciado. Esperando que esté listo (15 segundos)...")
    time.sleep(15)
    
    # Now run the tests
    print("\n" + "=" * 80)
    print("EJECUTANDO PRUEBAS DE FASE 1 & 2...")
    print("=" * 80 + "\n")
    
    # Change back to root directory for the test script
    root_dir = r"C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud"
    os.chdir(root_dir)
    
    # Run the test script
    result = subprocess.run([sys.executable, "test_phase2.py"], capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr)
        
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
