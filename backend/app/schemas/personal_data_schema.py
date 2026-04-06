from datetime import date
from typing import Optional, Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PersonalDataBase(BaseModel):
    # Campos del User
    fullName: Optional[str] = None
    identityCard: Optional[str] = None
    bloodType: Optional[str] = None
    
    # Campos de PersonalData
    fecha_nacimiento: Optional[date] = None
    phone: Optional[str] = None
    telefono: Optional[str] = None
    address: Optional[str] = None
    direccion: Optional[str] = None
    ciudad: Optional[str] = None
    pais: Optional[str] = None
    
    # Campos médicos opcionales
    birthDate: Optional[date] = None
    gender: Optional[str] = None
    allergies: Optional[str] = None
    chronicConditions: Optional[str] = None
    
    # Contacto de emergencia
    emergencyContact: Optional[str] = None
    emergencyRelation: Optional[str] = None
    emergencyPhone: Optional[str] = None
    
    # Permitir campos adicionales
    class Config:
        extra = "allow"

    @field_validator("telefono", "phone", "emergencyPhone", mode="before")
    @classmethod
    def validate_telefono(cls, value):
        if value is None or value == "":
            return None
        
        if not isinstance(value, str):
            return value

        normalized = value.strip()
        if not normalized:
            return None

        return normalized


class PersonalDataCreate(PersonalDataBase):
    pass


class PersonalDataUpdate(PersonalDataBase):
    pass


class PersonalDataResponse(PersonalDataBase):
    id: Optional[int] = None
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
