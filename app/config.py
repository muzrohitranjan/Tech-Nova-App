from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Supabase Configuration
    supabase_url: str
    supabase_anon_key: str
    supabase_service_key: str
    
    # JWT Configuration
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # Application Configuration
    app_name: str = "Tech Nova API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
