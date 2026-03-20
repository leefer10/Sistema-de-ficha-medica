import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class EmergencyContact(Base):
    """Contacto de emergencia del paciente — relacion 1:N con MedicalRecord."""

    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    nombre = Column(String(200), nullable=False)
    telefono = Column(String(20), nullable=False)
    relacion = Column(String(100), nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="emergency_contacts")
