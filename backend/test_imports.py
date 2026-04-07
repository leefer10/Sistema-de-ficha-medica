#!/usr/bin/env python3
"""Quick test to verify all imports work."""

try:
    from app.main import app
    print("✓ Main app imports successfully")
    
    from app.routers import notifications
    print("✓ Notifications router imports successfully")
    
    from app.services.scheduler_service import SchedulerService
    print("✓ Scheduler service imports successfully")
    
    from app.services.notification_service import NotificationService
    print("✓ Notification service imports successfully")
    
    from app.schemas.notifications_schema import (
        NotificationHistoryResponse,
        UnreadCountResponse,
    )
    print("✓ Notification schemas import successfully")
    
    print("\n✅ All imports successful!")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
