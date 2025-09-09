-- Check if exact_location column exists before adding
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='issues' AND column_name='exact_location') THEN
        ALTER TABLE public.issues ADD COLUMN exact_location text;
    END IF;
END $$;

-- Clear existing location data and insert comprehensive Indian data
TRUNCATE TABLE public.locations;

-- Insert all Indian states with comprehensive cities and districts
INSERT INTO public.locations (state_name, city_name, latitude, longitude, is_tier1) VALUES
-- Jharkhand (Special focus with all districts)
('Jharkhand', 'Ranchi', 23.3441, 85.3096, false),
('Jharkhand', 'Jamshedpur', 22.8046, 86.2029, false),
('Jharkhand', 'Dhanbad', 23.7957, 86.4304, false),
('Jharkhand', 'Bokaro', 23.6693, 86.1511, false),
('Jharkhand', 'Deoghar', 24.4823, 86.6943, false),
('Jharkhand', 'Hazaribagh', 23.9929, 85.3594, false),
('Jharkhand', 'Giridih', 24.1918, 86.3049, false),
('Jharkhand', 'Ramgarh', 23.6307, 85.5108, false),
('Jharkhand', 'Medininagar', 24.0175, 84.0736, false),
('Jharkhand', 'Chatra', 24.2069, 84.8728, false),
('Jharkhand', 'Gumla', 23.0431, 84.5414, false),
('Jharkhand', 'Simdega', 22.6171, 84.5131, false),
('Jharkhand', 'Chaibasa', 22.5541, 85.8025, false),
('Jharkhand', 'Saraikela', 22.7000, 85.9167, false),
('Jharkhand', 'Khunti', 23.0717, 85.2785, false),
('Jharkhand', 'Garhwa', 24.1394, 83.8053, false),
('Jharkhand', 'Latehar', 23.7441, 84.4999, false),
('Jharkhand', 'Dumka', 24.2676, 87.2497, false),
('Jharkhand', 'Jamtara', 23.9628, 86.8065, false),
('Jharkhand', 'Sahibganj', 25.2502, 87.6464, false),
('Jharkhand', 'Pakur', 24.6333, 87.8500, false),
('Jharkhand', 'Godda', 24.8267, 87.2142, false),
('Jharkhand', 'Koderma', 24.4681, 85.5996, false),

-- Other major states
('Maharashtra', 'Mumbai', 19.0760, 72.8777, true),
('Maharashtra', 'Pune', 18.5204, 73.8567, true),
('Maharashtra', 'Nagpur', 21.1458, 79.0882, true),
('Maharashtra', 'Thane', 19.2183, 72.9781, true),
('Maharashtra', 'Nashik', 19.9975, 73.7898, false),

('Karnataka', 'Bangalore', 12.9716, 77.5946, true),
('Karnataka', 'Mysore', 12.2958, 76.6394, false),
('Karnataka', 'Hubli', 15.3647, 75.1240, false),

('Tamil Nadu', 'Chennai', 13.0827, 80.2707, true),
('Tamil Nadu', 'Coimbatore', 11.0168, 76.9558, true),
('Tamil Nadu', 'Madurai', 9.9252, 78.1198, false),

('Telangana', 'Hyderabad', 17.3850, 78.4867, true),
('Telangana', 'Warangal', 17.9689, 79.5941, false),

('Gujarat', 'Ahmedabad', 23.0225, 72.5714, true),
('Gujarat', 'Surat', 21.1702, 72.8311, true),
('Gujarat', 'Vadodara', 22.3072, 73.1812, false),

('West Bengal', 'Kolkata', 22.5726, 88.3639, true),
('West Bengal', 'Howrah', 22.5958, 88.2636, false),

('Rajasthan', 'Jaipur', 26.9124, 75.7873, true),
('Rajasthan', 'Jodhpur', 26.2389, 73.0243, false),

('Uttar Pradesh', 'Lucknow', 26.8467, 80.9462, true),
('Uttar Pradesh', 'Kanpur', 26.4499, 80.3319, true),

('Delhi', 'New Delhi', 28.6139, 77.2090, true),
('Delhi', 'Delhi', 28.7041, 77.1025, true),

('Punjab', 'Ludhiana', 30.9010, 75.8573, true),
('Punjab', 'Amritsar', 31.6340, 74.8723, false),

('Haryana', 'Gurugram', 28.4595, 77.0266, true),
('Haryana', 'Faridabad', 28.4089, 77.3178, true),

('Kerala', 'Kochi', 9.9312, 76.2673, true),
('Kerala', 'Thiruvananthapuram', 8.5241, 76.9366, false),

('Madhya Pradesh', 'Indore', 22.7196, 75.8577, true),
('Madhya Pradesh', 'Bhopal', 23.2599, 77.4126, false),

('Andhra Pradesh', 'Visakhapatnam', 17.6868, 83.2185, true),
('Andhra Pradesh', 'Vijayawada', 16.5062, 80.6480, true),

('Assam', 'Guwahati', 26.1445, 91.7362, true),
('Bihar', 'Patna', 25.5941, 85.1376, true),
('Chhattisgarh', 'Raipur', 21.2514, 81.6296, false),
('Goa', 'Panaji', 15.4909, 73.8278, false),
('Himachal Pradesh', 'Shimla', 31.1048, 77.1734, false),
('Jammu and Kashmir', 'Srinagar', 34.0837, 74.7973, false),
('Odisha', 'Bhubaneswar', 20.2961, 85.8245, false),
('Uttarakhand', 'Dehradun', 30.3165, 78.0322, false);

-- Create storage bucket for issue documents/photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('issue-documents', 'issue-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for issue documents
CREATE POLICY "Users can upload their own issue documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'issue-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view issue documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'issue-documents');