
from app.database import SessionLocal
from app.models.medical_record import MedicalRecord
from app.models.user import User

db = SessionLocal()

# Verificar usuario 12
user = db.query(User).filter(User.id == 12).first()
print(f"Usuario 12: {user}")
if user:
    print(f"  - Nombre: {user.nombre} {user.apellido}")
    print(f"  - Email: {user.email}")
    
# Verificar medical record
medical_record = db.query(MedicalRecord).filter(MedicalRecord.user_id == 12).first()
print(f"\nMedical Record para usuario 12: {medical_record}")
if medical_record:
    print(f"  - ID: {medical_record.id}")
    print(f"  - QR Token: {medical_record.qr_token}")
else:
    print("NO EXISTE MEDICAL RECORD PARA USUARIO 12")
    print("\nCreando medical record...")
    new_record = MedicalRecord(user_id=12)
    db.add(new_record)
    db.commit()
    print(f"Medical record creado con ID: {new_record.id}")

db.close()
