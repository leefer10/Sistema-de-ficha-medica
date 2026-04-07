import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class AppointmentReminder(Base):
    """Recordatorios personalizados para citas médicas — relación 1:N con Appointment."""

    __tablename__ = "appointment_reminders"

    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(
        Integer,
        ForeignKey("appointments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    reminder_before_hours = Column(Integer, nullable=False)  # e.g., 24, 1, 2
    is_enabled = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    appointment = relationship("Appointment", back_populates="reminders")
