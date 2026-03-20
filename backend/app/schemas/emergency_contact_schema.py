from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class EmergencyContactBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=200)
    telefono: str = Field(min_length=7, max_length=20)
    relacion: str = Field(min_length=2, max_length=100)


class EmergencyContactCreate(EmergencyContactBase):
    pass


class EmergencyContactUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=200)
    telefono: Optional[str] = Field(default=None, min_length=7, max_length=20)
    relacion: Optional[str] = Field(default=None, min_length=2, max_length=100)


class EmergencyContactResponse(EmergencyContactBase):
    id: int
    medical_record_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
