import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, FileText, MapPin } from 'lucide-react';
import { useIssues } from '@/hooks/useIssues';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  username: string;
  phone: string;
  role: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { issues } = useIssues();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Get user's own issues
  const userIssues = issues.filter(issue => issue.user_id === user?.id);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error Loading Profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile || !user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          display_name: profile.display_name,
          phone: profile.phone,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'resolved': return 'bg-green-500/10 text-green-700 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p>Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile?.username || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, username: e.target.value} : null)}
                disabled={!isEditing}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={profile?.display_name || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, display_name: e.target.value} : null)}
                disabled={!isEditing}
                placeholder="Enter your display name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email || user.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile?.phone || ''}
                onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label>Role</Label>
              <Badge variant="outline" className="ml-2">
                {profile?.role || 'citizen'}
              </Badge>
            </div>

            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={updateProfile} disabled={updating}>
                    {updating ? 'Updating...' : 'Save Changes'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile(); // Reset to original values
                    }} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Issues Reported</span>
                <Badge variant="outline">{userIssues.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Pending Issues</span>
                <Badge className={getStatusColor('pending')}>
                  {userIssues.filter(issue => issue.status === 'pending').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>In Progress Issues</span>
                <Badge className={getStatusColor('in_progress')}>
                  {userIssues.filter(issue => issue.status === 'in_progress').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Resolved Issues</span>
                <Badge className={getStatusColor('resolved')}>
                  {userIssues.filter(issue => issue.status === 'resolved').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User's Issues */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Reported Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userIssues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              You haven't reported any issues yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userIssues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{issue.title}</h3>
                    <Badge className={getStatusColor(issue.status)}>
                      {getStatusLabel(issue.status)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {issue.state && issue.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{issue.city}, {issue.state}</span>
                      </div>
                    )}
                    <span>
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {issue.image_url && (
                    <div>
                      <img
                        src={issue.image_url}
                        alt="Issue"
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;