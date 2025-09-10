-- Add Andhra Pradesh districts and cities to locations table
INSERT INTO public.locations (state_name, city_name, latitude, longitude, is_tier1) VALUES
-- Andhra Pradesh Major Cities and Districts
('Andhra Pradesh', 'Visakhapatnam', 17.6868, 83.2185, true),
('Andhra Pradesh', 'Vijayawada', 16.5062, 80.6480, true),
('Andhra Pradesh', 'Guntur', 16.3067, 80.4365, true),
('Andhra Pradesh', 'Nellore', 14.4426, 79.9865, true),
('Andhra Pradesh', 'Kurnool', 15.8281, 78.0373, true),
('Andhra Pradesh', 'Rajahmundry', 17.0005, 81.8040, true),
('Andhra Pradesh', 'Tirupati', 13.6288, 79.4192, true),
('Andhra Pradesh', 'Kakinada', 16.9891, 82.2475, true),
('Andhra Pradesh', 'Anantapur', 14.6819, 77.6006, true),
('Andhra Pradesh', 'Eluru', 16.7107, 81.0955, true),
('Andhra Pradesh', 'Ongole', 15.5057, 80.0499, false),
('Andhra Pradesh', 'Chittoor', 13.2172, 79.1003, false),
('Andhra Pradesh', 'Kadapa', 14.4673, 78.8242, false),
('Andhra Pradesh', 'Machilipatnam', 16.1877, 81.1386, false),
('Andhra Pradesh', 'Adoni', 15.6281, 77.2750, false),
('Andhra Pradesh', 'Tenali', 16.2428, 80.6514, false),
('Andhra Pradesh', 'Proddatur', 14.7504, 78.5485, false),
('Andhra Pradesh', 'Nandyal', 15.4774, 78.4836, false),
('Andhra Pradesh', 'Hindupur', 13.8283, 77.4910, false),
('Andhra Pradesh', 'Bhimavaram', 16.5449, 81.5212, false),
('Andhra Pradesh', 'Madanapalle', 13.5503, 78.5026, false),
('Andhra Pradesh', 'Guntakal', 15.1669, 77.3728, false),
('Andhra Pradesh', 'Dharmavaram', 14.4147, 77.7191, false),
('Andhra Pradesh', 'Gudivada', 16.4339, 80.9952, false),
('Andhra Pradesh', 'Narasaraopet', 16.2349, 79.9952, false),
('Andhra Pradesh', 'Tadpatri', 14.9094, 78.0002, false),
('Andhra Pradesh', 'Mangalagiri', 16.4318, 80.5653, false),
('Andhra Pradesh', 'Chilakaluripet', 16.0890, 80.1553, false),
('Andhra Pradesh', 'Yemmiganur', 15.7279, 77.4775, false),
('Andhra Pradesh', 'Kadiri', 14.1117, 78.1601, false);

-- Update profiles table to include username field
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text;

-- Update issues table to add geolocation coordinates if not exists
ALTER TABLE public.issues 
ADD COLUMN IF NOT EXISTS user_latitude numeric,
ADD COLUMN IF NOT EXISTS user_longitude numeric;