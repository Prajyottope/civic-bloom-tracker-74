import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Leaf } from 'lucide-react';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        id: 'user_123', 
        name: '@prajyot',
        type: 'google' 
      }));
      toast({
        title: "Welcome!",
        description: "Signed in successfully with Google.",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    // Simulate guest authentication
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        id: 'guest_' + Date.now(), 
        name: 'Guest User',
        type: 'guest' 
      }));
      toast({
        title: "Welcome Guest!",
        description: "You're now signed in as a guest.",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-medium gradient-card">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Clean and Green Technology</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to report and track issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full transition-smooth hover:shadow-soft"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Sign In with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleGuestSignIn}
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth shadow-soft"
          >
            {isLoading ? 'Signing in...' : 'Sign In as a Guest'}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-primary hover:text-primary-glow font-semibold transition-smooth"
            >
              Back to Homepage
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;