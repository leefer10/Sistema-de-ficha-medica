"""Servicio de negocio para citas médicas."""

from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.appointments import Appointment, AppointmentStatus
from app.models.medical_record import MedicalRecord


class AppointmentService:
    """Servicio de negocio para citas médicas."""

    @staticmethod
    def validate_future_datetime(date_str: str, time_str: str) -> None:
        """
        Validar que la fecha y hora sean en el futuro.
        
        Args:
            date_str: Fecha en formato YYYY-MM-DD
            time_str: Hora en formato HH:MM
            
        Raises:
            HTTPException: Si la fecha/hora no es en el futuro
        """
        try:
            date_time = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de fecha (YYYY-MM-DD) u hora (HH:MM) inválido"
            )
        
        if date_time <= datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cita debe ser en una fecha y hora futura"
            )

    @staticmethod
    def validate_date_format(date_str: str) -> None:
        """Validar formato de fecha YYYY-MM-DD."""
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de fecha inválido. Debe ser YYYY-MM-DD"
            )

    @staticmethod
    def validate_time_format(time_str: str) -> None:
        """Validar formato de hora HH:MM."""
        try:
            datetime.strptime(time_str, "%H:%M")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de hora inválido. Debe ser HH:MM"
            )

    @staticmethod
    def create_appointment(
        db: Session,
        medical_record_id: int,
        doctor_name: str,
        appointment_type: str,
        appointment_date: str,
        appointment_time: str,
        location: str,
        notes: str,
    ) -> Appointment:
        """
        Crear una nueva cita.
        
        Args:
            db: Sesión de base de datos
            medical_record_id: ID de la ficha médica
            doctor_name: Nombre del doctor
            appointment_type: Tipo de cita
            appointment_date: Fecha en formato YYYY-MM-DD
            appointment_time: Hora en formato HH:MM
            location: Ubicación
            notes: Notas adicionales
            
        Returns:
            Cita creada
            
        Raises:
            HTTPException: Si la fecha/hora es inválida o en el pasado
        """
        # Validar formatos
        AppointmentService.validate_date_format(appointment_date)
        AppointmentService.validate_time_format(appointment_time)
        
        # Validar que sea fecha futura
        AppointmentService.validate_future_datetime(appointment_date, appointment_time)
        
        # Crear cita
        appointment = Appointment(
            medical_record_id=medical_record_id,
            doctor_name=doctor_name,
            appointment_type=appointment_type,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            location=location,
            notes=notes,
            status=AppointmentStatus.PROGRAMADA,
        )
        
        db.add(appointment)
        db.commit()
        db.refresh(appointment)
        
        return appointment

    @staticmethod
    def update_appointment(
        db: Session,
        appointment: Appointment,
        doctor_name: str = None,
        appointment_type: str = None,
        appointment_date: str = None,
        appointment_time: str = None,
        location: str = None,
        notes: str = None,
    ) -> Appointment:
        """
        Actualizar una cita.
        
        Args:
            db: Sesión de base de datos
            appointment: Cita a actualizar
            doctor_name: Nuevo nombre del doctor
            appointment_type: Nuevo tipo de cita
            appointment_date: Nueva fecha
            appointment_time: Nueva hora
            location: Nueva ubicación
            notes: Nuevas notas
            
        Returns:
            Cita actualizada
            
        Raises:
            HTTPException: Si la cita está completada/cancelada o fecha inválida
        """
        # No permitir editar si está completada o cancelada
        if appointment.status in [AppointmentStatus.COMPLETADA, AppointmentStatus.CANCELADA]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No se puede editar una cita con estado '{appointment.status}'"
            )
        
        # Actualizar campos
        if doctor_name:
            appointment.doctor_name = doctor_name
        if appointment_type is not None:
            appointment.appointment_type = appointment_type
        if appointment_date:
            AppointmentService.validate_date_format(appointment_date)
            appointment.appointment_date = appointment_date
        if appointment_time:
            AppointmentService.validate_time_format(appointment_time)
            appointment.appointment_time = appointment_time
        if location is not None:
            appointment.location = location
        if notes is not None:
            appointment.notes = notes
        
        # Validar fecha/hora si ambas fueron actualizadas o si una fue actualizada
        if appointment_date or appointment_time:
            date = appointment_date or appointment.appointment_date
            time = appointment_time or appointment.appointment_time
            AppointmentService.validate_future_datetime(date, time)
        
        db.commit()
        db.refresh(appointment)
        
        return appointment

    @staticmethod
    def change_appointment_status(
        db: Session,
        appointment: Appointment,
        new_status: str,
    ) -> Appointment:
        """
        Cambiar el estado de una cita.
        
        Args:
            db: Sesión de base de datos
            appointment: Cita a actualizar
            new_status: Nuevo estado
            
        Returns:
            Cita con estado actualizado
            
        Raises:
            HTTPException: Si el estado es inválido
        """
        valid_statuses = [
            AppointmentStatus.PROGRAMADA,
            AppointmentStatus.COMPLETADA,
            AppointmentStatus.CANCELADA,
        ]
        
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}"
            )
        
        appointment.status = new_status
        db.commit()
        db.refresh(appointment)
        
        return appointment

    @staticmethod
    def get_appointments_by_medical_record(
        db: Session,
        medical_record_id: int,
        status: str = None,
    ) -> list[Appointment]:
        """
        Obtener citas de una ficha médica.
        
        Args:
            db: Sesión de base de datos
            medical_record_id: ID de la ficha médica
            status: Filtro opcional por estado
            
        Returns:
            Lista de citas
            
        Raises:
            HTTPException: Si el estado es inválido
        """
        query = db.query(Appointment).filter(
            Appointment.medical_record_id == medical_record_id
        )
        
        if status:
            valid_statuses = [
                AppointmentStatus.PROGRAMADA,
                AppointmentStatus.COMPLETADA,
                AppointmentStatus.CANCELADA,
            ]
            if status not in valid_statuses:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}"
                )
            query = query.filter(Appointment.status == status)
        
        return query.all()
