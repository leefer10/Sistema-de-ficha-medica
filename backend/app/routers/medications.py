from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medical_record import MedicalRecord
from app.models.medications import Medication
from app.models.user import User
from app.schemas.medications_schema import (
    MedicationCreate,
    MedicationResponse,
    MedicationUpdate,
    MedicationConsumeRequest,
)
from app.services.medication_service import MedicationService

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_or_404(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    return user


def get_medical_record_or_404(user_id: int, db: Session) -> MedicalRecord:
    get_user_or_404(user_id, db)
    record = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ficha medica no encontrada para este usuario")
    return record


def get_medication_or_404(medication_id: int, medical_record_id: int, db: Session) -> Medication:
    record = db.query(Medication).filter(
        Medication.id == medication_id,
        Medication.medical_record_id == medical_record_id,
    ).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medicamento no encontrado")
    return record


@router.post("/{user_id}", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(user_id: int, payload: MedicationCreate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = Medication(medical_record_id=medical_record.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{user_id}", response_model=List[MedicationResponse])
def list_medications(user_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return db.query(Medication).filter(Medication.medical_record_id == medical_record.id).all()


@router.get("/{user_id}/{medication_id}", response_model=MedicationResponse)
def get_medication(user_id: int, medication_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return get_medication_or_404(medication_id, medical_record.id, db)


@router.put("/{user_id}/{medication_id}", response_model=MedicationResponse)
def update_medication(user_id: int, medication_id: int, payload: MedicationUpdate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    record = get_medication_or_404(medication_id, medical_record.id, db)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{user_id}/{medication_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(user_id: int, medication_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    record = get_medication_or_404(medication_id, medical_record.id, db)

    db.delete(record)
    db.commit()


@router.post("/{user_id}/{medication_id}/consume", response_model=MedicationResponse)
def consume_medication(
    user_id: int,
    medication_id: int,
    payload: MedicationConsumeRequest,
    db: Session = Depends(get_db),
):
    """
    Registrar consumo de un medicamento.
    
    - **quantity_to_consume**: Cantidad a consumir del medicamento
    - Si cantidad_consumida >= cantidad_prescrita, se marca como finalizado (activo=False)
    """
    medical_record = get_medical_record_or_404(user_id, db)
    medication = MedicationService.consume_medication(
        db=db,
        medication_id=medication_id,
        medical_record_id=medical_record.id,
        quantity_to_consume=payload.quantity_to_consume,
    )
    return medication


@router.get("/{user_id}/active", response_model=List[MedicationResponse])
def list_active_medications(user_id: int, db: Session = Depends(get_db)):
    """
    Obtener lista de medicamentos activos.
    
    Devuelve medicamentos donde cantidad_consumida < cantidad_prescrita
    """
    medical_record = get_medical_record_or_404(user_id, db)
    medications = MedicationService.get_active_medications(
        db=db,
        medical_record_id=medical_record.id,
    )
    return medications


@router.get("/{user_id}/finished", response_model=List[MedicationResponse])
def list_finished_medications(user_id: int, db: Session = Depends(get_db)):
    """
    Obtener lista de medicamentos finalizados.
    
    Devuelve medicamentos donde cantidad_consumida >= cantidad_prescrita
    """
    medical_record = get_medical_record_or_404(user_id, db)
    medications = MedicationService.get_finished_medications(
        db=db,
        medical_record_id=medical_record.id,
    )
    return medications
