"""
Pydantic schemas for request/response validation
API தரவு வடிவங்கள்
"""

from pydantic import BaseModel
from typing import List, Optional


class CategorySchema(BaseModel):
    id: int
    name_tamil: str
    name_english: str
    icon: Optional[str]
    color: Optional[str]

    class Config:
        from_attributes = True


class SeasonSchema(BaseModel):
    id: int
    month_number: int
    month_tamil: str
    month_english: str

    class Config:
        from_attributes = True


class NutritionSchema(BaseModel):
    id: int
    food_id: int
    calories: Optional[float]
    protein: Optional[float]
    carbohydrates: Optional[float]
    fat: Optional[float]
    fiber: Optional[float]
    vitamins: Optional[str]
    minerals: Optional[str]

    class Config:
        from_attributes = True


class HealthBenefitSchema(BaseModel):
    id: int
    benefit_tamil: str

    class Config:
        from_attributes = True


class RecipeSchema(BaseModel):
    id: int
    food_id: int
    title_tamil: str
    ingredients_tamil: str
    instructions_tamil: str
    prep_time: Optional[str]
    cook_time: Optional[str]

    class Config:
        from_attributes = True


class FoodListSchema(BaseModel):
    id: int
    name_tamil: str
    name_english: str
    image_url: Optional[str]
    description_tamil: Optional[str]
    category: Optional[CategorySchema]
    seasons: List[SeasonSchema] = []

    class Config:
        from_attributes = True


class FoodDetailSchema(BaseModel):
    id: int
    name_tamil: str
    name_english: str
    image_url: Optional[str]
    description_tamil: Optional[str]
    category: Optional[CategorySchema]
    seasons: List[SeasonSchema] = []
    nutrition: Optional[NutritionSchema]
    benefits: List[HealthBenefitSchema] = []
    recipes: List[RecipeSchema] = []

    class Config:
        from_attributes = True
