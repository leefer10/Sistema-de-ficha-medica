"""Router para recordatorios de citas."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.appointments import Appointment
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.schemas.appointment_reminders_schema import (
    AppointmentReminderCreate,
    AppointmentReminderResponse,
    AppointmentReminderUpdate,
)
from app.services.appointment_reminder_service import AppointmentReminderService

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


def get_appointment_or_404(appointment_id: int, medical_record_id: int, db: Session) -> Appointment:
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.medical_record_id == medical_record_id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cita no encontrada")
    return appointment


@router.post("/{user_id}/{appointment_id}/reminders", response_model=AppointmentReminderResponse, status_code=status.HTTP_201_CREATED)
def create_reminder(
    user_id: int,
    appointment_id: int,
    payload: AppointmentReminderCreate,
    db: Session = Depends(get_db),
):
    """Crear recordatorio para cita."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_appointment_or_404(appointment_id, medical_record.id, db)
    
    reminder = AppointmentReminderService.create_reminder(
        db=db,
        appointment_id=appointment_id,
        reminder_before_hours=payload.reminder_before_hours,
        is_enabled=payload.is_enabled,
    )
    
    return reminder


@router.get("/{user_id}/{appointment_id}/reminders", response_model=List[AppointmentReminderResponse])
def list_reminders(
    user_id: int,
    appointment_id: int,
    db: Session = Depends(get_db),
):
    """Obtener lista de recordatorios para cita."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_appointment_or_404(appointment_id, medical_record.id, db)
    
    reminders = AppointmentReminderService.get_reminders(
        db=db,
        appointment_id=appointment_id,
    )
    
    return reminders


@router.get("/{user_id}/{appointment_id}/reminders/{reminder_id}", response_model=AppointmentReminderResponse)
def get_reminder(
    user_id: int,
    appointment_id: int,
    reminder_id: int,
    db: Session = Depends(get_db),
):
    """Obtener detalle de recordatorio específico."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_appointment_or_404(appointment_id, medical_record.id, db)
    
    reminder = AppointmentReminderService.get_reminder_or_404(
        db=db,
        reminder_id=reminder_id,
        appointment_id=appointment_id,
    )
    
    return reminder


@router.put("/{user_id}/{appointment_id}/reminders/{reminder_id}", response_model=AppointmentReminderResponse)
def update_reminder(
    user_id: int,
    appointment_id: int,
    reminder_id: int,
    payload: AppointmentReminderUpdate,
    db: Session = Depends(get_db),
):
    """Actualizar recordatorio."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_appointment_or_404(appointment_id, medical_record.id, db)
    
    reminder = AppointmentReminderService.get_reminder_or_404(
        db=db,
        reminder_id=reminder_id,
        appointment_id=appointment_id,
    )
    
    updated_reminder = AppointmentReminderService.update_reminder(
        db=db,
        reminder=reminder,
        reminder_before_hours=payload.reminder_before_hours,
        is_enabled=payload.is_enabled,
    )
    
    return updated_reminder


@router.delete("/{user_id}/{appointment_id}/reminders/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reminder(
    user_id: int,
    appointment_id: int,
    reminder_id: int,
    db: Session = Depends(get_db),
):
    """Eliminar recordatorio."""
    medical_record = get_medical_record_or_404(user_id, db)
    get_appointment_or_404(appointment_id, medical_record.id, db)
    
    reminder = AppointmentReminderService.get_reminder_or_404(
        db=db,
        reminder_id=reminder_id,
        appointment_id=appointment_id,
    )
    
    AppointmentReminderService.delete_reminder(db=db, reminder=reminder)
