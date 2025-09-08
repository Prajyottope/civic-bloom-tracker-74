import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User } from 'lucide-react';
import type { Issue } from '@/pages/Dashboard';

interface IssuesListProps {
  issues: Issue[];
}

export const IssuesList = ({ issues }: IssuesListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'in_progress':
        return 'bg-accent text-accent-foreground';
      case 'resolved':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  if (issues.length === 0) {
    return (
      <section className="text-center py-16">
        <h2 className="text-2xl font-bold text-foreground mb-4">Recently Reported Issues</h2>
        <div className="bg-muted/50 rounded-xl p-12">
          <p className="text-muted-foreground text-lg">No issues found. Be the first to report one!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        Recently Reported Issues
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <Card key={issue.id} className="shadow-soft gradient-card transition-smooth hover:shadow-medium">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg font-bold text-foreground leading-tight">
                  {issue.title}
                </CardTitle>
                <Badge className={getStatusColor(issue.status)}>
                  {getStatusLabel(issue.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                {issue.description}
              </CardDescription>
              
              {issue.imageUrl && (
                <img
                  src={issue.imageUrl}
                  alt="Issue"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{issue.userId.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{issue.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};