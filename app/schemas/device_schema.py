"""Pydantic schemas for device tokens"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DeviceTypeEnum(str, Enum):
    """Device type enumeration"""
    MOBILE = "mobile"
    TABLET = "tablet"
    LAPTOP = "laptop"


class OSTypeEnum(str, Enum):
    """Operating system type enumeration"""
    IOS = "ios"
    ANDROID = "android"
    WINDOWS = "windows"
    MACOS = "macos"
    LINUX = "linux"


class PushProviderEnum(str, Enum):
    """Push notification provider enumeration"""
    FCM = "fcm"  # Firebase Cloud Messaging (Android)
    APNS = "apns"  # Apple Push Notification Service (iOS)
    NONE = "none"


class DeviceTokenCreate(BaseModel):
    """Schema for creating a new device token"""
    device_token: str = Field(..., description="Unique device token for push notifications")
    device_type: DeviceTypeEnum = Field(..., description="Type of device: mobile, tablet, or laptop")
    device_name: Optional[str] = Field(None, description="Human-readable device name")
    device_model: Optional[str] = Field(None, description="Device model (e.g., iPhone 13, Pixel 6)")
    os_type: Optional[OSTypeEnum] = Field(None, description="Operating system type")
    os_version: Optional[str] = Field(None, description="OS version (e.g., 15.0, 12)")
    app_version: Optional[str] = Field(None, description="App version (e.g., 1.0.0)")
    push_provider: Optional[PushProviderEnum] = Field(PushProviderEnum.NONE, description="Push notification provider")


class DeviceTokenUpdate(BaseModel):
    """Schema for updating a device token"""
    device_name: Optional[str] = None
    device_model: Optional[str] = None
    os_type: Optional[OSTypeEnum] = None
    os_version: Optional[str] = None
    app_version: Optional[str] = None
    push_provider: Optional[PushProviderEnum] = None
    is_active: Optional[bool] = None


class DeviceTokenResponse(BaseModel):
    """Schema for device token response"""
    id: str
    user_id: str
    device_token: str
    device_type: str
    device_name: Optional[str] = None
    device_model: Optional[str] = None
    os_type: Optional[str] = None
    os_version: Optional[str] = None
    app_version: Optional[str] = None
    push_provider: Optional[str] = None
    is_active: bool
    last_used_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class DeviceTokenListResponse(BaseModel):
    """Schema for list of device tokens"""
    devices: List[DeviceTokenResponse]
    total: int
    page: int
    page_size: int


class DeviceRegistrationResponse(BaseModel):
    """Schema for device registration response"""
    message: str
    device: DeviceTokenResponse


class DeviceInfo(BaseModel):
    """Schema for device information from request headers"""
    device_type: str
    os_type: Optional[str] = None
    os_version: Optional[str] = None
    browser: Optional[str] = None
    is_ios: bool = False
    is_android: bool = False


class CompactRecipeResponse(BaseModel):
    """Compact recipe response for mobile devices"""
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


class CompactUserResponse(BaseModel):
    """Compact user response for mobile devices"""
    id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = "user"
    device_info: Optional[DeviceInfo] = None

