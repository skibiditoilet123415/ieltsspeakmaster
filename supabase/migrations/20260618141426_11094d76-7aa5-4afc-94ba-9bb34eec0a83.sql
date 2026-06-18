
-- Replace self-referential WITH CHECK with simple ownership check
DROP POLICY IF EXISTS "own profile update" ON public.profiles;
CREATE POLICY "own profile update"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Enforce is_premium immutability from client/user roles via trigger
CREATE OR REPLACE FUNCTION public.protect_profile_premium()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
    IF current_setting('role', true) NOT IN ('service_role', 'supabase_admin', 'postgres') THEN
      NEW.is_premium := OLD.is_premium;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_premium_trg ON public.profiles;
CREATE TRIGGER protect_profile_premium_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_premium();
