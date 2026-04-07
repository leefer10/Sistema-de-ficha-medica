"""Schemas para recordatorios de medicamentos."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class MedicationReminderBase(BaseModel):
    """Campos base para recordatorios de medicamentos."""
    reminder_time: str = Field(description="Hora del recordatorio en formato HH:MM")
    is_enabled: bool = True


class MedicationReminderCreate(MedicationReminderBase):
    """Esquema para crear recordatorio de medicamento."""
    
    @field_validator('reminder_time')
    @classmethod
    def validate_time_format(cls, v):
        """Validar formato HH:MM."""
        try:
            from datetime import datetime
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise ValueError("Formato de hora inválido. Debe ser HH:MM")
        return v


class MedicationReminderUpdate(BaseModel):
    """Esquema para actualizar recordatorio de medicamento."""
    reminder_time: Optional[str] = Field(default=None, description="Hora en formato HH:MM")
    is_enabled: Optional[bool] = None
    
    @field_validator('reminder_time')
    @classmethod
    def validate_time_format(cls, v):
        """Validar formato HH:MM."""
        if v is None:
            return v
        try:
            from datetime import datetime
            datetime.strptime(v, "%H:%M")
        except ValueError:
            raise ValueError("Formato de hora inválido. Debe ser HH:MM")
        return v


class MedicationReminderResponse(MedicationReminderBase):
    """Esquema de respuesta para recordatorio de medicamento."""
    id: int
    medication_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
