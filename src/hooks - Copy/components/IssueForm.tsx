import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Send } from 'lucide-react';

interface IssueFormProps {
  onSubmit: (issueData: {
    title: string;
    description: string;
    image_url?: string;
  }) => void;
}

export const IssueForm = ({ onSubmit }: IssueFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate image upload - in real app, this would upload to storage
      const fakeUrl = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=300&fit=crop`;
      setImageUrl(fakeUrl);
    }
  };

  return (
    <Card className="shadow-medium gradient-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">Report an Issue</CardTitle>
        <CardDescription>
          Help improve your community by reporting civic issues
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
              className="transition-smooth focus:shadow-soft"
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
              className="transition-smooth focus:shadow-soft"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Add a Photo</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="transition-smooth"
              />
              <Camera className="w-5 h-5 text-muted-foreground" />
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-medium"
          >
            {isLoading ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};