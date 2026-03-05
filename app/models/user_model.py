from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func


class UserModel:
    """User model for Supabase database"""
    
    TABLE_NAME = "profiles"
    
    # Column definitions (for reference when creating tables in Supabase)
    COLUMNS = {
        "id": "uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE",
        "email": "text UNIQUE NOT NULL",
        "full_name": "text",
        "avatar_url": "text",
        "role": "text DEFAULT 'user' CHECK (role IN ('user', 'admin'))",
        "is_active": "boolean DEFAULT true",
        "created_at": "timestamp with time zone DEFAULT NOW()",
        "updated_at": "timestamp with time zone DEFAULT NOW()"
    }
    
    @staticmethod
    def get_table_definition() -> str:
        """Returns SQL for creating the profiles table"""
        return """
        CREATE TABLE IF NOT EXISTS profiles (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text UNIQUE NOT NULL,
            full_name text,
            avatar_url text,
            role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
            is_active boolean DEFAULT true,
            created_at timestamp with time zone DEFAULT NOW(),
            updated_at timestamp with time zone DEFAULT NOW()
        );
        """
    
    @staticmethod
    def get_rls_policies() -> str:
        """Returns SQL for Row Level Security policies"""
        return """
        -- Enable RLS on profiles table
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        -- Users can read all profiles
        CREATE POLICY "Public profiles are viewable by everyone"
        ON profiles FOR SELECT
        USING (true);
        
        -- Users can update their own profile
        CREATE POLICY "Users can update own profile"
        ON profiles FOR UPDATE
        USING (auth.uid() = id);
        
        -- Only admins can insert profiles
        CREATE POLICY "Admins can insert profiles"
        ON profiles FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');
        
        -- Only admins can delete profiles
        CREATE POLICY "Admins can delete profiles"
        ON profiles FOR DELETE
        USING (auth.role() = 'authenticated');
        """
