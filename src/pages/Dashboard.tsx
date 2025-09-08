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
  const { user, loading: authLoading } = useAuth();
  const { issues, loading: issuesLoading, createIssue } = useIssues();

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
  }) => {
    await createIssue(issueData);
  };

  const filteredIssues = statusFilter === 'all' 
    ? issues 
    : issues.filter(issue => issue.status === statusFilter);

  return (
    <div className="min-h-screen">
      <Header onFilterChange={setStatusFilter} currentFilter={statusFilter} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <HeroSection />
        
        <IssueForm onSubmit={handleIssueSubmit} />
        
        <IssuesList issues={filteredIssues} />
      </main>
    </div>
  );
};

export default Dashboard;