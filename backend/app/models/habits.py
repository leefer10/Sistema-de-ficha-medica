import datetime
import enum

from sqlalchemy import Boolean, Column, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class AlcoholFrequency(str, enum.Enum):
    nunca = "nunca"
    ocasional = "ocasional"
    frecuente = "frecuente"


class ExerciseLevel(str, enum.Enum):
    sedentario = "sedentario"
    leve = "leve"
    moderado = "moderado"
    intenso = "intenso"


class Habit(Base):
    """Habitos del paciente — relacion 1:1 con MedicalRecord."""

    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    medical_record_id = Column(
        Integer,
        ForeignKey("medical_records.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    fuma = Column(Boolean, nullable=False, default=False)
    consume_alcohol = Column(
        SAEnum(AlcoholFrequency, name="alcoholfrequency"),
        nullable=False,
        default=AlcoholFrequency.nunca,
    )
    nivel_ejercicio = Column(
        SAEnum(ExerciseLevel, name="exerciselevel"),
        nullable=False,
        default=ExerciseLevel.sedentario,
    )
    tipo_dieta = Column(String(100), nullable=True)
    consume_drogas = Column(Boolean, nullable=False, default=False)
    observaciones = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medical_record = relationship("MedicalRecord", back_populates="habit")
