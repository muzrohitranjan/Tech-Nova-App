"""Device Routes - API endpoints for device token management"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, Any, List, Optional

from app.schemas.device_schema import (
    DeviceTokenCreate,
    DeviceTokenUpdate,
    DeviceTokenResponse,
    DeviceTokenListResponse,
    DeviceRegistrationResponse,
    DeviceInfo
)
from app.services.device_service import DeviceService
from app.utils.security import get_current_active_user
from app.middleware.device_detection import get_device_type, get_device_info


router = APIRouter(prefix="/api/devices", tags=["Devices"])


@router.post("/register", response_model=DeviceRegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_device(
    device_data: DeviceTokenCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Register a new device token for push notifications.
    
    The device_type can also be automatically detected from User-Agent if not provided.
    """
    try:
        device_service = DeviceService()
        device = device_service.register_device(
            user_id=current_user["id"],
            device_data=device_data
        )
        return DeviceRegistrationResponse(
            message="Device registered successfully",
            device=device
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register device: {str(e)}"
        )


@router.post("/register-auto", response_model=DeviceRegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_device_auto_detect(
    device_data: DeviceTokenCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Register device with auto-detection of device type from User-Agent.
    
    If device_type is not provided in the request, it will be detected automatically
    from the User-Agent header.
    """
    try:
        device_service = DeviceService()
        
        # If device_type not provided, try to detect from request
        if not device_data.device_type:
            # Device type will be detected by middleware and stored in request.state
            # For now, we default to mobile if not specified
            from app.schemas.device_schema import DeviceTypeEnum
            device_data.device_type = DeviceTypeEnum.MOBILE
        
        device = device_service.register_device(
            user_id=current_user["id"],
            device_data=device_data
        )
        return DeviceRegistrationResponse(
            message="Device registered successfully",
            device=device
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to register device: {str(e)}"
        )


@router.get("/", response_model=DeviceTokenListResponse)
async def get_my_devices(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get all devices registered for the current user"""
    try:
        device_service = DeviceService()
        result = device_service.get_user_devices(
            user_id=current_user["id"],
            page=page,
            page_size=page_size
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch devices: {str(e)}"
        )


@router.get("/{device_id}", response_model=DeviceTokenResponse)
async def get_device(
    device_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Get a specific device by ID"""
    try:
        device_service = DeviceService()
        device = device_service.get_device_by_id(
            device_id=device_id,
            user_id=current_user["id"]
        )
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )
        return device
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch device: {str(e)}"
        )


@router.put("/{device_id}", response_model=DeviceTokenResponse)
async def update_device(
    device_id: str,
    device_data: DeviceTokenUpdate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Update a device token"""
    try:
        device_service = DeviceService()
        device = device_service.update_device(
            device_id=device_id,
            user_id=current_user["id"],
            update_data=device_data
        )
        return device
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update device: {str(e)}"
        )


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(
    device_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Delete a device token"""
    try:
        device_service = DeviceService()
        success = device_service.delete_device(
            device_id=device_id,
            user_id=current_user["id"]
        )
        if success:
            return None
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete device"
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete device: {str(e)}"
        )


@router.patch("/{device_id}/deactivate", response_model=DeviceTokenResponse)
async def deactivate_device(
    device_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """Deactivate a device token (soft delete)"""
    try:
        device_service = DeviceService()
        device = device_service.deactivate_device(
            device_id=device_id,
            user_id=current_user["id"]
        )
        return device
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to deactivate device: {str(e)}"
        )


@router.post("/{device_id}/heartbeat", status_code=status.HTTP_200_OK)
async def device_heartbeat(
    device_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Update device last_used_at timestamp.
    
    Call this periodically from the mobile app to indicate the device is active.
    """
    try:
        device_service = DeviceService()
        device_service.update_last_used(
            device_id=device_id,
            user_id=current_user["id"]
        )
        return {"message": "Heartbeat received"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update heartbeat: {str(e)}"
        )


@router.get("/info/current", response_model=DeviceInfo)
async def get_current_device_info(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Get device information for the current request.
    
    This endpoint returns information about the device making the request,
    including detected device type, OS, etc.
    """
    # Note: To get device info from request, we need to add the middleware
    # This is a placeholder that would need to be connected to request state
    return DeviceInfo(
        device_type="mobile",  # Would be detected from request
        os_type="ios",
        os_version="15.0",
        browser="safari",
        is_ios=True,
        is_android=False
    )

