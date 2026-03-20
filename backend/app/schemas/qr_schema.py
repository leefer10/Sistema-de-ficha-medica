from typing import List, Optional

from pydantic import BaseModel


class EmergencyContactPublic(BaseModel):
    nombre: str
    telefono: str
    relacion: str


class EmergencyPublicResponse(BaseModel):
    """Informacion critica del paciente expuesta via QR — sin datos sensibles."""

    nombre: str
    apellido: str
    tipo_sangre: Optional[str] = None
    alergias: Optional[str] = None
    enfermedades_cronicas: Optional[str] = None
    medicaciones_activas: List[str] = []
    contactos_emergencia: List[EmergencyContactPublic] = []


class QRResponse(BaseModel):
    qr_token: str
    url: str
    qr_image_base64: str
