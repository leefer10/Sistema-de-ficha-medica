import io
import os
import re
import logging
from typing import Optional

from PIL import Image, ImageEnhance, ImageFilter
from google.cloud import vision

from app.schemas.ocr_schema import OcrScanResponse, OcrEmergencyContact

logger = logging.getLogger("uvicorn.error")


# ---------------------------------------------------------------------------
# Preprocesamiento de imagen
# ---------------------------------------------------------------------------

def _preprocesar_imagen(imagen_bytes: bytes) -> bytes:
    """
    Mejora la imagen antes de enviarla a Google Vision:
    - Convierte a escala de grises
    - Aumenta contraste
    - Aplica nitidez
    Esto mejora la precision del OCR en fotos tomadas con celular.
    """
    img = Image.open(io.BytesIO(imagen_bytes)).convert("RGB")

    # Redimensionar si es muy grande (reduce costo y tiempo)
    max_size = 3072
    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.LANCZOS)

    # Mejorar contraste (moderado, no agresivo)
    img = ImageEnhance.Contrast(img).enhance(1.5)

    # Mejorar nitidez (SHARPEN es más equilibrado que EDGE_ENHANCE)
    img = img.filter(ImageFilter.SHARPEN)

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=90)
    return buffer.getvalue()


# ---------------------------------------------------------------------------
# Google Vision OCR
# ---------------------------------------------------------------------------

def _extraer_texto_vision(imagen_bytes: bytes) -> str:
    """Llama a Google Cloud Vision API y devuelve el texto completo detectado."""
    import json
    from google.oauth2 import service_account
    
    # OPCIÓN 1: Usar archivo de credenciales local (desarrollo)
    credentials_file = os.path.join(os.path.dirname(__file__), "..", "..", "sistema-salud-ficha-490600-68f541889983.json")
    if os.path.exists(credentials_file):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_file
        logger.info(f"Usando credenciales desde archivo: {credentials_file}")
    else:
        # OPCIÓN 2: Usar JSON desde variable de entorno (producción en Railway)
        credentials_json = os.environ.get("GOOGLE_CREDENTIALS_JSON")
        if credentials_json:
            try:
                # Guardar JSON temporalmente para que Google Cloud SDK lo encuentre
                temp_credentials_path = "/tmp/google-credentials.json"
                with open(temp_credentials_path, "w") as f:
                    f.write(credentials_json)
                os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_credentials_path
                logger.info("Usando credenciales desde variable de entorno GOOGLE_CREDENTIALS_JSON")
            except Exception as e:
                logger.error(f"Error al configurar credenciales desde env var: {e}")
        else:
            # OPCIÓN 3: Usar GOOGLE_APPLICATION_CREDENTIALS si está configurada
            if "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
                logger.warning("No se encontraron credenciales de Google Cloud. Configure GOOGLE_CREDENTIALS_JSON o GOOGLE_APPLICATION_CREDENTIALS")
    
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=imagen_bytes)
    response = client.document_text_detection(image=image)

    if response.error.message:
        raise RuntimeError(f"Google Vision API error: {response.error.message}")

    return response.full_text_annotation.text if response.full_text_annotation else ""


# ---------------------------------------------------------------------------
# Parseo de campos de la ficha medica
# ---------------------------------------------------------------------------

def _es_linea_etiqueta(linea: str) -> bool:
    """
    Detecta si una línea es una ETIQUETA o un VALOR.
    Una etiqueta contiene palabras clave específicas de fichas médicas.
    """
    # Palabras clave que definen una etiqueta
    palabras_clave_etiqueta = [
        "ANTECEDENTES", "PATOLOGICOS", "PERSONALES", "FAMILIARES", "QUIRURGICOS",
        "MEDICACION", "MEDICAMENTOS", "HABITOS", "VACUNAS", "ALERGIAS", 
        "OCUPACION", "DIRECCION", "TELEFONO", "FECHA", "NACIMIENTO",
        "EMERGENCIA", "PARENTEZCO", "EDAD", "NOMBRES", "APELLIDOS",
        "REFERENCIA", "CASO", "LLAMAR"
    ]
    
    linea_upper = linea.upper()
    
    # Si la línea contiene una palabra clave + ":", es una etiqueta
    for palabra in palabras_clave_etiqueta:
        if palabra in linea_upper and ":" in linea:
            return True
    
    return False


def _extraer_campo(texto: str, etiquetas: list[str], detener_en: list[str] = None, multilinea: bool = False) -> Optional[str]:
    """
    Busca una o varias etiquetas en el texto y devuelve el valor que las sigue.
    Para campos de una línea: respeta el orden línea por línea, detecta etiquetas por palabras clave
    Para campos multilinea: captura líneas hasta encontrar un valor (no etiqueta)
    
    Args:
        texto: Texto completo extraído del OCR
        etiquetas: Lista de etiquetas a buscar (en orden de preferencia)
        detener_en: Lista de etiquetas donde debe detenerse la extracción
        multilinea: Si True, busca en múltiples líneas. Si False, solo primera línea.
    """
    if not multilinea:
        # MODO UNA LÍNEA: respeta el orden línea por línea, detecta etiquetas por palabras clave
        lineas = texto.split('\n')
        for i, linea in enumerate(lineas):
            for etiqueta in etiquetas:
                # Buscar la etiqueta al inicio de la línea (case insensitive)
                patron = re.compile(rf"^{re.escape(etiqueta)}\s*[:\.]?\s*(.*)$", re.IGNORECASE)
                match = patron.match(linea)
                if match:
                    valor = match.group(1).strip()
                    
                    # Si el valor está vacío, hay lógica específica
                    if not valor:
                        # Revisar siguiente línea
                        siguiente_hay = i + 1 < len(lineas)
                        siguiente = lineas[i + 1].strip() if siguiente_hay else ""
                        
                        # Si siguiente tiene ":", es etiqueta
                        if siguiente_hay and ":" in siguiente:
                            # CASO ESPECIAL: Si siguiente es etiqueta VACÍA seguida de un valor, ese valor es nuestro
                            # Primero verificar que siguiente sea una etiqueta vacía (no tiene valor después del :)
                            siguiente_valor = siguiente.split(":", 1)[1].strip() if ":" in siguiente else ""
                            
                            if not siguiente_valor:  # La siguiente etiqueta está vacía
                                # Verificar si siguiente línea después de siguiente tiene contenido sin ":"
                                if i + 2 < len(lineas):
                                    siguiente_siguiente = lineas[i + 2].strip()
                                    # Si siguiente-siguiente no es etiqueta (no tiene :) y no es vacío, pertenece a nosotros
                                    if siguiente_siguiente and not ":" in siguiente_siguiente and not _es_linea_etiqueta(siguiente_siguiente):
                                        # Verificar si siguiente-siguiente-siguiente es etiqueta (para confirmar que siguiente es etiqueta vacía)
                                        if i + 3 < len(lineas):
                                            siguiente_siguiente_siguiente = lineas[i + 3].strip()
                                            if ":" in siguiente_siguiente_siguiente or _es_linea_etiqueta(siguiente_siguiente_siguiente):
                                                # Confirmado: siguiente es etiqueta vacía, siguiente-siguiente es nuestro valor
                                                return siguiente_siguiente
                            # Si no cumple el caso especial, el campo está vacío
                            return None
                        
                        # Si siguiente no tiene ":" pero siguiente-siguiente sí, el siguiente es nuestro valor
                        if siguiente_hay and siguiente and not ":" in siguiente:
                            if i + 2 < len(lineas):
                                siguiente_siguiente = lineas[i + 2].strip()
                                if ":" in siguiente_siguiente or _es_linea_etiqueta(siguiente_siguiente):
                                    # Revisar si hay etiqueta anterior
                                    if i - 1 >= 0:
                                        linea_previa = lineas[i - 1].strip()
                                        if ":" in linea_previa:
                                            # La previa es etiqueta, el valor pertenece a ella
                                            return None
                                    # El valor es nuestro
                                    return siguiente
                            else:
                                # Si no hay más líneas, el siguiente es nuestro
                                return siguiente
                        
                        # Campo está vacío
                        return None
                    
                    # Si hay valor en la misma línea, retornarlo
                    return valor
        return None
    else:
        # MODO MULTILINEA: captura líneas hasta encontrar un valor real (no etiqueta)
        lineas = texto.split('\n')
        for etiqueta in etiquetas:
            # Buscar la etiqueta
            patron_etiqueta = re.compile(rf"^{re.escape(etiqueta)}\s*[:\.]?", re.IGNORECASE | re.MULTILINE)
            match_etiqueta = patron_etiqueta.search(texto)
            
            if match_etiqueta:
                # Encontramos la etiqueta, ahora buscar el siguiente valor (no etiqueta)
                start_pos = match_etiqueta.end()
                resto_texto = texto[start_pos:]
                
                # Dividir el resto en líneas
                lineas_resto = resto_texto.split('\n')
                
                for linea_resto in lineas_resto:
                    linea_limpia = linea_resto.strip()
                    
                    # Si está vacía, continuar
                    if not linea_limpia:
                        continue
                    
                    # Si la línea contiene ":", es etiqueta, saltar
                    if ":" in linea_limpia:
                        continue
                    
                    # Detener si encontramos una etiqueta (por palabras clave)
                    if _es_linea_etiqueta(linea_limpia):
                        continue
                    
                    # Detener si encontramos palabra de parada
                    es_parada = False
                    if detener_en:
                        for parada in detener_en:
                            if parada.lower() in linea_limpia.lower():
                                es_parada = True
                                break
                    
                    if es_parada:
                        continue
                    
                    # Si llegamos aquí, es un valor real, retornarlo
                    if len(linea_limpia) > 1:
                        return linea_limpia
        
        return None


def _parsear_ficha(texto: str) -> OcrScanResponse:
    """Mapea el texto extraido por OCR a los campos del modelo de datos."""

    # Nombres y apellidos (una línea)
    apellidos_raw = _extraer_campo(texto, ["APELLIDOS", "APELLIDO"], multilinea=False)
    nombres_raw = _extraer_campo(texto, ["NOMBRES", "NOMBRE"], multilinea=False)

    # Separar apellidos y nombres si vienen juntos
    apellido = apellidos_raw.strip() if apellidos_raw else None
    nombre = nombres_raw.strip() if nombres_raw else None

    # Datos personales (una línea cada uno)
    fecha_nacimiento = _extraer_campo(texto, ["FECHA DE NACIMIENTO", "FECHA NACIMIENTO", "F. NACIMIENTO"], multilinea=False)
    direccion = _extraer_campo(texto, ["DIRECCION", "DIRECCIÓN"], multilinea=False)
    telefono = _extraer_campo(texto, ["TELEFONO", "TELÉFONO"], multilinea=False)
    ocupacion = _extraer_campo(texto, ["OCUPACION", "OCUPACIÓN"], multilinea=False)

    # Historial medico (una línea cada uno)
    alergias = _extraer_campo(texto, ["ALERGIAS", "ALERGIA"], multilinea=False)
    antecedentes_personales = _extraer_campo(
        texto,
        ["ANTECEDENTES PATOLOGICOS PERSONALES", "ANTECEDENTES PERSONALES", "ANT. PATOLOGICOS PERSONALES"],
        multilinea=True,
    )
    antecedentes_familiares = _extraer_campo(
        texto,
        ["ANTECEDENTES PATOLOGICOS FAMILIARES", "ANTECEDENTES FAMILIARES", "ANT. FAMILIARES"],
        multilinea=True,
    )
    antecedentes_quirurgicos = _extraer_campo(
        texto,
        ["ANTECEDENTES PATOLOGICOS QUIRURGICOS", "ANTECEDENTES QUIRURGICOS", "ANT. QUIRURGICOS"],
        multilinea=True,
    )
    medicacion = _extraer_campo(texto, ["MEDICACION", "MEDICACIÓN", "MEDICAMENTOS"], multilinea=True)
    habitos = _extraer_campo(texto, ["HABITOS", "HÁBITOS"], multilinea=False)
    vacunas = _extraer_campo(texto, ["VACUNAS", "VACUNA"], multilinea=False)

    # Contacto de emergencia (una línea para nombre, multilinea para detalles)
    emergencia_nombre = _extraer_campo(
        texto,
        ["EN CASO DE EMERGENCIA LLAMAR A", "EMERGENCIA LLAMAR A", "CONTACTO DE EMERGENCIA"],
        multilinea=False,
    )
    emergencia_telefono = telefono  # el telefono de emergencia suele estar junto al nombre
    parentesco = _extraer_campo(texto, ["PARENTEZCO", "PARENTESCO"], multilinea=False)

    # Si hay un segundo telefono detectado (patron de numero largo en linea de emergencia)
    patron_tel = re.compile(r"(0\d{9,})", re.MULTILINE)
    telefonos_encontrados = patron_tel.findall(texto)
    if len(telefonos_encontrados) >= 2:
        telefono = telefonos_encontrados[0]
        emergencia_telefono = telefonos_encontrados[1]
    elif len(telefonos_encontrados) == 1:
        telefono = telefonos_encontrados[0]
        emergencia_telefono = None

    contacto_emergencia = None
    if emergencia_nombre or emergencia_telefono or parentesco:
        contacto_emergencia = OcrEmergencyContact(
            nombre=emergencia_nombre,
            telefono=emergencia_telefono,
            relacion=parentesco,
        )

    # Detectar advertencia si el texto extraido es muy corto (imagen borrosa)
    advertencia = None
    if len(texto) < 100:
        advertencia = "El texto extraido es muy corto. Verifique que la imagen sea clara y legible."

    return OcrScanResponse(
        nombre=nombre,
        apellido=apellido,
        fecha_nacimiento=fecha_nacimiento,
        direccion=direccion,
        telefono=telefono,
        ocupacion=ocupacion,
        alergias=alergias,
        antecedentes_patologicos_personales=antecedentes_personales,
        antecedentes_familiares=antecedentes_familiares,
        medicacion=medicacion,
        vacunas=vacunas,
        antecedentes_quirurgicos=antecedentes_quirurgicos,
        habitos=habitos,
        contacto_emergencia=contacto_emergencia,
        texto_crudo=texto,
        advertencia=advertencia,
    )


# ---------------------------------------------------------------------------
# Funcion principal
# ---------------------------------------------------------------------------

def procesar_ficha_medica(imagen_bytes: bytes) -> OcrScanResponse:
    """
    Pipeline completo:
    1. Preprocesa la imagen para mejorar calidad
    2. Envia a Google Cloud Vision API
    3. Parsea los campos detectados
    4. Devuelve un OcrScanResponse con el preview de datos
    """
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS") and not os.getenv("GOOGLE_VISION_API_KEY"):
        raise EnvironmentError(
            "Configura GOOGLE_APPLICATION_CREDENTIALS o GOOGLE_VISION_API_KEY en las variables de entorno"
        )

    imagen_procesada = _preprocesar_imagen(imagen_bytes)
    texto = _extraer_texto_vision(imagen_procesada)

    if not texto:
        return OcrScanResponse(
            advertencia="No se pudo extraer texto de la imagen. Verifique que la imagen sea clara.",
            texto_crudo="",
        )

    return _parsear_ficha(texto)
