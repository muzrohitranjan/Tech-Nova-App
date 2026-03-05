from typing import Optional, Dict, Any, List
from supabase import Client
from app.database import get_supabase_client, get_service_client
from app.schemas.recipe_schema import RecipeCreate, RecipeUpdate


class RecipeService:
    """Service for handling recipe operations"""
    
    def __init__(self, supabase: Client = None):
        self.supabase = supabase or get_supabase_client()
        self.service_client = get_service_client()
    
    def create_recipe(self, user_id: str, recipe_data: RecipeCreate) -> Dict[str, Any]:
        """Create a new recipe"""
        recipe_dict = recipe_data.model_dump()
        recipe_dict["user_id"] = user_id
        
        response = self.supabase.table("recipes").insert(recipe_dict).execute()
        
        if not response.data:
            raise ValueError("Failed to create recipe")
        
        return response.data[0]
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Dict[str, Any]]:
        """Get recipe by ID"""
        response = self.supabase.table("recipes").select("*").eq("id", recipe_id).execute()
        return response.data[0] if response.data else None
    
    def get_user_recipes(
        self, 
        user_id: str, 
        page: int = 1, 
        page_size: int = 20,
        search: Optional[str] = None,
        cuisine: Optional[str] = None,
        category: Optional[str] = None,
        difficulty: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all recipes for a user with optional filters"""
        offset = (page - 1) * page_size
        
        query = self.supabase.table("recipes").select("*", count="exact").eq("user_id", user_id)
        
        if search:
            query = query.ilike("title", f"%{search}%")
        if cuisine:
            query = query.eq("cuisine", cuisine)
        if category:
            query = query.eq("category", category)
        if difficulty:
            query = query.eq("difficulty", difficulty)
        
        response = query.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
        
        total = response.count or 0
        
        return {
            "recipes": response.data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if total > 0 else 0
        }
    
    def get_public_recipes(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        cuisine: Optional[str] = None,
        category: Optional[str] = None,
        difficulty: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Get public recipes with optional filters"""
        offset = (page - 1) * page_size
        
        query = self.supabase.table("recipes").select("*", count="exact").eq("is_public", True)
        
        if search:
            query = query.ilike("title", f"%{search}%")
        if cuisine:
            query = query.eq("cuisine", cuisine)
        if category:
            query = query.eq("category", category)
        if difficulty:
            query = query.eq("difficulty", difficulty)
        
        response = query.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
        
        # Filter by tags if provided
        recipes = response.data
        if tags:
            recipes = [r for r in recipes if r.get("tags") and any(tag in r["tags"] for tag in tags)]
        
        total = len(recipes)
        
        return {
            "recipes": recipes,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if total > 0 else 0
        }
    
    def update_recipe(self, recipe_id: str, user_id: str, recipe_data: RecipeUpdate, is_admin: bool = False) -> Dict[str, Any]:
        """Update a recipe"""
        recipe = self.get_recipe_by_id(recipe_id)
        
        if not recipe:
            raise ValueError("Recipe not found")
        
        # Check ownership or admin
        if recipe["user_id"] != user_id and not is_admin:
            raise ValueError("Not authorized to update this recipe")
        
        update_data = recipe_data.model_dump(exclude_unset=True)
        
        if not update_data:
            raise ValueError("No data to update")
        
        update_data["updated_at"] = "now()"
        
        response = self.supabase.table("recipes").update(update_data).eq("id", recipe_id).execute()
        
        if not response.data:
            raise ValueError("Failed to update recipe")
        
        return response.data[0]
    
    def delete_recipe(self, recipe_id: str, user_id: str, is_admin: bool = False) -> bool:
        """Delete a recipe"""
        recipe = self.get_recipe_by_id(recipe_id)
        
        if not recipe:
            raise ValueError("Recipe not found")
        
        # Check ownership or admin
        if recipe["user_id"] != user_id and not is_admin:
            raise ValueError("Not authorized to delete this recipe")
        
        response = self.supabase.table("recipes").delete().eq("id", recipe_id).execute()
        
        return True
    
    def get_all_recipes_admin(
        self,
        page: int = 1,
        page_size: int = 20,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get all recipes for admin"""
        offset = (page - 1) * page_size
        
        query = self.service_client.table("recipes").select("*", count="exact")
        
        if user_id:
            query = query.eq("user_id", user_id)
        
        response = query.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
        
        total = response.count or 0
        
        return {
            "recipes": response.data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size if total > 0 else 0
        }
    
    def get_recipe_stats(self, user_id: str) -> Dict[str, Any]:
        """Get recipe statistics for a user"""
        response = self.supabase.table("recipes").select("*").eq("user_id", user_id).execute()
        
        recipes = response.data
        
        public_count = sum(1 for r in recipes if r.get("is_public", False))
        private_count = sum(1 for r in recipes if not r.get("is_public", True))
        ai_generated = sum(1 for r in recipes if r.get("is_ai_generated", False))
        
        cuisines = list(set(r.get("cuisine") for r in recipes if r.get("cuisine")))
        categories = list(set(r.get("category") for r in recipes if r.get("category")))
        
        return {
            "total_recipes": len(recipes),
            "public_recipes": public_count,
            "private_recipes": private_count,
            "ai_generated": ai_generated,
            "cuisines": cuisines,
            "categories": categories
        }
    
    def toggle_recipe_visibility(self, recipe_id: str, user_id: str, is_admin: bool = False) -> Dict[str, Any]:
        """Toggle recipe public/private visibility"""
        recipe = self.get_recipe_by_id(recipe_id)
        
        if not recipe:
            raise ValueError("Recipe not found")
        
        if recipe["user_id"] != user_id and not is_admin:
            raise ValueError("Not authorized to modify this recipe")
        
        new_visibility = not recipe.get("is_public", True)
        
        response = self.supabase.table("recipes").update({
            "is_public": new_visibility,
            "updated_at": "now()"
        }).eq("id", recipe_id).execute()
        
        if not response.data:
            raise ValueError("Failed to update recipe visibility")
        
        return response.data[0]
