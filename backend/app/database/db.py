"""
Database connection configuration
தரவுத்தள இணைப்பு அமைப்பு
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Read from environment variables (set in docker-compose.yml)
DB_USER = os.getenv("MYSQL_USER", "fooduser")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "foodpass")
DB_HOST = os.getenv("MYSQL_HOST", "mysql")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE", "seasonal_foods")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

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
