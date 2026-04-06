#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Script para agregar datos médicos de prueba al usuario 12."""

from datetime import datetime, date
from app.database import SessionLocal
from app.models.vaccines import Vaccine
from app.models.surgeries import Surgery
from app.models.medications import Medication
from app.models.habits import Habit
from app.models.medical_record import MedicalRecord

db = SessionLocal()
user_id = 12

try:
    # Obtener el medical record del usuario
    medical_record = db.query(MedicalRecord).filter(
        MedicalRecord.user_id == user_id
    ).first()
    
    if not medical_record:
        print("ERROR: No existe medical record para usuario " + str(user_id))
        db.close()
        exit(1)
    
    record_id = medical_record.id
    print("Medical Record ID: " + str(record_id))
    print("")
    
    # ===== AGREGAR VACUNAS =====
    print("Agregando vacunas...")
    
    vaccine1 = Vaccine(
        medical_record_id=record_id,
        nombre="Vacuna contra Influenza (Gripa)",
        fecha_aplicacion=date(2024, 10, 15),
        numero_dosis=1,
        lote="LOT2024001",
        observaciones="Primera dosis de gripa 2024"
    )
    db.add(vaccine1)
    
    vaccine2 = Vaccine(
        medical_record_id=record_id,
        nombre="Vacuna contra Influenza (Gripa)",
        fecha_aplicacion=date(2025, 3, 20),
        numero_dosis=2,
        lote="LOT2025001",
        observaciones="Segunda dosis anual de gripa"
    )
    db.add(vaccine2)
    
    db.commit()
    print("  - Vacuna 1: " + vaccine1.nombre + " (" + str(vaccine1.fecha_aplicacion) + ")")
    print("  - Vacuna 2: " + vaccine2.nombre + " (" + str(vaccine2.fecha_aplicacion) + ")")
    print("")
    
    # ===== AGREGAR CIRUGIAS =====
    print("Agregando cirugias...")
    
    surgery1 = Surgery(
        medical_record_id=record_id,
        nombre_procedimiento="Apendicectomia",
        fecha=date(2022, 6, 10),
        motivo="Apendicitis aguda",
        hospital="Hospital Santo Domingo",
        complicaciones="Sin complicaciones"
    )
    db.add(surgery1)
    db.commit()
    print("  - Cirugia: " + surgery1.nombre_procedimiento + " (" + str(surgery1.fecha) + ")")
    print("")
    
    # ===== AGREGAR MEDICAMENTOS =====
    print("Agregando medicamentos...")
    
    med1 = Medication(
        medical_record_id=record_id,
        nombre="Amoxicilina",
        dosis="500mg",
        frecuencia="Cada 8 horas",
        motivo="Infeccion respiratoria",
        activo=False
    )
    db.add(med1)
    
    med2 = Medication(
        medical_record_id=record_id,
        nombre="Losartan",
        dosis="50mg",
        frecuencia="Una vez al dia",
        motivo="Control de hipertension",
        activo=True
    )
    db.add(med2)
    
    db.commit()
    print("  - Medicamento 1: " + med1.nombre + " - " + med1.dosis)
    print("  - Medicamento 2: " + med2.nombre + " - " + med2.dosis)
    print("")
    
    # ===== AGREGAR HABITOS =====
    print("Agregando habitos...")
    
    # Verificar si ya existe record de habitos
    existing_habits = db.query(Habit).filter(
        Habit.medical_record_id == record_id
    ).first()
    
    if not existing_habits:
        habits = Habit(
            medical_record_id=record_id,
            fuma=False,
            consume_alcohol="ocasional",
            nivel_ejercicio="moderado",
            tipo_dieta="Balanceada",
            consume_drogas=False,
            observaciones="Paciente asiduo al ejercicio, camina 30 minutos diarios"
        )
        db.add(habits)
        db.commit()
        print("  - Habitos creados:")
        print("    - Fuma: No")
        print("    - Consume alcohol: Ocasionalmente")
        print("    - Nivel ejercicio: Moderado")
        print("    - Tipo dieta: Balanceada")
    else:
        print("  - Habitos ya existen, actualizando...")
        existing_habits.consume_alcohol = "ocasional"
        existing_habits.nivel_ejercicio = "moderado"
        existing_habits.tipo_dieta = "Balanceada"
        existing_habits.observaciones = "Paciente asiduo al ejercicio, camina 30 minutos diarios"
        db.commit()
    
    print("")
    print("=" * 60)
    print("DATOS DE PRUEBA AGREGADOS EXITOSAMENTE")
    print("=" * 60)
    print("Usuario ID: " + str(user_id))
    print("Medical Record ID: " + str(record_id))
    print("")
    print("Datos agregados:")
    print("  - 2 Vacunas contra la gripa")
    print("  - 1 Cirugia (Apendicectomia)")
    print("  - 2 Medicamentos (Amoxicilina, Losartan)")
    print("  - Habitos personales")
    print("=" * 60)
    
except Exception as e:
    db.rollback()
    print("ERROR: " + str(e))
    import traceback
    traceback.print_exc()
finally:
    db.close()
