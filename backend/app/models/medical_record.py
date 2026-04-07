import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base
from app.models import emergency_contact  # noqa: F401


class MedicalRecord(Base):
    """Ficha medica principal del usuario (1:1)."""

    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    numero_expediente = Column(String(30), unique=True, nullable=False, index=True)
    estado = Column(String(20), nullable=False, default="activa")
    qr_token = Column(String(32), unique=True, nullable=True, index=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    user = relationship("User", back_populates="medical_record")
    medical_history = relationship(
        "MedicalHistory",
        back_populates="medical_record",
        uselist=False,
        cascade="all, delete-orphan",
    )
    habit = relationship(
        "Habit",
        back_populates="medical_record",
        uselist=False,
        cascade="all, delete-orphan",
    )
    medications = relationship(
        "Medication",
        back_populates="medical_record",
        cascade="all, delete-orphan",
    )
    vaccines = relationship(
        "Vaccine",
        back_populates="medical_record",
        cascade="all, delete-orphan",
    )
    surgeries = relationship(
        "Surgery",
        back_populates="medical_record",
        cascade="all, delete-orphan",
    )
    emergency_contacts = relationship(
        "EmergencyContact",
        back_populates="medical_record",
        cascade="all, delete-orphan",
    )
    appointments = relationship(
        "Appointment",
        back_populates="medical_record",
        cascade="all, delete-orphan",
    )
