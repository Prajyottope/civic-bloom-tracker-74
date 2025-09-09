import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { IssueForm } from '@/components/IssueForm';
import { IssuesList } from '@/components/IssuesList';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';

const Dashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>();
  const [selectedCity, setSelectedCity] = useState<string>();
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
  }) => {
    await createIssue(issueData);
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
        
        <IssueForm onSubmit={handleIssueSubmit} />
        
        <IssuesList issues={filteredIssues} />
      </main>
    </div>
  );
};

export default Dashboard;