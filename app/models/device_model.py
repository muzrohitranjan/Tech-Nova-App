"""Device Model for Supabase database"""

from typing import Dict, Any, Optional


class DeviceModel:
    """Device model for managing device tokens in Supabase"""
    
    TABLE_NAME = "device_tokens"
    
    # Column definitions
    COLUMNS = {
        "id": "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id": "uuid REFERENCES profiles(id) ON DELETE CASCADE",
        "device_token": "text NOT NULL",
        "device_type": "text NOT NULL CHECK (device_type IN ('mobile', 'tablet', 'laptop'))",
        "device_name": "text",
        "device_model": "text",
        "os_type": "text CHECK (os_type IN ('ios', 'android', 'windows', 'macos', 'linux'))",
        "os_version": "text",
        "app_version": "text",
        "push_provider": "text CHECK (push_provider IN ('fcm', 'apns', 'none'))",
        "is_active": "boolean DEFAULT true",
        "last_used_at": "timestamp with time zone DEFAULT NOW()",
        "created_at": "timestamp with time zone DEFAULT NOW()"
    }
    
    @staticmethod
    def get_table_definition() -> str:
        """Returns SQL for creating the device_tokens table"""
        return """
        CREATE TABLE IF NOT EXISTS device_tokens (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
            device_token text NOT NULL,
            device_type text NOT NULL CHECK (device_type IN ('mobile', 'tablet', 'laptop')),
            device_name text,
            device_model text,
            os_type text CHECK (os_type IN ('ios', 'android', 'windows', 'macos', 'linux')),
            os_version text,
            app_version text,
            push_provider text CHECK (push_provider IN ('fcm', 'apns', 'none')),
            is_active boolean DEFAULT true,
            last_used_at timestamp with time zone DEFAULT NOW(),
            created_at timestamp with time zone DEFAULT NOW()
        );
        """
    
    @staticmethod
    def get_rls_policies() -> str:
        """Returns SQL for Row Level Security policies"""
        return """
        -- Enable RLS on device_tokens
        ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;
        
        -- Users can view own devices
        CREATE POLICY "Users can view own devices"
        ON device_tokens FOR SELECT
        USING (user_id = auth.uid());
        
        -- Users can insert own devices
        CREATE POLICY "Users can insert own devices"
        ON device_tokens FOR INSERT
        WITH CHECK (user_id = auth.uid());
        
        -- Users can update own devices
        CREATE POLICY "Users can update own devices"
        ON device_tokens FOR UPDATE
        USING (user_id = auth.uid());
        
        -- Users can delete own devices
        CREATE POLICY "Users can delete own devices"
        ON device_tokens FOR DELETE
        USING (user_id = auth.uid());
        
        -- Admins can view all devices
        CREATE POLICY "Admins can view all devices"
        ON device_tokens FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            )
        );
        """
    
    @staticmethod
    def get_indexes() -> str:
        """Returns SQL for creating indexes"""
        return """
        CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);
        CREATE INDEX IF NOT EXISTS idx_device_tokens_device_token ON device_tokens(device_token);
        CREATE INDEX IF NOT EXISTS idx_device_tokens_device_type ON device_tokens(device_type);
        CREATE INDEX IF NOT EXISTS idx_device_tokens_is_active ON device_tokens(is_active);
        """
    
    @staticmethod
    def build_insert_data(
        user_id: str,
        device_token: str,
        device_type: str,
        device_name: Optional[str] = None,
        device_model: Optional[str] = None,
        os_type: Optional[str] = None,
        os_version: Optional[str] = None,
        app_version: Optional[str] = None,
        push_provider: Optional[str] = "none"
    ) -> Dict[str, Any]:
        """Build data dictionary for inserting a device token"""
        data = {
            "user_id": user_id,
            "device_token": device_token,
            "device_type": device_type,
            "is_active": True
        }
        
        if device_name:
            data["device_name"] = device_name
        if device_model:
            data["device_model"] = device_model
        if os_type:
            data["os_type"] = os_type
        if os_version:
            data["os_version"] = os_version
        if app_version:
            data["app_version"] = app_version
        if push_provider:
            data["push_provider"] = push_provider
            
        return data

