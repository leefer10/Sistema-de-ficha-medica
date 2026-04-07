"""Router para notificaciones."""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.notifications_schema import (
    NotificationHistoryResponse,
    UnreadCountResponse,
)
from app.services.notification_service import NotificationService
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=List[NotificationHistoryResponse])
def get_notifications(
    limit: int = 50,
    notification_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Obtener notificaciones del usuario autenticado.
    
    - **limit**: Límite de resultados (default: 50, max: 200)
    - **notification_type**: Filtro por tipo (medication_reminder, appointment_reminder) - opcional
    """
    if limit > 200:
        limit = 200
    if limit < 1:
        limit = 1
    
    notifications = NotificationService.get_user_notifications(
        db=db,
        user_id=current_user.id,
        limit=limit,
        notification_type=notification_type,
    )
    
    return notifications


@router.get("/recent", response_model=List[NotificationHistoryResponse])
def get_recent_notifications(
    hours: int = 24,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Obtener notificaciones recientes del usuario.
    
    - **hours**: Horas hacia atrás (default: 24)
    - **limit**: Límite de resultados (default: 20)
    """
    if limit > 100:
        limit = 100
    if limit < 1:
        limit = 1
    if hours < 1:
        hours = 1
    if hours > 365:
        hours = 365
    
    notifications = NotificationService.get_recent_notifications(
        db=db,
        user_id=current_user.id,
        hours=hours,
        limit=limit,
    )
    
    return notifications


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Obtener cantidad de notificaciones no leídas (últimas 24 horas).
    
    Nota: Actualmente todas las notificaciones se consideran no leídas.
    """
    count = NotificationService.get_unread_count(
        db=db,
        user_id=current_user.id,
    )
    
    return {"unread_count": count}
