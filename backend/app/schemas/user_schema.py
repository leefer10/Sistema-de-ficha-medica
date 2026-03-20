import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.user import UserRole


class UserCreate(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    apellido: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    cedula: Optional[str] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.search(r"[A-Z]", value):
            raise ValueError("La contraseña debe tener al menos una letra mayuscula")
        if not re.search(r"[a-z]", value):
            raise ValueError("La contraseña debe tener al menos una letra minuscula")
        if not re.search(r"\d", value):
            raise ValueError("La contraseña debe tener al menos un numero")
        return value


class UserResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    cedula: Optional[str] = None
    id_alterno: Optional[str] = None
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
