from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.database import Base
from app.models import personal_data  # noqa: F401
from app.models import medical_record  # noqa: F401
from app.models import medical_history  # noqa: F401
from app.models import habits  # noqa: F401
from app.models import medications  # noqa: F401
from app.models import vaccines  # noqa: F401
from app.models import surgeries  # noqa: F401
from app.models import emergency_contact  # noqa: F401
import datetime
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    member = "member"
    viewer = "viewer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    cedula = Column(String, unique=True, nullable=True, index=True)
    id_alterno = Column(String, unique=True, nullable=True, index=True)
    role = Column(SAEnum(UserRole, name="userrole"), nullable=False, default=UserRole.member)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    personal_data = relationship(
        "PersonalData",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    medical_record = relationship(
        "MedicalRecord",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
