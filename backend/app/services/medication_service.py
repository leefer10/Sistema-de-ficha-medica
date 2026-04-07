"""Servicio de negocio para gestión de medicamentos."""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.medications import Medication
from app.models.medical_record import MedicalRecord


class MedicationService:
    """Servicio de negocio para medicamentos."""

    @staticmethod
    def consume_medication(
        db: Session,
        medication_id: int,
        medical_record_id: int,
        quantity_to_consume: int,
    ) -> Medication:
        """
        Registrar consumo de medicamento.
        
        Args:
            db: Sesión de base de datos
            medication_id: ID del medicamento
            medical_record_id: ID de la ficha médica
            quantity_to_consume: Cantidad a consumir
            
        Returns:
            Medicamento actualizado
            
        Raises:
            HTTPException: Si el medicamento no existe o la cantidad es inválida
        """
        # Obtener medicamento
        medication = db.query(Medication).filter(
            Medication.id == medication_id,
            Medication.medical_record_id == medical_record_id,
        ).first()
        
        if not medication:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medicamento no encontrado"
            )
        
        if not medication.quantity_prescribed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este medicamento no tiene cantidad prescrita definida"
            )
        
        # Validar cantidad
        current_consumed = medication.quantity_consumed or 0
        remaining = medication.quantity_prescribed - current_consumed
        
        if quantity_to_consume > remaining:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cantidad inválida. Quedan {remaining} unidades disponibles"
            )
        
        # Actualizar cantidad consumida
        medication.quantity_consumed = current_consumed + quantity_to_consume
        
        # Si se acabó el medicamento, marcarlo como finalizado
        if medication.quantity_consumed >= medication.quantity_prescribed:
            medication.activo = False
        
        db.commit()
        db.refresh(medication)
        
        return medication

    @staticmethod
    def get_active_medications(
        db: Session,
        medical_record_id: int,
    ) -> list[Medication]:
        """
        Obtener medicamentos activos (cantidad consumida < prescrita).
        
        Args:
            db: Sesión de base de datos
            medical_record_id: ID de la ficha médica
            
        Returns:
            Lista de medicamentos activos
        """
        medications = db.query(Medication).filter(
            Medication.medical_record_id == medical_record_id,
            Medication.activo == True,
        ).all()
        
        # Filtrar solo los que tienen cantidad prescrita y no están finalizados
        active = [
            med for med in medications
            if med.quantity_prescribed and 
            (med.quantity_consumed or 0) < med.quantity_prescribed
        ]
        
        return active

    @staticmethod
    def get_finished_medications(
        db: Session,
        medical_record_id: int,
    ) -> list[Medication]:
        """
        Obtener medicamentos finalizados (cantidad consumida >= prescrita).
        
        Args:
            db: Sesión de base de datos
            medical_record_id: ID de la ficha médica
            
        Returns:
            Lista de medicamentos finalizados
        """
        medications = db.query(Medication).filter(
            Medication.medical_record_id == medical_record_id,
        ).all()
        
        # Filtrar solo los que están finalizados
        finished = [
            med for med in medications
            if med.quantity_prescribed and 
            (med.quantity_consumed or 0) >= med.quantity_prescribed
        ]
        
        return finished

    @staticmethod
    def validate_quantity_prescribed(quantity: int) -> None:
        """
        Validar que la cantidad prescrita sea válida.
        
        Args:
            quantity: Cantidad prescrita
            
        Raises:
            HTTPException: Si la cantidad es inválida
        """
        if quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La cantidad prescrita debe ser mayor a 0"
            )
