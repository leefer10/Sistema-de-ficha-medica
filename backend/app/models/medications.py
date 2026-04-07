import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Medication(Base):
    """Medicacion activa o historica del paciente — relacion 1:N con MedicalRecord."""

    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    nombre = Column(String(200), nullable=False)
    dosis = Column(String(100), nullable=True)
    frecuencia = Column(String(100), nullable=True)
    motivo = Column(String(255), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    
    # New fields for medication management sprint
    quantity_prescribed = Column(Integer, nullable=True)  # Cantidad prescrita por médico
    quantity_consumed = Column(Integer, nullable=True, default=0)  # Cantidad consumida

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="medications")
    reminders = relationship("MedicationReminder", back_populates="medication", cascade="all, delete-orphan")
