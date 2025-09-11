-- Create municipal teams table
CREATE TABLE public.municipal_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL,
  city_name TEXT NOT NULL,
  state_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for municipal teams
ALTER TABLE public.municipal_teams ENABLE ROW LEVEL SECURITY;

-- Create municipal admin credentials table
CREATE TABLE public.municipal_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  team_id UUID REFERENCES public.municipal_teams(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for municipal admins
ALTER TABLE public.municipal_admins ENABLE ROW LEVEL SECURITY;

-- Add priority and contact info to issues table
ALTER TABLE public.issues ADD COLUMN priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE public.issues ADD COLUMN contact_phone TEXT;
ALTER TABLE public.issues ADD COLUMN contact_email TEXT;
ALTER TABLE public.issues ADD COLUMN assigned_team_id UUID REFERENCES public.municipal_teams(id);
ALTER TABLE public.issues ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.issues ADD COLUMN resolution_notes TEXT;

-- Insert demo team
INSERT INTO public.municipal_teams (team_name, city_name, state_name, contact_email) 
VALUES ('For_Demo_Only', 'Vijayawada', 'Andhra Pradesh', 'prajyottope@gmail.com');

-- Insert demo admin credentials
INSERT INTO public.municipal_admins (email, password_hash, team_id) 
SELECT 'prajyottope@gmail.com', 
       crypt('Prajyot@0404', gen_salt('bf')), 
       id 
FROM public.municipal_teams 
WHERE team_name = 'For_Demo_Only' AND city_name = 'Vijayawada';

-- RLS Policies for municipal_teams
CREATE POLICY "Municipal teams are publicly readable for team selection"
ON public.municipal_teams
FOR SELECT
USING (true);

CREATE POLICY "Municipal admins can update their team"
ON public.municipal_teams
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.municipal_admins 
  WHERE municipal_admins.team_id = municipal_teams.id 
  AND municipal_admins.email = current_setting('app.current_user_email', true)
));

-- RLS Policies for municipal_admins  
CREATE POLICY "Municipal admins can view their own record"
ON public.municipal_admins
FOR SELECT
USING (email = current_setting('app.current_user_email', true));

CREATE POLICY "Municipal admins can update their own record"
ON public.municipal_admins
FOR UPDATE
USING (email = current_setting('app.current_user_email', true));

-- Update issues RLS policies for municipal team access
CREATE POLICY "Municipal teams can view assigned issues"
ON public.issues
FOR SELECT
USING (
  assigned_team_id IN (
    SELECT team_id FROM public.municipal_admins 
    WHERE email = current_setting('app.current_user_email', true)
  )
);

CREATE POLICY "Municipal teams can update assigned issues"
ON public.issues
FOR UPDATE
USING (
  assigned_team_id IN (
    SELECT team_id FROM public.municipal_admins 
    WHERE email = current_setting('app.current_user_email', true)
  )
);

-- Create trigger for updated_at on municipal tables
CREATE TRIGGER update_municipal_teams_updated_at
BEFORE UPDATE ON public.municipal_teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_municipal_admins_updated_at
BEFORE UPDATE ON public.municipal_admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;