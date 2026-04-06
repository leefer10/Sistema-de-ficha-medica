"""
Add onboarding tracking columns to the users table.
This script adds three new boolean columns to track onboarding phase completion.
Supports both SQLite and PostgreSQL.
"""

import os
import sys
from pathlib import Path

# Try to use SQLAlchemy if available
try:
    from sqlalchemy import create_engine, text
    
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2002@localhost/ficha_medica_db")
    
    def add_onboarding_columns_sql():
        try:
            engine = create_engine(DATABASE_URL)
            
            with engine.connect() as conn:
                # PostgreSQL: Add columns with IF NOT EXISTS equivalent using exception handling
                try:
                    conn.execute(text("""
                        ALTER TABLE users 
                        ADD COLUMN onboarding_phase_1_complete BOOLEAN DEFAULT FALSE
                    """))
                    print("✓ Added onboarding_phase_1_complete column")
                except Exception as e:
                    if "already exists" in str(e) or "duplicate" in str(e):
                        print("✓ onboarding_phase_1_complete already exists")
                    else:
                        raise
                
                try:
                    conn.execute(text("""
                        ALTER TABLE users 
                        ADD COLUMN onboarding_phase_2_complete BOOLEAN DEFAULT FALSE
                    """))
                    print("✓ Added onboarding_phase_2_complete column")
                except Exception as e:
                    if "already exists" in str(e) or "duplicate" in str(e):
                        print("✓ onboarding_phase_2_complete already exists")
                    else:
                        raise
                
                try:
                    conn.execute(text("""
                        ALTER TABLE users 
                        ADD COLUMN onboarding_phase_3_complete BOOLEAN DEFAULT FALSE
                    """))
                    print("✓ Added onboarding_phase_3_complete column")
                except Exception as e:
                    if "already exists" in str(e) or "duplicate" in str(e):
                        print("✓ onboarding_phase_3_complete already exists")
                    else:
                        raise
                
                conn.commit()
                print("\n✓ Onboarding columns added successfully!")
                
        except Exception as e:
            print(f"✗ Error: {e}")
            sys.exit(1)
        finally:
            engine.dispose()
    
    if __name__ == "__main__":
        add_onboarding_columns_sql()

except ImportError:
    print("SQLAlchemy not installed. Installing...")
    os.system("pip install sqlalchemy")
    print("Please run this script again.")
