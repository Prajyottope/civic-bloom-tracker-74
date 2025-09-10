import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Shield, Filter, LogOut, MoreVertical, Settings, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LocationFilter } from './LocationFilter';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  onFilterChange: (filter: string) => void;
  onLocationChange: (state?: string, city?: string) => void;
  currentFilter: string;
  selectedState?: string;
  selectedCity?: string;
}

export const Header = ({ 
  onFilterChange, 
  onLocationChange, 
  currentFilter, 
  selectedState, 
  selectedCity 
}: HeaderProps) => {
  const { user, signOut } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const { count } = await supabase
        .from('issues')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingCount(count || 0);
    };

    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('username, display_name')
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchPendingCount();
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  const filterOptions = [
    { value: 'all', label: 'All Issues' },
    { value: 'pending', label: `Pending Issues ${pendingCount > 0 ? `(${pendingCount})` : ''}` },
    { value: 'in_progress', label: 'In Progress Issues' },
    { value: 'resolved', label: 'Resolved Issues' },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Clean & Green</h1>
            <p className="text-sm text-primary hidden sm:block">Community Issues</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <LocationFilter 
            onLocationChange={onLocationChange}
            selectedState={selectedState}
            selectedCity={selectedCity}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="transition-smooth">
                <Filter className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={currentFilter === option.value ? 'bg-muted' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                Welcome, {userProfile?.username || userProfile?.display_name || user.email?.split('@')[0]}
              </p>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="transition-smooth">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/municipal-dashboard" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Municipal Dashboard
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              {user && (
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};