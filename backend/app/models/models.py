"""
SQLAlchemy ORM Models for Seasonal Food Finder
பருவ உணவு கண்டுபிடிப்பான் - Database Models
"""

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database.db import Base

# Many-to-Many: foods <-> seasons
food_season = Table(
    "food_season",
    Base.metadata,
    Column("food_id", Integer, ForeignKey("foods.id")),
    Column("season_id", Integer, ForeignKey("seasons.id")),
)


class Category(Base):
    """Food category table - உணவு வகை"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name_tamil = Column(String(100), nullable=False)       # Tamil category name
    name_english = Column(String(100), nullable=False)     # English category name
    icon = Column(String(50))                              # Emoji icon
    color = Column(String(20))                             # UI color hex

    foods = relationship("Food", back_populates="category")


class Season(Base):
    """Season / Month table - பருவகாலம்"""
    __tablename__ = "seasons"

    id = Column(Integer, primary_key=True, index=True)
    month_number = Column(Integer, nullable=False)         # 1-12
    month_tamil = Column(String(50), nullable=False)       # Tamil month name
    month_english = Column(String(50), nullable=False)     # English month name

    foods = relationship("Food", secondary=food_season, back_populates="seasons")


class Food(Base):
    """Main food table - உணவு பட்டியல்"""
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name_tamil = Column(String(150), nullable=False, index=True)   # Tamil name
    name_english = Column(String(150), nullable=False)              # English name
    category_id = Column(Integer, ForeignKey("categories.id"))
    description_tamil = Column(Text)                                # Tamil description
    image_url = Column(String(500))                                 # Food image URL

    category = relationship("Category", back_populates="foods")
    seasons = relationship("Season", secondary=food_season, back_populates="foods")
    nutrition = relationship("Nutrition", back_populates="food", uselist=False)
    recipes = relationship("Recipe", back_populates="food")
    benefits = relationship("HealthBenefit", back_populates="food")


class Nutrition(Base):
    """Nutrition information table - ஊட்டச்சத்து தகவல்"""
    __tablename__ = "nutrition"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("foods.id"), unique=True)
    calories = Column(Float)          # கலோரி (per 100g)
    protein = Column(Float)           # புரதம் (g)
    carbohydrates = Column(Float)     # கார்போஹைட்ரேட் (g)
    fat = Column(Float)               # கொழுப்பு (g)
    fiber = Column(Float)             # நார்ச்சத்து (g)
    vitamins = Column(String(300))    # வைட்டமின்கள்
    minerals = Column(String(300))    # தாதுக்கள்

    food = relationship("Food", back_populates="nutrition")


class HealthBenefit(Base):
    """Health benefits table - உடல்நல நன்மைகள்"""
    __tablename__ = "health_benefits"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("foods.id"))
    benefit_tamil = Column(Text, nullable=False)    # Tamil health benefit

    food = relationship("Food", back_populates="benefits")


class Recipe(Base):
    """Recipe table - சமையல் குறிப்புகள்"""
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    food_id = Column(Integer, ForeignKey("foods.id"))
    title_tamil = Column(String(200), nullable=False)      # Recipe title in Tamil
    ingredients_tamil = Column(Text, nullable=False)       # Ingredients in Tamil
    instructions_tamil = Column(Text, nullable=False)      # Steps in Tamil
    prep_time = Column(String(50))                         # Preparation time
    cook_time = Column(String(50))                         # Cooking time

    food = relationship("Food", back_populates="recipes")
