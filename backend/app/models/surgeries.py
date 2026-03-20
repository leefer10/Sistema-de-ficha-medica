import datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Surgery(Base):
    """Antecedentes quirurgicos del paciente — relacion 1:N con MedicalRecord."""

    __tablename__ = "surgeries"

    id = Column(Integer, primary_key=True, index=True)
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    nombre_procedimiento = Column(String(255), nullable=False)
    fecha = Column(Date, nullable=True)
    motivo = Column(String(255), nullable=True)
    hospital = Column(String(255), nullable=True)
    complicaciones = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="surgeries")
