"""
Servicio para guardar los datos extraidos del OCR en la base de datos.
"""
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.models.personal_data import PersonalData
from app.models.medical_record import MedicalRecord
from app.models.medical_history import MedicalHistory
from app.models.medications import Medication
from app.models.vaccines import Vaccine
from app.models.surgeries import Surgery
from app.models.emergency_contact import EmergencyContact
from app.schemas.ocr_schema import OcrSaveRequest, OcrSaveResponse
import secrets
import string


def _generar_numero_expediente() -> str:
    """Genera un número de expediente único."""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_part = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
    return f"EXP-{timestamp}-{random_part}"


def _parsear_fecha(fecha_str: str) -> datetime.date:
    """
    Intenta parsear una fecha en múltiples formatos.
    Retorna None si no puede parsearla.
    """
    if not fecha_str:
        return None
    
    fecha_str = fecha_str.strip()
    
    # Formatos comunes
    formatos = [
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%d/%m/%y",
        "%d-%m-%y",
        "%Y-%m-%d",
        "%m/%d/%Y",
        "%m-%d-%Y",
        "%d de %B de %Y",
        "%d de %b de %Y",
    ]
    
    for fmt in formatos:
        try:
            return datetime.strptime(fecha_str, fmt).date()
        except ValueError:
            continue
    
    return None


def guardar_datos_ocr(db: Session, request: OcrSaveRequest) -> OcrSaveResponse:
    """
    Guarda los datos extraidos del OCR en la base de datos.
    
    Realiza:
    1. Actualización del Usuario (nombre, apellido)
    2. Creación o actualización de PersonalData
    3. Creación o actualización de MedicalRecord
    4. Creación o actualización de MedicalHistory
    5. Guardado de Medicaciones, Vacunas, Cirugías, Contactos de Emergencia
    
    Args:
        db: Session de base de datos
        request: OcrSaveRequest con los datos a guardar
        
    Returns:
        OcrSaveResponse con el resultado de la operación
    """
    try:
        # 1. Obtener el usuario
        user = db.query(User).filter(User.id == request.user_id).first()
        if not user:
            return OcrSaveResponse(
                success=False,
                message=f"Usuario con ID {request.user_id} no encontrado",
                user_id=request.user_id
            )
        
        # 2. Actualizar datos del usuario si se proporcionaron
        if request.nombre:
            user.nombre = request.nombre
        if request.apellido:
            user.apellido = request.apellido
        
        db.add(user)
        db.flush()
        
        # 3. Crear o actualizar PersonalData
        personal_data = db.query(PersonalData).filter(
            PersonalData.user_id == request.user_id
        ).first()
        
        if not personal_data:
            personal_data = PersonalData(user_id=request.user_id)
        
        # Actualizar campos de personal_data
        if request.fecha_nacimiento:
            personal_data.fecha_nacimiento = _parsear_fecha(request.fecha_nacimiento)
        if request.direccion:
            personal_data.direccion = request.direccion
        if request.telefono:
            personal_data.telefono = request.telefono
        if request.ocupacion:
            personal_data.ocupacion = request.ocupacion
        
        db.add(personal_data)
        db.flush()
        
        # 4. Crear o actualizar MedicalRecord
        medical_record = db.query(MedicalRecord).filter(
            MedicalRecord.user_id == request.user_id
        ).first()
        
        if not medical_record:
            medical_record = MedicalRecord(
                user_id=request.user_id,
                numero_expediente=_generar_numero_expediente(),
                estado="activa"
            )
            db.add(medical_record)
            db.flush()
        
        # 5. Crear o actualizar MedicalHistory
        medical_history = db.query(MedicalHistory).filter(
            MedicalHistory.medical_record_id == medical_record.id
        ).first()
        
        if not medical_history:
            medical_history = MedicalHistory(
                medical_record_id=medical_record.id,
                user_id=request.user_id
            )
        
        # Actualizar campos de medical_history
        if request.alergias:
            medical_history.alergias = request.alergias
        if request.antecedentes_patologicos_personales:
            medical_history.enfermedades_cronicas = request.antecedentes_patologicos_personales
        if request.antecedentes_familiares:
            medical_history.antecedentes_familiares = request.antecedentes_familiares
        
        db.add(medical_history)
        db.flush()
        
        # 6. Limpiar y guardar medicaciones
        db.query(Medication).filter(
            Medication.medical_record_id == medical_record.id
        ).delete()
        
        for med in request.medicaciones:
            medication = Medication(
                medical_record_id=medical_record.id,
                nombre=med.nombre,
                dosis=med.dosis,
                frecuencia=med.frecuencia,
                motivo=med.motivo,
                activo=True
            )
            db.add(medication)
        
        db.flush()
        
        # 7. Limpiar y guardar vacunas
        db.query(Vaccine).filter(
            Vaccine.medical_record_id == medical_record.id
        ).delete()
        
        for vac in request.vacunas:
            vaccine = Vaccine(
                medical_record_id=medical_record.id,
                nombre=vac.nombre,
                fecha_aplicacion=_parsear_fecha(vac.fecha_aplicacion) if vac.fecha_aplicacion else None,
                numero_dosis=vac.numero_dosis,
                lote=vac.lote
            )
            db.add(vaccine)
        
        db.flush()
        
        # 8. Limpiar y guardar cirugías
        db.query(Surgery).filter(
            Surgery.medical_record_id == medical_record.id
        ).delete()
        
        for cirugia in request.antecedentes_quirurgicos:
            surgery = Surgery(
                medical_record_id=medical_record.id,
                nombre_procedimiento=cirugia.nombre_procedimiento,
                fecha=_parsear_fecha(cirugia.fecha) if cirugia.fecha else None,
                motivo=cirugia.motivo
            )
            db.add(surgery)
        
        db.flush()
        
        # 9. Limpiar y guardar contactos de emergencia
        db.query(EmergencyContact).filter(
            EmergencyContact.medical_record_id == medical_record.id
        ).delete()
        
        if request.contacto_emergencia:
            emergency_contact = EmergencyContact(
                medical_record_id=medical_record.id,
                nombre=request.contacto_emergencia.nombre,
                telefono=request.contacto_emergencia.telefono,
                relacion=request.contacto_emergencia.relacion or "Sin especificar"
            )
            db.add(emergency_contact)
            db.flush()
        
        # Commit de todas las transacciones
        db.commit()
        
        return OcrSaveResponse(
            success=True,
            message="Datos del OCR guardados exitosamente",
            medical_record_id=medical_record.id,
            user_id=request.user_id
        )
        
    except IntegrityError as e:
        db.rollback()
        return OcrSaveResponse(
            success=False,
            message=f"Error de integridad en la base de datos: {str(e)}",
            user_id=request.user_id
        )
    except Exception as e:
        db.rollback()
        return OcrSaveResponse(
            success=False,
            message=f"Error al guardar datos del OCR: {str(e)}",
            user_id=request.user_id
        )
