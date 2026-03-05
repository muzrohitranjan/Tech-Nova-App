from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ============== User Schemas ==============

class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "full_name": "John Doe",
                "password": "securepassword123",
                "confirm_password": "securepassword123"
            }
        }


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """Schema for user response"""
    id: str
    role: str = "user"
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    """Schema for user profile response"""
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============== Token Schemas ==============

class Token(BaseModel):
    """Schema for access token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """Schema for token payload data"""
    user_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Schema for password reset request"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)
