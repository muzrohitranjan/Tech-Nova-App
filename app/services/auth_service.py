from typing import Optional, Dict, Any
from supabase import Client
from app.database import get_supabase_client, get_service_client
from app.schemas.user_schema import UserCreate, UserLogin, UserUpdate
from app.utils.security import get_password_hash, verify_password, create_tokens
from app.config import settings


class AuthService:
    """Service for handling authentication operations"""
    
    def __init__(self, supabase: Client = None):
        self.supabase = supabase or get_supabase_client()
        self.service_client = get_service_client()
    
    def register_user(self, user_data: UserCreate) -> Dict[str, Any]:
        """Register a new user"""
        # Check if passwords match
        if user_data.password != user_data.confirm_password:
            raise ValueError("Passwords do not match")
        
        # Check if user already exists
        existing_user = self.supabase.table("profiles").select("*").eq("email", user_data.email).execute()
        
        if existing_user.data:
            raise ValueError("User with this email already exists")
        
        # Create user in Supabase Auth
        try:
            auth_response = self.supabase.auth.sign_up({
                "email": user_data.email,
                "password": user_data.password
            })
            
            if not auth_response.user:
                raise ValueError("Failed to create user")
            
            user_id = auth_response.user.id
            
            # Create user profile
            profile_data = {
                "id": user_id,
                "email": user_data.email,
                "full_name": user_data.full_name,
                "avatar_url": user_data.avatar_url,
                "role": "user",
                "is_active": True
            }
            
            profile_response = self.service_client.table("profiles").insert(profile_data).execute()
            
            if not profile_response.data:
                # Rollback: delete auth user if profile creation fails
                self.service_client.auth.admin.delete_user(user_id)
                raise ValueError("Failed to create user profile")
            
            # Create tokens
            tokens = create_tokens(user_id, user_data.email, "user")
            
            return {
                "user": profile_response.data[0],
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "token_type": tokens["token_type"]
            }
            
        except Exception as e:
            raise ValueError(f"Registration failed: {str(e)}")
    
    def login_user(self, login_data: UserLogin) -> Dict[str, Any]:
        """Authenticate a user and return tokens"""
        try:
            # Authenticate with Supabase
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": login_data.email,
                "password": login_data.password
            })
            
            if not auth_response.user:
                raise ValueError("Invalid email or password")
            
            user_id = auth_response.user.id
            
            # Get user profile
            profile_response = self.supabase.table("profiles").select("*").eq("id", user_id).execute()
            
            if not profile_response.data:
                raise ValueError("User profile not found")
            
            user = profile_response.data[0]
            
            # Check if user is active
            if not user.get("is_active", True):
                raise ValueError("User account is disabled")
            
            # Create tokens
            tokens = create_tokens(user_id, login_data.email, user.get("role", "user"))
            
            return {
                "user": user,
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "token_type": tokens["token_type"]
            }
            
        except Exception as e:
            if "Invalid" in str(e):
                raise ValueError("Invalid email or password")
            raise ValueError(f"Login failed: {str(e)}")
    
    def logout_user(self, user_id: str) -> bool:
        """Logout a user"""
        try:
            self.supabase.auth.sign_out()
            return True
        except Exception:
            return False
    
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        response = self.supabase.table("profiles").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data else None
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        response = self.supabase.table("profiles").select("*").eq("email", email).execute()
        return response.data[0] if response.data else None
    
    def update_user(self, user_id: str, user_data: UserUpdate) -> Dict[str, Any]:
        """Update user profile"""
        update_data = user_data.model_dump(exclude_unset=True)
        
        if not update_data:
            raise ValueError("No data to update")
        
        update_data["updated_at"] = "now()"
        
        response = self.service_client.table("profiles").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise ValueError("Failed to update user")
        
        return response.data[0]
    
    def delete_user(self, user_id: str) -> bool:
        """Delete a user (admin only)"""
        try:
            # Delete profile first (due to foreign key)
            self.service_client.table("profiles").delete().eq("id", user_id).execute()
            
            # Delete auth user
            self.service_client.auth.admin.delete_user(user_id)
            
            return True
        except Exception as e:
            raise ValueError(f"Failed to delete user: {str(e)}")
    
    def get_all_users(self, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
        """Get all users (admin only)"""
        offset = (page - 1) * page_size
        
        response = self.service_client.table("profiles").select("*").order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
        
        count_response = self.service_client.table("profiles").select("*", count="exact").execute()
        total = count_response.count or 0
        
        return {
            "users": response.data,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    
    def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh access token using refresh token"""
        try:
            # Decode refresh token
            from app.utils.security import decode_token
            payload = decode_token(refresh_token)
            
            if not payload or payload.get("type") != "refresh":
                raise ValueError("Invalid refresh token")
            
            user_id = payload.get("sub")
            email = payload.get("email")
            
            if not user_id or not email:
                raise ValueError("Invalid token payload")
            
            # Get user to get current role
            user = self.get_user_by_id(user_id)
            if not user:
                raise ValueError("User not found")
            
            # Create new tokens
            tokens = create_tokens(user_id, email, user.get("role", "user"))
            
            return {
                "access_token": tokens["access_token"],
                "refresh_token": tokens["refresh_token"],
                "token_type": tokens["token_type"]
            }
            
        except Exception as e:
            raise ValueError(f"Token refresh failed: {str(e)}")
