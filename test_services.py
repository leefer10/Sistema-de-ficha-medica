#!/usr/bin/env python3
"""
Script para iniciar backend y frontend, y hacer pruebas
"""
import subprocess
import time
import sys
import os
import requests
import json

# Caminos
backend_path = r"C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
frontend_path = r"C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\frontend"
base_url = "http://localhost:8000"
frontend_url = "http://localhost:3000"

print("=" * 80)
print("INICIANDO SERVICIOS Y PRUEBAS")
print("=" * 80)

# 1. Iniciar Backend
print("\n[1/3] Iniciando Backend FastAPI en puerto 8000...")
backend_process = subprocess.Popen(
    ["python", "-m", "uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
    cwd=backend_path,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    universal_newlines=True
)

# Esperar a que el backend esté listo
print("Esperando que backend esté disponible...")
for i in range(30):
    try:
        resp = requests.get(f"{base_url}/docs")
        if resp.status_code == 200:
            print(f"✓ Backend activo en {base_url}")
            break
    except:
        time.sleep(1)
        print(f"  Intento {i+1}/30...", end='\r')
else:
    print("✗ Backend no inició correctamente")
    sys.exit(1)

# 2. Iniciar Frontend
print("\n[2/3] Iniciando Frontend Next.js en puerto 3000...")
frontend_process = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=frontend_path,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    universal_newlines=True
)

print("Esperando que frontend esté disponible...")
for i in range(30):
    try:
        resp = requests.get(frontend_url)
        if resp.status_code in [200, 307, 308]:
            print(f"✓ Frontend activo en {frontend_url}")
            break
    except:
        time.sleep(1)
        print(f"  Intento {i+1}/30...", end='\r')
else:
    print("⚠ Frontend puede estar iniciando...")

# 3. Hacer pruebas
print("\n[3/3] Ejecutando pruebas...")
print("-" * 80)

# Test 1: Health check
print("\n✓ Test 1: Health Check")
try:
    resp = requests.get(f"{base_url}/docs")
    print(f"  Status: {resp.status_code} ✓")
except Exception as e:
    print(f"  Error: {e} ✗")

# Test 2: Register user
print("\n✓ Test 2: Registro de Usuario")
try:
    user_data = {
        "nombre": "Test",
        "apellido": "User",
        "email": f"test_{int(time.time())}@example.com",
        "password": "password123"
    }
    resp = requests.post(f"{base_url}/users/register", json=user_data)
    print(f"  Status: {resp.status_code}")
    if resp.status_code == 200:
        user_id = resp.json().get("id")
        token = resp.json().get("access_token")
        print(f"  User ID: {user_id} ✓")
        print(f"  Token obtenido ✓")
    else:
        print(f"  Response: {resp.text}")
except Exception as e:
    print(f"  Error: {e} ✗")

# Test 3: Login
print("\n✓ Test 3: Login")
try:
    login_data = user_data.copy()
    del login_data['nombre']
    del login_data['apellido']
    resp = requests.post(f"{base_url}/users/login", json=login_data)
    print(f"  Status: {resp.status_code}")
    if resp.status_code == 200:
        token = resp.json().get("access_token")
        print(f"  Login exitoso ✓")
    else:
        print(f"  Response: {resp.text}")
except Exception as e:
    print(f"  Error: {e} ✗")

print("\n" + "=" * 80)
print("RESUMEN:")
print("=" * 80)
print(f"Backend:  {base_url}")
print(f"Frontend: {frontend_url}")
print("\nServicios iniciados exitosamente.")
print("Presiona Ctrl+C para detener.")
print("=" * 80)

try:
    backend_process.wait()
except KeyboardInterrupt:
    print("\n\nDeteniendo servicios...")
    backend_process.terminate()
    frontend_process.terminate()
    backend_process.wait()
    frontend_process.wait()
    print("Servicios detenidos.")
