import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Leer DATABASE_URL de las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:2002@localhost/ficha_medica_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()