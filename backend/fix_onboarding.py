#!/usr/bin/env python3
"""
Script para agregar columnas de onboarding a la tabla users.
Soluciona el error: psycopg2.errors.UndefinedColumn
"""

import os
import sys
from sqlalchemy import create_engine, text, inspect

# Obtener la URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2002@localhost/ficha_medica_db")

print(f"📡 Conectando a: {DATABASE_URL}")

try:
    # Crear conexión
    engine = create_engine(DATABASE_URL)
    
    # Verificar si la tabla existe
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    if "users" not in tables:
        print("❌ La tabla 'users' no existe")
        sys.exit(1)
    
    print("✓ Tabla 'users' encontrada")
    
    # Obtener columnas existentes
    columns = [col['name'] for col in inspector.get_columns('users')]
    print(f"✓ Columnas actuales: {len(columns)}")
    
    # Conectar y ejecutar migraciones
    with engine.connect() as conn:
        migration_count = 0
        
        # Columna 1
        if "onboarding_phase_1_complete" not in columns:
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN onboarding_phase_1_complete BOOLEAN DEFAULT FALSE
                """))
                print("✓ Agregada columna: onboarding_phase_1_complete")
                migration_count += 1
            except Exception as e:
                print(f"⚠️  onboarding_phase_1_complete: {e}")
        else:
            print("ℹ️  onboarding_phase_1_complete ya existe")
        
        # Columna 2
        if "onboarding_phase_2_complete" not in columns:
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN onboarding_phase_2_complete BOOLEAN DEFAULT FALSE
                """))
                print("✓ Agregada columna: onboarding_phase_2_complete")
                migration_count += 1
            except Exception as e:
                print(f"⚠️  onboarding_phase_2_complete: {e}")
        else:
            print("ℹ️  onboarding_phase_2_complete ya existe")
        
        # Columna 3
        if "onboarding_phase_3_complete" not in columns:
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN onboarding_phase_3_complete BOOLEAN DEFAULT FALSE
                """))
                print("✓ Agregada columna: onboarding_phase_3_complete")
                migration_count += 1
            except Exception as e:
                print(f"⚠️  onboarding_phase_3_complete: {e}")
        else:
            print("ℹ️  onboarding_phase_3_complete ya existe")
        
        conn.commit()
        
        if migration_count > 0:
            print(f"\n✅ {migration_count} columna(s) agregada(s) exitosamente!")
        else:
            print("\n✅ Todas las columnas ya existen")

except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)

print("\n🎉 Migración completada. Reinicia el backend para que los cambios tomen efecto.")
