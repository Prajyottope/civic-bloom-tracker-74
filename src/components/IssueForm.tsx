import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocations } from '@/hooks/useLocations';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Upload, MapPin, Camera, FileImage, X } from 'lucide-react';

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
  }) => void;
}

export const IssueForm = ({ onSubmit }: IssueFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { states, getCitiesForState, getLocationByCity, loading: locationsLoading } = useLocations();
  const { uploadFile, openFileSelector, openCamera, uploading } = useFileUpload();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const location = getLocationByCity(selectedCity);
      await onSubmit({
        title,
        description,
        image_url: uploadedFile || undefined,
        state: selectedState || undefined,
        city: selectedCity || undefined,
        latitude: location?.latitude,
        longitude: location?.longitude,
        exact_location: exactLocation || undefined,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setExactLocation('');
      setUploadedFile('');
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

  const handleFileUpload = async (type: 'camera' | 'gallery') => {
    try {
      const file = type === 'camera' ? await openCamera() : await openFileSelector();
      if (file) {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          setUploadedFile(uploadedUrl);
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const removeFile = () => {
    setUploadedFile('');
  };

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
              <Label htmlFor="exact-location">Exact Location (Optional)</Label>
              <Textarea
                id="exact-location"
                placeholder="e.g., Near City Mall, Main Road, Landmark details..."
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-4">
              <Label>Photo/Document (Optional)</Label>
              
              {!uploadedFile ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleFileUpload('camera')}
                    disabled={uploading}
                    className="h-24 flex-col gap-2"
                  >
                    <Camera className="h-8 w-8" />
                    {uploading ? 'Uploading...' : 'Take Photo'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleFileUpload('gallery')}
                    disabled={uploading}
                    className="h-24 flex-col gap-2"
                  >
                    <FileImage className="h-8 w-8" />
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {uploadedFile.startsWith('data:image') ? (
                    <img
                      src={uploadedFile}
                      alt="Uploaded issue"
                      className="w-full max-w-sm h-48 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-full max-w-sm h-24 border rounded-md flex items-center justify-center bg-muted">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Document uploaded</span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeFile}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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