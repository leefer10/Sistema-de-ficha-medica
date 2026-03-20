from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.manager_schema import ManagerMedicalResponse
from app.services.manager_service import build_medical_summary, get_user_with_medical_data_or_404
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/me/medical", response_model=ManagerMedicalResponse)
def get_my_medical_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user, medical_record = get_user_with_medical_data_or_404(current_user.id, db)
    return build_medical_summary(user, medical_record)
