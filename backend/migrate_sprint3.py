"""Sprint 3 migration: create emergency_contacts table + add qr_token to medical_records."""
from app.database import engine, Base
from app.models import user  # noqa — triggers all model imports including emergency_contact

Base.metadata.create_all(bind=engine)
print("Migration OK: emergency_contacts table created / updated.")
