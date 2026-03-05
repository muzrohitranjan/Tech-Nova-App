"""
Device Detection Middleware

This middleware detects the device type (mobile, tablet, laptop) from the User-Agent header
and adds it to the request state for use in route handlers.
"""

import re
from typing import Optional
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp


class DeviceType:
    """Device type constants"""
    MOBILE = "mobile"
    TABLET = "tablet"
    LAPTOP = "laptop"
    UNKNOWN = "unknown"


class DeviceDetectionMiddleware(BaseHTTPMiddleware):
    """
    Middleware to detect device type from User-Agent header.
    
    Detects:
    - Mobile phones (iPhone, Android phones, etc.)
    - Tablets (iPad, Android tablets, etc.)
    - Laptops/Desktops (Windows, Mac, Linux)
    """
    
    # Mobile patterns (phones)
    MOBILE_PATTERNS = [
        # Android phones
        r'Android.*Mobile',
        r'Android.*(?:SM-|Galaxy|Pixel)',
        # iPhone
        r'iPhone',
        # Windows Phone
        r'Windows Phone',
        # BlackBerry
        r'BlackBerry',
        # Opera Mini/Mobile
        r'Opera Mini',
        r'Opera Mobile',
        # Generic mobile patterns
        r'Mobile',
        r'mobile',
    ]
    
    # Tablet patterns
    TABLET_PATTERNS = [
        # iPad
        r'iPad',
        # Android tablets
        r'Android.*(?:Tablet|SM-|Galaxy Tab| Nexus)',
        # Kindle
        r'Kindle',
        # Surface
        r'Surface',
    ]
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # Compile regex patterns for efficiency
        self._mobile_pattern = re.compile('|'.join(self.MOBILE_PATTERNS), re.IGNORECASE)
        self._tablet_pattern = re.compile('|'.join(self.TABLET_PATTERNS), re.IGNORECASE)
    
    async def dispatch(self, request: Request, call_next):
        # Get User-Agent header
        user_agent = request.headers.get("user-agent", "")
        
        # Detect device type
        device_type = self._detect_device_type(user_agent)
        
        # Get additional device info
        device_info = self._extract_device_info(user_agent)
        
        # Add to request state
        request.state.device_type = device_type
        request.state.device_info = device_info
        request.state.is_mobile = device_type == DeviceType.MOBILE
        request.state.is_tablet = device_type == DeviceType.TABLET
        request.state.is_laptop = device_type == DeviceType.LAPTOP
        
        # Continue to the next middleware/route handler
        response = await call_next(request)
        
        # Add device type header to response for client reference
        response.headers["X-Device-Type"] = device_type
        
        return response
    
    def _detect_device_type(self, user_agent: str) -> str:
        """
        Detect device type from User-Agent string.
        
        Args:
            user_agent: The User-Agent header value
            
        Returns:
            Device type: 'mobile', 'tablet', 'laptop', or 'unknown'
        """
        if not user_agent:
            return DeviceType.UNKNOWN
        
        # Check for tablet first (more specific)
        if self._tablet_pattern.search(user_agent):
            return DeviceType.TABLET
        
        # Check for mobile
        if self._mobile_pattern.search(user_agent):
            return DeviceType.MOBILE
        
        # Default to laptop/desktop
        return DeviceType.LAPTOP
    
    def _extract_device_info(self, user_agent: str) -> dict:
        """
        Extract additional device information from User-Agent.
        
        Args:
            user_agent: The User-Agent header value
            
        Returns:
            Dictionary with device information
        """
        info = {
            "raw": user_agent,
            "os_type": None,
            "os_version": None,
            "browser": None,
            "is_ios": False,
            "is_android": False,
        }
        
        if not user_agent:
            return info
        
        # Detect OS type
        if "iPhone" in user_agent or "iPad" in user_agent or "iOS" in user_agent:
            info["os_type"] = "ios"
            info["is_ios"] = True
            # Extract iOS version
            match = re.search(r'OS (\d+[._]\d+)', user_agent)
            if match:
                info["os_version"] = match.group(1).replace('_', '.')
        elif "Android" in user_agent:
            info["os_type"] = "android"
            info["is_android"] = True
            # Extract Android version
            match = re.search(r'Android (\d+\.\d+)', user_agent)
            if match:
                info["os_version"] = match.group(1)
        elif "Windows" in user_agent:
            info["os_type"] = "windows"
        elif "Mac" in user_agent:
            info["os_type"] = "macos"
        elif "Linux" in user_agent:
            info["os_type"] = "linux"
        
        # Detect browser
        if "Chrome" in user_agent:
            info["browser"] = "chrome"
        elif "Safari" in user_agent:
            info["browser"] = "safari"
        elif "Firefox" in user_agent:
            info["browser"] = "firefox"
        elif "Edge" in user_agent:
            info["browser"] = "edge"
        
        return info


def get_device_type(request: Request) -> str:
    """
    Helper function to get device type from request state.
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Device type string ('mobile', 'tablet', 'laptop', 'unknown')
    """
    return getattr(request.state, "device_type", DeviceType.UNKNOWN)


def get_device_info(request: Request) -> dict:
    """
    Helper function to get device info from request state.
    
    Args:
        request: FastAPI Request object
        
    Returns:
        Dictionary with device information
    """
    return getattr(request.state, "device_info", {})


def is_mobile(request: Request) -> bool:
    """Check if request is from a mobile device"""
    return getattr(request.state, "is_mobile", False)


def is_tablet(request: Request) -> bool:
    """Check if request is from a tablet device"""
    return getattr(request.state, "is_tablet", False)


def is_laptop(request: Request) -> bool:
    """Check if request is from a laptop/desktop device"""
    return getattr(request.state, "is_laptop", False)

