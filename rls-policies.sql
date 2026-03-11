-- Drop old policies so this file can be re-run safely
DROP POLICY IF EXISTS "Profiles Select Policy" ON public.profiles;
DROP POLICY IF EXISTS "Recipes Select Policy" ON public.recipes;
DROP POLICY IF EXISTS "Recipes Insert Policy" ON public.recipes;
DROP POLICY IF EXISTS "Recipes Update Policy" ON public.recipes;
DROP POLICY IF EXISTS "Recipes Delete Policy" ON public.recipes;

-- Remove any legacy recipe policies (including ones that still reference user_id)
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'recipes'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.recipes;', policy_record.policyname);
  END LOOP;
END $$;

-- Profiles Select Policy
CREATE POLICY "Profiles Select Policy"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id
  OR public.is_admin()
);

-- Recipes Policies (uses created_by column)
CREATE POLICY "Recipes Select Policy"
ON public.recipes
FOR SELECT
USING (
  auth.uid() = created_by
  OR public.is_admin()
);

CREATE POLICY "Recipes Insert Policy"
ON public.recipes
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  OR public.is_admin()
);

CREATE POLICY "Recipes Update Policy"
ON public.recipes
FOR UPDATE
USING (
  auth.uid() = created_by
  OR public.is_admin()
)
WITH CHECK (
  auth.uid() = created_by
  OR public.is_admin()
);

CREATE POLICY "Recipes Delete Policy"
ON public.recipes
FOR DELETE
USING (
  auth.uid() = created_by
  OR public.is_admin()
);