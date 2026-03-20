from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

VALID_BLOOD_TYPES = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"}


class MedicalHistoryBase(BaseModel):
    tipo_sangre: Optional[str] = None
    alergias: Optional[str] = None
    enfermedades_cronicas: Optional[str] = None
    antecedentes_familiares: Optional[str] = None

    @field_validator("tipo_sangre")
    @classmethod
    def validate_tipo_sangre(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        normalized = value.strip().upper()
        if normalized not in VALID_BLOOD_TYPES:
            raise ValueError(f"Tipo de sangre invalido. Valores aceptados: {', '.join(sorted(VALID_BLOOD_TYPES))}")
        return normalized


class MedicalHistoryCreate(MedicalHistoryBase):
    pass


class MedicalHistoryUpdate(MedicalHistoryBase):
    pass


class MedicalHistoryResponse(MedicalHistoryBase):
    id: int
    medical_record_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
