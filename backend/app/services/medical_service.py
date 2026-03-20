import secrets

from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.medical_record import MedicalRecord
from app.models.user import User


def get_user_or_404(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise not_found("Usuario no encontrado")
    return user


def get_medical_record_or_404(user_id: int, db: Session) -> MedicalRecord:
    get_user_or_404(user_id, db)
    medical_record = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
    if not medical_record:
        raise not_found("Ficha medica no encontrada para este usuario")
    return medical_record


def create_medical_record_for_user(user_id: int, db: Session) -> MedicalRecord:
    existing = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
    if existing:
        return existing

    medical_record = MedicalRecord(
        user_id=user_id,
        numero_expediente=f"EXP-{user_id:06d}",
        estado="activa",
        qr_token=secrets.token_hex(16),
    )
    db.add(medical_record)
    db.commit()
    db.refresh(medical_record)
    return medical_record
