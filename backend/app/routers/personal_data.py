from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.exceptions import conflict, not_found
from app.database import SessionLocal
from app.models.personal_data import PersonalData
from app.schemas.personal_data_schema import (
    PersonalDataCreate,
    PersonalDataResponse,
    PersonalDataUpdate,
)
from app.services.medical_service import get_user_or_404

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{user_id}", response_model=PersonalDataResponse, status_code=status.HTTP_201_CREATED)
def create_personal_data(user_id: int, payload: PersonalDataCreate, db: Session = Depends(get_db)):
    get_user_or_404(user_id, db)

    existing = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if existing:
        raise conflict("El usuario ya tiene datos personales registrados")

    personal_data = PersonalData(user_id=user_id, **payload.model_dump())
    db.add(personal_data)
    db.commit()
    db.refresh(personal_data)
    return personal_data


@router.get("/{user_id}", response_model=PersonalDataResponse)
def get_personal_data(user_id: int, db: Session = Depends(get_db)):
    get_user_or_404(user_id, db)

    personal_data = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if not personal_data:
        raise not_found("No hay datos personales para este usuario")

    return personal_data


@router.put("/{user_id}", response_model=PersonalDataResponse)
def update_personal_data(user_id: int, payload: PersonalDataUpdate, db: Session = Depends(get_db)):
    get_user_or_404(user_id, db)

    personal_data = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if not personal_data:
        raise not_found("No hay datos personales para este usuario")

    update_values = payload.model_dump(exclude_unset=True)
    for key, value in update_values.items():
        setattr(personal_data, key, value)

    db.commit()
    db.refresh(personal_data)
    return personal_data
