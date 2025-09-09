import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';

const MunicipalDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [userRole, setUserRole] = useState<string>('citizen');
  const { user, loading: authLoading } = useAuth();
  const { issues, loading: issuesLoading, fetchIssues, updateIssueStatus } = useIssues();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserRole(data.role || 'citizen');
        }
      }
    };

    fetchUserRole();
  }, [user]);

  if (authLoading || issuesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has admin or municipal_staff role
  if (userRole === 'citizen') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need municipal staff or admin privileges to access this dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLocationChange = (state?: string, city?: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    fetchIssues({
      status: statusFilter === 'all' ? undefined : statusFilter,
      state,
      city
    });
  };

  const handleStatusFilterChange = (filter: string) => {
    setStatusFilter(filter);
    fetchIssues({
      status: filter === 'all' ? undefined : filter,
      state: selectedState,
      city: selectedCity
    });
  };

  const handleStatusUpdate = async (issueId: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    await updateIssueStatus(issueId, newStatus);
    // Refetch issues to update the list
    fetchIssues({
      status: statusFilter === 'all' ? undefined : statusFilter,
      state: selectedState,
      city: selectedCity
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const stats = {
    total: issues.length,
    pending: issues.filter(issue => issue.status === 'pending').length,
    inProgress: issues.filter(issue => issue.status === 'in_progress').length,
    resolved: issues.filter(issue => issue.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onFilterChange={handleStatusFilterChange} 
        onLocationChange={handleLocationChange}
        currentFilter={statusFilter}
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Municipal Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track community issues
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Issues Management</h2>
          
          {issues.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No issues found matching your filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {issues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">{issue.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`flex items-center gap-1 ${getStatusColor(issue.status)}`}
                          >
                            {getStatusIcon(issue.status)}
                            {getStatusLabel(issue.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground">{issue.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          {issue.city && issue.state && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{issue.city}, {issue.state}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {issue.image_url && (
                          <div className="mt-3">
                            <img 
                              src={issue.image_url} 
                              alt="Issue"
                              className="max-w-xs h-32 object-cover rounded-md border"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {issue.status !== 'in_progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(issue.id, 'in_progress')}
                          >
                            Mark In Progress
                          </Button>
                        )}
                        {issue.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleStatusUpdate(issue.id, 'resolved')}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {issue.status !== 'pending' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleStatusUpdate(issue.id, 'pending')}
                          >
                            Mark Pending
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MunicipalDashboard;