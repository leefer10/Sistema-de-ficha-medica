"""Schemas para citas médicas."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AppointmentReminderResponse(BaseModel):
    """Esquema de respuesta para recordatorios de cita."""
    id: int
    reminder_before_hours: int
    is_enabled: bool


class AppointmentBase(BaseModel):
    """Campos base compartidos entre esquemas de cita."""
    doctor_name: str = Field(min_length=2, max_length=200)
    appointment_type: Optional[str] = Field(default=None, max_length=100)
    appointment_date: str = Field(description="Fecha en formato YYYY-MM-DD")
    appointment_time: str = Field(description="Hora en formato HH:MM")
    location: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = Field(default=None)


class AppointmentCreate(AppointmentBase):
    """Esquema para crear una cita."""
    pass


class AppointmentUpdate(BaseModel):
    """Esquema para actualizar una cita."""
    doctor_name: Optional[str] = Field(default=None, min_length=2, max_length=200)
    appointment_type: Optional[str] = Field(default=None, max_length=100)
    appointment_date: Optional[str] = Field(default=None, description="Fecha en formato YYYY-MM-DD")
    appointment_time: Optional[str] = Field(default=None, description="Hora en formato HH:MM")
    location: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = Field(default=None)


class AppointmentStatusUpdate(BaseModel):
    """Esquema para cambiar el estado de una cita."""
    status: str = Field(
        description="Nuevo estado: programada, completada, cancelada"
    )

    @field_validator('status')
    @classmethod
    def status_must_be_valid(cls, v):
        """Validar que el estado sea válido."""
        valid_statuses = ['programada', 'completada', 'cancelada']
        if v not in valid_statuses:
            raise ValueError(f'Estado debe ser uno de: {", ".join(valid_statuses)}')
        return v


class AppointmentResponse(AppointmentBase):
    """Esquema de respuesta para una cita."""
    id: int
    medical_record_id: int
    status: str
    reminders: List[AppointmentReminderResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
