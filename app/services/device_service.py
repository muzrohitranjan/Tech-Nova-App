"""Device Service - Business logic for device token management"""

from typing import Dict, Any, Optional, List
from datetime import datetime
from supabase import Client

from app.database import get_supabase_client
from app.models.device_model import DeviceModel
from app.schemas.device_schema import (
    DeviceTokenCreate,
    DeviceTokenUpdate,
    DeviceTokenResponse,
    DeviceTokenListResponse
)


class DeviceService:
    """Service for managing device tokens for push notifications"""
    
    def __init__(self):
        self.supabase: Client = get_supabase_client()
    
    def register_device(
        self,
        user_id: str,
        device_data: DeviceTokenCreate
    ) -> DeviceTokenResponse:
        """
        Register a new device token for the user.
        If the device token already exists, update it.
        
        Args:
            user_id: The user's ID
            device_data: Device token data
            
        Returns:
            The created/updated device token
        """
        # Check if device token already exists for this user
        existing = self._get_device_by_token(user_id, device_data.device_token)
        
        if existing:
            # Update existing device
            return self._update_device(existing["id"], device_data)
        
        # Create new device token
        data = DeviceModel.build_insert_data(
            user_id=user_id,
            device_token=device_data.device_token,
            device_type=device_data.device_type.value,
            device_name=device_data.device_name,
            device_model=device_data.device_model,
            os_type=device_data.os_type.value if device_data.os_type else None,
            os_version=device_data.os_version,
            app_version=device_data.app_version,
            push_provider=device_data.push_provider.value if device_data.push_provider else "none"
        )
        
        response = self.supabase.table(DeviceModel.TABLE_NAME).insert(data).execute()
        
        if response.error:
            raise ValueError(f"Failed to register device: {response.error.message}")
        
        return self._parse_device_response(response.data[0])
    
    def update_device(
        self,
        device_id: str,
        user_id: str,
        update_data: DeviceTokenUpdate
    ) -> DeviceTokenResponse:
        """
        Update a device token.
        
        Args:
            device_id: The device token ID
            user_id: The user's ID (for authorization)
            update_data: Fields to update
            
        Returns:
            Updated device token
        """
        # Verify ownership
        device = self._get_device_by_id(device_id)
        if not device or device["user_id"] != user_id:
            raise ValueError("Device not found or unauthorized")
        
        return self._update_device(device_id, update_data)
    
    def _update_device(
        self,
        device_id: str,
        update_data: Any
    ) -> DeviceTokenResponse:
        """
        Internal method to update a device token.
        """
        # Build update dictionary (exclude None values)
        data = {}
        if hasattr(update_data, 'device_name') and update_data.device_name is not None:
            data["device_name"] = update_data.device_name
        if hasattr(update_data, 'device_model') and update_data.device_model is not None:
            data["device_model"] = update_data.device_model
        if hasattr(update_data, 'os_type') and update_data.os_type is not None:
            data["os_type"] = update_data.os_type.value
        if hasattr(update_data, 'os_version') and update_data.os_version is not None:
            data["os_version"] = update_data.os_version
        if hasattr(update_data, 'app_version') and update_data.app_version is not None:
            data["app_version"] = update_data.app_version
        if hasattr(update_data, 'push_provider') and update_data.push_provider is not None:
            data["push_provider"] = update_data.push_provider.value
        if hasattr(update_data, 'is_active') and update_data.is_active is not None:
            data["is_active"] = update_data.is_active
        
        # Always update last_used_at
        data["last_used_at"] = datetime.utcnow().isoformat()
        
        if not data:
            raise ValueError("No fields to update")
        
        response = self.supabase.table(DeviceModel.TABLE_NAME).update(data).eq("id", device_id).execute()
        
        if response.error:
            raise ValueError(f"Failed to update device: {response.error.message}")
        
        return self._parse_device_response(response.data[0])
    
    def delete_device(
        self,
        device_id: str,
        user_id: str
    ) -> bool:
        """
        Delete a device token.
        
        Args:
            device_id: The device token ID
            user_id: The user's ID (for authorization)
            
        Returns:
            True if deleted successfully
        """
        # Verify ownership
        device = self._get_device_by_id(device_id)
        if not device or device["user_id"] != user_id:
            raise ValueError("Device not found or unauthorized")
        
        response = self.supabase.table(DeviceModel.TABLE_NAME).delete().eq("id", device_id).execute()
        
        if response.error:
            raise ValueError(f"Failed to delete device: {response.error.message}")
        
        return True
    
    def get_user_devices(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 20
    ) -> DeviceTokenListResponse:
        """
        Get all device tokens for a user.
        
        Args:
            user_id: The user's ID
            page: Page number (1-indexed)
            page_size: Number of items per page
            
        Returns:
            List of device tokens with pagination info
        """
        offset = (page - 1) * page_size
        
        # Get total count
        count_response = self.supabase.table(DeviceModel.TABLE_NAME).select("*", count="exact").eq("user_id", user_id).execute()
        total = count_response.count or 0
        
        # Get paginated results
        response = self.supabase.table(DeviceModel.TABLE_NAME).select("*").eq("user_id", user_id).order("last_used_at", desc=True).range(offset, offset + page_size - 1).execute()
        
        devices = [self._parse_device_response(device) for device in response.data]
        
        return DeviceTokenListResponse(
            devices=devices,
            total=total,
            page=page,
            page_size=page_size
        )
    
    def get_device_by_id(
        self,
        device_id: str,
        user_id: str
    ) -> Optional[DeviceTokenResponse]:
        """
        Get a specific device token by ID.
        
        Args:
            device_id: The device token ID
            user_id: The user's ID (for authorization)
            
        Returns:
            Device token if found and authorized
        """
        device = self._get_device_by_id(device_id)
        if not device or device["user_id"] != user_id:
            return None
        return self._parse_device_response(device)
    
    def update_last_used(
        self,
        device_id: str,
        user_id: str
    ) -> bool:
        """
        Update the last_used_at timestamp for a device.
        
        Args:
            device_id: The device token ID
            user_id: The user's ID
            
        Returns:
            True if updated successfully
        """
        device = self._get_device_by_id(device_id)
        if not device or device["user_id"] != user_id:
            raise ValueError("Device not found or unauthorized")
        
        response = self.supabase.table(DeviceModel.TABLE_NAME).update({
            "last_used_at": datetime.utcnow().isoformat()
        }).eq("id", device_id).execute()
        
        if response.error:
            raise ValueError(f"Failed to update device: {response.error.message}")
        
        return True
    
    def deactivate_device(
        self,
        device_id: str,
        user_id: str
    ) -> DeviceTokenResponse:
        """
        Deactivate a device token (soft delete).
        
        Args:
            device_id: The device token ID
            user_id: The user's ID
            
        Returns:
            Updated device token
        """
        device = self._get_device_by_id(device_id)
        if not device or device["user_id"] != user_id:
            raise ValueError("Device not found or unauthorized")
        
        response = self.supabase.table(DeviceModel.TABLE_NAME).update({
            "is_active": False,
            "last_used_at": datetime.utcnow().isoformat()
        }).eq("id", device_id).execute()
        
        if response.error:
            raise ValueError(f"Failed to deactivate device: {response.error.message}")
        
        return self._parse_device_response(response.data[0])
    
    def _get_device_by_id(self, device_id: str) -> Optional[Dict[str, Any]]:
        """Get device by ID"""
        response = self.supabase.table(DeviceModel.TABLE_NAME).select("*").eq("id", device_id).execute()
        return response.data[0] if response.data else None
    
    def _get_device_by_token(self, user_id: str, device_token: str) -> Optional[Dict[str, Any]]:
        """Get device by token for a specific user"""
        response = self.supabase.table(DeviceModel.TABLE_NAME).select("*").eq("user_id", user_id).eq("device_token", device_token).execute()
        return response.data[0] if response.data else None
    
    def _parse_device_response(self, data: Dict[str, Any]) -> DeviceTokenResponse:
        """Parse database response to DeviceTokenResponse"""
        return DeviceTokenResponse(
            id=data["id"],
            user_id=data["user_id"],
            device_token=data["device_token"],
            device_type=data["device_type"],
            device_name=data.get("device_name"),
            device_model=data.get("device_model"),
            os_type=data.get("os_type"),
            os_version=data.get("os_version"),
            app_version=data.get("app_version"),
            push_provider=data.get("push_provider"),
            is_active=data.get("is_active", True),
            last_used_at=data.get("last_used_at"),
            created_at=data["created_at"]
        )

