"""Add manager value to PostgreSQL enum userrole if missing."""

from sqlalchemy import text

from app.database import engine


sql = """
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        WHERE t.typname = 'userrole' AND e.enumlabel = 'manager'
    ) THEN
        ALTER TYPE userrole ADD VALUE 'manager';
    END IF;
END
$$;
"""

with engine.connect() as conn:
    conn.execute(text(sql))
    conn.commit()

print("Migration OK: userrole includes manager")
