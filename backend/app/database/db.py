"""
Database connection configuration
தரவுத்தள இணைப்பு அமைப்பு
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Fix for Render/SQLAlchemy compatibility 
# Render provides "postgres://", but SQLAlchemy 1.4+ requires "postgresql://"
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,        # Test connection before using
    pool_recycle=300,          # Recycle connections every 5 minutes
    echo=False,                # Set True to see SQL logs
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()


def get_db():
    """Dependency for FastAPI routes - provides DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the database"""
    from app.models.models import Category, Season, Food, Nutrition, HealthBenefit, Recipe  # noqa
    Base.metadata.create_all(bind=engine)
