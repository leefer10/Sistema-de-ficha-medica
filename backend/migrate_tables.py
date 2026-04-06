#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Script para migrar tablas y agregar datos de prueba."""

from sqlalchemy import text
from app.database import SessionLocal

db = SessionLocal()

try:
    print("Recreando tablas con schema correcto...")
    print("")
    
    # Eliminar y recrear vaccines
    print("1. Migrando tabla vaccines...")
    db.execute(text("DROP TABLE IF EXISTS vaccines CASCADE"))
    db.commit()
    
    create_vaccines = """
    CREATE TABLE vaccines (
        id SERIAL PRIMARY KEY,
        medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
        nombre VARCHAR(200) NOT NULL,
        fecha_aplicacion DATE,
        numero_dosis INTEGER,
        lote VARCHAR(100),
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX idx_vaccines_medical_record_id ON vaccines(medical_record_id);
    """
    
    for statement in create_vaccines.split(';'):
        if statement.strip():
            db.execute(text(statement))
    db.commit()
    print("   OK - Tabla vaccines recreada")
    
    # Eliminar y recrear surgeries
    print("2. Migrando tabla surgeries...")
    db.execute(text("DROP TABLE IF EXISTS surgeries CASCADE"))
    db.commit()
    
    create_surgeries = """
    CREATE TABLE surgeries (
        id SERIAL PRIMARY KEY,
        medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
        nombre_procedimiento VARCHAR(255) NOT NULL,
        fecha DATE,
        motivo VARCHAR(255),
        hospital VARCHAR(255),
        complicaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX idx_surgeries_medical_record_id ON surgeries(medical_record_id);
    """
    
    for statement in create_surgeries.split(';'):
        if statement.strip():
            db.execute(text(statement))
    db.commit()
    print("   OK - Tabla surgeries recreada")
    
    # Eliminar y recrear medications
    print("3. Migrando tabla medications...")
    db.execute(text("DROP TABLE IF EXISTS medications CASCADE"))
    db.commit()
    
    create_medications = """
    CREATE TABLE medications (
        id SERIAL PRIMARY KEY,
        medical_record_id INTEGER NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
        nombre VARCHAR(200) NOT NULL,
        dosis VARCHAR(100),
        frecuencia VARCHAR(100),
        motivo VARCHAR(255),
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX idx_medications_medical_record_id ON medications(medical_record_id);
    """
    
    for statement in create_medications.split(';'):
        if statement.strip():
            db.execute(text(statement))
    db.commit()
    print("   OK - Tabla medications recreada")
    
    # Eliminar y recrear habits
    print("4. Migrando tabla habits...")
    db.execute(text("DROP TABLE IF EXISTS habits CASCADE"))
    db.commit()
    
    create_habits = """
    CREATE TABLE habits (
        id SERIAL PRIMARY KEY,
        medical_record_id INTEGER NOT NULL UNIQUE REFERENCES medical_records(id) ON DELETE CASCADE,
        fuma BOOLEAN DEFAULT FALSE,
        consume_alcohol VARCHAR(50) DEFAULT 'nunca',
        nivel_ejercicio VARCHAR(50) DEFAULT 'sedentario',
        tipo_dieta VARCHAR(100),
        consume_drogas BOOLEAN DEFAULT FALSE,
        observaciones TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX idx_habits_medical_record_id ON habits(medical_record_id);
    """
    
    for statement in create_habits.split(';'):
        if statement.strip():
            db.execute(text(statement))
    db.commit()
    print("   OK - Tabla habits recreada")
    
    print("")
    print("=" * 60)
    print("MIGRACION COMPLETADA")
    print("=" * 60)
    
except Exception as e:
    db.rollback()
    print("ERROR: " + str(e))
    import traceback
    traceback.print_exc()
finally:
    db.close()
