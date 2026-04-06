from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class MedicalHistory(Base):
    """Antecedentes patologicos y familiares — relacion 1:1 con MedicalRecord."""

    __tablename__ = "medical_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    # Antecedentes patológicos
    tipo_sangre = Column(String(10), nullable=True)
    alergias = Column(Text, nullable=True)
    enfermedades_cronicas = Column(Text, nullable=True)

    # Antecedentes familiares
    antecedentes_familiares = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="medical_history")
