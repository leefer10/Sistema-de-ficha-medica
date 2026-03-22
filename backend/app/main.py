import logging
import os

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.exceptions import AppException
from app.database import engine, Base
from app.routers import auth
from app.routers import personal_data
from app.routers import medical_history
from app.routers import habits
from app.routers import medications
from app.routers import vaccines
from app.routers import surgeries
from app.routers import emergency_contacts
from app.routers import qr
from app.routers import admin
from app.routers import manager
from app.routers import me
from app.routers import ocr_router
from app.models import user  # noqa: F401  — triggers all model imports via user.py

logger = logging.getLogger("uvicorn.error")

app = FastAPI(title="Sistema de Hermanos Para su Salud", version="1.0.0")

Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------------------------

# Allowed origins for frontend - Accept all from localhost and Vercel
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Local development
    "http://localhost",       # Local
    "https://sistema-de-ficha-medica-13aekco3h-leefer10s-projects.vercel.app",  # Vercel deployment
]

# Add CORS middleware with allowed patterns
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health Check Endpoint
# ---------------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health check endpoint for monitoring."""
    return {"status": "ok", "service": "Sistema de Hermanos Para su Salud"}


# ---------------------------------------------------------------------------
# Centralized error handlers
# ---------------------------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [
        {"campo": " -> ".join(str(loc) for loc in err["loc"]), "mensaje": err["msg"]}
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Error de validacion", "errores": errors},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=getattr(exc, "headers", None) or {},
    )


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Error inesperado: %s", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Error interno del servidor"},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(personal_data.router, prefix="/users/personal-data", tags=["Personal Data"])
app.include_router(medical_history.router, prefix="/users/medical-history", tags=["Medical History"])
app.include_router(habits.router, prefix="/users/habits", tags=["Habits"])
app.include_router(medications.router, prefix="/users/medications", tags=["Medications"])
app.include_router(vaccines.router, prefix="/users/vaccines", tags=["Vaccines"])
app.include_router(surgeries.router, prefix="/users/surgeries", tags=["Surgeries"])
app.include_router(emergency_contacts.router, prefix="/users/emergency-contacts", tags=["Emergency Contacts"])
app.include_router(qr.router, tags=["QR & Emergency"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(manager.router, prefix="/manager", tags=["Manager"])
app.include_router(me.router, prefix="/users", tags=["My Medical"])
app.include_router(ocr_router.router, prefix="/fichas", tags=["OCR / Ficha Médica"])
