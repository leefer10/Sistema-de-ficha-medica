from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.emergency_contact import EmergencyContact
from app.schemas.emergency_contact_schema import (
    EmergencyContactCreate,
    EmergencyContactResponse,
    EmergencyContactUpdate,
)
from app.services.medical_service import get_medical_record_or_404
from app.core.exceptions import not_found

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_contact_or_404(contact_id: int, medical_record_id: int, db: Session) -> EmergencyContact:
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.medical_record_id == medical_record_id,
    ).first()
    if not contact:
        raise not_found("Contacto de emergencia no encontrado")
    return contact


@router.post("/{user_id}", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED)
def create_emergency_contact(user_id: int, payload: EmergencyContactCreate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    contact = EmergencyContact(medical_record_id=medical_record.id, **payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/{user_id}", response_model=List[EmergencyContactResponse])
def list_emergency_contacts(user_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return (
        db.query(EmergencyContact)
        .filter(EmergencyContact.medical_record_id == medical_record.id)
        .all()
    )


@router.get("/{user_id}/{contact_id}", response_model=EmergencyContactResponse)
def get_emergency_contact(user_id: int, contact_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    return get_contact_or_404(contact_id, medical_record.id, db)


@router.put("/{user_id}/{contact_id}", response_model=EmergencyContactResponse)
def update_emergency_contact(
    user_id: int,
    contact_id: int,
    payload: EmergencyContactUpdate,
    db: Session = Depends(get_db),
):
    medical_record = get_medical_record_or_404(user_id, db)
    contact = get_contact_or_404(contact_id, medical_record.id, db)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)

    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{user_id}/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_emergency_contact(user_id: int, contact_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)
    contact = get_contact_or_404(contact_id, medical_record.id, db)
    db.delete(contact)
    db.commit()
