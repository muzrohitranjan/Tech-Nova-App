class RecipeModel:
    """Recipe model for Supabase database"""
    
    TABLE_NAME = "recipes"
    
    # Column definitions (for reference when creating tables in Supabase)
    COLUMNS = {
        "id": "uuid PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id": "uuid REFERENCES profiles(id) ON DELETE CASCADE",
        "title": "text NOT NULL",
        "description": "text",
        "cuisine": "text",
        "category": "text",
        "prep_time": "integer",  # in minutes
        "cook_time": "integer",  # in minutes
        "servings": "integer",
        "difficulty": "text CHECK (difficulty IN ('easy', 'medium', 'hard'))",
        "ingredients": "jsonb",
        "instructions": "jsonb",
        "image_url": "text",
        "tags": "jsonb",
        "is_public": "boolean DEFAULT true",
        "is_ai_generated": "boolean DEFAULT false",
        "created_at": "timestamp with time zone DEFAULT NOW()",
        "updated_at": "timestamp with time zone DEFAULT NOW()"
    }
    
    @staticmethod
    def get_table_definition() -> str:
        """Returns SQL for creating the recipes table"""
        return """
        CREATE TABLE IF NOT EXISTS recipes (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
            title text NOT NULL,
            description text,
            cuisine text,
            category text,
            prep_time integer,
            cook_time integer,
            servings integer,
            difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
            ingredients jsonb,
            instructions jsonb,
            image_url text,
            tags jsonb,
            is_public boolean DEFAULT true,
            is_ai_generated boolean DEFAULT false,
            created_at timestamp with time zone DEFAULT NOW(),
            updated_at timestamp with time zone DEFAULT NOW()
        );
        """
    
    @staticmethod
    def get_rls_policies() -> str:
        """Returns SQL for Row Level Security policies"""
        return """
        -- Enable RLS on recipes table
        ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
        
        -- Everyone can view public recipes
        CREATE POLICY "Public recipes are viewable by everyone"
        ON recipes FOR SELECT
        USING (is_public = true);
        
        -- Users can view their own recipes (both public and private)
        CREATE POLICY "Users can view own recipes"
        ON recipes FOR SELECT
        USING (user_id = auth.uid());
        
        -- Users can insert their own recipes
        CREATE POLICY "Users can insert own recipes"
        ON recipes FOR INSERT
        WITH CHECK (user_id = auth.uid());
        
        -- Users can update their own recipes
        CREATE POLICY "Users can update own recipes"
        ON recipes FOR UPDATE
        USING (user_id = auth.uid());
        
        -- Users can delete their own recipes
        CREATE POLICY "Users can delete own recipes"
        ON recipes FOR DELETE
        USING (user_id = auth.uid());
        
        -- Admins can view all recipes
        CREATE POLICY "Admins can view all recipes"
        ON recipes FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            )
        );
        
        -- Admins can update any recipe
        CREATE POLICY "Admins can update any recipe"
        ON recipes FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            )
        );
        
        -- Admins can delete any recipe
        CREATE POLICY "Admins can delete any recipe"
        ON recipes FOR DELETE
        USING (
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            )
        );
        """
