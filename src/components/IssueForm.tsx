import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocations } from '@/hooks/useLocations';
import { Upload, MapPin } from 'lucide-react';

interface IssueFormProps {
  onSubmit: (issue: {
    title: string;
    description: string;
    image_url?: string;
    state?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}

export const IssueForm = ({ onSubmit }: IssueFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { states, getCitiesForState, getLocationByCity, loading: locationsLoading } = useLocations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const location = getLocationByCity(selectedCity);
      await onSubmit({
        title,
        description,
        image_url: imageUrl || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setSelectedState('');
      setSelectedCity('');
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity(''); // Reset city when state changes
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
                  onValueChange={setSelectedCity} 
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
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Issue preview"
                    className="w-full max-w-sm h-48 object-cover rounded-md border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Submitting...' : 'Report Issue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};