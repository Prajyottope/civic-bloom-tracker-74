import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  image_url?: string;
  user_id: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIssues = async (filters?: {
    status?: string;
    state?: string;
    city?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.state) {
        query = query.eq('state', filters.state);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      const { data, error } = await query;

      if (error) throw error;
      setIssues(data as Issue[] || []);
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

  const createIssue = async (issueData: {
    title: string;
    description: string;
    image_url?: string;
    state?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    exact_location?: string;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('issues')
        .insert([{
          ...issueData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setIssues(prev => [data as Issue, ...prev]);
      toast({
        title: "Issue Reported!",
        description: "Your issue has been successfully submitted.",
      });
    } catch (error: any) {
      toast({
        title: "Error Creating Issue",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateIssueStatus = async (issueId: string, status: 'pending' | 'in_progress' | 'resolved') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('issues')
        .update({ status })
        .eq('id', issueId)
        .select()
        .single();

      if (error) throw error;

      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, status } : issue
      ));
      
      toast({
        title: "Issue Updated!",
        description: `Issue status changed to ${status.replace('_', ' ')}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error Updating Issue",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  return {
    issues,
    loading,
    createIssue,
    updateIssueStatus,
    fetchIssues,
    refetch: fetchIssues,
  };
}