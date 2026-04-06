#!/usr/bin/env python3
"""
Script para probar el endpoint POST /fichas/save
Ejecutar desde la carpeta backend
"""
import requests
import json
from pathlib import Path

# URL del servidor
BASE_URL = "http://localhost:8000"

def test_create_user():
    """Crear un usuario de prueba"""
    print("=" * 60)
    print("1️⃣  Creando usuario de prueba...")
    print("=" * 60)
    
    response = requests.post(
        f"{BASE_URL}/users/register",
        json={
            "nombre": "Juan",
            "apellido": "Pérez",
            "email": "juan@example.com",
            "password": "password123"
        }
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code in [200, 201]:
        user_id = response.json().get("id")
        print(f"✅ Usuario creado con ID: {user_id}")
        return user_id
    else:
        print("❌ Error al crear usuario")
        return None


def test_save_ocr_data(user_id):
    """Guardar datos OCR"""
    print("\n" + "=" * 60)
    print("2️⃣  Guardando datos OCR...")
    print("=" * 60)
    
    payload = {
        "user_id": user_id,
        "nombre": "Juan Carlos",
        "apellido": "Pérez González",
        "fecha_nacimiento": "15/05/1985",
        "direccion": "Calle Principal 123, Apartamento 4B",
        "telefono": "+1 (555) 123-4567",
        "ocupacion": "Ingeniero de Software",
        "alergias": "Penicilina, Maní",
        "antecedentes_patologicos_personales": "Diabetes tipo 2, Hipertensión",
        "antecedentes_familiares": "Madre: Cáncer de mama",
        "medicaciones": [
            {
                "nombre": "Metformina",
                "dosis": "500 mg",
                "frecuencia": "2 veces al día",
                "motivo": "Diabetes tipo 2"
            },
            {
                "nombre": "Lisinopril",
                "dosis": "10 mg",
                "frecuencia": "1 vez al día",
                "motivo": "Hipertensión"
            }
        ],
        "vacunas": [
            {
                "nombre": "Pfizer COVID-19",
                "fecha_aplicacion": "15/03/2021",
                "numero_dosis": 1,
                "lote": "EY5Q12"
            }
        ],
        "antecedentes_quirurgicos": [
            {
                "nombre_procedimiento": "Apendicectomía",
                "fecha": "10/07/2010",
                "motivo": "Apendicitis aguda"
            }
        ],
        "contacto_emergencia": {
            "nombre": "María Pérez",
            "telefono": "+1 (555) 987-6543",
            "relacion": "Esposa"
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/fichas/save",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("✅ Datos guardados exitosamente")
        return response.json()
    else:
        print("❌ Error al guardar datos")
        return None


if __name__ == "__main__":
    print("\n" + "🧪 PRUEBA DEL ENDPOINT POST /fichas/save\n".center(60))
    
    # Verificar conexión
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✅ Servidor disponible en {BASE_URL}\n")
    except Exception as e:
        print(f"❌ Error: No se puede conectar a {BASE_URL}")
        print(f"   Asegúrate de que el servidor está corriendo:")
        print(f"   python -m uvicorn app.main:app --reload --port 8000\n")
        exit(1)
    
    # Test 1: Crear usuario
    user_id = test_create_user()
    
    if user_id:
        # Test 2: Guardar datos OCR
        result = test_save_ocr_data(user_id)
        
        if result and result.get("success"):
            print("\n" + "=" * 60)
            print("🎉 ¡TODO FUNCIONA CORRECTAMENTE!")
            print("=" * 60)
            print(f"Medical Record ID: {result.get('medical_record_id')}")
            print(f"User ID: {result.get('user_id')}")
        else:
            print("\n❌ Hubo un error en la prueba")
    else:
        print("\n❌ No se pudo crear el usuario de prueba")
