import logging

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.schemas.ocr_schema import OcrScanResponse, OcrSaveRequest, OcrSaveResponse
from app.services.ocr_service import procesar_ficha_medica
from app.services.ocr_save_service import guardar_datos_ocr
from app.database import SessionLocal

logger = logging.getLogger("uvicorn.error")

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

TIPOS_IMAGEN_PERMITIDOS = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}
TAMANO_MAXIMO_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post(
    "/scan",
    response_model=OcrScanResponse,
    status_code=status.HTTP_200_OK,
    summary="Escanear ficha médica con OCR",
    description=(
        "Recibe una foto de una ficha médica (tomada desde celular o PC), "
        "extrae el texto con Google Cloud Vision y devuelve los campos "
        "pre-rellenados como preview para que el usuario confirme antes de guardar."
    ),
)
async def scan_ficha_medica(
    imagen: UploadFile = File(..., description="Foto de la ficha médica (JPG, PNG, WEBP)"),
):
    # Validar tipo de archivo
    if imagen.content_type not in TIPOS_IMAGEN_PERMITIDOS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Tipo de archivo no permitido: {imagen.content_type}. Use JPG, PNG o WEBP.",
        )

    # Leer y validar tamaño
    imagen_bytes = await imagen.read()
    if len(imagen_bytes) > TAMANO_MAXIMO_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="La imagen supera el tamaño máximo de 10 MB.",
        )

    try:
        resultado = procesar_ficha_medica(imagen_bytes)
    except EnvironmentError as e:
        logger.error("Configuracion OCR faltante: %s", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="El servicio OCR no está configurado. Contacte al administrador.",
        )
    except Exception as e:
        logger.exception("Error al procesar la ficha medica: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar la imagen. Intente con una foto más clara.",
        )

    return resultado


@router.post(
    "/save",
    response_model=OcrSaveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Guardar datos del OCR",
    description=(
        "Recibe los datos extraidos y confirmados por el usuario, "
        "y los guarda en la base de datos. Actualiza PersonalData, MedicalRecord, "
        "MedicalHistory, Medicaciones, Vacunas, Cirugías y Contactos de Emergencia."
    ),
)
async def save_ocr_data(
    request: OcrSaveRequest,
    db: Session = Depends(get_db),
):
    """
    Endpoint para guardar datos extraidos del OCR en la base de datos.
    
    El frontend debe:
    1. Parsear los datos del preview (OcrScanResponse)
    2. Permitir que el usuario edite/confirme los datos
    3. Enviar un OcrSaveRequest con los datos confirmados
    """
    try:
        resultado = guardar_datos_ocr(db, request)
        
        if resultado.success:
            return resultado
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=resultado.message,
            )
            
    except Exception as e:
        logger.exception("Error al guardar datos del OCR: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al guardar los datos del OCR.",
        )

