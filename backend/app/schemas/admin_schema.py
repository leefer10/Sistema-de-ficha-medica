from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class AdminUserResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    cedula: Optional[str] = None
    role: UserRole
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminRoleUpdateRequest(BaseModel):
    role: UserRole
