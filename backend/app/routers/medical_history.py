from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medical_record import MedicalRecord
from app.models.medical_history import MedicalHistory
from app.models.user import User
from app.schemas.medical_history_schema import (
    MedicalHistoryCreate,
    MedicalHistoryResponse,
    MedicalHistoryUpdate,
)

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


@router.post("/{user_id}", response_model=MedicalHistoryResponse, status_code=status.HTTP_201_CREATED)
def create_medical_history(user_id: int, payload: MedicalHistoryCreate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    if db.query(MedicalHistory).filter(MedicalHistory.medical_record_id == medical_record.id).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El historial clinico ya existe para este usuario")

    record = MedicalHistory(medical_record_id=medical_record.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{user_id}", response_model=MedicalHistoryResponse)
def get_medical_history(user_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = db.query(MedicalHistory).filter(MedicalHistory.medical_record_id == medical_record.id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay historial clinico para este usuario")
    return record


@router.put("/{user_id}", response_model=MedicalHistoryResponse)
def update_medical_history(user_id: int, payload: MedicalHistoryUpdate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = db.query(MedicalHistory).filter(MedicalHistory.medical_record_id == medical_record.id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay historial clinico para este usuario")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record
