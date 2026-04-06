#!/usr/bin/env python
"""Script para crear paciente de prueba con ficha completa."""

from datetime import datetime, date
from sqlalchemy import text
from app.database import SessionLocal
from app.models.personal_data import PersonalData
from app.models.medical_history import MedicalHistory

db = SessionLocal()

user_id = 12

try:
    # 0. Agregar columna ocupacion si no existe
    db.execute(text("ALTER TABLE personal_data ADD COLUMN IF NOT EXISTS ocupacion VARCHAR"))
    db.commit()
    print("✓ Tabla personal_data verificada")
    
    # 1. Crear datos personales (dejar telefono vacio)
    personal_data = PersonalData(
        user_id=user_id,
        fecha_nacimiento=date(1990, 5, 15),
        telefono=None,
        direccion="Calle Principal 123, Apartamento 45",
        ciudad="Santo Domingo",
        pais="Republica Dominicana",
        ocupacion=None
    )
    db.add(personal_data)
    db.commit()
    
    print("✓ Datos personales creados:")
    print(f"  - Fecha Nacimiento: {personal_data.fecha_nacimiento}")
    print(f"  - Telefono: {personal_data.telefono} [VACIO]")
    print(f"  - Direccion: {personal_data.direccion}")
    print(f"  - Ciudad: {personal_data.ciudad}")
    print(f"  - Pais: {personal_data.pais}\n")
    
    # 2. Crear historial médico
    from app.models.medical_record import MedicalRecord
    
    medical_record = db.query(MedicalRecord).filter(
        MedicalRecord.user_id == user_id
    ).first()
    
    if medical_record:
        medical_history = MedicalHistory(
            medical_record_id=medical_record.id,
            tipo_sangre="O+",
            alergias="Alergia a la penicilina",
            enfermedades_cronicas="Ninguna reportada",
            antecedentes_familiares="Diabetes en madre"
        )
        db.add(medical_history)
        db.commit()
        
        print("✓ Historial médico creado:")
        print(f"  - Tipo Sangre: {medical_history.tipo_sangre}")
        print(f"  - Alergias: {medical_history.alergias}")
        print(f"  - Enfermedades Cronicas: {medical_history.enfermedades_cronicas}")
        print(f"  - Antecedentes Familiares: {medical_history.antecedentes_familiares}\n")
    
    print("=" * 60)
    print("PACIENTE CREADO EXITOSAMENTE")
    print("=" * 60)
    print(f"Nombre: Sousa Cedeno Lizbeth Andrea")
    print(f"Email: andreasousa10@gmail.com")
    print(f"Contrasena: Army1001")
    print(f"ID Usuario: {user_id}")
    print(f"Campo vacio en ficha: Telefono")
    print("=" * 60)
    
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()
