"""Schemas para recordatorios de citas."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class AppointmentReminderBase(BaseModel):
    """Campos base para recordatorios de citas."""
    reminder_before_hours: int = Field(gt=0, description="Horas antes de la cita para recordar")
    is_enabled: bool = True


class AppointmentReminderCreate(AppointmentReminderBase):
    """Esquema para crear recordatorio de cita."""
    pass


class AppointmentReminderUpdate(BaseModel):
    """Esquema para actualizar recordatorio de cita."""
    reminder_before_hours: Optional[int] = Field(default=None, gt=0)
    is_enabled: Optional[bool] = None


class AppointmentReminderResponse(AppointmentReminderBase):
    """Esquema de respuesta para recordatorio de cita."""
    id: int
    appointment_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
