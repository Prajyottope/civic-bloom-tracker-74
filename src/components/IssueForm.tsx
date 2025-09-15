import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocations } from '@/hooks/useLocations';
import { Upload, MapPin, Camera, Paperclip, Crosshair, Phone, Mail, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/hooks/useAuth';

interface IssueFormProps {
  onSubmit: (issue: {
    title: string;
    description: string;
    image_url?: string;
    state?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    exact_location?: string;
    user_latitude?: number;
    user_longitude?: number;
    priority?: string;
    contact_phone?: string;
    contact_email?: string;
    assigned_team_id?: string;
  }) => void;
}

export const IssueForm = ({ onSubmit }: IssueFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { states, getCitiesForState, getLocationByCity, loading: locationsLoading } = useLocations();
  const { data: geolocationData, loading: geoLoading, getCurrentLocation, clearLocation } = useGeolocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return '';

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('issue-documents')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('issue-documents')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setImageUrl(previewUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = '';
      
      // Upload file if selected
      if (selectedFile) {
        uploadedImageUrl = await handleFileUpload(selectedFile);
      }

      const location = getLocationByCity(selectedCity);
      await onSubmit({
        title,
        description,
        image_url: uploadedImageUrl || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
        latitude: location?.latitude,
        longitude: location?.longitude,
        exact_location: exactLocation || undefined,
        user_latitude: geolocationData?.latitude,
        user_longitude: geolocationData?.longitude,
        priority: priority || undefined,
        contact_phone: contactPhone || undefined,
        contact_email: contactEmail || user?.email || undefined,
        assigned_team_id: selectedTeam || undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setImageUrl('');
      setSelectedState('');
      setSelectedCity('');
      setExactLocation('');
      setPriority('medium');
      setContactPhone('');
      setContactEmail('');
      setSelectedTeam('');
      clearLocation();
    } finally {
      setLoading(false);
    }
  };

  // Fetch teams when city changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedCity) {
        setAvailableTeams([]);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('municipal_teams')
          .select('*')
          .eq('city_name', selectedCity);
          
        if (error) throw error;
        setAvailableTeams(data || []);
      } catch (error) {
        setAvailableTeams([]);
      }
    };
    
    fetchTeams();
  }, [selectedCity]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(''); // Reset city when state changes
    setSelectedTeam(''); // Reset team when state changes
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedTeam(''); // Reset team when city changes
  };

  const availableCities = selectedState ? getCitiesForState(selectedState) : [];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <MapPin className="h-6 w-6 text-primary" />
            Report an Issue
          </CardTitle>
          <CardDescription>
            Help improve your community by reporting civic issues in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                placeholder="e.g., Pothole on Main Street"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      Medium Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      Critical Priority
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={selectedState} onValueChange={handleStateChange} disabled={locationsLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select 
                  value={selectedCity} 
                  onValueChange={handleCityChange} 
                  disabled={!selectedState || locationsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="exact-location">Exact Location (Optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={geoLoading}
                  className="flex items-center gap-2"
                >
                  <Crosshair className="h-4 w-4" />
                  {geoLoading ? 'Getting Location...' : 'Use Live Location'}
                </Button>
              </div>
              <Textarea
                id="exact-location"
                placeholder="Describe the exact location or address of the issue..."
                rows={2}
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
              />
              {geolocationData && (
                <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Live location captured ({geolocationData.latitude.toFixed(6)}, {geolocationData.longitude.toFixed(6)})
                </div>
              )}
            </div>

            {availableTeams.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="team">Assign to Team</Label>
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.team_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="Your email address"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Photo/Document (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="document"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('document')?.click()}
                  className="flex items-center gap-2"
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Photo/Document'}
                </Button>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Paperclip className="h-3 w-3" />
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {imageUrl && selectedFile?.type.startsWith('image/') && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Issue preview"
                    className="w-full max-w-sm h-48 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Submitting...' : uploading ? 'Processing...' : 'Report Issue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};