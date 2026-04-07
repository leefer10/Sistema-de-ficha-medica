from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, computed_field


class MedicationBase(BaseModel):
    nombre: str = Field(min_length=2, max_length=200)
    dosis: Optional[str] = Field(default=None, max_length=100)
    frecuencia: Optional[str] = Field(default=None, max_length=100)
    motivo: Optional[str] = Field(default=None, max_length=255)
    activo: Optional[bool] = True


class MedicationCreate(MedicationBase):
    quantity_prescribed: Optional[int] = Field(default=None, gt=0)


class MedicationUpdate(BaseModel):
    nombre: Optional[str] = Field(default=None, min_length=2, max_length=200)
    dosis: Optional[str] = Field(default=None, max_length=100)
    frecuencia: Optional[str] = Field(default=None, max_length=100)
    motivo: Optional[str] = Field(default=None, max_length=255)
    activo: Optional[bool] = None
    quantity_prescribed: Optional[int] = Field(default=None, gt=0)


class MedicationConsumeRequest(BaseModel):
    quantity_to_consume: int = Field(gt=0, description="Cantidad a consumir del medicamento")


class MedicationResponse(MedicationBase):
    id: int
    medical_record_id: int
    quantity_prescribed: Optional[int] = None
    quantity_consumed: Optional[int] = 0
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def remaining_quantity(self) -> Optional[int]:
        """Cantidad restante de medicamento"""
        if self.quantity_prescribed is None:
            return None
        return self.quantity_prescribed - (self.quantity_consumed or 0)

    @computed_field
    @property
    def is_finished(self) -> bool:
        """Si el medicamento está finalizado (cantidad consumida >= prescrita)"""
        if self.quantity_prescribed is None:
            return False
        return (self.quantity_consumed or 0) >= self.quantity_prescribed

    model_config = ConfigDict(from_attributes=True)
