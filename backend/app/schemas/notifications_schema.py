"""Schemas para notificaciones."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class NotificationHistoryResponse(BaseModel):
    """Esquema de respuesta para notificación."""
    id: int
    user_id: int
    notification_type: str
    related_id: Optional[int] = None
    related_type: Optional[str] = None
    message: str
    delivery_method: str
    sent_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UnreadCountResponse(BaseModel):
    """Esquema de respuesta para contador de no leídas."""
    unread_count: int
