from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import UserRole
from app.schemas.manager_schema import ManagerMedicalResponse
from app.services.manager_service import build_medical_summary, get_user_with_medical_data_or_404
from app.utils.dependencies import require_role

router = APIRouter(dependencies=[Depends(require_role(UserRole.manager))])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/users/{user_id}/medical", response_model=ManagerMedicalResponse)
def manager_get_user_medical(user_id: int, db: Session = Depends(get_db)):
    user, medical_record = get_user_with_medical_data_or_404(user_id, db)
    return build_medical_summary(user, medical_record)
