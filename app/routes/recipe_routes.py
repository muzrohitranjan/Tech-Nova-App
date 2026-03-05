from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from typing import Dict, Any, List, Optional

from app.schemas.recipe_schema import (
    RecipeCreate, 
    RecipeUpdate, 
    RecipeResponse, 
    RecipeListResponse,
    RecipeStats,
    CompactRecipeResponse,
    CompactRecipeListResponse
)
from app.services.recipe_service import RecipeService
from app.utils.security import get_current_active_user, require_admin
from app.middleware.device_detection import get_device_type, is_mobile


router = APIRouter(prefix="/api/recipes", tags=["Recipes"])


@router.post("/", response_model=RecipeResponse, status_code=status.HTTP_201_CREATED)
async def create_recipe(
    recipe_data: RecipeCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Create a new recipe"""
    try:
        recipe_service = RecipeService()
        recipe = recipe_service.create_recipe(current_user["id"], recipe_data)
        return recipe
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create recipe: {str(e)}"
        )


@router.get("/", response_model=RecipeListResponse)
async def get_recipes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    cuisine: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_active_user)
):
    """Get public recipes with optional filters"""
    try:
        recipe_service = RecipeService()
        
        # If user is authenticated, get their recipes too
        if current_user:
            user_recipes = recipe_service.get_user_recipes(
                user_id=current_user["id"],
                page=page,
                page_size=page_size,
                search=search,
                cuisine=cuisine,
                category=category,
                difficulty=difficulty
            )
            return user_recipes
        else:
            # Get public recipes only
            result = recipe_service.get_public_recipes(
                page=page,
                page_size=page_size,
                search=search,
                cuisine=cuisine,
                category=category,
                difficulty=difficulty
            )
            return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipes: {str(e)}"
        )


@router.get("/my-recipes", response_model=RecipeListResponse)
async def get_my_recipes(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    cuisine: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get current user's recipes"""
    try:
        recipe_service = RecipeService()
        result = recipe_service.get_user_recipes(
            user_id=current_user["id"],
            page=page,
            page_size=page_size,
            search=search,
            cuisine=cuisine,
            category=category,
            difficulty=difficulty
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipes: {str(e)}"
        )


@router.get("/stats", response_model=RecipeStats)
async def get_my_recipe_stats(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get recipe statistics for current user"""
    try:
        recipe_service = RecipeService()
        stats = recipe_service.get_recipe_stats(current_user["id"])
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch stats: {str(e)}"
        )


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_active_user)
):
    """Get a specific recipe by ID"""
    try:
        recipe_service = RecipeService()
        recipe = recipe_service.get_recipe_by_id(recipe_id)
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        
        # Check access: public or owner or admin
        is_owner = current_user and recipe["user_id"] == current_user["id"]
        is_admin = current_user and current_user.get("role") == "admin"
        is_public = recipe.get("is_public", True)
        
        if not is_public and not is_owner and not is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this recipe"
            )
        
        return recipe
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipe: {str(e)}"
        )


@router.put("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: str,
    recipe_data: RecipeUpdate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Update a recipe"""
    try:
        recipe_service = RecipeService()
        is_admin = current_user.get("role") == "admin"
        
        updated_recipe = recipe_service.update_recipe(
            recipe_id, 
            current_user["id"], 
            recipe_data,
            is_admin
        )
        return updated_recipe
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update recipe: {str(e)}"
        )


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Delete a recipe"""
    try:
        recipe_service = RecipeService()
        is_admin = current_user.get("role") == "admin"
        
        success = recipe_service.delete_recipe(
            recipe_id,
            current_user["id"],
            is_admin
        )
        
        if success:
            return None
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete recipe"
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete recipe: {str(e)}"
        )


@router.patch("/{recipe_id}/toggle-visibility", response_model=RecipeResponse)
async def toggle_recipe_visibility(
    recipe_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Toggle recipe public/private visibility"""
    try:
        recipe_service = RecipeService()
        is_admin = current_user.get("role") == "admin"
        
        updated_recipe = recipe_service.toggle_recipe_visibility(
            recipe_id,
            current_user["id"],
            is_admin
        )
        return updated_recipe
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to toggle visibility: {str(e)}"
        )


# Admin routes
@router.get("/admin/all", response_model=RecipeListResponse)
async def get_all_recipes_admin(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    """Get all recipes (admin only)"""
    try:
        recipe_service = RecipeService()
        result = recipe_service.get_all_recipes_admin(
            page=page,
            page_size=page_size,
            user_id=user_id
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipes: {str(e)}"
        )


# ============== Mobile-Optimized Endpoints ==============

@router.get("/mobile", response_model=CompactRecipeListResponse)
async def get_recipes_mobile(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    search: Optional[str] = None,
    cuisine: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_active_user)
):
    """
    Get public recipes with mobile-optimized compact response.
    
    This endpoint returns a smaller response payload optimized for mobile devices.
    """
    try:
        recipe_service = RecipeService()
        
        # If user is authenticated, get their recipes too
        if current_user:
            result = recipe_service.get_user_recipes(
                user_id=current_user["id"],
                page=page,
                page_size=page_size,
                search=search,
                cuisine=cuisine,
                category=category,
                difficulty=difficulty
            )
        else:
            # Get public recipes only
            result = recipe_service.get_public_recipes(
                page=page,
                page_size=page_size,
                search=search,
                cuisine=cuisine,
                category=category,
                difficulty=difficulty
            )
        
        # Convert to compact response
        compact_recipes = [
            CompactRecipeResponse(
                id=r.id,
                title=r.title,
                description=r.description,
                cuisine=r.cuisine,
                category=r.category,
                prep_time=r.prep_time,
                cook_time=r.cook_time,
                servings=r.servings,
                difficulty=r.difficulty,
                image_url=r.image_url,
                tags=r.tags,
                is_public=r.is_public,
                is_ai_generated=r.is_ai_generated,
                created_at=r.created_at
            )
            for r in result.recipes
        ]
        
        return CompactRecipeListResponse(
            recipes=compact_recipes,
            total=result.total,
            page=result.page,
            page_size=result.page_size,
            total_pages=result.total_pages
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipes: {str(e)}"
        )


@router.get("/mobile/my-recipes", response_model=CompactRecipeListResponse)
async def get_my_recipes_mobile(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    search: Optional[str] = None,
    cuisine: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Get current user's recipes with mobile-optimized compact response.
    """
    try:
        recipe_service = RecipeService()
        result = recipe_service.get_user_recipes(
            user_id=current_user["id"],
            page=page,
            page_size=page_size,
            search=search,
            cuisine=cuisine,
            category=category,
            difficulty=difficulty
        )
        
        # Convert to compact response
        compact_recipes = [
            CompactRecipeResponse(
                id=r.id,
                title=r.title,
                description=r.description,
                cuisine=r.cuisine,
                category=r.category,
                prep_time=r.prep_time,
                cook_time=r.cook_time,
                servings=r.servings,
                difficulty=r.difficulty,
                image_url=r.image_url,
                tags=r.tags,
                is_public=r.is_public,
                is_ai_generated=r.is_ai_generated,
                created_at=r.created_at
            )
            for r in result.recipes
        ]
        
        return CompactRecipeListResponse(
            recipes=compact_recipes,
            total=result.total,
            page=result.page,
            page_size=result.page_size,
            total_pages=result.total_pages
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recipes: {str(e)}"
        )
