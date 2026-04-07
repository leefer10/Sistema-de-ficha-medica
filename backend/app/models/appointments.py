import datetime
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class AppointmentStatus(str, Enum):
    """Estados posibles de una cita."""
    PROGRAMADA = "programada"
    COMPLETADA = "completada"
    CANCELADA = "cancelada"


class Appointment(Base):
    """Citas médicas del paciente — relación 1:N con MedicalRecord."""

    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    doctor_name = Column(String(200), nullable=False)
    appointment_type = Column(String(100), nullable=True)  # e.g., "General", "Cardiology"
    appointment_date = Column(String(10), nullable=False)  # YYYY-MM-DD format
    appointment_time = Column(String(5), nullable=False)  # HH:MM format
    location = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default=AppointmentStatus.PROGRAMADA)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="appointments")
    reminders = relationship("AppointmentReminder", back_populates="appointment", cascade="all, delete-orphan")
