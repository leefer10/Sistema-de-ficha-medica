import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.ocr_schema import OcrScanResponse
from app.services.ocr_service import procesar_ficha_medica

logger = logging.getLogger("uvicorn.error")

router = APIRouter()

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
