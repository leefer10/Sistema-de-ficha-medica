from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import SessionLocal
from app.models.user import User
from app.schemas.manager_schema import ManagerMedicalResponse
from app.services.manager_service import build_medical_summary, get_user_with_medical_data_or_404
from app.utils.dependencies import get_current_user

router = APIRouter()


class OnboardingStatus(BaseModel):
    phase_1_complete: bool
    phase_2_complete: bool
    phase_3_complete: bool
    all_complete: bool


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
    try:
        user, medical_record = get_user_with_medical_data_or_404(current_user.id, db)
        return build_medical_summary(user, medical_record)
    except Exception as e:
        # Log del error para debugging
        print(f"Error en /me/medical: {str(e)}")
        raise


@router.get("/me/onboarding", response_model=OnboardingStatus)
def get_onboarding_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current onboarding status for the user"""
    user = db.query(User).filter(User.id == current_user.id).first()
    return OnboardingStatus(
        phase_1_complete=user.onboarding_phase_1_complete,
        phase_2_complete=user.onboarding_phase_2_complete,
        phase_3_complete=user.onboarding_phase_3_complete,
        all_complete=user.onboarding_phase_1_complete and user.onboarding_phase_2_complete and user.onboarding_phase_3_complete,
    )


@router.post("/me/onboarding/phase/{phase_number}/complete")
def complete_onboarding_phase(
    phase_number: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark an onboarding phase as complete"""
    if phase_number not in [1, 2, 3]:
        raise ValueError("Invalid phase number. Must be 1, 2, or 3")
    
    user = db.query(User).filter(User.id == current_user.id).first()
    
    if phase_number == 1:
        user.onboarding_phase_1_complete = True
    elif phase_number == 2:
        user.onboarding_phase_2_complete = True
    elif phase_number == 3:
        user.onboarding_phase_3_complete = True
    
    db.commit()
    db.refresh(user)
    
    return OnboardingStatus(
        phase_1_complete=user.onboarding_phase_1_complete,
        phase_2_complete=user.onboarding_phase_2_complete,
        phase_3_complete=user.onboarding_phase_3_complete,
        all_complete=user.onboarding_phase_1_complete and user.onboarding_phase_2_complete and user.onboarding_phase_3_complete,
    )


@router.post("/me/onboarding/phase/{phase_number}/reset")
def reset_onboarding_phase(
    phase_number: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Reset (uncomplete) an onboarding phase"""
    if phase_number not in [1, 2, 3]:
        raise ValueError("Invalid phase number. Must be 1, 2, or 3")
    
    user = db.query(User).filter(User.id == current_user.id).first()
    
    if phase_number == 1:
        user.onboarding_phase_1_complete = False
    elif phase_number == 2:
        user.onboarding_phase_2_complete = False
    elif phase_number == 3:
        user.onboarding_phase_3_complete = False
    
    db.commit()
    db.refresh(user)
    
    return OnboardingStatus(
        phase_1_complete=user.onboarding_phase_1_complete,
        phase_2_complete=user.onboarding_phase_2_complete,
        phase_3_complete=user.onboarding_phase_3_complete,
        all_complete=user.onboarding_phase_1_complete and user.onboarding_phase_2_complete and user.onboarding_phase_3_complete,
    )
