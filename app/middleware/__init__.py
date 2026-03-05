"""Middleware package"""
from app.middleware.device_detection import (
    DeviceDetectionMiddleware,
    DeviceType,
    get_device_type,
    get_device_info,
    is_mobile,
    is_tablet,
    is_laptop,
)

__all__ = [
    "DeviceDetectionMiddleware",
    "DeviceType",
    "get_device_type",
    "get_device_info",
    "is_mobile",
    "is_tablet",
    "is_laptop",
]

