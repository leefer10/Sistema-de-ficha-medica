#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime, date
from sqlalchemy import text
from app.database import SessionLocal

db = SessionLocal()
user_id = 12

try:
    # Migrar tabla personal_data
    migration_sql = """
    ALTER TABLE personal_data ADD COLUMN IF NOT EXISTS ocupacion VARCHAR;
    ALTER TABLE personal_data ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
    ALTER TABLE personal_data ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    """
    
    for statement in migration_sql.strip().split(';'):
        if statement.strip():
            db.execute(text(statement))
    db.commit()
    print("Tabla personal_data migrada")
    
    # Verificar si ya existe el registro
    from app.models.personal_data import PersonalData
    existing = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    
    if not existing:
        # Crear datos personales
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
        
        print("Datos personales creados:")
        print("  - Fecha Nacimiento: " + str(personal_data.fecha_nacimiento))
        print("  - Telefono: " + str(personal_data.telefono) + " [VACIO]")
        print("  - Direccion: " + str(personal_data.direccion))
        print("  - Ciudad: " + str(personal_data.ciudad))
        print("  - Pais: " + str(personal_data.pais))
        print("")
    else:
        print("Datos personales ya existen")
    
    # Crear historial medico
    from app.models.medical_record import MedicalRecord
    from app.models.medical_history import MedicalHistory
    
    medical_record = db.query(MedicalRecord).filter(
        MedicalRecord.user_id == user_id
    ).first()
    
    if medical_record:
        existing_history = db.query(MedicalHistory).filter(
            MedicalHistory.medical_record_id == medical_record.id
        ).first()
        
        if not existing_history:
            medical_history = MedicalHistory(
                medical_record_id=medical_record.id,
                tipo_sangre="O+",
                alergias="Alergia a la penicilina",
                enfermedades_cronicas="Ninguna reportada",
                antecedentes_familiares="Diabetes en madre"
            )
            db.add(medical_history)
            db.commit()
            
            print("Historial medico creado:")
            print("  - Tipo Sangre: " + str(medical_history.tipo_sangre))
            print("  - Alergias: " + str(medical_history.alergias))
            print("  - Enfermedades Cronicas: " + str(medical_history.enfermedades_cronicas))
            print("  - Antecedentes Familiares: " + str(medical_history.antecedentes_familiares))
        else:
            print("Historial medico ya existe")
    
    print("")
    print("=" * 60)
    print("PACIENTE COMPLETADO")
    print("=" * 60)
    print("Nombre: Sousa Cedeno Lizbeth Andrea")
    print("Email: andreasousa10@gmail.com")
    print("Contrasena: Army1001")
    print("ID Usuario: " + str(user_id))
    print("Campo vacio en ficha: Telefono")
    print("=" * 60)
    
except Exception as e:
    db.rollback()
    print("Error: " + str(e))
    import traceback
    traceback.print_exc()
finally:
    db.close()

