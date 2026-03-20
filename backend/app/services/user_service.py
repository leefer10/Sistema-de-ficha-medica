import uuid

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import conflict, unauthorized, unprocessable
from app.models.user import User
from app.schemas.user_schema import UserCreate
from app.utils.security import hash_password, verify_password


def build_alternate_id() -> str:
    return f"ALT-{uuid.uuid4().hex[:8].upper()}"


def build_unique_alternate_id(db: Session) -> str:
    while True:
        candidate = build_alternate_id()
        exists = db.query(User).filter(User.id_alterno == candidate).first()
        if not exists:
            return candidate


def normalize_text(value: str) -> str:
    return value.strip()


def normalize_email(value: str) -> str:
    return value.strip().lower()


def create_user(db: Session, payload: UserCreate) -> User:
    nombre = normalize_text(payload.nombre)
    apellido = normalize_text(payload.apellido)
    email = normalize_email(payload.email)
    cedula = normalize_text(payload.cedula) if payload.cedula else None

    if cedula and not cedula.isdigit():
        raise unprocessable("La cedula solo debe contener numeros")

    id_alterno = None
    if not cedula:
        id_alterno = build_unique_alternate_id(db)
    else:
        cedula_exists = db.query(User).filter(User.cedula == cedula).first()
        if cedula_exists:
            raise conflict("La cedula ya esta registrada")

    new_user = User(
        nombre=nombre,
        apellido=apellido,
        email=email,
        password_hash=hash_password(payload.password),
        cedula=cedula,
        id_alterno=id_alterno,
    )

    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise conflict("Conflicto de datos: valida correo, cedula o id alterno")

    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, email: str, password: str) -> User:
    normalized_email = normalize_email(email)
    user = db.query(User).filter(User.email == normalized_email).first()
    if not user or not verify_password(password, user.password_hash):
        raise unauthorized("Correo o contrasena incorrectos")
    return user
