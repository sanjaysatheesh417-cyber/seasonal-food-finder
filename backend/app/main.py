"""
பருவ உணவு கண்டுபிடிப்பான் - Seasonal Food Finder
Main FastAPI Application Entry Point
"""

import time
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database.db import engine, create_tables
from app.routes.foods import router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="பருவ உணவு கண்டுபிடிப்பான்",
    description="தமிழ்நாட்டின் பருவகால உணவுகளை கண்டறியுங்கள்",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.on_event("startup")
async def startup():
    logger.info("Starting API...")
    for attempt in range(15):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("MySQL connected!")
            break
        except Exception as e:
            logger.warning(f"MySQL not ready (attempt {attempt+1}/15): {e}")
            time.sleep(4)
    else:
        logger.error("Could not connect to MySQL")
        return

    create_tables()
    logger.info("Tables created!")

    from app.database.db import SessionLocal
    from app.models.models import Category
    db = SessionLocal()
    try:
        count = db.query(Category).count()
        if True:
            logger.info("Seeding database...")
            from app.data.seed import seed_all
            seed_all(db)
            logger.info("Database seeded!")
        else:
            logger.info(f"Database already seeded with {count} categories")
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "பருவ உணவு கண்டுபிடிப்பான் API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}
