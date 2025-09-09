-- Add location and role support to the database

-- First, create enum for user roles
CREATE TYPE public.user_role AS ENUM ('citizen', 'admin', 'municipal_staff');

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role user_role DEFAULT 'citizen',
ADD COLUMN phone text;

-- Create locations table with Indian states and tier 1 cities
CREATE TABLE public.locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_name text NOT NULL,
  city_name text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  is_tier1 boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add location fields to issues table
ALTER TABLE public.issues 
ADD COLUMN state text,
ADD COLUMN city text,
ADD COLUMN latitude decimal(10, 8),
ADD COLUMN longitude decimal(11, 8);

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id uuid REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms', 'in_app')),
  message text NOT NULL,
  sent_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  state_name text,
  city_name text,
  issue_count integer DEFAULT 0,
  resolved_count integer DEFAULT 0,
  pending_count integer DEFAULT 0,
  in_progress_count integer DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for locations (publicly readable)
CREATE POLICY "Locations are publicly readable" 
ON public.locations 
FOR SELECT 
USING (true);

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for reports
CREATE POLICY "Municipal staff and admins can view reports" 
ON public.reports 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'municipal_staff')
  )
);

CREATE POLICY "Municipal staff and admins can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'municipal_staff')
  ) AND auth.uid() = created_by
);

-- Insert Indian states and tier 1 cities data
INSERT INTO public.locations (state_name, city_name, latitude, longitude, is_tier1) VALUES
-- Maharashtra
('Maharashtra', 'Mumbai', 19.0760, 72.8777, true),
('Maharashtra', 'Pune', 18.5204, 73.8567, true),
-- Karnataka
('Karnataka', 'Bangalore', 12.9716, 77.5946, true),
-- Telangana
('Telangana', 'Hyderabad', 17.3850, 78.4867, true),
-- Tamil Nadu
('Tamil Nadu', 'Chennai', 13.0827, 80.2707, true),
-- Gujarat
('Gujarat', 'Ahmedabad', 23.0225, 72.5714, true),
-- West Bengal
('West Bengal', 'Kolkata', 22.5726, 88.3639, true),
-- Gujarat
('Gujarat', 'Surat', 21.1702, 72.8311, true),
-- Rajasthan
('Rajasthan', 'Jaipur', 26.9124, 75.7873, true),
-- Delhi
('Delhi', 'New Delhi', 28.6139, 77.2090, true);

-- Update issues RLS policies to allow municipal staff to view all issues
DROP POLICY IF EXISTS "Users can view all issues" ON public.issues;

CREATE POLICY "Citizens can view all issues" 
ON public.issues 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'citizen'
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'municipal_staff')
  )
);

-- Allow municipal staff to update any issue
CREATE POLICY "Municipal staff can update any issue" 
ON public.issues 
FOR UPDATE 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'municipal_staff')
  )
);