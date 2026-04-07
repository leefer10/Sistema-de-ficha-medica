import datetime
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class NotificationDeliveryMethod(str, Enum):
    """Métodos de entrega de notificaciones."""
    IN_APP = "in_app"
    PUSH = "push"
    EMAIL = "email"


class NotificationType(str, Enum):
    """Tipos de notificaciones."""
    MEDICATION_REMINDER = "medication_reminder"
    APPOINTMENT_REMINDER = "appointment_reminder"


class NotificationHistory(Base):
    """Historial de notificaciones enviadas — relación 1:N con User (through MedicalRecord)."""

    __tablename__ = "notification_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    notification_type = Column(String(30), nullable=False)  # medication_reminder, appointment_reminder
    related_id = Column(Integer, nullable=True)  # medication_id or appointment_id
    related_type = Column(String(50), nullable=True)  # "medication" or "appointment"
    message = Column(Text, nullable=False)
    delivery_method = Column(String(20), nullable=False, default=NotificationDeliveryMethod.IN_APP)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    user = relationship("User", back_populates="notifications")
