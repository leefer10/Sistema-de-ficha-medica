"""Servicio de negocio para recordatorios de medicamentos."""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.medication_reminders import MedicationReminder
from app.models.medications import Medication


class MedicationReminderService:
    """Servicio de negocio para recordatorios de medicamentos."""

    @staticmethod
    def validate_time_format(time_str: str) -> None:
        """
        Validar formato de hora HH:MM.
        
        Args:
            time_str: Hora en formato HH:MM
            
        Raises:
            HTTPException: Si el formato es inválido
        """
        try:
            from datetime import datetime
            datetime.strptime(time_str, "%H:%M")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de hora inválido. Debe ser HH:MM"
            )

    @staticmethod
    def create_reminder(
        db: Session,
        medication_id: int,
        reminder_time: str,
        is_enabled: bool = True,
    ) -> MedicationReminder:
        """
        Crear recordatorio para medicamento.
        
        Args:
            db: Sesión de base de datos
            medication_id: ID del medicamento
            reminder_time: Hora en formato HH:MM
            is_enabled: Si está habilitado
            
        Returns:
            Recordatorio creado
            
        Raises:
            HTTPException: Si el medicamento no existe o hay error de validación
        """
        # Validar medicamento existe
        medication = db.query(Medication).filter(
            Medication.id == medication_id
        ).first()
        
        if not medication:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medicamento no encontrado"
            )
        
        # Validar formato de hora
        MedicationReminderService.validate_time_format(reminder_time)
        
        # Crear recordatorio
        reminder = MedicationReminder(
            medication_id=medication_id,
            reminder_time=reminder_time,
            is_enabled=is_enabled,
        )
        
        db.add(reminder)
        db.commit()
        db.refresh(reminder)
        
        return reminder

    @staticmethod
    def get_reminders(
        db: Session,
        medication_id: int,
    ) -> list[MedicationReminder]:
        """
        Obtener recordatorios de medicamento.
        
        Args:
            db: Sesión de base de datos
            medication_id: ID del medicamento
            
        Returns:
            Lista de recordatorios
        """
        reminders = db.query(MedicationReminder).filter(
            MedicationReminder.medication_id == medication_id
        ).all()
        
        return reminders

    @staticmethod
    def get_reminder_or_404(
        db: Session,
        reminder_id: int,
        medication_id: int,
    ) -> MedicationReminder:
        """
        Obtener recordatorio específico o lanzar 404.
        
        Args:
            db: Sesión de base de datos
            reminder_id: ID del recordatorio
            medication_id: ID del medicamento (para validación)
            
        Returns:
            Recordatorio encontrado
            
        Raises:
            HTTPException: Si no existe
        """
        reminder = db.query(MedicationReminder).filter(
            MedicationReminder.id == reminder_id,
            MedicationReminder.medication_id == medication_id,
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
        reminder: MedicationReminder,
        reminder_time: str = None,
        is_enabled: bool = None,
    ) -> MedicationReminder:
        """
        Actualizar recordatorio.
        
        Args:
            db: Sesión de base de datos
            reminder: Recordatorio a actualizar
            reminder_time: Nueva hora (opcional)
            is_enabled: Nuevo estado (opcional)
            
        Returns:
            Recordatorio actualizado
        """
        if reminder_time:
            MedicationReminderService.validate_time_format(reminder_time)
            reminder.reminder_time = reminder_time
        
        if is_enabled is not None:
            reminder.is_enabled = is_enabled
        
        db.commit()
        db.refresh(reminder)
        
        return reminder

    @staticmethod
    def delete_reminder(
        db: Session,
        reminder: MedicationReminder,
    ) -> None:
        """
        Eliminar recordatorio.
        
        Args:
            db: Sesión de base de datos
            reminder: Recordatorio a eliminar
        """
        db.delete(reminder)
        db.commit()
