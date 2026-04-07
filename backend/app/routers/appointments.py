"""Router para citas médicas."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medical_record import MedicalRecord
from app.models.appointments import Appointment
from app.models.user import User
from app.schemas.appointments_schema import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
    AppointmentStatusUpdate,
)
from app.services.appointment_service import AppointmentService

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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ficha medica no encontrada para este usuario")
    return record


def get_appointment_or_404(appointment_id: int, medical_record_id: int, db: Session) -> Appointment:
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.medical_record_id == medical_record_id,
    ).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cita no encontrada")
    return appointment


@router.post("/{user_id}", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(
    user_id: int,
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
):
    """
    Crear una nueva cita médica.
    
    - **doctor_name**: Nombre del doctor (requerido)
    - **appointment_date**: Fecha en formato YYYY-MM-DD (requerido)
    - **appointment_time**: Hora en formato HH:MM (requerido)
    - **appointment_type**: Tipo de cita (opcional, ej: General, Cardiology)
    - **location**: Ubicación (opcional)
    - **notes**: Notas adicionales (opcional)
    
    La cita debe ser en una fecha/hora futura.
    """
    medical_record = get_medical_record_or_404(user_id, db)
    
    appointment = AppointmentService.create_appointment(
        db=db,
        medical_record_id=medical_record.id,
        doctor_name=payload.doctor_name,
        appointment_type=payload.appointment_type,
        appointment_date=payload.appointment_date,
        appointment_time=payload.appointment_time,
        location=payload.location,
        notes=payload.notes,
    )
    
    return appointment


@router.get("/{user_id}", response_model=List[AppointmentResponse])
def list_appointments(
    user_id: int,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Obtener lista de citas médicas.
    
    - **status**: Filtro opcional (programada, completada, cancelada)
    """
    medical_record = get_medical_record_or_404(user_id, db)
    
    appointments = AppointmentService.get_appointments_by_medical_record(
        db=db,
        medical_record_id=medical_record.id,
        status=status,
    )
    
    return appointments


@router.get("/{user_id}/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    user_id: int,
    appointment_id: int,
    db: Session = Depends(get_db),
):
    """Obtener detalle de una cita específica."""
    medical_record = get_medical_record_or_404(user_id, db)
    appointment = get_appointment_or_404(appointment_id, medical_record.id, db)
    return appointment


@router.put("/{user_id}/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(
    user_id: int,
    appointment_id: int,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db),
):
    """
    Actualizar una cita médica.
    
    No se puede editar si la cita ya está completada o cancelada.
    """
    medical_record = get_medical_record_or_404(user_id, db)
    appointment = get_appointment_or_404(appointment_id, medical_record.id, db)
    
    updated_appointment = AppointmentService.update_appointment(
        db=db,
        appointment=appointment,
        doctor_name=payload.doctor_name,
        appointment_type=payload.appointment_type,
        appointment_date=payload.appointment_date,
        appointment_time=payload.appointment_time,
        location=payload.location,
        notes=payload.notes,
    )
    
    return updated_appointment


@router.delete("/{user_id}/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(
    user_id: int,
    appointment_id: int,
    db: Session = Depends(get_db),
):
    """Eliminar una cita médica."""
    medical_record = get_medical_record_or_404(user_id, db)
    appointment = get_appointment_or_404(appointment_id, medical_record.id, db)
    
    db.delete(appointment)
    db.commit()


@router.patch("/{user_id}/{appointment_id}/status", response_model=AppointmentResponse)
def update_appointment_status(
    user_id: int,
    appointment_id: int,
    payload: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    """
    Cambiar el estado de una cita.
    
    - **status**: Nuevo estado (programada, completada, cancelada)
    """
    medical_record = get_medical_record_or_404(user_id, db)
    appointment = get_appointment_or_404(appointment_id, medical_record.id, db)
    
    updated_appointment = AppointmentService.change_appointment_status(
        db=db,
        appointment=appointment,
        new_status=payload.status,
    )
    
    return updated_appointment
