-- Tech Nova App Database Setup Script
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- ==================== PROFILES TABLE ====================

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

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (auth.role() = 'authenticated');


-- ==================== RECIPES TABLE ====================

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
    ingredients jsonb DEFAULT '[]'::jsonb,
    instructions jsonb DEFAULT '[]'::jsonb,
    image_url text,
    tags jsonb DEFAULT '[]'::jsonb,
    is_public boolean DEFAULT true,
    is_ai_generated boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS on recipes
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
CREATE POLICY "Public recipes are viewable by everyone"
ON recipes FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can view own recipes"
ON recipes FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own recipes"
ON recipes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own recipes"
ON recipes FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own recipes"
ON recipes FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all recipes"
ON recipes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can update any recipe"
ON recipes FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can delete any recipe"
ON recipes FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);


-- ==================== INDEXES ====================

-- Index for faster recipe lookups
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_is_public ON recipes(is_public);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);


-- ==================== TRIGGERS ====================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==================== DEVICE TOKENS TABLE (For Push Notifications) ====================

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

-- Enable RLS on device_tokens
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for device_tokens
CREATE POLICY "Users can view own devices"
ON device_tokens FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own devices"
ON device_tokens FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own devices"
ON device_tokens FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own devices"
ON device_tokens FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all devices"
ON device_tokens FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Indexes for device_tokens
CREATE INDEX IF NOT EXISTS idx_device_tokens_user_id ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_device_token ON device_tokens(device_token);
CREATE INDEX IF NOT EXISTS idx_device_tokens_device_type ON device_tokens(device_type);
CREATE INDEX IF NOT EXISTS idx_device_tokens_is_active ON device_tokens(is_active);


-- ==================== SEED DATA (Optional) ====================

-- Insert a default admin user (run this manually if needed)
-- Note: You need to first create a user through the app or Supabase UI
-- Then update their role to admin:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
