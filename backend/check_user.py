import sys
sys.path.insert(0, '.')

from app.database import SessionLocal
from app.models import User

db = SessionLocal()
user = db.query(User).filter(User.email == "juan@gmail.com").first()

if user:
    print(f"Usuario encontrado: {user.email}")
    print(f"ID: {user.id}")
else:
    print("Usuario NO existe")
