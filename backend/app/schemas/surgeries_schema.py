from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SurgeryBase(BaseModel):
    nombre_procedimiento: str = Field(min_length=2, max_length=255)
    fecha: Optional[date] = None
    motivo: Optional[str] = Field(default=None, max_length=255)
    hospital: Optional[str] = Field(default=None, max_length=255)
    complicaciones: Optional[str] = None


class SurgeryCreate(SurgeryBase):
    pass


class SurgeryUpdate(BaseModel):
    nombre_procedimiento: Optional[str] = Field(default=None, min_length=2, max_length=255)
    fecha: Optional[date] = None
    motivo: Optional[str] = Field(default=None, max_length=255)
    hospital: Optional[str] = Field(default=None, max_length=255)
    complicaciones: Optional[str] = None


class SurgeryResponse(SurgeryBase):
    id: int
    medical_record_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
