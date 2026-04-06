from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.exceptions import conflict, not_found
from app.database import SessionLocal
from app.models.personal_data import PersonalData
from app.models.user import User
from app.models.medical_history import MedicalHistory
from app.models.medical_record import MedicalRecord
from app.schemas.personal_data_schema import (
    PersonalDataResponse,
)
from app.services.medical_service import get_user_or_404
from app.utils.dependencies import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# NEW: Endpoint para crear/actualizar datos personales del usuario autenticado
@router.post("/me", response_model=PersonalDataResponse, status_code=status.HTTP_201_CREATED)
def create_my_personal_data(
    payload: dict, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear datos personales para el usuario autenticado"""
    user_id = current_user.id
    
    existing = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if existing:
        raise conflict("El usuario ya tiene datos personales registrados")

    try:
        # Update User fields if provided
        fullName = payload.get("fullName") or ""
        if fullName and fullName.strip():
            parts = fullName.split(" ", 1)
            current_user.nombre = parts[0]
            current_user.apellido = parts[1] if len(parts) > 1 else ""
        
        identityCard = payload.get("identityCard") or ""
        if identityCard and identityCard.strip():
            current_user.cedula = identityCard.strip()
        
        # Prepare PersonalData fields
        personal_data_dict = {}
        
        # Teléfono - usa phone o telefono
        phone_value = (payload.get("phone") or payload.get("telefono") or "").strip()
        if phone_value:
            personal_data_dict["telefono"] = phone_value
        
        # Dirección - usa address o direccion
        address_value = (payload.get("address") or payload.get("direccion") or "").strip()
        if address_value:
            personal_data_dict["direccion"] = address_value
        
        ciudad = (payload.get("ciudad") or "").strip()
        if ciudad:
            personal_data_dict["ciudad"] = ciudad
        
        pais = (payload.get("pais") or "").strip()
        if pais:
            personal_data_dict["pais"] = pais
        
        # Fecha de nacimiento
        birthDate = payload.get("birthDate") or payload.get("fecha_nacimiento")
        if birthDate:
            personal_data_dict["fecha_nacimiento"] = birthDate

        personal_data = PersonalData(user_id=user_id, **personal_data_dict)
        db.add(personal_data)
        db.commit()
        db.refresh(personal_data)
        
        # También guardar bloodType y allergies en MedicalHistory
        bloodType = payload.get("bloodType") or ""
        allergies = payload.get("allergies") or ""
        
        print(f"DEBUG: bloodType={repr(bloodType)}, allergies={repr(allergies)}")
        
        # Guardar en MedicalHistory si hay datos
        if bloodType.strip() or allergies.strip():
            medical_history = db.query(MedicalHistory).filter(MedicalHistory.user_id == user_id).first()
            if medical_history:
                print(f"DEBUG: Updating existing MedicalHistory")
                if bloodType.strip():
                    medical_history.tipo_sangre = bloodType.strip()
                if allergies.strip():
                    medical_history.alergias = allergies.strip()
                db.commit()
            else:
                # Si no existe MedicalHistory, crear uno
                print(f"DEBUG: Creating new MedicalHistory")
                medical_record = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
                if medical_record:
                    medical_history = MedicalHistory(
                        user_id=user_id,
                        medical_record_id=medical_record.id,
                        tipo_sangre=bloodType.strip() if bloodType.strip() else None,
                        alergias=allergies.strip() if allergies.strip() else None
                    )
                    db.add(medical_history)
                    db.commit()
                    print(f"DEBUG: Created MedicalHistory: id={medical_history.id}, tipo_sangre={medical_history.tipo_sangre}")
        
        return personal_data
    
    except Exception as e:
        db.rollback()
        print(f"Error: {str(e)}")
        raise ValueError(f"Error al guardar datos personales: {str(e)}")


# NEW: Endpoint para obtener datos personales del usuario autenticado
@router.get("/me")
def get_my_personal_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener datos personales del usuario autenticado"""
    user_id = current_user.id
    
    personal_data = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    medical_history = db.query(MedicalHistory).filter(MedicalHistory.user_id == user_id).first()
    
    print(f"DEBUG GET: user_id={user_id}, medical_history={medical_history}, tipo_sangre={medical_history.tipo_sangre if medical_history else 'NO MH'}")
    
    # Combinar datos del usuario y datos personales
    response = {
        "id": personal_data.id if personal_data else None,
        "user_id": user_id,
        "fullName": f"{current_user.nombre} {current_user.apellido}".strip() if current_user.nombre else "",
        "identityCard": current_user.cedula or "",
        "bloodType": medical_history.tipo_sangre or "" if medical_history else "",
        "allergies": medical_history.alergias or "" if medical_history else "",
        "phone": personal_data.telefono or "" if personal_data else "",
        "telefono": personal_data.telefono or "" if personal_data else "",
        "address": personal_data.direccion or "" if personal_data else "",
        "direccion": personal_data.direccion or "" if personal_data else "",
        "fecha_nacimiento": personal_data.fecha_nacimiento if personal_data else None,
        "ciudad": personal_data.ciudad or "" if personal_data else "",
        "pais": personal_data.pais or "" if personal_data else "",
    }
    
    print(f"DEBUG GET response: bloodType={response['bloodType']}")
    return response



@router.post("/{user_id}", response_model=PersonalDataResponse, status_code=status.HTTP_201_CREATED)
def create_personal_data(user_id: int, payload: PersonalDataCreate, db: Session = Depends(get_db)):
    user = get_user_or_404(user_id, db)

    existing = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if existing:
        raise conflict("El usuario ya tiene datos personales registrados")

    # Update User fields if provided
    if payload.fullName:
        parts = payload.fullName.split(" ", 1)
        user.nombre = parts[0]
        user.apellido = parts[1] if len(parts) > 1 else ""
    
    if payload.identityCard:
        user.cedula = payload.identityCard
    
    if payload.bloodType:
        # Store bloodType in a way we can retrieve it (might need to add column to User)
        pass
    
    # Prepare PersonalData fields
    personal_data_dict = {}
    
    if payload.phone or payload.telefono:
        personal_data_dict["telefono"] = payload.phone or payload.telefono
    
    if payload.direccion:
        personal_data_dict["direccion"] = payload.direccion
    
    if payload.ciudad:
        personal_data_dict["ciudad"] = payload.ciudad
    
    if payload.pais:
        personal_data_dict["pais"] = payload.pais
    
    if payload.birthDate or payload.fecha_nacimiento:
        personal_data_dict["fecha_nacimiento"] = payload.birthDate or payload.fecha_nacimiento

    personal_data = PersonalData(user_id=user_id, **personal_data_dict)
    db.add(personal_data)
    db.commit()
    db.refresh(personal_data)
    return personal_data


@router.get("/{user_id}", response_model=PersonalDataResponse)
def get_personal_data(user_id: int, db: Session = Depends(get_db)):
    get_user_or_404(user_id, db)

    personal_data = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if not personal_data:
        raise not_found("No hay datos personales para este usuario")

    return personal_data


@router.put("/{user_id}", response_model=PersonalDataResponse)
def update_personal_data(user_id: int, payload: PersonalDataUpdate, db: Session = Depends(get_db)):
    user = get_user_or_404(user_id, db)

    personal_data = db.query(PersonalData).filter(PersonalData.user_id == user_id).first()
    if not personal_data:
        raise not_found("No hay datos personales para este usuario")

    # Update User fields if provided
    if payload.fullName:
        parts = payload.fullName.split(" ", 1)
        user.nombre = parts[0]
        user.apellido = parts[1] if len(parts) > 1 else ""
    
    if payload.identityCard:
        user.cedula = payload.identityCard

    # Update PersonalData fields
    update_values = {}
    
    if payload.phone or payload.telefono:
        update_values["telefono"] = payload.phone or payload.telefono
    
    # Maneja tanto "address" como "direccion"
    if payload.address or payload.direccion:
        update_values["direccion"] = payload.address or payload.direccion
    
    if payload.ciudad:
        update_values["ciudad"] = payload.ciudad
    
    if payload.pais:
        update_values["pais"] = payload.pais
    
    if payload.birthDate or payload.fecha_nacimiento:
        update_values["fecha_nacimiento"] = payload.birthDate or payload.fecha_nacimiento

    for key, value in update_values.items():
        setattr(personal_data, key, value)

    db.commit()
    db.refresh(personal_data)
    return personal_data
