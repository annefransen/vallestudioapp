-- Fix the Supabase Authentication trigger to map to the new profiles schema

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handler function to map to first_name, last_name, gmail, etc.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    f_name VARCHAR(100);
    l_name VARCHAR(100);
    full_name_raw TEXT;
BEGIN
    full_name_raw := NEW.raw_user_meta_data->>'full_name';
    
    -- Try to split full_name into first and last name if provided, otherwise default
    IF full_name_raw IS NOT NULL AND position(' ' in full_name_raw) > 0 THEN
        f_name := split_part(full_name_raw, ' ', 1);
        l_name := substring(full_name_raw from position(' ' in full_name_raw) + 1);
    ELSE
        f_name := COALESCE(full_name_raw, 'Guest');
        l_name := 'User';
    END IF;

    -- For manual dashboard creation where there's no metadata, fallback to email prefix
    IF NEW.raw_user_meta_data->>'full_name' IS NULL AND NEW.email IS NOT NULL THEN
        f_name := split_part(NEW.email, '@', 1);
        l_name := '';
    END IF;

    INSERT INTO public.profiles (
        profile_id,
        first_name,
        last_name,
        gmail,
        role,
        phone
    ) VALUES (
        NEW.id,
        f_name,
        l_name,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        NEW.raw_user_meta_data->>'phone'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reattach the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
