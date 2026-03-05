from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ============== Recipe Schemas ==============

class Ingredient(BaseModel):
    """Schema for a single ingredient"""
    name: str
    quantity: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None


class InstructionStep(BaseModel):
    """Schema for a single instruction step"""
    step_number: int
    instruction: str
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None


class RecipeBase(BaseModel):
    """Base recipe schema with common fields"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    cuisine: Optional[str] = None
    category: Optional[str] = None
    prep_time: Optional[int] = Field(None, ge=0)
    cook_time: Optional[int] = Field(None, ge=0)
    servings: Optional[int] = Field(None, ge=1)
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
    ingredients: Optional[List[Dict[str, Any]]] = None
    instructions: Optional[List[Dict[str, Any]]] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: bool = True
    is_ai_generated: bool = False


class RecipeCreate(RecipeBase):
    """Schema for creating a new recipe"""
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Traditional Italian Pasta",
                "description": "A classic Italian pasta recipe",
                "cuisine": "Italian",
                "category": "Main Course",
                "prep_time": 15,
                "cook_time": 20,
                "servings": 4,
                "difficulty": "medium",
                "ingredients": [
                    {"name": "Pasta", "quantity": "400", "unit": "g"},
                    {"name": "Tomato Sauce", "quantity": "200", "unit": "ml"}
                ],
                "instructions": [
                    {"step_number": 1, "instruction": "Boil water for pasta"},
                    {"step_number": 2, "instruction": "Cook pasta according to package"}
                ],
                "tags": ["pasta", "italian", "vegetarian"],
                "is_public": True
            }
        }


class RecipeUpdate(BaseModel):
    """Schema for updating a recipe"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    cuisine: Optional[str] = None
    category: Optional[str] = None
    prep_time: Optional[int] = Field(None, ge=0)
    cook_time: Optional[int] = Field(None, ge=0)
    servings: Optional[int] = Field(None, ge=1)
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
    ingredients: Optional[List[Dict[str, Any]]] = None
    instructions: Optional[List[Dict[str, Any]]] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None


class RecipeResponse(RecipeBase):
    """Schema for recipe response"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class RecipeListResponse(BaseModel):
    """Schema for paginated recipe list"""
    recipes: List[RecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class RecipeStats(BaseModel):
    """Schema for recipe statistics"""
    total_recipes: int
    public_recipes: int
    private_recipes: int
    ai_generated: int
    cuisines: List[str]
    categories: List[str]


# ============== Mobile-Optimized Schemas ==============

class CompactRecipeResponse(BaseModel):
    """Compact recipe response for mobile devices with limited data"""
    id: str
    title: str
    description: Optional[str] = None
    cuisine: Optional[str] = None
    category: Optional[str] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: bool = True
    is_ai_generated: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class CompactRecipeListResponse(BaseModel):
    """Compact paginated recipe list for mobile devices"""
    recipes: List[CompactRecipeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
