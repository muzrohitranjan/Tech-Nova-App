from supabase import create_client, Client
from app.config import settings

# Supabase client instance - handle missing or invalid credentials
def _create_supabase_client():
    url = getattr(settings, 'supabase_url', None) or ""
    key = getattr(settings, 'supabase_anon_key', None) or ""
    
    # Check if credentials are valid (not empty and not placeholder)
    if url and key and "your-" not in url.lower() and "placeholder" not in key.lower() and url.startswith("http"):
        try:
            return create_client(url, key)
        except Exception:
            return None
    return None

supabase: Client = _create_supabase_client()


def get_supabase_client() -> Client:
    """Get the Supabase client instance"""
    return supabase


def get_service_client() -> Client:
    """Get Supabase client with service role key for admin operations"""
    url = getattr(settings, 'supabase_url', None) or ""
    key = getattr(settings, 'supabase_service_key', None) or ""
    
    if url and key:
        return create_client(url, key)
    return supabase


async def init_db():
    """Initialize database tables - run this on startup"""
    # Note: Tables should be created in Supabase Dashboard
    # This function can be used for any additional initialization
    pass
