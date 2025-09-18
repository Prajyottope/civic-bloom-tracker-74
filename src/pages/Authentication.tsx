import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Leaf } from 'lucide-react';

const Authentication = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'options'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'signup') {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        id: 'user_' + Date.now(), 
        name: 'User',
        type: 'google' 
      }));
      window.location.href = '/dashboard';
    }, 1000);
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        id: 'guest_' + Date.now(), 
        name: 'Guest User',
        type: 'guest' 
      }));
      window.location.href = '/dashboard';
    }, 500);
  };

  const renderAuthOptions = () => (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Clean & Green</CardTitle>
        <CardDescription>
          Sign in to report and track civic issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full transition-smooth hover:shadow-soft"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign In with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setAuthMode('signin')}
            disabled={loading}
          >
            Email Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => setAuthMode('signup')}
            disabled={loading}
          >
            Create Account
          </Button>
        </div>

        <Button
          size="lg"
          onClick={handleGuestSignIn}
          disabled={loading}
          className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          Continue as Guest
        </Button>
      </CardContent>
    </Card>
  );

  const renderEmailAuth = () => (
    <Card className="w-full max-w-md shadow-elegant">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          {authMode === 'signup' ? 'Create Account' : 'Sign In'}
        </CardTitle>
        <CardDescription>
          {authMode === 'signup' 
            ? 'Join us to start reporting civic issues' 
            : 'Welcome back! Sign in to continue'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setAuthMode('options')}
            className="text-sm"
          >
            ← Back to options
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      {authMode === 'options' ? renderAuthOptions() : renderEmailAuth()}
    </div>
  );
};

export default Authentication;