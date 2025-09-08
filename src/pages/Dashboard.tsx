import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { IssueForm } from '@/components/IssueForm';
import { IssuesList } from '@/components/IssuesList';
import { useToast } from '@/hooks/use-toast';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Date;
  userId: string;
  imageUrl?: string;
}

const Dashboard = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    // Load issues from localStorage
    const savedIssues = localStorage.getItem('cleanGreenIssues');
    if (savedIssues) {
      const parsedIssues = JSON.parse(savedIssues).map((issue: any) => ({
        ...issue,
        createdAt: new Date(issue.createdAt)
      }));
      setIssues(parsedIssues);
    }
  }, []);

  const handleIssueSubmit = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'userId'>) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newIssue: Issue = {
      id: 'issue_' + Date.now(),
      ...issueData,
      createdAt: new Date(),
      userId: user.id || 'anonymous',
      status: 'pending'
    };

    const updatedIssues = [newIssue, ...issues];
    setIssues(updatedIssues);
    localStorage.setItem('cleanGreenIssues', JSON.stringify(updatedIssues));

    toast({
      title: "Issue Reported!",
      description: "Your issue has been successfully submitted.",
    });
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