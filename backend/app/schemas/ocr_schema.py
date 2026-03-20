from typing import Optional
from pydantic import BaseModel


class OcrEmergencyContact(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    relacion: Optional[str] = None


class OcrScanResponse(BaseModel):
    """
    Preview de los datos extraidos de la ficha medica via OCR.
    El frontend mostrara estos datos al usuario para confirmar antes de guardar.
    """
    # Datos del usuario
    nombre: Optional[str] = None
    apellido: Optional[str] = None

    # Datos personales
    fecha_nacimiento: Optional[str] = None   # string libre, el frontend parsea la fecha
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    ocupacion: Optional[str] = None

    # Historial medico
    alergias: Optional[str] = None
    antecedentes_patologicos_personales: Optional[str] = None
    antecedentes_familiares: Optional[str] = None

    # Listas (pueden venir multiples valores separados por coma)
    medicacion: Optional[str] = None
    vacunas: Optional[str] = None
    antecedentes_quirurgicos: Optional[str] = None

    # Habitos
    habitos: Optional[str] = None

    # Contacto de emergencia
    contacto_emergencia: Optional[OcrEmergencyContact] = None

    # Texto crudo extraido por si el frontend necesita mostrarlo
    texto_crudo: Optional[str] = None

    # Advertencia si la imagen fue de baja calidad o el parseo fue parcial
    advertencia: Optional[str] = None
