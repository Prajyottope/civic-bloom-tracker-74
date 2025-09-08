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
  created_at: string;
  updated_at: string;
}

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

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

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  return {
    issues,
    loading,
    createIssue,
    refetch: fetchIssues,
  };
}