-- Tech Nova App PostgreSQL schema (Supabase compatible)
-- Run with: psql <connection_args> -f database/schema.sql (service-role recommended)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Users and auth (Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can select self" ON users;
DROP POLICY IF EXISTS "Users can insert self" ON users;
DROP POLICY IF EXISTS "Users can update self" ON users;
CREATE POLICY "Users can select self" ON users
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can insert self" ON users
  FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update self" ON users
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Core recipes
CREATE TABLE IF NOT EXISTS recipes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  cuisine     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist on pre-existing recipes table
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS cuisine TEXT,
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Recipes readable by owner" ON recipes;
DROP POLICY IF EXISTS "Recipes insert by owner" ON recipes;
DROP POLICY IF EXISTS "Recipes update by owner" ON recipes;
DROP POLICY IF EXISTS "Recipes delete by owner" ON recipes;
CREATE POLICY "Recipes readable by owner" ON recipes
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Recipes insert by owner" ON recipes
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Recipes update by owner" ON recipes
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Recipes delete by owner" ON recipes
  FOR DELETE USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS ingredients (
  id        BIGSERIAL PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  quantity  TEXT
);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Ingredients by recipe owner" ON ingredients;
CREATE POLICY "Ingredients by recipe owner" ON ingredients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes r
      WHERE r.id = ingredients.recipe_id
      AND r.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes r
      WHERE r.id = ingredients.recipe_id
      AND r.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS steps (
  id          BIGSERIAL PRIMARY KEY,
  recipe_id   UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction TEXT NOT NULL,
  UNIQUE (recipe_id, step_number)
);

ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Steps by recipe owner" ON steps;
CREATE POLICY "Steps by recipe owner" ON steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes r
      WHERE r.id = steps.recipe_id
      AND r.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes r
      WHERE r.id = steps.recipe_id
      AND r.user_id = auth.uid()
    )
  );

-- Categories and mapping
CREATE TABLE IF NOT EXISTS categories (
  id   BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS recipe_category (
  recipe_id   UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, category_id)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_category ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories readable by all" ON categories;
CREATE POLICY "Categories readable by all" ON categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recipe-category by owner" ON recipe_category;
CREATE POLICY "Recipe-category by owner" ON recipe_category
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes r
      WHERE r.id = recipe_category.recipe_id
      AND r.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes r
      WHERE r.id = recipe_category.recipe_id
      AND r.user_id = auth.uid()
    )
  );

-- User interactions
CREATE TABLE IF NOT EXISTS saved_recipes (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id  UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, recipe_id)
);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Saved recipes by owner" ON saved_recipes;
CREATE POLICY "Saved recipes by owner" ON saved_recipes
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS search_history (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query       TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Search history by owner" ON search_history;
CREATE POLICY "Search history by owner" ON search_history
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS voice_inputs (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE voice_inputs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Voice inputs by owner" ON voice_inputs;
CREATE POLICY "Voice inputs by owner" ON voice_inputs
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_recipes_title_desc_fts ON recipes USING GIN (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,'')));
CREATE INDEX IF NOT EXISTS idx_ingredients_name_trgm ON ingredients USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes (cuisine);
CREATE INDEX IF NOT EXISTS idx_steps_recipe ON steps (recipe_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user ON saved_recipes (user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history (user_id);
CREATE INDEX IF NOT EXISTS idx_voice_inputs_user ON voice_inputs (user_id);
