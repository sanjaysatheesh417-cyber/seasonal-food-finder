"""
FastAPI Routes for Seasonal Food Finder
பருவ உணவு API வழிகள்
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from app.database.db import get_db
from app.models.models import Food, Category, Season, Nutrition, Recipe
from app.models.schemas import FoodListSchema, FoodDetailSchema, NutritionSchema, RecipeSchema, CategorySchema, SeasonSchema

router = APIRouter()


# ─── Categories ──────────────────────────────────────────────
@router.get("/categories", response_model=List[CategorySchema], tags=["வகைகள்"])
def get_categories(db: Session = Depends(get_db)):
    """Get all food categories - அனைத்து உணவு வகைகளும்"""
    return db.query(Category).all()


# ─── Seasons / Months ────────────────────────────────────────
@router.get("/seasons", response_model=List[SeasonSchema], tags=["பருவகாலம்"])
def get_seasons(db: Session = Depends(get_db)):
    """Get all months - அனைத்து மாதங்களும்"""
    return db.query(Season).order_by(Season.month_number).all()


# ─── Foods List ──────────────────────────────────────────────
@router.get("/foods", response_model=List[FoodListSchema], tags=["உணவுகள்"])
def get_foods(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all foods - அனைத்து உணவுகளும்"""
    return db.query(Food).offset(skip).limit(limit).all()


# ─── Foods by Month ──────────────────────────────────────────
@router.get("/foods/month/{month}", response_model=List[FoodListSchema], tags=["உணவுகள்"])
def get_foods_by_month(month: int, db: Session = Depends(get_db)):
    """Get foods available in a specific month - குறிப்பிட்ட மாதத்தில் கிடைக்கும் உணவுகள்"""
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="மாத எண் 1 முதல் 12 வரை இருக்க வேண்டும்")
    season = db.query(Season).filter(Season.month_number == month).first()
    if not season:
        raise HTTPException(status_code=404, detail="மாதம் கண்டுபிடிக்கப்படவில்லை")
    return season.foods


# ─── Foods by Category ───────────────────────────────────────
@router.get("/foods/category/{category_id}", response_model=List[FoodListSchema], tags=["உணவுகள்"])
def get_foods_by_category(category_id: int, db: Session = Depends(get_db)):
    """Get foods by category - வகை அடிப்படையில் உணவுகள்"""
    foods = db.query(Food).filter(Food.category_id == category_id).all()
    if not foods:
        raise HTTPException(status_code=404, detail="இந்த வகையில் உணவுகள் இல்லை")
    return foods


# ─── Food Detail ─────────────────────────────────────────────
@router.get("/foods/{food_id}", response_model=FoodDetailSchema, tags=["உணவுகள்"])
def get_food_detail(food_id: int, db: Session = Depends(get_db)):
    """Get full food details - முழு உணவு விவரங்கள்"""
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="உணவு கண்டுபிடிக்கப்படவில்லை")
    return food


# ─── Nutrition ───────────────────────────────────────────────
@router.get("/nutrition/{food_id}", response_model=NutritionSchema, tags=["ஊட்டச்சத்து"])
def get_nutrition(food_id: int, db: Session = Depends(get_db)):
    """Get nutrition info - ஊட்டச்சத்து தகவல்"""
    nutrition = db.query(Nutrition).filter(Nutrition.food_id == food_id).first()
    if not nutrition:
        raise HTTPException(status_code=404, detail="ஊட்டச்சத்து தகவல் இல்லை")
    return nutrition


# ─── Recipes ─────────────────────────────────────────────────
@router.get("/recipes/{food_id}", response_model=List[RecipeSchema], tags=["சமையல்"])
def get_recipes(food_id: int, db: Session = Depends(get_db)):
    """Get recipes for a food - சமையல் குறிப்புகள்"""
    recipes = db.query(Recipe).filter(Recipe.food_id == food_id).all()
    if not recipes:
        raise HTTPException(status_code=404, detail="சமையல் குறிப்புகள் இல்லை")
    return recipes


# ─── Search ──────────────────────────────────────────────────
@router.get("/search", response_model=List[FoodListSchema], tags=["தேடல்"])
def search_foods(
    name: Optional[str] = Query(None, description="Tamil or English name to search"),
    db: Session = Depends(get_db)
):
    """Search foods by name - பெயரால் தேடுக"""
    if not name:
        return db.query(Food).limit(20).all()
    search_term = f"%{name}%"
    foods = db.query(Food).filter(
        or_(
            Food.name_tamil.like(search_term),
            Food.name_english.ilike(search_term)
        )
    ).all()
    return foods
