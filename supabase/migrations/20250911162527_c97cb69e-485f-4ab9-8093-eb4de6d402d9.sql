-- Drop the complex municipal_admins table and simplify to one teams table
DROP TABLE IF EXISTS public.municipal_admins CASCADE;

-- Add login fields to municipal_teams table
ALTER TABLE public.municipal_teams 
ADD COLUMN IF NOT EXISTS email text UNIQUE NOT NULL DEFAULT 'admin@example.com',
ADD COLUMN IF NOT EXISTS password_hash text NOT NULL DEFAULT 'defaultpassword',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create RLS policies for municipal teams login
DROP POLICY IF EXISTS "Municipal teams can authenticate" ON public.municipal_teams;
CREATE POLICY "Municipal teams can authenticate" 
ON public.municipal_teams 
FOR SELECT 
USING (true);

-- Insert demo team if it doesn't exist
INSERT INTO public.municipal_teams (team_name, city_name, state_name, email, password_hash, contact_email, contact_phone)
VALUES (
  'Pune Municipal Corporation',
  'Pune',
  'Maharashtra', 
  'prajyottope@gmail.com',
  'Prajyot@0404',
  'prajyottope@gmail.com',
  '+91-9876543210'
) ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  team_name = EXCLUDED.team_name,
  city_name = EXCLUDED.city_name,
  state_name = EXCLUDED.state_name;