#!/usr/bin/env python
"""
Script to reset phase_2_complete to False for all users.
This is needed because the previous version was marking phase 2 as complete
when the user only selected the method, not when they actually filled in the data.
"""

from sqlalchemy import create_engine, text, inspect
import os

# Try to use DATABASE_URL from env, fallback to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Try to find the test.db in the same directory
    db_path = "./test.db"
    if os.path.exists(db_path):
        DATABASE_URL = f"sqlite:///{os.path.abspath(db_path)}"
    else:
        DATABASE_URL = "sqlite:///./test.db"

print(f"Using database: {DATABASE_URL}")

def reset_phase2():
    engine = create_engine(DATABASE_URL)
    
    try:
        # First, check if the table exists
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Available tables: {tables}")
        
        if "users" not in tables:
            print("❌ 'users' table not found in database!")
            print("   Try running migrations first: python run_migration.py")
            return False
        
        # Now reset phase_2_complete to False
        with engine.connect() as conn:
            result = conn.execute(
                text("UPDATE users SET onboarding_phase_2_complete = FALSE")
            )
            conn.commit()
            
            updated_count = result.rowcount
            print(f"✓ Phase 2 reset successfully for {updated_count} users")
            return True
            
    except Exception as e:
        print(f"❌ Error resetting phase 2: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        engine.dispose()

if __name__ == "__main__":
    success = reset_phase2()
    exit(0 if success else 1)

