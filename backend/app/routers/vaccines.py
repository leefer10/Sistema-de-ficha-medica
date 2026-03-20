from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.models.vaccines import Vaccine
from app.schemas.vaccines_schema import VaccineCreate, VaccineResponse, VaccineUpdate

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


def get_vaccine_or_404(vaccine_id: int, medical_record_id: int, db: Session) -> Vaccine:
    record = db.query(Vaccine).filter(
        Vaccine.id == vaccine_id,
        Vaccine.medical_record_id == medical_record_id,
    ).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vacuna no encontrada")
    return record


@router.post("/{user_id}", response_model=VaccineResponse, status_code=status.HTTP_201_CREATED)
def create_vaccine(user_id: int, payload: VaccineCreate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = Vaccine(medical_record_id=medical_record.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{user_id}", response_model=List[VaccineResponse])
def list_vaccines(user_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return db.query(Vaccine).filter(Vaccine.medical_record_id == medical_record.id).all()


@router.get("/{user_id}/{vaccine_id}", response_model=VaccineResponse)
def get_vaccine(user_id: int, vaccine_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return get_vaccine_or_404(vaccine_id, medical_record.id, db)


@router.put("/{user_id}/{vaccine_id}", response_model=VaccineResponse)
def update_vaccine(user_id: int, vaccine_id: int, payload: VaccineUpdate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    record = get_vaccine_or_404(vaccine_id, medical_record.id, db)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{user_id}/{vaccine_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vaccine(user_id: int, vaccine_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    record = get_vaccine_or_404(vaccine_id, medical_record.id, db)

    db.delete(record)
    db.commit()
