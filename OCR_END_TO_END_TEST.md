# 🧪 Prueba End-to-End: Flujo Completo OCR

## Flujo General

```
1. Crear usuario
2. Subir imagen de ficha médica → POST /fichas/scan
3. Recibir preview (OcrScanResponse)
4. Confirmar/editar datos
5. Guardar en BD → POST /fichas/save
6. Verificar datos en BD
```

---

## Requisitos Previos

1. **Backend corriendo:**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Postman instalado** (o usar curl)

3. **Una imagen de prueba de ficha médica** (JPG, PNG o WEBP)
   - Puede ser una foto real o una imagen de prueba

---

## Paso 1: Crear Usuario de Prueba

```
POST http://localhost:8000/users/register

{
  "nombre": "Roberto",
  "apellido": "García",
  "email": "roberto@example.com",
  "password": "securepass123"
}
```

**Guardar:**
- `user_id` = (del response, ej: 5)
- `email` = `roberto@example.com`

---

## Paso 2: Subir Imagen de Ficha Médica (OCR Scan)

```
POST http://localhost:8000/fichas/scan

Form-data:
- Key: "imagen" (type: File)
- Value: <seleccionar archivo JPG/PNG/WEBP>
```

**Respuesta esperada:**
```json
{
  "nombre": "Roberto",
  "apellido": "García",
  "fecha_nacimiento": "22/06/1990",
  "telefono": "+1-555-0100",
  "direccion": "Ave. Principal 456",
  "alergias": "Penicilina",
  "medicacion": "Ibuprofeno 400mg, Metformina 500mg",
  "vacunas": "COVID-19, Influenza",
  "contacto_emergencia": {
    "nombre": "Laura García",
    "telefono": "+1-555-0101",
    "relacion": "Hermana"
  },
  "texto_crudo": "[texto completo extraido]",
  "advertencia": null
}
```

**Guardar estos datos para el siguiente paso**

---

## Paso 3: Parsear y Confirmar Datos

El usuario en el frontend debería:
1. ✏️ Ver y editar los datos del preview
2. ✅ Confirmar que todo es correcto
3. ➕ Agregar datos adicionales si falta algo

**Formato para enviar (OcrSaveRequest):**

Los datos tipo "lista" deben estructurarse así:

**medicacion** (string crudo del OCR):
```
"Ibuprofeno 400mg, Metformina 500mg"
```

**debe convertirse en:**
```json
[
  {
    "nombre": "Ibuprofeno",
    "dosis": "400mg",
    "frecuencia": "No especificado",
    "motivo": "Dolor/Inflamación"
  },
  {
    "nombre": "Metformina",
    "dosis": "500mg",
    "frecuencia": "No especificado",
    "motivo": "Diabetes"
  }
]
```

---

## Paso 4: Guardar Datos Confirmados

```
POST http://localhost:8000/fichas/save

Headers:
Content-Type: application/json

Body:
```

```json
{
  "user_id": 5,
  "nombre": "Roberto Carlos",
  "apellido": "García López",
  "fecha_nacimiento": "22/06/1990",
  "direccion": "Ave. Principal 456, Apartamento 12",
  "telefono": "+1-555-0100",
  "ocupacion": "Contador",
  "alergias": "Penicilina, Nueces",
  "antecedentes_patologicos_personales": "Diabetes tipo 2, Hipertensión leve",
  "antecedentes_familiares": "Padre: Diabetes, Madre: Hipertensión",
  "medicaciones": [
    {
      "nombre": "Metformina",
      "dosis": "500 mg",
      "frecuencia": "2 veces al día",
      "motivo": "Diabetes tipo 2"
    },
    {
      "nombre": "Ibuprofeno",
      "dosis": "400 mg",
      "frecuencia": "Según sea necesario",
      "motivo": "Dolor/Inflamación"
    }
  ],
  "vacunas": [
    {
      "nombre": "COVID-19",
      "fecha_aplicacion": "15/03/2021",
      "numero_dosis": 2,
      "lote": "ABC12345"
    },
    {
      "nombre": "Influenza",
      "fecha_aplicacion": "10/10/2022",
      "numero_dosis": 1,
      "lote": "FLU-2022"
    }
  ],
  "antecedentes_quirurgicos": [
    {
      "nombre_procedimiento": "Apendicectomía",
      "fecha": "05/08/2005",
      "motivo": "Apendicitis"
    }
  ],
  "contacto_emergencia": {
    "nombre": "Laura García",
    "telefono": "+1-555-0101",
    "relacion": "Hermana"
  }
}
```

**Respuesta esperada (201 Created):**
```json
{
  "success": true,
  "message": "Datos del OCR guardados exitosamente",
  "medical_record_id": 3,
  "user_id": 5
}
```

---

## Paso 5: Verificar Datos en Base de Datos

Abre una terminal Python en la carpeta `backend`:

```python
python
```

```python
from app.database import SessionLocal
from app.models.user import User
from app.models.personal_data import PersonalData
from app.models.medical_record import MedicalRecord
from app.models.medical_history import MedicalHistory
from app.models.medications import Medication
from app.models.vaccines import Vaccine
from app.models.surgeries import Surgery
from app.models.emergency_contact import EmergencyContact

db = SessionLocal()
user_id = 5

# 1. Ver usuario
user = db.query(User).filter(User.id == user_id).first()
print(f"✅ Usuario: {user.nombre} {user.apellido}")

# 2. Ver datos personales
personal = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
print(f"✅ Teléfono: {personal.telefono}")
print(f"✅ Dirección: {personal.direccion}")
print(f"✅ Ocupación: {personal.ocupacion}")

# 3. Ver ficha médica
medical = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
print(f"✅ Expediente: {medical.numero_expediente}")

# 4. Ver historial médico
history = db.query(MedicalHistory).filter(MedicalHistory.medical_record_id == medical.id).first()
print(f"✅ Alergias: {history.alergias}")
print(f"✅ Enfermedades crónicas: {history.enfermedades_cronicas}")

# 5. Ver medicaciones
meds = db.query(Medication).filter(Medication.medical_record_id == medical.id).all()
print(f"\n✅ Medicaciones ({len(meds)}):")
for m in meds:
    print(f"   - {m.nombre} ({m.dosis}) - {m.frecuencia}")

# 6. Ver vacunas
vacs = db.query(Vaccine).filter(Vaccine.medical_record_id == medical.id).all()
print(f"\n✅ Vacunas ({len(vacs)}):")
for v in vacs:
    print(f"   - {v.nombre} (Dosis {v.numero_dosis}) - {v.fecha_aplicacion}")

# 7. Ver cirugías
surgs = db.query(Surgery).filter(Surgery.medical_record_id == medical.id).all()
print(f"\n✅ Cirugías ({len(surgs)}):")
for s in surgs:
    print(f"   - {s.nombre_procedimiento} ({s.fecha})")

# 8. Ver contacto de emergencia
emerg = db.query(EmergencyContact).filter(EmergencyContact.medical_record_id == medical.id).first()
if emerg:
    print(f"\n✅ Contacto Emergencia: {emerg.nombre} ({emerg.relacion}) - {emerg.telefono}")

db.close()
```

---

## Checklist de Verificación

Después de completar todos los pasos, verifica:

- [ ] Usuario creado correctamente
- [ ] OCR extrajo datos de la imagen
- [ ] Datos fueron guardados exitosamente (201 Created)
- [ ] Nombre y apellido actualizados en User
- [ ] PersonalData tiene teléfono, dirección y ocupación
- [ ] MedicalRecord tiene número expediente único (EXP-...)
- [ ] MedicalHistory tiene alergias y antecedentes
- [ ] Al menos 2 medicaciones guardadas
- [ ] Al menos 1 vacuna guardada
- [ ] Contacto de emergencia guardado correctamente

---

## Casos de Prueba Adicionales

### Test 1: Usuario sin contacto de emergencia
```json
{
  "user_id": 5,
  "nombre": "Test",
  "apellido": "Usuario",
  "medicaciones": [],
  "vacunas": [],
  "antecedentes_quirurgicos": []
}
```
**Esperado:** Se guarda exitosamente (contacto_emergencia es opcional)

### Test 2: Actualizar datos existentes
Ejecuta el mismo POST /fichas/save con el mismo user_id pero diferentes datos.
**Esperado:** Los datos anteriores se actualizan, se crea una nueva ficha médica si no existe.

### Test 3: Usuario no existe
```json
{
  "user_id": 9999,
  "nombre": "Test"
}
```
**Esperado:** Error 400 con mensaje "Usuario con ID 9999 no encontrado"

---

## 🎯 Resultado Final

Si todo funciona correctamente, el flujo completo OCR es:

```
✅ OCR escanea imagen
✅ Backend extrae datos
✅ Frontend confirma datos
✅ Backend guarda en BD
✅ Datos aparecen en ficha médica del usuario
```

**¡El Sprint OCR/IA está en 90% completado!**

---

## Próximos Pasos Después de Esta Prueba

1. ✅ Opción A: Backend OCR - COMPLETADO
2. ✅ Opción B: Endpoint Guardar - COMPLETADO
3. ⏳ **Opción C: Frontend Integration** - Conectar OcrUploadPage.tsx
