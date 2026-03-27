-- ==========================================
-- 1. THE RETROACTIVE FIX (Granting your Superadmin Keys)
-- This takes any user currently in the hidden auth.users table 
-- and forcibly creates a 'superadmin' profile for them.
-- ==========================================
INSERT INTO public.profiles (id, role, display_name)
SELECT 
  id, 
  'superadmin'::public.app_role, 
  split_part(email, '@', 1) -- Grabs the first part of your email as a default display name
FROM auth.users
ON CONFLICT (id) DO NOTHING; -- Prevents errors if you run it twice

-- ==========================================
-- 2. THE PERMANENT ARCHITECTURE (The Auth Trigger)
-- This function will fire automatically every time a NEW user is created.
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id,
    -- Architect Logic: If this is the VERY FIRST user in the database, make them superadmin. 
    -- Otherwise, default them to the lowest clearance ('operator').
    CASE 
      WHEN (SELECT count(*) FROM public.profiles) = 0 THEN 'superadmin'::public.app_role 
      ELSE 'operator'::public.app_role 
    END,
    split_part(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. WIRE UP THE TRIGGER TO THE HIDDEN AUTH SCHEMA
-- ==========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();