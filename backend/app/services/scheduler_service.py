"""Servicio scheduler para recordatorios automáticos."""

import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medication_reminders import MedicationReminder
from app.models.appointment_reminders import AppointmentReminder
from app.models.medications import Medication
from app.models.appointments import Appointment
from app.services.notification_service import NotificationService
from app.models.notification_history import NotificationType, NotificationDeliveryMethod

logger = logging.getLogger("uvicorn.error")


class SchedulerService:
    """Servicio para ejecutar tareas programadas (recordatorios automáticos)."""

    @staticmethod
    def check_medication_reminders(db: Session) -> int:
        """
        Verificar recordatorios de medicamentos vencidos.
        
        Lógica:
        1. Obtener hora actual (HH:MM)
        2. Buscar MedicationReminders con reminder_time == hora actual
        3. Para cada recordatorio encontrado:
           - Verificar que no se haya enviado hace poco (evitar duplicados)
           - Obtener el medicamento y usuario
           - Crear notificación en BD
        
        Args:
            db: Sesión de base de datos
            
        Returns:
            Cantidad de notificaciones creadas
        """
        try:
            # Obtener hora actual sin segundos
            now = datetime.utcnow()
            current_time = now.strftime("%H:%M")
            
            # Buscar recordatorios activos para esta hora
            reminders = db.query(MedicationReminder).filter(
                MedicationReminder.reminder_time == current_time,
                MedicationReminder.is_enabled == True,
            ).all()
            
            notifications_created = 0
            
            for reminder in reminders:
                try:
                    # Obtener medicamento y usuario
                    medication = db.query(Medication).filter(
                        Medication.id == reminder.medication_id
                    ).first()
                    
                    if not medication:
                        continue
                    
                    # Verificar que no se envió recientemente (evitar duplicados)
                    recent = NotificationService.get_notification_by_type_and_resource(
                        db=db,
                        user_id=medication.medical_record.user_id,
                        notification_type=NotificationType.MEDICATION_REMINDER,
                        related_id=medication.id,
                        hours=1,
                    )
                    
                    if recent:
                        continue  # Ya se envió hace poco
                    
                    # Crear notificación
                    message = f"Recordatorio: Es hora de tomar {medication.nombre} ({medication.dosis})"
                    
                    NotificationService.create_notification(
                        db=db,
                        user_id=medication.medical_record.user_id,
                        notification_type=NotificationType.MEDICATION_REMINDER,
                        message=message,
                        related_id=medication.id,
                        related_type="medication",
                        delivery_method=NotificationDeliveryMethod.IN_APP,
                    )
                    
                    notifications_created += 1
                    logger.info(f"Notificación de medicamento creada: {message}")
                    
                except Exception as e:
                    logger.error(f"Error procesando recordatorio de medicamento {reminder.id}: {e}")
                    continue
            
            return notifications_created
            
        except Exception as e:
            logger.error(f"Error en check_medication_reminders: {e}")
            return 0

    @staticmethod
    def check_appointment_reminders(db: Session) -> int:
        """
        Verificar recordatorios de citas vencidas.
        
        Lógica:
        1. Obtener fecha + hora actual
        2. Buscar AppointmentReminders donde:
           appointment_datetime - reminder_before_hours == ahora
        3. Para cada recordatorio encontrado:
           - Verificar que no se haya enviado hace poco (evitar duplicados)
           - Obtener la cita y usuario
           - Crear notificación en BD
        
        Args:
            db: Sesión de base de datos
            
        Returns:
            Cantidad de notificaciones creadas
        """
        try:
            now = datetime.utcnow()
            notifications_created = 0
            
            # Buscar recordatorios activos
            reminders = db.query(AppointmentReminder).filter(
                AppointmentReminder.is_enabled == True,
            ).all()
            
            for reminder in reminders:
                try:
                    # Obtener cita
                    appointment = db.query(Appointment).filter(
                        Appointment.id == reminder.appointment_id
                    ).first()
                    
                    if not appointment:
                        continue
                    
                    # Construir datetime de la cita
                    try:
                        appointment_datetime = datetime.strptime(
                            f"{appointment.appointment_date} {appointment.appointment_time}",
                            "%Y-%m-%d %H:%M"
                        )
                    except ValueError:
                        logger.error(f"Formato de fecha/hora inválido en cita {appointment.id}")
                        continue
                    
                    # Calcular cuándo debería dispararse el recordatorio
                    reminder_datetime = appointment_datetime - timedelta(hours=reminder.reminder_before_hours)
                    
                    # Comparar con margen de 1 minuto (por si acaso)
                    time_diff = abs((now - reminder_datetime).total_seconds())
                    
                    if time_diff > 60:  # No es la hora todavía
                        continue
                    
                    # Verificar que no se envió recientemente
                    recent = NotificationService.get_notification_by_type_and_resource(
                        db=db,
                        user_id=appointment.medical_record.user_id,
                        notification_type=NotificationType.APPOINTMENT_REMINDER,
                        related_id=appointment.id,
                        hours=1,
                    )
                    
                    if recent:
                        continue  # Ya se envió hace poco
                    
                    # Crear notificación
                    message = f"Recordatorio: Tienes una cita con {appointment.doctor_name} en {reminder.reminder_before_hours} hora(s)"
                    
                    NotificationService.create_notification(
                        db=db,
                        user_id=appointment.medical_record.user_id,
                        notification_type=NotificationType.APPOINTMENT_REMINDER,
                        message=message,
                        related_id=appointment.id,
                        related_type="appointment",
                        delivery_method=NotificationDeliveryMethod.IN_APP,
                    )
                    
                    notifications_created += 1
                    logger.info(f"Notificación de cita creada: {message}")
                    
                except Exception as e:
                    logger.error(f"Error procesando recordatorio de cita {reminder.id}: {e}")
                    continue
            
            return notifications_created
            
        except Exception as e:
            logger.error(f"Error en check_appointment_reminders: {e}")
            return 0

    @staticmethod
    def run_once() -> dict:
        """
        Ejecutar ambas verificaciones una sola vez.
        
        Útil para testing y llamadas manuales.
        
        Returns:
            Diccionario con cantidad de notificaciones creadas
        """
        db = SessionLocal()
        try:
            med_notifs = SchedulerService.check_medication_reminders(db)
            appt_notifs = SchedulerService.check_appointment_reminders(db)
            
            return {
                "medication_notifications": med_notifs,
                "appointment_notifications": appt_notifs,
                "total": med_notifs + appt_notifs,
            }
        finally:
            db.close()

    @staticmethod
    def start_scheduler():
        """
        Iniciar el scheduler de APScheduler.
        
        Se ejecutará cada minuto para verificar recordatorios.
        
        Esta función debería ser llamada al iniciar la aplicación.
        """
        try:
            from apscheduler.schedulers.background import BackgroundScheduler
            from apscheduler.triggers.cron import CronTrigger
            
            scheduler = BackgroundScheduler()
            
            # Ejecutar cada minuto
            trigger = CronTrigger(second=0)  # En el segundo 0 de cada minuto
            scheduler.add_job(
                SchedulerService.run_once,
                trigger,
                id='check_reminders',
                name='Check medication and appointment reminders',
                replace_existing=True,
            )
            
            scheduler.start()
            logger.info("Scheduler iniciado - verificará recordatorios cada minuto")
            
            return scheduler
            
        except ImportError:
            logger.error("APScheduler no está instalado. Instala con: pip install apscheduler")
            return None
        except Exception as e:
            logger.error(f"Error al iniciar scheduler: {e}")
            return None
