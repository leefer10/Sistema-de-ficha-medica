"""Servicio de notificaciones."""

from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.notification_history import NotificationHistory, NotificationType, NotificationDeliveryMethod


class NotificationService:
    """Servicio para gestionar notificaciones."""

    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        notification_type: str,
        message: str,
        related_id: int = None,
        related_type: str = None,
        delivery_method: str = NotificationDeliveryMethod.IN_APP,
    ) -> NotificationHistory:
        """
        Crear una notificación.
        
        Args:
            db: Sesión de base de datos
            user_id: ID del usuario
            notification_type: Tipo (medication_reminder, appointment_reminder)
            message: Mensaje de notificación
            related_id: ID del recurso relacionado (medication_id o appointment_id)
            related_type: Tipo de recurso (medication o appointment)
            delivery_method: Método de entrega (in_app, push, email)
            
        Returns:
            Notificación creada
        """
        notification = NotificationHistory(
            user_id=user_id,
            notification_type=notification_type,
            message=message,
            related_id=related_id,
            related_type=related_type,
            delivery_method=delivery_method,
            sent_at=datetime.utcnow(),
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        return notification

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int,
        limit: int = 50,
        notification_type: str = None,
    ) -> list[NotificationHistory]:
        """
        Obtener notificaciones del usuario.
        
        Args:
            db: Sesión de base de datos
            user_id: ID del usuario
            limit: Límite de resultados
            notification_type: Filtro por tipo (opcional)
            
        Returns:
            Lista de notificaciones ordenadas por fecha descendente
        """
        query = db.query(NotificationHistory).filter(
            NotificationHistory.user_id == user_id
        )
        
        if notification_type:
            query = query.filter(
                NotificationHistory.notification_type == notification_type
            )
        
        notifications = query.order_by(
            NotificationHistory.sent_at.desc()
        ).limit(limit).all()
        
        return notifications

    @staticmethod
    def get_unread_count(db: Session, user_id: int) -> int:
        """
        Obtener cantidad de notificaciones no leídas.
        
        Nota: Actualmente todas las notificaciones se consideran no leídas
        por defecto. Esto podría extenderse con un campo 'is_read'.
        
        Args:
            db: Sesión de base de datos
            user_id: ID del usuario
            
        Returns:
            Cantidad de notificaciones no leídas
        """
        # Contar todas las notificaciones del último día
        from datetime import timedelta
        
        recent_cutoff = datetime.utcnow() - timedelta(days=1)
        
        count = db.query(NotificationHistory).filter(
            NotificationHistory.user_id == user_id,
            NotificationHistory.sent_at >= recent_cutoff,
        ).count()
        
        return count

    @staticmethod
    def get_recent_notifications(
        db: Session,
        user_id: int,
        hours: int = 24,
        limit: int = 20,
    ) -> list[NotificationHistory]:
        """
        Obtener notificaciones recientes del usuario.
        
        Args:
            db: Sesión de base de datos
            user_id: ID del usuario
            hours: Horas hacia atrás para buscar
            limit: Límite de resultados
            
        Returns:
            Lista de notificaciones recientes
        """
        from datetime import timedelta
        
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        
        notifications = db.query(NotificationHistory).filter(
            NotificationHistory.user_id == user_id,
            NotificationHistory.sent_at >= cutoff,
        ).order_by(
            NotificationHistory.sent_at.desc()
        ).limit(limit).all()
        
        return notifications

    @staticmethod
    def get_notification_by_type_and_resource(
        db: Session,
        user_id: int,
        notification_type: str,
        related_id: int,
        hours: int = 1,
    ) -> NotificationHistory:
        """
        Obtener notificación reciente de un tipo y recurso específico.
        
        Útil para evitar duplicados: si ya enviamos un recordatorio hace poco,
        no lo volvemos a enviar.
        
        Args:
            db: Sesión de base de datos
            user_id: ID del usuario
            notification_type: Tipo de notificación
            related_id: ID del recurso
            hours: Horas hacia atrás para buscar
            
        Returns:
            Notificación encontrada o None
        """
        from datetime import timedelta
        
        cutoff = datetime.utcnow() - timedelta(hours=hours)
        
        notification = db.query(NotificationHistory).filter(
            NotificationHistory.user_id == user_id,
            NotificationHistory.notification_type == notification_type,
            NotificationHistory.related_id == related_id,
            NotificationHistory.sent_at >= cutoff,
        ).order_by(
            NotificationHistory.sent_at.desc()
        ).first()
        
        return notification
