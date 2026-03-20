"""Add qr_token column to existing medical_records table."""
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    # Add qr_token only if it doesn't already exist
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns "
        "WHERE table_name='medical_records' AND column_name='qr_token'"
    ))
    if result.fetchone() is None:
        conn.execute(text(
            "ALTER TABLE medical_records ADD COLUMN qr_token VARCHAR(32) UNIQUE"
        ))
        conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_medical_records_qr_token ON medical_records(qr_token)"
        ))
        conn.commit()
        print("qr_token column added to medical_records.")
    else:
        print("qr_token column already exists, skipping.")
