import base64
import io
import os
import secrets

import qrcode
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import not_found
from app.database import SessionLocal
from app.models.emergency_contact import EmergencyContact
from app.models.medical_history import MedicalHistory
from app.models.medical_record import MedicalRecord
from app.models.medications import Medication
from app.models.user import User
from app.schemas.qr_schema import EmergencyContactPublic, EmergencyPublicResponse, QRResponse
from app.utils.dependencies import get_current_user

router = APIRouter()

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_qr_token(medical_record: MedicalRecord, db: Session) -> str:
    """Genera y persiste un qr_token si la ficha aun no tiene uno."""
    if not medical_record.qr_token:
        medical_record.qr_token = secrets.token_hex(16)
        db.commit()
        db.refresh(medical_record)
    return medical_record.qr_token


def _generate_qr_image_base64(url: str) -> str:
    """Genera un QR PNG en memoria y lo devuelve como base64."""
    img = qrcode.make(url)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


@router.get("/my-qr", response_model=QRResponse)
def get_my_qr(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obtiene (o genera) el QR medico del usuario autenticado."""
    medical_record = (
        db.query(MedicalRecord).filter(MedicalRecord.user_id == current_user.id).first()
    )
    if not medical_record:
        raise not_found("Ficha medica no encontrada para este usuario")

    token = _ensure_qr_token(medical_record, db)
    url = f"{BASE_URL}/emergency/{token}"
    return QRResponse(
        qr_token=token,
        url=url,
        qr_image_base64=_generate_qr_image_base64(url),
    )


@router.get("/emergency/{qr_token}", response_model=EmergencyPublicResponse)
def get_emergency_data(qr_token: str, db: Session = Depends(get_db)):
    """Endpoint publico — devuelve informacion critica del paciente via token QR."""
    medical_record = (
        db.query(MedicalRecord).filter(MedicalRecord.qr_token == qr_token).first()
    )
    if not medical_record:
        raise not_found("Informacion de emergencia no encontrada")

    user: User = medical_record.user
    history: MedicalHistory | None = medical_record.medical_history

    medicaciones_activas = [
        med.nombre
        for med in db.query(Medication).filter(
            Medication.medical_record_id == medical_record.id,
            Medication.activo.is_(True),
        ).all()
    ]

    contactos = [
        EmergencyContactPublic(
            nombre=c.nombre,
            telefono=c.telefono,
            relacion=c.relacion,
        )
        for c in db.query(EmergencyContact)
        .filter(EmergencyContact.medical_record_id == medical_record.id)
        .all()
    ]

    return EmergencyPublicResponse(
        nombre=user.nombre,
        apellido=user.apellido,
        tipo_sangre=history.tipo_sangre if history else None,
        alergias=history.alergias if history else None,
        enfermedades_cronicas=history.enfermedades_cronicas if history else None,
        medicaciones_activas=medicaciones_activas,
        contactos_emergencia=contactos,
    )
