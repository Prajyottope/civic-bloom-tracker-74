-- Clear existing location data and add comprehensive Indian states and districts data
TRUNCATE TABLE public.locations;

-- Insert all Indian states with major cities and districts
INSERT INTO public.locations (state_name, city_name, latitude, longitude, is_tier1) VALUES
-- Andhra Pradesh
('Andhra Pradesh', 'Visakhapatnam', 17.6868, 83.2185, true),
('Andhra Pradesh', 'Vijayawada', 16.5062, 80.6480, true),
('Andhra Pradesh', 'Guntur', 16.3067, 80.4365, false),
('Andhra Pradesh', 'Tirupati', 13.6288, 79.4192, false),

-- Arunachal Pradesh
('Arunachal Pradesh', 'Itanagar', 27.0844, 93.6053, false),
('Arunachal Pradesh', 'Naharlagun', 27.1000, 93.7000, false),

-- Assam
('Assam', 'Guwahati', 26.1445, 91.7362, true),
('Assam', 'Silchar', 24.8333, 92.7789, false),
('Assam', 'Dibrugarh', 27.4728, 94.9120, false),

-- Bihar
('Bihar', 'Patna', 25.5941, 85.1376, true),
('Bihar', 'Gaya', 24.7914, 85.0002, false),
('Bihar', 'Muzaffarpur', 26.1209, 85.3647, false),

-- Chhattisgarh
('Chhattisgarh', 'Raipur', 21.2514, 81.6296, false),
('Chhattisgarh', 'Bhilai', 21.1938, 81.3509, false),

-- Goa
('Goa', 'Panaji', 15.4909, 73.8278, false),
('Goa', 'Margao', 15.2993, 73.9626, false),

-- Gujarat
('Gujarat', 'Ahmedabad', 23.0225, 72.5714, true),
('Gujarat', 'Surat', 21.1702, 72.8311, true),
('Gujarat', 'Vadodara', 22.3072, 73.1812, false),
('Gujarat', 'Rajkot', 22.3039, 70.8022, false),

-- Haryana
('Haryana', 'Gurugram', 28.4595, 77.0266, true),
('Haryana', 'Faridabad', 28.4089, 77.3178, true),
('Haryana', 'Panipat', 29.3909, 76.9635, false),

-- Himachal Pradesh
('Himachal Pradesh', 'Shimla', 31.1048, 77.1734, false),
('Himachal Pradesh', 'Dharamshala', 32.2190, 76.3234, false),

-- Jharkhand (Special focus as requested)
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
('Jharkhand', 'Dumka', 24.2676, 87.2497, false),
('Jharkhand', 'Jamtara', 23.9628, 86.8065, false),
('Jharkhand', 'Sahibganj', 25.2502, 87.6464, false),
('Jharkhand', 'Pakur', 24.6333, 87.8500, false),
('Jharkhand', 'Godda', 24.8267, 87.2142, false),
('Jharkhand', 'Koderma', 24.4681, 85.5996, false),

-- Karnataka
('Karnataka', 'Bangalore', 12.9716, 77.5946, true),
('Karnataka', 'Mysore', 12.2958, 76.6394, false),
('Karnataka', 'Hubli', 15.3647, 75.1240, false),
('Karnataka', 'Mangalore', 12.9141, 74.8560, false),

-- Kerala
('Kerala', 'Kochi', 9.9312, 76.2673, true),
('Kerala', 'Thiruvananthapuram', 8.5241, 76.9366, false),
('Kerala', 'Kozhikode', 11.2588, 75.7804, false),

-- Madhya Pradesh
('Madhya Pradesh', 'Indore', 22.7196, 75.8577, true),
('Madhya Pradesh', 'Bhopal', 23.2599, 77.4126, false),
('Madhya Pradesh', 'Jabalpur', 23.1815, 79.9864, false),

-- Maharashtra
('Maharashtra', 'Mumbai', 19.0760, 72.8777, true),
('Maharashtra', 'Pune', 18.5204, 73.8567, true),
('Maharashtra', 'Nagpur', 21.1458, 79.0882, true),
('Maharashtra', 'Thane', 19.2183, 72.9781, true),
('Maharashtra', 'Nashik', 19.9975, 73.7898, false),

-- Manipur
('Manipur', 'Imphal', 24.8170, 93.9368, false),

-- Meghalaya
('Meghalaya', 'Shillong', 25.5788, 91.8933, false),

-- Mizoram
('Mizoram', 'Aizawl', 23.7271, 92.7176, false),

-- Nagaland
('Nagaland', 'Kohima', 25.6751, 94.1086, false),
('Nagaland', 'Dimapur', 25.9044, 93.7267, false),

-- Odisha
('Odisha', 'Bhubaneswar', 20.2961, 85.8245, false),
('Odisha', 'Cuttack', 20.4625, 85.8828, false),

-- Punjab
('Punjab', 'Ludhiana', 30.9010, 75.8573, true),
('Punjab', 'Amritsar', 31.6340, 74.8723, false),
('Punjab', 'Jalandhar', 31.3260, 75.5762, false),

-- Rajasthan
('Rajasthan', 'Jaipur', 26.9124, 75.7873, true),
('Rajasthan', 'Jodhpur', 26.2389, 73.0243, false),
('Rajasthan', 'Kota', 25.2138, 75.8648, false),

-- Sikkim
('Sikkim', 'Gangtok', 27.3389, 88.6065, false),

-- Tamil Nadu
('Tamil Nadu', 'Chennai', 13.0827, 80.2707, true),
('Tamil Nadu', 'Coimbatore', 11.0168, 76.9558, true),
('Tamil Nadu', 'Madurai', 9.9252, 78.1198, false),

-- Telangana
('Telangana', 'Hyderabad', 17.3850, 78.4867, true),
('Telangana', 'Warangal', 17.9689, 79.5941, false),

-- Tripura
('Tripura', 'Agartala', 23.8315, 91.2868, false),

-- Uttar Pradesh
('Uttar Pradesh', 'Lucknow', 26.8467, 80.9462, true),
('Uttar Pradesh', 'Kanpur', 26.4499, 80.3319, true),
('Uttar Pradesh', 'Ghaziabad', 28.6692, 77.4538, true),
('Uttar Pradesh', 'Agra', 27.1767, 78.0081, false),
('Uttar Pradesh', 'Meerut', 28.9845, 77.7064, false),
('Uttar Pradesh', 'Varanasi', 25.3176, 82.9739, false),

-- Uttarakhand
('Uttarakhand', 'Dehradun', 30.3165, 78.0322, false),
('Uttarakhand', 'Haridwar', 29.9457, 78.1642, false),

-- West Bengal
('West Bengal', 'Kolkata', 22.5726, 88.3639, true),
('West Bengal', 'Howrah', 22.5958, 88.2636, false),
('West Bengal', 'Durgapur', 23.5204, 87.3119, false),

-- Union Territories
('Delhi', 'New Delhi', 28.6139, 77.2090, true),
('Delhi', 'Delhi', 28.7041, 77.1025, true),

('Puducherry', 'Puducherry', 11.9416, 79.8083, false),
('Chandigarh', 'Chandigarh', 30.7333, 76.7794, false),
('Jammu and Kashmir', 'Srinagar', 34.0837, 74.7973, false),
('Jammu and Kashmir', 'Jammu', 32.7266, 74.8570, false),
('Ladakh', 'Leh', 34.1526, 77.5770, false),
('Andaman and Nicobar Islands', 'Port Blair', 11.6234, 92.7265, false);