from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PersonalDataBase(BaseModel):
    fecha_nacimiento: Optional[date] = None
    telefono: Optional[str] = Field(default=None, min_length=7, max_length=20)
    direccion: Optional[str] = Field(default=None, min_length=5, max_length=255)
    ciudad: Optional[str] = Field(default=None, min_length=2, max_length=100)
    pais: Optional[str] = Field(default=None, min_length=2, max_length=100)

    @field_validator("telefono")
    @classmethod
    def validate_telefono(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value

        normalized = value.strip()
        if not normalized:
            return None

        allowed_chars = set("+0123456789-() ")
        if any(char not in allowed_chars for char in normalized):
            raise ValueError("El telefono contiene caracteres no validos")

        return normalized


class PersonalDataCreate(PersonalDataBase):
    pass


class PersonalDataUpdate(PersonalDataBase):
    pass


class PersonalDataResponse(PersonalDataBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
