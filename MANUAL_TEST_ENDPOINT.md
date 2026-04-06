# 🧪 GUÍA: Probar Endpoint POST /fichas/save

## Paso 1: Iniciar el Servidor Backend

Abre una nueva terminal (PowerShell, CMD, o Terminal de VS Code) y ejecuta:

```bash
cd "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Espera hasta ver:**
```
Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

## Paso 2: Abrir Postman

1. Abre **Postman**
2. Crea una nueva solicitud

---

## Paso 3: Crear Usuario de Prueba

**Primero**, crea un usuario para hacer pruebas:

```
Método: POST
URL: http://localhost:8000/users/register

Body (JSON):
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Envía y guarda el `user_id` del response** (probablemente será `1`)

---

## Paso 4: Probar Endpoint POST /fichas/save

```
Método: POST
URL: http://localhost:8000/fichas/save

Headers:
Content-Type: application/json

Body (JSON):
```

```json
{
  "user_id": 1,
  "nombre": "Juan Carlos",
  "apellido": "Pérez González",
  "fecha_nacimiento": "15/05/1985",
  "direccion": "Calle Principal 123, Apartamento 4B",
  "telefono": "+1 (555) 123-4567",
  "ocupacion": "Ingeniero de Software",
  "alergias": "Penicilina, Maní",
  "antecedentes_patologicos_personales": "Diabetes tipo 2, Hipertensión",
  "antecedentes_familiares": "Madre: Cáncer de mama. Padre: Infarto del miocardio",
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
    },
    {
      "nombre": "Moderna COVID-19",
      "fecha_aplicacion": "12/04/2021",
      "numero_dosis": 2,
      "lote": "26M20A"
    },
    {
      "nombre": "Influenza",
      "fecha_aplicacion": "20/10/2022",
      "numero_dosis": 1,
      "lote": "FLU2022-01"
    }
  ],
  "antecedentes_quirurgicos": [
    {
      "nombre_procedimiento": "Apendicectomía",
      "fecha": "10/07/2010",
      "motivo": "Apendicitis aguda"
    },
    {
      "nombre_procedimiento": "Extirpación de lunares",
      "fecha": "22/03/2015",
      "motivo": "Preventivo"
    }
  ],
  "contacto_emergencia": {
    "nombre": "María Pérez",
    "telefono": "+1 (555) 987-6543",
    "relacion": "Esposa"
  }
}
```

---

## Paso 5: Verificar Respuesta

**Respuesta exitosa (201 Created):**
```json
{
  "success": true,
  "message": "Datos del OCR guardados exitosamente",
  "medical_record_id": 1,
  "user_id": 1
}
```

✅ **¡SI VES ESTO, EL ENDPOINT FUNCIONA CORRECTAMENTE!**

---

## Paso 6: Verificar Datos en Base de Datos

Abre una nueva terminal y ejecuta:

```bash
cd "C:\Users\leam_\Desktop\Sistema de Hermanos Para su Salud\backend"
python
```

Luego en Python:
```python
from app.database import SessionLocal
from app.models.user import User
from app.models.personal_data import PersonalData
from app.models.medical_record import MedicalRecord
from app.models.medications import Medication

db = SessionLocal()

# Ver usuario actualizado
user = db.query(User).filter(User.id == 1).first()
print(f"Usuario: {user.nombre} {user.apellido}")

# Ver datos personales
personal = db.query(PersonalData).filter(PersonalData.user_id == 1).first()
print(f"Teléfono: {personal.telefono}")
print(f"Dirección: {personal.direccion}")

# Ver ficha médica
medical = db.query(MedicalRecord).filter(MedicalRecord.user_id == 1).first()
print(f"Expediente: {medical.numero_expediente}")

# Ver medicaciones
meds = db.query(Medication).filter(Medication.medical_record_id == medical.id).all()
print(f"Medicaciones: {len(meds)}")
for m in meds:
    print(f"  - {m.nombre} ({m.dosis})")

db.close()
```

---

## ❌ Si Ocurren Errores

### Error: "Usuario con ID X no encontrado"
→ Asegúrate de usar el `user_id` correcto del paso 3

### Error: "Cannot connect to http://localhost:8000"
→ Verifica que el servidor backend está ejecutándose (Paso 1)

### Error: "CORS error"
→ No hay CORS configurado para este endpoint, debería funcionar local

### Error: 500 Internal Server Error
→ Revisa los logs del servidor backend en la terminal

---

## 🎯 Resultado Esperado

Si todo funciona:

✅ Status 201 Created
✅ Respuesta JSON con success: true
✅ Nuevo MedicalRecord creado
✅ Datos guardados en Personal Data, Medical History, Medications, Vaccines, Surgeries, Emergency Contacts

---

## 📸 Captura de Pantalla en Postman

```
┌─────────────────────────────────────────┐
│ POST http://localhost:8000/fichas/save  │
├─────────────────────────────────────────┤
│ Status: 201 Created                     │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": true,                      │
│   "message": "Datos del OCR guardados",│
│   "medical_record_id": 1,               │
│   "user_id": 1                          │
│ }                                       │
└─────────────────────────────────────────┘
```

---

**¡Listo! Una vez que confirmes que funciona, podemos conectar el frontend.**
