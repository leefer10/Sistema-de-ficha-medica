from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class VaccineBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=200)
    fecha_aplicacion: Optional[date] = None
    numero_dosis: Optional[int] = Field(default=None, ge=1)
    lote: Optional[str] = Field(default=None, max_length=100)
    observaciones: Optional[str] = None


class VaccineCreate(VaccineBase):
    pass


class VaccineUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=200)
    fecha_aplicacion: Optional[date] = None
    numero_dosis: Optional[int] = Field(default=None, ge=1)
    lote: Optional[str] = Field(default=None, max_length=100)
    observaciones: Optional[str] = None


class VaccineResponse(VaccineBase):
    id: int
    medical_record_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
