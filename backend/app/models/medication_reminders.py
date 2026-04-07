import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship

from app.database import Base


class MedicationReminder(Base):
    """Recordatorios personalizados para medicamentos — relación 1:N con Medication."""

    __tablename__ = "medication_reminders"

    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(
        Integer,
        ForeignKey("medications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    reminder_time = Column(String(5), nullable=False)  # HH:MM format (e.g., "08:00")
    is_enabled = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    medication = relationship("Medication", back_populates="reminders")
