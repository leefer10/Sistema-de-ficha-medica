import datetime

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Vaccine(Base):
    """Vacunas aplicadas al paciente — relacion 1:N con MedicalRecord."""

    __tablename__ = "vaccines"

    id = Column(Integer, primary_key=True, index=True)
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    nombre = Column(String(200), nullable=False)
    fecha_aplicacion = Column(Date, nullable=True)
    numero_dosis = Column(Integer, nullable=True)  # 1ra, 2da, refuerzo…
    lote = Column(String(100), nullable=True)
    observaciones = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="vaccines")
