from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medical_record import MedicalRecord
from app.models.surgeries import Surgery
from app.models.user import User
from app.schemas.surgeries_schema import SurgeryCreate, SurgeryResponse, SurgeryUpdate

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


def get_surgery_or_404(surgery_id: int, medical_record_id: int, db: Session) -> Surgery:
    record = db.query(Surgery).filter(
        Surgery.id == surgery_id,
        Surgery.medical_record_id == medical_record_id,
    ).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cirugia no encontrada")
    return record


@router.post("/{user_id}", response_model=SurgeryResponse, status_code=status.HTTP_201_CREATED)
def create_surgery(user_id: int, payload: SurgeryCreate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = Surgery(medical_record_id=medical_record.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{user_id}", response_model=List[SurgeryResponse])
def list_surgeries(user_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return db.query(Surgery).filter(Surgery.medical_record_id == medical_record.id).all()


@router.get("/{user_id}/{surgery_id}", response_model=SurgeryResponse)
def get_surgery(user_id: int, surgery_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return get_surgery_or_404(surgery_id, medical_record.id, db)


@router.put("/{user_id}/{surgery_id}", response_model=SurgeryResponse)
def update_surgery(user_id: int, surgery_id: int, payload: SurgeryUpdate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    record = get_surgery_or_404(surgery_id, medical_record.id, db)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{user_id}/{surgery_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_surgery(user_id: int, surgery_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    record = get_surgery_or_404(surgery_id, medical_record.id, db)

    db.delete(record)
    db.commit()
