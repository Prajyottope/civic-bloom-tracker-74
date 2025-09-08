import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Leaf, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

export const Header = ({ onFilterChange, currentFilter }: HeaderProps) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filterOptions = [
    { value: 'all', label: 'All Issues' },
    { value: 'pending', label: 'Pending Issues' },
    { value: 'in_progress', label: 'In Progress Issues' },
    { value: 'resolved', label: 'Resolved Issues' },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Clean & Green</h1>
            <p className="text-sm text-primary hidden sm:block">Technology</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {user.name}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="transition-smooth">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onFilterChange(option.value)}
                  className={currentFilter === option.value ? 'bg-muted' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};