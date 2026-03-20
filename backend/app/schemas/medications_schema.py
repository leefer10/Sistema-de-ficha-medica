from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class MedicationBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=200)
    dosis: Optional[str] = Field(default=None, max_length=100)
    frecuencia: Optional[str] = Field(default=None, max_length=100)
    motivo: Optional[str] = Field(default=None, max_length=255)
    activo: Optional[bool] = True


class MedicationCreate(MedicationBase):
    pass


class MedicationUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=200)
    dosis: Optional[str] = Field(default=None, max_length=100)
    frecuencia: Optional[str] = Field(default=None, max_length=100)
    motivo: Optional[str] = Field(default=None, max_length=255)
    activo: Optional[bool] = None


class MedicationResponse(MedicationBase):
    id: int
    medical_record_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
