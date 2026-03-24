-- Seed data for Tech Nova App (Supabase-compatible)
-- NOTE: user UUIDs must already exist in auth.users. Adjust IDs/emails as needed.
-- Run after schema is applied: psql <service_role_conn> -f database/seed.sql

-- Ensure required columns exist (for pre-existing users table)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS email CITEXT,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Sample users (replace UUIDs/emails as needed)
INSERT INTO users (id, name, email, password_hash)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alice Example', 'alice@example.com', '$2b$12$examplehashalice'),
  ('22222222-2222-2222-2222-222222222222', 'Bob Example', 'bob@example.com', '$2b$12$examplehashbob')
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (name)
VALUES ('Italian'), ('Dessert'), ('Vegan')
ON CONFLICT (name) DO NOTHING;

-- Recipes and dependent data
INSERT INTO recipes (user_id, title, description, cuisine)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Margherita Pizza', 'Classic Neapolitan pizza.', 'Italian'),
  ('22222222-2222-2222-2222-222222222222', 'Vegan Brownies', 'Rich brownies without dairy.', 'American')
ON CONFLICT DO NOTHING;

-- Ingredients
INSERT INTO ingredients (recipe_id, name, quantity)
SELECT (SELECT id FROM recipes WHERE title = 'Margherita Pizza' LIMIT 1), v.name, v.quantity
FROM (VALUES
  ('Pizza dough', '1 ball'),
  ('Tomato sauce', '1/2 cup'),
  ('Fresh mozzarella', '4 oz'),
  ('Basil leaves', '6 leaves')
) AS v(name, quantity)
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (recipe_id, name, quantity)
SELECT (SELECT id FROM recipes WHERE title = 'Vegan Brownies' LIMIT 1), v.name, v.quantity
FROM (VALUES
  ('All-purpose flour', '1 cup'),
  ('Cocoa powder', '1/2 cup'),
  ('Maple syrup', '1/3 cup'),
  ('Coconut oil', '1/4 cup')
) AS v(name, quantity)
ON CONFLICT DO NOTHING;

-- Steps
INSERT INTO steps (recipe_id, step_number, instruction)
SELECT (SELECT id FROM recipes WHERE title = 'Margherita Pizza' LIMIT 1), v.step_number, v.instruction
FROM (VALUES
  (1, 'Preheat oven to 500F with a stone inside.'),
  (2, 'Stretch dough, add sauce, cheese, and basil.'),
  (3, 'Bake 8-10 minutes until crust is browned.')
) AS v(step_number, instruction)
ON CONFLICT DO NOTHING;

INSERT INTO steps (recipe_id, step_number, instruction)
SELECT (SELECT id FROM recipes WHERE title = 'Vegan Brownies' LIMIT 1), v.step_number, v.instruction
FROM (VALUES
  (1, 'Preheat oven to 350F and line a pan.'),
  (2, 'Mix dry ingredients, then add wet ingredients.'),
  (3, 'Bake 20-25 minutes until set.')
) AS v(step_number, instruction)
ON CONFLICT DO NOTHING;

-- Recipe categories
INSERT INTO recipe_category (recipe_id, category_id)
VALUES
  ((SELECT id FROM recipes WHERE title = 'Margherita Pizza' LIMIT 1), (SELECT id FROM categories WHERE name = 'Italian')),
  ((SELECT id FROM recipes WHERE title = 'Vegan Brownies' LIMIT 1), (SELECT id FROM categories WHERE name = 'Vegan')),
  ((SELECT id FROM recipes WHERE title = 'Vegan Brownies' LIMIT 1), (SELECT id FROM categories WHERE name = 'Dessert'))
ON CONFLICT DO NOTHING;

-- Saved recipes
INSERT INTO saved_recipes (user_id, recipe_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM recipes WHERE title = 'Vegan Brownies' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO search_history (user_id, query)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'vegan brownies')
ON CONFLICT DO NOTHING;

INSERT INTO voice_inputs (user_id, input_text)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'Find Italian pizza recipe')
ON CONFLICT DO NOTHING;
