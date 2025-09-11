import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useMunicipalAuth } from '@/hooks/useMunicipalAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Clock, CheckCircle, XCircle, AlertCircle, LogOut, User, Phone, Mail, MapPin, Calendar, Image } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  image_url?: string;
  state?: string;
  city?: string;
  exact_location?: string;
  contact_phone?: string;
  contact_email?: string;
  assigned_team_id?: string;
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
  profiles?: {
    username?: string;
    display_name?: string;
  };
}

const MunicipalDashboard = () => {
  const { session, loading: authLoading, signOut } = useMunicipalAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      fetchIssues();
    }
  }, [session, activeTab]);

  const fetchIssues = async () => {
    if (!session) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('issues')
        .select('*')
        .eq('assigned_team_id', session.team.id)
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab === 'pending' ? 'pending' : activeTab === 'progress' ? 'in_progress' : 'resolved');
      }

      const { data, error } = await query;
      if (error) throw error;
      setIssues(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Issues",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId: string, newStatus: 'pending' | 'in_progress' | 'resolved', notes?: string) => {
    setProcessingAction(true);
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolution_notes = notes;
      }

      const { error } = await supabase
        .from('issues')
        .update(updateData)
        .eq('id', issueId);

      if (error) throw error;

      // Send email notification
      const issue = issues.find(i => i.id === issueId);
      if (issue && issue.contact_email) {
        await sendStatusEmail(issue, newStatus);
      }

      toast({
        title: "Status Updated",
        description: `Issue marked as ${newStatus.replace('_', ' ')}`,
      });

      fetchIssues();
      setSelectedIssue(null);
      setResolutionNotes('');
    } catch (error: any) {
      toast({
        title: "Error Updating Status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingAction(false);
    }
  };

  const sendStatusEmail = async (issue: Issue, status: string) => {
    try {
      const emailType = status === 'resolved' ? 'resolution_request' : 'status_update';
      const subject = status === 'resolved' 
        ? `Issue Resolved - Please Confirm: ${issue.title}`
        : `Issue Status Update: ${issue.title}`;

      await supabase.functions.invoke('send-notification-email', {
        body: {
          to: issue.contact_email,
          subject,
          type: emailType,
          issueTitle: issue.title,
          status: status.replace('_', ' ')
        }
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/municipal-login" replace />;
  }

  const getFilteredIssues = () => {
    switch (activeTab) {
      case 'pending': return issues.filter(i => i.status === 'pending');
      case 'progress': return issues.filter(i => i.status === 'in_progress');
      case 'resolved': return issues.filter(i => i.status === 'resolved');
      default: return issues;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Municipal Dashboard</h1>
              <p className="text-sm text-muted-foreground">{session.team.team_name} - {session.team.city_name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/municipal-profile">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Issue Management</h2>
          <p className="text-muted-foreground">Manage and track community issues assigned to your team</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="pending">Reported Issues</TabsTrigger>
            <TabsTrigger value="progress">In Progress Issues</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Issues</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading issues...</p>
              </div>
            ) : getFilteredIssues().length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No issues found in this category</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {getFilteredIssues().map((issue) => (
                  <Card key={issue.id} className="shadow-soft">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{issue.title}</CardTitle>
                          <CardDescription className="mt-2">
                            Reported by User
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(issue.priority)} variant="outline">
                            {issue.priority}
                          </Badge>
                          <Badge className={getStatusColor(issue.status)} variant="outline">
                            {getStatusIcon(issue.status)}
                            <span className="ml-1 capitalize">{issue.status.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        
                        {issue.image_url && (
                          <div className="w-full max-w-md">
                            <img 
                              src={issue.image_url} 
                              alt="Issue photo"
                              className="w-full h-48 object-cover rounded-md border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{issue.city}, {issue.state}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                          </div>
                          {issue.contact_phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              <span>{issue.contact_phone}</span>
                            </div>
                          )}
                          {issue.contact_email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              <span>{issue.contact_email}</span>
                            </div>
                          )}
                        </div>

                        {issue.exact_location && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Location Details:</strong> {issue.exact_location}
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          {issue.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                                disabled={processingAction}
                              >
                                Accept & Start Work
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateIssueStatus(issue.id, 'pending')}
                                disabled={processingAction}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {issue.status === 'in_progress' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => setSelectedIssue(issue)}
                                >
                                  Mark as Resolved
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Mark Issue as Resolved</DialogTitle>
                                  <DialogDescription>
                                    Please provide resolution notes for: {issue.title}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="resolution-notes">Resolution Notes</Label>
                                    <Textarea
                                      id="resolution-notes"
                                      placeholder="Describe what was done to resolve this issue..."
                                      value={resolutionNotes}
                                      onChange={(e) => setResolutionNotes(e.target.value)}
                                      rows={4}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => updateIssueStatus(issue.id, 'resolved', resolutionNotes)}
                                    disabled={processingAction}
                                  >
                                    {processingAction ? 'Processing...' : 'Mark as Resolved'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}

                          {issue.status === 'resolved' && issue.resolution_notes && (
                            <div className="text-sm text-green-600">
                              <strong>Resolution:</strong> {issue.resolution_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MunicipalDashboard;