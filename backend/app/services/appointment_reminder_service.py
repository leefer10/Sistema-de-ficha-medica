"""Servicio de negocio para recordatorios de citas."""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.appointment_reminders import AppointmentReminder
from app.models.appointments import Appointment


class AppointmentReminderService:
    """Servicio de negocio para recordatorios de citas."""

    @staticmethod
    def validate_hours(hours: int) -> None:
        """
        Validar que las horas sean válidas.
        
        Args:
            hours: Número de horas
            
        Raises:
            HTTPException: Si es inválido
        """
        if hours <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Las horas deben ser mayor a 0"
            )

    @staticmethod
    def create_reminder(
        db: Session,
        appointment_id: int,
        reminder_before_hours: int,
        is_enabled: bool = True,
    ) -> AppointmentReminder:
        """
        Crear recordatorio para cita.
        
        Args:
            db: Sesión de base de datos
            appointment_id: ID de la cita
            reminder_before_hours: Horas antes de la cita
            is_enabled: Si está habilitado
            
        Returns:
            Recordatorio creado
            
        Raises:
            HTTPException: Si la cita no existe o hay error de validación
        """
        # Validar cita existe
        appointment = db.query(Appointment).filter(
            Appointment.id == appointment_id
        ).first()
        
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cita no encontrada"
            )
        
        # Validar horas
        AppointmentReminderService.validate_hours(reminder_before_hours)
        
        # Crear recordatorio
        reminder = AppointmentReminder(
            appointment_id=appointment_id,
            reminder_before_hours=reminder_before_hours,
            is_enabled=is_enabled,
        )
        
        db.add(reminder)
        db.commit()
        db.refresh(reminder)
        
        return reminder

    @staticmethod
    def get_reminders(
        db: Session,
        appointment_id: int,
    ) -> list[AppointmentReminder]:
        """
        Obtener recordatorios de cita.
        
        Args:
            db: Sesión de base de datos
            appointment_id: ID de la cita
            
        Returns:
            Lista de recordatorios
        """
        reminders = db.query(AppointmentReminder).filter(
            AppointmentReminder.appointment_id == appointment_id
        ).all()
        
        return reminders

    @staticmethod
    def get_reminder_or_404(
        db: Session,
        reminder_id: int,
        appointment_id: int,
    ) -> AppointmentReminder:
        """
        Obtener recordatorio específico o lanzar 404.
        
        Args:
            db: Sesión de base de datos
            reminder_id: ID del recordatorio
            appointment_id: ID de la cita (para validación)
            
        Returns:
            Recordatorio encontrado
            
        Raises:
            HTTPException: Si no existe
        """
        reminder = db.query(AppointmentReminder).filter(
            AppointmentReminder.id == reminder_id,
            AppointmentReminder.appointment_id == appointment_id,
        ).first()
        
        if not reminder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recordatorio no encontrado"
            )
        
        return reminder

    @staticmethod
    def update_reminder(
        db: Session,
        reminder: AppointmentReminder,
        reminder_before_hours: int = None,
        is_enabled: bool = None,
    ) -> AppointmentReminder:
        """
        Actualizar recordatorio.
        
        Args:
            db: Sesión de base de datos
            reminder: Recordatorio a actualizar
            reminder_before_hours: Nuevas horas (opcional)
            is_enabled: Nuevo estado (opcional)
            
        Returns:
            Recordatorio actualizado
        """
        if reminder_before_hours is not None:
            AppointmentReminderService.validate_hours(reminder_before_hours)
            reminder.reminder_before_hours = reminder_before_hours
        
        if is_enabled is not None:
            reminder.is_enabled = is_enabled
        
        db.commit()
        db.refresh(reminder)
        
        return reminder

    @staticmethod
    def delete_reminder(
        db: Session,
        reminder: AppointmentReminder,
    ) -> None:
        """
        Eliminar recordatorio.
        
        Args:
            db: Sesión de base de datos
            reminder: Recordatorio a eliminar
        """
        db.delete(reminder)
        db.commit()
