from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.models.medical_record import MedicalRecord
from app.models.user import User


def _split_values(value: str | None) -> list[str]:
    if not value:
        return []
    normalized = value.replace(";", ",")
    return [item.strip() for item in normalized.split(",") if item.strip()]


def get_user_with_medical_data_or_404(user_id: int, db: Session) -> tuple[User, MedicalRecord]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise not_found("Usuario no encontrado")

    medical_record = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.user_id == user_id)
        .first()
    )
    if not medical_record:
        raise not_found("Ficha medica no encontrada para este usuario")

    return user, medical_record


def build_medical_summary(user: User, medical_record: MedicalRecord) -> dict:
    history = medical_record.medical_history
    antecedentes = _split_values(history.enfermedades_cronicas) if history else []

    return {
        "usuario": {
            "nombre": user.nombre,
            "apellido": user.apellido,
        },
        "antecedentes": antecedentes,
        "medicaciones": [med.nombre for med in medical_record.medications],
        "vacunas": [vac.nombre for vac in medical_record.vaccines],
        "cirugias": [cir.nombre_procedimiento for cir in medical_record.surgeries],
    }
