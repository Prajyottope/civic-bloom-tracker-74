import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { IssueForm } from '@/components/IssueForm';
import { IssuesList } from '@/components/IssuesList';
import { IssuesOverview } from '@/components/IssuesOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();
  const [showReportForm, setShowReportForm] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { issues, loading: issuesLoading, createIssue, fetchIssues } = useIssues();

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

  const handleIssueSubmit = async (issueData: {
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
  }) => {
    await createIssue(issueData);
    setShowReportForm(false); // Hide form after successful submission
  };

  const handleLocationChange = (state?: string, city?: string) => {
    setSelectedState(state);
    setSelectedCity(city);
    // Refetch issues with new filters
    fetchIssues({
      status: statusFilter === 'all' ? undefined : statusFilter,
      state,
      city
    });
  };

  const handleStatusFilterChange = (filter: string) => {
    setStatusFilter(filter);
    // Refetch issues with new filters
    fetchIssues({
      status: filter === 'all' ? undefined : filter,
      state: selectedState,
      city: selectedCity
    });
  };

  const filteredIssues = issues; // Issues are now filtered on the backend

  return (
    <div className="min-h-screen">
      <Header 
        onFilterChange={handleStatusFilterChange} 
        onLocationChange={handleLocationChange}
        currentFilter={statusFilter}
        selectedState={selectedState}
        selectedCity={selectedCity}
      />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <HeroSection />
        
        {/* Issues Overview */}
        <IssuesOverview issues={filteredIssues} />
        
        {/* Report Issue Section - Only show in "All Issues" */}
        {statusFilter === 'all' && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Report an Issue</CardTitle>
              <CardDescription>
                Help improve your community by reporting civic issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showReportForm ? (
                <div className="text-center py-8">
                  <Button
                    onClick={() => setShowReportForm(true)}
                    className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-medium px-8 py-4 text-lg"
                    size="lg"
                  >
                    Report an Issue
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowReportForm(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                  <IssueForm onSubmit={handleIssueSubmit} />
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <IssuesList issues={filteredIssues} />
      </main>
    </div>
  );
};

export default Dashboard;