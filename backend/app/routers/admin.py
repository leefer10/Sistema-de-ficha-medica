from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import UserRole
from app.schemas.admin_schema import AdminRoleUpdateRequest, AdminUserResponse
from app.schemas.user_schema import UserCreate
from app.services.admin_service import (
    create_manager,
    get_user_or_404,
    list_managers,
    list_users,
    update_user_role,
)
from app.utils.dependencies import require_role

router = APIRouter(dependencies=[Depends(require_role(UserRole.admin))])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/users", response_model=list[AdminUserResponse])
def admin_list_users(db: Session = Depends(get_db)):
    return list_users(db)


@router.get("/managers", response_model=list[AdminUserResponse])
def admin_list_managers(db: Session = Depends(get_db)):
    return list_managers(db)


@router.get("/users/{user_id}", response_model=AdminUserResponse)
def admin_get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_or_404(user_id, db)


@router.post("/create-manager", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
def admin_create_manager(payload: UserCreate, db: Session = Depends(get_db)):
    return create_manager(db, payload)


@router.patch("/users/{user_id}/role", response_model=AdminUserResponse)
def admin_update_user_role(
    user_id: int,
    payload: AdminRoleUpdateRequest,
    db: Session = Depends(get_db),
):
    return update_user_role(user_id, payload.role, db)
