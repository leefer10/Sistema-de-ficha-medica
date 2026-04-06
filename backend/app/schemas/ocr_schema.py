from typing import Optional, List
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


class OcrMedicationItem(BaseModel):
    nombre: str
    dosis: Optional[str] = None
    frecuencia: Optional[str] = None
    motivo: Optional[str] = None


class OcrVaccineItem(BaseModel):
    nombre: str
    fecha_aplicacion: Optional[str] = None
    numero_dosis: Optional[int] = None
    lote: Optional[str] = None


class OcrSurgeryItem(BaseModel):
    nombre_procedimiento: str
    fecha: Optional[str] = None
    motivo: Optional[str] = None


class OcrSaveRequest(BaseModel):
    """
    Datos confirmados por el usuario para guardar en la base de datos.
    """
    user_id: int
    
    # Datos del usuario (para actualizar si existen)
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    
    # Datos personales
    fecha_nacimiento: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    ocupacion: Optional[str] = None
    
    # Historial medico
    alergias: Optional[str] = None
    antecedentes_patologicos_personales: Optional[str] = None
    antecedentes_familiares: Optional[str] = None
    
    # Listas estructuradas (ya parseadas por el frontend)
    medicaciones: List[OcrMedicationItem] = []
    vacunas: List[OcrVaccineItem] = []
    antecedentes_quirurgicos: List[OcrSurgeryItem] = []
    
    # Contacto de emergencia
    contacto_emergencia: Optional[OcrEmergencyContact] = None


class OcrSaveResponse(BaseModel):
    """
    Respuesta después de guardar los datos del OCR.
    """
    success: bool
    message: str
    medical_record_id: Optional[int] = None
    user_id: int
