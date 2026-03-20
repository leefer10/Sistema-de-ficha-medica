from sqlalchemy.orm import Session

from app.core.exceptions import conflict, not_found
from app.models.user import User, UserRole
from app.schemas.user_schema import UserCreate
from app.services.user_service import create_user


def list_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


def list_managers(db: Session) -> list[User]:
    return (
        db.query(User)
        .filter(User.role == UserRole.manager)
        .order_by(User.created_at.desc())
        .all()
    )


def get_user_or_404(user_id: int, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise not_found("Usuario no encontrado")
    return user


def create_manager(db: Session, payload: UserCreate) -> User:
    manager = create_user(db, payload)
    manager.role = UserRole.manager
    db.commit()
    db.refresh(manager)
    return manager


def update_user_role(user_id: int, new_role: UserRole, db: Session) -> User:
    user = get_user_or_404(user_id, db)

    if user.role == new_role:
        return user

    if user.role == UserRole.admin and new_role != UserRole.admin:
        admin_count = db.query(User).filter(User.role == UserRole.admin).count()
        if admin_count <= 1:
            raise conflict("No se puede degradar al unico administrador del sistema")

    user.role = new_role
    db.commit()
    db.refresh(user)
    return user
