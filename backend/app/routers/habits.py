from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.habits import Habit
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.schemas.habits_schema import HabitCreate, HabitResponse, HabitUpdate

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


@router.post("/{user_id}", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(user_id: int, payload: HabitCreate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    if db.query(Habit).filter(Habit.medical_record_id == medical_record.id).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Los habitos ya estan registrados para este usuario")

    record = Habit(medical_record_id=medical_record.id, **payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{user_id}", response_model=HabitResponse)
def get_habit(user_id: int, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = db.query(Habit).filter(Habit.medical_record_id == medical_record.id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay habitos registrados para este usuario")
    return record


@router.put("/{user_id}", response_model=HabitResponse)
def update_habit(user_id: int, payload: HabitUpdate, db: Session = Depends(get_db)):
    medical_record = get_medical_record_or_404(user_id, db)

    record = db.query(Habit).filter(Habit.medical_record_id == medical_record.id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay habitos registrados para este usuario")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record
