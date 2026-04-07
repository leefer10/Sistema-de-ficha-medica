"""Router para recordatorios de medicamentos."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medications import Medication
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.schemas.medication_reminders_schema import (
    MedicationReminderCreate,
    MedicationReminderResponse,
    MedicationReminderUpdate,
)
from app.services.medication_reminder_service import MedicationReminderService

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_or_404(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user


def get_medical_record_or_404(user_id: int, db: Session) -> MedicalRecord:
    get_user_or_404(user_id, db)
    record = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ficha medica no encontrada")
    return record


def get_medication_or_404(medication_id: int, medical_record_id: int, db: Session) -> Medication:
    medication = db.query(Medication).filter(
        Medication.id == medication_id,
        Medication.medical_record_id == medical_record_id,
    ).first()
    if not medication:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicamento no encontrado")
    return medication


@router.post("/{user_id}/{medication_id}/reminders", response_model=MedicationReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(
    user_id: int,
    medication_id: int,
    payload: MedicationReminderCreate,
    db: Session = Depends(get_db),
):
    """Crear recordatorio para medicamento."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_medication_or_404(medication_id, medical_record.id, db)
    
    reminder = MedicationReminderService.create_reminder(
        db=db,
        medication_id=medication_id,
        reminder_time=payload.reminder_time,
        is_enabled=payload.is_enabled,
    )
    
    return reminder


@router.get("/{user_id}/{medication_id}/reminders", response_model=List[MedicationReminderResponse])
def list_reminders(
    user_id: int,
    medication_id: int,
    db: Session = Depends(get_db),
):
    """Obtener lista de recordatorios para medicamento."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_medication_or_404(medication_id, medical_record.id, db)
    
    reminders = MedicationReminderService.get_reminders(
        db=db,
        medication_id=medication_id,
    )
    
    return reminders


@router.get("/{user_id}/{medication_id}/reminders/{reminder_id}", response_model=MedicationReminderResponse)
def get_reminder(
    user_id: int,
    medication_id: int,
    reminder_id: int,
    db: Session = Depends(get_db),
):
    """Obtener detalle de recordatorio específico."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_medication_or_404(medication_id, medical_record.id, db)
    
    reminder = MedicationReminderService.get_reminder_or_404(
        db=db,
        reminder_id=reminder_id,
        medication_id=medication_id,
    )
    
    return reminder


@router.put("/{user_id}/{medication_id}/reminders/{reminder_id}", response_model=MedicationReminderResponse)
def update_reminder(
    user_id: int,
    medication_id: int,
    reminder_id: int,
    payload: MedicationReminderUpdate,
    db: Session = Depends(get_db),
):
    """Actualizar recordatorio."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_medication_or_404(medication_id, medical_record.id, db)
    
    reminder = MedicationReminderService.get_reminder_or_404(
        db=db,
        reminder_id=reminder_id,
        medication_id=medication_id,
    )
    
    updated_reminder = MedicationReminderService.update_reminder(
        db=db,
        reminder=reminder,
        reminder_time=payload.reminder_time,
        is_enabled=payload.is_enabled,
    )
    
    return updated_reminder


@router.delete("/{user_id}/{medication_id}/reminders/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    user_id: int,
    medication_id: int,
    reminder_id: int,
    db: Session = Depends(get_db),
):
    """Eliminar recordatorio."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_medication_or_404(medication_id, medical_record.id, db)
    
    reminder = MedicationReminderService.get_reminder_or_404(
        db=db,
        reminder_id=reminder_id,
        medication_id=medication_id,
    )
    
    MedicationReminderService.delete_reminder(db=db, reminder=reminder)
